sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText", "sap/ui/test/matchers/Properties"],
	function (Opa5, OpaBuilder, Press, EnterText, Properties) {
		"use strict";

		var sViewName = "view.header.Header";

		Opa5.createPageObjects({
			onTheHeader: {
				actions: {
					selectView: function (sKey) {
						var sMsg = "When.onTheHeader.selectView(" + sKey + ")";
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							properties: {
								text: sKey
							},
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressDateRangeValueHelpButton: function () {
						var sMsg = "When.onTheHeader.pressDateRangeValueHelpButton()";
						return this.waitFor({
							id: "idDynamicDateRange",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					pressNextButton: function () {
						let sMsg = "When.onTheHeader.pressNextButton()";
						return this.waitFor({
							id: "nextTimePeriodButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					pressPreviousButton: function () {
						let sMsg = "When.onTheHeader.pressPreviousButton()";
						return this.waitFor({
							id: "prevTimePeriodButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterDateRange: function (sText) {
						var sMsg = "When.onTheDatePopup.enterDateRange(" + sText + ")";
						return this.waitFor({
							id: "idDynamicDateRange",
							viewName: sViewName,
							actions: new EnterText({
								text: sText,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theTotalResourcesNumberIs: function (iNumber) {
						var sMsg = "Then.onTheHeader.theTotalResourcesNumberIs(" + iNumber + ")";
						return this.waitFor({
							id: "idTotalResources",
							viewName: sViewName,
							success: function (oObjectNumber) {
								Opa5.assert.equal(oObjectNumber.getNumber(), iNumber, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFreeResourcesNumberIs: function (iNumber) {
						var sMsg = "Then.onTheHeader.theFreeResourcesNumberIs(" + iNumber + ")";
						return this.waitFor({
							id: "idheaderFreeRes",
							viewName: sViewName,
							success: function (oObjectNumber) {
								Opa5.assert.equal(oObjectNumber.getNumber(), iNumber, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theOverbookedResourcesNumberIs: function (iNumber) {
						var sMsg = "Then.onTheHeader.theOverbookedResourcesNumberIs(" + iNumber + ")";
						return this.waitFor({
							id: "idheaderOBRes",
							viewName: sViewName,
							success: function (oObjectNumber) {
								Opa5.assert.equal(oObjectNumber.getNumber(), iNumber, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAverageUtilizationStatusIs: function (sStatus) {
						var sMsg = "Then.onTheHeader.theAverageUtilizationStatusIs(" + sStatus + ")";
						return this.waitFor({
							id: "idAvgUtilizationStatus",
							viewName: sViewName,
							success: function (oObjectStatus) {
								var AvgUtilLabelValue = oObjectStatus.getText();
								Opa5.assert.equal(AvgUtilLabelValue, sStatus, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theViewButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheHeader.theViewButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idViewButton",
							viewName: sViewName,
							autoWait: false,
							success: function (oSegmentedButton) {
								Opa5.assert.equal(oSegmentedButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theViewIs: function (sKey) {
						var sMsg = "Then.onTheHeader.theViewIs(" + sKey + ")";
						return this.waitFor({
							id: "idViewButton",
							viewName: sViewName,
							autoWait: false,
							success: function (oSegmentedButton) {
								Opa5.assert.ok(oSegmentedButton.getSelectedKey() === sKey, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDateRangeIsEnabled: function (bEnabled) {
						var sMsg = "When.onTheHeader.theDateRangeIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idDynamicDateRange",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDateRangeIsVisible: function () {
						var sMsg = "Then.onTheHeader.theDateRangeIsVisible()";
						return this.waitFor({
							id: "idDynamicDateRange",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDateRangeMatches: function (sRegEx) {
						var sMsg = "Then.onTheHeader.theDateRangeMatches(" + sRegEx + ")";
						return this.waitFor({
							id: "idDynamicDateRange",
							viewName: sViewName,
							success: function (oDateRange) {
								Opa5.assert.matches(oDateRange.getAggregation("_input").getValue(), sRegEx, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDateRangeSelectedValue: function (sValue) {
						var sMsg = "Then.onTheHeader.theDateRangeSelectedValue(" + sValue + ")";
						return this.waitFor({
							id: "idDynamicDateRange-input",
							viewName: sViewName,
							success: function (oDateRange) {
								Opa5.assert.equal(oDateRange.getValue(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDateRangeValueStateIs: function (sText) {
						var sMsg = "Then.onTheHeader.theDateRangeValueStateIs(" + sText + ")";
						return this.waitFor({
							id: "idDynamicDateRange-input",
							viewName: sViewName,
							success: function (oDateRange) {
								Opa5.assert.equal(oDateRange.getValueState(), sText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDateRangeValueStateTextIs: function (sKey) {
						var sMsg = "Then.onTheHeader.theDateRangeValueStateTextIs(" + sKey + ")";
						return this.waitFor({
							id: "idDynamicDateRange-input",
							viewName: sViewName,
							success: function (oDateRange) {
								let oBundle = oDateRange.getModel("i18n").getResourceBundle();
								var sMessage = oBundle.getText(sKey);
								Opa5.assert.equal(oDateRange.getValueStateText(), sMessage, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theTimePeriodPreviousButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheHeader.theTimePeriodPreviousButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "prevTimePeriodButton",
							viewName: sViewName,
							autoWait: false,
							success: function (oPrevButton) {
								Opa5.assert.equal(oPrevButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theTimePeriodNextButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheHeader.theTimePeriodNextButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "nextTimePeriodButton",
							viewName: sViewName,
							autoWait: false,
							success: function (oPrevButton) {
								Opa5.assert.equal(oPrevButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
