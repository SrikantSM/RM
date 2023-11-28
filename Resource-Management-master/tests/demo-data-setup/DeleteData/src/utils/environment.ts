import { exists as existsAsync, readFile as readFileAsync } from 'fs';
import { promisify } from 'util';
import { IEnvironment } from 'test-commons';

const exists = promisify(existsAsync);
const readFile = promisify(readFileAsync);

const LANDSCAPE = 'DEMO_DATA_SETUP_LANDSCAPE';
const SPACE_GUID = 'DEMO_DATA_SETUP_SPACE_GUID';
const TENANT_ID = 'DEMO_DATA_SETUP_TENANT_ID';
const TENANT_SUBDOMAIN = 'DEMO_DATA_SETUP_TENANT_SUBDOMAIN';
const APP_NAME = 'DEMO_DATA_SETUP_APP_NAME';
const CF_USER = 'DEMO_DATA_SETUP_CF_USER';
const CF_PASSWORD = 'DEMO_DATA_SETUP_CF_PASSWORD';
const APP_USER_PREFIX = 'DEMO_DATA_SETUP_APP_USER_';
const APP_PASSWORD_PREFIX = 'DEMO_DATA_SETUP_APP_PASSWORD_';
const DEMO_DATA_VARIANT = 'DEMO_DATA_SETUP_SYSTEM_VARIANT';

export class Environment implements IEnvironment {
  private environmentVariables!: Map<string, string | undefined>;

  private constructor(private readonly defaultEnvFileName: string) {
  }

  public static async createInstance(defaultEnvFileName: string): Promise<Environment> {
    const environment = new Environment(defaultEnvFileName);
    environment.environmentVariables = new Map(Object.entries(process.env));

    if (await exists(environment.defaultEnvFileName)) {
      const defaultEnv = JSON.parse(await readFile(environment.defaultEnvFileName, 'utf-8'));

      for (const [key, value] of Object.entries(defaultEnv)) {
        if (!environment.environmentVariables.has(key)) {
          environment.environmentVariables.set(key, value as string);
        }
      }
    }

    return environment;
  }

  public get landscape(): string {
    return this.environmentVariables.get(LANDSCAPE) || '';
  }

  public get spaceGuid(): string {
    return this.environmentVariables.get(SPACE_GUID) || '';
  }

  public get tenantId(): string {
    return this.environmentVariables.get(TENANT_ID) || '';
  }

  public get tenantSubdomain(): string {
    return this.environmentVariables.get(TENANT_SUBDOMAIN) || '';
  }

  public get srvAppName(): string {
    return this.environmentVariables.get(APP_NAME) || '';
  }

  public get cfUser(): string {
    return this.environmentVariables.get(CF_USER) || '';
  }

  public get cfPassword(): string {
    return this.environmentVariables.get(CF_PASSWORD) || '';
  }

  public get dataVariant(): string {
    return this.environmentVariables.get(DEMO_DATA_VARIANT) || 'generic';
  }

  public get appUsers(): Map<string, string | undefined> {
    return new Map(Array.from(this.environmentVariables.entries())
      .filter(([key]) => key.startsWith(APP_USER_PREFIX))
      .map(([key, val]) => [key.slice(APP_USER_PREFIX.length), val]));
  }

  public get appPasswords(): Map<string, string | undefined> {
    return new Map(Array.from(this.environmentVariables.entries())
      .filter(([key]) => key.startsWith(APP_PASSWORD_PREFIX))
      .map(([key, val]) => [key.slice(APP_PASSWORD_PREFIX.length), val]));
  }
}
