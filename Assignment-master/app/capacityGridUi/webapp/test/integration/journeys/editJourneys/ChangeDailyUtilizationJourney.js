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

		let fnCheckDisplayMode = function (Given, When, Then) {
			Then.onTheVariant.theVariantManagementIsEnabled(true);
			Then.onTheHeader.theViewButtonIsEnabled(true);
			Then.onTheHeader.theDateRangeIsEnabled(true);
			Then.onTheHeader.theTimePeriodNextButtonIsEnabled(true);
			Then.onTheHeader.theTimePeriodPreviousButtonIsEnabled(true);
			Then.onTheTable.theFilterButtonIsEnabled(true);
			Then.onTheTable.theTablePersoButtonIsEnabled(true);
			Then.onThePage.theFooterIsHidden();
			// column menus
			When.onTheTable.pressColumn(cols.NAME);
			Then.onTheTable.theColumnMenuIsVisible();
			When.onTheTable.pressColumn(cols.STAFFING_HRS);
			Then.onTheTable.theColumnMenuIsVisible();
		};

		let fnCheckEditMode = function (Given, When, Then) {
			Then.onTheVariant.theVariantManagementIsEnabled(false);
			Then.onTheHeader.theViewButtonIsEnabled(false);
			Then.onTheHeader.theDateRangeIsEnabled(false);
			Then.onTheHeader.theTimePeriodNextButtonIsEnabled(false);
			Then.onTheHeader.theTimePeriodPreviousButtonIsEnabled(false);
			Then.onTheTable.theTablePersoButtonIsEnabled(false);
			Then.onThePage.theFooterIsVisible();
			// column menus
			When.onTheTable.pressColumn(cols.NAME);
			Then.onThePage.theMessageToastIsVisible("SAVE_CHANGES_TO_PROCEED");
			When.onTheTable.pressColumn(cols.RESOURCE_ORG);
			Then.onThePage.theMessageToastIsVisible("SAVE_CHANGES_TO_PROCEED");
			When.onTheTable.pressColumn(cols.STAFFING_HRS);
			Then.onThePage.theMessageToastIsVisible("SAVE_CHANGES_TO_PROCEED");
		};

		QUnit.module("Change Daily Utilization Journey", {
			afterEach: function () {
				mockserver.resetRequests();
			}
		});

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
			fnCheckDisplayMode(Given, When, Then);
		});

		opaTest("Select daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
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

		opaTest("Start Edit", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			fnCheckEditMode(Given, When, Then);
		});

		opaTest("Save hours for Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 01");

			// expand
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 01");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 04");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/1", "58 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/1", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(42, "/rows/1/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/1/utilization/1", valueState.Error);
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1140 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theUtilFreeHoursIs(4, "/rows/1/utilization/1");

			// enter util for assignment 0
			When.onTheTable.enterAssignmentHours(2, "/rows/1/assignments/0/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/1", "47 %");
			Then.onTheTable.theResourceAvgUtilizationStateIs("/rows/1", valueState.Error);
			Then.onTheTable.theResourceUtilizationIs(28, "/rows/1/utilization/1");
			Then.onTheTable.theResourceUtilizationValueStateIs("/rows/1/utilization/1", valueState.Error);
			Then.onTheTable.theAssignmentDurationHoursIs("110 hr", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1139 of 1038 hr", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentDurationHoursIs("111 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1139 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theUtilFreeHoursIs(5, "/rows/1/utilization/1");
			Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs("/rows/1/assignments/0/utilization/1", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/0/utilization/1", valueState.Information);

			// save
			When.onThePage.pressSaveButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.ACTIVATE }
			});
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.KPI_ENTITY_SET
			});
		});

		// Added Seperated display mode check because its not executing after Save action
		opaTest("Check Display Mode", function (Given, When, Then) {
			fnCheckDisplayMode(Given, When, Then);
		});

		opaTest("Should Able See Updated Staffed and Remaining Hours On Resource Quickview", function (Given, When, Then) {
			When.onTheTable.pressResourceNameLink("Prototype Talent Management 01");
			Then.onTheQuickView.theQuickIsOpen();
			Then.onTheQuickView.theElementIs("STAFFED_EFFORT", "1140 hr / 1038 hr");
			Then.onTheQuickView.theElementIs("REMAINING_EFFORT", "-102 hr");
		});

		opaTest("Reset Filter", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Message Handling - Edit Assignment 0", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.enterAssignmentHours(6, "/rows/0/assignments/0/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 6
				}
			});
			Then.onTheTable.theAssignmentStaffedHoursIs("1143 of 1038 hr", "/rows/0/assignments/0");
			Then.onTheTable.theProgressBarPercentIs(100, "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.thePopoverIsVisible();
			Then.onTheMessagePopover.theDetailLinkIs("test message from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 01");
			When.onTheMessagePopover.pressCloseButton();
			Then.onThePage.theMessagesButtonIsVisible();
		});

		opaTest("Message Handling - Edit Assignment 1", function (Given, When, Then) {
			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.enterAssignmentHours(8, "/rows/0/assignments/1/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 8
				}
			});
			Then.onTheTable.theAssignmentStaffedHoursIs("784 of 537 hr", "/rows/0/assignments/1");
			Then.onTheTable.theProgressBarPercentIs(100, "/rows/0/assignments/1");
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Error);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/1/utilization/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(2);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.thePopoverIsVisible();
			Then.onTheMessagePopover.theMessagesListHasLength(2);
			Then.onTheMessagePopover.theMessageItemIsVisible("test message from mockserver", "Vishwanathan Tendulkar > Prototype Talent Management 01");
			Then.onTheMessagePopover.theMessageItemIsVisible("test message from mockserver", "Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onTheMessagePopover.pressCloseButton();
		});

		opaTest("Message Handling - Save All", function (Given, When, Then) {
			When.onTheMockServer.failOnNextRequest();
			When.onThePage.pressSaveButton();
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.ACTIVATE }
			});
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onTheMessagePopover.thePopoverIsVisible();
		});

		opaTest("Message Handling - Discard Changes Of All Selected Assignments", function (Given, When, Then) {
			When.onTheTable.enterAssignmentHours(6, "/rows/0/assignments/0/utilization/1"); // this is to bring back the focus to table view from the page view
			When.onTheTable.selectRow(1);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDiscardButton();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.DELETE }
			});
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.KPI_ENTITY_SET
			});
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.None);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/1/utilization/1", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
		});

		opaTest("Message Handling - Cancel", function (Given, When, Then) {
			// enter hours for assignment 0
			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.enterAssignmentHours(6, "/rows/0/assignments/0/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 6
				}
			});
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);

			// cancel
			When.onThePage.pressCancelButton();
			When.onThePage.pressConfirmDialogOkButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon"); // row was collapsed on cancel
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: {
					action: DraftActions.DELETE
				}
			}); // cannot use assignmentRequestSentToServer. it points to the expand
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			fnCheckDisplayMode(Given, When, Then);
		});

		opaTest("Filter Resource Will Winfrey", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Will");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(00ae14ab-6599-3ab9-8614-a6751c0fecf7)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Assignment Should Not Be Editable When RR is Resolved", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressEditButton();
			Then.onTheTable.theAssignmentStaffedHoursIs("960 of 800 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStatusIsEditable("/rows/0/assignments/0", false);
			Then.onTheTable.theAssignmentStatusSelectedKeyIs("/rows/0/assignments/0", AssignmentStatus.SOFT_BOOKED_STRING);
			Then.onTheTable.theAssignmentBookedCapacityIsEditable("/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityIsEditable("/rows/0/assignments/0/utilization/1");
			Then.onTheTable.theAssignmentBookedCapacityIsEditable("/rows/0/assignments/0/utilization/2");
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

		opaTest("Save Assignment Project wise: No Errors", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");

			When.onTheTable.enterAssignmentHours(2, "/rows/0/assignments/0/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});

			When.onTheTable.enterAssignmentHours(2, "/rows/1/assignments/0/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});

			When.onTheTable.enterAssignmentHours(2, "/rows/1/assignments/1/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});
			When.onThePage.pressSaveButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.KPI_ENTITY_SET
			});
			Then.onTheVariant.theVariantManagementIsEnabled(true);
			Then.onTheHeader.theViewButtonIsEnabled(true);
			Then.onTheHeader.theDateRangeIsEnabled(true);
			Then.onTheHeader.theTimePeriodNextButtonIsEnabled(true);
			Then.onTheHeader.theTimePeriodPreviousButtonIsEnabled(true);
			Then.onTheTable.theFilterButtonIsEnabled(true);
			Then.onTheTable.theTablePersoButtonIsEnabled(true);
			Then.onThePage.theFooterIsHidden();
		});

		opaTest("Save Assignment Project wise: ChangeSet of Project 1 failed/Fail All", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");

			// Edit Asg of Tiger Salah.
			When.onTheTable.enterAssignmentHours(2, "/rows/0/assignments/0/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});

			// Delete 1st Assignments of Vishwanath Tendulkar.
			When.onTheTable.selectRow(3);
			When.onTheTable.pressDeleteAssignmentButton();
			When.onTheTable.selectRow(3);

			// Add Assignment to Vishwanth Tendulkar
			When.onTheTable.selectRow(2);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/1/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");

			// Update 2nd Assignment of Vishwanath Tendulkar.
			When.onTheTable.enterAssignmentHours(2, "/rows/1/assignments/2/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/2",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});

			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/2", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/2/utilization/1", valueState.Information);
			// Error on First Asg of Tiger
			When.onTheMockServer.failOnNextRequest({ target: "582068b8-c4c9-46d5-b303-17dff74a113b" });
			When.onThePage.pressSaveButton();
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);
			Then.onTheMessagePopover.thePopoverIsVisible();
			Then.onTheMessagePopover.theDetailLinkIs("test error 500 from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Tiger Salah > Prototype Talent Management 01");
			When.onThePage.pressMessageButton();

			// check for Expected UI states
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/2", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/2/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 3);

			// check for deleted asg.
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/1", true);
			Then.onTheTable.theRequestInputIsVisible("/rows/1/assignments/1", false);
			Then.onTheTable.theRequestLinkIsVisible("/rows/1/assignments/1", false);
			Then.onTheTable.theStaffingSummaryIsVisible("/rows/1/assignments/1", false);

			// check for created asg.
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/0", false);
			Then.onTheTable.theRequestInputIsVisible("/rows/1/assignments/0", true);
			Then.onTheTable.theRequestLinkIsVisible("/rows/1/assignments/0", false);
			Then.onTheTable.theStaffingSummaryIsVisible("/rows/1/assignments/0", true);
			When.onThePage.pressSaveButton();
		});

		opaTest("Save Assignment Project wise: Batch of Project 2 failed/Partial Success", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");

			// Edit Asg of Tiger Salah.
			When.onTheTable.enterAssignmentHours(2, "/rows/0/assignments/0/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});

			// Delete 1st Assignments of Vishwanath Tendulkar.
			When.onTheTable.selectRow(3);
			When.onTheTable.pressDeleteAssignmentButton();
			When.onTheTable.selectRow(3);

			// Add Assignment to Vishwanth Tendulkar
			When.onTheTable.selectRow(2);
			When.onTheTable.pressAddAssignmentButton();
			When.onTheTable.enterRequest("0500000126", "/rows/1/assignments/0");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");

			// Update 2nd Assignment of Vishwanath Tendulkar.
			When.onTheTable.enterAssignmentHours(2, "/rows/1/assignments/2/utilization/1"); // from 3 to 2 (+1)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/1/assignments/2",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 2
				}
			});

			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/2", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/2/utilization/1", valueState.Information);
			// Error on Second Asg of Vishwanath
			When.onTheMockServer.failOnNextRequest({ target: "188bb8e8-5f04-4503-973a-773ef0fccc00" });
			When.onThePage.pressSaveButton();
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);
			Then.onTheMessagePopover.thePopoverIsVisible();
			Then.onTheMessagePopover.theDetailLinkIs("test error 500 from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onThePage.pressMessageButton();

			// check for Expected UI states
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/0", valueState.None);
			Then.onTheTable.theRowHighlightIs("/rows/1/assignments/1", valueState.Error);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.None);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/0/utilization/1", valueState.None);
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/1/assignments/1/utilization/1", valueState.Information);
			Then.onTheTable.theAssignmentCountIs("/rows/0/assignments", 1);
			Then.onTheTable.theAssignmentCountIs("/rows/1/assignments", 2);

			// check for created asg.
			Then.onTheTable.theDeletedRequestLinkIsVisible("/rows/1/assignments/0", false);
			Then.onTheTable.theRequestInputIsVisible("/rows/1/assignments/0", false);
			Then.onTheTable.theRequestLinkIsVisible("/rows/1/assignments/0", true);
			Then.onTheTable.theStaffingSummaryIsVisible("/rows/1/assignments/0", true);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);