sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "myAssignmentsUi/utils/WeekCalendarDateHelper",
    "myAssignmentsUi/model/WeekCalendarModel"
], function (JSONModel, WeekCalendarDateHelper, WeekCalendarModel) {
    'use strict';

    let isCurrentKeyPresent;
    let fTotalEffort;
    let sSelectedKey;
    const traversedMap = new Map();
    const oCurrentQuarterModel = new JSONModel();

    return {
        // Calculate the quarter number based on the navigation
        calculateQuarterValues: function (iQuarterNumber, iYear) {
            let iNextQuarterNumber = iQuarterNumber + 1;
            let iYearForNextQuarter = iYear;
            let iPreviousQuarterNumber = iQuarterNumber - 1;
            let iYearForPreviousQuarter = iYear;
            if (iNextQuarterNumber == 5) {
                iYearForNextQuarter++;
                iNextQuarterNumber = 1;
            }
            if (iPreviousQuarterNumber == 0) {
                iYearForPreviousQuarter--;
                iPreviousQuarterNumber = 4;
            }
            return {
                nextQuarterNumber: iNextQuarterNumber,
                yearForNextQuarter: iYearForNextQuarter,
                previousQuarterNumber: iPreviousQuarterNumber,
                yearForPreviousQuarter: iYearForPreviousQuarter
            };
        },

        // Calculate the quarter number when the previous quarter button is pressed
        calculatePreviousQuarterData: function (iQuarterNumber, iYear) {
            // When the quarter number is equals to 1
            // Return the last quarter of previous year
            if (iQuarterNumber == 1) {
                iYear--;
                iQuarterNumber = 4;
            } else {
                iQuarterNumber--;
            }
            return {
                quarterNumber: iQuarterNumber,
                year: iYear
            };
        },

        // Calculate the quarter number when the next quarter button is pressed
        calculateNextQuarterData: function (iQuarterNumber, iYear) {
            // When the quarter number is equals to 4
            // Return the first quarter of next year
            if (iQuarterNumber == 4) {
                iYear++;
                iQuarterNumber = 1;
            } else {
                iQuarterNumber++;
            }
            return {
                quarterNumber: iQuarterNumber,
                year: iYear
            };
        },

        // Responsible for setting the data reveived from the backend call to edit week dialog
        getAssignmentResponse: function (oContexts, oRequestedStartDate, oRequestedEndDate, totalEffort, that) {
            return new Promise(function (resolve, reject) {
                const oCapacityRequirements = new Map();
                let oQuarterData;
                let fTotalEffort;
                var result = oContexts.value;
                totalEffort = result[0].bookedCapacity;
                var weeklyData = result[0]._weeklyAssignmentDistribution;
                weeklyData.forEach(function (oContext) {
                    const oDate = WeekCalendarDateHelper.getCorrectDate(new Date(oContext.startDate));
                    const iCapacityValue = oContext.bookedCapacity;
                    const oCalendarWeek = oContext.calendarWeek;
                    // Set the data fetched from the backend in the map.
                    oCapacityRequirements.set(
                        new Date(
                            oDate.getFullYear(),
                            oDate.getMonth(),
                            oDate.getDate()
                        ).getTime(),
                        {
                            capacity: iCapacityValue,
                            calendarWeek: oCalendarWeek,
                            totalEffort: totalEffort,
                            context: oContext
                        }
                    );
                });
                // Get structured model.
                const oGeneratedData = WeekCalendarModel.generateModel(
                    oRequestedStartDate,
                    oRequestedEndDate,
                    oCapacityRequirements,
                    that.oView.getModel("i18ned")
                );
                oQuarterData = oGeneratedData.oModel;
                // Set Model to Dialog.
                oCurrentQuarterModel.setData({ currDetails: oQuarterData });
                that.oView.setModel(oCurrentQuarterModel, "currentQuarterModel");
                fTotalEffort = totalEffort;
                // Open the dialog.
                that.pEffortDistributionWeeklyCalendarFragment.then(function (oDialog) {
                    oDialog.open();
                    // Decide selected quarter and year and set value for the quarter select button.
                    const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
                    // Set year and quarter according to weekly assignment data (first quarter if no data)
                    let selectedYear = Object.keys(oQuarterData)[0];
                    if (oGeneratedData.year) {
                        selectedYear = oGeneratedData.year;
                    }
                    sSelectedKey = Object.keys(oQuarterData[selectedYear].data)[0];
                    if (oGeneratedData.year) {
                        sSelectedKey = that.generateKey(oGeneratedData.quarter, oGeneratedData.year);
                    }
                    oCurrentQuarterModel.setProperty(
                        "/currDetails/" + selectedYear + "/" + "selectedKey",
                        sSelectedKey
                    );
                    oTable.bindAggregation(
                        "items",
                        "currentQuarterModel>/currDetails/" +
                        selectedYear +
                        "/data/" +
                        sSelectedKey +
                        "/months",
                        oTable.getBindingInfo("items").template.clone()
                    );

                    const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
                    oButton.setText(sSelectedKey);
                    // Enable/Disable Next and previous quarter button.
                    that.updateNavigationVisibility(sSelectedKey);
                    // Set Total requested effort in the dialog.
                    that.oView
                        .getModel("currentQuarterModel")
                        .setProperty("/totalEffort", parseFloat(fTotalEffort));
                    // Set requestedStartDate and requestedEndDate in the dialog.
                    that.oView
                        .getModel("currentQuarterModel")
                        .setProperty(
                            "/requestedStartDate",
                            oRequestedStartDate.toLocaleDateString("en-us", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })
                        );
                    that.oView
                        .getModel("currentQuarterModel")
                        .setProperty(
                            "/requestedEndDate",
                            oRequestedEndDate.toLocaleDateString("en-us", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })
                        );
                    resolve({
                        oCapacityRequirements,
                        oCurrentQuarterModel,
                        fTotalEffort,
                        totalEffort,
                        sSelectedKey
                    });
                });
            });
        },

        //  Responsible for dynamically changing the week parameters on user input
        onUpdateWeeklyCell: function (oCapacityRequirements, dateRange, cellData, totalEffort, updatedWeeklyAssignmentData, that) {
            var oThat = that;
            var currentKey = 0;
            var oStartDate = dateRange.oDateFrom;
            var oEndDate = dateRange.oDateTo;
            var weekNumber = cellData.weekNumber;
            var iNewEffortValue = cellData.iNewEffortValue;
            let updateCallObject;
            // Check if the backend has the data for the chosen week
            for (const key of oCapacityRequirements.keys()) {
                if (key >= oStartDate.getTime() && key <= oEndDate.getTime()) {
                    currentKey = key;
                    break;
                }
            }
            // Update scenario if backend data has the key
            if (oCapacityRequirements.has(currentKey)) {
                isCurrentKeyPresent = true;
                const oCapacityRecord = oCapacityRequirements.get(currentKey);
                // Logic to store the totalefforts on initial rendering of any cell
                if (oThat._currentAssignedEffort == undefined) {
                    oThat._currentAssignedEffort = oCapacityRecord.totalEffort;
                }
                var oCapacityRequirementsArray = Array.from(oCapacityRequirements.values());
                var oVal = oCapacityRequirementsArray.filter(cr => { return cr.calendarWeek == weekNumber; })[0].capacity;
                if (traversedMap.has(weekNumber)) {
                    oVal = traversedMap.get(weekNumber).oldValue;
                }
                // Storing the updated data of the cell in updatedWeeklyAssignmentData object to be sent to backend patch call
                updateCallObject = this.handleUpdateCallObject(oThat, iNewEffortValue, oVal, weekNumber, updatedWeeklyAssignmentData, oCapacityRecord);
            } else {
                isCurrentKeyPresent = false;
                var oVal = 0;
                const oCapacityRecord = null;
                // Logic to store the totalefforts on initial rendering of any cell
                if (oThat._currentAssignedEffort == undefined) {
                    oThat._currentAssignedEffort = totalEffort;
                }
                if (traversedMap.has(weekNumber)) {
                    oVal = traversedMap.get(weekNumber).oldValue;
                }
                // Storing the updated data of the cell in updatedWeeklyAssignmentData object to be sent to backend patch call
                updateCallObject = this.handleUpdateCallObject(oThat, iNewEffortValue, oVal, weekNumber, updatedWeeklyAssignmentData, oCapacityRecord);
            }
            updatedWeeklyAssignmentData = updateCallObject.updatedWeeklyAssignmentData;
            return {
                traversedMap,
                fTotalEffort,
                updatedWeeklyAssignmentData
            };
        },

        // Preparing the object for the PATCH call on user input
        handleUpdateCallObject: function (that, iNewEffortValue, oVal, weekNumber, updatedWeeklyAssignmentData, oCapacityRecord) {
            fTotalEffort = that._currentAssignedEffort - oVal + Number(iNewEffortValue);
            that._currentAssignedEffort = fTotalEffort;
            // Storing the previous weekly effort for the cell before modification in traversedMap for further use
            traversedMap.set(weekNumber, { oldValue: iNewEffortValue });
            const obj = {
                "calendarWeek": weekNumber,
                "bookedCapacity": Number(iNewEffortValue)
            };
            // Check if updatedWeeklyAssignmentData object is empty or not
            if (updatedWeeklyAssignmentData._weeklyAssignmentDistribution.length != 0) {
                var updatedList = [];
                var flag = false;
                // Storing the new effort value for cell if the weeknumber is present in updatedWeeklyAssignmentData object
                updatedWeeklyAssignmentData._weeklyAssignmentDistribution.map(assignmentObj => {
                    if (assignmentObj.calendarWeek === weekNumber) {
                        assignmentObj.bookedCapacity = Number(iNewEffortValue);
                        flag = true;
                    }
                    // Condition when the key is present in backend data
                    if (isCurrentKeyPresent === true && (assignmentObj.calendarWeek != weekNumber || oCapacityRecord.capacity != Number(iNewEffortValue))) { updatedList.push(assignmentObj); }
                    // Condition when the key is not present in backend data
                    if (isCurrentKeyPresent === false && (assignmentObj.calendarWeek != weekNumber || Number(iNewEffortValue) != 0)) { updatedList.push(assignmentObj); }
                });
                // Storing the new effort value for cell if the weeknumber is not present in updatedWeeklyAssignmentData object
                if (flag == false) { updatedList.push(obj); }
                updatedWeeklyAssignmentData._weeklyAssignmentDistribution = updatedList;
            } else {
                updatedWeeklyAssignmentData._weeklyAssignmentDistribution.push(obj);
            }
            return {
                fTotalEffort,
                updatedWeeklyAssignmentData
            };
        },

        // Responsible for reloading the UI after the successful PATCH call
        getUpdatedData: async function (that) {
            var oThat = that.oThis;
            var dateFilter = {};
            var fetchDataRange = {};
            var oPlanningCalendar = oThat.getView().byId("MyPlanningCalendar");
            var dStartDate = new Date(oPlanningCalendar.getStartDate().getFullYear(), oPlanningCalendar.getStartDate().getMonth(), 1);
            var dEndDate = new Date(oPlanningCalendar.getEndDate().getFullYear(), oPlanningCalendar.getEndDate().getMonth() + 1, 0);
            fetchDataRange.start = WeekCalendarDateHelper.formatDatePattern(dStartDate);
            fetchDataRange.end = WeekCalendarDateHelper.formatDatePattern(dEndDate);
            dateFilter.oDateFrom = WeekCalendarDateHelper.formatDatePattern(dStartDate);
            dateFilter.oDateTo = WeekCalendarDateHelper.formatDatePattern(dEndDate);
            oThat.getView().setBusyIndicatorDelay(0);
            oThat.getView().setBusy(true);
            var myAssignments = [{
                assignments: [],
                headers: [],
                allAssignments: [],
                allHeaders: [],
                allMonthAssignments: []
            }];
            oThat.getView().getModel().setProperty("/myAssignments", myAssignments);
            oThat.pCMonthMap.clear();
            // call the backend to get the updated data
            await oThat.assignmentDataManager.fetchTableData(dateFilter, fetchDataRange).then(function () {
                for (var i = new Date(dStartDate); i <= new Date(dEndDate); i.setDate(i.getDate() + 1)) {
                    oThat.pCMonthMap.set((i.getMonth() + "-" + i.getFullYear()).toString(), true);
                }
                oThat.getView().setBusy(false);
            });

        }
    };
});
