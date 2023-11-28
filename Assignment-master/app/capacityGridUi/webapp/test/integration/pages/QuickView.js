sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
	"use strict";

	let sViewId = "application-capacity-Display-component---QuickView--quickView-quickView-popover";
	let sViewName = "view.Page";

	Opa5.createPageObjects({
		onTheQuickView: {
			actions: {},
			assertions: {
				theQuickIsOpen: function () {
					let sMsg = "Then.onTheQuickView.theQuickIsOpen()";
					return this.waitFor({
						id: sViewId,
						controlType: "sap.m.Popover",
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				thereIsAnMTitle: function (sText) {
					let sMsg = "Then.onTheQuickView.thereIsAnMTitle(" + sText + ")";
					return this.waitFor({
						controlType: "sap.m.Title",
						properties: {
							text: sText
						},
						ancestor: {
							controlType: "sap.m.Popover",
							id: sViewId
						},
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				thereIsACoreTitle: function (sMsgKey) {
					let sMsg = "Then.onTheQuickView.thereIsACoreTitle(" + sMsgKey + ")";
					return this.waitFor({
						id: "idPage",
						visible: false,
						viewName: sViewName,
						success: function (oPage) {
							let oBundle = oPage.getModel("i18n").getResourceBundle();
							return this.waitFor({
								controlType: "sap.ui.core.Title",
								properties: {
									text: oBundle.getText(sMsgKey)
								},
								ancestor: {
									controlType: "sap.m.Popover",
									id: sViewId
								},
								searchOpenDialogs: true,
								success: function () {
									Opa5.assert.ok(true, sMsg);
								},
								errorMessage: sMsg
							});
						},
						errorMessage: sMsg
					});
				},
				theDescriptionIs: function (sText) {
					let sMsg = "Then.onTheQuickView.theDescriptionIs(" + sText + ")";
					return this.waitFor({
						controlType: "sap.m.Text",
						properties: {
							text: sText
						},
						ancestor: {
							controlType: "sap.m.Popover",
							id: sViewId
						},
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				theElementIs: function (sLabelMsgKey, sText) {
					let sMsg = "Then.onTheQuickView.theElementIs(" + sLabelMsgKey + ", " + sText + ")";
					return this.waitFor({
						id: "idPage",
						visible: false,
						viewName: sViewName,
						success: function (oPage) {
							let oBundle = oPage.getModel("i18n").getResourceBundle();
							return this.waitFor({
								controlType: "sap.m.Label",
								properties: {
									text: oBundle.getText(sLabelMsgKey)
								},
								ancestor: {
									controlType: "sap.m.Popover",
									id: sViewId
								},
								searchOpenDialogs: true,
								success: function (aLabels) {
									let oLabel = aLabels[0];
									let sValueControlId = oLabel.getLabelFor();
									let oValueControl = sap.ui.getCore().byId(sValueControlId);
									Opa5.assert.equal(oValueControl.getText(), sText, sMsg);
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
