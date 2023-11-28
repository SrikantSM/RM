sap.ui.define(
	["capacityGridUi/reuse/filter/Filter.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
	function (FilterController, Filter, FilterOperator) {
		"use strict";

		return FilterController.extend("capacityGridUi.view.filter.ResourceUtilizationFilter", {
			onInit: function () {
				FilterController.prototype.onInit.apply(this, arguments);
				let aUtilFilterRanges = [
					{
						Key: "GT120",
						Text: "> 120%",
						Selected: false,
						State: "Error",
						Filter: new Filter({
							path: "avgUtilization",
							operator: FilterOperator.GT,
							value1: 120
						})
					},
					{
						Key: "BT111AND120",
						Text: "111% - 120%",
						Selected: false,
						State: "Warning",
						Filter: new Filter({
							path: "avgUtilization",
							operator: FilterOperator.BT,
							value1: 111,
							value2: 120
						})
					},
					{
						Key: "BT80AND110",
						Text: "80% - 110%",
						Selected: false,
						State: "Success",
						Filter: new Filter({
							path: "avgUtilization",
							operator: FilterOperator.BT,
							value1: 80,
							value2: 110
						})
					},
					{
						Key: "BT70AND79",
						Text: "70% - 79%",
						Selected: false,
						State: "Warning",
						Filter: new Filter({
							path: "avgUtilization",
							operator: FilterOperator.BT,
							value1: 70,
							value2: 79
						})
					},
					{
						Key: "LT70",
						Text: "< 70%",
						Selected: false,
						State: "Error",
						Filter: new Filter({
							path: "avgUtilization",
							operator: FilterOperator.LT,
							value1: 70
						})
					}
				];
				this.oFilterModel.setProperty("/UtilizationFilterRanges", aUtilFilterRanges);
			},

			onChange: function (oEvent) {
				this.oControllers.variant.changeVariant("filters", "utilizations", this._getUtilizationKeys());
				this.oParent.setFilterChanged(true);
			},

			_getUtilizationKeys: function () {
				let aUtilizations = [];
				let aItems = this.byId("UtilizationRangeFilterList").getItems();
				for (let i = 0; i < aItems.length; i++) {
					let oItem = aItems[i];
					let oUtilization = oItem.getBindingContext("filter").getObject();
					if (oUtilization.Selected) {
						aUtilizations.push(oUtilization.Key);
					}
				}
				return aUtilizations;
			},

			getName: function () {
				return this.oBundle.getText("UTILIZATION");
			},

			applyVariant: function (oVariant) {
				if (!oVariant.filters.utilizations) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				let aRanges = this.oFilterModel.getProperty("/UtilizationFilterRanges");
				aRanges.forEach(
					function (oItem, iIndex) {
						let bSelected = oVariant.filters.utilizations.includes(oItem.Key);
						this.oFilterModel.setProperty("/UtilizationFilterRanges/" + iIndex + "/Selected", bSelected);
					}.bind(this)
				);
			},

			resetVariant: function (oUnchangedVariant) {
				this.oControllers.variant.changeVariant("filters", "utilizations", oUnchangedVariant.filters.utilizations);
			},

			isValid: function () {
				return true;
			},

			getBindingFilters: function (oVariant) {
				let aFilters = [];
				let aUtilizationRange = this.oFilterModel.getProperty("/UtilizationFilterRanges");
				aUtilizationRange.forEach((oUtilRange) => {
					if (oUtilRange.Selected) {
						aFilters.push(oUtilRange.Filter);
					}
				});
				return aFilters;
			}
		});
	}
);