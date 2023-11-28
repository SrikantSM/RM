sap.ui.define(
	["sap/ui/base/Object", "capacityGridUi/reuse/fnd/Assert", "capacityGridUi/reuse/valuehelp/ValueHelpConfig"],
	function (UI5Object, Assert, ValueHelpConfig) {
		"use strict";

		return UI5Object.extend("capacityGridUi.reuse.valuehelp.ValueHelpConfigCollection", {
			_oConfigs: undefined,

			constructor: function () {
				this._oConfigs = {};
			},

			set: function (sName, oData) {
				let oConfig = new ValueHelpConfig(oData);
				this._oConfigs[sName] = oConfig;
			},

			get: function (sName) {
				let oConfig = this._oConfigs[sName];
				Assert.ok(oConfig, "no config added for " + sName);
				return oConfig;
			}
		});
	}
);
