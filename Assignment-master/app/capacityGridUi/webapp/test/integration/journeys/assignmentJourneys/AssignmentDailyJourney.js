/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/view/Views",
		"../../pages/Filter",
		"../../pages/Header",
		"../../pages/Page",
		"../../pages/PersoDialog",
		"../../pages/QuickView",
		"../../pages/Table"
	],
	function (opaTest, Constants, ODataEntities, Views) {
		"use strict";

		QUnit.module("Assignment Daily Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.utilizationEntitySet(Views.DAILY),
				url: "ID eq e4beae01-a0ef-41fa-9037-e4da36a12741 and validFrom eq 19-04-19"
			});
		});

		opaTest("Select Date Range - Next 7", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Today + 6 Days");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
		});

		opaTest("Filter Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Expand Assignments of Vishwanathan Tendulkar (Standard Columns)", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 01");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 04");

			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentDurationHoursIs("444 hr", "/rows/0/assignments/1");

			Then.onTheTable.theAssignmentStatusIs(Constants.HARD_BOOKED_TEXT, "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStatusIs(Constants.SOFT_BOOKED_TEXT, "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentBookedCapacityIs("3", "/rows/0/assignments/0/utilization/3");
			Then.onTheTable.theAssignmentBookedCapacityIs("3", "/rows/0/assignments/0/utilization/4");
			Then.onTheTable.theAssignmentBookedCapacityIs("4", "/rows/0/assignments/1/utilization/6");
		});

		opaTest("Reset Filter", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.pressCloseButton();
		});

		opaTest("Sort in descending order", function (Given, When, Then) {
			When.onTheTable.sortColumn(Constants.columnIds.NAME, "Descending");
			Then.onTheTable.theColumnIsSorted(Constants.columnIds.NAME, "Descending");
			When.onTheTable.scrollToRow(0);
			Then.onTheTable.theTitleCountIs(60);
			Then.onTheTable.theResourceNameLinkIsVisible("Will Presley");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 05");
		});

		opaTest("Filter Kardashian Alex", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Alex Kardashian");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(9e2550e9-ab47-4807-b39b-0658917a1645)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Expand both Assignments of Kardashian Alex (Standard Columns)", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 02");
			Then.onTheTable.theAssignmentDurationHoursIs("222 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStatusIs(Constants.HARD_BOOKED_TEXT, "/rows/0/assignments/0");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 03");
			Then.onTheTable.theAssignmentDurationHoursIs("333 hr", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentStatusIs(Constants.HARD_BOOKED_TEXT, "/rows/1/assignments/0");
		});

		opaTest("Reset Filter & Sort", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.pressCloseButton();
			When.onTheTable.sortColumn(Constants.columnIds.NAME, "Ascending");
			Then.onTheTable.theColumnIsSorted(Constants.columnIds.NAME, "Ascending");
		});

		opaTest("Vishwanathan Ronaldo is not expandable", function (Given, When, Then) {
			When.onTheTable.scrollToRow(30);
			When.onTheTable.scrollToRow(50);
			When.onTheTable.scrollToRow(60);
			Then.onTheTable.theTitleCountIs(61);
			Then.onTheTable.theResourceNameLinkIsVisible("Vishwanathan Ronaldo");
			Then.onTheTable.theRowsAreNotExpandable();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
