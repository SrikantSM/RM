const ViewResourceUtilizationApp = require("./scenarios/ViewMonthlyResourceUtilizationApp");
const ViewResourceUtilizationAppDaily = require("./scenarios/ViewDailyResourceUtilizationApp");
const ViewMonthlyAssignmentsApp = require("./scenarios/ViewMonthlyAssignmentsApp");
const ViewDailyAssignmentsApp = require("./scenarios/ViewDailyAssignmentsApp");
const StaffResourceRequestApp = require("./scenarios/StaffResourceRequestApp");
const AssignmentCRUDOperationsApp = require("./scenarios/AssignmentCRUDOperationsApp");
const { SupaHelper } = require("../utils/SUPAHelper");
const NUMBER_OF_WARMUPS = Number(browser.testrunner.config.params.warmupcycles);
const NUMBER_OF_MEASUREMENTS = Number(browser.testrunner.config.params.measurementcycles);
const APP_TO_MEASURE = browser.testrunner.config.params.appToMeasure.toUpperCase();

describe("SUPAFlow", () => {
	// Helper classes objects
	var supaHelper = new SupaHelper();

	if (APP_TO_MEASURE === "" || APP_TO_MEASURE === "VIEWMONTHLYRESOURCEUTILIZATIONAPP") {
		// Capacity Grid App Scenario - Monthly View

		const ViewResourceUtilizationAppScenario = "F4724_1_CapacityGrid";
		login("Resource Manager", browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);
		addCredentialsAndConfigureSUPA(supaHelper, ViewResourceUtilizationAppScenario);

		// Run SUPA Warmup test
		for (var warmupCycleGrid = 1; warmupCycleGrid <= NUMBER_OF_WARMUPS; warmupCycleGrid++) {
			ViewResourceUtilizationApp.executeTest();
		}

		// Take Measurements
		for (
			var measurementCycleGrid = NUMBER_OF_WARMUPS + 1;
			measurementCycleGrid <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS;
			measurementCycleGrid++
		) {
			ViewResourceUtilizationApp.executeTest(supaHelper);
		}

		logout();
		finishAndUpload(supaHelper, ViewResourceUtilizationAppScenario);
	}

	if (APP_TO_MEASURE === "" || APP_TO_MEASURE === "VIEWMONTHLYASSIGNMENTSAPP") {
		// Capacity Grid App Scenario - Daily View

		const ViewResourceUtilizationAssignmentsAppScenario = "F4724_2_CapacityGrid_Assignments";
		login("Resource Manager", browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);
		addCredentialsAndConfigureSUPA(supaHelper, ViewResourceUtilizationAssignmentsAppScenario);

		// Run SUPA Warmup test
		for (warmupCycleGrid = 1; warmupCycleGrid <= NUMBER_OF_WARMUPS; warmupCycleGrid++) {
			ViewMonthlyAssignmentsApp.executeTest();
		}

		// Take Measurements
		for (measurementCycleGrid = NUMBER_OF_WARMUPS + 1; measurementCycleGrid <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS; measurementCycleGrid++) {
			ViewMonthlyAssignmentsApp.executeTest(supaHelper);
		}

		logout();
		finishAndUpload(supaHelper, ViewResourceUtilizationAssignmentsAppScenario);
	}
	if (APP_TO_MEASURE === "" || APP_TO_MEASURE === "VIEWDAILYRESOURCEUTILIZATIONAPP") {
		// Capacity Grid App Scenario - Daily View

		const ViewResourceUtilizationAppScenarioDaily = "F4724_3_CapacityGrid_Daily";
		login("Resource Manager", browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);
		addCredentialsAndConfigureSUPA(supaHelper, ViewResourceUtilizationAppScenarioDaily);

		// Run SUPA Warmup test
		for (warmupCycleGrid = 1; warmupCycleGrid <= NUMBER_OF_WARMUPS; warmupCycleGrid++) {
			ViewResourceUtilizationAppDaily.executeTest();
		}

		// Take Measurements
		for (measurementCycleGrid = NUMBER_OF_WARMUPS + 1; measurementCycleGrid <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS; measurementCycleGrid++) {
			ViewResourceUtilizationAppDaily.executeTest(supaHelper);
		}

		logout();
		finishAndUpload(supaHelper, ViewResourceUtilizationAppScenarioDaily);
	}
	if (APP_TO_MEASURE === "" || APP_TO_MEASURE === "VIEWDAILYASSIGNMENTSAPP") {
		// Capacity Grid App Scenario - Daily View

		const ViewResourceUtilizationAppScenarioDailyAssignments = "F4724_4_CapacityGrid_Daily_Assignments";
		login("Resource Manager", browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);
		addCredentialsAndConfigureSUPA(supaHelper, ViewResourceUtilizationAppScenarioDailyAssignments);

		// Run SUPA Warmup test
		for (warmupCycleGrid = 1; warmupCycleGrid <= NUMBER_OF_WARMUPS; warmupCycleGrid++) {
			ViewDailyAssignmentsApp.executeTest();
		}

		// Take Measurements
		for (measurementCycleGrid = NUMBER_OF_WARMUPS + 1; measurementCycleGrid <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS; measurementCycleGrid++) {
			ViewDailyAssignmentsApp.executeTest(supaHelper);
		}

		logout();
		finishAndUpload(supaHelper, ViewResourceUtilizationAppScenarioDailyAssignments);
	}

	if (APP_TO_MEASURE === "" || APP_TO_MEASURE === "STAFFRESOURCEREQUESTAPP") {
		// Staff Resource Request App Scenario
		const StaffResourceRequestAppScenario = "F4725_Assignment_Creation_Deletion";
		login("Resource Manager", browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);
		addCredentialsAndConfigureSUPA(supaHelper, StaffResourceRequestAppScenario);

		// Run SUPA Warmup test
		for (var warmupCycleStaff = 1; warmupCycleStaff <= NUMBER_OF_WARMUPS; warmupCycleStaff++) {
			StaffResourceRequestApp.executeTest();
		}

		// Take Measurements
		for (
			var measurementCycleStaff = NUMBER_OF_WARMUPS + 1;
			measurementCycleStaff <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS;
			measurementCycleStaff++
		) {
			StaffResourceRequestApp.executeTest(supaHelper);
		}

		logout();
		finishAndUpload(supaHelper, StaffResourceRequestAppScenario);
	}

	// New Scenario for Assignment Create and Delete
	if (APP_TO_MEASURE === "" || APP_TO_MEASURE === "ASSIGNMENTSDELETECREATEAPP") {
		// Delete and Create Assignment App Scenario
		const AssignmentDelCreateAppScenario = "F4724_5_CapacityGrid_Assignments_CRUD";
		login("Resource Manager", browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);
		addCredentialsAndConfigureSUPA(supaHelper, AssignmentDelCreateAppScenario);

		// Run SUPA Warmup test
		for (var warmupCycleStaff = 1; warmupCycleStaff <= NUMBER_OF_WARMUPS; warmupCycleStaff++) {
			AssignmentCRUDOperationsApp.executeTest();
		}

		// Take Measurements
		for (
			var measurementCycleStaff = NUMBER_OF_WARMUPS + 1;
			measurementCycleStaff <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS;
			measurementCycleStaff++
		) {
			AssignmentCRUDOperationsApp.executeTest(supaHelper);
		}

		logout();
		finishAndUpload(supaHelper, AssignmentDelCreateAppScenario);
	}
});

