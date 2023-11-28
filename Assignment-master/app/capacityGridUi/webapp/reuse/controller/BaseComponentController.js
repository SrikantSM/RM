sap.ui.define(["capacityGridUi/reuse/controller/ComponentController"], function (ComponentController) {
	"use strict";

	return ComponentController.extend("capacityGridUi.reuse.controller.BaseComponentController", {
		injectMembers: function () {
			// this.oComponent is already set in constructor
			this.models = this.oComponent.models;
			this.oBundle = this.oComponent.getModel("i18n").getResourceBundle();
			this.oControllers = this.oComponent.oControllers;
		}
	});
});
