const LaunchpadPage = require("../pages/LaunchpadPage.js");
const MyAssignments = require('../pages/MyAssignmentsPage.js');

function executeTest(testHelper) {

    testHelper.loginWithRole('Consultant');

    it('Should navigate to My Assignments tile in non-edit mode', async function () {
        LaunchpadPage.actions.openMyAssignmentsApp();
        expect(MyAssignments.actions.getAppTitle('My Assignments').isPresent()).toBeTruthy();
    });

    it('Should not see the edit button on the assignment popover', async () => {
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design & Concept', '30.00 hr').click();
        expect(MyAssignments.elements.editButton.isPresent()).toBeFalsy();
    });

    testHelper.logout();

    testHelper.loginWithRole('Consultant3');

    it('Should navigate to My Assignments tile in edit mode', async function () {
        LaunchpadPage.actions.openMyAssignmentsApp();
        expect(MyAssignments.actions.getAppTitle('My Assignments').isPresent()).toBeTruthy();
    });

    it('Should click on the edit button on the assignment popover and check the basic data for the effort distribution dialog', async () => {
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.elements.editButton.click();

        //check for the labels and buttons in the edit dilaog
        expect(MyAssignments.editDialogElements.dialogLabel('Effort Distribution').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.requestedTimePeriodLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.backButton.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.nextButton.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.monthColumnLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.weeklyEffortLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.requiredEffortLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.hoursUnitLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.saveButton(true).isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.cancelButton.isPresent()).toBeTruthy();
    });

    it('Should change the value for weekly distribution and click on cancel, then update should not happen', async function () {
        expect(MyAssignments.editDialogElements.reqTimePeriodValue('Jan 1, 2017 - Dec 31, 2099').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.totalEffortsValue('30').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.inputBoxValue('0').clear();
        await MyAssignments.editDialogElements.inputBoxValue('').sendKeys('5');
        await MyAssignments.editDialogElements.inputBoxValue('0').click();

        await MyAssignments.editDialogElements.cancelButton.click();
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.elements.editButton.click();

        expect(MyAssignments.editDialogElements.totalEffortsValue('30').isPresent()).toBeTruthy();
    });

    it('Should input the decimal value for weekly distribution, then the save button should be disabled', async function () {
        expect(MyAssignments.editDialogElements.reqTimePeriodValue('Jan 1, 2017 - Dec 31, 2099').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.inputBoxValue('0').clear();
        await MyAssignments.editDialogElements.inputBoxValue('').sendKeys('7.5');
        expect(MyAssignments.editDialogElements.errorInputBoxValue('7.5', 'Error', 'Enter a number without decimals.').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.saveButton(false).isPresent()).toBeTruthy();
    });

    it('Should input the null value for weekly distribution, then the save button should be disabled', async function () {
        expect(MyAssignments.editDialogElements.reqTimePeriodValue('Jan 1, 2017 - Dec 31, 2099').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.inputBoxValue('0').clear();
        expect(MyAssignments.editDialogElements.errorInputBoxValue('', 'Error', 'Enter a number without decimals.').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.saveButton(false).isPresent()).toBeTruthy();
    });

    it('Should input the negative value for weekly distribution, then the save button should be disabled', async function () {
        expect(MyAssignments.editDialogElements.reqTimePeriodValue('Jan 1, 2017 - Dec 31, 2099').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.inputBoxValue('0').clear();
        await MyAssignments.editDialogElements.inputBoxValue('').sendKeys('-5');
        await MyAssignments.editDialogElements.inputBoxValue('0').click();
        expect(MyAssignments.editDialogElements.errorInputBoxValue('-5', 'Error', 'Enter a number greater than or equal to 0.').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.saveButton(false).isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.cancelButton.click();
    });

    it('Should input the same value for the weekly distribution and the info messagebox should be visible', async function () {
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.elements.editButton.click();
        expect(MyAssignments.editDialogElements.reqTimePeriodValue('Jan 1, 2017 - Dec 31, 2099').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.inputBoxValue('30').clear();
        await MyAssignments.editDialogElements.inputBoxValue('').sendKeys('3');
        await MyAssignments.editDialogElements.inputBoxValue('0').click();
        await MyAssignments.editDialogElements.inputBoxValue('3').sendKeys('0');
        await MyAssignments.editDialogElements.inputBoxValue('0').click();
        await MyAssignments.editDialogElements.saveButton(true).click();

        expect(MyAssignments.editDialogElements.dialogLabel('Information').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.infoDialogText.isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.okButton.click();

    });

    it('Should update the weekly distribution and check the updated data', async function () {
        expect(MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').isPresent()).toBeTruthy();
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '30.00 hr').click();
        await MyAssignments.elements.editButton.click();

        expect(MyAssignments.editDialogElements.reqTimePeriodValue('Jan 1, 2017 - Dec 31, 2099').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.inputBoxValue('30').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.totalEffortsValue('30').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.inputBoxValue('30').clear();
        await MyAssignments.editDialogElements.inputBoxValue('').sendKeys('35');
        await MyAssignments.editDialogElements.inputBoxValue('0').click();
        await MyAssignments.editDialogElements.saveButton(true).click();

        expect(MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '35.00 hr').isPresent()).toBeTruthy();

        await MyAssignments.actions.selectDayAppointmentWithAssigned('Design', '35.00 hr').click();
        await MyAssignments.elements.editButton.click();
        expect(MyAssignments.editDialogElements.inputBoxValue('35').isPresent()).toBeTruthy();
        expect(MyAssignments.editDialogElements.totalEffortsValue('35').isPresent()).toBeTruthy();

        await MyAssignments.editDialogElements.cancelButton.click();

    });


    testHelper.logout();
}

module.exports.executeTest = executeTest;
