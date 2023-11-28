sap.ui.define(["capacityGridUi/reuse/controller/ViewChildController"], function (ViewChildController) {
	"use strict";

	return ViewChildController.extend("capacityGridUi.reuse.controller.BaseViewChildController", {
		injectMembers: function () {
			this.oComponent = this.getOwnerComponent();
			this.models = this.oComponent.models;
			this.oBundle = this.oComponent.getModel("i18n").getResourceBundle();
			this.oControllers = this.oComponent.oControllers;
		}
	});
});
