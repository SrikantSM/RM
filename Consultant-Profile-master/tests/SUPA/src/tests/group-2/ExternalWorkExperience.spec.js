const { SupaHelper } = require('../../utils/SupaHelper');
const { VIEW_EDIT_EXTERNAL_WORK_EXPERIENCE, TestHelper } = require('../../utils/TestHelper');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const CudOperations = require('../../../../end-to-end/src/tests/pages/CudOperations');
const BasicDataPage = require('../../../../end-to-end/src/tests/pages/BasicDataPage');
const ProjectHistory = require('../../../../end-to-end/src/tests/pages/WorkExperience');

const { Key } = protractor;

const workExperience = {
    assignment: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::projectName::Field',
    company: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::companyName::Field',
    customer: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::customer::Field',
    startDate: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::startDate::Field',
    endDate: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::endDate::Field',
    role: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::rolePlayed::Field',
};

describe('ExternalWorkExperience', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, VIEW_EDIT_EXTERNAL_WORK_EXPERIENCE);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeViewEditExternalWorkExperienceTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeViewEditExternalWorkExperienceTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeViewEditExternalWorkExperienceTest(supaHelper) {
    it('My Project Experience tile should appear and then user navigates to my project experience and clicks on edit', async () => {
        expect(LaunchpadPage.elements.consultantProfileTile.isPresent()).toBe(true);
        await LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);
        await CommonPageElements.objectPage.elements.editButton.click();
    });

    it('User clicks on the create button above the external work experience table', async () => {
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('030_User clicks on the create button above the external work experience table');
            });
        }
        for (let i = 0; i < 3; i++) {
            browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        }
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters project name in the project name input', async () => {
        await CudOperations.actions.setValue('Project ABC', workExperience.assignment);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("040_User enters 'Project ABC' in the project name");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters role in the role input', async () => {
        await CudOperations.actions.setValue('Developer', workExperience.role);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("050_User enters 'Developer' in the role");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters date in the start date picker', async () => {
        await CudOperations.actions.setValue('Jan 1, 2020', workExperience.startDate);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('060_User enters 1st January 2020 as start date using the picker');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters date in the end date picker', async () => {
        await CudOperations.actions.setValue('Apr 30, 2020', workExperience.endDate);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('070_User enters 30th April 2020 as end date using the picker');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters company in the company input', async () => {
        await CudOperations.actions.setValue('ABC Company', workExperience.company);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("080_User enters company 'ABC Company' under company");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on the create button above the skills table', async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('100_User clicks on the create button above the skills table');
            });
        }
        for (let i = 0; i < 3; i++) {
            browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        }
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User types skill in the skill name input', async () => {
        await CudOperations.actions.fillEmptyInputSubPage('Skill Name 10 en');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("110_User types 'Skill Name 10 en' in the skill name");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User types proficiency level in the proficiency level name input', async () => {
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', 'Skill Name 10 en', 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("115_User types 'Proficiency Level Name 1.1 en' in the proficiency level name");
            });
        }
        await CudOperations.actions.selectFromDropdown('Proficiency Level Name 1.1 en');
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters comment in the comments section', async () => {
        const textArea = await element(by.control({ id: /myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::Comments::FormElement::DataField::comments::Field-edit$/, interaction: { idSuffix: 'inner' } }));
        await textArea.sendKeys('This is a comment');
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("120_User enters 'This is a comment' in comment");
            });
        }
        await browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on Apply', async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("130_User clicks on 'Apply'");
            });
        }
        await browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on Save', async () => {
        await BasicDataPage.parentElements.consultantHeaders.title.isPresent();
        const footer = await element(by.control({ id:'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar'}));
        await footer.click();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("140_User clicks on 'Save'");
            });
        }
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Clean up before next run
    it('Should delete the added external work experience assignment', async () => {
        // await CommonPageElements.objectPage.elements.editButton.isPresent();
        await CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.deleteMany('externalWorkExperience', 1, ['Project ABC']);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    // Navigate back to launchpage
    it('Should navigate back to launchpage', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
