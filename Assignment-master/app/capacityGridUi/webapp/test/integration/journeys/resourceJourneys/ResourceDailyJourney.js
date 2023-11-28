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

		QUnit.module("Resource Daily Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
			Then.onTheHeader.theAverageUtilizationStatusIs("74%");
			Then.onTheHeader.theTotalResourcesNumberIs(61);
			Then.onTheHeader.theFreeResourcesNumberIs(32);
			Then.onTheHeader.theOverbookedResourcesNumberIs(12);
			Then.onTheTable.theTableIsVisible();
			Then.onTheTable.theResourceNameLinkIsVisible("Alex Kardashian");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Smith");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Musk");
			Then.onTheTable.theResourceUtilizationIs(114, null);
			Then.onTheTable.theResourceOrganitionNameForDisplay("/rows/0", "Delivery Org Unit (Germany) (RM-TA-DE01)");
			Then.onTheTable.theResourceOrganitionNameForDisplay("/rows/1", "Delivery Org Unit (India) (RM-TA-IN02)");
			Then.onTheTable.theResourceOrganitionNameForDisplay("/rows/2", "Delivery Org Unit ( America) (RM-TA-US01)");
		});

		opaTest("Validation Of Custom Date Range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeSelectedValue("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			When.onTheHeader.enterDateRange("Jun 1, 2022 - Jun 15, 2024");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_DAY");
		});

		opaTest("Select Free Date Range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jun 1, 2022 - Jun 15, 2022");
			Then.onTheHeader.theDateRangeSelectedValue("Jun 1, 2022 - Jun 15, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 15);
		});

		opaTest("Select Free Date Range in the past", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jun 1, 1998 - Jun 15, 1998");
			Then.onTheHeader.theDateRangeSelectedValue("Jun 1, 1998 - Jun 15, 1998");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 15);
		});

		opaTest("Select Free Date Range in the future", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jun 1, 2025 - Jun 15, 2025");
			Then.onTheHeader.theDateRangeSelectedValue("Jun 1, 2025 - Jun 15, 2025");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 15);
		});

		opaTest("Select Date Range - Next 7", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 6 Days");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
		});

		opaTest("Select Date Range - Next 8 Weeks", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 55 Days");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 56);
		});

		opaTest("Select Date Range - Past 1 Next 2 Weeks", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today - 7 / + 14 Days");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 22);
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