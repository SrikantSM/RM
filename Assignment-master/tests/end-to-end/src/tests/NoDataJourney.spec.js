const testHelper = require("../utils/TestHelper");
require("../../../pages/flpPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/persoDialogPage");
require("../../../pages/headerPage");
require("../../../pages/filterPage");
const testEnvironment = require("../utils");
const { CsvParser } = require("test-commons");

const { browser, element, by } = require("protractor");
require("jasmine");

describe("No Data Journey", function () {
	testHelper.loginWithRole("ResourceManager");

	testHelper.it("Start App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	testHelper.it("Check KPIs", function () {
		Then.onTheHeaderPage.theAvgUtilLabelIsVisible();
		Then.onTheHeaderPage.theFreeResourcesLabelIsVisible();
		Then.onTheHeaderPage.theTotalResourcesLabelIsVisible();
		Then.onTheHeaderPage.theOverbookedResourcesLabelIsVisible();
		Then.onTheHeaderPage.theAvgUtilization(0);
		Then.onTheHeaderPage.theTotalResourcesNumberIs(0);
		Then.onTheHeaderPage.theFreeResourcesNumberIs(0);
		Then.onTheHeaderPage.theOverbookedResourcesNumberIs(0);
	});

	testHelper.it("Check Misc", function () {
		Then.onTheTablePage.theTableIsVisible();
		Then.onTheTablePage.theResourceNameColumnIsSorted();
	});

	testHelper.logout();
});
