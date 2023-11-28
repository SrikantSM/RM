sap.ui.define(["sap/ui/model/resource/ResourceModel"], function (ResourceModel) {
	"use strict";

	return new ResourceModel({
		bundleUrl: jQuery.sap.getModulePath("capacityGridUi", "/i18n/i18n.properties")
	}).getResourceBundle();
});
