/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"./Constants",
		"../pages/MessageDialog",
		"../pages/Filter",
		"../pages/Header",
		"../pages/MockServer",
		"../pages/Page",
		"../pages/Table"
	],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Message Dialog Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Dialog on Filter Request", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheMockServer.failOnNextRequest({ code: 500, batch: false });
			When.onTheFilter.pressGoButton();
			Then.onTheMessageDialog.theTextByKeyIsVisible("REQUEST_ERROR_UNEXPECTED_TITLE");
			When.onTheMessageDialog.pressCloseButton();
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
		});

		opaTest("Dialog on Select View", function (Given, When, Then) {
			When.onTheMockServer.failOnNextRequest({ code: 500, batch: true });
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheMessageDialog.theMessagesListHasLength(2);
			Then.onTheMessageDialog.theMessageItemIsVisible(
				"An unexpected error occurred",
				"Please try again later.\n" + "\n" + "(Communication error: 500 Internal Server Error)"
			);
			Then.onTheMessageDialog.theMessageItemIsVisible(
				"An unexpected error occurred",
				"Please try again later.\n" + "\n" + "(Communication error: 500 Internal Server Error)"
			);
			When.onTheMessageDialog.pressCloseButton();
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
		});

		opaTest("Dialog on Resource Request Quick View", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheMockServer.failOnNextRequest({ code: 403, batch: false });
			When.onTheTable.pressResourceNameLink("Prototype Talent Management 02");
			Then.onTheMessageDialog.theTextByKeyIsVisible("REQUEST_ERROR_FORBIDDEN_TITLE");
			When.onTheMessageDialog.pressCloseButton();
		});

		opaTest("Dialog on Cancel 2 assignments", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressEditButton();
			When.onTheTable.enterAssignmentHours(150, "/rows/0/assignments/0/utilization/0");
			When.onTheTable.enterAssignmentHours(150, "/rows/0/assignments/1/utilization/0");
			When.onTheMockServer.failOnNextRequest({ code: 400, count: 1 });
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheMessageDialog.theTextIsVisible("test error 400 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			When.onTheMessageDialog.pressCloseButton();
			When.onThePage.pressCancelButton();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Dialog on Expand Resource", function (Given, When, Then) {
			When.onTheMockServer.failOnNextRequest({ code: 403, batch: true });
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheMessageDialog.theTextByKeyIsVisible("REQUEST_ERROR_FORBIDDEN_TITLE");
			When.onTheMessageDialog.pressCloseButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
