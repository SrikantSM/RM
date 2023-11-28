sap.ui.define(
	[
		"sap/m/DynamicDateOption",
		"sap/m/DynamicDateValueHelpUIType",
		"sap/m/StepInput",
		"sap/m/Label",
		"capacityGridUi/reuse/DateUtils",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/header/DateRangeCommons"
	],
	function (DynamicDateOption, DynamicDateValueHelpUIType, StepInput, Label, Utils, Views, DateRangeCommons) {
		"use strict";

		return DynamicDateOption.extend("capacityGridUi.view.header.DynamicDateOptions.XYRange", {
			getValueHelpUITypes: function () {
				return [new DynamicDateValueHelpUIType({ type: "int" }), new DynamicDateValueHelpUIType({ type: "int" })];
			},

			getText() {
				return this._getOptionText("X", "Y");
			},

			getGroupHeader: function () {
				return this.getModel("i18n").getResourceBundle().getText("DATE_RANGE");
			},

			createValueHelpUI: function (oControl, fnControlsUpdated) {
				return this._getValueHelpUI(oControl, fnControlsUpdated);
			},

			getValueHelpOutput: function (oControl) {
				let aResult = {};
				aResult.operator = this.getKey();
				aResult.values = [oControl.aControlsByParameters[this.getKey()][0].getValue(), oControl.aControlsByParameters[this.getKey()][1].getValue()];
				return aResult;
			},

			format: function (oValue) {
				return this._getOptionText(oValue.values[0], oValue.values[1]);
			},

			parse: function (sValue) {
				return this._parseDateString(sValue);
			},

			validateValueHelpUI: function (oControl) {
				if (oControl.aInputControls[1].getValue() && oControl.aInputControls[3].getValue()) {
					return true;
				} else {
					return false;
				}
			},

			toDates: function (oValue) {
				let sView = this.getModel("app").getData().selectedView;
				switch (sView) {
					case Views.MONTHLY:
						return this._getMonthlyRange(oValue);
					case Views.WEEKLY:
						return this._getWeeklyRange(oValue);
					case Views.DAILY:
						return this._getDailyRange(oValue);
					default:
						throw new Error("unhandled view " + sView);
				}
			},

			_getOptionText(sXValue, sYValue) {
				let sView = this.getModel("app").getData().selectedView;
				switch (sView) {
					case Views.MONTHLY:
						return sXValue && sXValue
							? this.getModel("i18n").getResourceBundle().getText("MONTHFROMTO", [sXValue, sYValue])
							: this.getModel("i18n").getResourceBundle().getText("MONTHFROMTO");
					case Views.WEEKLY:
						return sXValue && sXValue
							? this.getModel("i18n").getResourceBundle().getText("WEEKFROMTO", [sXValue, sYValue])
							: this.getModel("i18n").getResourceBundle().getText("WEEKFROMTO");
					case Views.DAILY:
						return sXValue && sXValue
							? this.getModel("i18n").getResourceBundle().getText("DAYFROMTO", [sXValue, sYValue])
							: this.getModel("i18n").getResourceBundle().getText("DAYFROMTO");
					default:
						throw new Error("unhandled view " + sView);
				}
			},

			_getValueHelpUI: function (oControl, fnControlsUpdated) {
				let sView = this.getModel("app").getData().selectedView;
				let oBundle = this.getModel("i18n").getResourceBundle();
				let oValue = oControl.getValue();
				oControl.aControlsByParameters = {};
				oControl.aControlsByParameters[this.getKey()] = [];
				let oLabelBeforeToday = new Label({
					text: this.getModel("i18n").getResourceBundle().getText("DYNAMIC_DATERANGE_VALUEX"),
					width: "100%"
				});
				let oStepInputBeforeToday = new StepInput({
					min: 1,
					value: oValue && this.getKey() === oValue.operator ? oValue.values[0] : this._getDefaultValueForStepInput()[0],
					description: DateRangeCommons.getStepInputDesc(sView, oBundle)
				});
				if (fnControlsUpdated instanceof Function) {
					oStepInputBeforeToday.attachChange(
						function () {
							fnControlsUpdated(this);
						}.bind(this)
					);
				}
				oControl.aControlsByParameters[this.getKey()].push(oStepInputBeforeToday);

				let oLabelAfterToday = new Label({
					text: this.getModel("i18n").getResourceBundle().getText("DYNAMIC_DATERANGE_VALUEY"),
					width: "100%"
				});
				let oStepInputAfterToday = new StepInput({
					min: 1,
					value: oValue && this.getKey() === oValue.operator ? oValue.values[1] : this._getDefaultValueForStepInput()[1],
					description: DateRangeCommons.getStepInputDesc(sView, oBundle)
				});
				if (fnControlsUpdated instanceof Function) {
					oStepInputAfterToday.attachChange(
						function () {
							fnControlsUpdated(this);
						}.bind(this)
					);
				}
				oControl.aControlsByParameters[this.getKey()].push(oStepInputAfterToday);
				return [oLabelBeforeToday, oStepInputBeforeToday, oLabelAfterToday, oStepInputAfterToday];
			},

			_getDefaultValueForStepInput: function () {
				let sView = this.getModel("app").getData().selectedView;
				switch (sView) {
					case Views.MONTHLY:
						return [2, 3];
					case Views.WEEKLY:
						return [2, 4];
					case Views.DAILY:
						return [14, 14];
					default:
						throw new Error("unhandled view " + sView);
				}
			},

			_getMonthlyRange: function (oValue) {
				let oToday = new Date();
				let iLastXMonth = oValue.values[0];
				let iNextYMonth = oValue.values[1];
				let oStartDate = new Date(oToday.getFullYear(), oToday.getMonth() - iLastXMonth);
				let oEndDate = new Date(oToday.getFullYear(), oToday.getMonth() + iNextYMonth);
				oEndDate.setDate(Utils.getDaysInMonth(oEndDate.getFullYear(), oEndDate.getMonth()));
				return [oStartDate, oEndDate];
			},

			_getWeeklyRange: function (oValue) {
				let iLastXWeek = oValue.values[0];
				let iNextYWeek = oValue.values[1];
				let oNewDate = new Date();
				let oToday = new Date(oNewDate.getFullYear(), oNewDate.getMonth(), oNewDate.getDate());
				let sCurrentCWNo = Utils.getWeek(oToday);
				let oLastXWeekStartDate = Utils.getWeekDateRangeInDates(sCurrentCWNo - iLastXWeek, oToday.getFullYear().toString()).cwStartDate;
				let oNextXWeekEndDate = Utils.getWeekDateRangeInDates(sCurrentCWNo + iNextYWeek, oToday.getFullYear().toString()).cwEndDate;
				return [oLastXWeekStartDate, oNextXWeekEndDate];
			},

			_getDailyRange: function (oValue) {
				let iLastXDays = oValue.values[0];
				let iNextYDays = oValue.values[1];
				let oToday = new Date();
				let oStartDate = new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - iLastXDays);
				let oEndDate = new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() + iNextYDays);
				return [oStartDate, oEndDate];
			},

			_parseDateString: function (sValue) {
				let oResult;
				let sPattern = this._getOptionText(null, null);
				let sMatch1 = sPattern.split("-")[0];
				let aSecondMatch = sPattern.split("}");
				let sMatch2 = aSecondMatch[aSecondMatch.length - 1];
				let sRegexPattern = "^" + sMatch1 + "(.*)/(.*)" + sMatch2 + "$";
				let rRegex = new RegExp(sRegexPattern, "i");
				let aMatch = sValue.match(rRegex);
				let sXValue = aMatch && aMatch[1] ? aMatch[1].replace(/\s+/g, "") : null;
				let sYValue = aMatch && aMatch[2] ? aMatch[2].replace(/\s+/g, "") : null;
				let iXValue = sXValue ? Number(sXValue) : null;
				let iYValue = sYValue ? Number(sYValue) : null;
				if (iXValue < 0 && iYValue > 0) {
					oResult = {};
					oResult.operator = "XYRange";
					oResult.values = [-iXValue, iYValue];
				}
				return oResult;
			}
		});
	}
);
