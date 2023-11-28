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

		QUnit.module("Copy Paste Assignment Journey");

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

		opaTest("Copy single Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCopyAssignmentButton();
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
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.HARD_BOOKED_STRING);
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

		opaTest("Copy multiple Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);

			When.onTheTable.pressCopyAssignmentButton();
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

		opaTest("Copy Only First Assignment of Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Copy Only Second Assignment of Vishwanathan Tendulkar (Should un-copy first one)", function (Given, When, Then) {
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(3);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(3);
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

		opaTest("Copy single Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Changing Assignment Utiliation should un-copy assignment", function (Given, When, Then) {
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

		opaTest("Copy single Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
		});

		opaTest("Discard Assignment changes should un-copy assignment", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDiscardButton();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theNumberOfAssignmentCopied(0);
			When.onTheTable.selectRow(2);
		});

		opaTest("Copy should be disabled for Deleted assignment", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheTable.theCopyAssignmentButtonIsEnabled(false);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", false);
			Then.onTheTable.theNumberOfAssignmentCopied(0);
			When.onTheTable.selectRow(2);
		});

		opaTest("Copy should be enabled when Deleted assignment and non-deleted assignment selected together", function (Given, When, Then) {
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			Then.onTheTable.theCopyAssignmentButtonIsEnabled(true);
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

		opaTest("Copy Empty Assignment of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.pressCopyAssignmentButton();
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
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
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

		opaTest("Copy Multiple Empty Assignments of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheTable.pressCopyAssignmentButton();
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
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 4);
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

		opaTest("Test Error on failing to create draft assignment for multiple assignments(All or Nothing)", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/1", true);
			Then.onTheTable.theNumberOfAssignmentCopied(2);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(0);
			When.onTheMockServer.failOnNextRequest({ target: "188bb8e8-5f04-4503-973a-773ef0fccc00" });
			When.onTheTable.pressPasteAssignmentButton();
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 0);
			When.onThePage.pressSaveButton();
		});

		opaTest("Test Error on pasting existing assignment in draft state", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheTable.theResourceIsExpanded("/rows/1", true);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressCopyAssignmentButton();
			Then.onTheTable.theAssignmentIsCopied("/rows/1/assignments/0", true);
			Then.onTheTable.theNumberOfAssignmentCopied(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.selectRow(0);
			When.onTheTable.pressPasteAssignmentButton();
			When.onTheTable.pressPasteAssignmentButton();
			Then.onTheMessageDialog.theTextIsVisible("The resource is already assigned to the request.");
			Then.onTheMessageDialog.theTextIsVisible("Ayan Musk > Prototype Talent Management 01");
			When.onTheMessageDialog.pressCloseButton();
			When.onThePage.pressSaveButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);