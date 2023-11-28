sap.ui.define(
	[
		"sap/m/Input",
		"sap/m/Column",
		"sap/m/ColumnListItem",
		"sap/m/Label",
		"sap/ui/core/CustomData",
		"sap/ui/core/Item",
		"capacityGridUi/reuse/valuehelp/ValueHelpDialog.controller",
		"capacityGridUi/reuse/valuehelp/InputVHReuseFactory",
		"capacityGridUi/reuse/controller/getController"
	],
	function (Input, Column, ColumnListItem, Label, CustomData, Item, ValueHelpDialogController, InputVHReuseFactory, getController) {
		"use strict";

		return Input.extend("capacityGridUi.reuse.valuehelp.InputWithValueHelp", {
			renderer: {},

			metadata: {
				properties: {
					config: { type: "any", group: "Misc", defaultValue: null },
					configCollection: { type: "any", group: "Misc", defaultValue: null },
					valueHelpDialogController: { type: "any", group: "Misc", defaultValue: null }
				},
				events: {
					selectKey: {}
				}
			},

			_oValueHelpDialogController: undefined,

			init: function () {
				Input.prototype.init.apply(this, arguments);
				this.setTextFormatMode("Value");
				this.setShowSuggestion(true);
				this.setShowValueHelp(true);
				this.attachEvent("valueHelpRequest", this._onValueHelpRequest, this);
				this.attachEvent("suggestionItemSelected", this._onSuggestionItemSelected, this);
				this.attachEvent("suggest", this._onValueHelpSuggestUpdated, this);
				this.setSuggestionRowValidator(this._suggestionRowValidator.bind(this));
			},

			_suggestionRowValidator: function (oColumnListItem) {
				return new Item({
					key: oColumnListItem.data("id"),
					text: oColumnListItem.data("text")
				});
			},

			_onSuggestionItemSelected: function (oEvt) {
				let oSelectedItem = oEvt.getParameter("selectedRow");
				if (oSelectedItem) {
					let sID = oSelectedItem.data("id");
					let sText = oSelectedItem.data("text");
					this.fireEvent("selectKey", { id: sID, text: sText });
				} else {
					this.fireEvent("selectKey", { id: null, text: null });
				}
			},

			_onValueHelpRequest: function (oEvt) {
				let sSearchTerm = oEvt.getParameter("fromSuggestions") ? oEvt.getSource().getValue() : "";
				let oDialogController = this._getValueHelpDialogController();
				let aTokens = [];
				let oContext = oEvt.getSource().getBindingContext();
				let oParams = {
					aTokens: aTokens,
					sSearchTerm: sSearchTerm,
					oContext: oContext
				};
				oDialogController.open(oParams).then(
					function (aNewTokens) {
						let oFirstAndOnlyToken = aNewTokens[0];
						let sID = oFirstAndOnlyToken.getKey();
						let sText = oFirstAndOnlyToken.getText();
						let oSelectedItem = new Item({
							key: sID,
							text: sText
						});
						this.setSelectedItem(oSelectedItem);
						this.fireEvent("selectKey", { id: sID, text: sText });
					}.bind(this)
				);
			},

			configure: function (oParams) {
				this.setConfig(oParams.config);
				this.setConfigCollection(oParams.configCollection);
				this.setValueHelpDialogController(oParams.valueHelpDialogController);
				this._configureSuggestionColumns();
				this.setMaxSuggestionWidth(oParams.config.properties.length * 10 + "rem");
			},

			_configureSuggestionColumns: function () {
				for (let i = 0; i < this.getConfig().properties.length; i++) {
					let oProperty = this.getConfig().properties[i];
					if (oProperty.filterOnly) {
						continue;
					}
					let oColumn = new Column({
						header: new Label({
							text: oProperty.label
						})
					});
					this.addSuggestionColumn(oColumn);
				}
			},

			_getValueHelpDialogController: function () {
				let oPredefinedDialogController = this.getValueHelpDialogController();
				if (oPredefinedDialogController) {
					return oPredefinedDialogController;
				} else if (!this._oValueHelpDialogController) {
					let oComponent = {};
					if (this.getController) {
						oComponent = this.getController().getOwnerComponent();
					} else {
						oComponent = getController.apply(this, arguments).getOwnerComponent();
					}
					this._oValueHelpDialogController = new ValueHelpDialogController({
						fragmentId: this.getId() + "-VH",
						component: oComponent,
						dependent: this,
						config: this.getConfig(),
						configCollection: this.getConfigCollection(),
						supportMultiselect: false
					});
				}
				return this._oValueHelpDialogController;
			},

			_onValueHelpSuggestUpdated: function (oEvent) {
				let sTerm = oEvent.getParameter("suggestValue");
				let oParameters = {
					$search: sTerm
				};
				if (this.getConfig().customParameters) {
					oParameters = Object.assign(oParameters, this.getConfig().customParameters());
				}
				let aFilters = [];
				if (this.getConfig().customFilters) {
					let oContext = oEvent.getSource().getBindingContext();
					aFilters = this.getConfig().customFilters(oContext);
				}
				this.bindAggregation("suggestionRows", {
					path: this.getConfig().modelPath + this.getConfig().entityPath,
					parameters: oParameters,
					filters: aFilters,
					template: this._getSuggestionRowTemplate()
				});
			},

			_getSuggestionRowTemplate: function () {
				let oColumnListItem = new ColumnListItem({
					customData: [
						new CustomData({
							key: "id",
							value: "{" + this.getConfig().modelPath + this.getConfig().idProperty + "}"
						}),
						new CustomData({
							key: "text",
							value: "{" + this.getConfig().modelPath + this.getConfig().textProperty + "}"
						})
					]
				});
				for (let i = 0; i < this.getConfig().properties.length; i++) {
					let oProperty = this.getConfig().properties[i];
					if (oProperty.filterOnly) {
						continue;
					}
					let oText = InputVHReuseFactory.getTextControl(this.getConfig(), oProperty);
					oColumnListItem.addCell(oText);
				}
				return oColumnListItem;
			},

			reset: function () {
				this.setValue("");
			}
		});
	}
);
