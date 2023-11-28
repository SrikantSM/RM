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

		QUnit.module("Time Period Pagination Daily Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select Daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
		});

		opaTest("Select Free Date Range for 6 Days", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Oct 12, 2022 - Oct 17, 2022");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheHeader.theDateRangeSelectedValue("Oct 12, 2022 - Oct 17, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 18, 2022 - Oct 23, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click again on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 24, 2022 - Oct 29, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click again on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 30, 2022 - Nov 4, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 24, 2022 - Oct 29, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheHeader.theDateRangeSelectedValue("Oct 18, 2022 - Oct 23, 2022");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 6);
		});

		opaTest("Select Date Range - Next 4 Weeks", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 27 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 28);
		});

		opaTest("Click on 'Next' Button", function (Given, When, Then) {
			When.onTheHeader.pressNextButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 28);
		});

		opaTest("Click on 'Previous' Button", function (Given, When, Then) {
			When.onTheHeader.pressPreviousButton();
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 28);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
