/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"sap/ui/core/ValueState",
		"../../pages/Filter",
		"../../pages/Page",
		"../../pages/MessagePopover",
		"../../pages/MockServer",
		"../../pages/PersoDialog",
		"../../pages/Table"
	],
	function (opaTest, valueState) {
		"use strict";

		QUnit.module("Edit Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Error Handling - Show Row by Message", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			Then.onTheTable.theResourceNameLinkIsVisible("Alex Kardashian");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.enterAssignmentHours(200, "/rows/1/assignments/0/utilization/4");
			When.onTheTable.scrollToRow(30);
			When.onTheTable.scrollToRow(50);
			When.onThePage.pressMessageButton();
			Then.onTheMessagePopover.theDetailLinkIs("test message from mockserver");
			Then.onTheMessagePopover.theTextIsVisible("Alex Kardashian > Prototype Talent Management 03");
			When.onTheMessagePopover.pressBackButton();
			Then.onTheMessagePopover.theMessageItemIsVisible("test message from mockserver", "Alex Kardashian > Prototype Talent Management 03");
			When.onTheMessagePopover.pressMessageLink("test message from mockserver");
			Then.onTheTable.theFirstVisibleRowIs("tblCapacity", 2); // Row no 2->1st Assignment of Alex
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
			Then.onThePage.theMessagesButtonIsNotVisible();
		});

		opaTest("Filter and Expand Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
		});

		opaTest("Error Handling - Enter valid hours after entering erroneous hours", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");

			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.enterAssignmentHours("1", "/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);

			When.onTheMockServer.messageOnNextRequest();
			When.onTheTable.enterAssignmentHours("1", "/rows/0/assignments/0/utilization/1");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);

			When.onTheTable.enterAssignmentHours("2", "/rows/0/assignments/0/utilization/0");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);

			When.onTheTable.enterAssignmentHours("2", "/rows/0/assignments/0/utilization/1");
			Then.onTheTable.theAssignmentBookedCapacityValueStateIs("/rows/0/assignments/0/utilization/1", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/0", valueState.Information);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Information);

			// cleanup
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Error Handling - Save for S4 Integration when assignment ID is returned", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");

			When.onTheTable.enterAssignmentHours(150, "/rows/0/assignments/1/utilization/0");
			When.onTheMockServer.failOnNextRequest({ code: 406 });
			When.onThePage.pressSaveButton();
			Then.onTheTable.theRowHighlightIs("/rows/0/assignments/1", valueState.Error);
			Then.onTheTable.theRowHighlightIs("/rows/0", valueState.Error);
			Then.onThePage.theMessagesButtonIsVisible();
			Then.onThePage.theMessagesCountIs(1);
			Then.onTheMessagePopover.thePopoverIsVisible();
			Then.onTheMessagePopover.theDetailLinkIs("Cost center 0010101902 is not assigned to service org Service Organization - Company DE.,");
			Then.onTheMessagePopover.theTextIsVisible("Vishwanathan Tendulkar > Prototype Talent Management 04");
			When.onTheMessagePopover.pressBackButton();
			Then.onTheMessagePopover.theMessageItemIsVisible(
				"Cost center 0010101902 is not assigned to service org Service Organization - Company DE.,",
				"Vishwanathan Tendulkar > Prototype Talent Management 04"
			);
			When.onTheMessagePopover.pressCloseButton();
			Then.onThePage.theMessagesButtonIsVisible();

			// cleanup
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Footer Draft Text Is Visible", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.enterAssignmentHours("7", "/rows/0/assignments/0/utilization/1");
			Then.onThePage.theFooterDraftTextIsVisible("SIMULATION_COMPLETED");
			When.onThePage.pressCancelButton();
			Then.onThePage.theConfirmationDialogIsVisible();
			When.onThePage.pressConfirmDialogOkButton();
		});

		opaTest("Input Validation - Negative Hours", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.enterAssignmentHours("-1", "/rows/0/assignments/0/utilization/1");
			Then.onThePage.theMessageToastIsVisible("INVALID_NUMBER_REVERTED");
			Then.onTheTable.theAssignmentBookedCapacityIs("95", "/rows/0/assignments/0/utilization/1");
		});

		opaTest("Input Validation - Text Hours", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			When.onTheTable.enterAssignmentHours("e", "/rows/0/assignments/0/utilization/1");
			Then.onThePage.theMessageToastIsVisible("INVALID_NUMBER_REVERTED");
			Then.onTheTable.theAssignmentBookedCapacityIs("95", "/rows/0/assignments/0/utilization/1");
		});

		opaTest("Input Validation - Too High Hours", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row1-treeicon");
			When.onTheTable.enterAssignmentHours("10001", "/rows/0/assignments/0/utilization/1");
			Then.onThePage.theMessageToastIsVisible("VERY_HIGH_NUMBER_REVERTED", [10000]);
			Then.onTheTable.theAssignmentBookedCapacityIs("95", "/rows/0/assignments/0/utilization/1");
		});

		opaTest("Issue 2270095694, revert changes fail", function (Given, When, Then) {
			When.onTheTable.enterAssignmentHours("96", "/rows/0/assignments/0/utilization/1"); // 95 -> 96
			When.onThePage.pressSaveButton();
			// When.onTheTable.pressEditButton();
			// When.onTheTable.enterAssignmentHours("97", "/rows/0/assignments/0/utilization/1"); // 96 -> 97
			// When.onTheTable.selectRow(1);
			// When.onTheTable.pressDiscardButton();
			// When.onThePage.pressConfirmDialogOkButton();
			// Then.onTheTable.theAssignmentBookedCapacityIs("96", "/rows/0/assignments/0/utilization/1"); // and not 95
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
