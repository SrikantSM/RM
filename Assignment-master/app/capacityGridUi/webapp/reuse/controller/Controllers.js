sap.ui.define(["sap/ui/base/Object", "sap/base/Log"], function (UI5Object, Log) {
	"use strict";

	return UI5Object.extend("capacityGridUi.reuse.Controllers", {
		_aEssentialControllers: undefined,
		_pEssentialControllersAdded: undefined,
		_fnResolveEssential: undefined,

		constructor: function (aEssentialControllers) {
			UI5Object.apply(this, arguments);
			this._oLogger = Log.getLogger("capacityGridUi.reuse.Controllers");
			this._aEssentialControllers = aEssentialControllers;
			this._pEssentialControllersAdded = new Promise(
				function (resolve, reject) {
					this._fnResolveEssential = resolve;
				}.bind(this)
			);
		},

		essentialControllersAdded: function () {
			return this._pEssentialControllersAdded;
		},

		add: function (sName, oController) {
			if (this[sName]) {
				throw Error("cannot add controller second time: " + sName);
			}
			this[sName] = oController;
			this._oLogger.debug("added: " + sName);
			this._resolveEssentialControllersAdded();
		},

		_resolveEssentialControllersAdded: function () {
			let bAllAdded = true;
			for (let i = 0; i < this._aEssentialControllers.length; i++) {
				if (!this[this._aEssentialControllers[i]]) {
					bAllAdded = false;
					break;
				}
			}
			if (bAllAdded) {
				this._oLogger.debug("resolving essential controllers added");
				this._fnResolveEssential();
			}
		}
	});
});
