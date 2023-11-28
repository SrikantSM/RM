sap.ui.define([
    "myAssignmentsUi/utils/WeekCalendarUtility",
    "sap/ui/thirdparty/sinon"
], function (WeekCalendarUtility, sinon) {
    'use strict';

    QUnit.module('WeekCalendarUtility', {
    });

    // Test case with valid quarter number and year
    QUnit.test('Test calculateQuarterValues with valid data', async function (assert) {
        const currentQuarterNumber = 2;
        const currentYear = 2023;
        const expectedResult = {
            nextQuarterNumber: 3,
            yearForNextQuarter: 2023,
            previousQuarterNumber: 1,
            yearForPreviousQuarter: 2023
        };
        const observedResult = WeekCalendarUtility.calculateQuarterValues(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculateQuarterValues' with valid data was ran successfully");
    });

    // Test case with next quarter number equal to 5
    QUnit.test('Test calculateQuarterValues with with next quarter number as 5', async function (assert) {
        const currentQuarterNumber = 4;
        const currentYear = 2023;
        const expectedResult = {
            nextQuarterNumber: 1,
            yearForNextQuarter: 2024,
            previousQuarterNumber: 3,
            yearForPreviousQuarter: 2023
        };
        const observedResult = WeekCalendarUtility.calculateQuarterValues(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculateQuarterValues' with with next quarter number as 5 was ran successfully");
    });

    // Test case with previous quarter number equal to 0
    QUnit.test('Test calculateQuarterValues with previous quarter number as 0', async function (assert) {
        const currentQuarterNumber = 1;
        const currentYear = 2023;
        const expectedResult = {
            nextQuarterNumber: 2,
            yearForNextQuarter: 2023,
            previousQuarterNumber: 4,
            yearForPreviousQuarter: 2022
        };
        const observedResult = WeekCalendarUtility.calculateQuarterValues(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculateQuarterValues' with previous quarter number as 0 was ran successfully");
    });

    // Test case with with quarter number as 1
    QUnit.test('Test calculatePreviousQuarterData with quarter number as 1', async function (assert) {
        const currentQuarterNumber = 1;
        const currentYear = 2023;
        const expectedResult = {
            quarterNumber: 4,
            year: 2022
        };
        const observedResult = WeekCalendarUtility.calculatePreviousQuarterData(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculatePreviousQuarterData' with quarter number as 1 was ran successfully");
    });

    // Test case with with quarter number not as 1
    QUnit.test('Test calculatePreviousQuarterData with quarter number not as 1', async function (assert) {
        const currentQuarterNumber = 3;
        const currentYear = 2023;
        const expectedResult = {
            quarterNumber: 2,
            year: 2023
        };
        const observedResult = WeekCalendarUtility.calculatePreviousQuarterData(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculatePreviousQuarterData' with quarter number not as 1 was ran successfully");
    });

    // Test case with with quarter number as 4
    QUnit.test('Test calculateNextQuarterData with quarter number as 4', async function (assert) {
        const currentQuarterNumber = 4;
        const currentYear = 2023;
        const expectedResult = {
            quarterNumber: 1,
            year: 2024
        };
        const observedResult = WeekCalendarUtility.calculateNextQuarterData(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculateNextQuarterData' with quarter number as 4 was ran successfully");
    });

    // Test case with with quarter number not as 4
    QUnit.test('Test calculateNextQuarterData with quarter number not as 4', async function (assert) {
        const currentQuarterNumber = 2;
        const currentYear = 2023;
        const expectedResult = {
            quarterNumber: 3,
            year: 2023
        };
        const observedResult = WeekCalendarUtility.calculateNextQuarterData(currentQuarterNumber, currentYear);
        assert.deepEqual(observedResult, expectedResult, "Method 'calculateNextQuarterData' with quarter number not as 4 was ran successfully");
    });

    QUnit.test('Test onUpdateWeeklyCell', async function (assert) {
        const oCapacityRequirements = new Map();
        const dateRange = {
            oDateFrom: new Date('2023-02-01'),
            oDateTo: new Date('2023-02-07')
        };
        const cellData = {
            weekNumber: 2,
            iNewEffortValue: 5
        };
        const totalEffort = 10;
        const updatedWeeklyAssignmentData = {
            assignmentId: "ASSIGNMENT1",
            _weeklyAssignmentDistribution: [{
                "calendarWeek": "CW12",
                "bookedCapacity": 2
            }]
        };
        const that = {};
        // Create a mock function for handleUpdateCallObject
        const mockhandleUpdateCallObject = sinon.stub();
        const mockUpdateCallObject = {
            updatedWeeklyAssignmentData
        };
        mockhandleUpdateCallObject.returns(mockUpdateCallObject);
        // Stub the handleUpdateCallObject method on the object
        const onUpdateWeeklyCell = WeekCalendarUtility.onUpdateWeeklyCell.bind({
            handleUpdateCallObject: mockhandleUpdateCallObject
        });
        // Call the function
        const observedResult = onUpdateWeeklyCell(oCapacityRequirements, dateRange, cellData, totalEffort, updatedWeeklyAssignmentData, that);

        assert.ok(mockhandleUpdateCallObject.calledOnce, true, "Method 'handleUpdateCallObject' was called once");
        assert.deepEqual(observedResult.updatedWeeklyAssignmentData, mockUpdateCallObject.updatedWeeklyAssignmentData, "Method 'onUpdateWeeklyCell' returned the correct object");
    });

    QUnit.test('Test handleUpdateCallObject', async function (assert) {
        const that = {
            _currentAssignedEffort: 10
        };
        const iNewEffortValue = 5;
        const oVal = 2;
        const weekNumber = 2;
        const updatedWeeklyAssignmentData = {
            _weeklyAssignmentDistribution: []
        };
        const oCapacityRecord = {
            capacity: 3
        };
        const expectedResult = {
            fTotalEffort: 13,
            updatedWeeklyAssignmentData: {
                _weeklyAssignmentDistribution: [
                    { calendarWeek: 2, bookedCapacity: 5 }
                ]
            }
        };
        // Call the function
        const observedResult = WeekCalendarUtility.handleUpdateCallObject(that, iNewEffortValue, oVal, weekNumber, updatedWeeklyAssignmentData, oCapacityRecord);

        assert.deepEqual(observedResult, expectedResult, "Method 'handleUpdateCallObject' returned the correct values");
    });

});
