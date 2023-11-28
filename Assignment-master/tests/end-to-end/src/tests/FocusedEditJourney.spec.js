const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const constants = require("./Constants");
const { browser, element, by } = require("protractor");
require("jasmine");

require("../../../pages/flpPage");
require("../../../pages/headerPage");
require("../../../pages/page");
require("../../../pages/tablePage");
/**
 * Before the assertion to test the selected rows, an assertion  has been tested
 * to check the enablement of View Details Menu Item to introduce a delay for the row selection logic
 * to get executed before this test
 */
describe("FocusedEdit Journey", function () {
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

	testHelper.it("Row Selected, Check Deselect Button Funcitonality", function () {
		When.onTheTablePage.selectAssignmentRow("rowsel0");
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		Then.onTheTablePage.theRowsAreSelected([0, 1]);
		When.onTheTablePage.pressDeselectButton();
		Then.onTheTablePage.theRowsAreSelected([]);
	});

	testHelper.it("No Row Selected, Select 1 Resource - ACC01", function () {
		When.onTheTablePage.openRowContextMenu("rowsel0");
		Then.onTheTablePage.theFocusedEditContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theEditContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
	});

	testHelper.it("No Row Selected, Select 1 Assignment - ACC02", function () {
		When.onTheTablePage.closeContextMenu();
		When.onTheTablePage.clearAllRowSelection();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.openRowContextMenu("rowsel1");
		Then.onTheTablePage.theFocusedEditContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theEditContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		When.onTheTablePage.pressExpandArrowOfFirstResource();
	});

	testHelper.it("No Row Selected, Select 2 Assignment of 2 Selected Resources  - ACC03", function () {
		When.onTheTablePage.closeContextMenu();
		When.onTheTablePage.clearAllRowSelection();
		When.onTheTablePage.selectAssignmentRow("rowsel0");
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		Then.onTheTablePage.theRowsAreSelected([0, 1]);
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.pressExpandArrowOfSecondResource();
		When.onTheTablePage.selectAssignmentRow("rowsel3");
		When.onTheTablePage.pressExpandArrowOfSecondResource();
		When.onTheTablePage.openRowContextMenu("rowsel0");
		Then.onTheTablePage.theFocusedEditContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theEditContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
	});

	testHelper.it("No Selection - Check Edit Enabled - ACC04", function () {
		When.onTheTablePage.closeContextMenu();
		When.onTheTablePage.clearAllRowSelection();
		Then.onTheTablePage.theEditButtonIsEnabled(true);
	});

	testHelper.it("Edit Via Resources", function () {
		When.onTheTablePage.openRowContextMenu("rowsel0");
		When.onTheTablePage.pressFocusedEditToolbar(1);
		Then.onThePagePage.theFooterIsVisible();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
		When.onThePagePage.pressCancelButton();
	});

	testHelper.it("Edit Via Assignment", function () {
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.pressFocusedEditToolbar(1);
		Then.onThePagePage.theFooterIsVisible();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
		When.onThePagePage.pressCancelButton();
	});

	testHelper.it("Edit All Via ContextMenu", function () {
		When.onTheTablePage.selectAssignmentRow("rowsel0");
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		Then.onTheTablePage.theRowsAreSelected([0, 1]);
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.pressExpandArrowOfSecondResource();
		When.onTheTablePage.selectAssignmentRow("rowsel3");
		When.onTheTablePage.pressExpandArrowOfSecondResource();
		When.onTheTablePage.openRowContextMenu("rowsel0");
		When.onTheTablePage.pressEditContextMenuItem();
		Then.onThePagePage.theFooterIsVisible();
		Then.onTheHeaderPage.theTotalResourcesNumberIs(5);
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name1");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name2");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name3");
		Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible("UIVERI5_WP_Name4");
		When.onThePagePage.pressCancelButton();
	});

	testHelper.it("FocusedEdit & Save Assignment", function () {
		When.onTheTablePage.selectAssignmentRow("rowsel0");
		When.onTheTablePage.pressFocusedEditToolbar(1);
		Then.onThePagePage.theFooterIsVisible();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.editAssignment(35, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theAssignmentBookedCapacityIs("35", "/rows/0/assignments/0/utilization/1");
		When.onThePagePage.pressSaveButton();
		Then.onThePagePage.theErrorPopoverIsNotVisible();
	});

	testHelper.logout();
});
