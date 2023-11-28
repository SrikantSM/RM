const path = require('path');
const { SupaHelper } = require('../../utils/SupaHelper');
const { UPLOAD_AVAILABILITY_DATA, TestHelper } = require('../../utils/TestHelper');
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const AvailabilityDataListPage = require('../../../../end-to-end/src/tests/pages/AvailabilityDataListPage');
const AvailabilityCommonAssertion = require('../../../../end-to-end/src/tests/pages/AvailabilityCommonAssertion');
const AvailabilityUploadApp = require('../../../../end-to-end/src/tests/pages/AvailabilityUploadApp');
const { availabilityCsvWriter } = require('../../utils');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const uploadApp = 'application-availabilityUpload-Upload-component---app--uploadButton';
const DATACSVPATH = path.resolve(__dirname, '../../data/availabilityData/generated-availabilityData.csv');
const { Key } = protractor;

describe('UploadAvailability', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, UPLOAD_AVAILABILITY_DATA);
    testHelper.login();
    testHelper.configureSUPA();
    generateCSVData();
    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeAvailabilityUploadTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeAvailabilityUploadTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function generateCSVData() {
    it('Generating the availability CSV for upload', async () => {
        await availabilityCsvWriter.generateAvailabilityData();
    });
}

function executeAvailabilityUploadTest(supaHelper) {
    it("'Maintain Availability Data' tile should appear", () => {
        expect(LaunchpadPage.elements.AvailabilityDataTile.isPresent()).toBe(true);
    });

    it("User clicks on 'Maintain Availability Data' app", () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("010_User clicks on 'Maintain Availability Data' app");
            });
        }
        LaunchpadPage.actions.openAvailabilityDataApp();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("User clicks on the 'Upload' button to navigate to the Upload Avilability App", async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("020_User clicks on the 'Upload' button");
            });
        }
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
    });

    it('User uploads the Availability CSV File', async () => {
        expect(AvailabilityUploadApp.actions.getLabel('File').isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.actions.getLabel('Cost Center').isPresent()).toBeTruthy();
        await AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList('D0_2').click();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("060_User clicks on 'Upload Availability Data CSV File'");
            });
        }
        // await browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        // await browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        await AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Success');
    });

    // Cleanup

    it('should go to launchpad home', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
