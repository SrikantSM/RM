/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"./Constants",
		"../pages/Page",
		"../pages/Table",
	],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Table Export Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Export Table Data", function (Given, When, Then) {
			When.onTheTable.pressTableExportButton();
			Then.onThePage.theMessageToastIsVisible("SPREADSHEET_EXPORT_FINISHED");
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
