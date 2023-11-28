/* eslint no-console: "off"  */
sap.ui.define(
	["sap/ui/base/Object", "sap/m/Dialog", "sap/m/Text", "sap/m/Button", "sap/ui/core/Icon", "sap/m/HBox", "sap/m/VBox"],
	function (Object, Dialog, Text, Button, Icon, HBox, VBox) {
		"use strict";

		return {
			string: function (sString, sMessage) {
				if (typeof sString !== "string") {
					let oError = new Error(sMessage);
					this._showAndLog(oError);
					throw oError;
				}
			},

			ok: function (oValue, sMessage) {
				if (!oValue) {
					let oError = new Error(sMessage);
					this._showAndLog(oError);
					throw oError;
				}
			},

			function: function (fnFunction, sMessage) {
				if (!this._isFunction(fnFunction)) {
					let oError = new Error(sMessage);
					this._showAndLog(oError);
					throw oError;
				}
			},

			_isFunction: function (fnFunction) {
				return !!fnFunction && {}.toString.call(fnFunction) === "[object Function]";
			},

			isA: function (oObject, sClass, sMessage) {
				if (!oObject.isA || !oObject.isA(sClass)) {
					let oError = new Error(sMessage);
					this._showAndLog(oError);
					throw oError;
				}
			},

			array: function (oObject, sMessage) {
				if (!Array.isArray(oObject)) {
					let oError = new Error(sMessage);
					this._showAndLog(oError);
					throw oError;
				}
			},

			notArray: function (oObject, sMessage) {
				if (Array.isArray(oObject)) {
					let oError = new Error(sMessage);
					this._showAndLog(oError);
					throw oError;
				}
			},

			_showAndLog: function (oError) {
				// async show
				setTimeout(function () {
					let oIcon = new Icon({
						src: "sap-icon://collision",
						size: "5rem",
						color: "rgb(187,15,23)"
					});
					oIcon.addStyleClass("sapUiSmallMarginEnd");
					let oMoreText = new Text({ text: "Find the full stack trace in the console" });
					oMoreText.addStyleClass("sapUiSmallMarginTop");
					let oText = new Text({});
					oText.setText(oError.message); // must use setter for the message as the constructor interprets "{" as binding syntax
					let oDialog = new Dialog({
						type: "Message",
						contentWidth: "440px",
						icon: "sap-icon://xxx", // disables the icon
						title: "Assertion Failed",
						content: [
							new HBox({
								items: [
									oIcon,
									new VBox({
										items: [oText, oMoreText]
									})
								]
							})
						],
						endButton: new Button({
							text: "Close",
							press: function () {
								oDialog.close();
							}
						})
					});
					oDialog.open();
				}, 0);

				// to console
				if (console && console.error) {
					console.error(oError);
				}
			}
		};
	}
);
