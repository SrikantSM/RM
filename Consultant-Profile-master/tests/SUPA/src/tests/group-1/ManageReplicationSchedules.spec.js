const { SupaHelper } = require('../../utils/SupaHelper');
const { MANAGE_REPLICATION_SCHEDULES, TestHelper } = require('../../utils/TestHelper');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const ManageReplicationSchedulesPage = require('../../../../end-to-end/src/tests/pages/ManageReplicationSchedulesPage');

describe('ManageReplicationSchedules', () => {
    const supaHelper = new SupaHelper();

    // Scenario: F5440_Manage_Replication_Schedules

    const testHelper = new TestHelper(supaHelper, MANAGE_REPLICATION_SCHEDULES);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeManageReplicationSchedulesTest(undefined, i);
    }

    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeManageReplicationSchedulesTest(supaHelper, i + NUMBER_OF_WARMUPS);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeManageReplicationSchedulesTest(supaHelper, iteration) {
    // Prerequisite
    it('Manage Replication Schedule tile should appear', () => {
        expect(LaunchpadPage.elements.ManageReplicationSchedulesTile.isPresent()).toBe(true);
    });
    // End of Prerequisite

    // Start of Measurement
    it('User clicks on the Manage Replication Schedules App', async () => {
        const item = LaunchpadPage.elements.ManageReplicationSchedulesTile
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("010_User clicks on the 'Manage Replication Schedules' app");
            });
        }
        await item.click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User chooses one-time schedule and clicks on Activate', async () => {
        const noRfRowToBeSelected = 0;
        await ManageReplicationSchedulesPage.actions.selectTableRow(noRfRowToBeSelected);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("020_User chooses one-time schedule and clicks on 'Activate'");
            });
        }
        await ManageReplicationSchedulesPage.actions.clickOnActivateButton();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on the Activate button on the pop-up', async () => {
        await ManageReplicationSchedulesPage.actions.enterDate();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("030_User clicks on the 'Activate' button on the pop-up");
            });
        }
        await ManageReplicationSchedulesPage.actions.clickOnActivateButtonOnDialog();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User chooses recurring schedule and clicks on Activate', async () => {
        const noRfRowToBeSelected = 1;
        await ManageReplicationSchedulesPage.actions.selectTableRow(noRfRowToBeSelected);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("040_User chooses recurring schedule and clicks on 'Activate'");
            });
        }
        await ManageReplicationSchedulesPage.actions.clickOnActivateButton();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on the Activate button on the pop-up', async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("050_User clicks on the 'Activate' button on the pop-up");
            });
        }
        await ManageReplicationSchedulesPage.actions.clickOnActivateButtonOnDialog();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User chooses one-time schedule and clicks on Deactivate', async () => {
        if(await ManageReplicationSchedulesPage.actions.isShowDetailsSegmentButtonPresent())
            await ManageReplicationSchedulesPage.actions.clickOnShowDetailsButton();
        
        const noRfRowToBeSelected = 0;
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("060_User chooses one-time schedule and clicks on 'Deactivate'");
            });
        }
        await ManageReplicationSchedulesPage.actions.clickOnDeactivateButton(noRfRowToBeSelected);
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Cleanup

    it('User chooses recurring schedule and clicks on Deactivate', async () => {
        const noRfRowToBeSelected = 1;
        await ManageReplicationSchedulesPage.actions.clickOnDeactivateButton(noRfRowToBeSelected);
    });

    it('should go to shell home', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
