sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	return UI5Object.extend("capacityGridUi.reuse.controller.ViewChildController", {
		oParent: undefined,

		constructor: function (oParent) {
			UI5Object.prototype.constructor.apply(this, arguments);
			this.oParent = oParent;
			this.onInit();
		},

		destroy: function () {
			UI5Object.prototype.destroy.apply(this, arguments);
			this.onExit();
		},

		onInit: function () {},

		onExit: function () {},

		byId: function (sId) {
			return this.oParent.byId(sId);
		},

		createId: function (sId) {
			return this.oParent.createId(sId);
		},

		getOwnerComponent: function () {
			return this.oParent.getOwnerComponent();
		},

		getView: function () {
			return this.oParent.getView();
		}
	});
});
