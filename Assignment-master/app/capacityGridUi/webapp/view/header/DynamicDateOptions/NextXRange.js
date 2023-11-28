sap.ui.define(
	[
		"sap/m/DynamicDateOption",
		"sap/m/DynamicDateValueHelpUIType",
		"sap/m/StepInput",
		"sap/m/Label",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/header/DateRangeCommons"
	],
	function (DynamicDateOption, DynamicDateValueHelpUIType, StepInput, Label, Views, DateRangeCommons) {
		"use strict";

		return DynamicDateOption.extend("capacityGridUi.view.header.DynamicDateOptions.NextXRange", {
			getValueHelpUITypes: function () {
				return [new DynamicDateValueHelpUIType({ type: "int" })];
			},

			getText() {
				return this._getOptionText("X");
			},

			getGroupHeader: function () {
				return this.getModel("i18n").getResourceBundle().getText("DATE_RANGE");
			},

			createValueHelpUI: function (oControl, fnControlsUpdated) {
				return this._getValueHelpUI(oControl, fnControlsUpdated);
			},

			format: function (oValue) {
				return this._getOptionText(oValue.values[0]);
			},

			parse: function (sValue) {
				return this._parseDateString(sValue);
			},

			validateValueHelpUI: function (oControl) {
				let oStepInput = oControl.aInputControls[1];
				return oStepInput.getValue() > 0;
			},

			toDates: function (oValue) {
				let sView = this.getModel("app").getData().selectedView;
				return DateRangeCommons.getNextXRangesByView(sView, oValue.values[0]);
			},

			_getOptionText(sValue) {
				let sView = this.getModel("app").getData().selectedView;
				switch (sView) {
					case Views.MONTHLY:
						return this.getModel("i18n").getResourceBundle().getText("NEXTXMONTHS", sValue);
					case Views.WEEKLY:
						return this.getModel("i18n").getResourceBundle().getText("NEXTXWEEKS", sValue);
					case Views.DAILY:
						return this.getModel("i18n").getResourceBundle().getText("NEXTXDAYS", sValue);
					default:
						throw new Error("unhandled view " + sView);
				}
			},

			_getValueHelpUI: function (oControl, fnControlsUpdated) {
				let oBundle = this.getModel("i18n").getResourceBundle();
				let oValue = oControl.getValue();
				let oLabel = new Label({
					text: this.getModel("i18n").getResourceBundle().getText("DYNAMIC_DATERANGE_VALUEX"),
					width: "100%"
				});
				let sView = this.getModel("app").getData().selectedView;
				let oStepInput = new StepInput({
					min: 1,
					value: oValue && this.getKey() === oValue.operator ? oValue.values[0] : DateRangeCommons.defaultValueForXDateRanges(sView),
					description: DateRangeCommons.getStepInputDesc(sView, oBundle)
				});
				oControl.aControlsByParameters = {};
				oControl.aControlsByParameters[this.getKey()] = [];
				if (fnControlsUpdated instanceof Function) {
					oStepInput.attachChange(
						function () {
							fnControlsUpdated(this);
						}.bind(this)
					);
				}
				oControl.aControlsByParameters[this.getKey()].push(oStepInput);
				return [oLabel, oStepInput];
			},

			_parseDateString: function (sValue) {
				let oResult;
				let sPattern = this._getOptionText(null);
				let aStaticParts = sPattern.split("+").map(function (sPart) {
					let iClosingBracket = sPart.indexOf("}");
					if (iClosingBracket !== -1) {
						return sPart.slice(iClosingBracket + 1);
					}
					return sPart;
				});
				let sRegexPattern = "^" + aStaticParts.join("(.*)") + "$";
				let rRegex = new RegExp(sRegexPattern, "i");
				let aMatch = sValue.match(rRegex);
				let sXValue = aMatch && aMatch[1] ? aMatch[1].replace(/\s+/g, "") : null;
				let iXValue = sXValue ? Number(sXValue) : null;
				if (aMatch && iXValue > 0) {
					oResult = {};
					oResult.operator = "NextXRange";
					oResult.values = [iXValue];
				}
				return oResult;
			}
		});
	}
);
