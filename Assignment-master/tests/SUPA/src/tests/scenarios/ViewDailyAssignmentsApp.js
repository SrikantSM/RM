require("../../../../pages/flpPage.js");
require("../../../../pages/page.js");
require("../../../../pages/tablePage.js");
require("../../../../pages/persoDialogPage.js");
require("../../../../pages/headerPage.js");
require("../../../../pages/filterPage.js");

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

	it("Should click on Manage Resource Utilization App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
	});

	it("Should navigate to Manage Resource Utilization App", function () {
		Then.onThePagePage.theAppIsVisible();
	});

	it("Should Navigate Back To FLP and start the App", function () {
		When.onTheFlpPage.iClickBack();
		When.onTheFlpPage.iClickTileManageResourceUtilization();
	});
	it("Should navigate to Manage Resource Utilization App", function () {
		Then.onThePagePage.theAppIsVisible();
	});

	it("Should Chnage the View to  Daily ", function () {
		When.onTheHeaderPage.selectView("Day");
	});

	it("Should Able to See Daily As Current View", function () {
		Then.onTheHeaderPage.theViewIs("Daily");
	});

	// 011 Expand a resource row with assignments
	it("Should expand a row with assignments", function () {
		// Measurement
		for (let i = 0; i < 11; i++) {
			tab.perform();
		}
		down.perform();
		down.perform();

		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("011 Expand a resource with assignments");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 012 Scroll one page down in resource list
	it("Should scroll one page down", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("012 Scroll down 1 page in resource list");
			});
		}
		When.onTheTablePage.scrollSecondPageDown();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});
	// 013 Scroll up again in resource list
	it("Should scroll to top of the table", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("013 Scroll up again in resource list");
			});
		}
		When.onTheTablePage.scrollToTop();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});
	// 014 Filter for single cost center

	it("Should Able to Open Vertical Filter ", function () {
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theVerticalFilterIsVisible();
	});

	it("Should filter for single cost center", function () {
		// Measurement
		When.onTheFilterPage.enterCostCenter("D1_1"); //Was only D1 earlier
		When.onTheFilterPage.selectActiveSuggestion();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("014 Filter for a single Cost Center");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 015 Expand a resource row with assignments
	it("Should expand a row with assignments", function () {
		// Measurement
		for (let i = 0; i < 11; i++) {
			tab.perform();
		}
		down.perform();
		down.perform();

		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("015 Expand a resource with assignments");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 020  change time period to next 8 Weeks
	it("Should change time period to next 8 Weeks", function () {
		
		When.onTheHeaderPage.changeDateRangeForSUPA("Today + 55 Days");

		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("020 Change time period to next 8 weeks");
			});
		}

		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Should Able to Close Vertical Filter ", function () {
		When.onTheFilterPage.pressCloseButton();
	});
	it("Should expand a row with assignments", function () {
		for (let i = 0; i < 6; i++) {
			tab.perform();
		}
		down.perform();
		down.perform();
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("021 Expand a resource with assignments");
			});
		}

		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});


	// 022 Change time period to past and Next 2 weeks
	it("Should Change time period to past and Next 2 weeks", function () {
		
		When.onTheHeaderPage.changeDateRangeForSUPA("Today - 14 / + 14 Days");
		
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("022 Change time period to past and Next 2 weeks");
			});
		}

		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 023 Expand a resource row with assignments
	it("Should expand a row with assignments", function () {
		// Measurement
		for (let i = 0; i < 10; i++) {
			tab.perform();
		}
		down.perform();
		down.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("023 Expand a resource with assignments");
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
	});
}

module.exports = {
	executeTest
};