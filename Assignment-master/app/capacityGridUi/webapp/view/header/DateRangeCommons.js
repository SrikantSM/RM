sap.ui.define(["capacityGridUi/reuse/DateUtils", "capacityGridUi/view/Views"], function (Utils, Views) {
	"use strict";
	return {
		validate: function (sView, startingDate, endingDate, oBundle) {
			switch (sView) {
				case Views.DAILY:
					return this._validateDaily(startingDate, endingDate, oBundle);
				case Views.WEEKLY:
					return this._validateWeekly(startingDate, endingDate, oBundle);
				case Views.MONTHLY:
					return this._validateMonthly(startingDate, endingDate, oBundle);
				default:
					throw new Error("unhandled view " + sView);
			}
		},

		_validateDaily: function (startingDate, endingDate, oBundle) {
			let aSwapedDates = this.swapDates(startingDate, endingDate);
			let startDate = aSwapedDates[0];
			let endDate = aSwapedDates[1];
			let diffInTime = endDate.getTime() - startDate.getTime();
			let diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
			if (diffInDays < 56) {
				return { isValid: true };
			}
			return { isValid: false, message: oBundle.getText("TIME_FRAME_NOT_IN_RANGE_DAY") };
		},

		_validateMonthly: function (startingDate, endingDate, oBundle) {
			let aSwapedDates = this.swapDates(startingDate, endingDate);
			let startDate = aSwapedDates[0];
			let endDate = aSwapedDates[1];
			let monthDiff = this._getMonthDiff(startDate, endDate);
			return monthDiff <= 23 ? { isValid: true } : { isValid: false, message: oBundle.getText("TIME_FRAME_NOT_IN_RANGE_MONTH") };
		},

		_getMonthDiff: function (startDate, endDate) {
			let startYear = startDate.getFullYear();
			let february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
			let daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			let yearDiff = endDate.getFullYear() - startYear;
			let monthDiff = endDate.getMonth() - startDate.getMonth();
			if (monthDiff < 0) {
				yearDiff--;
				monthDiff += 12;
			}
			let dayDiff = endDate.getDate() - startDate.getDate();
			if (dayDiff < 0) {
				if (monthDiff > 0) {
					monthDiff--;
				} else {
					yearDiff--;
					monthDiff = 11;
				}
				dayDiff += daysInMonth[startDate.getMonth()];
			}
			if (yearDiff > 0) {
				monthDiff = yearDiff * 12 + monthDiff;
			}
			return monthDiff;
		},

		_validateWeekly: function (startingDate, endingDate, oBundle) {
			let aSwapedDates = this.swapDates(new Date(startingDate), new Date(endingDate));
			let startDate = aSwapedDates[0];
			let endDate = aSwapedDates[1];
			let diffInTime = endDate.getTime() - startDate.getTime();
			let diffInDays = diffInTime / (1000 * 3600 * 24);
			if (diffInDays <= 182) {
				return { isValid: true };
			}
			return { isValid: false, message: oBundle.getText("TIME_FRAME_NOT_IN_RANGE_WEEK") };
		},

		defaultValueForXDateRanges: function (sView) {
			switch (sView) {
				case Views.MONTHLY:
					return 6;
				case Views.WEEKLY:
					return 8;
				case Views.DAILY:
					return 28;
				default:
					throw new Error("unhandled view " + sView);
			}
		},

		getNextXRangesByView: function (sView, iXval) {
			let oNewDate = new Date();
			if (sView === Views.MONTHLY) {
				let oStartDate = new Date(oNewDate.getFullYear(), oNewDate.getMonth());
				let oEndDate = new Date(oNewDate.getFullYear(), oNewDate.getMonth() + iXval);
				oEndDate.setDate(Utils.getDaysInMonth(oEndDate.getFullYear(), oEndDate.getMonth()));
				return [oStartDate, oEndDate];
			} else if (sView === Views.WEEKLY) {
				let oToday = new Date(oNewDate.getFullYear(), oNewDate.getMonth(), oNewDate.getDate());
				let sCurrentCWNo = Utils.getWeek(oToday);
				let oCurrentWeekStartDate = Utils.getWeekDateRangeInDates(sCurrentCWNo, oToday.getFullYear()).cwStartDate;
				let oNextXWeekEndDate = Utils.getWeekDateRangeInDates(sCurrentCWNo + iXval, oToday.getFullYear().toString()).cwEndDate;
				return [oCurrentWeekStartDate, oNextXWeekEndDate];
			} else if (sView === Views.DAILY) {
				let oStartDate = new Date(oNewDate.getFullYear(), oNewDate.getMonth(), oNewDate.getDate());
				let oEndDate = new Date(oNewDate.getFullYear(), oNewDate.getMonth(), oNewDate.getDate() + iXval);
				return [oStartDate, oEndDate];
			} else {
				throw Error("unhandled view " + sView);
			}
		},

		getStepInputDesc: function (sView, oBundle) {
			switch (sView) {
				case Views.MONTHLY:
					return oBundle.getText("DYNAMIC_DATE_MONTHS");
				case Views.WEEKLY:
					return oBundle.getText("DYNAMIC_DATE_WEEKS");
				case Views.DAILY:
					return oBundle.getText("DYNAMIC_DATE_DAYS");
				default:
					throw new Error("unhandled view " + sView);
			}
		},
		swapDates: function (startDate, endDate) {
			if (startDate > endDate) {
				let swap = startDate;
				startDate = endDate;
				endDate = swap;
			}
			return [startDate, endDate];
		}
	};
});
