sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseViewController",
		"capacityGridUi/reuse/formatters/DateFormatter",
		"capacityGridUi/reuse/formatters/uilizationPercentStateFormatter",
		"capacityGridUi/view/header/HeaderModel",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/header/HeaderTimePeriodPagination",
		"capacityGridUi/view/header/DynamicDateOptions/NextXRange",
		"capacityGridUi/view/header/DynamicDateOptions/LastXRange",
		"capacityGridUi/view/header/DynamicDateOptions/XYRange",
		"capacityGridUi/view/header/DynamicDateOptions/CustomRange",
		"capacityGridUi/view/header/DateRangeCommons",
		"sap/base/util/deepClone"
	],
	function (
		BaseViewController,
		DateFormatter,
		formatUtilizationPercentState,
		HeaderModel,
		ODataEntities,
		Views,
		HeaderTimePeriodPagination,
		NextXRange,
		LastXRange,
		XYRange,
		CustomRange,
		DateRangeCommons,
		deepClone
	) {
		"use strict";

		return BaseViewController.extend("capacityGridUi.view.header.Header", {
			formatUtilizationPercentState: formatUtilizationPercentState,
			oTimePeriodPagination: undefined,

			onInit: function () {
				this.injectMembers();
				this.oComponent.oControllers.add("header", this);
				this.oHeaderModel = new HeaderModel(this.oBundle);
				this.getView().setModel(this.oHeaderModel, "header");
				this.oTimePeriodPagination = new HeaderTimePeriodPagination(this);
				this._initializeDynamicDateRangeOptions();
			},

			_initializeDynamicDateRangeOptions: function () {
				let oNextXRange = new NextXRange({
					key: "NextXRange"
				});
				let oLastXRange = new LastXRange({
					key: "LastXRange"
				});
				let oXYRange = new XYRange({
					key: "XYRange",
					valueTypes: ["int", "int"]
				});
				let oCustomRange = new CustomRange({
					key: "CustomRange"
				});
				let oDynamicDateRange = this.getView().byId("idDynamicDateRange");
				oDynamicDateRange.addAggregation("customOptions", oNextXRange);
				oDynamicDateRange.addAggregation("customOptions", oLastXRange);
				oDynamicDateRange.addAggregation("customOptions", oXYRange);
				oDynamicDateRange.addAggregation("customOptions", oCustomRange);
			},

			applyVariant: function (oVariant) {
				let oDateRangeControl = this.getView().byId("idDynamicDateRange");
				this.models.app.setProperty("/selectedView", oVariant.view);
				let oTimePeriod = deepClone(oVariant.timePeriod);
				if (oTimePeriod.operator === "CustomRange") {
					oTimePeriod.values = [new Date(oTimePeriod.values[0]), new Date(oTimePeriod.values[1])];
				}
				this.models.date.setProperty("/dateValue", oTimePeriod);
				let aDateRanges = oDateRangeControl.toDates(oTimePeriod);
				this.models.date.setProperty("/sFromDate", aDateRanges[0]);
				this.models.date.setProperty("/sEndDate", aDateRanges[1]);
				oDateRangeControl.setValueState("None");
				oDateRangeControl.setValueStateText("");
			},

			onDynamicDateRangeChanage: function (oEvent) {
				this.models.date.setProperty("/sFromDate", null);
				this.models.date.setProperty("/sEndDate", null);
				if (oEvent.getParameter("value") && oEvent.getParameter("valid")) {
					let sView = this.models.app.getData().selectedView;
					let aDateRanges = oEvent.getSource().toDates(oEvent.getParameter("value"));
					let oDateRangeValidation = DateRangeCommons.validate(sView, aDateRanges[0], aDateRanges[1], this.oBundle);
					if (oDateRangeValidation.isValid) {
						oEvent.getSource().setValueState("None");
						oEvent.getSource().setValueStateText("");
						this.changeVariantTimePeriod();
						this.models.date.setProperty("/sFromDate", aDateRanges[0]);
						this.models.date.setProperty("/sEndDate", aDateRanges[1]);
						this.oControllers.header.fetchKPI();
						this.oControllers.table.updateColumns({ leadingColumns: false, timeColumns: true });
						this.oControllers.table.fetchResources({ reset: true });
					} else {
						oEvent.getSource().setValueState("Error");
						oEvent.getSource().setValueStateText(oDateRangeValidation.message);
					}
				} else {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText(this.oBundle.getText("VALIDATION_EMPTY_DATE_RANGE"));
				}
			},

			onViewSelectChange: function (oEvent) {
				let sView = oEvent.getParameter("item").getKey();
				this._setDefaultDateValue(sView);
				this.oControllers.variant.changeVariant("view", null, sView);
				this.changeVariantTimePeriod();
				this.oControllers.header.fetchKPI();
				this.oControllers.table.updateColumns({ leadingColumns: true, timeColumns: true });
				this.oControllers.table.fetchResources({ reset: true });
			},

			_setDefaultDateValue: function (sView) {
				let oDynamicDateRangeControl = this.getView().byId("idDynamicDateRange");
				let oDefaultDate = {
					operator: "NextXRange",
					values: [DateRangeCommons.defaultValueForXDateRanges(sView)]
				};
				this.models.date.setProperty("/dateValue", oDefaultDate);
				let aDateRanges = oDynamicDateRangeControl.toDates(oDefaultDate);
				this.models.date.setProperty("/sFromDate", aDateRanges[0]);
				this.models.date.setProperty("/sEndDate", aDateRanges[1]);
				oDynamicDateRangeControl.setValueState("None");
				oDynamicDateRangeControl.setValueStateText("");
			},

			changeVariantTimePeriod: function () {
				let oTimePeriod = deepClone(this.models.date.getProperty("/dateValue"));
				if (oTimePeriod.operator === "CustomRange") {
					oTimePeriod.values[(oTimePeriod.values[0].toISOString(), oTimePeriod.values[1].toISOString())];
				}
				this.oControllers.variant.changeVariant("timePeriod", null, oTimePeriod);
			},

			fetchKPI: function () {
				this.oHeaderModel.setProperty("/kpisBusy", true);
				let oBinding = this.models.oDataV4.bindList("/" + ODataEntities.KPI_ENTITY_SET, undefined, undefined, undefined, {
					"sap-valid-from": DateFormatter.dateToEdm(this.models.date.getProperty("/sFromDate")),
					"sap-valid-to": DateFormatter.dateToEdm(this.models.date.getProperty("/sEndDate"))
				});
				oBinding.requestContexts(0, 10000, "$auto." + "tableData").then(
					(aContexts) => {
						this._storeKPI(aContexts);
						this.oHeaderModel.setProperty("/kpisBusy", false);
					},
					(oError) => {
						this.models.message.addServerMessage("transient", oError);
						this.oControllers.messageDialog.open();
					}
				);
			},

			_storeKPI: function (aContexts) {
				let oKPI = aContexts.length > 0 ? aContexts[0].getObject() : null;
				this.oHeaderModel.setProperty("/avgUtilization", oKPI ? oKPI.totalAvgUtilPercentage : 0);
				this.oHeaderModel.setProperty("/totalResources", oKPI ? oKPI.resourceCount : 0);
				this.oHeaderModel.setProperty("/freeResources", oKPI ? oKPI.freeResourcesCount : 0);
				this.oHeaderModel.setProperty("/overbookedResources", oKPI ? oKPI.overstaffedResourcesCount : 0);
			},

			onShowNext: function () {
				this.oTimePeriodPagination.showNext();
			},

			onShowPrevious: function () {
				this.oTimePeriodPagination.showPrevious();
			}
		});
	}
);
