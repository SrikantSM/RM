sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.RequestReferenceObjectTypeFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idReferenceObjectTypeFilter").addEventDelegate({ onsapenter: this.oParent.onFilterGo.bind(this.oParent) });
			},

			getName: function () {
				return this.oBundle.getText("REFERENCE_OBJECT_TYPE");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.referenceObjectType) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.byId("idReferenceObjectTypeFilter").setSelectedKeys(oVariant.filters.referenceObjectType);
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "referenceObjectType", oUnchangedVariant.filters.referenceObjectType);
			},

			isValid: function () {
				return this.byId("idReferenceObjectTypeFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.referenceObjectType.forEach((sKey) => {
					aFilters.push(
						new Filter({
							path: "resourceAssignment",
							operator: FilterOperator.Any,
							variable: "refObjType",
							condition: new Filter("refObjType/referenceObjectTypeCode", FilterOperator.EQ, sKey)
						})
					);
				});
				return aFilters;
			}
		});
	}
);
