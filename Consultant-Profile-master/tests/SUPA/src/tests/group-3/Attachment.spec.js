const { SupaHelper } = require('../../utils/SupaHelper');
const { UPLOAD_ATTACHMENT, TestHelper } = require('../../utils/TestHelper');
const path = require('path');
const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const AttachmentElements = require('../../../../end-to-end/src/tests/pages/Attachment');
const BasicDataPage = require('../../../../end-to-end/src/tests/pages/BasicDataPage');

const TESTRESUMEPATH = path.resolve(__dirname, '../../data/attachmentData/test_resume.pdf');

describe('Attachment', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, UPLOAD_ATTACHMENT);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeUploadAttachmentTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeUploadAttachmentTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeUploadAttachmentTest(supaHelper) {
    it('My Project Experience tile should appear and then user navigates to my project experience and clicks on edit', async () => {
        browser.wait(() => LaunchpadPage.elements.consultantProfileTile.isPresent(), 600000);
        await LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);
        await CommonPageElements.objectPage.elements.editButton.click();
    });

    it('User uploads pdf file', async () => {
        AttachmentElements.actions.navigateToAttachments();
        browser.wait(() => AttachmentElements.parentElements.attachmentSection.isPresent(), 600000);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('010_User uploads pdf file');
            });
        }
        await AttachmentElements.basicData.elements.attachmentFileUpload.sendKeys(TESTRESUMEPATH);

        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        browser.wait(() => CommonPageElements.objectPage.elements.editButton.isPresent(), 600000);
    });

    it('Should delete the uploaded file', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        AttachmentElements.actions.navigateToAttachments();
        browser.wait(() => AttachmentElements.parentElements.attachmentSection.isPresent(), 600000);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("030_User deletes file");
            });
        }
        await AttachmentElements.basicData.elements.attachmentDeleteButton.click();
        
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('Should navigate back to launchpage', async () => {
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}