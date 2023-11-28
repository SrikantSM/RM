sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	return UI5Object.extend("capacityGridUi.reuse.valuehelp.ValueHelpConfig", {
		constructor: function (oConfig) {
			this.component = oConfig.component;
			this.modelName = oConfig.modelName ? oConfig.modelName : "";
			this.modelPath = oConfig.modelName ? oConfig.modelName + ">" : "";
			this.entityPath = oConfig.entityPath;
			this.entityName = oConfig.entityName;
			this.idProperty = oConfig.idProperty;
			this.textProperty = oConfig.textProperty;
			this.properties = oConfig.properties;
			this.customParameters = oConfig.customParameters;
			this.customFilters = oConfig.customFilters;
			this.setDialogMaxWidth = oConfig.setDialogMaxWidth;
		},

		getGroupingProperties: function () {
			let aGroupingProperties = [];
			for (let i = 0; i < this.properties.length; i++) {
				if (this.properties[i].groupable) {
					aGroupingProperties.push(this.properties[i].name);
				}
			}
			return aGroupingProperties;
		}
	});
});
