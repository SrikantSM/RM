sap.ui.define([
    'sap/ui/core/format/DateFormat'
], function (DateFormat) {
    'use strict';

    return {
        // Add days to given date.
        addDays: function (oDate, iDays) {
            const result = new Date(oDate);
            result.setDate(result.getDate() + iDays);
            return result;
        },

        // Check if oDate falls between oStartDate and oEndDate.
        inRange: function (oDate, oStartDate, oEndDate) {
            if (oDate.getTime() >= oStartDate.getTime() && oDate.getTime() <= oEndDate.getTime()) {
                return true;
            }
            return false;
        },

        // Get date in correct format.
        getCorrectDate: function (oDate) {
            /**
			 * Why?
			 * new Date("2021-01-01") and new Date(2021,0,1) are not considered equal.
			 * To avoid any false negative we always generate date object using this method.
			 */
            return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
        },

        // Validate if previous month need to be considered for UI model in case of week wise.
        considerPreviousYearForWeekWise: function (oDate) {
            /**
			 * Why?
			 * 1st januray 2021 is RR start date.
			 * this falls in last week of 2020 year.
			 * Thus we need to consider previous year also when we generate UI model
			 */
            if (oDate.getMonth() === 0) {
                const oFirstDayofThisYear = new Date(oDate.getFullYear(), 0, 1);
                const iWeekDay = oFirstDayofThisYear.getDay();
                const oWeekEndDate = new Date(oDate.getFullYear(), 0, 7 - iWeekDay + 1);
                if (iWeekDay >= 4 && oWeekEndDate.getTime() >= oDate.getTime()) {
                    return true;
                }
            }
            return false;
        },

        // Validate if next month need to be considered for UI model in case of week wise.
        considerNextYearForWeekWise: function (oDate) {
            /**
			 * Why?
			 * 31st december 2018 is RR end date.
			 * this falls in first week of 2019 year.
			 * Thus we need to consider next year also when we generate UI model
			 */
            if (oDate.getMonth() === 11) {
                const oLastDayofThisYear = new Date(oDate.getFullYear(), 11, 31);
                const iWeekDay = oLastDayofThisYear.getDay();
                const oWeekStartDate = new Date(oDate.getFullYear(), 11, 31 - iWeekDay);
                if (iWeekDay <= 2 && oWeekStartDate.getTime() <= oDate.getTime()) {
                    return true;
                }
            }
            return false;
        },

        // eslint-disable-next-line consistent-return
        quarterOfMonth: function (iMonth) {
            // eslint-disable-next-line default-case
            switch (iMonth) {
            case 1:
            case 2:
            case 3: return 1;
            case 4:
            case 5:
            case 6: return 2;
            case 7:
            case 8:
            case 9: return 3;
            case 10:
            case 11:
            case 12: return 4;
            }
        },

        // Formatting the dates
        formatDatePattern: function (oDate) {
            var oDateFormat = DateFormat.getInstance({
                pattern: "yyyy-MM-dd"
            });
            var oDate = String(oDateFormat.format(oDate));
            return oDate;
        },

        /*
       * Check if the week dates are valid based on resource request dates.
       * Add Value State for partial weeks.
       * Add Value state for week which has dates from previous/next month.
       * Value State as information for partial week and week having dates from different months.
       */
        checkValidDates: function (oWeekStartDate, oWeekEndDate, oRRStartDate, oRREndDate, oI18nedModel) {
            const oSupported = {
                valid: true,
                valueState: "None",
                valueStateText: ""
            };
            // If week dates are completely outside the resource request date we disbale the input box in UI.
            if (
                (oWeekStartDate.getTime() < oRRStartDate.getTime() && oWeekEndDate.getTime() < oRRStartDate.getTime()) ||
                (oWeekStartDate.getTime() > oRREndDate.getTime() && oWeekEndDate.getTime() > oRREndDate.getTime())) {
                oSupported.valid = false;
                return oSupported;
            }
            const bWeekStartDateinRange = this.inRange(oWeekStartDate, oRRStartDate, oRREndDate);
            const bWeekEndtDateinRange = this.inRange(oWeekEndDate, oRRStartDate, oRREndDate);
            oSupported.startDate = oWeekStartDate;
            oSupported.endDate = oWeekEndDate;

            // Add Valuestate and message for weeks which have dates from next/previous month.
            if (bWeekStartDateinRange && bWeekEndtDateinRange) {
                const weekEndDate = 3;
                // If the week start date and week end date are of different months that means the week is split over different months.
                if (oSupported.startDate.getMonth() != oSupported.endDate.getMonth()) {
                    /*
                     * If the week end date is 1st, 2nd or 3rd
                     * that means some of the dates in this CW are from the next month.
                     * Example:
                     * Start Date is 27th June 2021
                     * End   Date is  3rd july 2021
                     */
                    if (oSupported.endDate.getDate() <= weekEndDate) {
                        oSupported.valueState = "Information";
                        oSupported.valueStateText = oI18nedModel.getProperty("SPLIT_CW_NEXT");
                    } else {
                        /*
                         * If the week end date is not 1st, 2nd or 3rd
                         * that means we have some dates of previous week in this CW.
                         * Example:
                         * Start Date is 29th August    2021
                         * End   Date is  4th September 2021
                         */
                        oSupported.valueState = "Information";
                        oSupported.valueStateText = oI18nedModel.getProperty("SPLIT_CW_PREVIOUS");
                    }
                }
            }
            // Week start date is less that the resource request start date thus we use resource request start date as
            // the week start date.
            // We also add a Value State with relevant info.
            if (!bWeekStartDateinRange) {
                oSupported.startDate = oRRStartDate;
                oSupported.valueState = "Information";
                oSupported.valueStateText = oI18nedModel.getProperty("PARTIAL_WEEK_TIME_PERIOD");
            }
            // Week end date is greater that the resource request end date thus we use resource request end date as
            // the week end date.
            // We also add a Value State with relevant info.
            if (!bWeekEndtDateinRange) {
                oSupported.endDate = oRREndDate;
                oSupported.valueState = "Information";
                oSupported.valueStateText = oI18nedModel.getProperty("PARTIAL_WEEK_TIME_PERIOD");
            }
            oSupported.startDate = this.getCorrectDate(oSupported.startDate);
            oSupported.endDate = this.getCorrectDate(oSupported.endDate);

            return oSupported;
        }
    };
});
