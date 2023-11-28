/*global QUnit*/
sap.ui.define(["sap/ui/test/opaQunit", "../Constants", "../../pages/Filter", "../../pages/Page", "../../pages/Table"], function (opaTest, Constants) {
	"use strict";

	QUnit.module("Resource Journey");

	opaTest("Start app", function (Given, When, Then) {
		Given.iStartMyApp();
		Then.onThePage.theAppIsVisible();
	});

	opaTest("Resource Utilization hours filled with default value 0's when data not present", function (Given, When, Then) {
		When.onTheTable.pressFilterButton();
		When.onTheFilter.enterResourceName("Vishwanathan");
		When.onTheFilter.selectFromValueHelp("/ResourceDetails(00958c21-0441-5675-7caf-1924dndc5b84)", "lastName");
		When.onTheFilter.pressGoButton();
		When.onTheFilter.pressCloseButton();
		Then.onTheTable.theUtilFreeHoursIs("0", "/rows/0/utilization/0");
		Then.onTheTable.theResourceUtilizationIs("0", "/rows/0/utilization/0");
		Then.onTheTable.theUtilFreeHoursIs("0", "/rows/0/utilization/1");
		Then.onTheTable.theResourceUtilizationIs("0", "/rows/0/utilization/1");
		Then.onTheTable.theUtilFreeHoursIs("0", "/rows/0/utilization/2");
		Then.onTheTable.theResourceUtilizationIs("0", "/rows/0/utilization/2");
		Then.onTheTable.theUtilFreeHoursIs("0", "/rows/0/utilization/3");
		Then.onTheTable.theResourceUtilizationIs("0", "/rows/0/utilization/3");
	});

	opaTest("Tear down app", function (Given, When, Then) {
		Then.onThePage.theAppIsVisible();
		Then.iTeardownMyApp();
	});
});
