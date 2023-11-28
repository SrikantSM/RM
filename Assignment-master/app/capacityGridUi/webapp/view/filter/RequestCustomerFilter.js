sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.RequestCustomerFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idCustomerFilter").configure({
					config: this.oComponent.oValueHelpConfigCollection.get("customer"),
					configCollection: this.oComponent.oValueHelpConfigCollection
				});
			},

			getName: function () {
				return this.oBundle.getText("CUSTOMER");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.customers) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.addTokensToInput(this.byId("idCustomerFilter"), oVariant.filters.customers);
				this.byId("idCustomerFilter").reset();
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "customers", oUnchangedVariant.filters.customers);
			},

			isValid: function () {
				return this.byId("idCustomerFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.customers.forEach((sKey) => {
					aFilters.push(
						new Filter({
							path: "resourceAssignment",
							operator: FilterOperator.Any,
							variable: "customer",
							condition: new Filter("customer/customer_ID", FilterOperator.EQ, sKey)
						})
					);
				});
				return aFilters;
			}
		});
	}
);
