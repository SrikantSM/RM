require("../../pages/flpPage");
require("../../pages/filterPage");
require("../../pages/headerPage");
require("../../pages/quickViewPage");
require("../../pages/page");
require("../../pages/tablePage");
require("../pages/viewProjectExperiencePages");
require("../pages/processResourceRequestPages");

function executeTest(testHelper) {
	testHelper.loginWithRole("ResourceManager");

	it("Should navigate to Manage Resource Utilization App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	it("Assigned resource should be present in Table", function () {
		Then.onTheTablePage.theResourceRowIsFound(testHelper.dataAssignmentName());
	});

	it("Entering the resource name in filter should filter the resource name column", function () {
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.enterResourceName("Test Usere2e4");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheTablePage.theResourceRowIsFound("Test Usere2e4");
	});

	it("Clearing the filter should filter on all test users", function () {
		When.onTheFilterPage.clearNameFilterKey();
		When.onTheFilterPage.pressGoButton();
		When.onTheTablePage.pressFilterButton();
	});

	it("Should open contact details popup", function () {
		When.onTheTablePage.pressResourceNameLink(testHelper.dataResourceName());
		Then.onTheQuickViewPage.theContactPopupIsVisible();
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", testHelper.dataResourceNameExternalId());
	});

	it("Cross app navigation to View Project Experience App", function () {
		When.onTheQuickViewPage.pressResourceNameLink(testHelper.dataResourceNameExternalId());
		browser.sleep(7000);
		//Switch the window to look for the controls in the newly opened window
		browser.driver.getAllWindowHandles().then(function (handles) {
			browser
				.switchTo()
				.window(handles[handles.length - 1])
				.then(function () {
					// load uiveri5 instrumentation so by.control works
					browser.loadUI5Dependencies();
					When.onTheFlpPage.waitForInitialAppLoad("myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem");
					Then.onTheProjectExperienceViewPage.theViewProjectExperienceAppToBePresent();
				});
		});
	});

	// Now ResourceManager has been navigated to the MyResource App.
	// Logout
	testHelper.logout();
}

module.exports.executeTest = executeTest;