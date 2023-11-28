sap.ui.define([
    "sap/ui/thirdparty/sinon",
    'myAssignmentsUi/utils/DateUtility'
], function(sinon, DateUtility) {
    'use strict';

    QUnit.module("DateUtility", {
    });

    QUnit.test("QUnit: I should test the getFilterStartDate", function (assert)  {
        var expectedResult = "2021-02-01";
        var startDate = new Date(2021, 1, 1);
        var actualResult = DateUtility.formatDatePattern(startDate);
        assert.equal(actualResult, expectedResult, 'Test Date asserted');
    });

    QUnit.test("QUnit: I should test the getFilterStartDate with null value", function (assert)  {
        var expectedResult = "2021-02-01";
        var startDate;
        var actualResult = DateUtility.formatDatePattern(startDate);
        assert.notEqual(actualResult, expectedResult, 'Null value passed');
    });

    QUnit.test("QUnit: I should test the getFilterStartDate with wrong value", function (assert)  {
        var expectedResult = "2021-02-01";
        var startDate = new Date(2021, 3, 1);
        var actualResult = DateUtility.formatDatePattern(startDate);
        assert.notEqual(actualResult, expectedResult, 'Date beyond the expected date');
    });


    QUnit.test("QUnit: I should test the getFilterEndDate", function (assert)  {
        var expectedResult = "2021-11-01";
        var endDate = new Date(2021, 10, 1);
        var actualResult = DateUtility.formatDatePattern(endDate);
        assert.equal(actualResult, expectedResult, 'Test Date asserted');
    });

    QUnit.test("QUnit: I should test the getFilterEndDate with null value", function (assert)  {
        var expectedResult = "2021-11-01";
        var startDate;
        var actualResult = DateUtility.formatDatePattern(startDate);
        assert.notEqual(actualResult, expectedResult, 'Null value passed');
    });

    QUnit.test("QUnit: I should test the getFilterEndDate with wrong value", function (assert)  {
        var expectedResult = "2021-11-01";
        var startDate = new Date(2021, 3, 1);
        var actualResult = DateUtility.formatDatePattern(startDate);
        assert.notEqual(actualResult, expectedResult, 'Date beyond the expected date');
    });

    QUnit.test("QUnit: I should test the getDataRange", function (assert)  {
        var expectedStartDate = "2021-02-01";
        var startDate = new Date(2021, 1, 1);
        var actualStartDate = DateUtility.getStartDate(startDate);
        var expectedEndDate = "2021-11-30";
        var endDate = new Date(2021, 10, 1);
        var actualEndDate = DateUtility.getEndDate(endDate);
        assert.equal(actualStartDate, expectedStartDate, 'Test Start Date asserted');
        assert.equal(actualEndDate, expectedEndDate, 'Test End Date asserted');
    });

    QUnit.test("QUnit: Function validateMonthEndDate should return expected result ", function (assert)  {
        var expectedStartDate = new Date(new Date().getFullYear() + 1, 6, 1).toDateString();
        var startDate = new Date(new Date().getFullYear() + 1, 9, 1).toDateString();
        var actualStartDate = DateUtility.setStartDate(startDate).toDateString();
        var expectedEndDate = new Date(new Date().getFullYear() + 1, 11, 31).toDateString();
        var endDate = new Date(new Date().getFullYear() + 2, 2, 1).toDateString();
        var actualEndDate = DateUtility.setEndDate(endDate).toDateString();
        assert.equal(actualStartDate, expectedStartDate, 'Test Start Date asserted');
        assert.equal(actualEndDate, expectedEndDate, 'Test End Date asserted');
    });

    QUnit.test("QUnit: Function validateMonthEndDate returns unexpected result ", function (assert)  {
        var expectedStartDate = "Fri Sep 01 2023 00:00:00 GMT+0530 (India Standard Time)";
        var startDate = new Date(2023, 9, 1);
        var actualStartDate = DateUtility.setStartDate(startDate);
        var expectedEndDate = "Fri Feb 02 2024 00:00:00 GMT+0530 (India Standard Time)";
        var endDate = new Date(2024, 2, 1);
        var actualEndDate = DateUtility.setEndDate(endDate);
        assert.notEqual(actualStartDate, expectedStartDate, 'Test Start Date not correct');
        assert.notEqual(actualEndDate, expectedEndDate, 'Test End Date not correct');
    });

    QUnit.test("Should format date correctly", function (assert) {
        var newDate = new Date(2021, 6, 1);
        assert.strictEqual(DateUtility.formatDate(newDate), "Jul 1, 2021", "Date formatted correctly");

    });

    QUnit.test("Should format date correctly with time", function (assert) {
        var newDate = new Date(2021, 6, 1, 14, 40);
        assert.strictEqual(DateUtility.formatDate(newDate), "Jul 1, 2021, 2:40:00 PM", "Date formatted correctly");

    });

    QUnit.test("Should not format date when date passed is null", function (assert) {
        var newDate;
        assert.strictEqual(DateUtility.formatDate(newDate), undefined, "Date formatted correctly");

    });

    QUnit.test("Should format date with correct pattern", function (assert) {
        var newDate = new Date(2021, 6, 1);
        assert.strictEqual( DateUtility.formatDatePattern(newDate), "2021-07-01", "Date formatted with correct pattern");

    });

    QUnit.test("Should not format date with correct pattern when date passed is null", function (assert) {
        var newDate;
        assert.strictEqual( DateUtility.formatDatePattern(newDate), "", "Date formatted with correct pattern");

    });
});
