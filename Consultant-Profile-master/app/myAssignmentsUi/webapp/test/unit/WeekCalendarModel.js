sap.ui.define(
    [
        "myAssignmentsUi/model/WeekCalendarModel",
        'myAssignmentsUi/test/unit/FakeI18nModel'
    ],
    function (WeekCalendarModel, FakeI18nModel) {
        'use strict';
        let oI18nedModel;
        let oi18nModelData;
        QUnit.module('WeekCalendarModel', {
            before: function () {
                oi18nModelData = {
                    SPLIT_CW_NEXT: 'Split Week Next',
                    SPLIT_CW_PREVIOUS: 'Split Week Previous',
                    PARTIAL_WEEK_TIME_PERIOD: 'Partial Week with Time period'
                };
                oI18nedModel = new FakeI18nModel(oi18nModelData);
            }
        });

        QUnit.test(
            'Test getDataStructuredinQuarter',
            async function (assert) {
                let oMonthMap = {"JAN": {"monthText": "January"},"FEB": {"monthText": "February"},"MAR": {"monthText": "March"},
                    "APR": {"monthText": "April"},"MAY": {"monthText": "May"},"JUN": {"monthText": "June"},"JUL": {"monthText": "July"},
                    "AUG": {"monthText": "August"},"SEP": {"monthText": "September"},"OCT": {"monthText": "October"},
                    "NOV": {"monthText": "November"},"DEC": {"monthText": "December"}};
                const expectedResult = {
                    "Q1 2021": {quarter: "Q1", year: 2021, months: [oMonthMap["JAN"], oMonthMap["FEB"], oMonthMap["MAR"]]},
                    "Q2 2021": {quarter: "Q2", year: 2021, months: [oMonthMap["APR"], oMonthMap["MAY"], oMonthMap["JUN"]]},
                    "Q3 2021": {quarter: "Q3", year: 2021, months: [oMonthMap["JUL"], oMonthMap["AUG"], oMonthMap["SEP"]]},
                    "Q4 2021": {quarter: "Q4", year: 2021, months: [oMonthMap["OCT"], oMonthMap["NOV"], oMonthMap["DEC"]]}
                };
                const observedResult = WeekCalendarModel.getDataStructuredinQuarter(
                    oMonthMap,
                    2021
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'getDataStructuredinQuarter' returned the correct values");
            }
        );

        QUnit.test(
            'Test getWeekData - Invalid week',
            async function (assert) {
                const oIsDateValid = {
                    valid: false,
                    valueState: 'Information',
                    valueStateText: 'Split Week',
                    startDate: new Date(2021, 5, 27),
                    endDate: new Date(2021, 6, 3)
                };
                let expectedResult = {
                    month: 7,
			    weekNumber: 1,
                    enabled: false,
			    visible: true,
			    value: 0
                };
                const observedResult = WeekCalendarModel.getWeekData(
                    6,
                    1,
                    oIsDateValid,
                    undefined
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'getWeekData' with Invalid week returned the correct values");
            }
        );

        QUnit.test(
            'Test getWeekData - Valid week but empty capacity',
            async function (assert) {
                const oIsDateValid = {
                    valid: true,
                    valueState: 'Information',
                    valueStateText: 'Split Week',
                    startDate: new Date(2021, 5, 27),
                    endDate: new Date(2021, 6, 3)
                };
                let expectedResult = {
                    month: 7,
			              weekNumber: 1,
                    enabled: true,
                    visible: true,
                    value: 0,
                    startDate: new Date(2021, 5, 27),
                    endDate: new Date(2021, 6, 3),
                    valueState: 'Information',
                    valueStateText: 'Split Week',
                    toolTipForEndDate: "Jul 3, 2021",
                    toolTipForStartDate: "Jun 27, 2021"
                };
                const observedResult = WeekCalendarModel.getWeekData(
                    6,
                    1,
                    oIsDateValid,
                    new Map()
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'getWeekData' with valid week but empty capacity returned the correct values");
            }
        );

        QUnit.test(
            'Test getWeekData - Valid week with capacity',
            async function (assert) {
                const oIsDateValid = {
                    valid: true,
                    valueState: 'Information',
                    valueStateText: 'Split Week',
                    startDate: new Date(2021, 5, 27),
                    endDate: new Date(2021, 6, 3)
                };
                const oCapacityRequirements = new Map();
                oCapacityRequirements.set(new Date("2021-6-27").getTime(),{
                    "capacity": 10
                });
                let expectedResult = {
                    month: 7,
			              weekNumber: 1,
                    enabled: true,
			              visible: true,
			              value: 10,
                    startDate: new Date(2021, 5, 27),
                    endDate: new Date(2021, 6, 3),
                    valueState: 'Information',
                    valueStateText: 'Split Week',
                    toolTipForEndDate: "Jul 3, 2021",
                    toolTipForStartDate: "Jun 27, 2021"
                };
                const observedResult = WeekCalendarModel.getWeekData(
                    6,
                    1,
                    oIsDateValid,
                    oCapacityRequirements
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'getWeekData' with valid week with capacity returned the correct values");
            }
        );

        QUnit.test(
            'Test cleanQuarterData',
            async function (assert) {
                let oMonthMap = {
                    "JAN": {"monthText": "January", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": true}]},
                    "FEB": {"monthText": "February", "weeks": [{"enabled": true},{"enabled": true},{"enabled": true},{"enabled": false}]},
                    "MAR": {"monthText": "March", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "APR": {"monthText": "April", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "MAY": {"monthText": "May", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "JUN": {"monthText": "June", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "JUL": {"monthText": "July", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "AUG": {"monthText": "August", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "SEP": {"monthText": "September", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "OCT": {"monthText": "October", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "NOV": {"monthText": "November", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "DEC": {"monthText": "December", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]}
                };
                let oMap = {
                    "Q1 2021": {quarter: "Q1", year: 2021, months: [oMonthMap["JAN"], oMonthMap["FEB"], oMonthMap["MAR"]]},
                    "Q2 2021": {quarter: "Q2", year: 2021, months: [oMonthMap["APR"], oMonthMap["MAY"], oMonthMap["JUN"]]},
                    "Q3 2021": {quarter: "Q3", year: 2021, months: [oMonthMap["JUL"], oMonthMap["AUG"], oMonthMap["SEP"]]},
                    "Q4 2021": {quarter: "Q4", year: 2021, months: [oMonthMap["OCT"], oMonthMap["NOV"], oMonthMap["DEC"]]}
                };
                let expectedResult = {
                    "Q1 2021": {quarter: "Q1", year: 2021, months: [oMonthMap["JAN"], oMonthMap["FEB"], oMonthMap["MAR"]]}
                };
                const observedResult = WeekCalendarModel.cleanQuarterData(
                    oMap,
                    2021
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'cleanQuarterData' returned the correct values");
            }
        );

        QUnit.test(
            'Test fillFifthWeekWhereFour',
            async function (assert) {
                let oMonthMap = {
                    "JAN": {"monthText": "January", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": true}, {"enabled": false}]},
                    "FEB": {"monthText": "February", "weeks": [{"enabled": true},{"enabled": true},{"enabled": true},{"enabled": false}, {"enabled": false}]},
                    "MAR": {"monthText": "March", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "APR": {"monthText": "April", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "MAY": {"monthText": "May", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "JUN": {"monthText": "June", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "JUL": {"monthText": "July", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "AUG": {"monthText": "August", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "SEP": {"monthText": "September", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "OCT": {"monthText": "October", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "NOV": {"monthText": "November", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "DEC": {"monthText": "December", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]}
                };
                let oExpectedMonthMap = {
                    "JAN": {"monthText": "January", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": true}, {"enabled": false}]},
                    "FEB": {"monthText": "February", "weeks": [{"enabled": true},{"enabled": true},{"enabled": true},{"enabled": false}, {"enabled": false}]},
                    "MAR": {"monthText": "March", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}, {"visible": false}]},
                    "APR": {"monthText": "April", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}, {"visible": false}]},
                    "MAY": {"monthText": "May", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}, {"visible": false}]},
                    "JUN": {"monthText": "June", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "JUL": {"monthText": "July", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "AUG": {"monthText": "August", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "SEP": {"monthText": "September", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "OCT": {"monthText": "October", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "NOV": {"monthText": "November", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "DEC": {"monthText": "December", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]}
                };
                let oMap = {
                    "Q1 2021": {quarter: "Q1", year: 2021, months: [oMonthMap["JAN"], oMonthMap["FEB"], oMonthMap["MAR"]]},
                    "Q2 2021": {quarter: "Q2", year: 2021, months: [oMonthMap["APR"], oMonthMap["MAY"], oMonthMap["JUN"]]},
                    "Q3 2021": {quarter: "Q3", year: 2021, months: [oMonthMap["JUL"], oMonthMap["AUG"], oMonthMap["SEP"]]},
                    "Q4 2021": {quarter: "Q4", year: 2021, months: [oMonthMap["OCT"], oMonthMap["NOV"], oMonthMap["DEC"]]}
                };
                let expectedResult = {
                    "Q1 2021": {quarter: "Q1", year: 2021, months: [oExpectedMonthMap["JAN"], oExpectedMonthMap["FEB"], oExpectedMonthMap["MAR"]]},
                    "Q2 2021": {quarter: "Q2", year: 2021, months: [oExpectedMonthMap["APR"], oExpectedMonthMap["MAY"], oExpectedMonthMap["JUN"]]},
                    "Q3 2021": {quarter: "Q3", year: 2021, months: [oExpectedMonthMap["JUL"], oExpectedMonthMap["AUG"], oExpectedMonthMap["SEP"]]},
                    "Q4 2021": {quarter: "Q4", year: 2021, months: [oExpectedMonthMap["OCT"], oExpectedMonthMap["NOV"], oExpectedMonthMap["DEC"]]}
                };
                const observedResult = WeekCalendarModel.fillFifthWeekWhereFour(
                    oMap,
                    2021
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'fillFifthWeekWhereFour' returned the correct values");
            }
        );

        QUnit.test(
            'Test generateModel for no exiting data',
            async function (assert) {
                let oMonthMap = {
                    "JAN": {"monthText": "January", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": true}]},
                    "FEB": {"monthText": "February", "weeks": [{"enabled": true},{"enabled": true},{"enabled": true},{"enabled": false}]},
                    "MAR": {"monthText": "March", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "APR": {"monthText": undefined, "weeks": [
                        {"month": 4,"weekNumber": 13,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 14,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 15,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 16,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 17,"enabled": false,"visible": true,"value": 0}
                    ]},
                    "MAY": {"monthText": undefined, "weeks": [
                        {"month": 5,"weekNumber": 18,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 19,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 20,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 21,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]},
                    "JUN": {"monthText": undefined, "weeks": [
                        {"month": 6,"weekNumber": 22,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 23,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 24,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 25,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2021,5,25),"endDate": new Date(2021,5,27),"valueState": "Information","valueStateText": "Partial Week with Time period", "toolTipForEndDate": "Jun 27, 2021", "toolTipForStartDate": "Jun 25, 2021"},
                        {"visible": false}
                    ]},
                    "JUL": {"monthText": "July", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "AUG": {"monthText": "August", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "SEP": {"monthText": "September", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "OCT": {"monthText": "October", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "NOV": {"monthText": "November", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "DEC": {"monthText": "December", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]}
                };
                let expectedResult = {
                    "oModel": {
                        "2021": {
                            "year": 2021,
                            "data": {
                                "Q2 2021": {quarter: "Q2", year: 2021, months: [oMonthMap["APR"], oMonthMap["MAY"], oMonthMap["JUN"]]}
                            },
                            "Q1enabled": false,
                            "Q2enabled": true,
                            "Q3enabled": false,
                            "Q4enabled": false,
                            "Q1Key": "Q1 2021",
                            "Q2Key": "Q2 2021",
                            "Q3Key": "Q3 2021",
                            "Q4Key": "Q4 2021",
                            "selectedKey": "invisibleButton"
                        }
                    },
                    "quarter": undefined,
                    "year": undefined
                };
                const observedResult = WeekCalendarModel.generateModel(
                    new Date("2021-6-25"),
                    new Date("2021-6-27"),
                    new Map(),
                    oI18nedModel
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'generateModel' for no exiting data returned the correct values");
            }
        );

        QUnit.test(
            'Test generateModel for exiting data',
            async function (assert) {
                let oMonthMap = {
                    "JAN": {"monthText": "January", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": true}]},
                    "FEB": {"monthText": "February", "weeks": [{"enabled": true},{"enabled": true},{"enabled": true},{"enabled": false}]},
                    "MAR": {"monthText": "March", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "APR": {"monthText": undefined, "weeks": [
                        {"month": 4,"weekNumber": 13,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 14,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 15,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 16,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 17,"enabled": false,"visible": true,"value": 0}
                    ]},
                    "MAY": {"monthText": undefined, "weeks": [
                        {"month": 5,"weekNumber": 18,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 19,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 20,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 21,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]},
                    "JUN": {"monthText": undefined, "weeks": [
                        {"month": 6,"weekNumber": 22,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 23,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 24,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 25,"enabled": true,"visible": true,"value": 10, "startDate": new Date(2021,5,25),"endDate": new Date(2021,5,27),"valueState": "Information","valueStateText": "Partial Week with Time period", "toolTipForEndDate": "Jun 27, 2021", "toolTipForStartDate": "Jun 25, 2021"},
                        {"visible": false}
                    ]},
                    "JUL": {"monthText": "July", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "AUG": {"monthText": "August", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "SEP": {"monthText": "September", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "OCT": {"monthText": "October", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "NOV": {"monthText": "November", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]},
                    "DEC": {"monthText": "December", "weeks": [{"enabled": false},{"enabled": false},{"enabled": false},{"enabled": false}]}
                };
                let expectedResult = {
                    "oModel": {
                        "2021": {
                            "year": 2021,
                            "data": {
                                "Q2 2021": {quarter: "Q2", year: 2021, months: [oMonthMap["APR"], oMonthMap["MAY"], oMonthMap["JUN"]]}
                            },
                            "Q1enabled": false,
                            "Q2enabled": true,
                            "Q3enabled": false,
                            "Q4enabled": false,
                            "Q1Key": "Q1 2021",
                            "Q2Key": "Q2 2021",
                            "Q3Key": "Q3 2021",
                            "Q4Key": "Q4 2021",
                            "selectedKey": "invisibleButton"
                        }
                    },
                    "quarter": 2,
                    "year": 2021
                };
                const oCapacityRequirements = new Map();
                oCapacityRequirements.set(new Date("2021-6-25").getTime(),{
                    "capacity": 10
                });
                const observedResult = WeekCalendarModel.generateModel(
                    new Date("2021-6-25"),
                    new Date("2021-6-27"),
                    oCapacityRequirements,
                    oI18nedModel
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'generateModel' for exiting data returned the correct values");
            }
        );

        QUnit.test(
            'Test generateModelForYear 1st Jan in curent year week',
            async function (assert) {
                let oMonthMap = {
                    "JAN": {"monthText": undefined, "weeks": [
                        {"month": 1,"weekNumber": 1,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2019,11,30),"endDate": new Date(2020,0,5),"valueState": "Information","valueStateText": "Split Week Previous", "toolTipForEndDate": "Jan 5, 2020", "toolTipForStartDate": "Dec 30, 2019"},
                        {"month": 1,"weekNumber": 2,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2020,0,6),"endDate": new Date(2020,0,10),"valueState": "Information","valueStateText": "Partial Week with Time period", "toolTipForEndDate": "Jan 10, 2020", "toolTipForStartDate": "Jan 6, 2020"},
                        {"month": 1,"weekNumber": 3,"enabled": false,"visible": true,"value": 0},
                        {"month": 1,"weekNumber": 4,"enabled": false,"visible": true,"value": 0},
                        {"month": 1,"weekNumber": 5,"enabled": false,"visible": true,"value": 0}
                    ]},
                    "FEB": {"monthText": undefined, "weeks": [
                        {"month": 2,"weekNumber": 6,"enabled": false,"visible": true,"value": 0},
                        {"month": 2,"weekNumber": 7,"enabled": false,"visible": true,"value": 0},
                        {"month": 2,"weekNumber": 8,"enabled": false,"visible": true,"value": 0},
                        {"month": 2,"weekNumber": 9,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]},
                    "MAR": {"monthText": undefined, "weeks": [
                        {"month": 3,"weekNumber": 10,"enabled": false,"visible": true,"value": 0},
                        {"month": 3,"weekNumber": 11,"enabled": false,"visible": true,"value": 0},
                        {"month": 3,"weekNumber": 12,"enabled": false,"visible": true,"value": 0},
                        {"month": 3,"weekNumber": 13,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]}
                };
                let expectedResult = {
                    "Q1 2020": {quarter: "Q1", year: 2020, months: [oMonthMap["JAN"], oMonthMap["FEB"], oMonthMap["MAR"]]}
                };
                const observedResult = WeekCalendarModel.generateModelForYear(
                    2020,
                    new Date(2019,11,30),
                    new Date(2020,0,10),
                    new Map(),
                    oI18nedModel
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'generateModelForYear' as 1st Jan in curent year week returned the correct values");
            }
        );

        QUnit.test(
            'Test generateModelForYear 1st Jan in not curent year week',
            async function (assert) {
                let oMonthMap = {
                    "JAN": {"monthText": undefined, "weeks": [
                        {"month": 1,"weekNumber": 1,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2021,0,4),"endDate": new Date(2021,0,10),"valueState": "None","valueStateText": "", "toolTipForEndDate": "Jan 10, 2021", "toolTipForStartDate": "Jan 4, 2021"},
                        {"month": 1,"weekNumber": 2,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2021,0,11),"endDate": new Date(2021,0,12),"valueState": "Information","valueStateText": "Partial Week with Time period", "toolTipForEndDate": "Jan 12, 2021", "toolTipForStartDate": "Jan 11, 2021"},
                        {"month": 1,"weekNumber": 3,"enabled": false,"visible": true,"value": 0},
                        {"month": 1,"weekNumber": 4,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]},
                    "FEB": {"monthText": undefined, "weeks": [
                        {"month": 2,"weekNumber": 5,"enabled": false,"visible": true,"value": 0},
                        {"month": 2,"weekNumber": 6,"enabled": false,"visible": true,"value": 0},
                        {"month": 2,"weekNumber": 7,"enabled": false,"visible": true,"value": 0},
                        {"month": 2,"weekNumber": 8,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]},
                    "MAR": {"monthText": undefined, "weeks": [
                        {"month": 3,"weekNumber": 9,"enabled": false,"visible": true,"value": 0},
                        {"month": 3,"weekNumber": 10,"enabled": false,"visible": true,"value": 0},
                        {"month": 3,"weekNumber": 11,"enabled": false,"visible": true,"value": 0},
                        {"month": 3,"weekNumber": 12,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]}
                };
                let expectedResult = {
                    "Q1 2021": {quarter: "Q1", year: 2021, months: [oMonthMap["JAN"], oMonthMap["FEB"], oMonthMap["MAR"]]}
                };
                const observedResult = WeekCalendarModel.generateModelForYear(
                    2021,
                    new Date("2021-1-4"),
                    new Date("2021-1-12"),
                    new Map(),
                    oI18nedModel
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'generateModelForYear' as 1st Jan in not curent year week returned the correct values");
            }
        );

        QUnit.test(
            'Test generateModelForYear random',
            async function (assert) {
                let oMonthMap = {
                    "APR": {"monthText": undefined, "weeks": [
                        {"month": 4,"weekNumber": 13,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 14,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 15,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 16,"enabled": false,"visible": true,"value": 0},
                        {"month": 4,"weekNumber": 17,"enabled": false,"visible": true,"value": 0}
                    ]},
                    "MAY": {"monthText": undefined, "weeks": [
                        {"month": 5,"weekNumber": 18,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 19,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 20,"enabled": false,"visible": true,"value": 0},
                        {"month": 5,"weekNumber": 21,"enabled": false,"visible": true,"value": 0},
                        {"visible": false}
                    ]},
                    "JUN": {"monthText": undefined, "weeks": [
                        {"month": 6,"weekNumber": 22,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 23,"enabled": false,"visible": true,"value": 0},
                        {"month": 6,"weekNumber": 24,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2021,5,17),"endDate": new Date(2021,5,20),"valueState": "Information","valueStateText": "Partial Week with Time period", "toolTipForEndDate": "Jun 20, 2021", "toolTipForStartDate": "Jun 17, 2021"},
                        {"month": 6,"weekNumber": 25,"enabled": true,"visible": true,"value": 0, "startDate": new Date(2021,5,21),"endDate": new Date(2021,5,27),"valueState": "None","valueStateText": "", "toolTipForEndDate": "Jun 27, 2021", "toolTipForStartDate": "Jun 21, 2021"},
                        {"visible": false}
                    ]}
                };
                let expectedResult = {
                    "Q2 2021": {quarter: "Q2", year: 2021, months: [oMonthMap["APR"], oMonthMap["MAY"], oMonthMap["JUN"]]}
                };
                const observedResult = WeekCalendarModel.generateModelForYear(
                    2021,
                    new Date("2021-6-17"),
                    new Date("2021-6-27"),
                    new Map(),
                    oI18nedModel
                );
                assert.deepEqual(observedResult, expectedResult, "Method 'generateModelForYear' with random values returned the correct values");
            }
        );
    }
);
