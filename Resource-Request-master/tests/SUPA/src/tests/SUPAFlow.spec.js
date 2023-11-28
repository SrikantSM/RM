const ManageApp = require('./scenarios/ManageApp');
const StaffApp = require('./scenarios/StaffApp');
const { SupaHelper } = require('../utils/SupaHelper');
const { ResultAnalyzer } = require('../utils/ResultAnalyzer');
const { setUp } = require('../data/Setup');
const { cleanUp } = require('../data/CleanUp');
const { Constants } = require('../data/Constants');
const NUMBER_OF_WARMUPS = Number(browser.testrunner.config.params.warmupcycles);
const NUMBER_OF_MEASUREMENTS = Number(browser.testrunner.config.params.measurementcycles);
const APP_TO_MEASURE = browser.testrunner.config.params.appToMeasure.toUpperCase();

describe('SUPAFlow', () => {
    // Helper classes objects
    var supaHelper = new SupaHelper();

    if (APP_TO_MEASURE === "" || APP_TO_MEASURE === Constants.ManageApp) {
        // Manage Resource Request App Scenario
        const ManageAppScenario = 'F4723_ManageResourceRequest';
        addDynamicVariablesAndConfigureSUPA(supaHelper, ManageAppScenario);
        // Data Setup
        var resourceRequestIds;
        it('should set-up data for ManageApp', async () => {
            resourceRequestIds = await setUp(Constants.ManageApp, NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS);
        });

        // Login
        login('Project Manager', browser.testrunner.config.params.PMUser, browser.testrunner.config.params.PMPass);

        // Run SUPA Warmup test
        for (var warmupCycleManage = 1; warmupCycleManage <= NUMBER_OF_WARMUPS; warmupCycleManage++) {
            ManageApp.executeTest(warmupCycleManage);
        }

        // Take Measurements
        for (var measurementCycleManage = NUMBER_OF_WARMUPS + 1; measurementCycleManage <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS; measurementCycleManage++) {
            ManageApp.executeTest(measurementCycleManage, supaHelper);
        }

        logout();

        // Data Clean Up
        it('should clean-up data for ManageApp', async () => {
            await cleanUp(Constants.ManageApp, resourceRequestIds);
        });

        // Upload results to IPA
        finishAndUpload(supaHelper, ManageAppScenario);
        it('should analyze result' , async () => {
            var resultAnalyzer = new ResultAnalyzer(ManageAppScenario);
            const regressionIdentified = await resultAnalyzer.identifyRegression();
            expect(regressionIdentified).toBe(false);
        });
    }

    if (APP_TO_MEASURE === "" || APP_TO_MEASURE === Constants.StaffApp) {

        // Staff Resource Request App Scenario
        const StaffAppScenario = 'F4725_StaffResourceRequest';
        addDynamicVariablesAndConfigureSUPA(supaHelper, StaffAppScenario);

        // Data Setup
        it('should set-up data for StaffApp', async () => {
            await setUp(Constants.StaffApp);
        });

        // Login
        login('Resource Manager', browser.testrunner.config.params.RMUser, browser.testrunner.config.params.RMPass);

        // Run SUPA Warmup test
        for (var warmupCycleStaff = 1; warmupCycleStaff <= NUMBER_OF_WARMUPS; warmupCycleStaff++) {
            StaffApp.executeTest();
        }

        // Take Measurements
        for (var measurementCycleStaff = NUMBER_OF_WARMUPS + 1; measurementCycleStaff <= NUMBER_OF_WARMUPS + NUMBER_OF_MEASUREMENTS; measurementCycleStaff++) {
            StaffApp.executeTest(supaHelper);
        }

        logout();

        // Data Clean Up
        it('should clean-up data for StaffApp', async () => {
            await cleanUp(Constants.StaffApp);
        });

        // Upload results to IPA
        finishAndUpload(supaHelper, StaffAppScenario);
        it('should analyze result' , async () => {
            var resultAnalyzer = new ResultAnalyzer(StaffAppScenario);
            const regressionIdentified = await resultAnalyzer.identifyRegression();
            expect(regressionIdentified).toBe(false);
        });
    }

});

