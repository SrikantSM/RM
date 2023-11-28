/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"capacityGridUi/localService/mockserver",
		"capacityGridUi/view/ODataEntities",
		"../../pages/Filter",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/Table",
	],
	function (opaTest, Constants, mockserver,ODataEntities) {
		"use strict";

		QUnit.module("Filter Resources With Edited Assignments Journey", {
			afterEach: function () {
				mockserver.resetRequests();
			}
		});
		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Switch To Edit Mode and Edit an Assigment", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			Then.onTheTable.theDropDownIsVisible();
			When.onTheTable.selectRow(1);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000128", "/rows/1/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(556341da-46c2-4ba7-adb7-14cfbae1d350)", "displayId");
			Then.onTheTable.theDropDownIsEnabled();
		});

		opaTest("Filter Changed Assignment", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDeleteAssignmentButton();
			When.onTheTable.openTheDropDownMenu();
			When.onTheTable.filterEditedAssignments();
			Then.onTheTable.theFilteredRowIs("/rows/0");
			Then.onTheTable.theFilteredRowIs("/rows/1");
			Then.onTheTable.theNewlyAddedFilteredAssignmentIs("/rows/1/assignments/0");
			Then.onTheTable.theFilteredAssignmentIs("/rows/0/assignments/0");
		});
		opaTest("Save the Filtered Assignments", function (Given, When, Then) {
			When.onThePage.pressSaveButton();
			Then.onTheTable.theFilterButtonIsEnabled(true);
			Then.onTheHeader.theTotalResourcesNumberIs(61);

		});
		opaTest("Switch To Edit Mode and Edit few Assigments and Go the Filtered Mode and Discard  Changes", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			Then.onTheTable.theDropDownIsVisible();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheTable.theDropDownIsEnabled();
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000128", "/rows/1/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(556341da-46c2-4ba7-adb7-14cfbae1d350)", "displayId");
			When.onTheTable.openTheDropDownMenu();
			When.onTheTable.filterEditedAssignments();
			Then.onTheTable.theFilteredRowIs("/rows/0");
			Then.onTheTable.theFilteredRowIs("/rows/1");
			Then.onTheTable.theNewlyAddedFilteredAssignmentIs("/rows/1/assignments/0");
			Then.onTheTable.theFilteredAssignmentIs("/rows/0/assignments/0");
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheTable.theFilteredRowIs("/rows/0");
			Then.onTheTable.theFilteredRowIs("/rows/1");
			Then.onTheTable.theNewlyAddedFilteredAssignmentIs("/rows/1/assignments/0");
			Then.onTheTable.theFilteredAssignmentIs("/rows/0/assignments/0");
		});
		opaTest("Cancel the Filtered Assignments", function (Given, When, Then) {
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheHeader.theTotalResourcesNumberIs(61);

		});
		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);