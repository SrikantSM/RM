sap.ui.define(
	["capacityGridUi/reuse/controller/BaseViewController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/ui/model/Filter"],
	function (BaseViewController, JSONModel, MessageBox, Filter) {
		"use strict";

		return BaseViewController.extend("capacityGridUi.reuse.filter.FilterBar", {
			aBindingFilters: undefined,
			oFilterControllers: undefined,

			onInit: function () {
				this.injectMembers();
				this.oFilterModel = new JSONModel();
				this.getView().setModel(this.oFilterModel, "filter");
				this.aBindingFilters = null;
				this._createFilterControllers();
			},

			_createFilterControllers: function () {
				throw new Error("not implemented");
			},

			onChange: function (oEvent, sFilterController) {
				let oFilterController = this.oFilterControllers.get(sFilterController);
				if (!oFilterController) {
					throw new Error("cannot fire onChange. no controller with key " + sFilterController);
				}
				oFilterController.onChange(oEvent);
			},

			applyVariant: function () {
				let oVariant = this.oControllers.variant.getVariant();
				if (!oVariant || !oVariant.filters) {
					throw new Error("cannot apply filters. variant is incomplete");
				}
				let oFilterPanelExpandState = oVariant.filterPanelExpandState;

				this.getView().byId("idResourceFilterPanel").setExpanded(oFilterPanelExpandState.ResourceFilterPanel);
				this.getView().byId("idUtilizationFilterPanel").setExpanded(oFilterPanelExpandState.UtilizationFilterPanel);
				this.getView().byId("idRequestFilterPanel").setExpanded(oFilterPanelExpandState.RequestFilterPanel);

				for (let [, oController] of this.oFilterControllers) {
					oController.applyVariant(oVariant);
				}
				let bValid = this._allFiltersValid();
				if (bValid) {
					this._setBindingFiltersAndInfoToolbar(oVariant);
				} else {
					MessageBox.error(this.oBundle.getText("VERTICAL_FILTER_INVALID"));
				}
				this.setFilterChanged(false);
			},

			_allFiltersValid: function () {
				let bValid = true;
				for (let [, oController] of this.oFilterControllers) {
					let bControllerValid = oController.isValid();
					if (!bControllerValid) {
						bValid = false;
						break;
					}
				}
				return bValid;
			},

			onOpenFilterbar: function () {
				for (let [, oController] of this.oFilterControllers) {
					oController.onOpenFilterBar();
				}
			},

			// for reset this controller has to trigger the data load
			// (while on applyVariant the table controller is triggering it)
			onReset: function () {
				let oUnchanged = this.oControllers.variant.getUnchangedVariant();
				for (let [, oController] of this.oFilterControllers) {
					oController.resetVariant(oUnchanged);
					oController.applyVariant(oUnchanged);
				}
				this.onFilterGo();
			},

			onMultiInputTokenUpdate: function (oEvent, sFilterArrayName) {
				let aTokens = oEvent.getParameter("tokens");
				let aFilters = this._tokensToKeys(aTokens);
				this.oControllers.variant.changeVariant("filters", sFilterArrayName, aFilters);
				this.setFilterChanged(true);
			},

			_tokensToKeys: function (aTokens) {
				let aKeys = [];
				for (let i = 0; i < aTokens.length; i++) {
					let sKey = aTokens[i].getKey();
					aKeys.push(sKey);
				}
				return aKeys;
			},

			onMultiComboBoxKeysUpdate: function (oEvent, sFilterArrayName) {
				let aSelKeys = oEvent.getSource().getSelectedKeys();
				this.oControllers.variant.changeVariant("filters", sFilterArrayName, aSelKeys);
				this.setFilterChanged(true);
			},

			setFilterChanged: function (bIsChanged) {
				this.models.app.setProperty("/IsFilterChanged", bIsChanged);
			},

			onFilterGo: function () {
				this.oControllers.table.clearSelectionInTable();
				this.oControllers.table.calculateResourceCount();
				if (this.oControllers.header.byId("idDynamicDateRange").getValueState() === "Error") {
					this.oControllers.header.byId("idDynamicDateRange").focus();
					return;
				}
				let bValid = this._allFiltersValid();
				if (bValid) {
					let oVariant = this.oControllers.variant.getVariant();
					this._setBindingFiltersAndInfoToolbar(oVariant);
					this.setFilterChanged(false);
					this.oControllers.table.fetchResources({ reset: true });
				} else {
					MessageBox.error(this.oBundle.getText("VERTICAL_FILTER_INVALID"));
				}
			},

			_setBindingFiltersAndInfoToolbar: function (oVariant) {
				this.aBindingFilters = [];
				let aInfoBarItems = [];
				for (let [, oController] of this.oFilterControllers) {
					let aFilters = oController.getBindingFilters(oVariant);
					if (aFilters && aFilters.length > 0) {
						let oFilter = new Filter({
							filters: aFilters,
							and: false
						});
						this.aBindingFilters.push(oFilter);
						let sName = oController.getName();
						aInfoBarItems.push(sName);
					}
				}
				this.models.app.setProperty("/InfoBarFilterCount", aInfoBarItems.length);
				this.models.app.setProperty("/InfoBarItems", aInfoBarItems);
			},

			getFilters: function () {
				if (this.aBindingFilters.length > 0) {
					return new Filter({
						filters: this.aBindingFilters,
						and: true
					});
				} else {
					return [];
				}
			},

			onToggleFilter: function (oEvent) {
				this.oControllers.page.toggleFilter();
			}
		});
	}
);
