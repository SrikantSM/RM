/*global QUnit*/
sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/core/ValueState", "../../pages/MockServer", "../../pages/Table"], function (opaTest, valueState) {
	"use strict";

	QUnit.module("ActionEnablement Journey");

	opaTest("Start app", function (Given, When, Then) {
		Given.iStartMyApp();
		Then.onThePage.theAppIsVisible();
	});

	opaTest("Filter Resource Vishwanathan Tendulkar and Tiger Salah", function (Given, When, Then) {
		When.onTheTable.pressFilterButton();
		When.onTheFilter.pressResetButton();
		When.onTheFilter.enterResourceName("Vishwanathan");
		When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
		When.onTheFilter.enterResourceName("Tiger");
		When.onTheFilter.selectFromValueHelp("/ResourceDetails(a9e19a53-e9d5-4820-8665-c978b575f646)", "lastName");
		When.onTheFilter.pressGoButton();
		When.onTheFilter.pressCloseButton();
		Then.onTheTable.theTitleCountIs(2);
	});

	opaTest("Check Action Button Enablement on Selection of a Single Resource ", function (Given, When, Then) {
		When.onTheTable.pressEditButton();
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(false);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(false);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(false);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(0);
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(true);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(0);
	});

	opaTest("Check Action Button Enablement on Selection of Multiple Resources ", function (Given, When, Then) {
		When.onTheTable.selectRow(0);
		When.onTheTable.selectRow(1);
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(false);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(false);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(false);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(0);
		When.onTheTable.selectRow(1);
	});

	opaTest("Check Action Button Enablement on Selection of Single Assignment ", function (Given, When, Then) {
		When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
		When.onTheTable.selectRow(1);
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(true);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(1);
	});

	opaTest("Check Action Button Enablement on Selection of Multiple Assignments under Same Resource", function (Given, When, Then) {
		When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
		When.onTheTable.selectRow(3);
		When.onTheTable.selectRow(4);
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(true);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(3);
		When.onTheTable.selectRow(4);
	});

	opaTest("Check Action Button Enablement on Selection of Multiple Assignments under Different Resources", function (Given, When, Then) {
		When.onTheTable.selectRow(1);
		When.onTheTable.selectRow(3);
		When.onTheTable.selectRow(4);
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(true);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(1);
		When.onTheTable.selectRow(3);
	});

	opaTest("Check Action Button Enablement on Selection of both Resource and Assignment", function (Given, When, Then) {
		When.onTheTable.selectRow(2);
		When.onTheTable.selectRow(3);
		Then.onTheTable.theDiscardButtonIsEnabled(false);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(false);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(false);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(false);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
		When.onTheTable.selectRow(2);
		When.onTheTable.selectRow(3);
	});

	opaTest("Check Action Button Enablement- at least one of the Selected Assignment Changed", function (Given, When, Then) {
		When.onTheTable.selectRow(3);
		When.onTheTable.selectRow(1);
		When.onTheTable.selectRow(4);
		When.onTheTable.enterAssignmentHours(40, "/rows/0/assignments/0/utilization/1");
		Then.onTheTable.theDiscardButtonIsEnabled(true);
		Then.onTheTable.theAddAssignmentButtonIsEnabled(false);
		Then.onTheTable.theDeleteAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCopyAssignmentButtonIsEnabled(true);
		Then.onTheTable.theCutAssignmentButtonIsEnabled(true);
		Then.onTheTable.thePasteAssignmentButtonIsEnabled(false);
	});

	opaTest("Tear down app", function (Given, When, Then) {
		Then.onThePage.theAppIsVisible();
		Then.iTeardownMyApp();
	});
});
