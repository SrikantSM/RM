sap.ui.define(["sap/m/Text"], function (Text) {
	"use strict";
	return {
		getTextControl: function (oConfig, oProperty) {
			let fnFormatter = this._getFormatter(oProperty);
			if (oProperty.additionalName) {
				let oDataBinding = {
					parts: [{ path: oConfig.modelPath + oProperty.name }, { path: oConfig.modelPath + oProperty.additionalName }],
					formatter: fnFormatter
				};
				return new Text({
					text: oDataBinding,
					tooltip: oDataBinding,
					maxLines: 2
				});
			} else {
				return new Text({
					text: {
						path: oConfig.modelPath + oProperty.name
					},
					tooltip: {
						path: oConfig.modelPath + oProperty.name
					},
					maxLines: 2
				});
			}
		},

		_getFormatter: function (oProperty) {
			if (oProperty.formatter) {
				return oProperty.formatter;
			} else {
				return function (sName, sAdditionalName) {
					if (sAdditionalName) {
						return sAdditionalName + " (" + sName + ")";
					} else {
						return sName;
					}
				};
			}
		}
	};
});
