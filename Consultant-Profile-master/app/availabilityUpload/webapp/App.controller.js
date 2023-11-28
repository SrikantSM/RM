sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/InvisibleMessage",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, InvisibleMessage, library, Fragment, Filter, FilterOperator,MessageToast) {
    "use strict";
    var invisibleMessageMode = library.InvisibleMessageMode;
    return Controller.extend("availabilityUpload.App", {
        onInit: function () {
            this.oInvisibleMessage = InvisibleMessage.getInstance();
            this.uiModel = new JSONModel({
                busy: false,
                serviceUri: this._getServiceUri(),
                userLocale: sap.ui.getCore().getConfiguration().getLanguageTag(),
                csrfToken: undefined,
                maxFileUploadSize: 2, // in MB
                messageVisible: false,
                messageType: undefined,
                messageText: undefined
            });
            this.getView().setModel(this.uiModel, "ui");
        },

        handleUploadComplete: function (oEvent) {
            this.uiModel.setProperty("/busy", false);
            var iStatus = oEvent.getParameter("status");
            var oMessage;
            try {
                oMessage = JSON.parse(oEvent.getParameter("responseRaw"));
            } catch (error) {
                // don't do anything, fail with default error message
                oMessage = JSON.stringify(oEvent.getParameter("responseRaw"));
            }
            this._handleResponse(iStatus, oMessage);
            this.getView().byId("fileUploader").setValue("");
            this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(), invisibleMessageMode.Assertive);
        },

        handleUploadPress: function (oEvent) {
            if (this.uiModel.getProperty("/busy")) {
                return;
            }

            this.uiModel.setProperty("/messageLinkVisible", false);
            if (!this.getView().byId("fileUploader").getValue()) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorNoFile"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            if (!this.getView().byId("costCenterInput").getValue()) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorNoCostCenter"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            //Dropdown selection validation
            if (this.getView().byId("costCenterInput").getValueState() == sap.ui.core.ValueState.Error) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorInvalidCostCenter"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            var sUri = this._getServiceUri();
            this.uiModel.setProperty("/serviceUri", sUri);
            this.uiModel.setProperty("/busy", true);
            this.uiModel.setProperty("/messageType", "None");
            this.uiModel.setProperty("/messageText", this._translateText("uploading"));
            var oFileUploader = this.byId("fileUploader");
            this._handleCsrfToken().then(function () {
                oFileUploader.upload();
            });
        },

        handleFileChange: function (oEvent) {
            var sPath = oEvent.getParameter("newValue");
            sPath.match(/.*_([^_]*)\.csv/);
        },

        handleFileSizeExceed: function (oEvent) {
            this.uiModel.setProperty("/messageVisible", true);
            this.uiModel.setProperty("/messageType", "Error");
            this.uiModel.setProperty("/messageText", this._translateText("maxFileUploadSizeExceeded", this.uiModel.getProperty("/maxFileUploadSize")));
        },

        handleChange: function (oEvent) {
            const oValidatedValueHelp = oEvent.getSource();
            const sSelectedKey = oValidatedValueHelp.getSelectedKey();
            const sValue = oValidatedValueHelp.getValue() || "";
            let bValidate = false;

            oEvent.getSource().getSuggestionItems().forEach(oItem => {
                const sKey = oItem.getKey() || "";
                if (sValue.toUpperCase() === sKey.toUpperCase() || sSelectedKey === sKey.toUpperCase()) {
                    bValidate = true;
                }
            });

            if (!bValidate) {
                oValidatedValueHelp.setValueState(sap.ui.core.ValueState.Error);
            } else {
                oValidatedValueHelp.setValueState(sap.ui.core.ValueState.None);
            }
        },

        onCostCenterInput: function (oEvent) {
            let sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();
            if (!this.pValueHelpCostCenter) {
                this.pValueHelpCostCenter = Fragment.load(
                    {
                        name: "availabilityUpload.fragment.CostCenter",
                        controller:this
                    }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }).catch((e)=>MessageToast.show("Cost center fragment failed to load"));
            }
            return this.pValueHelpCostCenter.then(function (oDailog){
                oDailog.open(sInputValue);
            }).catch((e)=>MessageToast.show("Cost center fragment failed to load"));
        },

        onSuggestCostCenter: function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            var aFilters = [];
            if (sTerm) {
                aFilters.push(new Filter("s4CostCenterId", FilterOperator.StartsWith, sTerm));
            }
            oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
        },

        onValueHelpDialogSearch:function(oEvent){
            const sValue = oEvent.getParameter("value");
            const sFilterPath = oEvent.getSource().data("FilterName");
            const oFilter  = new Filter(sFilterPath, FilterOperator.Contains, sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        onValueHelpDialogClose: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");

            if (!oSelectedItem) {
                return;
            }
            let costCenterDescription = oSelectedItem.getTitle();
            this.uiModel.setProperty('/selectedCostCenterId', costCenterDescription);
            var oInput = this.getView().byId("costCenterInput");
            oInput.setValue(costCenterDescription);
        },

        /**
         * Reads the URI for the File Upload Service from the Manifest
         * @returns {string} The URI
         */
        _getServiceUri: function () {
            var oComponent = this.getOwnerComponent();
            return oComponent.getManifestObject().resolveUri(oComponent.getManifestEntry("/sap.app/dataSources/fileUploadService/uri") + "?costcenter=" + encodeURI(this.getView().byId("costCenterInput").getValue()));
        },

        /**
         * Set properties of the UI Model so the response is shown to the user
         * @param {int} iStatus HTTP Status Code
         * @param {object|undefined} oMessage JSON Response as Object (or undefined)
         */
        _handleResponse: function (iStatus, oMessage) {
            if (iStatus !== 200) {
                var oMessageText = oMessage && oMessage.message;
                if (!oMessageText) {
                    if (oMessage.match("[a-zA-Z0-9]")) {
                        oMessageText = oMessage;
                    }
                }
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", oMessageText || this._translateText("errorUploadUnknown"));
                this.uiModel.setProperty("/messageVisible", true);
            } else {
                var aErrors = oMessage && oMessage.errors || 0;
                var aCreatedItems = oMessage && oMessage.createdItems || 0;
                var aResourceIDErrors = oMessage && oMessage.resourceIDErrors || 0;
                var iProcessedItemsCount = aErrors + aCreatedItems;
                if (aResourceIDErrors == 0) {
                    this.uiModel.setProperty("/messageText", this._translateText("uploadResult", [iProcessedItemsCount, aCreatedItems, aErrors]));
                } else {
                    aErrors = aErrors - aResourceIDErrors;
                    this.uiModel.setProperty("/messageText", this._translateText("uploadResultResourceID", [iProcessedItemsCount, aCreatedItems, aErrors, aResourceIDErrors]));
                }
                if (aErrors > 0) {
                    this.uiModel.setProperty("/messageType", "Warning");
                } else {
                    this.uiModel.setProperty("/messageType", "Success");
                }
                this.uiModel.setProperty("/messageVisible", true);
            }
        },

        /**
             * Translates texts. Fully exposes the interface of ResourceBundle.getText()
             * @param {string} sTextId ID of the text to be translated
             * @param {array} aTextArguments Arguments for text parameters
             * @returns {string} The translated text
             */
        _translateText: function (sTextId, aTextArguments) {
            if (!this.oResourceBundle) {
                this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            }
            return this.oResourceBundle.getText(sTextId, aTextArguments);
        },

        /**
         * Fetch a CSRF token and set it at the file upload
         * @returns {Promise} A promise resolving when the CSRF Token is in Place
         */
        _handleCsrfToken: function () {
            var sUrl = window.location.origin;
            var uiModel = this.uiModel;
            return new Promise(function (resolve) {
                jQuery.ajax({
                    method: "HEAD",
                    url: sUrl,
                    headers: {
                        "x-csrf-token": "fetch"
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var sToken = jqXHR.getResponseHeader("x-csrf-token");
                        uiModel.setProperty("/csrfToken", sToken);
                        resolve();
                    },
                    success: function (data, textStatus, jqXHR) {
                        var sToken = jqXHR.getResponseHeader("x-csrf-token");
                        uiModel.setProperty("/csrfToken", sToken);
                        resolve();
                    }
                });
            });
        }
    });
});
