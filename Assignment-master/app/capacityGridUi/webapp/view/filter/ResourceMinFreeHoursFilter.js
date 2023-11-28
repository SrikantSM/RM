sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.ResourceMinFreeHoursFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				this.oFilterModel.setProperty("/MinFreeHoursValid", true);
			},

			onChange: function (oEvent) {
				let sMinFreeHours = oEvent.getSource().getValue();
				let oRegExp = new RegExp("^[0-9]*$");
				let bValid = !sMinFreeHours || oRegExp.test(sMinFreeHours);
				this.oFilterModel.setProperty("/MinFreeHoursValid", bValid);
				if (bValid) {
					this.oControllers.variant.changeVariant("filters", "minFreeHours", sMinFreeHours);
					this.oParent.setFilterChanged(true);
				}
			},

			getName: function () {
				return this.oBundle.getText("MIN_FREE_HOURS");
			},

			applyVariant: function (oVariant) {
				if (!Object.prototype.hasOwnProperty.call(oVariant.filters, "minFreeHours")) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				this.oFilterModel.setProperty("/MinFreeHoursValid", true);
				this.byId("idMinFreeHours").setValue(oVariant.filters.minFreeHours);
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "minFreeHours", oUnchangedVariant.filters.minFreeHours);
			},

			isValid: function () {
				return this.oFilterModel.getProperty("/MinFreeHoursValid");
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				let sMinFreeHours = oVariant.filters.minFreeHours;
				if (sMinFreeHours) {
					aFilters.push(
						new Filter({
							path: "freeHours",
							operator: FilterOperator.GE,
							value1: sMinFreeHours
						})
					);
				}
				return aFilters;
			}
		});
	}
);