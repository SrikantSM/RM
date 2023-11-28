require("../../../../cross-domain-e2e/pages/processResourceRequestPages");
require("../../../../pages/flpPage.js");

function executeTest(supaHelper) {
	it("should set data", async function () {
		enter = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ENTER));
		tab = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.TAB));
		shiftTab = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.TAB));
		right = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_RIGHT));
		left = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_LEFT));
		up = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_UP));
		down = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_DOWN));
		backSpace = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.BACK_SPACE));
		f4 = browser.actions().sendKeys(protractor.Key.F4);
		clickCC = browser.actions().sendKeys("D1");
	});

	it("Should click on Staff Resource Request App", function () {
		When.onTheFlpPage.iClickTileStaffResourceRequest();
	});

	it("Should navigate to the Staff Resource Request List Report", function () {
		Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
	});

	it("Should click on first 'Not Staffed' and 'Open' Resource Request", function () {
		// When.onTheProcessResourceRequestPage.iClickonFilterExpandButton();
		When.onTheProcessResourceRequestPage.iSelectStaffingStatus("Not Staffed");
		When.onTheProcessResourceRequestPage.iSelectRequestStatus("Open");
		When.onTheProcessResourceRequestPage.iClickTheFirstRow();
	});

	it("Should navigate to the Staff Resource Request Object page", function () {
		Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
	});

	it("Should navigate to Maching Resource Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnMatchingCandidateSection();
	});

	it("Maching Resources table row count should be greater than 00", function () {
		Then.onTheProcessResourceRequestPage.theMatchingResourceTableCountIsGreaterThan(0);
	});

	it("Click on Assign button to open Popup ", function () {
		// // Measurement
		tab.perform();
		tab.perform();
		tab.perform();
		tab.perform();
		tab.perform();
		tab.perform();
		tab.perform();

		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("010 Click Assign for one of the matching candidates");
			});
		}

		enter.perform();
	
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Should see the Assign Dialg", function () {
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBePresent();
	});

	it("Create Assignment Measurement", function () {
		//Measurement
		When.onTheProcessResourceRequestPage.iEnterTheHoursSUPA(100);
		tab.perform();
		tab.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("020 Enter staffed hours and click OK");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Assign pop up should be closed", function () {
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
	});

	// Update Scneario
	it("Should navigate to Assignment Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("Assignment table row count should be greater than 0", function () {
		Then.onTheProcessResourceRequestPage.theAssignedResourcesCountIsGreaterThan(0);
	});

	it("Click on Update button to open Popup ", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("025 Click Update in assignment list");
			});
		}

		When.onTheProcessResourceRequestPage.iClickTheAssignmentsTablesUpdateButton();

		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Update Assignment Measurement", function () {
		// Measurement
		When.onTheProcessResourceRequestPage.iEnterTheHoursSUPA(200);
		tab.perform();
		tab.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("026 Double the staffed hours and click Update");
			});
		}

		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Update pop up should be closed", function () {
		Then.onTheProcessResourceRequestPage.theAssignDialogShouldBeClosed();
	});

	// Delete Scenario

	it("Should navigate to Assignment Section", function () {
		When.onTheProcessResourceRequestPage.iClickOnAssignmentsSection();
	});

	it("Assignment table row count should be greater than 0", function () {
		Then.onTheProcessResourceRequestPage.theAssignedResourcesCountIsGreaterThan(0);
	});

	it("Click on Unassign button to open Popup ", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("030 Click Unassign");
			});
		}

		When.onTheProcessResourceRequestPage.iClickTheAssignmentTableRowDeleteButton();

		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Delete Assignment Measurement", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("040 Confirm Unassign in pop-up");
			});
		}

		enter.perform();

		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("should go to shell home", async function () {
		When.onTheFlpPage.iClickBack();
		When.onTheFlpPage.iClickBack();
	});
}

module.exports = {
	executeTest
};