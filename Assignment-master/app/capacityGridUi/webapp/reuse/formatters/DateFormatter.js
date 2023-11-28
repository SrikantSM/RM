sap.ui.define(["capacityGridUi/view/Views", "sap/ui/core/format/DateFormat"], function (Views, DateFormat) {
	"use strict";

	// getDateInstance will be determining the current locale
	let oFormatMonth = DateFormat.getDateInstance({ format: "MMM" });
	let oFormatWeekDay = DateFormat.getDateInstance({ format: "EEE" });
	let oFormatYearMonth = DateFormat.getDateInstance({ format: "yyyyMMM" });
	let oFormatDate = DateFormat.getDateInstance({ style: "medium" });
	let oFormatEdm = DateFormat.getDateInstance({ pattern: "yyyy-MM-ddT00:00:00" });
	let oFormatMonthDay = DateFormat.getDateInstance({ format: "MMMdd" });

	return {
		rangeByView: function (sView, oFromDate, oToDate) {
			if (sView === Views.MONTHLY) {
				return this.rangeByYearMonth(oFromDate, oToDate);
			} else if (sView === Views.DAILY || sView === Views.WEEKLY) {
				return this.rangeByDay(oFromDate, oToDate);
			} else {
				throw Error("unknown view " + sView);
			}
		},

		rangeByDay: function (oFromDate, oToDate) {
			return this.dateByDay(oFromDate) + " - " + this.dateByDay(oToDate);
		},

		rangeByYearMonth: function (oFromDate, oToDate) {
			return this.dateByYearMonth(oFromDate) + " - " + this.dateByYearMonth(oToDate);
		},

		rangeByMonthDay: function (oFromDate, oToDate) {
			return this.dateByMonthDay(oFromDate) + " - " + this.dateByMonthDay(oToDate);
		},

		dateToEdm: function (oDate) {
			return oFormatEdm.format(oDate) + "Z";
		},

		dateByDay: function (oDate) {
			let sDate = oFormatDate.format(oDate);
			return sDate;
		},

		dateByYearMonth: function (oDate) {
			let sDate = oFormatYearMonth.format(oDate);
			return sDate;
		},

		dateByMonth: function (oDate) {
			let sDate = oFormatMonth.format(oDate);
			return sDate;
		},

		dateByMonthDay: function (oDate) {
			let sDate = oFormatMonthDay.format(oDate);
			return sDate;
		},

		dateByWeekDay: function (oDate) {
			let sDate = oFormatWeekDay.format(oDate);
			return sDate;
		}
	};
});
