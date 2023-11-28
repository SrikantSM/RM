sap.ui.define(
    [
        'resourceRequestLibrary/resourceRequestLibrary/model/CalendarModel'
    ],
    function (CalendarModel) {
    ////////////////////////////////////////////////////////////////////////
        QUnit.module('Effort Distribution QUnit | Calendar Model');
        ////////////////////////////////////////////////////////////////////////

        QUnit.test('Test getMonthRange', function (assert) {
            var startDate = new Date('2018-12-01');
            var endDate = new Date('2019-02-28');
            var expectedResult = [];
            expectedResult.push([2018, 11]);
            expectedResult.push([2019, 0]);
            expectedResult.push([2019, 1]);
            var dateRange = CalendarModel.getMonthRange(startDate, endDate);
            assert.deepEqual(dateRange, expectedResult, 'Month range asserted');
        });

        QUnit.test('Test getWeek', function (assert) {
            var startDate = new Date('2018-01-04');
            var expectedResult = 1;
            var week = startDate.getWeek();
            assert.equal(week, expectedResult, 'Test Date asserted');
        });

        QUnit.test('Test Month Information', function (assert) {
            var year = 2018;
            var month = 10;
            var startDate = new Date('2018-10-1');
            var endDate = new Date('2018-10-31');
            var oCapacityRequirements = new Map();

            var date = startDate;
            var expectedData = [];

            expectedData.push({
                date: new Date(date.setDate(date.getDate())),
                visibility: false,
                day: date.getDate(),
                value: '0'
            });
            for (var i = 0; i < 34; i++) {
                expectedData.push({
                    date: new Date(date.setDate(date.getDate() + 1)),
                    visibility: false,
                    day: date.getDate(),
                    value: '0'
                });
            }

            var actualResult = CalendarModel.monthInformation(
                year,
                month,
                oCapacityRequirements,
                startDate,
                endDate
            );
            assert.deepEqual(
                actualResult,
                expectedData,
                'Month Information asserted'
            );
        });
    }
);
