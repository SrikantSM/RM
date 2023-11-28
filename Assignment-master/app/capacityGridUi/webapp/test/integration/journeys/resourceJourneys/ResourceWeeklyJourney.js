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

		QUnit.module("Resource Weekly Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select weekly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheHeader.theDateRangeMatches(/8.*Weeks/);
			Then.onTheHeader.theAverageUtilizationStatusIs("74%");
			Then.onTheHeader.theTotalResourcesNumberIs(61);
			Then.onTheHeader.theFreeResourcesNumberIs(32);
			Then.onTheHeader.theOverbookedResourcesNumberIs(12);
			Then.onTheTable.theTableIsVisible();
			Then.onTheTable.theResourceNameLinkIsVisible("Alex Kardashian");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Smith");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Musk");
			Then.onTheTable.theResourceUtilizationIs(114, null);
		});

		opaTest("Validation Of Custom Date Range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeSelectedValue("");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
			When.onTheHeader.enterDateRange("Jun 1, 2022 - Jul 30, 2024");
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("TIME_FRAME_NOT_IN_RANGE_WEEK");
		});

		opaTest("Select Free Date Range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jun 1, 2022 - Jul 30, 2022");
			Then.onTheHeader.theDateRangeSelectedValue("May 30, 2022 - Jul 31, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);
		});

		opaTest("Select Free Date Range in the past", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jun 1, 2022 - Jul 30, 2022");
			Then.onTheHeader.theDateRangeSelectedValue("May 30, 2022 - Jul 31, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);
		});

		opaTest("Select Free Date Range in the future", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jun 1, 2022 - Jul 30, 2022");
			Then.onTheHeader.theDateRangeSelectedValue("May 30, 2022 - Jul 31, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9);
		});

		opaTest("Select Free Date Range in Future - 2 Weeks", function (Given, When, Then) {
			let oDate = new Date();
			// always validate the for the next year.
			When.onTheHeader.enterDateRange("Nov 8, " + (oDate.getFullYear() + 1) + " - Nov 14, " + (oDate.getFullYear() + 1));
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);
		});

		opaTest("Select Free Date Range in Future - 4 Weeks", function (Given, When, Then) {
			// always validate the for the next year. This time with 4 weeks range
			let oDate = new Date();
			When.onTheHeader.enterDateRange("Oct 3, " + (oDate.getFullYear() + 1) + " - Oct 24, " + (oDate.getFullYear() + 1));
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Select Date Range - Next 12", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Week + 11 Weeks");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 12);
		});

		// this scenario is not working anymore. Need to fix it.So commenting it to make the journey's green
		opaTest("Select Date Range - Next 26", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Week + 25 Weeks");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 26);
		});

		opaTest("Select Date Range - Past 2 Next 4", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Current Week - 2 / + 4 Weeks");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
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
