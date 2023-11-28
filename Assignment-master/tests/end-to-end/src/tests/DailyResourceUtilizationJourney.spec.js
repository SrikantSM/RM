const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const constants = require("./Constants");
const { employeeHeaders } = require("./data/employeeHeaders");
require("jasmine");

require("../../../pages/filterPage");
require("../../../pages/flpPage");
require("../../../pages/headerPage");
require("../../../pages/quickViewPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/persoDialogPage");
require("../../../pages/variantPage");

const employeeHeader1 = employeeHeaders[0].ID;
const source = constants.sourceString + employeeHeader1 + ")";

describe("Daily Resource Utilization Journey", function () {
	beforeAll(async function () {
		await DataSetup.initRepos();
		await DataSetup.cleanUpData();
		await DataSetup.insertData();
	});

	afterAll(async function () {
		await DataSetup.deleteData();
	});

	//function executeTest(testHelper) {
	testHelper.loginWithRole("ResourceManager");

	testHelper.it("Should navigate to Manage Resource Utilization App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	testHelper.it("Should Change the View to  Daily ", function () {
		When.onTheHeaderPage.selectView("Day");
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

	testHelper.it("Check KPIs", function () {
		Then.onTheHeaderPage.theAvgUtilLabelIsVisible();
		Then.onTheHeaderPage.theFreeResourcesLabelIsVisible();
		Then.onTheHeaderPage.theTotalResourcesLabelIsVisible();
		Then.onTheHeaderPage.theOverbookedResourcesLabelIsVisible();
		Then.onTheHeaderPage.theAvgUtilization(3);
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.it("Check Resource Data", function () {
		Then.onTheTablePage.theTableIsVisible();
		Then.onTheTablePage.theResourceNameColumnIsSorted();
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e1");
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e2");
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e3");
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e4");
		Then.onTheTablePage.theResourceIsVisible("Asg-Test Usere2e5");
	});

	testHelper.it("Select Time Period - Custom range", function () {
		When.onTheHeaderPage.changeDateRange("Jul 1, 2022 - Jul 15, 2022");
		Then.onTheTablePage.theColumnHeaderIsVisible("Fri\nJul 01");
		Then.onTheTablePage.theColumnHeaderIsVisible("Sat\nJul 02");
		Then.onTheTablePage.theColumnHeaderIsVisible("Sun\nJul 03");
		Then.onTheTablePage.theColumnHeaderIsVisible("Mon\nJul 04");
		Then.onTheTablePage.theColumnHeaderIsVisible("Tue\nJul 05");
		Then.onTheTablePage.theColumnsCountIs(20);
		Then.onTheHeaderPage.theFreeResourcesNumberIs(5);
		Then.onTheHeaderPage.theOverbookedResourcesNumberIs(0);
	});

	testHelper.it("Select Time Period - 4 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Today + 27 Days");
		Then.onTheTablePage.theColumnsCountIs(33);
	});

	testHelper.it("Select Time Period - Current Week", function () {
		When.onTheHeaderPage.changeDateRange("Today + 6 Days");
		Then.onTheTablePage.theColumnsCountIs(12);
	});

	testHelper.it("Select Time Period - 8 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Today + 55 Days");
		Then.onTheTablePage.theColumnsCountIs(61);
	});

	testHelper.it("Select Time Period - Past & Next 2 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Today - 7 / + 13 Days");
		Then.onTheTablePage.theColumnsCountIs(26);
	});

	testHelper.it("Open Resource Quick View- User 1", function () {
		When.onTheTablePage.pressResourceNameLink("Asg-Test Usere2e1");
		Then.onTheTablePage.theResourceProfilePhotoIsVisible("/rows/0");
		Then.onTheTablePage.theSourceOfProfilePhotoIs("/rows/0", source);
		Then.onTheQuickViewPage.theContactPopupIsVisible();
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Title", "Resource");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "Asg-Test Usere2e1 (Test Usere2e1)");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Associate Consultant");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Contact Information");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "External Worker");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Worker Type");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Mobile");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "+49-6227-31002");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Email");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "Usere2e1@sap.com");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Office Location");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Germany");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Organizational Information");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Resource Organization");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Cost Center");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Manager");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Asg-Test Usere2e1 (Test Usere2e1)");
	});

	testHelper.it("Should Change the View Back to Monthly  ", function () {
		When.onTheHeaderPage.selectView("Month");
	});

	testHelper.logout();
});
