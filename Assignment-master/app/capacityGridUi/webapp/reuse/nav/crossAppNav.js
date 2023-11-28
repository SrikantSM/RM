sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
	"use strict";

	return function (oParams) {
		// check if global XappNav service is available, else URL cannot be generated
		if (!sap.ushell) {
			return null;
		}

		// get a handle on the global XAppNav service
		if (!sap.ushell) {
			return null;
		}

		let oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
		oCrossAppNav
			.isIntentSupported([oParams.semanticObject + "-" + oParams.action])
			.done(function (aResponses) {})
			.fail(function () {
				MessageToast.show("Provide corresponding intent to navigate");
			});

		let hash =
			(oCrossAppNav &&
				oCrossAppNav.hrefForExternal({
					target: {
						semanticObject: oParams.semanticObject,
						action: oParams.action
					},
					params: oParams.params
				})) ||
			"";

		// Generate a  URL for the second application
		let url = window.location.href.split("#")[0] + hash;

		return url;
	};
});
