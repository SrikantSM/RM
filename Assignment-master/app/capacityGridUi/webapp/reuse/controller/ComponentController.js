sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	return UI5Object.extend("capacityGridUi.reuse.controller.ComponentController", {
		oComponent: undefined,

		constructor: function (oComponent) {
			UI5Object.prototype.constructor.apply(this, arguments);
			this.oComponent = oComponent;
			this.onInit();
		},

		destroy: function () {
			UI5Object.prototype.destroy.apply(this, arguments);
			this.onExit();
		},

		onInit: function () {},

		onExit: function () {},

		byId: function (sId) {
			return this.oComponent.byId(sId);
		},

		createId: function (sId) {
			return this.oComponent.createId(sId);
		},

		getOwnerComponent: function () {
			return this.oComponent;
		}
	});
});
