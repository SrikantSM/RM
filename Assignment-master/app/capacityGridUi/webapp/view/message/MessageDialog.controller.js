sap.ui.define(["capacityGridUi/reuse/controller/BaseFragmentController"], function (BaseFragmentController) {
	"use strict";

	return BaseFragmentController.extend("capacityGridUi.view.message.MessageDialog", {
		_bOpenAfterTimeout: undefined,

		constructor: function (component) {
			BaseFragmentController.prototype.constructor.call(this, {
				fragmentName: "capacityGridUi.view.message.MessageDialog",
				fragmentId: component.createId("MessageDialog"),
				component: component,
				dependent: null
			});
		},

		onInit: function () {
			this.injectMembers();
			let oDialog = this.getFragmentSync();
			oDialog.setModel(this.oComponent.getModel("i18n"), "i18n");
			oDialog.setModel(this.models.message, "message");
		},

		onItemSelect: function () {
			this.byId("back").setVisible(true);
		},

		onBack: function () {
			this.byId("back").setVisible(false);
			this.byId("messageView").navigateBack();
		},

		open: function () {
			// why wait until open the dialog?
			// the sap.m.MessageView navigates to the detail if there is only one message
			// if multiple messages are added but you show MessageView after the first message the detail is shown
			// that is not the desired result. you should see the list instead.
			if (!this._bOpenAfterTimeout) {
				this._bOpenAfterTimeout = true;
				setTimeout(this._open.bind(this), 0);
			}
		},

		_open: function () {
			this.getFragment().then(
				function (oDialog) {
					if (!oDialog.isOpen()) {
						// Why navigate back to list page?
						// The detail page can still be bound to old data!
						// MessageView will automatically navigate to detail page again for single message
						this.onBack();
						oDialog.open();
					}
				}.bind(this)
			);
		},

		onClose: function () {
			let oDialog = this.getFragmentSync();
			oDialog.close();
		},

		// this event covers both close by button and close by ESC key
		onAfterClose: function () {
			this._bOpenAfterTimeout = false;
			this.models.message.removeTransientMessages();
		}
	});
});
