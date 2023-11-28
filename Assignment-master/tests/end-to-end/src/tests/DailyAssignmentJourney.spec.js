const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const dynamicDateGenerator = require("./data/dynamicDateGenerator/dynamicDateGenerator");
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

let oDateStart = dynamicDateGenerator.getISOcurrentDate(1);
let oDateEnd = dynamicDateGenerator.getISOcurrentDate(240);
const monthStart = dynamicDateGenerator.getCurrentMonth(1);
const monthEnd = dynamicDateGenerator.getCurrentMonth(240);
let startDate = monthStart + " " + oDateStart.substr(9, 1) + ", " + oDateStart.substr(0, 4);
let endDate = monthEnd + " " + oDateEnd.substr(8, 2) + ", " + oDateEnd.substr(0, 4);

describe("Daily Assignment Journey", function () {
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
		Then.onTheTablePage.theTableIsVisible();
	});

	testHelper.it("Select the Daily View", function () {
		When.onTheHeaderPage.selectView("Day");
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.it("Select Time Period - Current Week", function () {
		When.onTheHeaderPage.changeDateRange("Today + 6 Days");
		Then.onTheTablePage.theColumnsCountIs(12);
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
		Then.onTheTablePage.theTitleCountIs(5);
	});

	testHelper.it("Filter by Worker Type", function () {
		When.onTheFilterPage.enterWorkerType("Employee");
		When.onTheFilterPage.pressGoButton();
		Then.onTheTablePage.theTitleCountIs(3);
		When.onTheFilterPage.clearWorkerTypeFilterKey();
		When.onTheFilterPage.pressGoButton();
	});

	testHelper.it("Sort by Resource Name Descending", function () {
		Then.onTheTablePage.theColumnMenuIsVisible();
		Then.onTheTablePage.theColumnIsSortedDescending();
	});

	testHelper.it("Expand first Resource", function () {
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e5");
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
		Then.onTheTablePage.theColumnMenuIsVisible();
	});

	testHelper.it("Filter by resource name", function () {
		When.onTheFilterPage.enterResourceName("Asg-Test Usere2e1");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e1");
	});

	testHelper.it("Expand first Resource", function () {
		Then.onTheTablePage.theExpandArrowIsVisibleForFirstResource();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
	});

	testHelper.it("Close filter panel and verify if correct filters are displayed)", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheTablePage.theInfoToolbarTextIs("2 filters active: Name, Resource Organization");
	});

	testHelper.it("Should be able to Correct Utilization Data for the Current Window", function () {
		Then.onTheTablePage.theAssignmentBookedCapacityIs("2", "/rows/0/assignments/0/utilization/0");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("2", "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("3", "/rows/0/assignments/1/utilization/0");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("3", "/rows/0/assignments/1/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("3", "/rows/0/assignments/1/utilization/2");
	});

	testHelper.it("Open the Filter Panel", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theVerticalFilterIsVisible();
	});

	testHelper.it("Open Assignment Quick View", function () {
		When.onTheTablePage.pressWorkPackageName("UIVERI5_WP_Name2");
		Then.onTheQuickViewPage.theContactPopupIsVisible();
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Title", "Resource Request");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "UIVERI5_WP_Name2");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "DISP_EX_2");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Request Details");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Requested Resource Organization");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Res org 2 name For Asgn E2E test (E2ER2)");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Requested Start Date");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", startDate);
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Requested End Date");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", endDate);
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Request Status");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Resolved");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Staffing Summary");
		// Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Staffed / Required");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "1440 hr / 700 hr");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Remaining");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "-740 hr");
	});

	testHelper.it("Reset the filter", function () {
		When.onTheFilterPage.pressResetButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.logout();
});
