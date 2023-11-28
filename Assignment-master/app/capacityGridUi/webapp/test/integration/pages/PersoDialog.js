sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText", "sap/ui/test/matchers/Properties"],
	function (Opa5, OpaBuilder, Press, EnterText, Properties) {
		"use strict";

		var sDialogId = "application-capacity-Display-component---PersoDialog--dialog";

		Opa5.createPageObjects({
			onThePersoDialog: {
				actions: {
					pressMoveUpButton: function () {
						var sMsg = "When.onThePersoDialog.pressMoveUpButton()";
						this.waitFor({
							controlType: "sap.m.OverflowToolbarButton",
							ancestor: {
								id: sDialogId
							},
							properties: {
								icon: "sap-icon://navigation-up-arrow"
							},
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressMoveDownButton: function () {
						var sMsg = "When.onThePersoDialog.pressMoveDownButton()";
						this.waitFor({
							controlType: "sap.m.OverflowToolbarButton",
							ancestor: {
								id: sDialogId
							},
							properties: {
								icon: "sap-icon://navigation-down-arrow"
							},
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressResetButton: function () {
						var sMsg = "When.onThePersoDialog.pressResetButton()";
						return this.waitFor({
							id: sDialogId + "-reset",
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressCancelButton: function () {
						var sMsg = "When.onThePersoDialog.pressCancelButton()";
						return this.waitFor({
							id: sDialogId + "-cancel",
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressOkButton: function () {
						var sMsg = "When.onThePersoDialog.pressOkButton()";
						return this.waitFor({
							id: sDialogId + "-ok",
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					selectCheckBox: function (iNumber) {
						var sMsg = "When.onThePersoDialog.selectCheckBox(" + iNumber + ")";
						this.waitFor({
							controlType: "sap.m.CheckBox",
							properties: {
								editable: true
							},
							searchOpenDialogs: true,
							ancestor: {
								controlType: "sap.m.ColumnListItem",
								bindingPath: {
									path: "/items/" + iNumber
								},
								ancestor: {
									id: sDialogId
								}
							},
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theDialogIsOpen: function () {
						var sMsg = "Then.onThePersoDialog.theDialogIsOpen()";
						return this.waitFor({
							id: sDialogId,
							controlType: "sap.m.P13nDialog",
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theCheckBoxIsSelected: function (iNumber, bValue) {
						var sMsg = "Then.onThePersoDialog.theCheckBoxIsSelected(" + iNumber + "," + bValue + ")";
						this.waitFor({
							controlType: "sap.m.CheckBox",
							properties: {
								editable: true
							},
							searchOpenDialogs: true,
							ancestor: {
								controlType: "sap.m.ColumnListItem",
								bindingPath: {
									path: "/items/" + iNumber,
									propertyPath: "persistentSelected"
								},
								ancestor: {
									id: sDialogId
								}
							},
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.ok(oControl.getSelected() === bValue, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
