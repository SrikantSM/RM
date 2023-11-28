/*global QUnit*/
sap.ui.define(["sap/ui/test/opaQunit", "./Constants", "../pages/Page", "../pages/PersoDialog", "../pages/Table"], function (opaTest, Constants) {
	"use strict";

	QUnit.module("Hide Leading Columns Journey");

	var cols = Constants.columnIds;

	opaTest("Start App", function (Given, When, Then) {
		Given.iStartMyApp();
		Then.onThePage.theAppIsVisible();
	});

	opaTest("Enable Hide Leading Columns button", function (Given, When, Then) {
		When.onTheTable.pressHideLeadingColumnsButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.STAFFING_SUMMARY]);
	});

	opaTest("Disable Hide Leading Columns button", function (Given, When, Then) {
		When.onTheTable.pressShowAllColumnsButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.STAFFING_HRS, cols.ASSIGNMENT_STATUS]);
	});

	opaTest("Select the rest of the columns in perso dialog", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.selectCheckBox(4);
		When.onThePersoDialog.selectCheckBox(5);
		When.onThePersoDialog.selectCheckBox(6);
		When.onThePersoDialog.selectCheckBox(7);
		When.onThePersoDialog.selectCheckBox(8);
		When.onThePersoDialog.selectCheckBox(9);
		When.onThePersoDialog.selectCheckBox(10);
		When.onThePersoDialog.selectCheckBox(11);
		When.onThePersoDialog.selectCheckBox(12);
		When.onThePersoDialog.selectCheckBox(13);
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([
			cols.NAME,
			cols.RESOURCE_ORG,
			cols.STAFFING_SUMMARY,
			cols.STAFFING_HRS,
			cols.ASSIGNMENT_STATUS,
			cols.COST_CENTER,
			cols.CUSTOMER,
			cols.PROJECT,
			cols.PROJECT_ROLE,
			cols.REFERENCE_OBJECT,
			cols.REFERENCE_OBJECT_TYPE,
			cols.REQUEST,
			cols.REQUEST_STATUS,
			cols.WORK_ITEM,
			cols.WORKER_TYPE
		]);
	});

	opaTest("Enable Hide Leading Columns button and De-Select last 2 Columns in perso Dialog", function (Given, When, Then) {
		When.onTheTable.pressHideLeadingColumnsButton();
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.selectCheckBox(7);
		When.onThePersoDialog.selectCheckBox(8);
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([
			cols.NAME,
			cols.RESOURCE_ORG,
			cols.STAFFING_SUMMARY,
			cols.STAFFING_HRS,
			cols.ASSIGNMENT_STATUS,
			cols.COST_CENTER,
			cols.CUSTOMER
		]);
	});

	opaTest("Re-Select the initial Columns", function (Given, When, Then) {
		When.onTheTable.pressPersoButton();
		Then.onThePersoDialog.theDialogIsOpen();
		When.onThePersoDialog.pressResetButton();
		When.onThePersoDialog.pressOkButton();
		Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.STAFFING_HRS, cols.ASSIGNMENT_STATUS]);
		Then.iTeardownMyApp();
	});
});
