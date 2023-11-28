sap.ui.define(["myAssignmentsUi/utils/Constants",
    "myAssignmentsUi/utils/WeekCalendarDateHelper",
    "sap/ui/core/format/DateFormat"],
function (Constants, WeekCalendarDateHelper, DateFormat) {
    'use strict';

    const WeekCalendarModel = {};
    WeekCalendarModel.oFormat = DateFormat.getDateInstance();
    // Generates week wise model.
    WeekCalendarModel.generateModel = function (oRRStartDate, oRREndDate, oCapacityRequirements, oI18nedModel) {
        WeekCalendarModel.oSelectedQuarter = undefined;
        let iRRStartYear = oRRStartDate.getFullYear();
        let iRREndYear = oRREndDate.getFullYear();
        iRRStartYear = WeekCalendarDateHelper.considerPreviousYearForWeekWise(oRRStartDate) ? iRRStartYear - 1 : iRRStartYear;
        iRREndYear = WeekCalendarDateHelper.considerNextYearForWeekWise(oRREndDate) ? iRREndYear + 1 : iRREndYear;
        const oModel = {};
        for (let iCurrentYear = iRRStartYear; iCurrentYear <= iRREndYear; iCurrentYear++) {
            const oYearData = WeekCalendarModel.generateModelForYear(iCurrentYear, oRRStartDate, oRREndDate,
                oCapacityRequirements, oI18nedModel);
            if (Object.keys(oYearData).length !== 0) {
                oModel[iCurrentYear] = {
                    "year": iCurrentYear,
                    "data": oYearData,
                    "Q1enabled": oYearData["Q1 " + iCurrentYear] ? true : false,
                    "Q2enabled": oYearData["Q2 " + iCurrentYear] ? true : false,
                    "Q3enabled": oYearData["Q3 " + iCurrentYear] ? true : false,
                    "Q4enabled": oYearData["Q4 " + iCurrentYear] ? true : false,
                    "Q1Key": "Q1 " + iCurrentYear,
                    "Q2Key": "Q2 " + iCurrentYear,
                    "Q3Key": "Q3 " + iCurrentYear,
                    "Q4Key": "Q4 " + iCurrentYear,
                    "selectedKey": Constants.unselectKey
                };
            }
        }
        return {
            oModel,
            quarter: WeekCalendarModel.oSelectedQuarter ? WeekCalendarModel.oSelectedQuarter.quarter : undefined,
            year: WeekCalendarModel.oSelectedQuarter ? WeekCalendarModel.oSelectedQuarter.year : undefined
        };
    };

    // Delete quarter data if none of the week input fields are enabled.
    WeekCalendarModel.cleanQuarterData = function (oMap, iYear) {
        // Delete quarter in which all weeks are marked as enabled false
        for (const sQuarter in Constants.quarterEnum) {
            const sKey = sQuarter + " " + iYear;
            let bDeleteQuarter = true;

            oMap[sKey].months.forEach((oMonthData) => {
                oMonthData.weeks.forEach((oWeek) => {
                    // Mark delete as false if even 1 week has enable as true.
                    if (oWeek.enabled == true) {
                        bDeleteQuarter = false;
                    }
                });
            });
            if (bDeleteQuarter) {
                delete oMap[sKey];
            }
        }
        return oMap;
    };

    // Add a 5th non visible week to model if there are only 4 weeks in the month.
    WeekCalendarModel.fillFifthWeekWhereFour = function (oMap, iYear) {
        // We can have min 4 and max 5 weeks in a month.
        // Our UI expects 5 in the data model so for month which has 4 week we add a 5th week with visible as false.
        for (const sQuarter in Constants.quarterEnum) {
            const sKey = sQuarter + " " + iYear;
            if (oMap[sKey]) {
                oMap[sKey].months.forEach((oMonthData) => {
                    // Add a 5th invisible week if month has only 4 weeks.
                    if (oMonthData.weeks.length === 4) {
                        oMonthData.weeks.push({
                            visible: false
                        });
                    }
                });
            }
        }
        return oMap;
    };

    // Add a 5th non visible week to model if there are only 4 weeks in the month.
    WeekCalendarModel.getWeekData = function (iMonth, iWeeekNumber, oIsDateValid, oCapacityRequirements, iYear) {
        const oWeekInfo = {
            month: iMonth + 1,
            weekNumber: iWeeekNumber
        };
        if (oIsDateValid.valid) {
            oWeekInfo.startDate = oIsDateValid.startDate;
            oWeekInfo.toolTipForStartDate = WeekCalendarModel.oFormat.format(oIsDateValid.startDate);
            oWeekInfo.endDate = oIsDateValid.endDate;
            oWeekInfo.toolTipForEndDate = WeekCalendarModel.oFormat.format(oIsDateValid.endDate);
            oWeekInfo.enabled = true;
            oWeekInfo.visible = true;
            oWeekInfo.valueState = oIsDateValid.valueState;
            oWeekInfo.valueStateText = oIsDateValid.valueStateText;
            const oStartDateKey = oIsDateValid.startDate.getTime();
            const oEndDateKey = oIsDateValid.endDate.getTime();
            oWeekInfo.value = 0;

            // Set selected quarter as the quarter with first capacity data
            for (const key of oCapacityRequirements.keys()) {
                if (key >= oStartDateKey && key <= oEndDateKey) {
                    oWeekInfo.value = oCapacityRequirements.get(key).capacity;

                    if (WeekCalendarModel.oSelectedQuarter) {
                        if (WeekCalendarModel.oSelectedQuarter.year > iYear) {
                            WeekCalendarModel.oSelectedQuarter = {
                                year: iYear,
                                quarter: WeekCalendarDateHelper.quarterOfMonth(iMonth + 1)
                            };
                        } else if (WeekCalendarModel.oSelectedQuarter.year == iYear &&
                                WeekCalendarModel.oSelectedQuarter.quarter > WeekCalendarDateHelper.quarterOfMonth(iMonth + 1)) {
                            WeekCalendarModel.oSelectedQuarter.quarter = WeekCalendarDateHelper.quarterOfMonth(iMonth + 1);
                        }
                    } else {
                        WeekCalendarModel.oSelectedQuarter = {
                            year: iYear,
                            quarter: WeekCalendarDateHelper.quarterOfMonth(iMonth + 1)
                        };
                    }
                }
            }
        } else {
            oWeekInfo.enabled = false;
            oWeekInfo.visible = true;
            oWeekInfo.value = 0;
        }
        return oWeekInfo;
    };

    // Spilt months into quarters.
    WeekCalendarModel.getDataStructuredinQuarter = function (oMonthMap, iYear) {
        const oFinalMap = {};
        for (const sQuarter in Constants.quarterEnum) {
            oFinalMap[sQuarter + " " + iYear] = {
                quarter: sQuarter,
                year: iYear,
                months: [
                    oMonthMap[Constants.monthEnum[Constants.quarterEnum[sQuarter][0]]],
                    oMonthMap[Constants.monthEnum[Constants.quarterEnum[sQuarter][1]]],
                    oMonthMap[Constants.monthEnum[Constants.quarterEnum[sQuarter][2]]]
                ]
            };
        }
        return oFinalMap;
    };

    // Generates week wise model for specefic year.
    WeekCalendarModel.generateModelForYear = function (iYear, oRRStartDate, oRREndDate, oCapacityRequirements,
        oI18nedModel) {
        const iFirstJanDay = new Date(iYear, 0, 1).getDay();
        let oWeekOneStartDate;
        switch (iFirstJanDay) {
        case 1:
            // 1st January is on Monday
            // 1st Januray will be start of first week
            oWeekOneStartDate = new Date(iYear, 0, 1);
            break;
        case 0:
            // 1st January is on Sunday
            // 2nd January will be start of first week
            oWeekOneStartDate = new Date(iYear, 0, 2);
            break;
        case 2:
        case 3:
        case 4:
            // 1st Januray is Tuesday   = 31th December will be start of 1st week
            // 1st Januray is Wednesday = 30th December will be start of 1st week
            // 1st Januray is Thursday  = 29th December will be start of 1st week
            oWeekOneStartDate = new Date(iYear - 1, 11, 31 - iFirstJanDay + 2);
            break;
        default:
            // 1st Januray is Friday or Saturday
            // 4rd Januray or 3nd Januray will be start of 1st week
            oWeekOneStartDate = new Date(iYear, 0, 7 - iFirstJanDay + 2);
            break;
        }

        // Initialize start points
        const oMonthMap = {};
        let iWeeekNumber = 1;
        let iMonth = 0;
        let oStartDate = oWeekOneStartDate;
        let oEndDate = WeekCalendarDateHelper.addDays(oWeekOneStartDate, 6);
        // Generate Data for all weeks of current year
        while (oEndDate.getFullYear() == iYear) {
            if ((oEndDate.getMonth() !== iMonth) && (oStartDate.getMonth() === iMonth)) {
                const oFirstDateofNextMonth = new Date(iYear, iMonth + 1, 1);
                if (oFirstDateofNextMonth.getDay() <= 4 && oFirstDateofNextMonth.getDay() != 0) {
                    iMonth++;
                }
            } else if ((oEndDate.getMonth() !== iMonth) && (oStartDate.getMonth() !== iMonth)) {
                iMonth++;
            }

            if (!oMonthMap[Constants.monthEnum[iMonth]]) {
                oMonthMap[Constants.monthEnum[iMonth]] = {
                    monthText: oI18nedModel.getProperty(Constants.monthEnum[iMonth]),
                    weeks: []
                };
            }
            const oIsDateValid = WeekCalendarDateHelper.checkValidDates(oStartDate, oEndDate, oRRStartDate, oRREndDate,
                oI18nedModel);
            const oWeekInfo = WeekCalendarModel.getWeekData(iMonth, iWeeekNumber, oIsDateValid, oCapacityRequirements,
                iYear);
            oMonthMap[Constants.monthEnum[iMonth]]["weeks"].push(oWeekInfo);
            // Prepare for next iteration
            iWeeekNumber++;
            oStartDate = WeekCalendarDateHelper.addDays(oStartDate, 7);
            oEndDate = WeekCalendarDateHelper.addDays(oEndDate, 7);
        }
        // If the End Date is 1st Jan/ 2nd Jan/ 3rd Jan then the week will lie in current year else it will be part of next year
        if (oEndDate.getDate() <= 3) {
            const oIsDateValid = WeekCalendarDateHelper.checkValidDates(oStartDate, oEndDate, oRRStartDate, oRREndDate,
                oI18nedModel);
            const oWeekInfo = WeekCalendarModel.getWeekData(iMonth, iWeeekNumber, oIsDateValid, oCapacityRequirements,
                iYear);
            oMonthMap[Constants.monthEnum[iMonth]]["weeks"].push(oWeekInfo);
        }
        let oFinalMap = WeekCalendarModel.getDataStructuredinQuarter(oMonthMap, iYear);
        oFinalMap = WeekCalendarModel.cleanQuarterData(oFinalMap, iYear);
        oFinalMap = WeekCalendarModel.fillFifthWeekWhereFour(oFinalMap, iYear);
        return oFinalMap;
    };

    return WeekCalendarModel;
});
