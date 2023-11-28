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

	it("Expand first Resource", function () {
		Then.onTheTablePage.theExpandArrowIsVisibleForFirstResource();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("Resource Request 8");
	});

	it("Open Quick View", function () {
		When.onTheTablePage.pressWorkPackageName("Resource Request 8");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "Resource Request 8");
	});

	it("Navigate to Staff Resource Requests page", function () {
		When.onTheQuickViewPage.pressWorkPackageLink("Resource Request 8");
		browser.sleep(7000);
		//Switch the window to look for the controls in the newly opened window
		browser.driver.getAllWindowHandles().then(function (handles) {
			browser
				.switchTo()
				.window(handles[handles.length - 1])
				.then(function () {
					// load uiveri5 instrumentation so by.control works
					browser.loadUI5Dependencies();
					browser.sleep(6000);
					When.onTheFlpPage.waitForInitialAppLoad("staffResourceRequest::ResourceRequestObjectPage--fe::ObjectPage");
					Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
				});
		});
	});

	it("Should find Facets on Staff Resource Requests  App", function () {
		Then.onTheProcessResourceRequestPage.theProjectInfoFacetShouldBePresent();
		Then.onTheProcessResourceRequestPage.theResourceManagerInfoFacetShouldBePresent();
	});

	// it('Should Close the Current browser tab and switch to primary tab', function () {
	//     //Switch the window to look for the controls in the newly opened window
	//     browser.driver.getAllWindowHandles().then(function (handles) {
	//         browser.switchTo().window(handles[handles.length - 2]).then(function () {}).then(function () {
	//             browser.switchTo().window(handles[0])
	//             //Switch to previous tab
	//             .then(function () {
	//                // browser.close().window(handles[handles.length-1]);
	//                 Then.onTheResourceUtilizationViewPage.theAppIsVisible();
	//             });
	//              //close the current browser tab
	//         });
	//     });
	// });
	testHelper.logout();
}

module.exports.executeTest = executeTest; 
