sap.ui.define(
	[
		"sap/m/MultiInput",
		"sap/m/Token",
		"sap/m/Column",
		"sap/m/ColumnListItem",
		"sap/m/Label",
		"capacityGridUi/reuse/valuehelp/ValueHelpDialog.controller",
		"capacityGridUi/reuse/valuehelp/InputVHReuseFactory",
		"capacityGridUi/reuse/controller/getController"
	],
	function (MultiInput, Token, Column, ColumnListItem, Label, ValueHelpDialogController, InputVHReuseFactory, getController) {
		"use strict";

		return MultiInput.extend("capacityGridUi.reuse.valuehelp.MultiInputWithValueHelp", {
			renderer: {},

			metadata: {
				properties: {
					config: { type: "any", group: "Misc", defaultValue: null },
					configCollection: { type: "any", group: "Misc", defaultValue: null }
				},
				events: {
					tokenUpdateAfterChange: {},
					submitFixed: {}
				}
			},

			_oValueHelpDialogController: undefined,

			init: function () {
				MultiInput.prototype.init.apply(this, arguments);
				this.attachEvent("valueHelpRequest", this._onValueHelpRequest, this);
				this.attachEvent("tokenUpdate", this._onValueHelpFieldUpdate, this);
				this.attachEvent("suggest", this._onValueHelpSuggestUpdated, this);
				this._handleSubmitKeyEvents();
				this.addValidator(this._onValidateTag.bind(this));
				this.attachEvent("change", this._onValueHelpFieldChange, this);
			},

			destroy: function () {
				MultiInput.prototype.destroy.apply(this, arguments);
				if (this._oValueHelpDialogController) {
					this._oValueHelpDialogController.destroy();
				}
			},

			/*
			 * Followed the same approch used in SmartFilterBar from standard fiori elements.
			 * @Hack: Search should not be triggered while a suggest is in progress (i.e. user presses enter key on the SuggestionList popup). Since the
			 * SuggestionPopup is always closed before the keyup event is raised and we cannot use the keydown event alone, we now listen to both key up
			 * and keydown events and set flags on the control to overcome the issue. Perhaps if sapUI5 provides a new event/does not propagate the keyUp
			 * event/sets a flag we can remove this hack
			 */
			_handleSubmitKeyEvents: function () {
				this.attachBrowserEvent(
					"keydown",
					function (oKey) {
						if (oKey.which === 13) {
							this._bIsSuggestionInProgress = this._oSuggestionPopup && this._oSuggestionPopup.isOpen();
						}
					}.bind(this)
				);
				this.attachBrowserEvent(
					"keyup",
					function (oKey) {
						if (oKey.which === 13 && !this._bIsSuggestionInProgress) {
							if (!this.getValue()) {
								this.fireEvent("submitFixed");
							}
						}
					}.bind(this)
				);
			},

			_onValidateTag: function (oArgs) {
				if (oArgs.suggestionObject) {
					let oConfig = this.getConfig();
					let oContext = oArgs.suggestionObject.getBindingContext(oConfig.modelName);
					let oObject = oContext.getObject();
					let oToken = new Token();
					oToken.setKey(oObject[oConfig.idProperty]);
					oToken.setText(oObject[oConfig.textProperty]);
					return oToken;
				}
				return null;
			},

			_validateField: function () {
				let oBundle = this.getModel("i18n").getResourceBundle();
				if (this.getValue()) {
					this.setValueState("Error");
					this.setValueStateText(oBundle.getText("MULTIINPUT_INVALID_MSG", [this.getValue()]));
				} else {
					this.setValueState("None");
					this.setValueStateText("");
				}
			},

			_onValueHelpFieldChange: function (oEvent) {
				this._validateField();
			},

			configure: function (oParams) {
				this.setConfig(oParams.config);
				this.setConfigCollection(oParams.configCollection);
				this._configureSuggestionColumns(oParams.config);
				this.setMaxSuggestionWidth(oParams.config.properties.length * 10 + "rem");
			},

			_configureSuggestionColumns: function (oConfig) {
				for (let i = 0; i < oConfig.properties.length; i++) {
					let oProperty = oConfig.properties[i];
					let oColumn = new Column({
						header: new Label({
							text: oProperty.label
						})
					});
					this.addSuggestionColumn(oColumn);
				}
			},

			_onValueHelpRequest: function (oEvent) {
				let sSearchTerm = oEvent.getParameter("fromSuggestions") ? oEvent.getSource().getValue() : "";
				let oDialogController = this._getValueHelpDialogController();
				let aTokens = this.getTokens();
				let oParams = {
					aTokens: aTokens,
					sSearchTerm: sSearchTerm
				};
				oDialogController.open(oParams).then(
					function (aNewTokens) {
						this.setTokens(aNewTokens);
						this.fireEvent("tokenUpdateAfterChange", { tokens: aNewTokens });
						this._validateField();
					}.bind(this)
				);
			},

			_getValueHelpDialogController: function () {
				let oComponent = {};
				if (this.getController) {
					oComponent = this.getController().getOwnerComponent();
				} else {
					oComponent = getController.apply(this, arguments).getOwnerComponent();
				}
				if (!this._oValueHelpDialogController) {
					this._oValueHelpDialogController = new ValueHelpDialogController({
						fragmentId: this.getId() + "-VH",
						component: oComponent,
						dependent: this,
						config: this.getConfig(),
						configCollection: this.getConfigCollection(),
						supportMultiselect: true
					});
				}
				return this._oValueHelpDialogController;
			},

			_onValueHelpFieldUpdate: function (oEvent) {
				let sType = oEvent.getParameter("type");
				let aData = oEvent.getSource().getTokens();
				if (sType === "removed") {
					let sKey = oEvent.getParameter("removedTokens")[0].getProperty("key");
					let idx;
					for (let i = 0, len = aData.length; i < len; i++) {
						if (aData[i].getProperty("key") === sKey) {
							idx = i;
						}
					}
					aData.splice(idx, 1);
				}
				this.fireEvent("tokenUpdateAfterChange", { tokens: aData });
				this._validateField();
			},

			_onValueHelpSuggestUpdated: function (oEvent) {
				let sTerm = oEvent.getParameter("suggestValue");
				let oConfig = this.getConfig();
				let oParameters = {
					$search: sTerm
				};
				if (oConfig.customParameters) {
					oParameters = Object.assign(oParameters, oConfig.customParameters());
				}
				let oTemplate = this._getSuggestionRowTemplate(oConfig);
				this.bindAggregation("suggestionRows", {
					path: oConfig.modelPath + oConfig.entityPath,
					parameters: oParameters,
					template: oTemplate
				});
			},

			_getSuggestionRowTemplate: function (oConfig) {
				let oColumnListItem = new ColumnListItem({});
				for (let i = 0; i < oConfig.properties.length; i++) {
					let oProperty = oConfig.properties[i];
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
				this._validateField();
			}
		});
	}
);
