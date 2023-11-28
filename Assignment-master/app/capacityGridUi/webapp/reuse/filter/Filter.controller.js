sap.ui.define(["capacityGridUi/reuse/controller/BaseViewChildController", "sap/m/Token"], function (BaseViewChildController, Token) {
	"use strict";

	return BaseViewChildController.extend("capacityGridUi.reuse.filter.FilterController", {
		onInit: function () {
			this.injectMembers();
			this.oFilterModel = this.getView().getModel("filter");
		},

		onChange: function (oEvent) {
			throw new Error("not implemented");
		},

		onOpenFilterBar: function () {},

		getName: function () {
			throw new Error("not implemented");
		},

		applyVariant: function (oVariant) {
			throw new Error("not implemented");
		},

		resetVariant: function (oVariant) {
			throw new Error("not implemented");
		},

		isValid: function () {
			throw new Error("not implemented");
		},

		getBindingFilter: function (oVariant) {
			throw new Error("not implemented");
		},

		addTokensToInput: function (oInput, aTexts) {
			oInput.removeAllTokens();
			for (let i = 0; i < aTexts.length; i++) {
				oInput.addToken(
					new Token({
						key: aTexts[i],
						text: aTexts[i]
					})
				);
			}
		}
	});
});
