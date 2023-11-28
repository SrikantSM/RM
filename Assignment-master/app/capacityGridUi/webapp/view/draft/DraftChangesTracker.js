sap.ui.define(["capacityGridUi/reuse/controller/BaseComponentController", "sap/base/Log"], function (BaseComponentController, Log) {
	"use strict";

	/**
	 * The problem: When user saves his changes all the pending updates must be processed first
	 */
	return BaseComponentController.extend("capacityGridUi.view.table.DraftChangesTracker", {
		_iCounter: undefined,
		_pFinished: undefined,
		_fnResolve: undefined,
		_oLogger: undefined,

		constructor: function () {
			BaseComponentController.apply(this, arguments);
			this._iCounter = 0;
			this._oLogger = Log.getLogger("capacityGridUi.view.draft.DraftChangesTracker");
		},

		trackStart: function () {
			this._iCounter++;
			this._oLogger.debug("trackStart", this._iCounter);
			if (this._iCounter === 1) {
				this._pFinished = new Promise(
					function (resolve, reject) {
						this._fnResolve = resolve;
					}.bind(this)
				);
			}
		},

		trackEnd: function () {
			this._iCounter--;
			this._oLogger.debug("trackEnd", this._iCounter ? this._iCounter : "RESOLVED");
			if (this._iCounter === 0) {
				this._fnResolve();
			}
		},

		finished: function () {
			if (this._pFinished) {
				return this._pFinished;
			} else {
				return Promise.resolve();
			}
		}
	});
});
