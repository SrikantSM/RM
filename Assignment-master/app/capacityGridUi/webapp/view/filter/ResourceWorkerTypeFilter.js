sap.ui.define(
	[
		"capacityGridUi/reuse/filter/Filter.controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"capacityGridUi/view/ODataEntities"
	],
	function (FilterController, Filter, FilterOperator, ODataEntities) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.ResourceWorkerTypeFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idWorkerTypeFilter").addEventDelegate({ onsapenter: this.oParent.onFilterGo.bind(this.oParent) });
			},

			getName: function () {
				return this.oBundle.getText("WORKER_TYPE");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.workerTypes) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.byId("idWorkerTypeFilter").setSelectedKeys(oVariant.filters.workerTypes);
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "workerTypes", oUnchangedVariant.filters.workerTypes);
			},

			isValid: function () {
				return this.byId("idWorkerTypeFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.workerTypes.forEach((sKey) => {
					aFilters.push(new Filter("workerType", FilterOperator.Contains, sKey));
				});
				return aFilters;
			}
		});
	}
);