function login(userName, loginUser, loginPass) {
    it('should login as ' + userName, () => {
        browser.testrunner.navigation.to(
            browser.testrunner.config.params.appURL, {
                auth: {
                    'sapcloud-form': {
                        user: loginUser,
                        pass: loginPass,
                        idpSelector: `a[href*="${browser.testrunner.config.params.idpHost}"]`,
                        redirectUrl: /cp.portal\/site/
                    }
                }
            }
        );
        expect(browser.getTitle()).toBe("Home");
    });
}

function addDynamicVariablesAndConfigureSUPA(supaHelper, supaScenario) {
    it('should add dynamic data and configure SUPA', () => {
        browser.controlFlow().execute(function () {
            const cfgFile = browser.testrunner.config.params.cfgpath + "/" + supaScenario + ".properties";
            supaHelper.addDynamicData(cfgFile, "branch.1.dynatrace.timeseries.tag", browser.testrunner.config.params.dynatraceTag);
            supaHelper.addDynamicData(cfgFile, "branch.1.dynatrace.timeseries.apitoken", browser.testrunner.config.params.dynatraceToken);
            supaHelper.addDynamicData(cfgFile, "branch.2.newdb.monitored.dbusers", browser.testrunner.config.params.hanaRTUser);
            supaHelper.addDynamicData(cfgFile, "branch.2.newdb.user.name", browser.testrunner.config.params.hanaUser);
            supaHelper.addDynamicData(cfgFile, "branch.2.newdb.user.password", browser.testrunner.config.params.hanaPassword);
            supaHelper.addDynamicData(cfgFile, "branch.2.newdb.db.server", browser.testrunner.config.params.hanaServer);
            supaHelper.addDynamicData(cfgFile, "ipa.user.name", browser.testrunner.config.params.ipauser.user);
            supaHelper.addDynamicData(cfgFile, "ipa.user.password", browser.testrunner.config.params.ipauser.pwd);
            supaHelper.addDynamicData(cfgFile, "ipa.project.name", browser.testrunner.config.params.ipaproject);
            supaHelper.addDynamicData(cfgFile, "ipa.release.name", browser.testrunner.config.params.iparelease);
            supaHelper.addDynamicData(cfgFile, "ipa.variant.name", browser.testrunner.config.params.ipavariant);
            const configureStatus = supaHelper.configureSupa(cfgFile);
            if ( configureStatus != 200) {
                console.log('SUPA configuration failed hence terminating the flow.');
                process.exit(1);
            }
        });
    });
}

function logout() {
    it('should logout', async () => {
        // Logout via FLP
        await element(by.control({
            id: 'userActionsMenuHeaderButton'
        })).click();
        await element(by.control({
            controlType: "sap.m.StandardListItem",
            properties: {
                title: "Sign Out"
            },
            searchOpenDialogs: true,
            interaction: {
                idSuffix: "content"
            }
        })).click();
        await element(by.control({
            controlType: 'sap.m.Button',
            properties: { text: 'OK' },
            ancestor: { controlType: 'sap.m.Dialog' }
        })).click();
        // low level browser api, as target page does not contain UI5
        await browser.driver.wait(
            () => browser.driver.findElements(by.css('.sapMMessagePage span[data-sap-ui-icon-content=\uE022]')).then((el) => !!el.length),
            browser.getPageTimeout, 'Waiting for logout to finish'
        );
    });
}

function finishAndUpload(supaHelper, ipaScenario) {
    it('should finish measurement and upload to IPA', () => {
        browser.controlFlow().execute(function () {
            supaHelper.finishMeasurement();
            const uploadStatus = supaHelper.uploadToIPA(
                browser.testrunner.config.params.ipaproject,
                ipaScenario,
                browser.testrunner.config.params.ipavariant,
                browser.testrunner.config.params.iparelease,
                browser.testrunner.config.params.ipacomment,
                browser.testrunner.config.params.ipauser.user,
                browser.testrunner.config.params.ipauser.pwd
            );
            if (uploadStatus != 200){
                console.log('IPA upload failed hence terminating the flow.');
                process.exit(1);
            }
            supaHelper.generateSupaExcel();
        });
    });
}
