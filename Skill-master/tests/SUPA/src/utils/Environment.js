const { existsSync, readFileSync } = require('fs');

const LANDSCAPE = 'SUPA_AUTOMATES_LANDSCAPE';
const SPACE_GUID = 'SUPA_AUTOMATES_SPACE_GUID';
const SRV_APP_NAME = 'SUPA_AUTOMATES_APP_NAME';
const APPROUTER_URL = 'SUPA_AUTOMATES_APP_URL';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const APP_USER = 'ENV_USER_CONFIGURATIONEXPERT_SUPA';
const APP_PASSWORD = 'ENV_PASSWORD_CONFIGURATIONEXPERT_SUPA';
const WARMUP_CYCLES = 'SUPA_AUTOMATES_WARMUP_CYCLES';
const MEASUREMENT_CYCLES = 'SUPA_AUTOMATES_MEASUREMENT_CYCLES';
const STOP_SLEEP_TIME = 'SUPA_AUTOMATES_SLEEP_TIME';
const IPA_PROJECT = 'SUPA_AUTOMATES_IPA_PROJECT';
const IPA_VARIANT = 'SUPA_AUTOMATES_IPA_VARIANT';
const IPA_RELEASE = 'SUPA_AUTOMATES_IPA_RELEASE';
const IPA_USER = 'ENV_IPA_USER';
const IPA_PASSWORD = 'ENV_IPA_PASSWORD';
const HANA_SERVER = 'SUPA_AUTOMATES_HANA_SERVER';
const HANA_USER = 'ENV_HANA_USER_CANARY';
const HANA_PASSWORD = 'ENV_HANA_PASSWORD_CANARY';
const MONITORED_HANA_USER = 'SUPA_AUTOMATES_HANA_RT_USER';
const DYNATRACE_API_TOKEN = 'ENV_DYNATRACE_TOKEN';
const IDP_HOST = 'SUPA_AUTOMATES_APP_IDP_HOST';

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

  get approuterUrl() {
    return this.environmentVariables.get(APPROUTER_URL);
  }

  get cfUser() {
    return this.environmentVariables.get(CF_USER);
  }

  get cfPassword() {
    return this.environmentVariables.get(CF_PASSWORD);
  }

  get appUser() {
    return this.environmentVariables.get(APP_USER);
  }

  get appPassword() {
    return this.environmentVariables.get(APP_PASSWORD);
  }

  get warmupCycles() {
    return this.environmentVariables.get(WARMUP_CYCLES);
  }

  get measurementCycles() {
    return this.environmentVariables.get(MEASUREMENT_CYCLES);
  }

  get stopSleepTime() {
    return this.environmentVariables.get(STOP_SLEEP_TIME);
  }

  get ipaProject() {
    return this.environmentVariables.get(IPA_PROJECT);
  }

  get ipaVariant() {
    return this.environmentVariables.get(IPA_VARIANT);
  }

  get ipaRelease() {
    return this.environmentVariables.get(IPA_RELEASE);
  }

  get ipaUser() {
    return this.environmentVariables.get(IPA_USER);
  }

  get ipaPassword() {
    return this.environmentVariables.get(IPA_PASSWORD);
  }

  get hanaServer() {
    return this.environmentVariables.get(HANA_SERVER);
  }

  get hanaUser() {
    return this.environmentVariables.get(HANA_USER);
  }

  get hanaPassword() {
    return this.environmentVariables.get(HANA_PASSWORD);
  }

  get monitoredHanaUser() {
    return this.environmentVariables.get(MONITORED_HANA_USER);
  }

  get dynatraceApiToken() {
    return this.environmentVariables.get(DYNATRACE_API_TOKEN);
  }

  get idpHost() {
    return this.environmentVariables.get(IDP_HOST);
  }
};
