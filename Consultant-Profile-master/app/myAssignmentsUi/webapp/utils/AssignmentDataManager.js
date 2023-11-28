sap.ui.define([
    'myAssignmentsUi/utils/DataManager',
    'myAssignmentsUi/utils/DataTransformer',
    'sap/m/MessageToast',
    'sap/ui/core/format/DateFormat'
], function(DataManager, DataTransformer, MessageToast, DateFormat) {
    'use strict';

    return DataManager.extend('myAssignmentsUi.utils.AssignmentDataManager', {

        constructor: function() {
            DataManager.apply(this, arguments);

            var _AllLegendItems = [];
            var _AllLegendAppointmentItems = [];
            var oneYearFromNow = new Date(new Date().getFullYear(), 11, 31);
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            var oneYearPastFromNow = new Date(new Date().getFullYear(), 0, 1);
            oneYearPastFromNow.setFullYear(oneYearPastFromNow.getFullYear() - 1);

            this._AllAssignmentItems = [];
            this._EditApp = false;
            this.resourceId = '';
            Array.prototype.push.apply(_AllLegendItems, DataTransformer.getFilledLegendItem(this._oi18nModel));
            Array.prototype.push.apply(_AllLegendAppointmentItems, DataTransformer.getFilledLegendAppointmentItem(this._oi18nModel));

            this.myAssignmentsModel.setData({
                minDate: oneYearPastFromNow,
                maxDate: oneYearFromNow,
                myAssignments: [{
                    assignments: [],
                    headers: [],
                    allAssignments: [],
                    allHeaders: [],
                    allMonthAssignments: []
                }],
                legendItems: _AllLegendItems,
                legendAppointmentItems: _AllLegendAppointmentItems
            });

        },

        fetchTableData: async function(dateFilter, fetchDataRange, oThis) {

            var today, firstDay, intervalEnd;
            var cStartDate, cEndDate;
            var filterStartDate, filterEndDate;
            var oDateFormat = DateFormat.getInstance({
                pattern: "yyyy-MM-dd"
            });
            if (dateFilter){ //prepare date range for navigation
                firstDay = new Date(dateFilter.oDateFrom);
                intervalEnd = new Date(dateFilter.oDateTo);
                filterStartDate = fetchDataRange.start;
                filterEndDate = fetchDataRange.end;
            } else { //prepare date range for initial app load
                today = new Date();
                filterStartDate = String(oDateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)));
                filterEndDate = new Date(today.getFullYear(), (today.getMonth() + 5) + 1, 0);
                filterEndDate = String(oDateFormat.format(filterEndDate));
                firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                intervalEnd = new Date(firstDay);
                intervalEnd =  new Date(intervalEnd.getFullYear(), intervalEnd.getMonth() + 6, 0);
            }
            cStartDate = String(oDateFormat.format(firstDay));
            cEndDate = String(oDateFormat.format(intervalEnd));

            var _AllAssignments = new Map(); // eslint-disable-line no-undef
            var _AllProjectItems = [];
            var _AllMonthAssignmentItems = [];
            var _AllResourceItems = [];
            this._AllAssignmentItems = [];
            var oEditApp = this._EditApp;

            var aResourceDateFilters = [];
            var dateFilter1 = new sap.ui.model.Filter("capacityDate", sap.ui.model.FilterOperator.BT, filterStartDate, filterEndDate );
            aResourceDateFilters.push(dateFilter1);

            var aAssignmentDateFilters = [];
            var dateFilter2 = new sap.ui.model.Filter("assignmentStartDate", sap.ui.model.FilterOperator.BT, filterStartDate, filterEndDate );
            aAssignmentDateFilters.push(dateFilter2);

            var promises = [];

            var oEditValue = this._oODataModel.bindContext("/checkEditEnabled()");
            var oEditValuePromise = oEditValue.requestObject().then(function (oContexts) {
                oEditApp = oContexts.value;
            });
            promises.push(oEditValuePromise);

            var oListProjectsItem = this._oODataModel.bindList('/AssignmentRequestDetails', undefined, undefined);
            var oListProjectsItemPromise = oListProjectsItem.requestContexts(0, 1000).then(function (oContexts) {
                if (oContexts.length > 0) {
                    Array.prototype.push.apply(_AllProjectItems, DataTransformer.getFilledProjectItem(oContexts));
                    if (!oThis) {
                        Array.prototype.push.apply(_AllMonthAssignmentItems, DataTransformer.getFilledMonthAssignmentItem(oContexts));
                    }
                }
            });
            promises.push(oListProjectsItemPromise);

            var oListBindingTable = this._oODataModel.bindList('/ResourceDetails', undefined, undefined, aResourceDateFilters);
            var oListBindingTablePromise = oListBindingTable.requestContexts(0, 1000).then(function(oContexts){
                Array.prototype.push.apply(_AllResourceItems, oContexts);
            });

            promises.push(oListBindingTablePromise);

            await this.fetchFirstRecords(aAssignmentDateFilters).then(function (oResult) {
                this.fetchRemainingRecords(oResult, aAssignmentDateFilters).then(function (aRecords) {
                    // further work with aRecords
                    Array.prototype.push.apply(this._AllAssignmentItems, DataTransformer.getFilledAssignmentItems(aRecords));
                    // Prepare the data to be displayed on UI
                    Object.assign(_AllAssignments, DataTransformer.prepareCalendarData(_AllResourceItems, this._AllAssignmentItems, _AllProjectItems));

                    if (!this._aOriginalAssignments) {
                        this._aOriginalAssignments = this.myAssignmentsModel.getProperty("/myAssignments");
                    }
                    var aOriginalAssignments = this.myAssignmentsModel.getProperty("/myAssignments");
                    //Store the fetch records to get the appointments from cache
                    Array.prototype.push.apply(aOriginalAssignments[0].allAssignments, _AllAssignments._assignments);
                    Array.prototype.push.apply(aOriginalAssignments[0].allHeaders, _AllAssignments._headers);
                    Array.prototype.push.apply(aOriginalAssignments[0].allMonthAssignments, _AllMonthAssignmentItems);

                    aOriginalAssignments = this._getFilteredAppointments(aOriginalAssignments, cStartDate, cEndDate, oThis);

                    this._EditApp = oEditApp;
                    if (this._aOriginalAssignments[0].allAssignments[0] != null) {
                        this.resourceId = this._aOriginalAssignments[0].allAssignments[0].resourceId;
                    }
                    this.myAssignmentsModel.setProperty("/myAssignments", aOriginalAssignments);

                    if (aOriginalAssignments[0].headers.length <= 0){ MessageToast.show(this._oi18nModel.getText("RESOURCE_HAS_NO_CAPACITY"));}
                }.bind(this));
            }.bind(this));

            // Use of Promise.all to execute all promises concurrently
            await Promise.all(promises);
        },

        fetchFirstRecords: function (aAssignmentDateFilters) {
            return new Promise(
                function (resolve, reject) {
                    var oListAssignmentItem = this._oODataModel.bindList('/AssignmentDetails', undefined, undefined, aAssignmentDateFilters, {
                        $count: true
                    });
                    oListAssignmentItem.requestContexts(0, 1000).then((aContexts) => {
                        resolve({
                            records: aContexts,
                            count: oListAssignmentItem.getLength()
                        });
                    }, reject);
                }.bind(this)
            );
        },

        fetchRemainingRecords: function (oResult, aAssignmentDateFilters) {
            if (oResult.count <= 1000) {
                return Promise.resolve(oResult.records);
            }
            return new Promise(
                async function (resolve, reject) {
                    var aAllRecords = oResult.records; // use records from first call
                    var iCallsToBeMade = parseInt((oResult.count / 1000), 10);
                    var oListAssignmentItem = this._oODataModel.bindList('/AssignmentDetails', undefined, undefined, aAssignmentDateFilters);
                    for (var i = 1; i <= iCallsToBeMade; i++) {
                        var iSkip = i * 1000;
                        await oListAssignmentItem.requestContexts(iSkip, 1000).then(function (oResult) {
                            Array.prototype.push.apply(aAllRecords, oResult);
                        }, reject);
                    }
                    resolve(aAllRecords);
                }.bind(this)
            );
        },

        _getFilteredAppointments: function (aOriginalAssignments, cStartDate, cEndDate, oThis) {
            var aFilteredHeaders;
            var aFilteredAssignments;

            // Filter the assignment and headers for the visible range according to the view displayed
            if (oThis && oThis.getModelProperty("viewModel", "/selectedCalendarMode") == "MyWeek") {
                aFilteredAssignments = aOriginalAssignments[0].allAssignments.filter(function (oAssignment) {
                    return (oAssignment.assignmentDay >= cStartDate && oAssignment.assignmentDay <= cEndDate);
                });
                aFilteredHeaders = aOriginalAssignments[0].allHeaders.filter(function (oHeader) {
                    return (oHeader.assignmentDay >= cStartDate && oHeader.assignmentDay <= cEndDate);
                });
                aFilteredAssignments.sort(function(a, b) {
                    return a.assignmentEndDate - b.assignmentEndDate || a.title.localeCompare(b.title);
                });
            } else {
                aFilteredAssignments = aOriginalAssignments[0].allMonthAssignments.filter(function (oAssignment) {
                    return (cStartDate >= oAssignment.assignmentStartDay || cStartDate <= oAssignment.assignmentStartDay);
                });

                var aMonthHeaders = aOriginalAssignments[0].allHeaders.filter(function (oHeader) {
                    return (oHeader.assignmentDay >= cStartDate && oHeader.assignmentDay <= cEndDate);
                });
                aFilteredHeaders = Array.from(new Map(aMonthHeaders.map((item) => [item["month"], item])).values());
            }

            //apply filter if any present on search bar
            if (oThis) {
                if (oThis.searchQuery && oThis.searchQuery.length > 1) {
                    aFilteredAssignments = aFilteredAssignments.filter(function (fAssignment) {
                        return (fAssignment.title.match(new RegExp(oThis.searchQuery, "i")) || fAssignment.customerName.match(new RegExp(oThis.searchQuery, "i")));
                    });
                }
            }
            //Assigned data to planning calendar
            aOriginalAssignments[0].assignments = aFilteredAssignments;
            aOriginalAssignments[0].headers = aFilteredHeaders;

            return aOriginalAssignments;
        }

    });

});
