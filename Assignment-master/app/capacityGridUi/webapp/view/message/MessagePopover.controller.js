sap.ui.define(["capacityGridUi/reuse/controller/BaseFragmentController"], function (BaseFragmentController) {
	"use strict";

	return BaseFragmentController.extend("capacityGridUi.view.message.MessagePopover", {
		constructor: function (component, dependent) {
			BaseFragmentController.prototype.constructor.call(this, {
				fragmentName: "capacityGridUi.view.message.MessagePopover",
				fragmentId: component.createId("MessagePopover"),
				component: component,
				dependent: dependent
			});
			this.injectMembers();
		},

		open: function (oButton) {
			this.getFragment().then(function (oMessagePopover) {
				oMessagePopover.toggle(oButton);
			});
		},

		onPressActiveTitlePress: function (oEvent) {
			let oItem = oEvent.getParameter("item");
			let oMessage = oItem.getBindingContext("message").getObject();
			this.oControllers.table.showRow(oMessage.target, oMessage.focusPath);
		},

		isPositionable: function (sTarget) {
			// Such a hook can be used by the application to determine if a control can be found/reached on the page and navigated to.
			return sTarget ? true : false;
		}
	});
});
