const { existsSync, readFileSync } = require('fs');
const moment = require('moment');

const LANDSCAPE = 'SUPA_AUTOMATES_LANDSCAPE';
const SPACE_GUID = 'SUPA_AUTOMATES_SPACE_GUID';
const SRV_APP_NAME = 'SUPA_AUTOMATES_APP_NAME';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const IDP_HOST = 'SUPA_AUTOMATES_APP_IDP_HOST';
const APP_URL = 'SUPA_AUTOMATES_APP_URL';
const APP_USER_PROJECTMANAGER = 'ENV_USER_PROJECTMANAGER_SUPA';
const APP_PASSWORD_PROJECTMANAGER = 'ENV_PASSWORD_PROJECTMANAGER_SUPA';
const APP_USER_RESOURCEMANAGER = 'ENV_USER_RESOURCEMANAGER_SUPA';
const APP_PASSWORD_RESOURCEMANAGER = 'ENV_PASSWORD_RESOURCEMANAGER_SUPA';
const APP_TO_MEASURE = 'SUPA_AUTOMATES_APP_TO_MEASURE';
const DYNATRACE_TAG = 'SUPA_AUTOMATES_DYNATRACE_TAG';
const DYNATRACE_TOKEN = 'ENV_DYNATRACE_TOKEN';
const HANA_RT_USER = 'SUPA_AUTOMATES_HANA_RT_USER';
const HANA_USER = 'ENV_HANA_USER_CANARY';
const HANA_PASSWORD = 'ENV_HANA_PASSWORD_CANARY';
const HANA_SERVER = 'SUPA_AUTOMATES_HANA_SERVER';
const SLEEP_TIME = 'SUPA_AUTOMATES_SLEEP_TIME';
const WARMUP_CYCLES = 'SUPA_AUTOMATES_WARMUP_CYCLES';
const MEASUREMENT_CYCLES = 'SUPA_AUTOMATES_MEASUREMENT_CYCLES';
const IPA_PROJECT = 'SUPA_AUTOMATES_IPA_PROJECT';
const IPA_VARIANT = 'SUPA_AUTOMATES_IPA_VARIANT';
const IPA_COMMENT = 'SUPA_AUTOMATES_IPA_COMMENT';
const IPA_RELEASE = 'SUPA_AUTOMATES_IPA_RELEASE';
const IPA_USER = 'ENV_IPA_USER';
const IPA_PASSWORD = 'ENV_IPA_PASSWORD';
const BRAD_IPA_USER = 'ENV_BRAD_IPA_USER';
const BRAD_IPA_PASSWORD = 'ENV_BRAD_IPA_PASSWORD';
const HANA_USER_CANARY_TEST_E2E = 'ENV_HANA_USER_CANARY_TEST_E2E';
const HANA_PASSWORD_CANARY_TEST_E2E = 'ENV_HANA_PASSWORD_CANARY_TEST_E2E';

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

    get appURL() {
        return this.environmentVariables.get(APP_URL);
    }

    get projectManagerUser() {
        return this.environmentVariables.get(APP_USER_PROJECTMANAGER);
    }

    get projectManagerPassword() {
        return this.environmentVariables.get(APP_PASSWORD_PROJECTMANAGER);
    }

    get resourceManagerUser() {
        return this.environmentVariables.get(APP_USER_RESOURCEMANAGER);
    }

    get resourceManagerPassword() {
        return this.environmentVariables.get(APP_PASSWORD_RESOURCEMANAGER);
    }

    get appToMeasure() {
        return this.environmentVariables.get(APP_TO_MEASURE);
    }

    get dynatraceTag() {
        return this.environmentVariables.get(DYNATRACE_TAG);
    }

    get dynatraceToken() {
        return this.environmentVariables.get(DYNATRACE_TOKEN);
    }

    get hanaRTUser() {
        return this.environmentVariables.get(HANA_RT_USER);
    }

    get hanaUser() {
        if (this.environmentVariables.get(SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
            return this.environmentVariables.get(HANA_USER);
        } else {
            return this.environmentVariables.get(HANA_USER_CANARY_TEST_E2E);
        }
    }

    get hanaPassword() {
        if (this.environmentVariables.get(SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
            return this.environmentVariables.get(HANA_PASSWORD);
        } else {
            return this.environmentVariables.get(HANA_PASSWORD_CANARY_TEST_E2E);
        }
    }

    get hanaServer() {
        return this.environmentVariables.get(HANA_SERVER);
    }

    get sleepTime() {
        return this.environmentVariables.get(SLEEP_TIME) || 10000;
    }

    get warmupCycles() {
        return this.environmentVariables.get(WARMUP_CYCLES);
    }

    get measurementCycles() {
        return this.environmentVariables.get(MEASUREMENT_CYCLES);
    }

    get ipaProject() {
        return this.environmentVariables.get(IPA_PROJECT);
    }

    get ipaVariant() {
        return this.environmentVariables.get(IPA_VARIANT);
    }

    get ipaComment() {
        return this.environmentVariables.get(IPA_COMMENT) || 'Automates';
    }

    get ipaRelease() {
        return this.environmentVariables.get(IPA_RELEASE) == "" ? moment(new Date()).format('YY_MM_DD') : this.environmentVariables.get(IPA_RELEASE);
    }

    get ipaUser() {
        if (this.environmentVariables.get(SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
            return this.environmentVariables.get(IPA_USER);
        } else {
            return this.environmentVariables.get(BRAD_IPA_USER);
        }
    }

    get ipaPassword() {
        if (this.environmentVariables.get(SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
            return this.environmentVariables.get(IPA_PASSWORD);
        } else {
            return this.environmentVariables.get(BRAD_IPA_PASSWORD);
        }
    }

    get idpHost() {
        return this.environmentVariables.get(IDP_HOST);
    }
};
