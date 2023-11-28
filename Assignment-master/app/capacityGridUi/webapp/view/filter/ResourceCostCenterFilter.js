sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.ResourceCostCenterFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idResourceCostCenterFilter").configure({
					config: this.oComponent.oValueHelpConfigCollection.get("costCenter"),
					configCollection: this.oComponent.oValueHelpConfigCollection
				});
			},

			getName: function () {
				return this.oBundle.getText("COST_CENTER");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.costCenters) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.addTokensToInput(this.byId("idResourceCostCenterFilter"), oVariant.filters.costCenters);
				this.byId("idResourceCostCenterFilter").reset();
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "costCenters", oUnchangedVariant.filters.costCenters);
			},

			isValid: function () {
				return this.byId("idResourceCostCenterFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.costCenters.forEach((sKey) => {
					aFilters.push(new Filter("costCenter", FilterOperator.Contains, sKey));
				});
				return aFilters;
			}
		});
	}
);
