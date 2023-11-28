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

		QUnit.module("Create Assignment Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		let fnCheckEmptyAssignment = function (sPath, Given, When, Then) {
			Then.onTheTable.theRequestInputIsVisible(sPath, true);
			Then.onTheTable.theRequestLinkIsVisible(sPath, false);
			Then.onTheTable.theDeletedRequestLinkIsVisible(sPath, false);
			Then.onTheTable.theStaffingSummaryIsVisible(sPath, false);
			Then.onTheTable.theUtilPerAsgHourIsVisible(sPath, false);
			Then.onTheTable.theAssignmentStatusIsVisible(sPath, false);
			Then.onTheTable.theProjectIsVisible(sPath, false);
			Then.onTheTable.theCustomerIsVisible(sPath, false);
			Then.onTheTable.theProjectRoleIsVisible(sPath, false);
			Then.onTheTable.theUtilInputIsVisible(sPath, false);
		};

		let fnCheckAsgOnRequestSelect = function (Given, When, Then) {
			Then.onTheTable.theRequestInputIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theRequestLinkIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/0/assignments/0", false);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theStaffingSummaryIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theUtilPerAsgHourIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentStatusIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theProjectIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theCustomerIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theProjectRoleIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theUtilInputIsVisible("/rows/0/assignments/0", true);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/0", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs("/rows/0/assignments/0/utilization/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentStatusValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
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

		opaTest("Add Assignment to Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			fnCheckEmptyAssignment("/rows/0/assignments/0", Given, When, Then);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 3);
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "58 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(46, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(113, "/rows/0/utilization/1");
		});

		opaTest("Enter a valid request and verify assignment", function (Given, When, Then) {
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.REQUEST_VH_ENTITY_SET,
				url: "$filter=requestStatusCode eq 0 and processingResourceOrganizationId eq 'RM-TA-DE01'&$select=Id,customerId,customerName,displayId,endDate,name,projectId,projectName,requestedCapacityInHours,startDate"
			});
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			fnCheckAsgOnRequestSelect(Given, When, Then);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "68 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(91, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Success);
			Then.onTheTable.theUtilFreeHoursIs(18, "/rows/0/utilization/1");
			Then.onTheTable.theAssignmentBookedCapacityIs(95, "/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityIs(95, "/rows/0/assignments/0/utilization/5");
		});

		opaTest("Save assignment with valid request", function (Given, When, Then) {
			When.onThePage.pressSaveButton();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				url: "AssignmentsDetailsForCapacityGrid(662068b8-c4c9-46d5-b303-17dff74a113b)"
			});
			Then.onThePage.theMessagesButtonIsNotVisible();
		});

		opaTest("Save with empty assignments", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 4);
			When.onThePage.pressSaveButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
		});

		opaTest("Select weekly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheHeader.theDateRangeMatches(/8.*Weeks/);
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

		opaTest("Discard assignment with valid request", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressRequestValueHelp("/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.REQUEST_VH_ENTITY_SET,
				url: "$filter=requestStatusCode eq 0 and processingResourceOrganizationId eq 'RM-TA-DE02'&$select=Id,customerId,customerName,displayId,endDate,name,projectId,projectName,requestedCapacityInHours,startDate"
			});
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			Then.onTheTable.theAssignmentBookedCapacityIs(21, "/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityIs(35, "/rows/0/assignments/0/utilization/7");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "64 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(75, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Warning);
			Then.onTheTable.theUtilFreeHoursIs(7, "/rows/0/utilization/1");
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "0 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(0, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(28, "/rows/0/utilization/1");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			When.onThePage.pressCancelButton();
		});

		opaTest("Discard empty assignments", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 3);
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			When.onThePage.pressCancelButton();
		});

		opaTest("Enter Invalid Request", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000556", "/rows/0/assignments/0");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "REQUEST_INVALID_MSG");
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000559", "/rows/0/assignments/1");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Error);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/1", "REQUEST_INVALID_MSG");
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000529", "/rows/0/assignments/2");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/2", valueState.Error);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/2", "REQUEST_INVALID_MSG");
			When.onThePage.pressSaveButton();
			Then.onTheMessagePopover.thePopoverIsVisible();
			Then.onThePage.theMessagesCountIs(3);
			Then.onTheMessagePopover.theMessagesListHasLength(3);
			Then.onTheMessagePopover.theMessageItemIsVisible("Enter valid request.", "Tiger Salah > 0500000556");
			Then.onTheMessagePopover.theMessageItemIsVisible("Enter valid request.", "Tiger Salah > 0500000559");
			Then.onTheMessagePopover.theMessageItemIsVisible("Enter valid request.", "Tiger Salah > 0500000529");
			When.onTheMessagePopover.pressCloseButton();
			When.onTheTable.enterRequest("", "/rows/0/assignments/2");
			Then.onThePage.theMessagesCountIs(2);
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(1);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesCountIs(1);
			When.onTheTable.pressDiscardButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Select daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
		});

		opaTest("Enter valid request and invalidate", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 2);
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "47 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(42, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(4, "/rows/0/utilization/1");
			Then.onTheTable.theAssignmentBookedCapacityIs(3, "/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityIs(3, "/rows/0/assignments/0/utilization/7");
			When.onTheTable.enterRequest("", "/rows/0/assignments/0");
			Then.onTheMockServer.requestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.CREATE }
			});
			When.onTheTable.enterRequest("050000666", "/rows/0/assignments/0");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			fnCheckEmptyAssignment("/rows/0/assignments/0", Given, When, Then);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "REQUEST_INVALID_MSG");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "0 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(0, "/rows/0/utilization/1");
			Then.onTheTable.theUtilFreeHoursIs(7, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Select monthly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_MONTHLY);
			Then.onTheHeader.theDateRangeMatches(/6 Months/);
		});

		opaTest("Request Failed to load response", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheMockServer.failOnNextRequest();
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Tiger Salah > Prototype Talent Management 01");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			fnCheckEmptyAssignment("/rows/0/assignments/0", Given, When, Then);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "175 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(0, "/rows/0/utilization/1");
			Then.onTheTable.theUtilFreeHoursIs(208, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Change of request failing to delete existing draft", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			When.onTheMockServer.failOnNextRequest();
			When.onTheTable.enterRequest("0500003993", "/rows/0/assignments/0");
			Then.onTheMessageDialog.theTextIsVisible("test error 500 from mockserver");
			Then.onTheMessageDialog.theTextIsVisible("Tiger Salah > Prototype Talent Management 01");
			When.onTheMessageDialog.pressCloseButton();
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			fnCheckAsgOnRequestSelect(Given, When, Then);
			Then.onTheTable.theRequestInputValueStateTextIs("/rows/0/assignments/0", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theRequestInputValueStateIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.HARD_BOOKED_STRING);
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "22 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/0", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(45, "/rows/0/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/0/utilization/1", valueState.Error);
			Then.onTheTable.theUtilFreeHoursIs(113, "/rows/0/utilization/1");
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
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

		opaTest("Add Duplicate request to resource Tiger salah", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.pressAddAssignmentButton();
			Then.onTheTable.theResourceIsExpanded("/rows/0", true);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 3);
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			fnCheckAsgOnRequestSelect(Given, When, Then);
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/1");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onThePage.theErrorIsVisible("REQUEST_ASSIGNED_TO_RESOURCE");
			Then.onTheMessageDialog.theTextIsVisible("The resource is already assigned to the request.");
			Then.onTheMessageDialog.theTextIsVisible("Tiger Salah > Prototype Talent Management 01");
			When.onTheMessageDialog.pressCloseButton();
			fnCheckEmptyAssignment("/rows/0/assignments/1", Given, When, Then);
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Filter Resource Vishwanathan Tendulkar Ayan Musk and Ayan Smith", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e4beae01-a0ef-41fa-9037-e4da36a12741)", "lastName");
			When.onTheFilter.enterResourceName("Ayan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(0060cb84-7e67-2e66-f6d5-f0159zd5b3b2)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(3);
		});

		opaTest("Edit RR of Vishanathan and check dependent staffing summary of Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/2/assignments/0");
			When.onTheTable.enterAssignmentHours(100, "/rows/2/assignments/0/utilization/0");
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheTable.theAssignmentStaffedHoursIs("1256 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1256 of 1038 hr", "/rows/2/assignments/0");
		});

		opaTest("Create Assignment for Ayan Smith and check the dependent staffing summary", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/1/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onTheTable.theAssignmentStaffedHoursIs("1367 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1367 of 1038 hr", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1367 of 1038 hr", "/rows/2/assignments/0");
			When.onThePage.pressSaveButton();
		});

		opaTest("Filter Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Create Assignment for Vishwanathan Tendulkar and Test for Information Message and Warning Message", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheMockServer.messageOnNextRequest({ target: "662068b8-c4c9-46d5-b303-17dff74a113b", messageType: "Information" });
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.theDetailLinkIs("test message from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			When.onThePage.pressMessageButton();

			// Check for warning Message
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000127", "/rows/0/assignments/1");
			When.onTheMockServer.messageOnNextRequest({ target: "6dd29689-623a-454d-934a-ac921a458f24", messageType: "Warning" });
			When.onTheFilter.selectFromValueHelp("/RequestsVH(7ed89d17-053d-4aa1-b74a-5b9d9709cfa6)", "displayId");
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(2);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.theDetailLinkIs("test message from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Warning);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Warning);
			When.onThePage.pressSaveButton();
		});

		opaTest("Create Assignment for Vishwanathan Tendulkar and Test for Creation with Error and Warning", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.selectRow(0);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/0/assignments/0");
			When.onTheMockServer.messageOnNextRequest({ target: "662068b8-c4c9-46d5-b303-17dff74a113b" });
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.theDetailLinkIs("test message from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			When.onThePage.pressMessageButton();

			// Check for warning Message
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000127", "/rows/0/assignments/1");
			When.onTheMockServer.messageOnNextRequest({ target: "6dd29689-623a-454d-934a-ac921a458f24", messageType: "Warning" });
			When.onTheFilter.selectFromValueHelp("/RequestsVH(7ed89d17-053d-4aa1-b74a-5b9d9709cfa6)", "displayId");
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(2);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.theDetailLinkIs("test message from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Warning);

			When.onThePage.pressSaveButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
