sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.RequestIdFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idRequestFilter").configure({
					config: this.oComponent.oValueHelpConfigCollection.get("request"),
					configCollection: this.oComponent.oValueHelpConfigCollection
				});
			},

			getName: function () {
				return this.oBundle.getText("REQUEST");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.requests) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.addTokensToInput(this.byId("idRequestFilter"), oVariant.filters.requests);
				this.byId("idRequestFilter").reset();
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "requests", oUnchangedVariant.filters.requests);
			},

			isValid: function () {
				return this.byId("idRequestFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.requests.forEach((sKey) => {
					aFilters.push(
						new Filter({
							path: "resourceAssignment",
							operator: FilterOperator.Any,
							variable: "request",
							condition: new Filter("request/displayId", FilterOperator.EQ, sKey)
						})
					);
				});
				return aFilters;
			}
		});
	}
);