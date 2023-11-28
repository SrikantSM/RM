sap.ui.define([], function () {
	"use strict";

	return function (sDescription, sCode) {
		if (sDescription || sCode) {
			return sDescription + " (" + sCode + ")";
		} else {
			return "";
		}
	};
});
