sap.ui.define(
	["sap/ui/model/json/JSONModel", "capacityGridUi/view/Views", "sap/base/util/UriParameters"],
	function (JSONModel, Views, UriParameters) {
		"use strict";

		return JSONModel.extend("capacityGridUi.view.header.HeaderModel", {
			constructor: function (oBundle) {
				let oData = {
					kpisBusy: false,
					avgUtilization: null,
					totalResources: null,
					freeResources: null,
					overbookedResources: null,
					Views: [
						{
							Key: Views.MONTHLY,
							Text: oBundle.getText("MONTHS")
						},
						{
							Key: Views.WEEKLY,
							Text: oBundle.getText("WEEKS")
						},
						{
							Key: Views.DAILY,
							Text: oBundle.getText("DAYS")
						}
					]
				};
				JSONModel.call(this, oData);
			}
		});
	}
);
