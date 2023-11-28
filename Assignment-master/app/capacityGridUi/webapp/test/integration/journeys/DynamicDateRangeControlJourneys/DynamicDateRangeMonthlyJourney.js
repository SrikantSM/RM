/*global QUnit*/
sap.ui.define(
	["sap/ui/test/opaQunit", "../Constants", "sap/ui/core/ValueState", "../../pages/Header", "../../pages/MockServer", "../../pages/DynamicDateRange"],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Dynamic Date Range Monthly Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Open Dynamic Date Range Control and check for the UI", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateRangeListHasLength(5);
			Then.onDynamicDateRange.theOptionIsVisible("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theOptionIsVisible("LASTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theOptionIsVisible("MONTHFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theOptionIsVisible("MONTH_RANGE");
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXMONTHS", ["X"], true);
		});

		opaTest("Select Current Month + X Months and Validate for different Scenarios", function (Given, When, Then) {
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [6] });
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("6");
			When.onDynamicDateRange.enterValueInStepInput(1);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [1] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);

			// Change to Current + 3 Months
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("1");
			When.onDynamicDateRange.enterValueInStepInput(3);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [3] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);

			// Change to Current + 12 Months
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("3");
			When.onDynamicDateRange.enterValueInStepInput(12);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [12] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 13);

			// Change to Current + 22 Months
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("12");
			When.onDynamicDateRange.enterValueInStepInput(22);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [22] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 23);
		});

		opaTest("Press Cancel Button and check for the right Scenarios", function (Given, When, Then) {
			// Press Cancel Button and Check for no changes
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("22");
			When.onDynamicDateRange.enterValueInStepInput(12);
			When.onDynamicDateRange.pressCancelButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [22] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 23);
		});

		opaTest("Select Current Month - X Months and Validate for different Values", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXMONTHS", values: [22] });
			When.onDynamicDateRange.pressDateOptionByKey("LASTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("6");
			When.onDynamicDateRange.enterValueInStepInput(2);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXMONTHS", values: [2] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			// Change to Current - 8 Months
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("2");
			When.onDynamicDateRange.enterValueInStepInput(8);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXMONTHS", values: [8] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);

			// Change to Current + 12 Months
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(10);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXMONTHS", values: [10] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Change to diffeent Option and Cancel", function (Given, When, Then) {
			// Press Cancel Button and Check for no changes
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("6");
			When.onDynamicDateRange.enterValueInStepInput(2);
			When.onDynamicDateRange.pressCancelButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXMONTHS", values: [10] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Select Current Month - X / +Y Months and Validate for different Scenarios", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onDynamicDateRange.pressDateOptionByKey("MONTHFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("2");
			When.onDynamicDateRange.enterValueInStepInput(1);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "MONTHFROMTO", values: [1, 1] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			// Change to Current - 5 / + 5 Months
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("MONTHFROMTO", ["X", "Y"], true);
			When.onDynamicDateRange.pressDateOptionByKey("MONTHFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("1");
			When.onDynamicDateRange.enterValueInStepInput(5);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "MONTHFROMTO", values: [5, 5] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Select Free Month Range check for different scenarios", function (Given, When, Then) {
			// Test Defaulting previous values to Free Month Range
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("MONTHFROMTO", ["X", "Y"], true);
			When.onDynamicDateRange.pressDateOptionByKey("MONTH_RANGE");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);

			// Enter Free Range and Check for Table columns
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("MONTH_RANGE", null, true);
			When.onDynamicDateRange.pressDateOptionByKey("MONTH_RANGE");
			When.onDynamicDateRange.enterDateRangeInput("Aug 2023 - Jan 2024");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			// Enter Free Range and Check for Table columns
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("MONTH_RANGE", null, true);
			When.onDynamicDateRange.pressDateOptionByKey("MONTH_RANGE");
			Then.onDynamicDateRange.theDateOptionDateRangeSelectorValueIs("Aug 2023 - Jan 2024");
			When.onDynamicDateRange.enterDateRangeInput("Aug 2024 - Aug 2025");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 13);

			// Clear Header Input and check for default columns
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onDynamicDateRange.pressDateOptionByKey("MONTH_RANGE");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
			Then.onTheHeader.theDateRangeValueStateIs("None");
		});

		opaTest("Enter different format and test for parsing", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Month + 2 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			When.onTheHeader.enterDateRange("Current Month +4 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);

			When.onTheHeader.enterDateRange("Current Month -5 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onTheHeader.enterDateRange("Current Month - 2 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			When.onTheHeader.enterDateRange("Current Month - 4 / + 2 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Aug 2023 - Dec 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);

			When.onTheHeader.enterDateRange("Nov 2023 - Aug 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Enter standard option and check for adoption of horizontal pagination", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Month + 5 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			When.onTheHeader.pressNextButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("MONTH_RANGE", null, true);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onTheHeader.enterDateRange("Current Month - 4 / + 2 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			When.onTheHeader.pressPreviousButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("MONTH_RANGE", null, true);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
		});

		opaTest("Check for validation", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Month + 25 Months");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_MONTH");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Current Month -12 / + 13 Months");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_MONTH");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Curren Month - 6 Monhs");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Current Month - 5 Months");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("6");
			When.onDynamicDateRange.enterValueInStepInput(25);
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_MONTH");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXMONTHS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXMONTHS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("25");
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
