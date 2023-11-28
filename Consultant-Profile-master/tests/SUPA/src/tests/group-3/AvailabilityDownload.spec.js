const { SupaHelper } = require('../../utils/SupaHelper');
const { DOWNLOAD_AVAILABILITY_TEMPLATE, TestHelper } = require('../../utils/TestHelper');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const AvailabilityDataListPage = require('../../../../end-to-end/src/tests/pages/AvailabilityDataListPage');
const AvailabilityDownloadApp = require('../../../../end-to-end/src/tests/pages/AvailabilityDownloadApp');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const { Key } = protractor;

describe('AvailabilityDownload', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, DOWNLOAD_AVAILABILITY_TEMPLATE);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeAvailabilityDownloadTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeAvailabilityDownloadTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeAvailabilityDownloadTest(supaHelper) {
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
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("User clicks on the 'Download Template' button", async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("020_User clicks on the 'Download Template' button");
            });
        }
        await AvailabilityDataListPage.actions.clickOnDownloadButton();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters data in the download page', async () => {
        const currentDate = new Date();
        let currentMonth = (currentDate.getMonth() + 1).toString();
        if (currentMonth.length !== 2) { currentMonth = `0${currentMonth}`; }
        const currentYear = currentDate.getFullYear().toString();
        const endYear = (currentDate.getFullYear() + 2).toString();
        const dateInput1 = `${currentYear + currentMonth}01`;
        const dateInput2 = `${endYear + currentMonth}01`;
        const firstDate = `${currentDate.toLocaleString('en-US', { month: 'short' })} 1, ${currentYear}`;
        const lastDate = `${currentDate.toLocaleString('en-US', { month: 'short' })} 1, ${endYear}`;
        await AvailabilityDownloadApp.fileDownloadForm.costCenterInput.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDownloadApp.fileDownloadForm.costCenterInput.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDownloadApp.fileDownloadForm.costCenterInput.sendKeys('D3_9');
        console.log('Cost center input: ', String(await AvailabilityDownloadApp.fileDownloadForm.costCenterSelectedInput.getAttribute('value')));
        expect(await AvailabilityDownloadApp.fileDownloadForm.costCenterSelectedInput.getAttribute('value')).toBe('D3_9');
        await AvailabilityDownloadApp.fileDownloadForm.datePickIcon.click();
        await AvailabilityDownloadApp.fileDownloadForm.date(dateInput1).click();
        await AvailabilityDownloadApp.fileDownloadForm.currentYear.click();
        await AvailabilityDownloadApp.fileDownloadForm.getYear(endYear).click();
        await AvailabilityDownloadApp.fileDownloadForm.date(dateInput2).click();
        await AvailabilityDownloadApp.fileDownloadForm.datePickOkButton.click();
        console.log('Date range value: ', String(await AvailabilityDownloadApp.fileDownloadForm.dateRangeInput.getAttribute('value')));
        expect(await AvailabilityDownloadApp.fileDownloadForm.dateRangeInput.getAttribute('value')).toBe(`${firstDate} - ${lastDate}`);
    });

    it("User clicks on the 'Download Template'", async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("050_User clicks on the 'Download Template'");
            });
        }
        for (let i = 0; i < 3; i++) {
            browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        }
        await browser.actions().sendKeys(Key.ENTER).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Navigate back to launchpage
    it('Should navigate back to launchpage', async () => {
        expect(AvailabilityDownloadApp.messageStrip.control.isPresent()).toBeFalsy();
        await CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
