sap.ui.define(["sap/m/Text"], function (Text) {
	"use strict";

	return Text.extend("capacityGridUi.reuse.variant.SmartControl", {
		renderer: {},

		metadata: {
			properties: {
				persistencyKey: { invalidate: false, type: "string", defaultValue: null },
				eventHandler: { invalidate: false, type: "object", defaultValue: null }
			}
		},

		// Interface function for SmartVariantManagement control
		fetchVariant: function () {
			return this.getEventHandler().fetchVariant();
		},

		// Interface function for SmartVariantManagement control
		applyVariant: function (oVariant) {
			this.getEventHandler().applyVariant(oVariant);
		},

		// Interface function for SmartVariantManagement control
		variantsInitialized: function () {
			this.getEventHandler().variantsInitialized();
		}
	});
});
