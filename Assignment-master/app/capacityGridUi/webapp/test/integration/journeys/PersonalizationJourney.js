/*global QUnit*/
sap.ui.define(["sap/ui/test/opaQunit", "./Constants", "../pages/Page", "../pages/PersoDialog", "../pages/Table"], function (opaTest, Constants) {
	"use strict";

	QUnit.module("Personalization Journey");

	var cols = Constants.columnIds;

	opaTest("Start App", function (Given, When, Then) {
		Given.iStartMyApp();
		Then.onThePage.theAppIsVisible();
	});

	opaTest("Reset", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.pressResetButton();
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.STAFFING_HRS, cols.ASSIGNMENT_STATUS]);
	});

	opaTest("Move Columns", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.pressMoveDownButton();
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.STAFFING_SUMMARY, cols.RESOURCE_ORG, cols.STAFFING_HRS, cols.ASSIGNMENT_STATUS]);
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.pressMoveUpButton();
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.STAFFING_HRS, cols.ASSIGNMENT_STATUS]);
	});

	opaTest("De-Select Columns #1", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		Then.onThePersoDialog.theCheckBoxIsSelected(0, true);
		Then.onThePersoDialog.theCheckBoxIsSelected(1, true);
		Then.onThePersoDialog.theCheckBoxIsSelected(2, true);
		Then.onThePersoDialog.theCheckBoxIsSelected(3, true);
		When.onThePersoDialog.pressCancelButton();
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.selectCheckBox(2);
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.ASSIGNMENT_STATUS]);
	});

	opaTest("De-Select Columns #2", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.selectCheckBox(0);
		When.onThePersoDialog.selectCheckBox(1);
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.ASSIGNMENT_STATUS]);
	});

	// Q: why are the indexes different than in previous tests?
	// A: on selecting check boxes the order of the list changes!
	opaTest("Re-Select the initial Columns", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.selectCheckBox(6);
		When.onThePersoDialog.selectCheckBox(7);
		When.onThePersoDialog.selectCheckBox(8);
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.ASSIGNMENT_STATUS, cols.REFERENCE_OBJECT_TYPE, cols.REQUEST, cols.REQUEST_STATUS]);
		Then.iTeardownMyApp();
	});
});