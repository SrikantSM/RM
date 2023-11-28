/*global QUnit*/
sap.ui.define(
	["sap/ui/test/opaQunit", "../Constants", "sap/ui/core/ValueState", "../../pages/Header", "../../pages/MockServer", "../../pages/DynamicDateRange"],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Dynamic Date Range Daily Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select Daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
		});

		opaTest("Open Dynamic Date Range Control and check for the UI", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateRangeListHasLength(5);
			Then.onDynamicDateRange.theOptionIsVisible("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theOptionIsVisible("LASTXDAYS", ["X"]);
			Then.onDynamicDateRange.theOptionIsVisible("DAYFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theOptionIsVisible("DATE_RANGE");
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXDAYS", ["X"], true);
		});

		opaTest("Select Today + X Days and Validate for different Scenarios", function (Given, When, Then) {
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [28] });
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("28");
			When.onDynamicDateRange.enterValueInStepInput(1);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [1] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);

			// Change to Today + 20 Days
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("1");
			When.onDynamicDateRange.enterValueInStepInput(20);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [20] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 21);

			// Change to Today + 36 Days
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("20");
			When.onDynamicDateRange.enterValueInStepInput(36);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [36] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 37);

			// Change to Today + 22 Days
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("36");
			When.onDynamicDateRange.enterValueInStepInput(22);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [22] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 23);
		});

		opaTest("Press Cancel Button and check for the right Scenarios", function (Given, When, Then) {
			// Press Cancel Button and Check for no changes
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("22");
			When.onDynamicDateRange.enterValueInStepInput(12);
			When.onDynamicDateRange.pressCancelButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [22] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 23);
		});

		opaTest("Select Today - X Days and Validate for different Values", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "NEXTXDAYS", values: [22] });
			When.onDynamicDateRange.pressDateOptionByKey("LASTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("28");
			When.onDynamicDateRange.enterValueInStepInput(2);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXDAYS", values: [2] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			// Change to Today - 8 Days
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("2");
			When.onDynamicDateRange.enterValueInStepInput(8);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXDAYS", values: [8] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);

			// Change to Current + 12 Days
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("8");
			When.onDynamicDateRange.enterValueInStepInput(10);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXDAYS", values: [10] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Change to diffeent Option and Cancel", function (Given, When, Then) {
			// Press Cancel Button and Check for no changes
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("LASTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("10");
			When.onDynamicDateRange.enterValueInStepInput(2);
			When.onDynamicDateRange.pressCancelButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "LASTXDAYS", values: [10] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Select Today - X / +Y Days and Validate for different Scenarios", function (Given, When, Then) {
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onDynamicDateRange.pressDateOptionByKey("DAYFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("14");
			When.onDynamicDateRange.enterValueInStepInput(12);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "DAYFROMTO", values: [12, 12] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 25);

			// Change to Current Days - 5 / + 5 Days
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DAYFROMTO", ["X", "Y"], true);
			When.onDynamicDateRange.pressDateOptionByKey("DAYFROMTO", ["X", "Y"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("12");
			When.onDynamicDateRange.enterValueInStepInput(5);
			When.onDynamicDateRange.pressApplyButton();
			Then.onDynamicDateRange.theDateRangeInputValueByI18nKey({ key: "DAYFROMTO", values: [5, 5] });
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
		});

		opaTest("Select Free Date Range, check for different scenarios", function (Given, When, Then) {
			// Test Defaulting previous values to Free Date Range
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DAYFROMTO", ["X", "Y"], true);
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);

			// Enter Free Range and Check for Table columns
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			When.onDynamicDateRange.enterDateRangeInput("Aug 16, 2023 - Sep 16, 2023");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 32);

			// Enter Free Range and Check for Table columns
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			Then.onDynamicDateRange.theDateOptionDateRangeSelectorValueIs("Aug 16, 2023 - Sep 16, 2023");
			When.onDynamicDateRange.enterDateRangeInput("Aug 17, 2023 - Aug 31, 2023");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 15);

			// Clear Header Input and check for default columns
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onDynamicDateRange.pressDateOptionByKey("DATE_RANGE");
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 29);
			Then.onTheHeader.theDateRangeValueStateIs("None");
		});

		opaTest("Enter different format and test for parsing", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 2 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 3);

			When.onTheHeader.enterDateRange("Today +4 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);

			When.onTheHeader.enterDateRange("Today -5 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onTheHeader.enterDateRange("Today - 14 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 15);

			When.onTheHeader.enterDateRange("Today - 4 / + 2 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Aug 17, 2023 – Sep 10, 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 25);

			When.onTheHeader.enterDateRange("Sep 17, 2023 – Aug 17, 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 32);
		});

		opaTest("Enter standard option and check for adoption of horizontal pagination", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 10 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			When.onTheHeader.pressNextButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 11);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			When.onTheHeader.enterDateRange("Today - 4 / + 2 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			When.onTheHeader.pressPreviousButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("DATE_RANGE", null, true);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
		});

		opaTest("Check for validation", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 60 Days");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_DAY");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Today -31 / + 29 Days");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_DAY");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Tod - 6 Day");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);

			When.onTheHeader.enterDateRange("Today - 5 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);

			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("LASTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("28");
			When.onDynamicDateRange.enterValueInStepInput(62);
			When.onDynamicDateRange.pressApplyButton();
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_DAY");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
			When.onDynamicDateRange.pressDynamicDateRangeSelector();
			Then.onDynamicDateRange.theDateOptionIsSelected("NEXTXDAYS", ["X"], true);
			When.onDynamicDateRange.pressDateOptionByKey("NEXTXDAYS", ["X"]);
			Then.onDynamicDateRange.theDateOptionStepInputValueIs("62");
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
