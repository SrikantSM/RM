sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText", "sap/ui/test/matchers/Properties"],
	function (Opa5, OpaBuilder, Press, EnterText, Properties) {
		"use strict";

		var sViewName = "view.Page";

		Opa5.createPageObjects({
			onThePage: {
				actions: {
					pressSaveButton: function () {
						var sMsg = "Then.onThePage.pressSaveButton()";
						return this.waitFor({
							id: "idSaveButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressCancelButton: function () {
						var sMsg = "Then.onThePage.pressCancelButton()";
						return this.waitFor({
							id: "idCancelButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					configureKeepAlive: function (iTimeout, iInterval) {
						var sMsg = "Then.onThePage.configureKeepAlive(" + iTimeout + "," + iInterval + ")";
						return this.waitFor({
							id: "app",
							autoWait: false,
							viewName: sViewName,
							success: function (oApp) {
								let oController = oApp.getParent().getController();
								oController.oControllers.draftKeepAlive.configure(iTimeout, iInterval);
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressConfirmDialogOkButton: function () {
						var sMsg = "Then.onThePage.pressConfirmDialogOkButton()";
						return this.waitFor({
							controlType: "sap.m.Button",
							properties: {
								text: "OK"
							},
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressMessageButton: function () {
						var sMsg = "Then.onThePage.pressMessageButton()";
						this.waitFor({
							id: "messagePopoverBtn",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theAppIsVisible: function () {
						var sMsg = "Then.onThePage.theAppIsVisible()";
						return this.waitFor({
							id: "app",
							autoWait: false,
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFooterIsVisible: function () {
						var sMsg = "Then.onThePage.theFooterIsVisible()";
						return this.waitFor({
							id: "idEditFooter",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFooterIsHidden: function () {
						var sMsg = "Then.onThePage.theFooterIsHidden()";
						return this.waitFor({
							viewName: sViewName,
							success: function () {
								var bExists = Opa5.getJQuery()("#" + "idEditFooter").length > 0;
								Opa5.assert.ok(!bExists, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theSideContentIsOpen: function (bValue) {
						var sMsg = "Then.onThePage.theSideContentIsOpen(" + bValue + ")";
						return this.waitFor({
							id: "DynamicSideContent",
							viewName: sViewName,
							success: function (oDynamicSideContent) {
								Opa5.assert.equal(oDynamicSideContent.getShowSideContent(), bValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theMessageToastIsVisible: function (sKey, aParams) {
						var sMsg = "Then.onThePage.theMessageToastIsVisible(" + sKey + "," + aParams + ")";
						return this.waitFor({
							id: "idPage",
							visible: false,
							viewName: sViewName,
							success: function (oPage) {
								let oBundle = oPage.getModel("i18n").getResourceBundle();
								var sMessage = oBundle.getText(sKey, aParams);
								return this.waitFor({
									autoWait: false,
									check: function () {
										let oAllToasts = Opa5.getJQuery()(".sapMMessageToast");
										let oToastsWithText = oAllToasts.filter(":contains('" + sMessage + "')");
										return oToastsWithText.length > 0;
									},
									success: function () {
										Opa5.assert.ok(true, sMsg);
									},
									errorMessage: sMsg
								});
							},
							errorMessage: sMsg
						});
					},
					theMessagesCountIs: function (iCount) {
						let sMsg = "Then.onThePage.theMessagesCountIs(" + iCount + ")";
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "messagePopoverBtn",
							viewName: sViewName,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getText(), iCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theSaveMessageIs: function (sKey) {
						var sMsg = "Then.onThePage.theSaveMessageIs(" + sKey + ")";
						return this.waitFor({
							id: "idPage",
							viewName: sViewName,
							success: function (oPage) {
								let oBundle = oPage.getModel("i18n").getResourceBundle();
								var sMessage = oBundle.getText(sKey);
								return this.waitFor({
									id: "idSubmitStatusText",
									viewName: sViewName,
									success: function (oText) {
										Opa5.assert.equal(oText.getText(), sMessage, sMsg);
									},
									errorMessage: sMsg
								});
							},
							errorMessage: sMsg
						});
					},
					theErrorIsVisible: function (sKey) {
						var sMsg = "Then.onThePage.theErrorIsVisible()";
						return this.waitFor({
							id: "idPage",
							visible: false,
							viewName: sViewName,
							success: function (oPage) {
								var sMessage = oPage.getModel("i18n").getResourceBundle().getText(sKey);
								return this.waitFor({
									controlType: "sap.m.Text",
									searchOpenDialogs: true,
									properties: {
										text: sMessage
									},
									success: function () {
										Opa5.assert.ok(true, sMsg);
									},
									errorMessage: sMsg
								});
							},
							errorMessage: sMsg
						});
					},
					theMessagesButtonIsVisible: function () {
						var sMsg = "Then.onThePage.theMessagesButtonIsVisible()";
						return this.waitFor({
							id: "messagePopoverBtn",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theMessagesButtonIsNotVisible: function () {
						var sMsg = "Then.onThePage.theMessagesButtonIsNotVisible()";
						return this.waitFor({
							viewName: sViewName,
							success: function () {
								var bExists = Opa5.getJQuery()("#" + "messagePopoverBtn").length > 0;
								Opa5.assert.ok(!bExists, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theConfirmationDialogIsVisible: function () {
						var sMsg = "Then.onThePage.theConfirmationDialogIsVisible()";
						return this.waitFor({
							controlType: "sap.m.Dialog",
							searchOpenDialogs: true,
							success: function (oDialog) {
								Opa5.assert.ok(true, sMsg);
							}
						});
					},
					theFooterDraftTextIsVisible: function (sKey) {
						var sMsg = "Then.onThePage.theFooterDraftTextIsVisible(" + sKey + ")";
						return this.waitFor({
							id: "idEditMessageStrip",
							viewName: sViewName,
							success: function (oText) {
								Opa5.assert.equal(oText.getText(), oText.getModel("i18n").getResourceBundle().getText(sKey), sMsg);
							},
							errorMessage: sMsg
						});
					},
					theHeaderIsHidden: function () {
						var sMsg = "Then.onThePage.theHeaderIsHidden()";
						return this.waitFor({
							viewName: sViewName,
							success: function () {
								var bExists = Opa5.getJQuery()("#" + "idHeader").length > 0;
								Opa5.assert.ok(!bExists, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
