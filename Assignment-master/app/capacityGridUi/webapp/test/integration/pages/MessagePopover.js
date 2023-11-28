sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press"], function (Opa5, OpaBuilder, Press) {
	"use strict";

	// usually the ancestor would be identified by the ID but for whatever reason that was not working out
	// sap.m.MessagePopover uses internally the sap.m.MessageView. That should be unique.
	let oMessageViewAncestor = {
		controlType: "sap.m.MessageView"
	};

	Opa5.createPageObjects({
		onTheMessagePopover: {
			actions: {
				pressCloseButton: function () {
					let sMsg = "When.onTheMessagePopover.pressCloseButton()";
					return this.waitFor({
						controlType: "sap.m.Button",
						properties: {
							icon: "sap-icon://decline"
						},
						ancestor: oMessageViewAncestor,
						searchOpenDialogs: true,
						actions: new Press(),
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				pressBackButton: function () {
					let sMsg = "When.onTheMessagePopover.pressBackButton()";
					return this.waitFor({
						controlType: "sap.m.Button",
						properties: {
							icon: "sap-icon://nav-back"
						},
						ancestor: oMessageViewAncestor,
						searchOpenDialogs: true,
						actions: new Press(),
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				pressMessageLink: function (sMessage) {
					let sMsg = "When.onTheMessagePopover.pressMessageLink(" + sMessage + ")";
					this.waitFor({
						controlType: "sap.m.Link",
						properties: {
							text: sMessage
						},
						ancestor: oMessageViewAncestor,
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
				thePopoverIsVisible: function () {
					let sMsg = "Then.onTheMessagePopover.thePopoverIsVisible()";
					return this.waitFor({
						controlType: "sap.m.Popover",
						searchOpenDialogs: true,
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				theMessagesListHasLength: function (iLength) {
					let sMsg = "Then.onTheMessagePopover.theMessagesListHasLength(" + iLength + ")";
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
					let sMsg = "Then.onTheMessagePopover.theMessageItemIsVisible(" + sTitle + "," + sSubtitle + ")";
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
				theDetailLinkIs: function (sText) {
					let sMsg = "Then.onTheMessagePopover.theDetailLinkIs(" + sText + ")";
					return this.waitFor({
						controlType: "sap.m.Link",
						properties: {
							text: sText
						},
						ancestor: oMessageViewAncestor,
						searchOpenDialogs: true,
						success: function () {
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				theTextIsVisible: function (sDescription) {
					let sMsg = "Then.onTheMessagePopover.theTextIsVisible(" + sDescription + ")";
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
				}
			}
		}
	});
});
