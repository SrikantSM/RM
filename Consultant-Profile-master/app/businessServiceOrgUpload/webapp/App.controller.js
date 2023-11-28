sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Locale",
    "sap/ui/core/Fragment",
    "sap/ui/core/InvisibleMessage",
    "sap/ui/core/library"
], function (Controller, JSONModel, Locale, Fragment, InvisibleMessage, library) {
    "use strict";
    var invisibleMessageMode = library.InvisibleMessageMode;
    return Controller.extend("businessServiceOrgUpload.App", {
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
                messageText: undefined,
                messageLinkVisible: false,
                failedUpload: [],
                errorMessages: [],
                errorsForUI: []
            });
            this.getView().setModel(this.uiModel, "ui");
            this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(),invisibleMessageMode.Polite);
        },

        handleUploadComplete: function (oEvent) {
            this.uiModel.setProperty("/busy", false);
            var iStatus = oEvent.getParameter("status");
            var oMessage;
            try {
                oMessage = JSON.parse(oEvent.getParameter("responseRaw"));
            } catch (error) {
                // don't do anything, fail with default error message
            }
            this.getView().byId("fileUploader").setValue("");
            this._handleResponse(iStatus, oMessage);
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
                this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(),invisibleMessageMode.Assertive);
                return;
            }
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

        handleMoreLinkPress: function (oEvent) {
            this.getErrorDialog().then(function (oDialog) {
                oDialog.open();
            });
        },

        handleCloseErrorDialog: function (oEvent) {
            this.getErrorDialog().then(function (oDialog) {
                oDialog.close();
            });
        },

        /**
     * Find the dialog defined in the fragment or create it if it doesn't exist
     * @returns {Promise} Promise resolving with the root control of the fragment
     */
        getErrorDialog: function () {
            if (!this.oDialogPromise) {
                var oView = this.getView();
                this.oDialogPromise = Fragment.load({
                    name: "businessServiceOrgUpload.ErrorDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
                return this.oDialogPromise;
            }
            return this.oDialogPromise;
        },

        /**
     * Reads the URI for the File Upload Service from the Manifest
     * @returns {string} The URI
     */
        _getServiceUri: function () {
            var oComponent = this.getOwnerComponent();
            return oComponent.getManifestObject().resolveUri(oComponent.getManifestEntry("/sap.app/dataSources/fileUploadService/uri"));
        },

        handleDownloadPress: function (oEvent) {
            this.uiModel.setProperty("/messageVisible", false);
            this.uiModel.setProperty("/busy", true);

            jQuery.ajax({
                method: "GET",
                url: this._getDownloadServiceUri(),
                xhrFields: {
                    responseType: 'blob'
                }
            }).done(function (blob) {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = "ServiceOrgTemplate" + ".csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", errorThrown);
                this.uiModel.setProperty("/messageVisible", true);
            }.bind(this)).always(function () {
                this.uiModel.setProperty("/busy", false);
            }.bind(this));
        },

        _getDownloadServiceUri: function () {
            var oComponent = this.getOwnerComponent();
            return oComponent.getManifestObject().resolveUri(oComponent.getManifestEntry("/sap.app/dataSources/fileDownloadService/uri"));
        },

        /**
     * Set properties of the UI Model so the response is shown to the user
     * @param {int} iStatus HTTP Status Code
     * @param {object|undefined} oMessage JSON Response as Object (or undefined)
     */
        _handleResponse: function (iStatus, oMessage) {
            if (iStatus !== 200) {
                var oMessageText = oMessage && oMessage.message;
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", oMessageText || this._translateText("errorUploadUnknown"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(),invisibleMessageMode.Assertive);
            } else {
                var aErrors = oMessage && oMessage.errors || [];
                var aCreatedHeaders = oMessage && oMessage.createdHeaders || 0;
                var iProcessedItemsCount =  oMessage && oMessage.createdItems || [];
                if (aErrors.length > 0 && iProcessedItemsCount == 1 ) {
                    aCreatedHeaders = 0;
                }
                //when CSV has no records to be processed the set output to 0
                if (iProcessedItemsCount < 1 || iProcessedItemsCount == null || iProcessedItemsCount == undefined ) {
                    iProcessedItemsCount = 0;
                    aCreatedHeaders = 0;
                }
                this.uiModel.setProperty("/messageText", this._translateText("uploadResult", [iProcessedItemsCount, aCreatedHeaders]));
                if (aErrors.length > 0) {
                    this.uiModel.setProperty("/messageType", "Warning");
                    this.uiModel.setProperty("/messageLinkVisible", true);
                    this.uiModel.setProperty("/errors", aErrors);
                } else {
                    this.uiModel.setProperty("/messageType", "Success");
                }
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("uploadMessageStrip").getText(),invisibleMessageMode.Assertive);
            }
        },

        /**
     * Translates texts. Fully exposes the interface of ResourceBundle.getText()
     * @param {string} sTextId ID of the text to be translated
     * @returns {string} The translated text
     */
        _translateText: function (sTextId) {
            if (!this.oResourceBundle) {
                this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            }
            return this.oResourceBundle.getText.apply(this.oResourceBundle, arguments);
        },
        //
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
