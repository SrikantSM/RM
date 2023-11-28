sap.ui.define(
	["sap/ui/core/mvc/ControllerExtension",
		"sap/ui/model/resource/ResourceModel"
	],
	function(ControllerExtension, ResourceModel) {
		return ControllerExtension.extend("listReportExtension", {
			override: {
				onInit: function() {
					if (!this.base.getModel("i18ned")) {
						const i18nModel = new ResourceModel({
							bundleName: "resourceRequestLibrary.i18n.i18n"
						});
						this.base.setModel(i18nModel, "i18ned");
					}
				}
			}
		});
	}
);
