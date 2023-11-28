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

		QUnit.module("Time Period Pagination Weekly Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select Monthly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheHeader.theDateRangeMatches(/8.*Weeks/);
		});

		opaTest("Select Free Date Range for 4 Weeks", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Oct 10, 2022 - Nov 06, 2022");
			Then.onTheHeader.theDateRangeSelectedValue("Oct 10, 2022 - Nov 6, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Click on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Nov 7, 2022 - Dec 4, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Click again on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Dec 5, 2022 - Jan 1, 2023");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Nov 7, 2022 - Dec 4, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Click again on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 10, 2022 - Nov 6, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 4);
		});

		opaTest("Select Free Date Range for 2 Weeks", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Oct 10, 2022 - Oct 23, 2022");
			Then.onTheHeader.theDateRangeSelectedValue("Oct 10, 2022 - Oct 23, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);
		});

		opaTest("Click on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 24, 2022 - Nov 6, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);
		});

		opaTest("Click again on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Nov 7, 2022 - Nov 20, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 24, 2022 - Nov 6, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);
		});

		opaTest("Click again on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 10, 2022 - Oct 23, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 2);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
