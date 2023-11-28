"use strict";

const environment = require("./src/utils").getEnvironment();

exports.config = {
	profile: "integration",
	browsers: [
		{
			browserName: "chrome",
			platformName: "linux",
			capabilities: {
				chromeOptions: {
					//args : [  'start-maximized' ], //for local testing
					args: ["--headless", "--disable-gpu", "--window-size=1920,1080", "--no-sandbox", "lang=en-US"] //for use with headless chrome (pipeline)
				}
			}
		}
	],

	specs: {
		Assignments: [
			"src/tests/AuthorizationJourney.spec.js",
			"src/tests/DailyAssignmentJourney.spec.js",
			"src/tests/MonthlyAssignmentJourney.spec.js",
			"src/tests/WeeklyAssignmentJourney.spec.js",
			"src/tests/DailyEditableJourney.spec.js",
			"src/tests/MonthlyEditableJourney.spec.js",
			"src/tests/EditableJourney.spec.js",
			"src/tests/FocusedEditJourney.spec.js",
			"src/tests/ContextMenuAndRowSelectionJourney.spec.js"
		],
		Utilization: [
			"src/tests/FilterResourcesWithEditedAssignmentJourney.spec.js",
			"src/tests/WeeklyEditableJourney.spec.js",
			"src/tests/DailyResourceUtilizationJourney.spec.js",
			"src/tests/MonthlyResourceUtilizationJourney.spec.js",
			"src/tests/WeeklyResourceUtilizationJourney.spec.js",
			"src/tests/NoDataJourney.spec.js",
			"src/tests/VariantsJourney.spec.js",
			"src/tests/EditCreateDeleteAssignmentJourney.spec.js"
		]
	},
	//configure launchpad URL, and a user which as access here
	params: {
		appUsers: environment.appUsers,
		appPasswords: environment.appPasswords,
		appURL: environment.approuterUrl,
		idpHost: environment.idpHost
	},

	takeScreenshot: {
		onExpectFailure: true,
		onExpectSuccess: false,
		onAction: false
	},

	timeouts: {
		getPageTimeout: "20000",
		allScriptsTimeout: "60000",
		defaultTimeoutInterval: "60000"
	},

	reporters: [
		{
			name: "./reporter/junitReporter",
			reportName: environment.reportName
		},
		{
			name: "./reporter/screenshotReporter",
			reportName: "index.html"
		}
	]
};
