require("../pages/processResourceRequestPages");
require("../../pages/flpPage");

function executeTest(testHelper) {
	testHelper.loginWithRole("ResourceManager");

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("S4-Int: Set Mock server to strict mode by creating an assignment with wp=Mockserver", function () {
		const requestId = testHelper.testData.resourceRequest.quickAssignNegativeRR;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
	});

	it("S4-Int:Should navigate to Object page & Navigate to Matching candidates section", function () {
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
	});

	it("S4-Int:Should create an Assignmnet to set the MockServer to strict mode", function () {
	    When.onTheProcessResourceRequestPage.iClickTablesAssignButtonS4(testHelper, 0);
	    When.onTheProcessResourceRequestPage.iEnterTheS4StrictInputs();
	    When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
	    Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
	});

	it("Nav back to ListReport Page", function () {
		browser.navigate().back();
	});

	testHelper.logout();
	testHelper.loginWithRole("ResourceManager");

	// Now open the resource request for positive scenario of assignment creation

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("S4-Int:assignment positive CRUD operations", function () {
		const requestId = testHelper.testData.resourceRequest.displayId;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("Navigate to Matching Resource Section", function () {
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, false); //StoreStaffedHrs
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
	});

	it("S4-Int: Create an assignment", function () {
		When.onTheProcessResourceRequestPage.iClickTablesAssignButtonS4(testHelper, 2);
		When.onTheProcessResourceRequestPage.iEnterTheS4StrictInputs();
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
	});

	it("Should navigate to Assignments section & staffed hours should be increased", function () {
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "Assign");
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, true); //StoreStaffedHrs
	});

	it("S4-Int: Edit/Change an assignment", function () {
		When.onTheProcessResourceRequestPage.iClickTablesUpdateButtonS4(testHelper, 2);
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iEnterTheS4StrictEditInputs();
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "EditAssign");
	});

	it("S4-Int: Delete an assignment", function () {
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, true);
		When.onTheProcessResourceRequestPage.iClickTheTableRowDeleteButton(testHelper);
		Then.onTheProcessResourceRequestPage.theConfirmDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickTheConfirmDialogOkButton();
		browser.sleep(2000);
	});


	// ----------------------------99 Create error scenario
	it("S4-Int: Should create an assignmnet with effort=99", function () {
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		When.onTheProcessResourceRequestPage.iClickTablesAssignButtonS4(testHelper, 1);
	});

	it("Should enter efforts as 99 & click assign button", function () {
		When.onTheProcessResourceRequestPage.iEnterTheS499Input();
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
	});

	it("Error dialog should be present", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldBePresent();
	});

	it("Error msg should contain - Work package RYPROJID.1.1", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogMsgContains("Work package RYPROJID.1.1: Employee 50000730 is already staffed to resource demand 0011.");
	});

	it("Should click on close button of error dialog", function () {
		When.onTheProcessResourceRequestPage.iClickTheErrorDialogCloseButton();
	});

	// ------------------------- Error in Delete, Update & Timeout WP Scenario
	it("Nav back to ListReport Page", function () {
		browser.navigate().back();
	});

	testHelper.logout();
	testHelper.loginWithRole("ResourceManager");

	// Now open the resource request for positive scenario of assignment creation

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("Navigate to the Resource Request Object Page", function () {
		const requestId = testHelper.testData.resourceRequest.s4negativeRR;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iSelectStaffingStatus("Partially Staffed");
		When.onTheProcessResourceRequestPage.iSelectRequestStatus("Open");
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("S4-Int: Edit/Change an assignment", function () {
		When.onTheProcessResourceRequestPage.iClickTablesUpdateButtonS4(testHelper, 3);
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iEnterTheAssignEditInputS4();
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
	});

	it("Error dialog should be present", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldBePresent();
	});

	it("Error msg is present", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogMsgContains("The HTTP response code (400) indicates an error.");
	});

	it("Should close error & Update dialog", function () {
		When.onTheProcessResourceRequestPage.iClickTheErrorDialogCloseButton();

	});

	//Temp fix for UI update 1.84.1, Remove this later
	it("Should refresh the browser to load new data", function () {
		browser.sleep(500);
		browser.driver.navigate().refresh();
		browser.loadUI5Dependencies();
		browser.sleep(5000);
	});

	it("Should navigate to Object page & Navigate to assignments section", function () {
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("S4-Int: Should Delete an assignment", function () {
		When.onTheProcessResourceRequestPage.iClickTheTableRowDeleteButton(testHelper);
		Then.onTheProcessResourceRequestPage.theConfirmDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickTheConfirmDialogOkButton();
	});

	it("Error dialog should be present", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldBePresent();
	});

	// it("Error msg is present - deletion failed", function () {
	// 	When.onTheProcessResourceRequestPage.iClickOnErrorMsgNav();
	// 	Then.onTheProcessResourceRequestPage.theErrorDialogMsgContains("The assignment could not be deleted.");
	// });

	it("Should close error & Delete dialog", function () {
		When.onTheProcessResourceRequestPage.iClickTheErrorDialogCloseButton();
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
	});

	//Timeout WP create Scenario
	it("Should click on table rows Assign Button & enter the efforts", function () {
		When.onTheProcessResourceRequestPage.iClickTablesAssignButtonS4(testHelper, 1);
		When.onTheProcessResourceRequestPage.iEnterTheS4StrictInputs();
	});

	it("Should click on Assign button of Assign Dialog", function () {
		When.onTheProcessResourceRequestPage.iClickTheAssignDialogOkButton();
	});

	it("Error dialog should be present", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldBePresent();
	});

	it("Error msg is present- Draft activation failed", function () {
		Then.onTheProcessResourceRequestPage.theErrorDialogMsgContains("The assignment could not be created.");
	});

	it("Should click on close button of error dialog", function () {
		When.onTheProcessResourceRequestPage.iClickTheErrorDialogCloseButton();
	});

	//---------------------------Delete The assignmnet to reset the mockserver to allow all mode
	it("Nav back to ListReport Page", function () {
		browser.navigate().back();
	});

	testHelper.logout();
	testHelper.loginWithRole("ResourceManager");

	// Now open the resource request for positive scenario of assignment creation

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("S4-Int: Should click on resource request with mockserver WP to reset", function () {
		const requestId = testHelper.testData.resourceRequest.quickAssignNegativeRR;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("Should click on table rows Unassign button & Click on OK", function () {
		When.onTheProcessResourceRequestPage.iClickTheTableRowDeleteButton(testHelper);
		When.onTheProcessResourceRequestPage.iClickTheConfirmDialogOkButton();
		browser.sleep(2000);
	});

	testHelper.logout();
}

module.exports.executeTest = executeTest;
