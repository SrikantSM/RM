/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"../../pages/Filter",
		"../../pages/Header",
		"../../pages/Page",
		"../../pages/QuickView",
		"../../pages/Table"
	],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Resource Monthly Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select monthly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_MONTHLY);
			Then.onTheHeader.theDateRangeMatches(/6 Months/);
			Then.onTheHeader.theAverageUtilizationStatusIs("74%");
			Then.onTheHeader.theTotalResourcesNumberIs(61);
			Then.onTheHeader.theFreeResourcesNumberIs(32);
			Then.onTheHeader.theOverbookedResourcesNumberIs(12);
			Then.onTheTable.theTableIsVisible();
			Then.onTheTable.theResourceNameLinkIsVisible("Alex Kardashian");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Smith");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Musk");
			Then.onTheTable.theResourceUtilizationIs(77, null);
			Then.onTheTable.theResourceOrganitionNameForDisplay("/rows/0", "Delivery Org Unit (Germany) (RM-TA-DE01)");
			Then.onTheTable.theResourceOrganitionNameForDisplay("/rows/1", "Delivery Org Unit (India) (RM-TA-IN02)");
			Then.onTheTable.theResourceOrganitionNameForDisplay("/rows/2", "Delivery Org Unit ( America) (RM-TA-US01)");
		});

		opaTest("Validation Of Custom Date Range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeSelectedValue("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			When.onTheHeader.enterDateRange("Jan 2022 - Dec 2024");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_MONTH");
		});

		opaTest("Select Free Date Range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jan 2022 - Dec 2022");
			Then.onTheHeader.theDateRangeSelectedValue("Jan 2022 - Dec 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 12);
		});

		opaTest("Select Free Date Range in the past", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jan 1998 - Dec 1998");
			Then.onTheHeader.theDateRangeSelectedValue("Jan 1998 - Dec 1998");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 12);
		});

		opaTest("Select Free Date Range in the future", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jan 2035 - Dec 2035");
			Then.onTheHeader.theDateRangeSelectedValue("Jan 2035 - Dec 2035");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 12);
		});

		opaTest("Select Date Range - Next 12", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Month + 11 Months");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 12);
		});

		opaTest("Select Date Range - Past 2 Next 3", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Month -2 / +3 Months");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Scroll", function (Given, When, Then) {
			When.onTheTable.scrollToRow(30);
			Then.onTheTable.theTitleCountIs(60);
			When.onTheTable.scrollToRow(51);
			Then.onTheTable.theTitleCountIs(61);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
