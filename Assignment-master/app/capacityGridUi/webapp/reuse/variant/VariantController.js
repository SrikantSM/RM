sap.ui.define(
	["capacityGridUi/reuse/controller/BaseViewController", "sap/base/util/deepClone", "sap/base/util/deepEqual", "sap/m/MessageBox"],
	function (BaseViewController, deepClone, deepEqual, MessageBox) {
		"use strict";

		return BaseViewController.extend("capacityGridUi.reuse.variant.VariantController", {
			_bInitialized: undefined,
			_oDefaultVariant: undefined,
			_oVariant: undefined,
			_oUnchangedVariant: undefined,

			onInit: function () {
				this.injectMembers();

				this.oComponent.oControllers.add("variant", this);
				this._bInitialized = false;

				let oSmartControl = this.byId("smartControl");
				if (!oSmartControl) {
					throw new Error("failed to find smart control");
				}
				oSmartControl.setEventHandler(this);

				let oVariantManagement = this.byId("variantManagement");
				if (!oVariantManagement) {
					throw new Error("failed to find variant management control");
				}
				oVariantManagement.initialise(function () {}, oSmartControl);
			},

			// ~~~ public ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			changeVariant: function (sKey1, sKey2, oData) {
				if (!sKey1) {
					throw new Error("no first key");
				} else if (sKey1 && sKey2) {
					this._oVariant[sKey1][sKey2] = oData;
				} else {
					this._oVariant[sKey1] = oData;
				}
				let bModified = !deepEqual(this._oVariant, this._oUnchangedVariant);
				this.byId("variantManagement").currentVariantSetModified(bModified);
			},

			getVariant: function () {
				return this._oVariant;
			},

			getUnchangedVariant: function () {
				return this._oUnchangedVariant;
			},

			// ~~~ interface functions for SmartControl ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			// interface function for SmartControl
			//  - called after init of variants
			variantsInitialized: function () {
				if (this._oDefaultVariant) {
					this._oVariant = this._oDefaultVariant;
				} else {
					let oStandardVariant = this._getStandardVariant();
					this._oVariant = deepClone(oStandardVariant);
				}
				this._apply(this._oVariant);
				this._bInitialized = true;
			},

			// interface function for SmartControl:
			//  - called during init if (and only if) the default is a non-standard variant
			//  - called when the user selects a variant
			applyVariant: function (oVariant) {
				if (this._bInitialized) {
					this._apply(oVariant);
				} else {
					this._oDefaultVariant = oVariant;
				}
			},

			// interface function for SmartControl:
			//  - called during init to get the standard variant (which is later supplied via applyVariant on user selection)
			//    independent if the default is the standard or a custom variant
			//  - called if the variant is getting saved
			fetchVariant: function () {
				if (this._bInitialized) {
					return this._oVariant;
				} else {
					let oStandardVariant = this._getStandardVariant();
					return deepClone(oStandardVariant);
				}
			},

			// ~~~ private ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			_getStandardVariant: function () {
				throw new Error("not implemented");
			},

			_apply: function (oVariant) {
				this._oVariant = this._migrateVariant(oVariant);
				this._oUnchangedVariant = deepClone(this._oVariant);
				this._applyToControllers(this._oVariant);
			},

			// why not fire an event to the all controllers?
			// applying the variant is sequence dependent and must be scheduled in a central place (i.e. here)
			_applyToControllers: function (oVariant) {
				throw new Error("not implemented");
			},

			// for handling differences in versions ... in the future
			_migrateVariant: function (oVariant) {
				throw new Error("not implemented");
			},

			// ~~~ test ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			_oTestVar1: undefined,
			_oTestVar2: undefined,

			testSelectStandard: function () {
				this.byId("testForm").setTitle("Standard");
				let oStandardVariant = this._getStandardVariant();
				this.applyVariant(deepClone(oStandardVariant));
			},

			testSelect1: function () {
				if (!this._oTestVar1) {
					MessageBox.error("Variant 1 not saved yet");
				} else {
					this.byId("testForm").setTitle("Variant 1");
					this.applyVariant(deepClone(this._oTestVar1));
				}
			},

			testSelect2: function () {
				if (!this._oTestVar2) {
					MessageBox.error("Variant 2 not saved yet");
				} else {
					this.byId("testForm").setTitle("Variant 2");
					this.applyVariant(deepClone(this._oTestVar2));
				}
			},

			testSave1: function () {
				this._oTestVar1 = deepClone(this._oVariant);
				this.byId("select1Button").setEnabled(true);
			},

			testSave2: function () {
				this._oTestVar2 = deepClone(this._oVariant);
				this.byId("select2Button").setEnabled(true);
			}
		});
	}
);
