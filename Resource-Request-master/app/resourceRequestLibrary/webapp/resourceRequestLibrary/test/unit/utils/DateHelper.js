sap.ui.define([
    'resourceRequestLibrary/resourceRequestLibrary/utils/DateHelper',
    "sap/ui/thirdparty/sinon"
], function (DateHelper, sinon) {

    QUnit.module('Utils QUnit | DateHelper');

    QUnit.test('Test addDays', async function (assert) {
        // value of month as 5 means June
        let oDate = new Date(2021,5,25);
        const observedResult = DateHelper.addDays(oDate, 10);
        const expectedResult = new Date(2021,6,5);
        assert.deepEqual(observedResult, expectedResult);
    });

    QUnit.test('Test inRange before', async function (assert) {
        const observedResult = DateHelper.inRange(new Date(2021,5,5), new Date(2021,5,6), new Date(2021,5,10));
        const expectedResult = false;
        assert.deepEqual(observedResult, expectedResult);
    });

    QUnit.test('Test inRange between', async function (assert) {
        let observedResult = DateHelper.inRange(new Date(2021,5,6), new Date(2021,5,6), new Date(2021,5,10));
        let expectedResult = true;
        assert.deepEqual(observedResult, expectedResult, "Border start case success.");
        observedResult = DateHelper.inRange(new Date(2021,5,8), new Date(2021,5,6), new Date(2021,5,10));
        assert.deepEqual(observedResult, expectedResult, "Mid range case success.");
        observedResult = DateHelper.inRange(new Date(2021,5,10), new Date(2021,5,6), new Date(2021,5,10));
        assert.deepEqual(observedResult, expectedResult, "Border end case success.");
    });

    QUnit.test('Test inRange after', async function (assert) {
        const observedResult = DateHelper.inRange(new Date(2021,5,11), new Date(2021,5,6), new Date(2021,5,10));
        const expectedResult = false;
        assert.deepEqual(observedResult, expectedResult);
    });

    // Check this
    // QUnit.test('Test getCorrectDate', async function (assert) {
    //     const oOriginaldate = new Date("2021-06-05");
    //     const oObservedResult = DateHelper.getCorrectDate(oOriginaldate);
    //     const oExpectedResult = new Date(2021,5,5);
    //     assert.notDeepEqual(oOriginaldate, oExpectedResult,"Not equal without getCorrectDate passed.");
    //     assert.deepEqual(oObservedResult, oExpectedResult,"Check with getCorrectDate passed.");
    // });

    QUnit.test('Test considerPreviousYearForWeekWise when month not January', async function (assert) {
        const oObservedResult = DateHelper.considerPreviousYearForWeekWise(new Date(2021,5,5));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult);
    });


    QUnit.test('Test considerPreviousYearForWeekWise when month January but we should not consider previous year', async function (assert) {
        const oObservedResult = DateHelper.considerPreviousYearForWeekWise(new Date(2020,0,1));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult);
    });

    QUnit.test('Test considerPreviousYearForWeekWise when month January and we should consider previous year', async function (assert) {
        const oObservedResult = DateHelper.considerPreviousYearForWeekWise(new Date(2021,0,1));
        const oExpectedResult = true;
        assert.deepEqual(oObservedResult, oExpectedResult);
    });

    QUnit.test('Test considerNextYearForWeekWise when month not December', async function (assert) {
        const oObservedResult = DateHelper.considerNextYearForWeekWise(new Date(2021,5,5));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult);
    });


    QUnit.test('Test considerNextYearForWeekWise when month December but we should not consider next year', async function (assert) {
        const oObservedResult = DateHelper.considerNextYearForWeekWise(new Date(2021,11,31));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult);
    });

    QUnit.test('Test considerNextYearForWeekWise when month December and we should consider next year', async function (assert) {
        const oObservedResult = DateHelper.considerNextYearForWeekWise(new Date(2018,11,31));
        const oExpectedResult = true;
        assert.deepEqual(oObservedResult, oExpectedResult);
    });

    QUnit.test('TEST convertDateToUTC with Pacific time Zone', async function (assert) {
        // For different time zones are convert to UTC and compared with each other. They should be the same.

        const sanFranDateBeforeConversion = new Date("03-07-2023 21:28:14 GMT-0800");
        const shanghaiDateBeforeConversion = new Date("03-08-2023 13:28:14 GMT+0800");
        const indianDateBeforeConversion = new Date("03-08-2023 10:58:14 GMT+0530");

        const updatedSanFranDate = DateHelper.convertDateToUTC(sanFranDateBeforeConversion);
        const updatedShanghaiDate = DateHelper.convertDateToUTC(shanghaiDateBeforeConversion);
        const updatedIndianDate = DateHelper.convertDateToUTC(indianDateBeforeConversion);

        assert.deepEqual(updatedIndianDate, updatedSanFranDate);
        assert.deepEqual(updatedIndianDate, updatedShanghaiDate);
        assert.deepEqual(updatedSanFranDate, updatedShanghaiDate);
    });
}
);
