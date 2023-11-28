sap.ui.define(["sap/ui/model/json/JSONModel", "capacityGridUi/view/Views", "sap/ui/core/format/DateFormat"], function (JSONModel, Views, DateFormat) {
	"use strict";

	return JSONModel.extend("capacityGridUi.view.header.DateModel", {
		constructor: function (oBundle) {
			this.oBundle = oBundle;
			JSONModel.call(this, {});
		},

		getDisplayTimePeriod: function (sView) {
			let oStartDate = this.getProperty("/sFromDate");
			let oEndDate = this.getProperty("/sEndDate");
			if (sView === Views.MONTHLY) {
				// END DATE IS LAST DAY OF SELECTED MONTH
				let oDate = new Date(oEndDate);
				// GET THE MONTH AND YEAR OF THE SELECTED DATE.
				let oMonth = oDate.getMonth();
				let oYear = oDate.getFullYear();
				oEndDate = new Date(oYear, oMonth + 1, 0);
			}
			let oDateFormat = DateFormat.getInstance({
				pattern: "yyyy-MM-dd"
			});
			let oDateRange = {
				oDateValidTo: String(oDateFormat.format(oEndDate)),
				oDateValidFrom: String(oDateFormat.format(oStartDate))
			};
			return oDateRange;
		}
	});
});
