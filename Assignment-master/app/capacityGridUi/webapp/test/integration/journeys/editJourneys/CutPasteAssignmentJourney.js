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

		QUnit.module("Cut Paste Assignment Journey");

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

		opaTest("Cut single Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Paste single Assignment to Resource Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.pressPasteAssignmentButton();
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

		opaTest("Cut multiple Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);

			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", true);
			Then.onTheTable.theNumberOfAssignmentCopied(2);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
		});

		opaTest("Paste Multiple Assignment to Resource Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.pressPasteAssignmentButton();
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

		opaTest("Cut Only First Assignment of Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", false);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Cut Only Second Assignment of Ayan Musk (Should un-copy first one)", function (Given, When, Then) {
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(3);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(3);
		});

		opaTest("Paste single Assignment to Resource Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.pressPasteAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			fnCheckAsgOnPaste(Given, When, Then);
			fnCheckDeletedAssignment("/rows/1/assignments/1", Given, When, Then);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.SOFT_BOOKED_STRING);
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

		opaTest("Cut single Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Changing Assignment Utiliation should un-cut assignment", function (Given, When, Then) {
			When.onTheTable.enterAssignmentHours(5, "/rows/1/assignments/0/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 5
				}
			});
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theNumberOfAssignmentCopied(0);
		});

		opaTest("Cut single Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Discard Assignment changes should un-cut assignment", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDiscardButton();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theNumberOfAssignmentCopied(0);
			When.onTheTable.selectRow(2);
		});

		opaTest("Cut should be disabled for Deleted assignment", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheTable.theCutAssignmentButtonIsEnabled(false);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theNumberOfAssignmentCopied(0);
			When.onTheTable.selectRow(2);
		});

		opaTest("Cut should be enabled when Deleted assignment and non-deleted assignment selected together", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			Then.onTheTable.theCutAssignmentButtonIsEnabled(true);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
		});

		opaTest("Paste Assignment to Resource Ayan Musk should only paste 1 non-deleted assignment", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.pressPasteAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			fnCheckAsgOnPaste(Given, When, Then);
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

		opaTest("Add Assignment to Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			When.onTheTable.selectRow(0);
		});

		opaTest("Cut Empty Assignment of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(1);
		});

		opaTest("Paste Empty Assignment to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.pressPasteAssignmentButton();
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

		opaTest("Cut Multiple Empty Assignments of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/1", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/2", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/3", true);
			Then.onTheTable.theNumberOfAssignmentCopied(4);
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
		});

		opaTest("Paste Multiple Empty Assignments to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(5);
			When.onTheTable.pressPasteAssignmentButton();
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

		opaTest("Cut Multiple Empty Assignments of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheTable.selectRow(5);
			When.onTheTable.selectRow(6);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/2", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/3", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/4", true);
			Then.onTheTable.theNumberOfAssignmentCopied(5);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheTable.selectRow(5);
			When.onTheTable.selectRow(6);
		});

		opaTest("Paste Multiple Empty Assignments to Resource Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.pressPasteAssignmentButton();
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

		opaTest("Cut Multiple Empty Assignments of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/1", true);
			Then.onTheTable.theNumberOfAssignmentCopied(2);
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Paste Multiple Empty Assignments to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(3);
			When.onTheTable.pressPasteAssignmentButton();
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

		opaTest("Cut Multiple Empty Assignments of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(3);
			When.onTheTable.pressCutAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/0/assignments/2", true);
			Then.onTheTable.theNumberOfAssignmentCopied(2);
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(3);
		});

		opaTest("Paste Multiple Empty Assignments to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.selectRow(5);
			When.onTheTable.pressPasteAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRequestInputValueStateIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 4);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			// When.onThePage.pressSaveButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
