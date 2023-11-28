sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";

	return Controller.extend("capacityGridUi.reuse.controller.BaseViewController", {
		injectMembers: function () {
			this.oComponent = this.getOwnerComponent();
			this.models = this.oComponent.models;
			this.oBundle = this.oComponent.getModel("i18n").getResourceBundle();
			this.oControllers = this.oComponent.oControllers;
		}
	});
});
