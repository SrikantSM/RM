const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const { browser, element, by } = require("protractor");
require("jasmine");

require("../../../pages/filterPage");
require("../../../pages/flpPage");
require("../../../pages/page");
require("../../../pages/tablePage");

let utilHrs = { assignment1: 0, assignment2: 0 };
let staffedHrs = { assignment1: 0, assignment2: 0 };

describe("Editable Journey", function () {
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

	testHelper.it("Filter by Resource Org", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theVerticalFilterIsVisible();
		When.onTheFilterPage.selectOrg("Res org 1 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 2 name For Asgn E2E test");
		When.onTheFilterPage.selectOrg("Res org 3 name For Asgn E2E test");
		When.onTheFilterPage.pressGoButton();
	});

	testHelper.it("Store Utilization and Staffed Hrs", function () {
		When.onTheTablePage.pressEditButton();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.storeUtilizationHrs(utilHrs, "/rows/0/assignments/0/utilization/1", "assignment1");
		When.onTheTablePage.storeStaffedHrs(staffedHrs, "/rows/0/assignments/0", "assignment1");
	});

	testHelper.it("Edit & Cancel Assignment, check for original data retained back", function () {
		When.onTheTablePage.editAssignment(utilHrs.assignment1 + 10, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theUtilizationHrsAre(staffedHrs.assignment1 + 10 + " hr", "/rows/0/assignments/0");
		When.onThePagePage.pressCancelButton();
		When.onThePagePage.pressCancelConfirmationOKButton();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theUtilizationHrsAre(staffedHrs.assignment1 + " hr", "/rows/0/assignments/0");
	});

	testHelper.logout();
});
