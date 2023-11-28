require("../../pages/flpPage");
require("../../pages/headerPage");
require("../../pages/page");
require("../../pages/tablePage");
function executeTest(testHelper) {
	testHelper.loginWithRole("ResourceManager");

	it("Start App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	it("Check utilization Value", function () {
		Then.onTheHeaderPage.theAvgUtilizationIsGreaterThan(0);
		Then.onTheTablePage.theResourceRowIsFound(testHelper.dataAssignmentName());
	});

	// need to generate linked IDs for this
	// it('Resources assigned avg utilization should be greater than 0', function () {
	//     Then.onTheResourceUtilizationViewPage.theMontUtilization(testHelper.dataAssignmentName());
	// });

	testHelper.logout();
}

module.exports.executeTest = executeTest; 