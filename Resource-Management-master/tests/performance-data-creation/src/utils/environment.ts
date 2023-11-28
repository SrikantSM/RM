import { exists as existsAsync, readFile as readFileAsync } from 'fs';
import { promisify } from 'util';
import { IEnvironment } from 'test-commons';

const exists = promisify(existsAsync);
const readFile = promisify(readFileAsync);

const LANDSCAPE = 'PERF_TESTDATA_LANDSCAPE';
const SPACE_GUID = 'PERF_TESTDATA_SPACE_GUID';
const SRV_APP_NAME = 'PERF_TESTDATA_SRV_APP_NAME';
const CF_USER = 'ENV_CF_USER_DEV';
const CF_PASSWORD = 'ENV_CF_PASSWORD_DEV';
const BATCH_RANGE = 'PERF_TESTDATA_BATCH_RANGE';
const ASGN_CREATE_BY_API = 'PERF_TESTDATA_ASGN_CREATE_BY_API';
const ASGN_BATCH_SIZE = 'PERF_TESTDATA_ASGN_BATCH_SIZE';
const TENANT_ID = 'PERF_TESTDATA_TENANT_ID';

export class Environment implements IEnvironment {
  private environmentVariables!: Map<string, string | undefined>;

  private constructor(private readonly defaultEnvFileName: string) { }

  public static async createInstance(
    defaultEnvFileName: string,
  ): Promise<Environment> {
    const environmentInstance = new Environment(defaultEnvFileName);
    environmentInstance.environmentVariables = new Map(Object.entries(process.env));

    if (await exists(environmentInstance.defaultEnvFileName)) {
      const defaultEnv = JSON.parse(
        await readFile(environmentInstance.defaultEnvFileName, 'utf-8'),
      );

      for (const [key, value] of Object.entries(defaultEnv)) {
        if (!environmentInstance.environmentVariables.has(key)) {
          environmentInstance.environmentVariables.set(key, value as string);
        }
      }
    }

    return environmentInstance;
  }

  public get landscape(): string {
    return this.environmentVariables.get(LANDSCAPE) || '';
  }

  public get spaceGuid(): string {
    return this.environmentVariables.get(SPACE_GUID) || '';
  }

  public get srvAppName(): string {
    return this.environmentVariables.get(SRV_APP_NAME) || '';
  }

  public get cfUser(): string {
    return this.environmentVariables.get(CF_USER) || '';
  }

  public get cfPassword(): string {
    return this.environmentVariables.get(CF_PASSWORD) || '';
  }

  public get batchRange(): string {
    return this.environmentVariables.get(BATCH_RANGE) || '';
  }

  public get asgnCreateByAPI(): string {
    return this.environmentVariables.get(ASGN_CREATE_BY_API) || '';
  }

  public get asgnBatchSize(): string {
    return this.environmentVariables.get(ASGN_BATCH_SIZE) || '';
  }

  public get tenantId(): string {
    return this.environmentVariables.get(TENANT_ID) || '';
  }
}