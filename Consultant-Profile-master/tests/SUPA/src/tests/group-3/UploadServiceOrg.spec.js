const path = require('path');
const { SupaHelper } = require('../../utils/SupaHelper');
const { UPLOAD_SERVICE_ORGANIZATIONS, TestHelper } = require('../../utils/TestHelper');
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const ServiceOrgListPage = require('../../../../end-to-end/src/tests/pages/ServiceOrgListPage');
const ServiceOrgUploadApp = require('../../../../end-to-end/src/tests/pages/ServiceOrgUploadApp');
const { serviceOrgCsvWriter } = require('../../utils');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);

describe('UploadServiceOrg', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, UPLOAD_SERVICE_ORGANIZATIONS);
    testHelper.login();
    testHelper.configureSUPA();
    generateCSVData();
    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeUploadServiceOrganizationsTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeUploadServiceOrganizationsTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function generateCSVData() {
    it('Generating the availability CSV for upload', async () => {
        await serviceOrgCsvWriter.generateServiceOrgData();
    });
}

function executeUploadServiceOrganizationsTest(supaHelper) {
    it("'Maintain Service Organizations' tile should appear", () => {
        expect(LaunchpadPage.elements.ServiceOrganizationTile.isPresent()).toBe(true);
    });

    it("User clicks on 'Maintain Service Organizations' app", () => {
    // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("010_User clicks on 'Maintain Service Organization' app");
            });
        }
        LaunchpadPage.actions.openServiceOrganizationApp();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("User clicks on the 'Upload' button", async () => {
    // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("020_User clicks on the 'Upload' button");
            });
        }
        await ServiceOrgListPage.actions.clickOnUploadButton();
        if (supaHelper) {
            await LaunchpadPage.waitForInitialAppLoad('application-businessServiceOrgUi-upload-component---app--uploadButton');
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters the service org file input', async () => {
        const DATACSVPATH = path.resolve(__dirname, '../../data/serviceOrgData/generated-serviceOrgData.csv');
        await ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
    });

    it("User clicks on 'Upload Service Organization CSV File'", async () => {
    // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("060_User clicks on 'Upload Service Organization CSV File'");
            });
        }
        await ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        if (supaHelper) {
            supaHelper.sleep(3000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Navigate back to launchpage
    it('Should navigate back to launchpage', async () => {
        expect(ServiceOrgUploadApp.messageStrip.uploadText.asControl().getProperty('text')).toBe('1600 records processed: 20 service organizations created or updated');
        await CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
