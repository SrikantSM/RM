require("../../../../pages/flpPage.js");
require("../../../../pages/page.js");
require("../../../../pages/tablePage.js");
require("../../../../pages/persoDialogPage.js");
require("../../../../pages/headerPage.js");
require("../../../../pages/filterPage.js");
const filterLocators = require("../../../../locators/filterLocators.js");
const tableLocators = require("../../../../locators/headerLocators.js");

function executeTest(supaHelper) {
	it("should set data", async function () {
		enter = browser.actions().sendKeys(protractor.Key.ENTER);
		tab = browser.actions().sendKeys(protractor.Key.TAB);
		shiftTab = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.TAB));
		right = browser.actions().sendKeys(protractor.Key.ARROW_RIGHT);
		left = browser.actions().sendKeys(protractor.Key.ARROW_LEFT);
		up = browser.actions().sendKeys(protractor.Key.ARROW_UP);
		down = browser.actions().sendKeys(protractor.Key.ARROW_DOWN);
		backSpace = browser.actions().sendKeys(protractor.Key.BACK_SPACE);
		esc = browser.actions().sendKeys(protractor.Key.ESCAPE);
		setDateRange = browser.actions().sendKeys("Jan,2022 - Jun,2023");
		f4 = browser.actions().sendKeys(protractor.Key.F4);
	});

	it("Should click on Manage Resource Utilization App", function () {
		When.onTheFlpPage.iClickTileManageResourceUtilization();
	});

	it("Should navigate to Manage Resource Utilization App", function () {
		Then.onThePagePage.theAppIsVisible();
	});

	// 010 Start of the App
	it("Should Navigate Back To FLP and start the App", function () {
		When.onTheFlpPage.iClickBack();
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("010 Navigate back to FLP and Start of app");
			});
		}
		When.onTheFlpPage.iClickTileManageResourceUtilization();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	it("Should navigate to Manage Resource Utilization App", function () {
		Then.onThePagePage.theAppIsVisible();
		When.onTheTablePage.pressFilterButton();
		Then.onTheFilterPage.theVerticalFilterIsVisible();
	});

	it("Should Change to Monthly View", function () {
		When.onTheHeaderPage.selectView("Month");
	});

	// 011 Filter for a single Resource Organization
	it("Should filter on first Resource Organization", function () {
		var orgSelector = filterLocators.getOrgSelector();
		var sResourceOrgKey = "The description of OrgHeader for batchNum: 19 is 2450";

		orgSelector.sendKeys(sResourceOrgKey);
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("011 Filter for single Resource Organization");
			});
		}
		orgSelector.sendKeys(protractor.Key.ENTER);
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 012 Sort by Cost Center
	it("Should sort by Cost Center in ascending order", function () {
		When.onTheTablePage.openCostCenterColumnMenu();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("012 Sort by Cost Center");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 013 Sort by Resource Name
	it("Should sort by Resource Name in descending order", function () {
		When.onTheTablePage.openResourceNameColumnMenu();
		down.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("013 Sort by Resource Name");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 014 Sort by Utilization
	it("Should sort by Utilization in ascending order", function () {
		When.onTheTablePage.openUtilizationColumnMenu();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("014 Sort by Utilization");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 015 Scroll one page down in resource list
	it("Should scroll one page down", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("015 Scroll down 1 page in resource list");
			});
		}
		When.onTheTablePage.scrollOnePageDown();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	//017 Filter for 2 additional Resource orgs
	it('Should filter for additional 2 Resource Organizations', function () {
	  var orgSelector = filterLocators.getOrgSelector();
	  var sResourceOrgKey = "The description of OrgHeader for batchNum: 1 is 82a8";
	  orgSelector.sendKeys(sResourceOrgKey);
	//   // Measurement
	  if (supaHelper) {
	    browser.controlFlow().execute(function () {
	        supaHelper.startSupaMeasurement('017 Filter for additional 2 Resource Organizations');
	    });
	  }
	   orgSelector.sendKeys(protractor.Key.ENTER);
	  if (supaHelper) {
	    browser.controlFlow().execute(function () {
	      supaHelper.stopSupaMeasurement();
	    });
	  }
	});

	// 018 Scroll one page down in resource list
	it("Should scroll one page down", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("018 Scoll down in resource list");
			});
		}
		When.onTheTablePage.scrollSecondPageDown();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 020 Scroll up again in resource list
	it("Should scroll to top of the table", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("020 Scroll up again in resource list");
			});
		}
		When.onTheTablePage.scrollToTop();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 021 Filter for single cost center
	it("Should filter for single cost center", function () {
		When.onTheFilterPage.enterCostCenter("D1_1");
		When.onTheFilterPage.selectActiveSuggestion();
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("021 Filter for a single Cost Center");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 022 Filter for single resource name
	it("Should filter for single resource name", function () {

		When.onTheFilterPage.enterResourceName("firstName0119b3-145-1");
		When.onTheFilterPage.selectActiveSuggestion();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("022 Filter for a single Resource Name");
			});
		}
		browser.actions().sendKeys(protractor.Key.ENTER).perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 023 Remove resource name filter
	it("Should remove the filter for resource name", function () {
		backSpace.perform();
		backSpace.perform();
		// var action = browser.actions().sendKeys(protractor.Key.ENTER);
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("023 Remove Resource Name Filter");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});


	// 024 Remove Resource Organization filter
	it("Should remove the filters for Resource Organization", function () {
		When.onTheFilterPage.clearServiceOrgFilters();
		//var action = browser.actions().sendKeys(protractor.Key.ENTER);
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("024 Remove Resource Organization Filter");
			});
		}
		//action.perform();
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});


	// 025 Change time period to next 9 months
	it("Should change time period to next 9 months", function () {
		//Enter new value
		When.onTheHeaderPage.changeDateRangeForSUPA("Current Month + 8 Months");
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("025 Change time period to next 9 months");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 026 Sort by resource name column in descending order
	it("Should sort resource name column in descending order", function () {
		When.onTheTablePage.openResourceNameColumnMenu();
		down.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("026 Sort by Resource Name");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 028 Filter for single resource name
	it("Should filter for single resource name", function () {

		When.onTheFilterPage.enterResourceName("firstName0119b3-145-1");
		When.onTheFilterPage.selectActiveSuggestion();
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("028 Filter for a single Resource Name");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 029 Remove resource name filter
	it("Should remove the filter for resource name", function () {
		backSpace.perform();
		backSpace.perform();
		//var action = browser.actions().sendKeys(protractor.Key.ENTER);
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("029 Remove Resource Name filter");
			});
		}
		//action.perform();
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 030 Scroll down 1 page in resource list
	it("Should scroll one page down", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("030 Scroll down 1 page in resource list");
			});
		}
		When.onTheTablePage.scrollOnePageDown();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 040 Scroll up again in resource list
	it("Should scroll to top of the table", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("040 Scroll up again in resource list");
			});
		}
		When.onTheTablePage.scrollToTop();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 045 Change time period to next 18 months
	it("Should change time period to next 18 months", function () {
		//Enter new value
		When.onTheHeaderPage.changeDateRangeForSUPA("Current Month + 17 Months");
		
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("045 Change time period to next 18 months");
			});
		}
		enter.perform();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// 050 Open resource popup for one resource
	it("Should open resource popup for one resource", function () {
		// Measurement
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("050 Open resource popup for one resource");
			});
		}
		When.onTheTablePage.pressFirstResourceNameLink();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.stopSupaMeasurement();
			});
		}
	});

	// O70 Change View to Daily
	it("Should Change to Daily View", function () {
		// Measurement

		When.onTheFilterPage.pressCloseButton();
		if (supaHelper) {
			browser.controlFlow().execute(function () {
				supaHelper.startSupaMeasurement("070 Change View to Daily");
			});
		}
		When.onTheHeaderPage.selectView("Day");
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
