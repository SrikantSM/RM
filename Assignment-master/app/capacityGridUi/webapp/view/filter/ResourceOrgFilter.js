sap.ui.define(
	[
		"capacityGridUi/reuse/filter/Filter.controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"capacityGridUi/reuse/formatters/DateFormatter",
		"capacityGridUi/view/ODataEntities"
	],
	function (FilterController, Filter, FilterOperator, DateFormatter, ODataEntities) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.ResourceOrgFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.byId("idResourceOrg").addEventDelegate({ onsapenter: this.oParent.onFilterGo.bind(this.oParent) });
			},

			getName: function () {
				return this.oBundle.getText("RESOURCE_ORGANIZATION");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.resourceOrgs) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.byId("idResourceOrg").setSelectedKeys(oVariant.filters.resourceOrgs);
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "resourceOrgs", oUnchangedVariant.filters.resourceOrgs);
			},

			isValid: function () {
				return this.byId("idResourceOrg").getValueState() === "None";
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				oVariant.filters.resourceOrgs.forEach((sKey) => {
					aFilters.push(new Filter("resourceOrganizationIdForDisplay", FilterOperator.Contains, sKey));
				});
				return aFilters;
			}
		});
	}
);
