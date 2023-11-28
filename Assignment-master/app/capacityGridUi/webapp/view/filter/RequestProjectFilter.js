sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.RequestProjectFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
			},

			getName: function () {
				return this.oBundle.getText("PROJECT");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.projects) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.addTokensToInput(this.byId("idProjectFilter"), oVariant.filters.projects);
				this.byId("idProjectFilter").reset();
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "projects", oUnchangedVariant.filters.projects);
			},

			isValid: function () {
				return this.byId("idProjectFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.projects.forEach((sKey) => {
					aFilters.push(
						new Filter({
							path: "resourceAssignment",
							operator: FilterOperator.Any,
							variable: "project",
							condition: new Filter("project/project_ID", FilterOperator.EQ, sKey)
						})
					);
				});
				return aFilters;
			}
		});
	}
);
