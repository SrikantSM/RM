sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press", "sap/ui/test/matchers/I18NText", "sap/ui/test/actions/EnterText"],
	function (Opa5, OpaBuilder, Press, I18NText, EnterText) {
		"use strict";
		let sViewName = "view.header.Header";
		let oDateRangeControlAncestor = {
			controlType: "sap.m.Page"
		};

		Opa5.createPageObjects({
			onDynamicDateRange: {
				actions: {
					pressDynamicDateRangeSelector: function () {
						var sMsg = "Then.onDynamicDateRange.pressDynamicDateRangeSelector()";
						return this.waitFor({
							id: "idDynamicDateRange-input-vhi",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					pressDateOptionByKey: function (sOption, aParams) {
						let sMsg = "Then.onDynamicDateRange.pressDateOptionByKey(" + sOption + ")";
						return this.waitFor({
							controlType: "sap.m.StandardListItem",
							matchers: new I18NText({
								propertyName: "title",
								key: sOption,
								parameters: aParams ? aParams : []
							}),
							actions: new Press({
								idSuffix: "content"
							}),
							ancestor: oDateRangeControlAncestor,
							searchOpenDialogs: true,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					enterValueInStepInput: function (sValue) {
						let sMsg = "Then.onDynamicDateRange.enterValueInStepInput(" + sValue + ")";
						return this.waitFor({
							controlType: "sap.m.NumericInput",
							viewName: sViewName,
							searchOpenDialogs: true,
							actions: new EnterText({
								text: sValue,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					enterDateRangeInput: function (sValue) {
						let sMsg = "Then.onDynamicDateRange.enterDateRangeInput(" + sValue + ")";
						return this.waitFor({
							controlType: "sap.m.DateRangeSelection",
							viewName: sViewName,
							searchOpenDialogs: true,
							actions: new EnterText({
								text: sValue,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					pressApplyButton: function () {
						let sMsg = "Then.onDynamicDateRange.pressApplyButton()";
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							properties: {
								text: "Apply"
							},
							searchOpenDialogs: true,
							actions: new Press({
								idSuffix: "inner"
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					pressCancelButton: function () {
						let sMsg = "Then.onDynamicDateRange.pressCancelButton()";
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							properties: {
								text: "Cancel"
							},
							searchOpenDialogs: true,
							actions: new Press({
								idSuffix: "inner"
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theDateRangeListHasLength: function (iLength) {
						let sMsg = "Then.onDynamicDateRange.theDateRangeListHasLength(" + iLength + ")";
						return this.waitFor({
							controlType: "sap.m.List",
							ancestor: oDateRangeControlAncestor,
							searchOpenDialogs: true,
							success: function (oControls) {
								let oList = oControls[0];
								let aItems = oList.getItems();
								Opa5.assert.equal(aItems.length, iLength, sMsg);
							}
						});
					},

					theOptionIsVisible: function (sOption, aParams) {
						let sMsg = "Then.onDynamicDateRange.theOptionIsVisible(" + sOption + ")";
						return this.waitFor({
							controlType: "sap.m.StandardListItem",
							matchers: new I18NText({
								propertyName: "title",
								key: sOption,
								parameters: aParams ? aParams : []
							}),

							ancestor: oDateRangeControlAncestor,
							searchOpenDialogs: true,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theDateOptionIsSelected: function (sOption, aParams, bSelected) {
						let sMsg = "Then.onDynamicDateRange.theDateOptionIsSelected(" + sOption + ")";
						return this.waitFor({
							controlType: "sap.m.StandardListItem",
							matchers: new I18NText({
								propertyName: "title",
								key: sOption,
								parameters: aParams ? aParams : []
							}),
							properties: {
								selected: bSelected
							},

							ancestor: oDateRangeControlAncestor,
							searchOpenDialogs: true,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theDateOptionStepInputValueIs: function (sValue) {
						let sMsg = "Then.onDynamicDateRange.theDateOptionStepInputValueIs(" + sValue + ")";
						return this.waitFor({
							controlType: "sap.m.NumericInput",
							properties: {
								value: sValue
							},
							searchOpenDialogs: true,
							success: function (aControl) {
								Opa5.assert.equal(aControl[0].getProperty("value"), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theDateOptionDateRangeSelectorValueIs: function (sValue) {
						let sMsg = "Then.onDynamicDateRange.theDateOptionDateRangeSelectorValueIs(" + sValue + ")";
						return this.waitFor({
							controlType: "sap.m.DateRangeSelection",
							properties: {
								value: sValue
							},
							searchOpenDialogs: true,
							success: function (aControl) {
								Opa5.assert.equal(aControl[0].getProperty("value"), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theDateRangeInputValueByI18nKey: function (oi18nKey) {
						let sMsg = "Then.onDynamicDateRange.theDateRangeInputValueByI18nKey(" + oi18nKey.key + ")";
						return this.waitFor({
							id: "idDynamicDateRange",
							viewName: sViewName,
							success: function (oDateRange) {
								let oBundle = oDateRange.getModel("i18n").getResourceBundle();
								let sMessage = oBundle.getText(oi18nKey.key, oi18nKey.values);
								Opa5.assert.equal(oDateRange.getAggregation("_input").getValue(), sMessage, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
