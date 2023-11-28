const { existsSync, readFileSync } = require("fs");

const LANDSCAPE = 'SUPA_AUTOMATES_LANDSCAPE';
const SPACE_GUID = 'SUPA_AUTOMATES_SPACE_GUID';
const SRV_APP_NAME = 'SUPA_AUTOMATES_APP_NAME';
const CF_USER = 'ENV_CF_USER';
const CF_PASSWORD = 'ENV_CF_PASSWORD';
const IDP_HOST = 'SUPA_AUTOMATES_APP_IDP_HOST';
const APP_URL = 'SUPA_AUTOMATES_APP_URL';
const APP_USER_AUTHATTRTESTUSER02 = 'ENV_USER_AUTHATTRTESTUSER02_SUPA';
const APP_PASSWORD_AUTHATTRTESTUSER02 = 'ENV_PASSWORD_AUTHATTRTESTUSER02_SUPA';
const APP_TO_MEASURE = 'SUPA_AUTOMATES_APP_TO_MEASURE';
const WARMUP_CYCLES = 'SUPA_AUTOMATES_WARMUP_CYCLES';
const MEASUREMENT_CYCLES = 'SUPA_AUTOMATES_MEASUREMENT_CYCLES';
const HANA_PASSWORD = 'ENV_HANA_PASSWORD_CANARY';
const IPA_PROJECT = 'SUPA_AUTOMATES_IPA_PROJECT';
const IPA_VARIANT = 'SUPA_AUTOMATES_IPA_VARIANT';
const IPA_COMMENT = 'SUPA_AUTOMATES_IPA_COMMENT';
const IPA_RELEASE = 'SUPA_AUTOMATES_IPA_RELEASE';
const IPA_USER = 'ENV_IPA_USER';
const IPA_PASSWORD = 'ENV_IPA_PASSWORD';

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
				const defaultEnv = JSON.parse(readFileSync(environment.defaultEnvFileName, "utf-8"));

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
		return this.environmentVariables.get(LANDSCAPE) || "";
	}

	get spaceGuid() {
		return this.environmentVariables.get(SPACE_GUID) || "";
	}

	get srvAppName() {
		return this.environmentVariables.get(SRV_APP_NAME) || "";
	}

	get cfUser() {
		return this.environmentVariables.get(CF_USER) || "";
	}

	get cfPassword() {
		return this.environmentVariables.get(CF_PASSWORD) || "";
	}

	get idpHost() {
		return this.environmentVariables.get(IDP_HOST);
	}

	get appURL() {
		return this.environmentVariables.get(APP_URL);
	}

	get authAttrTestUser02() {
		return this.environmentVariables.get(APP_USER_AUTHATTRTESTUSER02);
	}

	get authAttrTestUser02Password() {
		return this.environmentVariables.get(APP_PASSWORD_AUTHATTRTESTUSER02);
	}

	get appToMeasure() {
		return this.environmentVariables.get(APP_TO_MEASURE);
	}

	get warmupCycles() {
		return this.environmentVariables.get(WARMUP_CYCLES);
	}

	get measurementCycles() {
		return this.environmentVariables.get(MEASUREMENT_CYCLES);
	}

	get hanaPassword() {
		return this.environmentVariables.get(HANA_PASSWORD);
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
		return this.environmentVariables.get(IPA_USER);
	}

	get ipaPassword() {
		return this.environmentVariables.get(IPA_PASSWORD);
	}
};