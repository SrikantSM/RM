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

describe("Weekly Assignment Journey", function () {
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

	testHelper.it("Should Change the View to  Weekly ", function () {
		When.onTheHeaderPage.selectView("Week");
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
		Then.onTheHeaderPage.theFreeResourcesNumberIs(2);
	});

	testHelper.it("Select Time Period - Next 8 Calendar Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Current Week + 7 Weeks");
		Then.onTheTablePage.theColumnsCountIs(13);
	});

	testHelper.it("Filter by Utilization 80%-110% and verify if correct resources are displayed", function () {
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.selectUtilization(2);
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(2);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e2");
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e4");
	});

	testHelper.it("Filter by Resource ORG", function () {
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(2);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e2");
	});

	testHelper.it("Expand first Resource", function () {
		Then.onTheTablePage.theExpandArrowIsVisibleForFirstResource();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
	});

	testHelper.it("Reset the filter", function () {
		When.onTheFilterPage.pressResetButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.it("Filter by Min Free Hours and verify if correct resources are displayed", function () {
		When.onTheFilterPage.enterMinFreeHour(6);
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(2);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e1");
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e3");
	});

	testHelper.it("Reset the filter", function () {
		When.onTheFilterPage.pressResetButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.it("Filter by Project and verify if correct resources are displayed", function () {
		When.onTheFilterPage.enterProject("P_ID5_UIVERI5_EX");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(2);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e2");
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e3");
		When.onTheFilterPage.clearProjectFilterKey();
	});

	testHelper.it("Filter by Customer and verify if correct resources are displayed", function () {
		When.onTheFilterPage.enterCustomer("17100005");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(2);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e2");
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e3");
		When.onTheFilterPage.clearCustomerFilterKey();
	});

	testHelper.it("Filter by Project Role and verify if correct resources are displayed", function () {
		When.onTheFilterPage.enterProjectRole("BE Developer");
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(1);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e3");
		When.onTheFilterPage.clearProjectRoleFilterKey();
	});

	testHelper.it("Filter by Request  and verify if correct resources are displayed", function () {
		When.onTheFilterPage.enterRequest("DISP_EX_5");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(1);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e2");
		When.onTheFilterPage.clearRequestFilterKey();
	});

	testHelper.it("Filter by Reference Object and Reference Object Type and verify if correct resources are displayed", function () {
		When.onTheFilterPage.enterReferenceObject("Ref Object 1");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.enterReferenceObjectType("Project");
		When.onTheFilterPage.pressGoButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
		Then.onTheTablePage.theResourceRowIsFound("Asg-Test Usere2e1");
		When.onTheFilterPage.clearReferenceObjectFilterKey();
		When.onTheFilterPage.clearReferenceObjectTypeFilterKey();
	});

	testHelper.it("Verify data for Project, Customer, Project Role, Request and Reference Object Columns", function () {
		When.onTheFilterPage.enterResourceName("Asg-Test Usere2e1");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
		Then.onThePersoDialogPage.theDialogIsOpen();
		When.onThePersoDialogPage.selectCheckBox(5);
		When.onThePersoDialogPage.selectCheckBox(6);
		When.onThePersoDialogPage.selectCheckBox(7);
		When.onThePersoDialogPage.selectCheckBox(8);
		When.onThePersoDialogPage.selectCheckBox(9);
		When.onThePersoDialogPage.selectCheckBox(10);
		When.onThePersoDialogPage.selectCheckBox(11);
		When.onThePersoDialogPage.selectCheckBox(12);
		When.onThePersoDialogPage.selectCheckBox(13);
		When.onThePersoDialogPage.pressOkButton();
		Then.onTheTablePage.theExpandArrowIsVisibleForFirstResource();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theResourceCostCenterIs(" (EXC1)", "/rows/0");
		Then.onTheTablePage.theAssignmentCustomerIs("CAD International Customer 1 (17100001)", "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentProjectIs("UIVeri5 Test Project 1 (P_ID1_UIVERI5_EX)", "/rows/0/assignments/0");
		Then.onTheTablePage.theRequestStatusIs("Open", "/rows/0/assignments/0");
		Then.onTheTablePage.theworkItemNameIs("", "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentProjectRoleIs("Architect", "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentRequestIs("UIVERI5_WP_Name1 (DISP_EX_1)", "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentReferenceObjectIs("Ref Object 1-E2E (Ref Object 1)", "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentReferenceObjectTypeIs("Project", "/rows/0/assignments/0");
		Then.onThePersoDialogPage.theDialogIsOpen();
		When.onThePersoDialogPage.pressResetButton();
		When.onThePersoDialogPage.pressOkButton();
	});

	testHelper.it("Reset the filter", function () {
		When.onTheFilterPage.pressResetButton();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
	});

	testHelper.logout();
});
