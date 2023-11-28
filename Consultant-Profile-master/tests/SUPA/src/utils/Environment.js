const { existsSync, readFileSync } = require('fs');

const environmentVariablesKeys = {
    LANDSCAPE: 'SUPA_AUTOMATES_LANDSCAPE',
    SPACE_GUID: 'SUPA_AUTOMATES_SPACE_GUID',
    SRV_APP_NAME: 'SUPA_AUTOMATES_APP_NAME',
    CF_USER: 'ENV_CF_USER',
    CF_PASSWORD: 'ENV_CF_PASSWORD',
    APPROUTER_URL: 'SUPA_AUTOMATES_APP_URL',
    CONFIG_EXPERT_USER: 'ENV_USER_CONFIGURATIONEXPERT_SUPA',
    CONFIG_EXPERT_PASS: 'ENV_PASSWORD_CONFIGURATIONEXPERT_SUPA',
    PROJECT_TEAM_MEMBER_USER: 'ENV_USER_CONSULTANT1_SUPA',
    PROJECT_TEAM_MEMBER_PASS: 'ENV_PASSWORD_CONSULTANT1_SUPA',
    RESOURCE_MANAGER_USER: 'ENV_USER_RESOURCEMANAGER_SUPA',
    RESOURCE_MANAGER_PASS: 'ENV_PASSWORD_RESOURCEMANAGER_SUPA',
    WARMUP_CYCLES: 'SUPA_AUTOMATES_WARMUP_CYCLES',
    MEASUREMENT_CYCLES: 'SUPA_AUTOMATES_MEASUREMENT_CYCLES',
    HANA_HOST: 'SUPA_AUTOMATES_HANA_SERVER',
    HANA_MONITORED_USER: 'SUPA_AUTOMATES_HANA_RT_USER',
    DYNATRACE_API_TOKEN: 'ENV_DYNATRACE_TOKEN',
    DYNATRACE_TAG: 'SUPA_AUTOMATES_DYNATRACE_TAG',
    HANA_TRACE_USER: 'ENV_HANA_USER_CANARY',
    HANA_TRACE_PASS: 'ENV_HANA_PASSWORD_CANARY',
    IPA_PROJECT: 'SUPA_AUTOMATES_IPA_PROJECT',
    IPA_VARIANT: 'SUPA_AUTOMATES_IPA_VARIANT',
    IPA_RELEASE: 'SUPA_AUTOMATES_IPA_RELEASE',
    IPA_USER: 'ENV_IPA_USER',
    IPA_PASS: 'ENV_IPA_PASSWORD',
    SPEC: 'SUPA_SPEC',
    IDP_HOST: 'SUPA_AUTOMATES_APP_IDP_HOST',
    VAL_IPA_USER: 'ENV_VAL_IPA_USER',
    VAL_IPA_PASSWORD: 'ENV_VAL_IPA_PASSWORD',
    HANA_USER_CANARY_TEST_E2E: 'ENV_HANA_USER_CANARY_TEST_E2E',
    HANA_PASSWORD_CANARY_TEST_E2E: 'ENV_HANA_PASSWORD_CANARY_TEST_E2E',
};

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
        return this.environmentVariables.get(environmentVariablesKeys.LANDSCAPE);
    }

    get spaceGuid() {
        return this.environmentVariables.get(environmentVariablesKeys.SPACE_GUID);
    }

    get srvAppName() {
        return this.environmentVariables.get(environmentVariablesKeys.SRV_APP_NAME);
    }

    get cfUser() {
        return this.environmentVariables.get(environmentVariablesKeys.CF_USER);
    }

    get cfPassword() {
        return this.environmentVariables.get(environmentVariablesKeys.CF_PASSWORD);
    }

    get approuterUrl() {
        return this.environmentVariables.get(environmentVariablesKeys.APPROUTER_URL);
    }

    get configExpertUser() {
        return this.environmentVariables.get(environmentVariablesKeys.CONFIG_EXPERT_USER);
    }

    get configExpertPass() {
        return this.environmentVariables.get(environmentVariablesKeys.CONFIG_EXPERT_PASS);
    }

    get projectTeamMemberUser() {
        return this.environmentVariables.get(environmentVariablesKeys.PROJECT_TEAM_MEMBER_USER);
    }

    get projectTeamMemberPass() {
        return this.environmentVariables.get(environmentVariablesKeys.PROJECT_TEAM_MEMBER_PASS);
    }

    get resourceManagerUser() {
        return this.environmentVariables.get(environmentVariablesKeys.RESOURCE_MANAGER_USER);
    }

    get resourceManagerPass() {
        return this.environmentVariables.get(environmentVariablesKeys.RESOURCE_MANAGER_PASS);
    }

    get warmUpCycles() {
        return this.environmentVariables.get(environmentVariablesKeys.WARMUP_CYCLES);
    }

    get measurementCycles() {
        return this.environmentVariables.get(environmentVariablesKeys.MEASUREMENT_CYCLES);
    }

    get hanaHost() {
        return this.environmentVariables.get(environmentVariablesKeys.HANA_HOST);
    }

    get hanaMonitoredUser() {
        return this.environmentVariables.get(environmentVariablesKeys.HANA_MONITORED_USER);
    }

    get dynatraceApiToken() {
        return this.environmentVariables.get(environmentVariablesKeys.DYNATRACE_API_TOKEN);
    }

    get dynatraceTag() {
        return this.environmentVariables.get(environmentVariablesKeys.DYNATRACE_TAG);
    }

    get hanaTraceUser() {
      if (this.environmentVariables.get(environmentVariablesKeys.SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
        return this.environmentVariables.get(environmentVariablesKeys.HANA_TRACE_USER);
      }
      else {
        return this.environmentVariables.get(environmentVariablesKeys.HANA_USER_CANARY_TEST_E2E); 
      }    
    }

    get hanaTracePass() {
      if (this.environmentVariables.get(environmentVariablesKeys.SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
        return this.environmentVariables.get(environmentVariablesKeys.HANA_TRACE_PASS);
      }
      else {
        return this.environmentVariables.get(environmentVariablesKeys.HANA_PASSWORD_CANARY_TEST_E2E);
      }    
    }

    get ipaProject() {
        return this.environmentVariables.get(environmentVariablesKeys.IPA_PROJECT);
    }

    get ipaVariant() {
        return this.environmentVariables.get(environmentVariablesKeys.IPA_VARIANT);
    }

    get ipaRelease() {
        return this.environmentVariables.get(environmentVariablesKeys.IPA_RELEASE);
    }

    get ipaUser() {
      if (this.environmentVariables.get(environmentVariablesKeys.SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
        return this.environmentVariables.get(environmentVariablesKeys.IPA_USER);
      }
      else {
        return this.environmentVariables.get(environmentVariablesKeys.VAL_IPA_USER);  
      }    
    }

    get ipaPass() {
      if (this.environmentVariables.get(environmentVariablesKeys.SPACE_GUID) == '4afb9130-a67c-46b9-a568-87c2100a521e') {
        return this.environmentVariables.get(environmentVariablesKeys.IPA_PASS);
      }
      else {
        return this.environmentVariables.get(environmentVariablesKeys.VAL_IPA_PASSWORD);
      }    
    }

    get spec() {
        return this.environmentVariables.get(environmentVariablesKeys.SPEC);
    }

    get idpHost() {
        return this.environmentVariables.get(environmentVariablesKeys.IDP_HOST);
    }
};
