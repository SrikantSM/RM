sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Locale",
  "sap/ui/core/Fragment",
  "sap/ui/core/InvisibleMessage",
  "sap/ui/core/library",
  "sap/base/Log",
  "./Formatter"
], function (Controller, JSONModel, Locale, Fragment, InvisibleMessage, coreLibrary, Log, Formatter) {
  "use strict";

  var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;

  return Controller.extend("skill-upload.App", {

    refreshInterval: 5000, // in milliseconds

    formatter: Formatter,

    onInit: function () {
      this.oLogger = Log.getLogger("skill-upload.Component");
      this.initializeAccessibilityMessages();
      this.uiModel = new JSONModel({
        busy: false,
        serviceUri: this._getServiceUri(),
        uploadLanguage: "",
        userLocale: sap.ui.getCore().getConfiguration().getLanguageTag(),
        csrfToken: undefined,
        maxFileUploadSize: 10, // in MB
        messageVisible: false,
        messageType: undefined,
        messageText: undefined,
        messageCode: ""
      });
      this.getView().setModel(this.uiModel, "ui");
      this.refreshUploadJobPeriodically();
    },

    handleUploadComplete: function (oEvent) {
      this.refreshUploadJobModel();
      this.refreshUploadJobPeriodically(); //reset the periodical refresh
      this.uiModel.setProperty("/busy", false);
      var iStatus = oEvent.getParameter("status");
      var oMessage;
      try {
        oMessage = JSON.parse(oEvent.getParameter("responseRaw"));
      } catch (error) {
        // don't do anything, fail with default error message
      }
      this._handleResponse(iStatus, oMessage);
    },

    handleUploadPress: function (oEvent) {
      if (this.uiModel.getProperty("/busy")) {
        return;
      }

      //reset the messageCode for failures
      this.uiModel.setProperty("/messageCode", "");

      if (!this.getView().byId("fileUploader").getValue()) {
        this.uiModel.setProperty("/messageType", "Error");
        this.uiModel.setProperty("/messageText", this._translateText("errorNoFile"));
        this.uiModel.setProperty("/messageVisible", true);
        this.announceNewMessageStrips();
        return;
      }
      if (!this.getView().byId("languageInput").getValue()) {
        this.uiModel.setProperty("/messageType", "Error");
        this.uiModel.setProperty("/messageText", this._translateText("errorNoLanguage"));
        this.uiModel.setProperty("/messageVisible", true);
        this.announceNewMessageStrips();
        return;
      }
      this.uiModel.setProperty("/busy", true);
      this.uiModel.setProperty("/messageVisible", false);
      var oFileUploader = this.byId("fileUploader");
      this._handleCsrfToken().then(function () {
        oFileUploader.upload();
      });
    },

    handleFileChange: function (oEvent) {
      var sPath = oEvent.getParameter("newValue");
      var oResult = sPath.match(/.*_([^_]*)\.csv/);
      if (oResult && oResult[1]) {
        // sap/ui/core/Locale handles normalization, but no validation

        var oLocale = new Locale(oResult[1]);
        this.uiModel.setProperty("/uploadLanguage", oLocale.toString());
      }
      this.uiModel.setProperty("/messageVisible", false);
    },

    handleFileSizeExceed: function (oEvent) {
      this.uiModel.setProperty("/messageVisible", true);
      this.uiModel.setProperty("/messageType", "Error");
      this.uiModel.setProperty("/messageText", this._translateText("maxFileUploadSizeExceeded", this.uiModel.getProperty("/maxFileUploadSize")));
      this.announceNewMessageStrips();
    },

    handleShowDetailsLinkPress: function (oEvent) {
      this.getErrorDialog().then(function (oDialog) {
        oDialog.getContent()[0].getBinding("items").refresh();
        oDialog.getContent()[0].navigateBack();
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
          name: "skill-upload.ErrorDialog",
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
     * Initialize the Accessibility Messages:
     * - Set up this.oInvisibleMessage to announce new MessageStrips
     * - Attach to the Model for UploadJob state changes
     */
    initializeAccessibilityMessages: function () {
      this.oInvisibleMessage = InvisibleMessage.getInstance();

      var oBindingContext = this.getView().byId("messageStripVerticalLayout").getObjectBinding("skill").getBoundContext();
      var oStateBinding = this.getView().getModel("skill").bindProperty("state", oBindingContext);
      var sPreviousState = null;
      var that = this;

      oStateBinding.attachChange(function (oEvent) {
        var sState = oEvent.getSource().getValue();
        if (sPreviousState && sPreviousState !== sState) {
          that.announceNewMessageStrips();
        }
        sPreviousState = sState;
      });
    },

    /**
     * Announce upcoming message strips through the InvisibleMessage utility for accessibility
     * This method uses setTimeout to wait until the UI has updated itself to show the new messages.
     */
    announceNewMessageStrips: function () {
      setTimeout(this._announceMessageStrips.bind(this));
    },

    /**
     * Announce currently visible message strips through the InvisibleMessage utility for accessibility
     * Do not use this method directly, as in most cases, it will read the outdated message.
     * Use only announceNewMessageStrips, which waits for another round of redrawing the UI.
     */
    _announceMessageStrips: function () {
      var aMessageStripWithDetailsIds = ["uploadMessageStripWarning"];
      var aMessageStripIds = aMessageStripWithDetailsIds.concat([
        "uploadMessageStripSuccess", "uploadMessageStripError",
        "uploadMessageStripRunning, uploadMessageStripLastUpdatedBy", "uploadMessageStripUploadRunningBy",
        "messageStripWithoutUploadJob"
      ]);
      var that = this;

      aMessageStripIds.forEach(function (sId) {
        var oStrip = that.getView().byId(sId);
        if (oStrip && oStrip.getVisible && oStrip.getVisible()) {
          var sText = that._translateText("newMessageStrip", [oStrip.getText()]);
          that.oInvisibleMessage.announce(sText, InvisibleMessageMode.Polite);
          if (aMessageStripWithDetailsIds.includes(sId)) {
            that.oInvisibleMessage.announce(that._translateText("newMessageStripShowDetails"), InvisibleMessageMode.Polite);
          }
        }
      });
    },

    /**
     * Reads the URI for the File Upload Service from the Manifest
     * @returns {string} The URI
     */
    _getServiceUri: function () {
      var oComponent = this.getOwnerComponent();
      return oComponent.getManifestObject().resolveUri(oComponent.getManifestEntry("/sap.app/dataSources/fileUploadService/uri"));
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
        this.uiModel.setProperty("/messageCode", "" + iStatus);
        this.announceNewMessageStrips();
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
     * Fetch a CSRF token and set it at the file upload. If a csrf token was
     * already prefetched for the odata model, use this.
     * @returns {Promise} A promise resolving when the CSRF Token is in Place
     */
    _handleCsrfToken: function () {
      var sUrl = window.location.origin;
      var uiModel = this.uiModel;
      return new Promise(function (resolve) {
        if (this._updateCsrfTokenFromODataModel()) {
          resolve();
        } else {
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
        }
      }.bind(this));

    },

    /**
     * Check if the existing ODataModel already prefetched an CSRF-Token and reuse it for the ui model.
     * @returns {boolean} true if a CSRF-Token could be found, false otherwise.
     */
    _updateCsrfTokenFromODataModel: function () {
      var oODataModel = this.getView().getModel("skill");
      if (oODataModel.getHttpHeaders().hasOwnProperty("X-CSRF-Token")) {
        var sToken = oODataModel.getHttpHeaders()["X-CSRF-Token"];
        this.uiModel.setProperty("/csrfToken", sToken);
        return true;
      } else {
        this.oLogger.warning("No csrf token could be retrieved from the ODataModel!");
        return false;
      }
    },

    refreshUploadJobPeriodically: function () {
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
      }
      var that = this;
      this.timeoutHandle = setTimeout(function triggerRefreshUploadJobModel() {
        that.getView().byId("messageStripVerticalLayout").getObjectBinding("skill").attachEventOnce("dataReceived", function () {
          that.oLogger.debug("Data received for upload job model");
          that.timeoutHandle = setTimeout(triggerRefreshUploadJobModel, that.refreshInterval);
        });
        that.refreshUploadJobModel();
      }, that.refreshInterval); // in milliseconds
    },

    refreshUploadJobModel: function () {
      this.oLogger.debug("Triggering refresh for upload job model");
      this.getView().byId("uploadButton").getObjectBinding("skill").refresh();
      this.getView().byId("messageStripVerticalLayout").getObjectBinding("skill").refresh();
    },

    onExit: function () {
      // Stop the interval for update uploadJob model
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
      }
    }
  });
});
