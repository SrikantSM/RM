/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"../../pages/Filter",
		"../../pages/Header",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/PersoDialog",
		"../../pages/QuickView",
		"../../pages/Table"
	],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Time Period Pagination Monthly Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select Monthly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_MONTHLY);
			Then.onTheHeader.theDateRangeMatches(/6 Months/);
		});

		opaTest("Select Free Date Range for 6 months", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Feb 2022 - Jul 2022");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Aug 2022 - Jan 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click again on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Feb 2023 - Jul 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Aug 2022 - Jan 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click again on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Feb 2022 - Jul 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Select Free Date Range for 5 months", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Nov 2022 - Mar 2023");
			Then.onTheHeader.theDateRangeSelectedValue("Nov 2022 - Mar 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Click on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Apr 2023 - Aug 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Click again on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Sep 2023 - Jan 2024");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Apr 2023 - Aug 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Click again on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Nov 2022 - Mar 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 5);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
