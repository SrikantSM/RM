const { existsSync, readFileSync } = require('fs');

const LANDSCAPE = 'ENV_LANDSCAPE';
const SPACE_GUID = 'ENV_SPACE_GUID';
const SRV_APP_NAME = 'ENV_SRV_APP_NAME';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const APPROUTER_URL = 'ENV_APPROUTER_URL';
const BROWSER_NAME = 'ENV_BROWSER_NAME';
const PLATFORM_NAME = 'ENV_PLATFORM_NAME';
const SELENIUM_ADDRESS = 'ENV_SELENIUM_ADDRESS';
const SELENIUM_TEST_NAME = 'ENV_SELENIUM_TEST_NAME';
const IDP_HOST = 'ENV_IDP_HOST';

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

  get seleniumAddress() {
    return this.environmentVariables.get(SELENIUM_ADDRESS);
  }

  get browserName() {
    return this.environmentVariables.get(BROWSER_NAME);
  }

  get platformName() {
    return this.environmentVariables.get(PLATFORM_NAME);
  }

  get seleniumTestName() {
    return this.environmentVariables.get(SELENIUM_TEST_NAME);
  }

  get idpHost() {
    return this.environmentVariables.get(IDP_HOST);
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
