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
		"../../pages/Variant",
		"../../pages/MessageDialog"
	],
	function (opaTest, Constants, DraftActions, AssignmentStatus, ODataEntities, valueState, mockserver) {
		"use strict";

		let cols = Constants.columnIds;

		let fnCheckEditMode = function (Given, When, Then) {
			Then.onTheVariant.theVariantManagementIsEnabled(false);
			Then.onThePage.theHeaderIsHidden();
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

		QUnit.module("Focused Edit Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Edit Button with Count - Text Verification", function (Given, When, Then) {
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(2);
			Then.onTheTable.checkEditButtonText(2);
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(2);
			Then.onTheTable.checkEditButtonText(0);
			When.onTheTable.selectRow(0);
			When.onTheTable.selectRow(2);
			When.onTheTable.pressDeselectButton();
			Then.onTheTable.checkEditButtonText(0);
		});

		opaTest("Edit Button - Action Excecution and Verification of Edit", function (Given, When, Then) {
			When.onTheTable.selectRow(1);
			When.onTheTable.pressEditButton();
			Then.onTheTable.theTitleCountIs(1);
			fnCheckEditMode(Given, When, Then);
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheTable.theResourceNameLinkIsVisible("Prototype Talent Management 03");
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "32 %");
			Then.onTheTable.theAssignmentDurationHoursIs("333 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1170 of 296 hr", "/rows/0/assignments/0");

			// enter util for assignment 0
			When.onTheTable.enterAssignmentHours(240, "/rows/0/assignments/0/utilization/4"); // from 95 to 99 (+4)
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET,
				data: {
					action: DraftActions.CREATE,
					bookedCapacityInHours: 240
				}
			});
			Then.onTheTable.theResourceAvgUtilizationTextIs("/rows/0", "23 %");
			Then.onTheTable.theAssignmentDurationHoursIs("339 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentStaffedHoursIs("1176 of 296 hr", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs("/rows/0/assignments/0/utilization/4", "EDITED_CELL_INFO_MSG");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/4", valueState.Information);

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

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
