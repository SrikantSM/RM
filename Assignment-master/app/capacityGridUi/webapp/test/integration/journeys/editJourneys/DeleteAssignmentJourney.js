/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/ODataEntities",
		"sap/ui/core/ValueState",
		"../../pages/Filter",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/PersoDialog",
		"../../pages/Table"
	],
	function (opaTest, DraftActions, ODataEntities, valueState) {
		"use strict";

		QUnit.module("Delete Assignment Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		let fnCheckDeletedAssignment = function (sPath, Given, When, Then) {
			Then.onTheTable.theDeletedRequestLinkIsVisible(sPath, true);
			Then.onTheTable.theRequestInputIsVisible(sPath, false);
			Then.onTheTable.theRequestLinkIsVisible(sPath, false);
			Then.onTheTable.theStaffingSummaryIsVisible(sPath, false);
			Then.onTheTable.theUtilPerAsgHourIsVisible(sPath, false);
			Then.onTheTable.theAssignmentStatusIsVisible(sPath, false);
			Then.onTheTable.theProjectIsVisible(sPath, false);
			Then.onTheTable.theCustomerIsVisible(sPath, false);
			Then.onTheTable.theProjectRoleIsVisible(sPath, false);
			Then.onTheTable.theUtilInputIsVisible(sPath, false);
		};

		opaTest("Filter Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Display Additional Columns of Request Data", function (Given, When, Then) {
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			When.onThePersoDialog.pressResetButton();
			When.onThePersoDialog.selectCheckBox(5);
			When.onThePersoDialog.selectCheckBox(6);
			When.onThePersoDialog.selectCheckBox(7);
			When.onThePersoDialog.selectCheckBox(8);
			When.onThePersoDialog.pressOkButton();
		});

		opaTest("Delete Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDeleteAssignmentButton();
			When.onTheTable.pressDeletedResourceLink("/rows/0/assignments/1");
			Then.onTheQuickView.theQuickIsOpen();
			fnCheckDeletedAssignment("/rows/0/assignments/1", Given, When, Then);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.CREATE
				}
			});
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "26 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(6, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(195, "/rows/0/utilization/1");
		});

		opaTest("Save Assignment of Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onThePage.pressSaveButton();
			Then.onTheMockServer.assignmentRequestSentToServer({
				url: "/odata/v4/CapacityService/AssignmentsDetailsForCapacityGrid(188bb8e8-5f04-4503-973a-773ef0fccc00)",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET
			});
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
		});

		opaTest("Filter Resource Tiger Salah", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Tiger Salah");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(a9e19a53-e9d5-4820-8665-c978b575f646)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Delete Assignment of Resource Tiger Salah and Discard the deletion", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDeleteAssignmentButton();
			fnCheckDeletedAssignment("/rows/0/assignments/0", Given, When, Then);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.CREATE
				}
			});
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "-23 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(-46, "/rows/0/utilization/0");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/0", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(303, "/rows/0/utilization/1");
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.DELETE }
			});
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theRequestInputIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theRequestLinkIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theStaffingSummaryIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theUtilPerAsgHourIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentStatusIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theProjectIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theCustomerIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theProjectRoleIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theUtilInputIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "0 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(0, "/rows/0/utilization/0");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/0", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(208, "/rows/0/utilization/1");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			When.onThePage.pressCancelButton();
		});

		opaTest("Delete newly added assignment", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(1);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressRequestValueHelp("/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheMockServer.assignmentRequestSentToServer({
				url: "/odata/v4/CapacityService/AssignmentsDetailsForCapacityGrid(662068b8-c4c9-46d5-b303-17dff74a113b)",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET
			});
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			When.onThePage.pressCancelButton();
		});

		opaTest("Discard the update and delete assignment", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.enterAssignmentHours(97, "/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs("/rows/0/assignments/0/utilization/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/0", valueState.Information);
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.CREATE }
			});
			Then.onTheTable.theUtilInputIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.DELETE }
			});
			Then.onTheTable.theUtilInputIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.None);
			Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs("/rows/0/assignments/0/utilization/0", "");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/0", valueState.None);
			Then.onTheTable.theAssignmentBookedCapacityIs("95", "/rows/0/assignments/0/utilization/0");
			When.onThePage.pressCancelButton();
		});

		opaTest("Filter Resource Vishwanathan Tendulkar and Tiger salah", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.enterResourceName("Tiger Salah");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(a9e19a53-e9d5-4820-8665-c978b575f646)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Delete multiple assignment and save", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(3);
			When.onTheTable.pressDeleteAssignmentButton();
			fnCheckDeletedAssignment("/rows/0/assignments/0", Given, When, Then);
			fnCheckDeletedAssignment("/rows/1/assignments/0", Given, When, Then);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 2);
			When.onThePage.pressSaveButton();
			Then.onTheMockServer.requestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.DELETE }
			});
			Then.onTheMockServer.requestSentToServer({
				path: "/rows/1/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.DELETE }
			});
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.None);
		});

		opaTest("Delete Assignment of Tiger salah and check dependent staffing summary", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressGoButton();
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/1/assignments/0");
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheTable.theAssignmentStaffedHoursIs("1029 of 1038 hr", "/rows/1/assignments/0");
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/1/assignments/0");
			When.onThePage.pressSaveButton();
		});

		opaTest("Filter Resource Vishwanathan Tendulkar and Tiger salah", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.enterResourceName("Tiger Salah");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(a9e19a53-e9d5-4820-8665-c978b575f646)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Test Error on failed to delete assignments (All or Nothing)", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(3);
			When.onTheTable.selectRow(4);
			When.onTheMockServer.failOnNextRequest({ target: "662068b8-c4c9-46d5-b303-17dff74a113b" });
			When.onTheTable.pressDeleteAssignmentButton();
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/0", false);
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/1", false);
			Then.onTheTable.theRequestLinkIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theRequestLinkIsVisible("/rows/1/assignments/0", true);
			Then.onTheTable.theRequestLinkIsVisible("/rows/1/assignments/1", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.None);
			When.onThePage.pressSaveButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
