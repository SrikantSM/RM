require("../pages/processResourceRequestPages");
require("../../pages/flpPage");

function executeTest(testHelper) {

	testHelper.loginWithRole("ResourceManager");

	console.log("quick assign");

	it("Start App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
		When.onTheFlpPage.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("Navigate to the Resource Request Object Page", function () {
		const requestId = testHelper.testData.resourceRequest.quickAssignNegativeRR;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iSelectRequestStatus("Open");
		When.onTheProcessResourceRequestPage.iSelectStaffingStatus("Not Staffed");
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
		Then.onTheProcessResourceRequestPage.theObjectPageSectionMatchingCandidatePresent();
	});

	it("Navigate to Matching Resource Section", function () {
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, false); //StoreStaffedHrs
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		Then.onTheProcessResourceRequestPage.theMatchingResourceTableCountIsGreaterThan(0);
	});

	it("Assignment creation Negative scenario", function () {
		When.onTheProcessResourceRequestPage.iClickTheTablesQuickAssignButton(testHelper);
	});


	it("Should click on close button of error dialog", function () {
	  When.onTheProcessResourceRequestPage.iClickTheErrorDialogCloseButton();
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
		let projectName = testHelper.testData.resourceRequest.projects[0].name; //'P1'+testRunID
		const requestId = testHelper.testData.resourceRequest.displayId;
		When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
		When.onTheProcessResourceRequestPage.iSelectRequestStatus("Open");
		When.onTheProcessResourceRequestPage.iSelectStaffingStatus("Not Staffed");
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
		// The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
		Then.onTheProcessResourceRequestPage.theObjectPageSectionMatchingCandidatePresent();
	});

	it("Navigate to Matching Resource Section", function () {
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, false); //StoreStaffedHrs
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
		Then.onTheProcessResourceRequestPage.theMatchingResourceTableCountIsGreaterThan(0);
	});

	it("Hard Booked Assignment creation Via Quick Assign Positive scenario", function () {
		When.onTheProcessResourceRequestPage.iClickTheTablesQuickAssignButton(testHelper);
		browser.sleep(6000);
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldNotBePresent();
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		Then.onTheProcessResourceRequestPage.theAssignStatusTextShouldBe("Hard-Booked"); 
		// Then.onTheProcessResourceRequestPage.theAssignStatusSwitchShouldBeDisabled();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "Assign");
	});

	it("Navigate to Matching Resource Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
		//Temp fix for UI update 1.84.1, Remove this once fixed from UI5
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("Delete the Assignment that was just created", function () {
		Then.onTheProcessResourceRequestPage.storeStafferHrs(testHelper, true);
		Then.onTheProcessResourceRequestPage.theAssignedResourcesCountIsGreaterThan(0);
		When.onTheProcessResourceRequestPage.iClickTheTableRowDeleteButton(testHelper);
		Then.onTheProcessResourceRequestPage.theConfirmDialogShouldBePresent();
		When.onTheProcessResourceRequestPage.iClickTheConfirmDialogOkButton();
		browser.sleep(6000);
		Then.onTheProcessResourceRequestPage.theErrorDialogShouldNotBePresent();
		Then.onTheProcessResourceRequestPage.theStaffingHoursValueChanged(testHelper, "UnAssign_OK");
	});

	testHelper.logout();
}

module.exports.executeTest = executeTest;
