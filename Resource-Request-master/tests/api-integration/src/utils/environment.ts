import { existsSync, readFileSync } from 'fs';

const LANDSCAPE = 'ENV_LANDSCAPE';
const SPACE_GUID = 'ENV_SPACE_GUID';
const SRV_APP_NAME = 'ENV_SRV_APP_NAME';
const PROJECT_INTEGRATION_SRV_APP_NAME = 'ENV_PROJECT_INTEGRATION_APP_NAME';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const LOGIN_HINT_ORIGIN = 'ENV_IDP_HOST';
const APP_USER_PREFIX = 'ENV_USER_';
const APP_PASSWORD_PREFIX = 'ENV_PASSWORD_';
const API_GATEWAY_APP_NAME = 'ENV_API_GATEWAY_APP_NAME';

export class Environment {
  private environmentVariables!: Map<string, string | undefined>;

  private constructor(private readonly defaultEnvFileName: string) { }

  public static createInstance(
    defaultEnvFileName: string,
  ): Environment {
    const environment = new Environment(defaultEnvFileName);
    environment.environmentVariables = new Map(Object.entries(process.env));

    if (existsSync(environment.defaultEnvFileName)) {
      const defaultEnv = JSON.parse(
        readFileSync(environment.defaultEnvFileName, 'utf-8'),
      );

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

  public get srvAppName(): string {
    return this.environmentVariables.get(SRV_APP_NAME) || '';
  }

  public get apiGatewayAppName(): string | undefined {
    return this.environmentVariables.get(API_GATEWAY_APP_NAME);
  }

  public get projectIntegrationSrvAppName(): string {
    return this.environmentVariables.get(PROJECT_INTEGRATION_SRV_APP_NAME) || '';
  }

  public get cfUser(): string {
    return this.environmentVariables.get(CF_USER) || '';
  }

  public get cfPassword(): string {
    return this.environmentVariables.get(CF_PASSWORD) || '';
  }

  public get loginHintOrigin(): string {
    return this.environmentVariables.get(LOGIN_HINT_ORIGIN) || '';
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
