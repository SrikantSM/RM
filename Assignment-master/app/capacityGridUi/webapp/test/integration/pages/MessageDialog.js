sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press", "sap/ui/test/matchers/I18NText"],
	function (Opa5, OpaBuilder, Press, I18NText) {
		"use strict";

		let sDialogId = "application-capacity-Display-component---MessageDialog";

		// usually the ancestor would be identified by the ID but for whatever reason that was not working out
		// sap.m.MessagePopover uses internally the sap.m.MessageView. That should be unique.
		let oMessageViewAncestor = {
			controlType: "sap.m.MessageView"
		};

		Opa5.createPageObjects({
			onTheMessageDialog: {
				actions: {
					pressCloseButton: function () {
						let sMsg = "Then.onTheMessageDialog.pressCloseButton()";
						return this.waitFor({
							id: sDialogId + "--close",
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressBackButton: function () {
						let sMsg = "Then.onTheMessageDialog.pressBackButton()";
						return this.waitFor({
							id: sDialogId + "--back",
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theMessagesListHasLength: function (iLength) {
						let sMsg = "Then.onTheMessageDialog.theMessagesListHasLength(" + iLength + ")";
						return this.waitFor({
							controlType: "sap.m.List",
							ancestor: oMessageViewAncestor,
							searchOpenDialogs: true,
							success: function (oControls) {
								let oList = oControls[0];
								let aItems = oList.getItems();
								Opa5.assert.equal(aItems.length, iLength, sMsg);
							}
						});
					},
					theMessageItemIsVisible: function (sTitle, sSubtitle) {
						let sMsg = "Then.onTheMessageDialog.theMessageItemIsVisible(" + sTitle + "," + sSubtitle + ")";
						let oProperties = {};
						if (sTitle) {
							oProperties.title = sTitle;
						}
						if (sSubtitle) {
							oProperties.description = sSubtitle;
						}
						return this.waitFor({
							controlType: "sap.m.MessageListItem",
							properties: oProperties,
							ancestor: oMessageViewAncestor,
							searchOpenDialogs: true,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							}
						});
					},
					theTextIsVisible: function (sDescription) {
						let sMsg = "Then.onTheMessageDialog.theTextIsVisible(" + sDescription + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							properties: {
								text: sDescription
							},
							ancestor: oMessageViewAncestor,
							searchOpenDialogs: true,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theTextByKeyIsVisible: function (sMsgKey) {
						let sMsg = "Then.onTheMessageDialog.theTextByKeyIsVisible(" + sMsgKey + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							matchers: new I18NText({
								propertyName: "text",
								key: sMsgKey,
								parameters: []
							}),
							ancestor: oMessageViewAncestor,
							searchOpenDialogs: true,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
