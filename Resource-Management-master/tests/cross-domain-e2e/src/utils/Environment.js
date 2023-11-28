
const { existsSync, readFileSync } = require('fs');

const LANDSCAPE = 'ENV_LANDSCAPE';
const SPACE_GUID = 'ENV_SPACE_GUID';
const SRV_APP_NAME = 'ENV_SRV_APP_NAME';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const APPROUTER_URL = 'ENV_APPROUTER_URL';
const IDP_HOST = 'ENV_IDP_HOST';
const TENANT_ID = 'ENV_TENANT_ID';

const APP_USER_PREFIX = 'ENV_USER_';
const APP_PASSWORD_PREFIX = 'ENV_PASSWORD_';

module.exports = class Environment {
  constructor(defaultEnvFileName) {
    this.defaultEnvFileName = defaultEnvFileName;
    this.environmentVariables = null;
  }

  static createInstance(defaultEnvFileName) {
    const environment = new Environment(defaultEnvFileName);
    environment.environmentVariables = new Map(Object.entries(process.env));

    try {
      if (existsSync(environment.defaultEnvFileName)) {
        const defaultEnv = JSON.parse(readFileSync(environment.defaultEnvFileName, 'utf-8'));

        for (const [key, value] of Object.entries(defaultEnv)) {
          if (!environment.environmentVariables.has(key)) {
            environment.environmentVariables.set(key, value);
          }
        }
      }
    } catch (err) {
      console.error(`${environment.defaultEnvFileName} could not be read`, err);
    }

    return environment;
  }

  get landscape() {
    return this.environmentVariables.get(LANDSCAPE);
  }

  get spaceGuid() {
    return this.environmentVariables.get(SPACE_GUID);
  }

  get srvAppName() {
    return this.environmentVariables.get(SRV_APP_NAME);
  }

  get cfUser() {
    return this.environmentVariables.get(CF_USER);
  }

  get cfPassword() {
    return this.environmentVariables.get(CF_PASSWORD);
  }

  get approuterUrl() {
    return this.environmentVariables.get(APPROUTER_URL);
  }

  get idpHost() {
    return this.environmentVariables.get(IDP_HOST);
  }
  
  get tenantId() {
    return this.environmentVariables.get(TENANT_ID);
  }

  get appUsers() {
    return new Map(Array.from(this.environmentVariables.entries())
      .filter(([key]) => key.startsWith(APP_USER_PREFIX))
      .map(([key, val]) => [key.slice(APP_USER_PREFIX.length), val]));
  }

  get appPasswords() {
    return new Map(Array.from(this.environmentVariables.entries())
      .filter(([key]) => key.startsWith(APP_PASSWORD_PREFIX))
      .map(([key, val]) => [key.slice(APP_PASSWORD_PREFIX.length), val]));
  }
};
