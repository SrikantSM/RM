sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press"], function (Opa5, OpaBuilder, Press) {
	"use strict";

	let sViewName = "view.Page";

	Opa5.createPageObjects({
		onTheErrorDialog: {
			actions: {
				pressCloseButton: function () {
					let sMsg = "Then.onTheErrorDialog.pressCloseButton()";
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						properties: {
							text: "Close"
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
				theTextIsVisible: function (sKey, aParams) {
					let sMsg = "Then.onTheErrorDialog.theTextIsVisible(" + sKey + "," + aParams + ")";
					return this.waitFor({
						id: "idPage",
						visible: false,
						viewName: sViewName,
						success: function (oPage) {
							let oBundle = oPage.getModel("i18n").getResourceBundle();
							return this.waitFor({
								controlType: "sap.m.Text",
								searchOpenDialogs: true,
								properties: {
									text: oBundle.getText(sKey, aParams)
								},
								success: function () {
									Opa5.assert.ok(true, sMsg);
								},
								errorMessage: sMsg
							});
						},
						errorMessage: sMsg
					});
				}
			}
		}
	});
});
