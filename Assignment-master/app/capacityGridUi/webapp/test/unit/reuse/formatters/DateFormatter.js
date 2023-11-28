sap.ui.define(["capacityGridUi/reuse/formatters/DateFormatter"], function (DateFormatter) {
	"use strict";

	QUnit.module("DateFormatter", {});

	QUnit.test("dateByDay", function (assert) {
		assert.equal(DateFormatter.dateByDay(new Date("2015-01-25")), "Jan 25, 2015", "Jan 25, 2015");
		assert.equal(DateFormatter.dateByDay(new Date("2015-12-25")), "Dec 25, 2015", "Dec 25, 2015");
	});

	QUnit.test("dateByMonth", function (assert) {
		assert.equal(DateFormatter.dateByMonth(new Date("2015-01-25")), "Jan", "Jan");
		assert.equal(DateFormatter.dateByMonth(new Date("2015-12-25")), "Dec", "Dec");
	});

	QUnit.test("rangeByDay", function (assert) {
		assert.equal(
			DateFormatter.rangeByDay(new Date("2015-01-25"), new Date("2015-12-25")),
			"Jan 25, 2015 - Dec 25, 2015",
			"Jan 25, 2015 - Dec 25, 2015"
		);
	});

	QUnit.test("rangeByYearMonth", function (assert) {
		assert.equal(DateFormatter.rangeByYearMonth(new Date("2015-01-25"), new Date("2015-12-25")), "Jan 2015 - Dec 2015", "Jan 2015 - Dec 2015");
	});

	QUnit.test("rangeByView", function (assert) {
		assert.equal(
			DateFormatter.rangeByView("Daily", new Date("2015-01-25"), new Date("2015-12-25")),
			"Jan 25, 2015 - Dec 25, 2015",
			"Daily: Jan 25, 2015 - Dec 25, 2015"
		);
		assert.equal(
			DateFormatter.rangeByView("Weekly", new Date("2015-01-25"), new Date("2015-12-25")),
			"Jan 25, 2015 - Dec 25, 2015",
			"Weekly: Jan 25, 2015 - Dec 25, 2015"
		);
		assert.equal(
			DateFormatter.rangeByView("Monthly", new Date("2015-01-25"), new Date("2015-12-25")),
			"Jan 2015 - Dec 2015",
			"Monthly: Jan 2015 - Dec 2015"
		);
		assert.throws(
			function () {
				DateFormatter.rangeByView("???", new Date("2015-01-25"), new Date("2015-12-25"));
			}.bind(this),
			"invalid view throws error"
		);
	});

	QUnit.test("dateToEdm", function (assert) {
		assert.equal(DateFormatter.dateToEdm(new Date("Dec 06 2021 00:00:00")), "2021-12-06T00:00:00Z", "2021-12-06T00:00:00Z");
		assert.equal(DateFormatter.dateToEdm(new Date("Jan 30 2022 00:00:00")), "2022-01-30T00:00:00Z", "2022-01-30T00:00:00Z");
	});
});
