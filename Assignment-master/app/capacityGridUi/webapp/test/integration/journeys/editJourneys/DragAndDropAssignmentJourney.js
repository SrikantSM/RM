/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/draft/AssignmentStatus",
		"capacityGridUi/view/ODataEntities",
		"sap/ui/core/ValueState",
		"../../pages/Filter",
		"../../pages/Header",
		"../../pages/MessagePopover",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/PersoDialog",
		"../../pages/QuickView",
		"../../pages/Table",
		"../../pages/Variant",
		"../../pages/MessageDialog"
	],
	function (opaTest, Constants, DraftActions, AssignmentStatus, ODataEntities, valueState) {
		"use strict";

		QUnit.module("Drag And Drop Assignment Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		let fnCheckAsgOnPaste = function (Given, When, Then) {
			Then.onTheTable.theRequestInputIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theRequestLinkIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theStaffingSummaryIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theUtilPerAsgHourIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentStatusIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/0", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs("/rows/0/assignments/0/utilization/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentStatusValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
		};

		let fnCheckDeletedAssignment = function (sPath, Given, When, Then) {
			Then.onTheTable.theDeletedRequestLinkIsVisible(sPath, true);
			Then.onTheTable.theRequestInputIsVisible(sPath, false);
			Then.onTheTable.theRequestLinkIsVisible(sPath, false);
			Then.onTheTable.theStaffingSummaryIsVisible(sPath, false);
			Then.onTheTable.theUtilPerAsgHourIsVisible(sPath, false);
			Then.onTheTable.theAssignmentStatusIsVisible(sPath, false);
		};

		opaTest("Filter Resource Ayan Mush & Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Drag single Assignment of Resource Vishwanathan Tendulkar To Ayan musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.dragAssignment("/rows/1/assignments/0");
			When.onTheTable.dropAssignment("/rows/0");
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			fnCheckAsgOnPaste(Given, When, Then);
			fnCheckDeletedAssignment("/rows/1/assignments/0", Given, When, Then);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMockServer.assignmentRequestSentToServer({
				url: "/odata/v4/CapacityService/AssignmentsDetailsForCapacityGrid(662068b8-c4c9-46d5-b303-17dff74a113b)",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET
			});
		});

		opaTest("Save Assignment of Resource Vishwanathan Tendulkar & Ayan Musk", function (Given, When, Then) {
			When.onThePage.pressSaveButton();
			Then.onTheMockServer.requestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET
			});
			Then.onThePage.theMessagesButtonIsNotVisible();
		});

		opaTest("Filter Resource Ayan Mush & Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Drag multiple Assignment of Resource Vishwanathan Tendulkar to Resource Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.dragAssignment("/rows/1/assignments/0");
			When.onTheTable.dropAssignment("/rows/0");
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			fnCheckAsgOnPaste(Given, When, Then);
			fnCheckDeletedAssignment("/rows/1/assignments/0", Given, When, Then);
			fnCheckDeletedAssignment("/rows/1/assignments/1", Given, When, Then);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);
			When.onThePage.pressSaveButton();
		});

		opaTest("Filter Resource Ayan Mush & Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Drag should be disabled for Deleted assignment", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDeleteAssignmentButton();
			When.onTheTable.dragAssignment("/rows/1/assignments/0");
			When.onTheTable.dropAssignment("/rows/0");
			Then.onTheTable.theResourceIsExpanded("/rows/0", false);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 0);
		});

		opaTest("Drop Assignment(one deleted and one non-deleted) to Resource Ayan Musk should only create 1 assignment", function (Given, When, Then) {
			When.onTheTable.selectRow(3);
			When.onTheTable.dragAssignment("/rows/1/assignments/0");
			When.onTheTable.dropAssignment("/rows/0");
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			When.onThePage.pressSaveButton();
		});

		opaTest("Add Assignment to Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			When.onTheTable.selectRow(0);
		});

		opaTest("Drag&Drop Empty Assignment to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.dragAssignment("/rows/0/assignments/0");
			When.onTheTable.dropAssignment("/rows/1");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/1/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 3);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 0);
			When.onThePage.pressSaveButton();
		});

		opaTest("Filter Resource Ayan Musk & Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Add Multiple Assignments to Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			When.onTheTable.selectRow(0);
		});

		opaTest("Drag and Drop Multiple Empty Assignments to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheTable.dragAssignment("/rows/0/assignments/1");
			When.onTheTable.dropAssignment("/rows/1");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/2", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/3", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/1/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/1/assignments/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/1/assignments/2", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/1/assignments/3", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/2", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/3", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 6);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 0);
		});

		opaTest("Drag&Drop Multiple Empty Assignments of Vishwanathan Tendulkar to Resource Ayan Musk", function (Given, When, Then) {
			// When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheTable.selectRow(5);
			When.onTheTable.selectRow(6);
			When.onTheTable.dragAssignment("/rows/1/assignments/3");
			When.onTheTable.dropAssignment("/rows/0");
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/2", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/3", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/4", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/2", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/3", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/4", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/2", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/3", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/4", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 5);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 2);
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/0", true);
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/1", false);
			When.onThePage.pressSaveButton();
		});

		opaTest("Filter Resource Ayan Musk & Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Add Multiple Assignments to Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			When.onTheTable.selectRow(0);
		});

		opaTest("Enter valid and invalid request for two assignments", function (Given, When, Then) {
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			When.onTheTable.enterRequest("abc", "/rows/0/assignments/1");
		});

		opaTest("Drag&Drop Multiple Empty Assignments to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.dragAssignment("/rows/0/assignments/1");
			When.onTheTable.dropAssignment("/rows/1");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/0", valueState.Error);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 4);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 0);
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Filter Resource Ayan Musk & Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Add Multiple Assignments to Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			When.onTheTable.selectRow(0);
		});

		opaTest("Enter valid and invalid request for two assignments", function (Given, When, Then) {
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			When.onTheTable.enterRequest("abc", "/rows/0/assignments/1");
		});

		opaTest("Drag&Drop Multiple Empty Assignments to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(3);
			When.onTheTable.dragAssignment("/rows/0/assignments/0");
			When.onTheTable.dropAssignment("/rows/1");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 4);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			When.onThePage.pressSaveButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
