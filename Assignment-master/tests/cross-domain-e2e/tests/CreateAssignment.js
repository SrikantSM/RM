require("../pages/processResourceRequestPages");
require("../../pages/flpPage");

function executeTest(testHelper) {
	testHelper.loginWithRole("ResourceManager");

	console.log("create assign");

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("Navigate to the Resource Request Object Page", function () {
		const requestId = testHelper.testData.resourceRequest.displayId;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iSelectStaffingStatus("Not Staffed");
		When.onTheProcessResourceRequestPage.iSelectRequestStatus("Open");
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
		Then.onTheProcessResourceRequestPage.theObjectPageSectionMatchingCandidatePresent();
	});

	it("Navigate to Matching Resource Section", function () {
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, false); // before create
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		Then.onTheProcessResourceRequestPage.theMatchingResourceTableCountIsGreaterThan(0);
	});

	it("Assignment creation Positive scenario - Create Soft Booked Assignment", function () {
		When.onTheProcessResourceRequestPage.iClickTheTablesAssignButton(testHelper);
		When.onTheProcessResourceRequestPage.iEnterTheAssignActionInputs(testHelper);
		When.onTheProcessResourceRequestPage.iSelectAssignmentStatusinPopUp(1); // Creating Soft Booked Assignment
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "Assign");
	});

	it("Change Assignment Status to Hard-Booked", function () {
		When.onTheProcessResourceRequestPage.iClickTheTablesUpdateButton(testHelper);
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iSelectAssignmentStatusinPopUp(0); // Creating Soft Booked Assignment
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		Then.onTheProcessResourceRequestPage.theAssignStatusTextShouldBe("Hard-Booked"); 
	});

	it("Edit Hard Booked Assignment", function () {
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, true); // before edit
		When.onTheProcessResourceRequestPage.iClickTheTablesUpdateButton(testHelper);
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iEnterTheAssignEditInputs(testHelper);
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "EditAssign");
	});

	

	it("Navigate to Matching Resource Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		Then.onTheProcessResourceRequestPage.theMatchingResourceTableCountIsGreaterThan(0);
	});

	it("Assignment creation with dates out of RR date", function () {
		When.onTheProcessResourceRequestPage.iClickTheTablesAssignButtonNeg(testHelper);
		When.onTheProcessResourceRequestPage.iEnterTheAssignInputsOutOfRR(testHelper);
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldBePresent();
		//When.onTheProcessResourceRequestPage.iClickOnErrorMsgNav();
		Then.onTheProcessResourceRequestPage.theErrorDialogMsgContains("Please enter an end date within the request period.");
		When.onTheProcessResourceRequestPage.iClickTheErrorDialogCloseButton();
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogCancelButton();
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
	});

	it("Assignment creation without dates", function () {
		When.onTheProcessResourceRequestPage.iClickTheTablesAssignButtonNeg(testHelper);
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iClearTheAssignActionInputs(testHelper);
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		browser.sleep(2000);
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogCancelButton();
	});

	testHelper.logout();
}

module.exports.executeTest = executeTest;
