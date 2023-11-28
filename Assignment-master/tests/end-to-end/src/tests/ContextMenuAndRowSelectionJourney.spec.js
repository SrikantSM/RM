const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const constants = require("./Constants");
const { browser, element, by } = require("protractor");
require("jasmine");

require("../../../pages/flpPage");
require("../../../pages/quickViewPage");
require("../../../pages/headerPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/persoDialogPage");
/**
 * Before the assertion to test the selected rows, an assertion  has been tested
 * to check the enablement of View Details Menu Item to introduce a delay for the row selection logic
 * to get executed before this test
 */
describe("ContextMenuAndRowSelection Journey", function () {
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
	testHelper.it("Click on Edit Context Menu Item", function () {
		When.onTheTablePage.openRowContextMenu("rowsel0");
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theEditContextMenuItemIsEnabled(true);
		When.onTheTablePage.pressEditContextMenuItem();
	});
	testHelper.it("No Row Selected,Right-Click Resource", function () {
		When.onTheTablePage.openRowContextMenu("rowsel0");
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theRowsAreSelected([0]);
		When.onTheTablePage.closeContextMenu();
		When.onTheTablePage.clearAllRowSelection();
	});

	testHelper.it(" Right-Click One of Selected Resource  of  1-n Selected Resources", function () {
		When.onTheTablePage.selectAssignmentRow("rowsel2");
		When.onTheTablePage.selectAssignmentRow("rowsel3");
		When.onTheTablePage.openRowContextMenu("rowsel2");
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theRowsAreSelected([2, 3]);
		When.onTheTablePage.closeContextMenu();
		When.onTheTablePage.clearAllRowSelection();
	});

	testHelper.it(" Right-Click on a Different Resource of  1-n Selected Resources", function () {
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.selectAssignmentRow("rowsel2");
		When.onTheTablePage.openRowContextMenu("rowsel4");
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		Then.onTheTablePage.theRowsAreSelected([4]);
		When.onTheTablePage.closeContextMenu();
		When.onTheTablePage.clearAllRowSelection();
	});

	testHelper.it("Click on View Details Context Menu Item", function () {
		When.onTheTablePage.openRowContextMenu("rowsel0");
		Then.onTheTablePage.theViewDetailsContextMenuItemIsEnabled(true);
		When.onTheTablePage.pressViewDetailsContextMenuItem();
		Then.onTheQuickViewPage.theContactPopupIsVisible();
	});

	testHelper.logout();
});
