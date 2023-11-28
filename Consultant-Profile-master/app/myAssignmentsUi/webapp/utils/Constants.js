sap.ui.define([], function () {
    'use strict';

    return {
        TOTAL_EFFORT: 0,
        DAILY_EFFORT: 1,
        WEEKLY_EFFORT: 2,
        monthEnum: {
            0: "JAN",
            1: "FEB",
            2: "MAR",
            3: "APR",
            4: "MAY",
            5: "JUN",
            6: "JUL",
            7: "AUG",
            8: "SEP",
            9: "OCT",
            10: "NOV",
            11: "DEC"
        },
        quarterEnum: {
            "Q1": [0, 1, 2],
            "Q2": [3, 4, 5],
            "Q3": [6, 7, 8],
            "Q4": [9, 10, 11]
        },
        unselectKey: "invisibleButton"
    };
});
