sap.ui.define(
	["sap/ui/base/Object", "sap/ui/core/Fragment", "capacityGridUi/reuse/fnd/Assert"],
	function (UI5Object, Fragment, Assert) {
		"use strict";

		return UI5Object.extend("capacityGridUi.reuse.controller.FragmentController", {
			_pLoad: undefined,
			_oComponent: undefined,
			_sFragmentName: undefined,
			_sFragmentId: undefined,
			_oDependent: undefined,
			_oFragment: undefined,

			constructor: function (oParams) {
				this.__checkParams(oParams);
				this._oComponent = oParams.component;
				this._oDependent = oParams.dependent;
				this._sFragmentName = oParams.fragmentName;
				this._sFragmentId = oParams.fragmentId;
			},

			__checkParams: function (oParams) {
				// sub classes sometimes use _checkParams
				Assert.ok(oParams, "Cannot instantiate FragmentController. params missing");
				Assert.ok(oParams.fragmentName, "Cannot instantiate FragmentController. fragmentName missing");
				Assert.ok(oParams.fragmentId, "Cannot instantiate FragmentController. fragmentId missing");
			},

			getFragment: function () {
				if (!this._pLoad) {
					this._pLoad = new Promise(
						function (resolve, reject) {
							Fragment.load({
								id: this._sFragmentId,
								name: this._sFragmentName,
								controller: this
							}).then(
								function (oFragment) {
									this._oFragment = oFragment;
									Assert.notArray(this._oFragment, "Cannot instantiate FragmentController. fragment content is empty. Probably XML syntax wrong");
									if (this._oDependent) {
										this._oDependent.addDependent(this._oFragment);
									}
									// a reference on the fragment to the controller (used by getController)
									this._oFragment.__oFragmentController = this;
									this.onInit(oFragment);
									resolve(this._oFragment);
								}.bind(this),
								reject
							);
						}.bind(this)
					);
				}
				return this._pLoad;
			},

			getFragmentSync: function () {
				if (!this._oFragment) {
					throw new Error("fragment has not been loaded yet");
				}
				return this._oFragment;
			},

			destroy: function () {
				UI5Object.prototype.destroy.apply(this, arguments);
				if (this._oFragment) {
					this._oFragment.destroy();
				}
				this.onExit();
			},

			getFragmentId: function () {
				return this._sFragmentId;
			},

			getOwnerComponent: function () {
				return this._oComponent;
			},

			byId: function (sId) {
				return Fragment.byId(this._sFragmentId, sId);
			},

			createId: function (sId) {
				return Fragment.createId(this._sFragmentId, sId);
			},

			onInit: function () {},

			onExit: function () {}
		});
	}
);
