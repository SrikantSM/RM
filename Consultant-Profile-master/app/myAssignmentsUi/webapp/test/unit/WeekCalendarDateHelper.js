sap.ui.define([
    "myAssignmentsUi/utils/WeekCalendarDateHelper",
    'myAssignmentsUi/test/unit/FakeI18nModel'
], function (DateHelper, FakeI18nModel) {
    'use strict';

    let oI18nedModel;
    let oi18nModelData;
    QUnit.module('WeekCalendarDateHelper', {
        before: function () {
            oi18nModelData = {
                SPLIT_CW_NEXT: 'Split Week Next',
                SPLIT_CW_PREVIOUS: 'Split Week Previous',
                PARTIAL_WEEK_TIME_PERIOD: 'Partial Week with Time period'
            };
            oI18nedModel = new FakeI18nModel(oi18nModelData);
        }
    });

    QUnit.test('Test addDays', async function (assert) {
        // value of month as 5 means June
        let oDate = new Date(2021,5,25);
        const observedResult = DateHelper.addDays(oDate, 10);
        const expectedResult = new Date(2021,6,5);
        assert.deepEqual(observedResult, expectedResult, "Method 'addDays' returned the correct values");
    });

    QUnit.test('Test inRange before', async function (assert) {
        const observedResult = DateHelper.inRange(new Date(2021,5,5), new Date(2021,5,6), new Date(2021,5,10));
        const expectedResult = false;
        assert.deepEqual(observedResult, expectedResult, "Method 'inRange' before returned the correct values");
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
        assert.deepEqual(observedResult, expectedResult, "Method 'inRange' after returned the correct values");
    });

    QUnit.test('Test getCorrectDate', async function (assert) {
        const oOriginaldate = new Date("2021-06-05");
        const oObservedResult = DateHelper.getCorrectDate(oOriginaldate);
        const oExpectedResult = new Date(2021,5,5);
        assert.deepEqual(oObservedResult, oExpectedResult,"Check with getCorrectDate passed.");
    });

    QUnit.test('Test considerPreviousYearForWeekWise when month not January', async function (assert) {
        const oObservedResult = DateHelper.considerPreviousYearForWeekWise(new Date(2021,5,5));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult, "Method 'considerPreviousYearForWeekWise' when month not January returned the correct values");
    });


    QUnit.test('Test considerPreviousYearForWeekWise when month January but we should not consider previous year', async function (assert) {
        const oObservedResult = DateHelper.considerPreviousYearForWeekWise(new Date(2020,0,1));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult, "Method 'considerPreviousYearForWeekWise' when month January and consider previous year returned the correct values");
    });

    QUnit.test('Test considerPreviousYearForWeekWise when month January and we should consider previous year', async function (assert) {
        const oObservedResult = DateHelper.considerPreviousYearForWeekWise(new Date(2021,0,1));
        const oExpectedResult = true;
        assert.deepEqual(oObservedResult, oExpectedResult, "Method 'considerPreviousYearForWeekWise' when month January and consider previous year returned the correct values");
    });

    QUnit.test('Test considerNextYearForWeekWise when month not December', async function (assert) {
        const oObservedResult = DateHelper.considerNextYearForWeekWise(new Date(2021,5,5));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult, "Method 'considerNextYearForWeekWise' when month not December returned the correct values");
    });


    QUnit.test('Test considerNextYearForWeekWise when month December but we should not consider next year', async function (assert) {
        const oObservedResult = DateHelper.considerNextYearForWeekWise(new Date(2021,11,31));
        const oExpectedResult = false;
        assert.deepEqual(oObservedResult, oExpectedResult, "Method 'considerNextYearForWeekWise' when month December and  not consider next year returned the correct values");
    });

    QUnit.test('Test considerNextYearForWeekWise when month December and we should consider next year', async function (assert) {
        const oObservedResult = DateHelper.considerNextYearForWeekWise(new Date(2018,11,31));
        const oExpectedResult = true;
        assert.deepEqual(oObservedResult, oExpectedResult, "Method 'considerNextYearForWeekWise' when month December and consider next year returned the correct values");
    });

    QUnit.test('Test checkValidDates - Invalid date', async function (assert) {
        const expectedResult = {
            valid: false,
            valueState: 'None',
            valueStateText: ''
        };
        const observedResult = DateHelper.checkValidDates(
            new Date(2021, 5, 25),
            new Date(2021, 5, 30),
            new Date(2021, 5, 22),
            new Date(2021, 5, 24)
        );
        assert.deepEqual(observedResult, expectedResult, "Method 'checkValidDates' with Invalid date returned the correct values");
    });

    QUnit.test(
        'Test checkValidDates - Complete week',
        async function (assert) {
            const expectedResult = {
                valid: true,
                valueState: 'None',
                valueStateText: '',
                startDate: new Date(2021, 5, 25),
                endDate: new Date(2021, 5, 30)
            };
            const observedResult = DateHelper.checkValidDates(
                new Date(2021, 5, 25),
                new Date(2021, 5, 30),
                new Date(2021, 5, 25),
                new Date(2021, 5, 30)
            );
            assert.deepEqual(observedResult, expectedResult, "Method 'checkValidDates' with Complete week returned the correct values");
        }
    );

    QUnit.test(
        'Test checkValidDates - Start date with Partial Week',
        async function (assert) {
            const expectedResult = {
                valid: true,
                valueState: 'Information',
                valueStateText: 'Partial Week with Time period',
                startDate: new Date(2021, 5, 27),
                endDate: new Date(2021, 5, 30)
            };
            const observedResult = DateHelper.checkValidDates(
                new Date(2021, 5, 25),
                new Date(2021, 5, 30),
                new Date(2021, 5, 27),
                new Date(2021, 5, 30),
                oI18nedModel
            );
            assert.deepEqual(observedResult, expectedResult, "Method 'checkValidDates' as Start date with Partial Week returned the correct values");
        }
    );

    QUnit.test(
        'Test checkValidDates - End date with Partial week',
        async function (assert) {
            const expectedResult = {
                valid: true,
                valueState: 'Information',
                valueStateText: 'Partial Week with Time period',
                startDate: new Date(2021, 5, 25),
                endDate: new Date(2021, 5, 28)
            };
            const observedResult = DateHelper.checkValidDates(
                new Date(2021, 5, 25),
                new Date(2021, 5, 30),
                new Date(2021, 5, 25),
                new Date(2021, 5, 28),
                oI18nedModel
            );
            assert.deepEqual(observedResult, expectedResult, "Method 'checkValidDates' as End date with Partial week returned the correct values");
        }
    );

    QUnit.test(
        'Test checkValidDates - Start date and end date with Partial week',
        async function (assert) {
            const expectedResult = {
                valid: true,
                valueState: 'Information',
                valueStateText: 'Partial Week with Time period',
                startDate: new Date(2021, 5, 26),
                endDate: new Date(2021, 5, 28)
            };
            const observedResult = DateHelper.checkValidDates(
                new Date(2021, 5, 25),
                new Date(2021, 5, 30),
                new Date(2021, 5, 26),
                new Date(2021, 5, 28),
                oI18nedModel
            );
            assert.deepEqual(observedResult, expectedResult, "Method 'checkValidDates' as Start date and end date with Partial week returned the correct values");
        }
    );

    QUnit.test(
        'Test checkValidDates - Start date and end date are split in different month same week',
        async function (assert) {
            const expectedResult = {
                valid: true,
                valueState: 'Information',
                valueStateText: 'Split Week Next',
                startDate: new Date(2021, 5, 27),
                endDate: new Date(2021, 6, 3)
            };
            const observedResult = DateHelper.checkValidDates(
                new Date(2021, 5, 27),
                new Date(2021, 6, 3),
                new Date(2021, 5, 27),
                new Date(2021, 6, 3),
                oI18nedModel
            );
            assert.deepEqual(observedResult, expectedResult, "Method 'checkValidDates'as Start date and end date are split in different month same week returned the correct values");
        }
    );
}
);
