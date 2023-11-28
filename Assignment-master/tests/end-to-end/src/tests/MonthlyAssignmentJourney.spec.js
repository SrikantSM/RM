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
let oDate = new Date();
// Utilization Calculation for Asg-Test Usere2e3
const iPerDayUtilization = 2;
let oCurrentMonthUtilization = (new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0).getDate() * iPerDayUtilization).toString();
let oPreviousMonthUtilization = (new Date(oDate.getFullYear(), oDate.getMonth(), 0).getDate() * iPerDayUtilization).toString();
let oNextMonthUtilization = (new Date(oDate.getFullYear(), oDate.getMonth() + 2, 0).getDate() * iPerDayUtilization).toString();

describe("Monthly Assignment Journey", function () {
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

	testHelper.it("Change the View to Monthly", function () {
		When.onTheHeaderPage.selectView("Month");
	});

	testHelper.it("Select Time Period - Custom range", function () {
		When.onTheHeaderPage.changeDateRange("Mar 2022 - May 2022");
		Then.onTheTablePage.theColumnHeaderIsVisible("Mar 2022");
		Then.onTheTablePage.theColumnHeaderIsVisible("Apr 2022");
		Then.onTheTablePage.theColumnHeaderIsVisible("May 2022");
		Then.onTheTablePage.theColumnsCountIs(8);
	});

	testHelper.it("Select Time Period - Past 2 and Next 3 months", function () {
		When.onTheHeaderPage.changeDateRange("Current Month -2 / +2 Months");
		Then.onTheTablePage.theColumnsCountIs(10);
		Then.onTheHeaderPage.theFreeResourcesNumberIs(2);
	});

	testHelper.it("Filter by Cost Center", function () {
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.enterCostCenter("EXC2");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.enterCostCenter("EXC3");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheTablePage.theTitleCountIs(3);
	});

	testHelper.it("Expand First Resource", function () {
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e3");
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
	});

	testHelper.it("Close filters (to increase the table screen area and validate the data)", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheTablePage.theInfoToolbarTextIs("1 filter active: Cost Center");
	});

	testHelper.it("Should be able to see Correct Utilization Data for the Current Window", function () {
		Then.onTheTablePage.theAssignmentBookedCapacityIs(oPreviousMonthUtilization, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs(oCurrentMonthUtilization, "/rows/0/assignments/0/utilization/2");
		Then.onTheTablePage.theAssignmentBookedCapacityIs(oPreviousMonthUtilization, "/rows/0/assignments/1/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs(oCurrentMonthUtilization, "/rows/0/assignments/1/utilization/2");
		Then.onTheTablePage.theAssignmentBookedCapacityIs(oNextMonthUtilization, "/rows/0/assignments/1/utilization/3");
	});

	testHelper.it("Filter by resource name", function () {
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.enterResourceName("Asg-Test Usere2e4");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e4");
		When.onTheTablePage.pressExpandArrowOfFirstResource();
	});

	testHelper.it("Open Request Quick View", function () {
		When.onTheTablePage.pressWorkPackageName("UIVERI5_WP_Name3");
		Then.onTheQuickViewPage.theContactPopupIsVisible();
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Title", "Resource Request");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Link", "UIVERI5_WP_Name3");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "DISP_EX_3");
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Request Details");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Requested Resource Organization");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "Res org 3 name For Asgn E2E test (E2ER3)");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Requested Start Date");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", startDate);
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Requested End Date");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", endDate);
		Then.onTheQuickViewPage.theElementIsVisible("sap.ui.core.Title", "Staffing Summary");
		// Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Staffed / Required");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "1260 hr / 1300 hr");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Label", "Remaining");
		Then.onTheQuickViewPage.theElementIsVisible("sap.m.Text", "40 hr");
	});

	testHelper.it("Reset the filter", function () {
		When.onTheFilterPage.pressResetButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.logout();
});