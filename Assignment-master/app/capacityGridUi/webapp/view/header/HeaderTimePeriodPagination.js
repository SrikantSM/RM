sap.ui.define(["capacityGridUi/reuse/controller/BaseViewChildController", "capacityGridUi/view/Views"], function (BaseViewChildController, Views) {
	"use strict";

	return BaseViewChildController.extend("capacityGridUi.view.header.HeaderTimePeriodPagination", {
		onInit: function () {
			this.injectMembers();
		},

		showNext: function () {
			let sView = this.models.app.getProperty("/selectedView");
			let oDates = {};

			switch (sView) {
				case Views.DAILY:
					oDates = this._getNextDays();
					break;
				case Views.WEEKLY:
					oDates = this._getNextWeeks();
					break;
				case Views.MONTHLY:
					oDates = this._getNextMonths();
					break;
				default:
					throw new Error("unhandled view " + sView);
			}
			this._updateModelsForPagination(oDates);
		},

		showPrevious: function () {
			let sView = this.models.app.getProperty("/selectedView");
			let oDates = {};

			switch (sView) {
				case Views.DAILY:
					oDates = this._getPrevDays();
					break;
				case Views.WEEKLY:
					oDates = this._getPrevWeeks();
					break;
				case Views.MONTHLY:
					oDates = this._getPrevMonths();
					break;
				default:
					throw new Error("unhandled view " + sView);
			}

			this._updateModelsForPagination(oDates);
		},

		_getNextMonths: function () {
			let oCurrentToDate = new Date(this.models.date.getProperty("/sEndDate"));
			let oNextFromDate = this._addDaysToDate(oCurrentToDate, 1);
			let oNextToDate = this._addMonthsToDate(oNextFromDate, this._getMonthlyPagination());
			return { oNextFromDate, oNextToDate };
		},

		_getNextWeeks: function () {
			let oCurrentToDate = new Date(this.models.date.getProperty("/sEndDate"));
			let oNextFromDate = this._addDaysToDate(oCurrentToDate, 1);
			let oNextToDate = this._addWeeksToDate(oNextFromDate, this._getWeeklyPagination());
			return { oNextFromDate, oNextToDate };
		},

		_getNextDays: function () {
			let oCurrentToDate = new Date(this.models.date.getProperty("/sEndDate"));
			let oNextFromDate = this._addDaysToDate(oCurrentToDate, 1);
			let oNextToDate = this._addDaysToDate(oNextFromDate, this._getDailyPagination());
			return { oNextFromDate, oNextToDate };
		},

		_getPrevMonths: function () {
			let oCurrentFromDate = new Date(this.models.date.getProperty("/sFromDate"));
			let oNextToDate = this._subtractDaysFromDate(oCurrentFromDate, 1);
			let oNextFromDate = this._subtractMonthsFromDate(oNextToDate, this._getMonthlyPagination());
			return { oNextFromDate, oNextToDate };
		},

		_getPrevWeeks: function () {
			let oCurrentFromDate = new Date(this.models.date.getProperty("/sFromDate"));
			let oNextToDate = this._subtractDaysFromDate(oCurrentFromDate, 1);
			let oNextFromDate = this._subtractWeeksFromDate(oNextToDate, this._getWeeklyPagination());
			return { oNextFromDate, oNextToDate };
		},

		_getPrevDays: function () {
			let oCurrentFromDate = new Date(this.models.date.getProperty("/sFromDate"));
			let oNextToDate = this._subtractDaysFromDate(oCurrentFromDate, 1);
			let oNextFromDate = this._subtractDaysFromDate(oNextToDate, this._getDailyPagination());
			return { oNextFromDate, oNextToDate };
		},

		_getDailyPagination: function () {
			return this._getDaysBetweenDates(this.models.date.getProperty("/sFromDate"), this.models.date.getProperty("/sEndDate"));
		},

		_getWeeklyPagination: function () {
			return this._getWeeksBetweenDates(this.models.date.getProperty("/sFromDate"), this.models.date.getProperty("/sEndDate"));
		},

		_getMonthlyPagination: function () {
			return this._getMonthsBetweenDates(this.models.date.getProperty("/sFromDate"), this.models.date.getProperty("/sEndDate"));
		},

		_getWeeksBetweenDates: function (oFromDate, oEndDate) {
			const msInWeek = 1000 * 60 * 60 * 24 * 7;
			return Math.round(Math.abs(oEndDate - oFromDate) / msInWeek);
		},

		_getDaysBetweenDates: function (oFromDate, oEndDate) {
			// To calculate the time difference of two dates
			let iTimeDifference = oEndDate.getTime() - oFromDate.getTime();
			// To calculate the no. of days between two dates
			return iTimeDifference / (1000 * 3600 * 24);
		},

		_getMonthsBetweenDates: function (oFromDate, oEndDate) {
			return oEndDate.getMonth() - oFromDate.getMonth() + 12 * (oEndDate.getFullYear() - oFromDate.getFullYear());
		},

		_getLastDayOfMonth: function (oEndDate) {
			let oDate = new Date(oEndDate);
			let oMonth = oDate.getMonth();
			let oYear = oDate.getFullYear();
			return new Date(oYear, oMonth + 1, 0);
		},

		_addMonthsToDate: function (oDate, iMonth) {
			let oNextToDate = new Date(oDate);
			oNextToDate.setMonth(oNextToDate.getMonth() + iMonth);
			oNextToDate = this._getLastDayOfMonth(oNextToDate);
			return oNextToDate;
		},

		_addDaysToDate: function (oDate, iDays) {
			let oNextToDate = new Date(oDate);
			oNextToDate.setDate(oNextToDate.getDate() + iDays);
			return oNextToDate;
		},

		_addWeeksToDate: function (oDate, iWeek) {
			let oNextToDate = new Date(oDate);
			oNextToDate.setDate(oNextToDate.getDate() + iWeek * 7 - 1);
			return oNextToDate;
		},

		_subtractMonthsFromDate: function (oDate, iMonth) {
			let oNextToDate = new Date(oDate);
			oNextToDate.setDate(1);
			oNextToDate.setMonth(oNextToDate.getMonth() - iMonth);
			return oNextToDate;
		},

		_subtractDaysFromDate: function (oDate, iDays) {
			let oNextToDate = new Date(oDate);
			oNextToDate.setDate(oNextToDate.getDate() - iDays);
			return oNextToDate;
		},

		_subtractWeeksFromDate: function (oDate, iWeek) {
			let oNextToDate = new Date(oDate);
			oNextToDate.setDate(oNextToDate.getDate() - iWeek * 7 + 1);
			return oNextToDate;
		},

		_updateModelsForPagination: function (oDates) {
			let oDate = {
				operator: "CustomRange",
				values: [oDates.oNextFromDate, oDates.oNextToDate]
			};
			this.models.date.setProperty("/dateValue", oDate);
			this.models.date.setProperty("/sFromDate", oDates.oNextFromDate);
			this.models.date.setProperty("/sEndDate", oDates.oNextToDate);

			this.oControllers.header.fetchKPI();
			this.oControllers.table.updateColumns({ leadingColumns: false, timeColumns: true });
			this.oControllers.table.fetchResources({ reset: true });
			this.oControllers.header.changeVariantTimePeriod();
		}
	});
});
