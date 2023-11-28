sap.ui.define([
    'sap/ui/core/format/DateFormat'
], function (DateFormat) {
    'use strict';

    return {

        // Preparation of dateFilter start date
        getFilterStartDate: function (startDateDataFound, dStartDate, dateFilterStart) {
            var dateFrom;
            if (startDateDataFound == undefined) {
                dateFrom = this.formatDatePattern(dStartDate);
            } else {
                dateFrom = new Date(dStartDate.getFullYear(), dStartDate.getMonth() + 1, 1);
            }
            dateFilterStart = dateFrom;
            return dateFilterStart;
        },

        // Preparation of dateFilter end date
        getFilterEndDate: function (endDateDataFound, dEndDate, dStartDate, dateFilterEnd, oThis) {
            var dateTo;
            switch (oThis.getModelProperty("viewModel", "/selectedCalendarMode") == "MyWeek") {
            case true:
                if (endDateDataFound == undefined) {
                    dateTo = this.formatDatePattern(dEndDate);
                } else {
                    dateTo = new Date(dStartDate.getFullYear(), dStartDate.getMonth() + 1, 0);
                }
                break;
            case false:
                if (endDateDataFound == undefined) {
                    dateTo = this.formatDatePattern(dEndDate);
                } else {
                    dateTo = new Date(dStartDate.getFullYear(), dStartDate.getMonth() + 6, 0);
                }
                break;
            default:
                break;
            }
            dateFilterEnd = dateTo;
            return dateFilterEnd;

        },

        //Preparation of fetchDataRange
        getDataRange: function (dStartDate, dEndDate, fetchDataRange, oThis) {

            var startDateDataFound = true, endDateDataFound = true;
            var cStartDate = this.formatDatePattern(dStartDate);

            var cEndDate = this.formatDatePattern(dEndDate);

            var flag = false;
            var i = new Date(dStartDate);
            while (i <= new Date(dEndDate)) {
                if (oThis.pCMonthMap.get((i.getMonth() + "-" + i.getFullYear()).toString()) != true) {
                    switch (flag) {
                    case true:
                        startDateDataFound = null;
                        endDateDataFound = null;
                        cEndDate = this.getEndDate(i);
                        break;
                    case false:
                        startDateDataFound = null;
                        endDateDataFound = null;
                        cStartDate = this.getStartDate(i);
                        cEndDate = this.getEndDate(i);
                        flag = true;
                        break;
                    default:
                        break;
                    }
                }
                switch (oThis.getModelProperty("viewModel", "/selectedCalendarMode") == "MyWeek") {
                case true:
                    i = i.setDate(i.getDate() + 1);
                    i = new Date(i);
                    break;
                case false:
                    i.setMonth(i.getMonth() + 1);
                    break;
                default:
                    break;
                }
            }

            for (var i = new Date(dStartDate); i <= new Date(dEndDate); i.setDate(i.getDate() + 1)) {
                oThis.pCMonthMap.set((i.getMonth() + "-" + i.getFullYear()).toString(), true);
            }

            fetchDataRange.start = cStartDate;
            fetchDataRange.end = cEndDate;
            fetchDataRange.startDateDataFound = startDateDataFound;
            fetchDataRange.endDateDataFound = endDateDataFound;

            return fetchDataRange;
        },

        // Validation of end date for month view
        validateMonthEndDate: function(dStartDate, dEndDate, oPCMonthObj, oThis) {
            var oPlanningCalendar = oThis.getView().byId("MyPlanningCalendar");
            if (dEndDate.getFullYear() > new Date().getFullYear() + 1) {
                dStartDate = this.setStartDate();
                dEndDate = this.setEndDate();
                oPlanningCalendar.setStartDate(dStartDate);
                oPlanningCalendar.getAggregation("header")._oNextBtn.mProperties.enabled = false;
            }
            oPCMonthObj.monthStartDate = dStartDate;
            oPCMonthObj.monthEndDate = dEndDate;
            return oPCMonthObj;
        },

        // Preparation of startDate for getDataRange
        getStartDate: function (startDate) {
            var startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            var cStartDate = this.formatDatePattern(startDate);
            return cStartDate;
        },

        // Preparation of endDate for getDataRange
        getEndDate: function (endDate) {
            var endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            var cEndDate = this.formatDatePattern(endDate);
            return cEndDate;
        },

        // Formatting the dates
        formatDatePattern: function (oDate) {
            var oDateFormat = DateFormat.getInstance({
                pattern: "yyyy-MM-dd"
            });
            var oDate = String(oDateFormat.format(oDate));
            return oDate;
        },

        //set start date for validateMonthEndDate function
        setStartDate: function () {
            var startDate =  new Date(new Date().getFullYear() + 1, 6, 1);
            return startDate;
        },

        //set end date for validateMonthEndDate function
        setEndDate: function () {
            var endDate =  new Date(new Date().getFullYear() + 1, 11, 31);
            return endDate;
        },

        // formatting the date
        formatDate: function (oDate) {
            var dateFormate;
            if (oDate) {
                var iHours = oDate.getHours(),
                    iMinutes = oDate.getMinutes(),
                    iSeconds = oDate.getSeconds();

                if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
                    dateFormate = DateFormat.getDateTimeInstance({ style: 'medium' }).format(oDate);
                } else {
                    dateFormate = DateFormat.getDateInstance({ style: 'medium' }).format(oDate);
                }
            }
            return dateFormate;
        }
    };
});
