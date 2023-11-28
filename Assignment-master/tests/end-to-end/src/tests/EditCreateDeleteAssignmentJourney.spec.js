const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const constants = require("./Constants");
const dynamicDateGenerator = require("./data/dynamicDateGenerator/dynamicDateGenerator");
require("jasmine");

require("../../../pages/filterPage");
require("../../../pages/flpPage");
require("../../../pages/headerPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/quickViewPage");

const assignmentStatus = constants.assignmentStatus;

describe("Create Assignment Journey", function () {
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

	testHelper.it("Filter by resource name", function () {
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.pressResetButton();
		When.onTheFilterPage.enterResourceName("Asg-Test Usere2e2");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.enterResourceName("Asg-Test Usere2e5");
		When.onTheFilterPage.selectActiveSuggestion();
		When.onTheFilterPage.pressGoButton();
	});

	testHelper.it("Add Assignment to Resource Asg-Test Usere2e2", function () {
		When.onTheTablePage.pressEditButton();
		When.onTheTablePage.selectAssignmentRow("rowsel0");
		When.onTheTablePage.pressAddButton();
		When.onTheTablePage.enterRequest("DISP_EX_7", "/rows/0/assignments/0");
		When.onTheTablePage.selectActiveSuggestion();
		When.onThePagePage.pressMessagePopoverButton();
		Then.onThePagePage.thePopoverMessageContains(
			"The assignment starts at " +
				dynamicDateGenerator.getISOcurrentDate(1) +
				", which is outside the selected time period. Adjust the time period to display the entire assignment."
		);
		When.onThePagePage.pressMessagePopoverCloseButton();
		Then.onTheTablePage.theUtilizationHrsAre("400 hr", "/rows/0/assignments/0");
		Then.onTheTablePage.theAssignmentStatusIs(assignmentStatus.HARD_BOOKED_STRING, "/rows/0/assignments/0");
		When.onTheTablePage.openRowContextMenu("rowsel0");
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		When.onTheTablePage.pressViewDetailsContextMenuItem();
		Then.onTheQuickViewPage.theContactPopupIsVisible();
	});

	testHelper.it("Save Assignment", function () {
		When.onThePagePage.pressSaveButton();
		Then.onThePagePage.theMessagesButtonIsNotVisible();
	});

	testHelper.it("Delete Assignment from Resource Asg-Test Usere2e5 with Error(Test Msg Target)", function () {
		When.onTheTablePage.pressEditButton();
		When.onTheTablePage.pressExpandArrowOfSecondResource();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.selectAssignmentRow("rowsel4");
		When.onTheTablePage.selectAssignmentRow("rowsel12");
		When.onTheTablePage.pressDeleteButton();
		Then.onThePagePage.theMsgDialogTitleTextIs(
			"The request UIVERI5_WP_Name8 has already been closed. Changes to the assignment are no longer possible."
		);
		Then.onThePagePage.theMsgDialogDescTextIs("Asg-Test Usere2e5 > UIVERI5_WP_Name8");
		When.onThePagePage.pressMsgDialogCloseButton();
	});

	testHelper.it("Delete Assignment from Resource Asg-Test Usere2e2", function () {
		When.onTheTablePage.selectAssignmentRow("rowsel12");
		When.onTheTablePage.pressDeleteButton();
		Then.onThePagePage.theMsgDialogIsNotVisible();
	});

	testHelper.it("Save Assignment", function () {
		When.onThePagePage.pressSaveButton();
		Then.onThePagePage.theMessagesButtonIsNotVisible();
	});

	testHelper.logout();
});