const { SupaHelper } = require('../../utils/SupaHelper');
const { VIEW_EDIT_SKILL_ASSIGNMENT, TestHelper } = require('../../utils/TestHelper');
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const CudOperations = require('../../../../end-to-end/src/tests/pages/CudOperations');
const Qualifications = require('../../../../end-to-end/src/tests/pages/Qualifications');
const BasicDataPage = require('../../../../end-to-end/src/tests/pages/BasicDataPage');
const { cleaner } = require('../../utils');

const { Key } = protractor;

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);

describe('SkillAssignments', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, VIEW_EDIT_SKILL_ASSIGNMENT);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeViewEditSkillAssignmentTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeViewEditSkillAssignmentTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeViewEditSkillAssignmentTest(supaHelper) {
    it('My Project Experience tile should appear', () => {
        browser.wait(() => LaunchpadPage.elements.consultantProfileTile.isPresent(), 600000);
    });

    it('User clicks on My Project Experience app', () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("010_User clicks on 'My Project Experience' app");
            });
        }
        // LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on edit button', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('020_User clicks on edit button');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on the create button above the skills table', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        Qualifications.actions.navigateToQualifications();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('030_User clicks on the create button above the skills table');
            });
        }
        await CudOperations.actions.create('skills');
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User types skill name in the skill name input', async () => {
        await CudOperations.actions.fillEmptyInputBox('skills', 'Skill Name 12 en');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("050_User types 'Skill Name 12 en' in the skill name");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User types proficiency level name in the proficiency level name input', async () => {
        await CudOperations.actions.clickDropdownBySiblingValue('skills', 'Skill Name 12 en', 'proficiencyLevel_ID', 'MyProjectExperienceObjectPage');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("055_User types 'Proficiency Level Name 3.1 en' in the proficiency level name");
            });
        }
        await CudOperations.actions.selectFromDropdown('Proficiency Level Name 3.1 en');
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Navigate back to launchpage
    it('Should save & navigate back to launchpage', async () => {
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);
        await CommonPageElements.objectPage.elements.backButton.click();
    });

    // Clean up before next run
    it('Should delete the added skill', async () => {
        await cleaner.cleanSkillAssignments('Skill Name 12 en');
    });
}
