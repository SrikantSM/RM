/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/localService/mockserver",
		"../../pages/Filter",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/PersoDialog",
		"../../pages/Table"
	],
	function (opaTest, Constants, DraftActions, ODataEntities, mockserver) {
		"use strict";

		QUnit.module("Keep Alive Journey", {
			afterEach: function () {
				mockserver.resetRequests();
			}
		});

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			When.onThePage.configureKeepAlive(0, 2000); // why? default value are in the minutes range
			Then.onThePage.theAppIsVisible();
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

		opaTest("Start Edit", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressEditButton();
		});

		opaTest("Change Assigment 1", function (Given, When, Then) {
			When.onTheTable.enterAssignmentHours(2, "/rows/0/assignments/0/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET,
				data: { action: DraftActions.CREATE }
			});
		});

		opaTest("Change Assigment 2", function (Given, When, Then) {
			When.onTheTable.enterAssignmentHours(2, "/rows/0/assignments/1/utilization/1");
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET,
				data: { action: DraftActions.CREATE }
			});
		});

		opaTest("Press a Hide and show columns 6 times ... until Draft is renewed", function (Given, When, Then) {
			// and why do we now press 6 times a check? we need to
			//  (a) let some time pass until the keep alive kicks in
			//  (b) press some stuff in the UI to that the user was active in the meantime
			for (let i = 0; i < 8; i++) {
				When.onTheTable.pressHideLeadingColumnsButton();
				When.onTheTable.pressShowAllColumnsButton();
			}
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/0",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.EXTEND_EXPIRY }
			});
			Then.onTheMockServer.assignmentRequestSentToServer({
				path: "/rows/0/assignments/1",
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				data: { action: DraftActions.EXTEND_EXPIRY }
			});
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
