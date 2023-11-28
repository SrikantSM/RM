sap.ui.define([], function () {
	"use strict";

	return {
		isLeapYear: function (year) {
			return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
		},

		getDaysInMonth: function (year, month) {
			return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},

		getWeekDateRangeInDates: function (sWeek, sYear) {
			let oDate = new Date(sYear, 0, 1 + (sWeek - 1) * 7);
			let dow = oDate.getDay();
			let ISOweekStart = oDate;
			if (dow <= 4) ISOweekStart.setDate(oDate.getDate() - oDate.getDay() + 1);
			else ISOweekStart.setDate(oDate.getDate() + 8 - oDate.getDay());

			let ISOweekEnd = new Date(ISOweekStart);
			ISOweekEnd.setDate(ISOweekEnd.getDate() + 6);

			return { cwStartDate: ISOweekStart, cwEndDate: ISOweekEnd };
		},

		getCalendarWeek: function (sDate) {
			let oDate = new Date(sDate.substr(0, 4), sDate.substr(4, 2) - 1, sDate.substr(6, 2));
			let onejan = new Date(oDate.getFullYear(), 0, 1);
			let today = new Date();
			let calendarWeek = Math.ceil(((oDate - onejan) / 86400000 + onejan.getDay()) / 7);
			return oDate.getFullYear() >= today.getFullYear() ? calendarWeek : calendarWeek - 1;
		},

		getWeek: function (oDate) {
			let onejan = new Date(oDate.getFullYear(), 0, 1);
			let calendarWeek = Math.ceil(((oDate - onejan) / 86400000 + onejan.getDay()) / 7);
			let today = new Date();
			return oDate.getFullYear() >= today.getFullYear() ? calendarWeek : calendarWeek - 1;
		},

		getCalendarWeekS: function (oDate) {
			let onejan = new Date(oDate.getFullYear(), 0, 1);
			let calendarWeek = Math.ceil(((oDate - onejan) / 86400000 + onejan.getDay() - 1) / 7);
			let today = new Date();
			return oDate.getFullYear() >= today.getFullYear() ? calendarWeek : calendarWeek - 1;
		}
	};
});
