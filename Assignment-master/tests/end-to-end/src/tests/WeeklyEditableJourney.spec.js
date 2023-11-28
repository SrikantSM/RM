const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const constants = require("./Constants");
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

let oDateStart = dynamicDateGenerator.getISOcurrentDate(238);
let oDateEnd = dynamicDateGenerator.getISOcurrentDate(255);
const monthStart = dynamicDateGenerator.getCurrentMonth(238);
const monthEnd = dynamicDateGenerator.getCurrentMonth(255);
let utilHrs = { assignment1: 0, assignment2: 0 };
let staffedHrs = { assignment1: 0, assignment2: 0 };
let sDate =
	monthStart +
	" " +
	oDateStart.substr(8, 2) +
	"," +
	oDateStart.substr(0, 4) +
	" - " +
	monthEnd +
	" " +
	oDateStart.substr(8, 2) +
	"," +
	oDateEnd.substr(0, 4);

const assignmentStatus = constants.assignmentStatus;

describe("Weekly Editable Journey", function () {
	beforeAll(async function () {
		await DataSetup.initRepos();
		await DataSetup.cleanUpData();
		await DataSetup.insertData();
	});

	afterAll(async function () {
		await DataSetup.deleteAllAssignmentData();
		await DataSetup.deleteData();
	});

	testHelper.loginWithRole("ResourceManager");

	testHelper.it("Start App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	testHelper.it("Change View to Weekly ", function () {
		When.onTheHeaderPage.selectView("Week");
	});

	testHelper.it("Filter by Resource Org", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theVerticalFilterIsVisible();
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.pressGoButton();
	});

	testHelper.it("Edit & Save Assignment", function () {
		When.onTheTablePage.pressEditButton();
		Then.onThePagePage.theFooterIsVisible();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
		When.onTheTablePage.editAssignment(35, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("35", "/rows/0/assignments/0/utilization/1");
		When.onThePagePage.pressSaveButton();
		Then.onThePagePage.theErrorPopoverIsNotVisible();
	});

	testHelper.it("Select Time Period - Custom Range " + sDate, function () {
		When.onTheHeaderPage.changeDateRange(sDate);
	});

	testHelper.it("Select Time Period - 8 Weeks", function () {
		When.onTheHeaderPage.changeDateRange("Current Week + 7 Weeks");
	});

	testHelper.it("Store Utilization and Staffed Hrss", function () {
		When.onTheTablePage.pressEditButton();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.storeUtilizationHrs(utilHrs, "/rows/0/assignments/0/utilization/1", "assignment1");
		When.onTheTablePage.storeStaffedHrs(staffedHrs, "/rows/0/assignments/0", "assignment1");
		When.onTheTablePage.storeUtilizationHrs(utilHrs, "/rows/0/assignments/3/utilization/1", "assignment2");
		When.onTheTablePage.storeStaffedHrs(staffedHrs, "/rows/0/assignments/3", "assignment2");
	});
	testHelper.it("Discard Changes", function () {
		When.onTheTablePage.editAssignment(utilHrs.assignment1 + 2, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs((utilHrs.assignment1 + 2).toString(), "/rows/0/assignments/0/utilization/1");
		When.onTheTablePage.editAssignment(utilHrs.assignment2 + 4, "/rows/0/assignments/3/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs((utilHrs.assignment2 + 4).toString(), "/rows/0/assignments/3/utilization/1");
		When.onTheTablePage.changeAssignStatusStepByStep("/rows/0/assignments/0", assignmentStatus.HARD_BOOKED_STRING, assignmentStatus.HARD_BOOKED_TEXT);
		Then.onTheTablePage.theAssignmentStatusIs(assignmentStatus.HARD_BOOKED_STRING, "/rows/0/assignments/0");
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.pressDiscardButton();
		When.onTheTablePage.pressDiscardConfirmationOKButton();
		Then.onTheTablePage.theAssignmentBookedCapacityIs(utilHrs.assignment1.toString(), "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentStatusIs(assignmentStatus.SOFT_BOOKED_STRING, "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentBookedCapacityIs((utilHrs.assignment2 + 4).toString(), "/rows/0/assignments/3/utilization/1");
	});
	testHelper.it("Store Utilization and Staffed Hrs - Assignment 1", function () {
		When.onTheTablePage.storeUtilizationHrs(utilHrs, "/rows/0/assignments/0/utilization/1", "assignment1");
		When.onTheTablePage.storeStaffedHrs(staffedHrs, "/rows/0/assignments/0", "assignment1");
	});

	testHelper.it("Edit Assignment Status of Multiple Assignments - Assignment 1", function () {
		When.onTheTablePage.editAssignment(utilHrs.assignment1 + 2, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theUtilizationHrsAre(staffedHrs.assignment1 + 2 + " hr", "/rows/0/assignments/0");
		When.onTheTablePage.changeAssignStatusStepByStep("/rows/0/assignments/3", assignmentStatus.HARD_BOOKED_STRING, assignmentStatus.HARD_BOOKED_TEXT);
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.pressExpandArrowOfSecondResource();
	});

	testHelper.it("Store Utilization and Staffed Hrs - Assignment 2", function () {
		When.onTheTablePage.storeUtilizationHrs(utilHrs, "/rows/1/assignments/0/utilization/1", "assignment2");
		When.onTheTablePage.storeStaffedHrs(staffedHrs, "/rows/1/assignments/0", "assignment2");
	});
	testHelper.it("Discard Changes For Multiple Assignments", function () {
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.editAssignment(utilHrs.assignment1 + 5, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs((utilHrs.assignment1 + 5).toString(), "/rows/0/assignments/0/utilization/1");
		When.onTheTablePage.editAssignment(utilHrs.assignment2 + 3, "/rows/1/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs((utilHrs.assignment2 + 3).toString(), "/rows/1/assignments/0/utilization/1");
		When.onTheTablePage.changeAssignStatusStepByStep("/rows/1/assignments/0", assignmentStatus.HARD_BOOKED_STRING, assignmentStatus.HARD_BOOKED_TEXT);
		Then.onTheTablePage.theAssignmentStatusIs(assignmentStatus.HARD_BOOKED_STRING, "/rows/1/assignments/0");
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.selectAssignmentRow("rowsel7");
		When.onTheTablePage.pressDiscardButton();
		When.onTheTablePage.pressDiscardConfirmationOKButton();
		Then.onTheTablePage.theAssignmentBookedCapacityIs(utilHrs.assignment1.toString(), "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs(utilHrs.assignment2.toString(), "/rows/1/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentStatusIs(assignmentStatus.SOFT_BOOKED_STRING, "/rows/1/assignments/0");
	});
	testHelper.it("Edit Assignment Status of Multiple Assignments - Assignment 2", function () {
		When.onTheTablePage.editAssignment(utilHrs.assignment2 + 4, "/rows/1/assignments/0/utilization/1");
		Then.onTheTablePage.theUtilizationHrsAre(staffedHrs.assignment2 + 4 + " hr", "/rows/1/assignments/0");
		When.onTheTablePage.changeAssignStatusStepByStep("/rows/1/assignments/2", assignmentStatus.HARD_BOOKED_STRING, assignmentStatus.HARD_BOOKED_TEXT);
		When.onThePagePage.pressSaveButton();
		Then.onThePagePage.theMessagesButtonIsNotVisible();
	});

	testHelper.logout();
});