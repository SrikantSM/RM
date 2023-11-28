const { SupaHelper } = require('../../utils/SupaHelper');
const { VIEW_MY_ASSIGNMENTS, TestHelper } = require('../../utils/TestHelper');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const MyAssignments = require('../../../../end-to-end/src/tests/pages/MyAssignmentsApp');
const { assignmentDetailsExtractor } = require('../../utils');

const { Key } = protractor;

let assignmentDetails = null;

describe('ViewMyAssignments', () => {
    const supaHelper = new SupaHelper();

    (async () => {
        assignmentDetails = await getAssignmentDetails();
        if (!assignmentDetails) {
            console.log('Assignment details could not be fetched.');
            process.exit(1);
        }
    })();
    // Scenario: F5991_View_My_Assignments
    const testHelper = new TestHelper(supaHelper, VIEW_MY_ASSIGNMENTS);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeViewMyAssignmentsTest(undefined);
    }

    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeViewMyAssignmentsTest(supaHelper);
    }

    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeViewMyAssignmentsTest(supaHelper) {
    // Prerequisite
    it('My Assignments tile should appear', () => {
        expect(LaunchpadPage.elements.MyAssignmentsTile.isPresent()).toBe(true);
    });
    // End of Prerequisite

    // Start of Measurement
    it('User clicks on the My Assignments App', async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement("010_User clicks on the 'My Assignments' app");
            });
        }
        browser.actions().sendKeys(Key.chord(Key.ARROW_RIGHT)).perform();
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        expect(await MyAssignments.actions.getAppTitle('My Assignments').isPresent()).toBeTruthy();
    });

    // Start of Measurement
    it('User specifies the month range', async () => {
        await MyAssignments.filterElements.weekButton.click();
        await MyAssignments.actions.navigatetoSpecificDate(assignmentDetails.startDate);
        await MyAssignments.filterElements.dateRangeSelect(assignmentDetails.startDate).click();
        
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('017_User specifies the month range');
            });
        }
        await MyAssignments.filterElements.monthButton.click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Start of Measurement
    it('User specifies the week range', async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('020_User specifies the week range');
            });
        }
        await MyAssignments.filterElements.weekButton.click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on assignment to view pop-up', async () => {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('030_User clicks on assignment to view pop-up');
            });
        }
        await MyAssignments.actions.selectDayAppointment(assignmentDetails.requestName).click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        expect(MyAssignments.popupElements.projectNameLabel.isPresent()).toBeTruthy();
    });

    
    // Start of Measurement
    it('User clicks on edit button', async () => {
        await MyAssignments.actions.selectDayAppointment(assignmentDetails.requestName).click();
        await MyAssignments.filterElements.monthButton.click();
        if(!MyAssignments.actions.selectDayAppointment(assignmentDetails.requestName).isPresent()) {
            await MyAssignments.filterElements.prevButton.click();
        }
        await MyAssignments.actions.selectDayAppointment(assignmentDetails.requestName).click();
        expect(MyAssignments.filterElements.editButton.isPresent()).toBeTruthy();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('040_User clicks on edit button');
            });
        }
        await MyAssignments.filterElements.editButton.click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // Start of Measurement
    it('User clicks on save button', async () => {
        const inputBoxValue = await MyAssignments.filterElements.inputBoxValue.asControl().getProperty('value');
        await MyAssignments.filterElements.inputBox(inputBoxValue).clear();
        await MyAssignments.filterElements.inputBox('').sendKeys('10');
        await MyAssignments.filterElements.inputBox('0').click();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('050_User clicks on save button');
            });
        }
        await MyAssignments.filterElements.saveButton(true).click();
        if (supaHelper) {
            supaHelper.sleep(2000);
            browser.controlFlow().execute(() => {
                supaHelper.stopSupaMeasurement();
            });
        }
        // Setting the previous value back
        await MyAssignments.actions.selectDayAppointment(assignmentDetails.requestName).click();
        await MyAssignments.filterElements.editButton.click();
        await MyAssignments.filterElements.inputBox('10').clear();
        await MyAssignments.filterElements.inputBox('').sendKeys(inputBoxValue);
        await MyAssignments.filterElements.inputBox('0').click();
        await MyAssignments.filterElements.saveButton(true).click();
    });

    it('should go to launchpad home', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}

async function getAssignmentDetails() {
    console.log('Invoking assignmentDetailsExtractor');
    const extractedDetails = await assignmentDetailsExtractor.extractAssignmentDetails();
    const formattedDate = new Date(extractedDetails.startDate);
    extractedDetails.startDate = formattedDate.toISOString().slice(0, 10).replace(/-/g, '');
    return extractedDetails;
}
