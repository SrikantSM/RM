const testHelper = require("../utils/TestHelper");
const constants = require("./Constants");
require("../../../pages/flpPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/persoDialogPage");
require("../../../pages/headerPage");
require("../../../pages/filterPage");
require("../../../pages/variantPage");

const { browser, element, by } = require("protractor");
require("jasmine");

const cols = constants.columnIds;

describe("Variants Journey", function () {
	beforeAll(async function () {});

	afterAll(async function () {});

	testHelper.loginWithRole("ResourceManager");

	testHelper.it("Start App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
	});

	testHelper.it("Deleting Existing E2E Variant(If Present)", function () {
		When.onTheVariantPage.pressOpenButton();
		Then.onTheVariantPage.theVariantPopoverIsOpen();
		When.onTheVariantPage.pressManageButton();
		When.onTheVariantPage.pressDeleteButtonsUntilNotPresent();
		When.onTheVariantPage.pressManagementSaveButton();
	});

	testHelper.it("Change View", function () {
		When.onTheHeaderPage.selectView("Day");
	});

	testHelper.it("Hide a Column", function () {
		Then.onThePersoDialogPage.theDialogIsOpen();
		When.onThePersoDialogPage.selectCheckBox(3);
		When.onThePersoDialogPage.pressOkButton();
		Then.onTheTablePage.theColumnConfigurationIs([cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.ASSIGNMENT_STATUS]);
		When.onTheTablePage.pressFilterButton();
		When.onTheFilterPage.expandOrCollapseResourceFilterPanel();
		When.onTheFilterPage.expandOrCollapseUtilizationFilterPanel();
	});

	testHelper.it("Save new E2E Variant as Default Variant", function () {
		When.onTheVariantPage.pressOpenButton();
		Then.onTheVariantPage.theVariantPopoverIsOpen();
		When.onTheVariantPage.pressSaveAsButton();
		When.onTheVariantPage.enterName("E2E");
		When.onTheVariantPage.pressSaveAsDefaultVariant();
		When.onTheVariantPage.pressVariantSaveButton();
	});

	testHelper.it("Nack Back To FLP and Start App Again", function () {
		When.onTheFlpPage.iClickBack();
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		Then.onThePagePage.theAppIsVisible();
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theUtilizationFilterPanelIsNotExpanded();
		Then.onTheFilterPage.theResourceFilterPanelIsNotExpanded();
		Then.onTheFilterPage.theRequestFilterPanelIsExpanded();
	});

	testHelper.it("Save Back Standard Variant As Default Variant", function () {
		When.onTheVariantPage.pressOpenButton();
		Then.onTheVariantPage.theVariantPopoverIsOpen();
		When.onTheVariantPage.pressManageButton();
		When.onTheVariantPage.selectStandardAsDefaultVariant();
		When.onTheVariantPage.pressManagementSaveButton();
		When.onTheVariantPage.pressOpenButton();
		Then.onTheVariantPage.theVariantPopoverIsOpen();
		When.onTheVariantPage.pressVariantItem("Standard");
		Then.onTheFilterPage.theUtilizationFilterPanelIsExpanded();
		Then.onTheFilterPage.theResourceFilterPanelIsExpanded();
		Then.onTheFilterPage.theRequestFilterPanelIsExpanded();
	});

	testHelper.it("Select E2E Variant", function () {
		When.onTheVariantPage.pressOpenButton();
		Then.onTheVariantPage.theVariantPopoverIsOpen();
		When.onTheVariantPage.pressVariantItem("E2E");
		Then.onTheHeaderPage.theViewIs("Daily");
		Then.onTheFilterPage.theResourceFilterPanelIsNotExpanded();
		Then.onTheFilterPage.theUtilizationFilterPanelIsNotExpanded();
		Then.onTheFilterPage.theRequestFilterPanelIsExpanded();
		Then.onTheTablePage.theColumnConfigurationIs([cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.ASSIGNMENT_STATUS]);
	});

	testHelper.logout();
});