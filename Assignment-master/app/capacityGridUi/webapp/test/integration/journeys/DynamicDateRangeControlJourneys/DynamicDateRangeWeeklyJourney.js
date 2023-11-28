/*global QUnit*/
sap.ui.define(
	["sap/ui/test/opaQunit", "../Constants", "sap/ui/core/ValueState", "../../pages/Header", "../../pages/MockServer", "../../pages/DynamicDateRange"],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Dynamic Date Range Weekly Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select Weekly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheHeader.theDateRangeMatches(/8.*Weeks/);
		});

		opaTest("Open Dynamic Date Range Control and check for the UI", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateRangeListHasLength(5);
			Then.onDynamicDateRange.theOptionIsVisible("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theOptionIsVisible("LASTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theOptionIsVisible("WEEKFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theOptionIsVisible("DATE_RANGE");
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXWEEKS", ["X"], true);
		});

		opaTest("Select Current Week + X Weeks and Validate for different Scenarios", function (Given, When, Then) {
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [8] });
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(1);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [1] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);

			// Change to Current + 3 Weeks
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("1");
			When.onDynamicDateRange.enterValueInStepInput(3);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [3] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);

			// Change to Current + 12 Weeks
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("3");
			When.onDynamicDateRange.enterValueInStepInput(12);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [12] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 13);

			// Change to Current + 22 Weeks
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("12");
			When.onDynamicDateRange.enterValueInStepInput(22);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [22] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 23);
		});

		opaTest("Press Cancel Button and check for the right Scenarios", function (Given, When, Then) {
			// Press Cancel Button and Check for no changes
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("22");
			When.onDynamicDateRange.enterValueInStepInput(12);
			When.onDynamicDateRange.pressCancelButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [22] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 23);
		});

		opaTest("Select Current Week - X Weeks and Validate for different Values", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXWEEKS", values: [22] });
			When.onDynamicDateRange.pressDateOptionByKey("LASTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(2);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXWEEKS", values: [2] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			// Change to Current - 8 Weeks
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("2");
			When.onDynamicDateRange.enterValueInStepInput(8);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXWEEKS", values: [8] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);

			// Change to Current + 12 Weeks
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(10);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXWEEKS", values: [10] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Change to diffeent Option and Cancel", function (Given, When, Then) {
			// Press Cancel Button and Check for no changes
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(2);
			When.onDynamicDateRange.pressCancelButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXWEEKS", values: [10] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Select Current Week - X / +Y Weeks and Validate for different Scenarios", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onDynamicDateRange.pressDateOptionByKey("WEEKFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("2");
			When.onDynamicDateRange.enterValueInStepInput(1);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "WEEKFROMTO", values: [1, 1] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			// Change to Current Week - 5 / + 5 Weeks
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("WEEKFROMTO", ["X", "Y"], true);
			When.onDynamicDateRange.pressDateOptionByKey("WEEKFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("1");
			When.onDynamicDateRange.enterValueInStepInput(5);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "WEEKFROMTO", values: [5, 5] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Select Free Week Range check for different scenarios", function (Given, When, Then) {
			// Test Defaulting previous values to Free Week Range
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("WEEKFROMTO", ["X", "Y"], true);
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);

			// Enter Free Range and Check for Table columns
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			When.onDynamicDateRange.enterDateRangeInput("Aug 16, 2023 - Sep 21, 2023");
			Then.onDynamicDateRange.theDateOptionDateRangeSelectorValueIs("Aug 14, 2023 - Sep 24, 2023");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			// Enter Free Range and Check for Table columns
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			Then.onDynamicDateRange.theDateOptionDateRangeSelectorValueIs("Aug 14, 2023 - Sep 24, 2023");
			When.onDynamicDateRange.enterDateRangeInput("Aug 17, 2023 - Nov 14, 2023");
			Then.onDynamicDateRange.theDateOptionDateRangeSelectorValueIs("Aug 14, 2023 - Nov 19, 2023");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 14);

			// Clear Header Input and check for default columns
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);
			Then.onTheHeader.theDateRangeValueStateIs("None");
		});

		opaTest("Enter different format and test for parsing", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Week + 2 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			When.onTheHeader.enterDateRange("Current Week +4 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);

			When.onTheHeader.enterDateRange("Current Week -5 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onTheHeader.enterDateRange("Current Week - 2 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			When.onTheHeader.enterDateRange("Current Week - 4 / + 2 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Aug 17, 2023 – Sep 20, 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onTheHeader.enterDateRange("Sep 17, 2023 – Aug 17, 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Enter standard option and check for adoption of horizontal pagination", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Week + 5 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			When.onTheHeader.pressNextButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onTheHeader.enterDateRange("Current Week - 4 / + 2 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			When.onTheHeader.pressPreviousButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
		});

		opaTest("Check for validation", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Week + 27 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_WEEK");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Current Week -12 / + 15 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_WEEK");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Curren Weeks - 6 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Current Week - 5 Weeks");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(27);
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_WEEK");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXWEEKS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXWEEKS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("27");
			When.onDynamicDateRange.enterValueInStepInput(4);
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheHeader.theDateRangeValueStateTextIs("");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
