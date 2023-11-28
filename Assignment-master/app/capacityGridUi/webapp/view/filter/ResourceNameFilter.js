sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.ResourceNameFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idResourceNameFilter").configure({
					config: this.oComponent.oValueHelpConfigCollection.get("name"),
					configCollection: this.oComponent.oValueHelpConfigCollection
				});
			},

			getName: function () {
				return this.oBundle.getText("NAME");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.names) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.addTokensToInput(this.byId("idResourceNameFilter"), oVariant.filters.names);
				this.byId("idResourceNameFilter").reset();
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "names", oUnchangedVariant.filters.names);
			},

			onOpenFilterBar: function () {
				this.getView().byId("idResourceNameFilter").focus();
			},

			isValid: function () {
				return this.byId("idResourceNameFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.names.forEach((sKey) => {
					aFilters.push(new Filter("resourceName", FilterOperator.Contains, sKey));
				});
				return aFilters;
			}
		});
	}
);
