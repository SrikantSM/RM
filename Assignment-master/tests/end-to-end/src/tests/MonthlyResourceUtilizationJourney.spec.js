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

describe("Monthly Resource Utilization Journey", function () {
	beforeAll(async function () {
		await DataSetup.initRepos();
		await DataSetup.cleanUpData();
		await DataSetup.insertData();
	});

	afterAll(async function () {
		await DataSetup.deleteData();
	});

	testHelper.loginWithRole("ResourceManager");

	testHelper.it("Should navigate to Manage Resource Utilization App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	testHelper.it("Should Change the View to  Monthly ", function () {
		When.onTheHeaderPage.selectView("Month");
	});

	testHelper.it("Open the Filter Panel", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theVerticalFilterIsVisible();
	});

	testHelper.it("Filter by Resource Org", function () {
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 2 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 3 name For Asgn E2E test");
		When.onTheFilterPage.pressGoButton();
		When.onTheFilterPage.pressCloseButton();
	});

	//  testHelper.it("Select Time Period - Custom Range", function () {
	// 	When.onTheHeaderPage.pressTimeFrameValueHelp();
	// 	When.onTheDateRangePage.pressDateRangeSelect();
	// 	When.onTheDateRangePage.selectDateRangeTimePeriod();
	// 	When.onTheDateRangePage.changeDateRange("Jan,2022 - Mar,2022");
	// 	Then.onTheTablePage.theUtilizationValueIs(70, "/rows/0");
	// 	Then.onTheTablePage.theUtilizationValueIs(107, "/rows/1");
	// 	Then.onTheTablePage.theUtilizationValueIs(75, "/rows/2");
	// 	Then.onTheTablePage.theUtilizationValueIs(100, "/rows/3");
	// 	Then.onTheTablePage.theUtilizationValueIs(160, "/rows/4");
	// 	Then.onTheHeaderPage.theAvgUtilization(89);
	// 	Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	// 	Then.onTheHeaderPage.theFreeResourcesNumberIs(2);
	// 	Then.onTheHeaderPage.theOverbookedResourcesNumberIs(1);
	// });

	testHelper.it("Select Time Period - 12 Months", function () {
		When.onTheHeaderPage.changeDateRange("Current Month + 11 Months");
		Then.onTheTablePage.theColumnsCountIs(17);
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.it("Select Time Period - Past 2 and Next 3 Months", function () {
		When.onTheHeaderPage.changeDateRange("Current Month - 2 / + 2 Months");
		Then.onTheTablePage.theColumnsCountIs(10);
	});

	testHelper.it("Select Time Period - 6 Months", function () {
		When.onTheHeaderPage.changeDateRange("Current Month + 5 Months");
		Then.onTheTablePage.theColumnsCountIs(11);
		Then.onTheTablePage.theUtilizationValueIs(70, "/rows/0");
		Then.onTheTablePage.theUtilizationValueIs(107, "/rows/1");
		Then.onTheTablePage.theUtilizationValueIs(75, "/rows/2");
		Then.onTheTablePage.theUtilizationValueIs(100, "/rows/3");
		Then.onTheTablePage.theUtilizationValueIs(160, "/rows/4");
		Then.onTheHeaderPage.theAvgUtilization(89);
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
		Then.onTheHeaderPage.theFreeResourcesNumberIs(2);
		Then.onTheHeaderPage.theOverbookedResourcesNumberIs(1);
	});

	testHelper.it("Select Time Period - Custom Range and not see resource", function () {
		When.onTheHeaderPage.changeDateRange("Jan 2022 - May 2022");
		Then.onTheTablePage.theResourceIsNotVisible("Asg-Test Usere2e5");
		Then.onTheHeaderPage.theAvgUtilization(0);
		Then.onTheHeaderPage.theTotalResourcesNumberIs(4);
	});

	testHelper.it("Open Resource Quick View- User 2", function () {
		When.onTheTablePage.pressResourceNameLink("Asg-Test Usere2e2");
		Then.onTheQuickViewPage.theContactPopupIsVisible();
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Title", "Resource");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "Asg-Test Usere2e2 (Test Usere2e2)");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Consultant");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Contact Information");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Worker Type");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Mobile");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "+49-6227-31002");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Email");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "Usere2e2@sap.com");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Office Location");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Germany");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Organizational Information");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Resource Organization");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Cost Center");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Manager");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Asg-Test Usere2e2 (Test Usere2e2)");
	});

	testHelper.logout();
});
