sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseFragmentController",
		"sap/ui/comp/filterbar/FilterGroupItem",
		"sap/m/Input",
		"sap/m/Label",
		"sap/ui/table/Column",
		"sap/m/SearchField",
		"sap/ui/model/Filter",
		"capacityGridUi/reuse/valuehelp/InputVHReuseFactory"
	],
	function (BaseFragmentController, FilterGroupItem, Input, Label, Column, SearchField, Filter, InputVHReuseFactory) {
		"use strict";

		return BaseFragmentController.extend("capacityGridUi.reuse.valuehelp.ValueHelpDialog", {
			_oConfig: undefined,
			_oConfigCollection: undefined,
			_fnResolve: undefined,
			_fnReject: undefined,
			_aOkTokens: undefined,
			_oContext: undefined,
			constructor: function (oParams) {
				BaseFragmentController.prototype.constructor.call(this, {
					fragmentName: "capacityGridUi.reuse.valuehelp.ValueHelpDialog",
					fragmentId: oParams.fragmentId,
					component: oParams.component,
					dependent: oParams.dependent
				});
				this._oConfig = oParams.config;
				this._oConfigCollection = oParams.configCollection;
				this._bSupportMultiselect = oParams.supportMultiselect;
			},

			onInit: function (oFragment) {
				this.injectMembers();
				this._configureDialog(oFragment);
				this._configureFilterBar(oFragment);
				this._configureTable(oFragment);
			},

			_configureDialog: function (oDialog) {
				oDialog.setTitle(this._oConfig.entityName);
				oDialog.setKey(this._oConfig.idProperty);
				oDialog.setDescriptionKey(this._oConfig.textProperty);
				oDialog.setSupportMultiselect(this._bSupportMultiselect);
			},

			_configureFilterBar: function (oDialog) {
				let oFilterBar = oDialog.getFilterBar();
				let oSearchField = new SearchField({
					search: this._onSearch.bind(this),
					showSearchButton: true
				});
				oFilterBar.setBasicSearch(oSearchField);

				for (let i = 0; i < this._oConfig.properties.length; i++) {
					let oProperty = this._oConfig.properties[i];
					if (!oProperty.filterable) {
						continue;
					}
					let oControl;
					if (oProperty.valueHelp) {
						// must require the MultiInputWithValueHelp dynamically to avoid cyclic references to this module
						let MultiInputWithValueHelp = sap.ui.require("capacityGridUi/reuse/valuehelp/MultiInputWithValueHelp");
						oControl = new MultiInputWithValueHelp({
							id: oDialog.getId() + "-VH" + oProperty.name,
							submit: this._onSearch.bind(this)
						});
						oControl.configure({
							config: this._oConfigCollection.get(oProperty.valueHelp),
							configCollection: this._oConfigCollection
						});
					} else {
						oControl = new Input({
							showSuggestion: false,
							editable: !oProperty.defaultFilter,
							showValueHelp: false,
							submit: this._onSearch.bind(this)
						});
					}

					let oItem = new FilterGroupItem({
						name: oProperty.name,
						label: oProperty.additionalFilterLabel ? oProperty.additionalFilterLabel : oProperty.label,
						groupName: "theOneGroup",
						visibleInFilterBar: true,
						control: oControl
					});
					oFilterBar.addFilterGroupItem(oItem);
				}
			},

			_configureTable: function (oFragment) {
				oFragment.getTableAsync().then(
					function (oTable) {
						for (let i = 0; i < this._oConfig.properties.length; i++) {
							let oProperty = this._oConfig.properties[i];
							if (oProperty.filterOnly) {
								continue;
							}
							let oColumn = new Column({
								label: new Label({ text: oProperty.label }),
								tooltip: oProperty.label,
								sortProperty: oProperty.name,
								template: InputVHReuseFactory.getTextControl(this._oConfig, oProperty)
							});
							oTable.addColumn(oColumn);
						}
						oFragment.update();
					}.bind(this)
				);
			},

			open: function (oParams) {
				return new Promise(
					function (resolve, reject) {
						this._aOkTokens = null;
						this._fnResolve = resolve;
						this._fnReject = reject;
						this._oContext = oParams.oContext;
						this.getFragment().then(
							function (oFragment) {
								oFragment.setTokens([]);
								if (oParams.aTokens && oParams.aTokens.length > 0) {
									oFragment.setTokens(oParams.aTokens);
								}
								if (this._oConfig.setDialogMaxWidth) {
									this.getFragmentSync().setContentWidth("100%");
								}
								oFragment.open();
								oFragment.setBasicSearchText(oParams.sSearchTerm);
								this._setDefaultFilterValue();
								this._onSearch();
							}.bind(this)
						);
					}.bind(this)
				);
			},

			_onOk: function (oEvent) {
				this._aOkTokens = oEvent.getParameter("tokens");
				oEvent.getSource().close();
			},

			_onCancel: function (oEvent) {
				oEvent.getSource().close();
			},

			_onAfterClose: function (oEvent) {
				if (this._aOkTokens) {
					this._fnResolve(this._aOkTokens);
				} else {
					this._fnReject();
				}
			},

			_onSearch: function () {
				let oDialog = this.getFragmentSync();
				let aFilters = this._getFilterFilters(oDialog);
				let sSearchQuery = oDialog.getFilterBar().getBasicSearchValue();
				let oGroupingParameters = this._getGroupingParameters();
				let oParameter = {};
				if (this._oConfig.customFilters) {
					aFilters = aFilters.concat(this._oConfig.customFilters(this._oContext));
				}
				if (this._oConfig.customParameters) {
					oParameter = Object.assign(oParameter, this._oConfig.customParameters());
				}
				if (sSearchQuery) {
					oParameter.$search = sSearchQuery;
				}
				if (oGroupingParameters) {
					oParameter = Object.assign(oParameter, oGroupingParameters);
				}
				this._bindTable(oDialog, aFilters, oParameter);
			},

			_setDefaultFilterValue: function () {
				let aItems = this.getFragmentSync().getFilterBar().getFilterGroupItems();
				for (let i = 0; i < this._oConfig.properties.length; i++) {
					let oProperty = this._oConfig.properties[i];
					if (oProperty.defaultFilter) {
						let oItem = aItems.find((oItem) => oItem.getName() === oProperty.name);
						if (oItem) {
							oItem.getControl().setValue(oProperty.formatter(this._oContext));
						}
					}
				}
			},

			_getFilterFilters: function (oDialog) {
				let aResult = [];
				let aItems = oDialog.getFilterBar().getFilterGroupItems();
				for (let i = 0; i < aItems.length; i++) {
					let oItem = aItems[i];
					let oControl = oItem.getControl();
					let sControlName = oControl.getMetadata().getName();
					if (sControlName === "sap.m.Input") {
						let sValue = oControl.getValue();
						if (sValue && oControl.getEditable()) {
							aResult.push(
								new Filter({
									path: oItem.getName(),
									operator: "Contains", // TODO compare with standard, Equal?
									value1: sValue
								})
							);
						}
					} else {
						let aTokens = oControl.getTokens();
						for (let i = 0; i < aTokens.length; i++) {
							aResult.push(
								new Filter({
									path: oItem.getName(),
									operator: "Contains",
									value1: aTokens[i].getKey()
								})
							);
						}
					}
				}
				return aResult;
			},

			_bindTable: function (oDialog, aFilters, oParameter) {
				oDialog.getTableAsync().then(
					function (oTable) {
						oTable.bindAggregation("rows", {
							path: this._oConfig.modelPath + this._oConfig.entityPath,
							filters: aFilters,
							parameters: oParameter,
							events: {
								dataReceived: function (oResponse) {
									if (oResponse.getParameter("error")) {
										this.models.message.addServerMessage("transient", oResponse.getParameter("error"));
										this.oControllers.messageDialog.open();
									}
								}.bind(this)
							}
						});
						this.getFragment().then(function (oFragment) {
							oFragment.update();
						});
					}.bind(this)
				);
			},

			_getGroupingParameters: function () {
				let aGroupingProperties = this._oConfig.getGroupingProperties();
				if (aGroupingProperties.length === 0) {
					return null;
				} else {
					let oGroupingParameters = {
						$apply: "groupby((" + aGroupingProperties.toString() + "))"
					};
					return oGroupingParameters;
				}
			}
		});
	}
);