function login(userName, loginUser, loginPass) {
	const customIdpAuthConfig = {
		user: loginUser,
		pass: loginPass,
		idpSelector: `a[href*="${browser.testrunner.config.params.idpHost}"]`,
		redirectUrl: /cp.portal\/site/
	};

	const defaultIdpAuthConfig = {
		user: loginUser,
		pass: loginPass,
		userFieldSelector: 'input[name="username"]',
		passFieldSelector: 'input[name="password"]',
		logonButtonSelector: ".island-button",
		redirectUrl: /cp.portal\/site/
	};

	it("should login as " + userName, () => {
		browser.testrunner.navigation.to(browser.testrunner.config.params.appURL, {
			auth: { "sapcloud-form": browser.testrunner.config.params.idpHost ? customIdpAuthConfig : defaultIdpAuthConfig }
		});
		expect(browser.getTitle()).toBe("Home");
	});
}

function addCredentialsAndConfigureSUPA(supaHelper, supaScenario) {
	it("should Add Credentials and configure SUPA", () => {
		browser.controlFlow().execute(function () {
			const cfgFile = browser.testrunner.config.params.cfgpath + "/" + supaScenario + ".properties";
			const hanaPasswordKey = "branch.2.newdb.user.password";
			const hanaPassword = browser.testrunner.config.params.hanaPassword;
			const ipaUsernameKey = "ipa.user.name";
			const ipaUsername = browser.testrunner.config.params.ipauser.user;
			const ipaPasswordKey = "ipa.user.password";
			const ipaPassword = browser.testrunner.config.params.ipauser.pwd;
			const ipaProjectnameKey = "ipa.project.name";
			const ipaProjectname = browser.testrunner.config.params.ipaproject;
			const ipaReleaseKey = "ipa.release.name";
			const ipaRelease = browser.testrunner.config.params.iparelease;

			supaHelper.addCredentials(cfgFile, ipaUsernameKey, ipaUsername);
			supaHelper.addCredentials(cfgFile, ipaPasswordKey, ipaPassword);
			supaHelper.addCredentials(cfgFile, ipaProjectnameKey, ipaProjectname);
			supaHelper.addCredentials(cfgFile, ipaReleaseKey, ipaRelease);

			supaHelper.addCredentials(cfgFile, hanaPasswordKey, hanaPassword);
			supaHelper.configureSupa(cfgFile);
		});
	});
}

function logout() {
	it("should logout", async () => {
		// Logout via FLP
		await element(
			by.control({
				id: "userActionsMenuHeaderButton"
			})
		).click();
		await element(
			by.control({
				controlType: "sap.m.StandardListItem",
				properties: {
					title: "Sign Out"
				},
				searchOpenDialogs: true
			})
		).click();
		await element(
			by.control({
				controlType: "sap.m.Button",
				properties: { text: "OK" },
				ancestor: { controlType: "sap.m.Dialog" }
			})
		).click();
		// low level browser api, as target page does not contain UI5
		await browser.driver.wait(
			() => browser.driver.findElements(by.css(".sapMMessagePage span[data-sap-ui-icon-content=\uE022]")).then((el) => !!el.length),
			browser.getPageTimeout,
			"Waiting for logout to finish"
		);
	});
}

function finishAndUpload(supaHelper, ipaScenario) {
	it("should finish measurement and upload to IPA", () => {
		browser.controlFlow().execute(function () {
			supaHelper.finishMeasurement();
			supaHelper.uploadToIPA(
				browser.testrunner.config.params.ipaproject,
				ipaScenario,
				browser.testrunner.config.params.ipavariant,
				browser.testrunner.config.params.iparelease,
				browser.testrunner.config.params.ipacomment,
				browser.testrunner.config.params.ipauser.user,
				browser.testrunner.config.params.ipauser.pwd
			);
		});
	});
}
