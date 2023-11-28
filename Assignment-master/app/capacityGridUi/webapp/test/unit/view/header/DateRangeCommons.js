sap.ui.define(["capacityGridUi/view/header/DateRangeCommons", "capacityGridUi/test/unit/stubs/BundleStub"], function (DateRangeCommons, BundleStub) {
	"use strict";

	QUnit.module("DateRangeCommons");

	QUnit.test("I should test the Positive path for dateDiff logic for Monthly view", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Monthly", new Date(2021, 1, 1), new Date(2021, 11, 31), BundleStub).isValid,
			true,
			"dateDiff passed positive test for monthy"
		);
	});

	QUnit.test("I should test the Negative path for dateDiff logic for Monthly view", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Monthly", new Date(2019, 1, 1), new Date(2021, 11, 31), BundleStub).isValid,
			false,
			"dateDiff passed negative test for monthy"
		);
	});

	QUnit.test("I should test the Positive path for dateDiff logic", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Daily", new Date(2021, 1, 1), new Date(2021, 1, 11), BundleStub).isValid,
			true,
			"dateDiff passed positive test for daily"
		);
	});

	QUnit.test("I should test the Negative path for dateDiff logic", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Daily", new Date(2021, 1, 1), new Date(2021, 3, 11), BundleStub).isValid,
			false,
			"dateDiff passed negative test for daily"
		);
	});

	QUnit.test("I should test the Positive path for dateDiff logic", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Daily", new Date(2021, 1, 1), new Date(2021, 1, 11), BundleStub).isValid,
			true,
			"dateDiff passed positive test for daily"
		);
	});

	QUnit.test("I should test the Negative path for dateDiff logic", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Daily", new Date(2021, 1, 1), new Date(2021, 5, 11), BundleStub).isValid,
			false,
			"dateDiff passed negative test for daily"
		);
	});

	QUnit.test("I should test the Positive path for dateDiff logic for Weekly view", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Weekly", new Date(2021, 1, 1), new Date(2021, 5, 31), BundleStub).isValid,
			true,
			"dateDiff passed positive test for weekly"
		);
	});

	QUnit.test("I should test the Negative path for dateDiff logic for Weekly view", function (assert) {
		assert.equal(
			DateRangeCommons.validate("Weekly", new Date(2019, 1, 1), new Date(2021, 11, 31), BundleStub).isValid,
			false,
			"dateDiff passed negative test for weekly"
		);
	});
});
