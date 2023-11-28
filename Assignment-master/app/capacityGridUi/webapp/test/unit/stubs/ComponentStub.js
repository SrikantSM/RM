sap.ui.define(["capacityGridUi/test/unit/stubs/BundleStub"], function (BundleStub) {
	"use strict";

	return {
		createId: function (sId) {
			return "myComponent--" + sId;
		},
		getModel: function (sName) {
			if (sName === "i18n") {
				return {
					getResourceBundle: function () {
						return BundleStub;
					}
				};
			}
			if (sName === "oDataV4") {
				return {};
			} else {
				return {};
			}
		}
	};
});
