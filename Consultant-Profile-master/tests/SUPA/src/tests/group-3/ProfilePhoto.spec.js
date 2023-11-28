const { SupaHelper } = require('../../utils/SupaHelper');
const { UPLOAD_PROFILE_PHOTO, TestHelper } = require('../../utils/TestHelper');
const path = require('path');
const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const BasicDataPage = require('../../../../end-to-end/src/tests/pages/BasicDataPage');

const DATAIMGPATH = path.resolve(__dirname, '../../data/profilePhotoData/profilePhoto.jpg');

describe('ProfilePhoto', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, UPLOAD_PROFILE_PHOTO);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeUploadProfilePhotoTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeUploadProfilePhotoTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeUploadProfilePhotoTest(supaHelper) {
    it('My Project Experience tile should appear and then user navigates to my project experience and clicks on edit', async () => {
        browser.wait(() => LaunchpadPage.elements.consultantProfileTile.isPresent(), 600000);
        await LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);
        await CommonPageElements.objectPage.elements.editButton.click();
    });

    it('User uploads image file', async () => {
        await BasicDataPage.actions.navigateToHeaderInfo();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.profilePhotoSection.isPresent(), 600000);
        
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('010_User uploads image file');
            });
        }
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATAIMGPATH);

        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        browser.wait(() => CommonPageElements.objectPage.elements.editButton.isPresent(), 600000);
    });

    it('Should delete the uploaded photo', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await BasicDataPage.actions.navigateToHeaderInfo();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.profilePhotoSection.isPresent(), 600000);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("030_User deletes photo");
            });
        }
        await BasicDataPage.basicData.elements.profilePhotoDeleteButton.click();
        
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Navigate back to launchpage
    it('Should navigate back to launchpage', async () => {
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
