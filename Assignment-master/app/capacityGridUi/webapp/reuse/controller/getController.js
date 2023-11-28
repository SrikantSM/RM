/* eslint-disable no-invalid-this */
sap.ui.define([], function () {
	"use strict";

	/**
	 * Finds the view or fragment controller on the current control (=this)
	 * @return {object}
	 * Should be patched onto a control.
	 */
	return function () {
		let oParent = this.getParent();
		let i = 0;
		while (oParent && !(oParent.getController || oParent.___oFragmentController) && i < 1000) {
			oParent = oParent.getParent();
			i++;
		}
		if (i === 1000) {
			throw new Error("cannot find a parent with a controller");
		}
		if (!oParent) {
			return null;
		}
		if (oParent.getController) {
			return oParent.getController();
		}
		if (oParent.__oFragmentController) {
			return oParent.__oFragmentController;
		}
		throw new Error("something went really wrong");
	};
});
