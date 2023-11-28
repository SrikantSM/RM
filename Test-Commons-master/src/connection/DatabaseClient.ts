import { promisify } from 'util';
import Debug from 'debug';
import { StatementExecutor, AsyncQueue } from '../utils';
import { CloudFoundryClient } from './CloudFoundryClient';
import { ServiceManagerClient } from './ServiceManagerClient';

const debug = Debug('tc:sql');

const hdb = require('@sap/hdbext');
const cls = require('node-cls');

export class DatabaseClient implements StatementExecutor {
  private databaseConnection?: Promise<any>;

  private asyncQueue: AsyncQueue = new AsyncQueue();

  public constructor(private readonly cloudFoundryClient: CloudFoundryClient, private readonly appName: string, private readonly tenantId?: string, private readonly hdiUser: Boolean = false) { }

  public async getConnection(): Promise<any> {
    if (!this.databaseConnection) {
      this.databaseConnection = this.createConnection();
    }

    return this.databaseConnection;
  }

  private async createConnection(autoCommit: Boolean = true): Promise<any> {
    const cfAccessTokenResponse = await this.cloudFoundryClient.getAccessToken();
    const appGuid = await this.cloudFoundryClient.getAppGuid(cfAccessTokenResponse, this.appName);
    const appEnvironment = await this.cloudFoundryClient.getAppEnvironment(cfAccessTokenResponse, appGuid);
    const tenantId = this.tenantId || await this.cloudFoundryClient.getOwnTenantId(appEnvironment);

    let hanaCredentials;
    const serviceManagerCredentials = await ServiceManagerClient.getServiceManagerCredentials(appEnvironment);

    if (serviceManagerCredentials) {
      const serviceManagerAccessToken = await ServiceManagerClient.getAccessToken(serviceManagerCredentials);
      hanaCredentials = await ServiceManagerClient.getHanaCredentialsForTenant(serviceManagerAccessToken, serviceManagerCredentials, tenantId);
    } else {
      hanaCredentials = await this.cloudFoundryClient.getHanaCredentials(appEnvironment);
    }

    if (this.hdiUser) {
      hanaCredentials.user = hanaCredentials.hdi_user;
      hanaCredentials.password = hanaCredentials.hdi_password;
      hanaCredentials.schema += '#DI';
    }

    hanaCredentials.autoCommit = autoCommit;

    // Necessary changes to work locally as described in https://github.wdf.sap.corp/xs2/hdideploy.js/issues/533
    if (process.platform === 'win32') {
      delete hanaCredentials.certificate;
      hanaCredentials.encrypt = true;
    }

    const createConnectionPromisfied = promisify(hdb.createConnection);
    return createConnectionPromisfied(hanaCredentials);
  }

  public async execute(statement: string): Promise<any> {
    const connection = cls.get('tx')?.connection || await this.getConnection();
    debug('execute: %s', statement);
    return this.asyncQueue.executeQueuedIfNecessary(() => connection.exec(statement));
  }

  public async prepare(statement: string): Promise<any> {
    const connection = cls.get('tx')?.connection || await this.getConnection();
    debug('prepare: %s', statement);
    return this.asyncQueue.executeQueuedIfNecessary(() => connection.prepare(statement));
  }

  /**
   * Call a stored procedure
   * @param {string} name Name of the stored procedure
   * @param {any} parameters Parameters, either as array or as object (compare https://www.npmjs.com/package/@sap/hdbext `loadProcedure`)
   * @returns {any[]} array of outgoing parameters of the stored procedure
   */
  public async call(name: string, parameters: any): Promise<any[]> {
    const connection = cls.get('tx')?.connection || await this.getConnection();
    return this.asyncQueue.executeQueuedIfNecessary(async () => {
      debug('load: %s', name);
      const sp = await promisify(hdb.loadProcedure)(connection, null, name);
      return new Promise((resolve, reject) => {
        debug('call: %s %O', name, parameters);
        sp(parameters, (err: any, ...out: any[]) => {
          if (err) reject(err);
          else resolve(out);
        });
      });
    });
  }

  /**
   * Execute statements within a transaction
   *
   * Usage:
   *
   *   await this.databaseClient.tx(() => {
   *     await this.skillRepo.insertMany();
   *     await this.profiRepo.insertMany();
   *   });
   * @param {Function} task Function to be executed within the transaction context
   * @returns {Promise} Promise
   */
  public async tx<T>(task: () => Promise<T>): Promise<T> {
    debug('begin transaction');

    // create context, so only things within task() use the non-commiting connection
    const connection = await this.createConnection(false);
    const context = cls.create('tx');
    context.connection = connection;
    await context.start();

    try {
      // try to execute task, commit, close context, return task result
      const result = await task();
      await this.execute('COMMIT;');
      cls.exit('tx');
      debug('committed transaction');
      return result;
    } catch (e) {
      // on failure: rollback and rethrow error
      await this.execute('ROLLBACK;');
      cls.exit('tx');
      debug('rolled back transaction');
      throw e;
    }
  }
}
