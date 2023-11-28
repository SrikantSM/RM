const environment = require("./src/utils").testHelper.getEnvironment();

exports.config = {
	profile: "integration",
	specs: "./src/tests/*.spec.js",
	browsers: [
		{
			browserName: "chrome",
			platformName: "linux",
			capabilities: {
				chromeOptions: {
					// args: ['start-maximized'] //for local testing
					args: [
						//'--headless',
						"--disable-gpu",
						"--window-size=1600,900",
						"--no-sandbox",
						"--disable-dev-shm-usage",
						"--lang=en-US",
						"--remote-debugging-port=9222", // Needed for measurement using dokcer
						"--user-data-dir=/tmp", // Needed for measurement using docker
						"--disable-translate",
						"--whitelisted-ips",
						"--no-sandbox",
						"--disable-extensions"
					] // for use with headless chrome (pipeline)
				}
			}
		}
	],
	params: {
		appURL: environment.appURL,
		RMUser: environment.authAttrTestUser02,
		RMPass: environment.authAttrTestUser02Password,
		cfgpath: "/home/supa/testautomation",
		appToMeasure: environment.appToMeasure, // blank value here means measure both Apps
		stopSleepTime: 10000,
		warmupcycles: environment.warmupCycles,
		measurementcycles: environment.measurementCycles,
		hanaPassword: environment.hanaPassword,
		ipaproject: environment.ipaProject,
		ipavariant: environment.ipaVariant,
		ipacomment: environment.ipaComment,
		iparelease: environment.ipaRelease,
		idpHost: environment.idpHost,
		ipauser: {
			user: environment.ipaUser,
			pwd: environment.ipaPassword
		}
	},
	authConfigs: {
		"my-form": {
			name: "./authenticator/formAuthenticator",
			userFieldSelector: 'input[name="username"]',
			passFieldSelector: 'input[name="password"]',
			logonButtonSelector: ".island-button",
			redirectUrl: /cp.portal\/site/
		}
	},
	takeScreenshot: {
		onExpectFailure: true,
		onExpectSuccess: false,
		onAction: false
	},
	timeouts: {
		getPageTimeout: "60000",
		allScriptsTimeout: "70000",
		defaultTimeoutInterval: "120000"
	}
};
