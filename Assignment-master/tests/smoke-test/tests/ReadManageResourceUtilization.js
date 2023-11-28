require("../../pages/flpPage");
require("../../pages/filterPage");
require("../../pages/page");
require("../../pages/tablePage");

function executeTest(testHelper) {
	it("Should navigate to Manage Resource Utilization App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
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
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("Resource Request smoke");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("30", "/rows/0/assignments/0/utilization/0");
	});

	it("should navigate back to home page", function () {
		When.onTheFlpPage.iClickHomeButton();
	});
}
module.exports.executeTest = executeTest;
