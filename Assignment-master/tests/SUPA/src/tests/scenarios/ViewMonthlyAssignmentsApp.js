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
		clickCC = browser.actions().sendKeys("D1");
		selectDateRange = browser.actions().sendKeys("d");
		setDateRange1 = browser.actions().sendKeys("Jan,2022 - Sep,2022");
		setDateRange2 = browser.actions().sendKeys("Jan,2022 - Jun,2023");
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

	it("Should Change to Monthly View", function () {
		When.onTheHeaderPage.selectView("Month");
	});

	it("Should Able to See Monthly As Current View", function () {
		Then.onTheHeaderPage.theViewIs("Monthly");
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
		// Doing second page down as after assignment expand we get more that 50 rows
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

		When.onTheFilterPage.enterCostCenter("D1_1");
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


	// 020  change time period to next 9 MONTHS
	it("Should Change time Period to next 9 months", function () {

		//Enter new value
		When.onTheHeaderPage.changeDateRangeForSUPA("Current Month + 8 Months");

		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("020 Change time period to next 9 months");
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

	// 021 Expand a resource row with assignments
	it("Should expand a row with assignments", function () {
		// Measurement

		for (let i = 0; i < 6; i++) {
			tab.perform();
		}
		down.perform();
		down.perform();
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

	// 022 Change time period to next 18 months
	it("Should change time Period to Next 18 months", function () {
		
		//Enter new value
		When.onTheHeaderPage.changeDateRangeForSUPA("Current Month + 17 Months");

		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("022 Change time period to next 18 months");
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