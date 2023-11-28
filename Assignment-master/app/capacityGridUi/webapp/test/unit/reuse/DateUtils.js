sap.ui.define(["capacityGridUi/reuse/DateUtils"], function (DateUtils) {
	"use strict";

	QUnit.module("DateUtils", {});

	// Test get calender week
	QUnit.test("Test calender week for date input", function (assert) {
		assert.equal(DateUtils.getCalendarWeek("20220713"), 28, "Calender week for date input is 28"); // Input format in YYYYMMdd
		assert.equal(DateUtils.getCalendarWeek("20230113"), 2, "Calender week for date input is 2");
		assert.equal(DateUtils.getCalendarWeek("20220228"), 9, "Calender week for date input is 9");
		assert.equal(DateUtils.getCalendarWeek("20230313"), 11, "Calender week for date input is 11");
	});
});
