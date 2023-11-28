require("../pages/processResourceRequestPages");
require("../../pages/flpPage");

function executeTest(testHelper) {

	testHelper.loginWithRole("ResourceManager");

	console.log("delete assign");

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("Navigate to the Resource Request Object Page", function () {
		const requestId = testHelper.testData.resourceRequest.displayId;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iSelectRequestStatus("Open");
		When.onTheProcessResourceRequestPage.iSelectStaffingStatus("Partially Staffed");
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
	});

	it("Navigate to Matching Resource Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, true);
		Then.onTheProcessResourceRequestPage.theAssignedResourcesCountIsGreaterThan(0);
	});

	it("Cancel assignment deletion", function () {
		When.onTheProcessResourceRequestPage.iClickTheTableRowDeleteButton(testHelper);
		Then.onTheProcessResourceRequestPage.theConfirmDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickTheConfirmDialogCancelButton();
	});

	it("Navigate to Assignments Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("Unassign", function () {
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "UnAssign_Cancel");
		When.onTheProcessResourceRequestPage.iClickTheTableRowDeleteButton(testHelper);
		When.onTheProcessResourceRequestPage.iClickTheConfirmDialogOkButton();
		browser.sleep(6000);
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldNotBePresent();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "UnAssign_OK");
	});

	testHelper.logout();
}

module.exports.executeTest = executeTest;
