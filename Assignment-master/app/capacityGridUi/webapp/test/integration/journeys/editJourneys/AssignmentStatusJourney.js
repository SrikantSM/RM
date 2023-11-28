/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/draft/AssignmentStatus",
		"capacityGridUi/view/ODataEntities",
		"sap/ui/core/ValueState",
		"capacityGridUi/localService/mockserver",
		"../../pages/Filter",
		"../../pages/Header",
		"../../pages/MessagePopover",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/PersoDialog",
		"../../pages/QuickView",
		"../../pages/Table",
		"../../pages/Variant"
	],
	function (opaTest, Constants, DraftActions, AssignmentStatus, ODataEntities, valueState, mockserver) {
		"use strict";

		var cols = Constants.columnIds;

		QUnit.module("Assignment Status Journey", {
			afterEach: function () {
				mockserver.resetRequests();
			}
		});

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select monthly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_MONTHLY);
			Then.onTheHeader.theDateRangeMatches(/6 Months/);
		});

		opaTest("Filter Resource Vishwanathan Tendulkar and Tiger Salah", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
		});

		opaTest("Error Message Handling of Assignment Status", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					assignmentStatusCode: AssignmentStatus.HARD_BOOKED
				}
			});
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theAssignmentStatusValueStateRawTextIs("/rows/0/assignments/1", "test message from mockserver");
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onThePage.theMessagesButtonIsVisible();
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
		});

		opaTest("Discard Changes of Assignment Status", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressEditButton();
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);

			// change status for assignment 1
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					assignmentStatusCode: AssignmentStatus.HARD_BOOKED
				}
			});
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theAssignmentStatusValueStateTextIs("/rows/0/assignments/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);

			// discard assignment 1
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.DELETE }
			});
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.KPI_ENTITY_SET
			});
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.None);
			Then.onTheTable.theAssignmentStatusValueStateRawTextIs("/rows/0/assignments/1", "");
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			When.onThePage.pressCancelButton();
		});
		opaTest("Edit & Save Assignment Status", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressEditButton();
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);

			// change status for assignment 1
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					assignmentStatusCode: AssignmentStatus.HARD_BOOKED
				}
			});
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentStatusValueStateTextIs("/rows/0/assignments/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);

			// save
			When.onThePage.pressSaveButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.ACTIVATE }
			});
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.KPI_ENTITY_SET
			});
		});

		opaTest("Edit & Save Assignment Status of Multiple Assignments", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			// enter hours for assignment 0
			When.onTheTable.enterAssignmentHours(2, "/rows/0/assignments/0/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});
			Then.onTheTable.theAssignmentStaffedHoursIs("1047 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/0", false);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.HARD_BOOKED_STRING);

			// enter hours for assignment 1
			When.onTheTable.enterAssignmentHours(6, "/rows/0/assignments/1/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 6
				}
			});
			Then.onTheTable.theAssignmentStaffedHoursIs("704 of 537 hr", "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);

			// change status for assignment 1
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.UPDATE,
					assignmentStatusCode: AssignmentStatus.HARD_BOOKED
				}
			});
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentStatusValueStateTextIs("/rows/0/assignments/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/1", true);

			// save
			When.onThePage.pressSaveButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
		});

		opaTest("Filter for resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
		});

		opaTest("Message Handling - Non Resolvable Errors for Asg Status Update", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheMockServer.failOnNextRequest();
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.None);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);
			
			// Error on changed Status
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			When.onTheMockServer.failOnNextRequest();
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);

			// Error on Resolveable Errors
			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);
			When.onTheMockServer.failOnNextRequest();
			When.onTheTable.changeAssignStatus("/rows/0/assignments/1", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/1", AssignmentStatus.SOFT_BOOKED_STRING);
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/1", valueState.Error);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
