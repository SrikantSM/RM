const { SupaHelper } = require('../../utils/SupaHelper');
const { VIEW_EDIT_ROLE_ASSIGNMENT, TestHelper } = require('../../utils/TestHelper');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const CudOperations = require('../../../../end-to-end/src/tests/pages/CudOperations');
const PriorExperience = require('../../../../end-to-end/src/tests/pages/PriorExperience');
const BasicDataPage = require('../../../../end-to-end/src/tests/pages/BasicDataPage');

const { Key } = protractor;

describe('RoleAssignments', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, VIEW_EDIT_ROLE_ASSIGNMENT);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeViewEditRoleAssignmentTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeViewEditRoleAssignmentTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeViewEditRoleAssignmentTest(supaHelper) {
    it('My Project Experience tile should appear and then user navigates to my project experience and clicks on edit', async () => {
        browser.wait(() => LaunchpadPage.elements.consultantProfileTile.isPresent(), 600000);
        await LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);
        await CommonPageElements.objectPage.elements.editButton.click();
    });

    it('User clicks on the create button above the roles table', async () => {
        await PriorExperience.actions.navigateToPriorExperience();
        browser.wait(() => PriorExperience.priorExperience.elements.tableTitle.isPresent(), 600000);
        browser.wait(() => PriorExperience.parentElements.contentSection.isPresent(), 600000);
        // Measurement
        if (supaHelper) {
            supaHelper.sleep(1500);
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('030_User clicks on the create button above the roles table');
            });
        }
        await CudOperations.actions.create('roles');
        if (supaHelper) {
            supaHelper.sleep(3000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User types role name in the role name input', async () => {
        await CudOperations.actions.fillEmptyInputBox('roles', 'ProjectRole T12');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("040_User type 'Project Role T12' in the role name");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            console.log('Date and time after the ok click: ', new Date().toLocaleTimeString());
            supaHelper.sleep(2000);
            console.log('Date and time after the delay of 2s (ok): ', new Date().toLocaleTimeString());
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        browser.wait(() => CommonPageElements.objectPage.elements.editButton.isPresent(), 600000);
    });

    // Clean up before next run
    it('Should delete the added role', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.delete('roles', 'ProjectRole T12');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    // Navigate back to launchpage
    it('Should navigate back to launchpage', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
