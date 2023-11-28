const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const constants = require("./Constants");
const { browser, element, by } = require("protractor");
require("jasmine");

require("../../../pages/filterPage");
require("../../../pages/flpPage");
require("../../../pages/headerPage");
require("../../../pages/quickViewPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/persoDialogPage");
require("../../../pages/variantPage");

const cols = constants.columnIds;

describe("Weekly Resource Utilization Journey", function () {
	beforeAll(async function () {
		await DataSetup.initRepos();
		await DataSetup.cleanUpData();
		await DataSetup.insertData();
	});

	afterAll(async function () {
		await DataSetup.deleteData();
	});

	testHelper.loginWithRole("ResourceManager");

	testHelper.it("Start App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	testHelper.it("Should Change the View to  Weekly ", function () {
		When.onTheHeaderPage.selectView("Week");
	});

	testHelper.it("Filter by Resource Org", function () {
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 2 name For Asgn E2E test");
		When.onTheFilterPage.pressGoButton();
		When.onTheFilterPage.pressCloseButton();
	});

	testHelper.it("Check Data", function () {
		Then.onTheTablePage.theTableIsVisible();
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e1");
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e2");
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e3");
	});

	testHelper.it("Select Time Period - Custom Range", function () {
		When.onTheHeaderPage.changeDateRange("Jun 1, 2022 - Jul 30, 2022");
		//Check on Header KPI's
		Then.onTheHeaderPage.theFreeResourcesNumberIs(5);
		Then.onTheHeaderPage.theOverbookedResourcesNumberIs(0);
		//Check on column header
		Then.onTheTablePage.theColumnsCountIs(14);
		Then.onTheTablePage.theColumnHeaderIsVisible("CW 22\nMay 30 - Jun 05");
		Then.onTheTablePage.theColumnHeaderIsVisible("CW 23\nJun 06 - Jun 12");
		//Check on column values
		Then.onTheTablePage.theUtilizationCellValueIs("0 %", "/rows/0/utilization/0");
		Then.onTheTablePage.theUtilizationCellValueIs("0 %", "/rows/0/utilization/1");
	});

	testHelper.it("Select Time Period - 8 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Current Week + 7 Weeks");
		Then.onTheTablePage.theColumnsCountIs(13);
	});

	testHelper.it("Select Time Period - 12 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Current Week + 11 Weeks");
		Then.onTheTablePage.theColumnsCountIs(17);
	});

	testHelper.it("Select Time Period - 26 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Current Week + 25 Weeks");
		Then.onTheTablePage.theColumnsCountIs(31);
	});

	testHelper.it("Select Time Period - Past and Next 3 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Current Week - 2 / + 3 Weeks");
		Then.onTheTablePage.theColumnsCountIs(11);
	});

	testHelper.it("Should Change the View Back to Monthly  ", function () {
		When.onTheHeaderPage.selectView("Month");
	});

	testHelper.logout();
});
