import { promisify } from 'util';
import { DatabaseClient } from '../connection';

const hdbext = require('@sap/hdbext');

export abstract class ProcedureRepository {
  public promisifiedExecutableProcedure: any;

  public constructor(readonly databaseClient: DatabaseClient) { }

  /*
  * This function loads the procedure from the database.
  */
  public async getProcedure() {
    if (!this.promisifiedExecutableProcedure) {
      try {
        const databaseClient = await this.databaseClient.getConnection();
        const promiseProcedureStatement = promisify(hdbext.loadProcedure);
        const executableProcedure = await promiseProcedureStatement(databaseClient, null, this.procedureName);
        this.promisifiedExecutableProcedure = this.multiResultPromisify(executableProcedure);
      } catch (error) {
        console.log('Error loading procedure', error);
      }
    }

    return this.promisifiedExecutableProcedure;
  }

  /*
  * 'promisify()' converts callbacks to Promise when callback has only one result
  * This function takes a callback function with multiple results as input. And converts it to promise.
  * Multiple results are returned as an array
  */
  public multiResultPromisify(func: any): Function {
    return ((...argument: any) => new Promise((resolve, reject) => {
      func(...argument, (error: any, ...result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }));
  }

  abstract get procedureName(): string;
}
