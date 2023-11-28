sap.ui.define([], function () {
	"use strict";

	return function (iUtilPercent) {
		if (iUtilPercent === undefined || iUtilPercent === null) {
			return "None";
		} else if (iUtilPercent > 120 || iUtilPercent < 70) {
			return "Error";
		} else if (iUtilPercent >= 80 && iUtilPercent <= 110) {
			return "Success";
		} else {
			return "Warning";
		}
	};
});
