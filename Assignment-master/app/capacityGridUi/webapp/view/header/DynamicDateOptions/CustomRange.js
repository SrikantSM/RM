sap.ui.define(
	[
		"sap/m/DynamicDateOption",
		"sap/m/DynamicDateValueHelpUIType",
		"sap/m/Label",
		"sap/m/DateRangeSelection",
		"capacityGridUi/reuse/DateUtils",
		"sap/ui/core/format/DateFormat",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/header/DateRangeCommons"
	],
	function (DynamicDateOption, DynamicDateValueHelpUIType, Label, DateRangeSelection, Utils, DateFormat, Views, DateRangeCommons) {
		"use strict";

		return DynamicDateOption.extend("capacityGridUi.view.header.DynamicDateOptions.CustomRange", {
			getValueHelpUITypes: function () {
				return [new DynamicDateValueHelpUIType({ type: "int" })];
			},

			getText() {
				return this._getOptionText();
			},

			getGroupHeader: function () {
				return this.getModel("i18n").getResourceBundle().getText("DATE_RANGE");
			},

			createValueHelpUI: function (oControl, fnControlsUpdated) {
				return this._getValueHelpUI(oControl, fnControlsUpdated);
			},

			format: function (oValue) {
				let sView = this.getModel("app").getData().selectedView;
				let oDateFormat = DateFormat.getInstance({
					pattern: sView === Views.MONTHLY ? "MMM yyyy" : "MMM d, yyyy"
				});
				return oDateFormat.format(oValue.values[0]) + " - " + oDateFormat.format(oValue.values[1]);
			},

			parse: function (sValue) {
				return this._parseDateString(sValue);
			},

			getValueHelpOutput: function (oControl) {
				let sView = this.getModel("app").getData().selectedView;
				let oConvertedDateRanges = this._convertDateRanges(
					oControl.aControlsByParameters[this.getKey()][0].getDateValue(),
					oControl.aControlsByParameters[this.getKey()][0].getSecondDateValue()
				);
				let aResult = {};
				aResult.operator = this.getKey();
				aResult.values = [oConvertedDateRanges.from, oConvertedDateRanges.to];
				if (sView === Views.WEEKLY) {
					oControl.aControlsByParameters[this.getKey()][0].setDateValue(oConvertedDateRanges.from);
					oControl.aControlsByParameters[this.getKey()][0].setSecondDateValue(oConvertedDateRanges.to);
				}
				return aResult;
			},

			validateValueHelpUI: function (oControl) {
				return oControl.aInputControls[1].getValue() ? true : false;
			},

			toDates: function (oValue) {
				return [oValue.values[0], oValue.values[1]];
			},

			_getOptionText() {
				let sView = this.getModel("app").getData().selectedView;
				switch (sView) {
					case Views.MONTHLY:
						return this.getModel("i18n").getResourceBundle().getText("MONTH_RANGE");
					case Views.WEEKLY:
						return this.getModel("i18n").getResourceBundle().getText("DATE_RANGE");
					case Views.DAILY:
						return this.getModel("i18n").getResourceBundle().getText("DATE_RANGE");
					default:
						throw new Error("unhandled view " + sView);
				}
			},

			_getValueHelpUI: function (oControl, fnControlsUpdated) {
				let oLabel = new Label({
					text: this._getOptionText(),
					width: "100%"
				});
				let oDateRangeSelectionControl = this._getDateRangeSelectionControl(oControl);
				oControl.aControlsByParameters = {};
				oControl.aControlsByParameters[this.getKey()] = [];

				if (fnControlsUpdated instanceof Function) {
					oDateRangeSelectionControl.attachChange(
						function () {
							fnControlsUpdated(this);
						}.bind(this)
					);
				}
				oControl.aControlsByParameters[this.getKey()].push(oDateRangeSelectionControl);
				return [oLabel, oDateRangeSelectionControl];
			},

			_getDateRangeSelectionControl: function (oControl) {
				let oValue = oControl.getValue();
				let sView = this.getModel("app").getData().selectedView;
				let iXVal = DateRangeCommons.defaultValueForXDateRanges(sView);
				let aDefaultDates = oValue ? oControl.toDates(oValue) : DateRangeCommons.getNextXRangesByView(sView, iXVal);
				let oDateRangeSelectionControl = new DateRangeSelection({
					calendarWeekNumbering: "ISO_8601",
					valueFormat: sView === Views.MONTHLY ? "MMM yyyy" : "MMM d, yyyy",
					displayFormat: sView === Views.MONTHLY ? "MMM yyyy" : "MMM d, yyyy",
					dateValue: aDefaultDates[0],
					secondDateValue: aDefaultDates[1]
				});
				return oDateRangeSelectionControl;
			},

			_parseDateString: function (sValue) {
				let oResult;
				let sView = this.getModel("app").getData().selectedView;
				let oFormat = DateFormat.getInstance({
					interval: true,
					pattern: sView === Views.MONTHLY ? "MMM yyyy - MMM yyyy" : "MMM d, yyyy - MMM d, yyyy"
				});
				let aDateRanges = oFormat.parse(sValue);
				if (aDateRanges && aDateRanges[0] && aDateRanges[1]) {
					let oConvertedDateRanges = this._convertDateRanges(aDateRanges[0], aDateRanges[1]);
					oResult = {};
					oResult.operator = "CustomRange";
					oResult.values = [oConvertedDateRanges.from, oConvertedDateRanges.to];
				}
				return oResult;
			},

			_convertDateRanges: function (oFromDate, oToDate) {
				let aSwapedDates = DateRangeCommons.swapDates(new Date(oFromDate), new Date(oToDate));
				oFromDate = aSwapedDates[0];
				oToDate = aSwapedDates[1];
				let sView = this.getModel("app").getData().selectedView;
				if (sView === Views.MONTHLY) {
					// Set end date to the last date of the month
					oToDate.setDate(Utils.getDaysInMonth(oToDate.getFullYear(), oToDate.getMonth()));
					return {
						from: oFromDate,
						to: oToDate
					};
				} else if (sView === Views.WEEKLY) {
					oToDate.setHours(0, 0, 0);
					let sStartWeek = Utils.getWeek(oFromDate);
					let sEndWeek = Utils.getWeek(oToDate);
					return {
						from: Utils.getWeekDateRangeInDates(sStartWeek, oFromDate.getFullYear().toString()).cwStartDate,
						to: Utils.getWeekDateRangeInDates(sEndWeek, oToDate.getFullYear().toString()).cwEndDate
					};
				} else if (sView === Views.DAILY) {
					return {
						from: oFromDate,
						to: oToDate
					};
				} else {
					throw Error("unhandled view " + sView);
				}
			}
		});
	}
);
