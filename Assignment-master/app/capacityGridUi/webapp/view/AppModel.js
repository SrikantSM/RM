sap.ui.define(
	["sap/ui/model/json/JSONModel", "capacityGridUi/view/Views", "sap/base/util/UriParameters"],
	function (JSONModel, Views, UriParameters) {
		"use strict";

		return JSONModel.extend("capacityGridUi.view.AppModel", {
			constructor: function (oBundle) {
				let oData = {
					IsFilterChanged: false,
					InfoBarItems: [],
					InfoBarFilterCount: 0,
					IsFilterBarOpen: false,
					IsDisplayMode: true,
					IsEditMode: false,
					columnsVisibility: "showAll",
					selectedView: undefined,
					busyIndicatorDelay: 0,
					DevMode: UriParameters.fromQuery(window.location.search).has("sap-rm-dev"),
					showTraceMessage: UriParameters.fromQuery(window.location.search).has("sap-rm-perf"),
					traceMessage: "",
					draftMsg: "",
					draftMsgVisible: false,
					IsFocusedEdit: false
				};
				JSONModel.call(this, oData);
			}
		});
	}
);
