sap.ui.define(["capacityGridUi/reuse/controller/FragmentController"], function (FragmentController) {
	"use strict";

	return FragmentController.extend("capacityGridUi.reuse.controller.BaseFragmentController", {
		injectMembers: function () {
			this.oComponent = this.getOwnerComponent();
			this.models = this.oComponent.models;
			this.oBundle = this.oComponent.getModel("i18n").getResourceBundle();
			this.oControllers = this.oComponent.oControllers;
		}
	});
});
