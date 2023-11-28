const testHelper = require("../utils/TestHelper");
const DataSetup = require("./data/setup/DataSetup");
const { browser, element, by } = require("protractor");
require("jasmine");

require("../../../pages/filterPage");
require("../../../pages/flpPage");
require("../../../pages/page");
require("../../../pages/tablePage");
const dynamicDateGenerator = require("./data/dynamicDateGenerator/dynamicDateGenerator");
let utilHrs = { assignment1: 0, assignment2: 0 };

describe("Filter Resources With Edited Assignment Journey", function () {
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

	testHelper.it("Edit Assignments and Filter Edited Assignment", function () {
		Then.onTheTablePage.theFilterButtonIsVisible();
		When.onTheTablePage.pressEditButton();
		Then.onTheTablePage.theFilterButtonIsNotVisible();
		Then.onTheTablePage.theFilterDropDownIsVisible();
		When.onTheTablePage.pressExpandArrowOfSecondResource();
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
		Then.onTheTablePage.theFilterDropDownIsEnabled();
		When.onTheTablePage.selectAssignmentRow("rowsel0");
		When.onTheTablePage.selectAssignmentRow("rowsel7");
		When.onTheTablePage.pressDeleteButton();
		When.onTheTablePage.pressDropDown();
		When.onTheTablePage.selectChangedOption();
	});
	testHelper.it("Save the Edited Assignments in Filtered Mode", function () {
		Then.onTheTablePage.filterResourceIs("/rows/0");
		Then.onTheTablePage.filteredNewAssignmentIs("/rows/0/assignments/0");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/1");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/2");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/3");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/4");
		Then.onTheTablePage.filterResourceIs("/rows/1");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/0");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/1");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/2");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/3");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/4");
		When.onThePagePage.pressSaveButton();
		Then.onTheTablePage.theFilterButtonIsVisible();
	});
	testHelper.it("Edit few Assignments and Filter the Edited Assignments and Discard a Change", function () {
		When.onTheTablePage.pressEditButton();
		Then.onTheTablePage.theFilterButtonIsNotVisible();
		Then.onTheTablePage.theFilterDropDownIsVisible();
		When.onTheTablePage.pressExpandArrowOfSecondResource();
		When.onTheTablePage.pressExpandArrowOfFirstResource();
		When.onTheTablePage.editAssignment(utilHrs.assignment1 + 2, "/rows/0/assignments/0/utilization/1");
		Then.onTheTablePage.theFilterDropDownIsEnabled();
		When.onTheTablePage.selectAssignmentRow("rowsel9");
		When.onTheTablePage.pressDeleteButton();
		When.onTheTablePage.pressDropDown();
		When.onTheTablePage.selectChangedOption();
		When.onTheTablePage.selectAssignmentRow("rowsel1");
		When.onTheTablePage.pressDiscardButton();
		When.onTheTablePage.pressDiscardConfirmationOKButton();
	});
	testHelper.it("Cancel the Filtered Assignments", function () {
		Then.onTheTablePage.filterResourceIs("/rows/0");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/0");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/1");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/2");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/3");
		Then.onTheTablePage.filteredAssignmentIs("/rows/0/assignments/4");
		Then.onTheTablePage.filterResourceIs("/rows/1");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/0");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/1");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/2");
		Then.onTheTablePage.filteredAssignmentIs("/rows/1/assignments/3");
		When.onThePagePage.pressCancelButton();
		When.onThePagePage.pressCancelConfirmationOKButton();
		Then.onTheTablePage.theFilterButtonIsVisible();
	});

	testHelper.logout();
});