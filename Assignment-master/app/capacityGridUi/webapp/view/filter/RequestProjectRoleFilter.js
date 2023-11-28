sap.ui.define(
	[
		"capacityGridUi/reuse/filter/Filter.controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"capacityGridUi/view/ODataEntities"
	],
	function (FilterController, Filter, FilterOperator, ODataEntities) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.RequestProjectRoleFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idProjectFilter").configure({
					config: this.oComponent.oValueHelpConfigCollection.get("project"),
					configCollection: this.oComponent.oValueHelpConfigCollection
				});
				this.byId("idProjectRoleFilter").addEventDelegate({ onsapenter: this.oParent.onFilterGo.bind(this.oParent) });
			},

			getName: function () {
				return this.oBundle.getText("PROJECT_ROLE");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.projectRoles) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.byId("idProjectRoleFilter").setSelectedKeys(oVariant.filters.projectRoles);
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "projectRoles", oUnchangedVariant.filters.projectRoles);
			},

			isValid: function () {
				return this.byId("idProjectRoleFilter").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.projectRoles.forEach((sKey) => {
					aFilters.push(
						new Filter({
							path: "resourceAssignment",
							operator: FilterOperator.Any,
							variable: "projectRole",
							condition: new Filter("projectRole/projectRole_ID", FilterOperator.EQ, sKey)
						})
					);
				});
				return aFilters;
			}
		});
	}
);
