sap.ui.define(
	["capacityGridUi/view/table/TimeColumnsMap", "capacityGridUi/test/unit/stubs/BundleStub"],
	function (TimeColumnsMap, BundleStub) {
		"use strict";

		QUnit.module("TimeColumnsMap");

		//Monthly column calculation
		QUnit.test("Test monthly column calculation for different month ranges between 2 years", function (assert) {
			let oColumnListTest1 = new TimeColumnsMap(BundleStub, "Monthly", new Date("2022-10-01"), new Date("2023-04-30"));
			assert.equal(oColumnListTest1.size, 7, "Monthly column count has length 7");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest1, 0), "Oct 2022", "Monthly column name has value Oct 2022");

			let oColumnListTest2 = new TimeColumnsMap(BundleStub, "Monthly", new Date("2022-11-01"), new Date("2023-06-30"));
			assert.equal(oColumnListTest2.size, 8, "Monthly column count has length 8");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest2, 7), "Jun 2023", "Monthly column name has value Jun 2023");

			let oColumnListTest3 = new TimeColumnsMap(BundleStub, "Monthly", new Date("2022-12-01"), new Date("2023-09-30"));
			assert.equal(oColumnListTest3.size, 10, "Monthly column count has length 10");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest3, 4), "Apr 2023", "Monthly column name has value Apr 2023");
		});

		//Weekly column calculation
		QUnit.test("Test Weekly column calculation for different date ranges between 2 years", function (assert) {
			let oColumnListTest1 = new TimeColumnsMap(BundleStub, "Weekly", new Date("2022-10-17"), new Date("2023-01-08"));
			assert.equal(oColumnListTest1.size, 12, "Weekly column count has length 12");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest1, 2), "CW 44\nOct 31 - Nov 06", "Weekly column name has value CW 44\nOct 31 - Nov 06");

			let oColumnListTest2 = new TimeColumnsMap(BundleStub, "Weekly", new Date("2022-10-31"), new Date("2023-03-26"));
			assert.equal(oColumnListTest2.size, 21, "Weekly column count has length 21");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest2, 8), "CW 52\nDec 26 - Jan 01", "Weekly column name has value CW 52\nDec 26 - Jan 01");

			let oColumnListTest3 = new TimeColumnsMap(BundleStub, "Weekly", new Date("2022-12-12"), new Date("2023-04-16"));
			assert.equal(oColumnListTest3.size, 18, "Weekly column count has length 18");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest3, 14), "CW 12\nMar 20 - Mar 26", "Weekly column name has value CW 12\nMar 20 - Mar 26");
		});

		//Day column calculation
		QUnit.test("Test day column calculation for different date ranges between 2 years", function (assert) {
			let oColumnListTest1 = new TimeColumnsMap(BundleStub, "Daily", new Date("2022-12-28"), new Date("2023-01-06"));
			assert.equal(oColumnListTest1.size, 10, "Day column count has length 10");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest1, 2), "Fri\nDec 30", "Day column name has value Fri\nDec 30");

			let oColumnListTest2 = new TimeColumnsMap(BundleStub, "Daily", new Date("2022-12-27"), new Date("2023-01-10"));
			assert.equal(oColumnListTest2.size, 15, "Day column count has length 15");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest2, 6), "Mon\nJan 02", "Day column name has value Mon\nJan 02");

			let oColumnListTest3 = new TimeColumnsMap(BundleStub, "Daily", new Date("2022-12-22"), new Date("2023-01-10"));
			assert.equal(oColumnListTest3.size, 20, "Day column count has length 20");
			assert.equal(fnGetColumnDescByIndex(oColumnListTest3, 16), "Sat\nJan 07", "Day column name has value Sat\nJan 07");
		});

		// function for getting column name by index
		function fnGetColumnDescByIndex(oColumnListTest, vIndex) {
			return Array.from(oColumnListTest)[vIndex][1];
		}
	}
);
