sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.RequestReferenceObjectFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idReferenceObjectFilter").configure({
					config: this.oComponent.oValueHelpConfigCollection.get("referenceObject"),
					configCollection: this.oComponent.oValueHelpConfigCollection
				});
			},

			getName: function () {
				return this.oBundle.getText("REFERENCE_OBJECT_ID");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.referenceObject) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.addTokensToInput(this.byId("idReferenceObjectFilter"), oVariant.filters.referenceObject);
				this.byId("idReferenceObjectFilter").reset();
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "referenceObject", oUnchangedVariant.filters.referenceObject);
			},

			isValid: function () {
				return this.byId("idReferenceObjectFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.referenceObject.forEach((sKey) => {
					aFilters.push(
						new Filter({
							path: "resourceAssignment",
							operator: FilterOperator.Any,
							variable: "refObject",
							condition: new Filter("refObject/referenceObjectId", FilterOperator.EQ, sKey)
						})
					);
				});
				return aFilters;
			}
		});
	}
);
