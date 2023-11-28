const { SupaHelper } = require('../../utils/SupaHelper');
const { VIEW_MY_RESOURCES, TestHelper } = require('../../utils/TestHelper');
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const myResourceListPage = require('../../../../end-to-end/src/tests/pages/myResourcePages/MyResourcesListPage.js');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');

const { Key } = protractor;

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);

describe('ViewMyResources', () => {
    // Helper classes objects
    const supaHelper = new SupaHelper();
    const testHelper = new TestHelper(supaHelper, VIEW_MY_RESOURCES);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeViewMyResourcesTest(undefined);
    }
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeViewMyResourcesTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeViewMyResourcesTest(supaHelper) {
    it('My Resources tile should appear', () => {
        browser.wait(() => LaunchpadPage.elements.MyResourcesTile.isPresent(), 600000);
    });

    it('User clicks on My Resources app', () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("010_User clicks on the 'My Resources' app");
            });
        }
        LaunchpadPage.actions.openMyResourcesApp();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on name of resource', async () => {
        await myResourceListPage.elements.tableTitle.click();
        for (let i = 0; i < 5; i++) {
            browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        }
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('020_User clicks on name of resource');
            });
        }
        await browser.actions().sendKeys(Key.ENTER).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User navigates to resource', async () => {
        await myResourceListPage.elements.tableTitle.click();
        for (let i = 0; i < 4; i++) {
            browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        }
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('030_User navigates to resource');
            });
        }
        await browser.actions().sendKeys(Key.ENTER).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('should go to launchpad home', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}
