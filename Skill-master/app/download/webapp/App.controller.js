sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/InvisibleMessage",
  "sap/ui/core/library",
  "sap/ui/model/json/JSONModel"
], function (Controller, InvisibleMessage, coreLibrary, JSONModel) {
  "use strict";

  var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;

  return Controller.extend("skill-download.App", {
    onInit: function () {
      this.oInvisibleMessage = InvisibleMessage.getInstance();
      this.uiModel = new JSONModel({
        busy: false,
        messageVisible: false,
        messageType: undefined,
        messageText: undefined
      });
      this.getView().setModel(this.uiModel, "ui");
    },

    handleDownloadPress: function (oEvent) {
      this.uiModel.setProperty("/messageVisible", false);
      if (!this.getView().byId("languageInput").getValue()) {
        this.uiModel.setProperty("/messageType", "Error");
        var sText = this._translateText("errorNoLanguage");
        this.uiModel.setProperty("/messageText", sText);
        this.uiModel.setProperty("/messageVisible", true);
        this.oInvisibleMessage.announce(this._translateText("newMessageStrip", [sText]), InvisibleMessageMode.Polite);
        return;
      }
      this.uiModel.setProperty("/busy", true);

      jQuery.ajax({
        method: "GET",
        url: this._getServiceUri(),
        headers: {
          "Accept-Language": sap.ui.getCore().getConfiguration().getLanguageTag()
        },
        xhr: function () {
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 2) {
              if (xhr.status === 200) {
                xhr.responseType = "blob";
              } else {
                xhr.responseType = "text";
              }
            }
          };
          return xhr;
        }
      }).done(this._onDownloadSuccess.bind(this)).fail(this._onDownloadFailure.bind(this)).always(function () {
        this.uiModel.setProperty("/busy", false);
      }.bind(this));
    },

    _onDownloadSuccess: function (blob, textStatus, xhr) {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "Skills_" + this.getView().byId("languageInput").getValue() + ".csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      var skillsDownloadedCounter = xhr.getResponseHeader("Skills-Downloaded-Counter");
      var skillsNotDownloadedCounter = xhr.getResponseHeader("Skills-Not-Downloaded-Counter");
      var skillsTotal = (Number(skillsDownloadedCounter) + Number(skillsNotDownloadedCounter)).toString();

      var sText = "";
      if (skillsNotDownloadedCounter === "0") {
        sText = this._translateText("downloadSuccessMessage", [skillsDownloadedCounter, skillsTotal]);
        this.uiModel.setProperty("/messageText", sText);
        this.uiModel.setProperty("/messageType", "Success");
      } else if (skillsNotDownloadedCounter === "1") {
        sText = this._translateText("downloadSuccessMessagePartialSingular", [skillsDownloadedCounter, skillsTotal, skillsNotDownloadedCounter]);
        this.uiModel.setProperty("/messageText", sText);
        this.uiModel.setProperty("/messageType", "Warning");
      } else {
        sText = this._translateText("downloadSuccessMessagePartialPlural", [skillsDownloadedCounter, skillsTotal, skillsNotDownloadedCounter]);
        this.uiModel.setProperty("/messageText", sText);
        this.uiModel.setProperty("/messageType", "Warning");
      }
      this.uiModel.setProperty("/messageVisible", true);
      this.oInvisibleMessage.announce(this._translateText("newMessageStrip", [sText]), InvisibleMessageMode.Polite);
    },

    _onDownloadFailure: function (jqXHR, textStatus, errorThrown) {
      var errorMessage;
      try {
        var errorObject = JSON.parse(jqXHR.responseText);
        errorMessage = errorObject.message;
      } catch (error) {
        //fall back is after catch block
      }
      errorMessage = errorMessage || this._translateText("errorDownloadUnknown");
      this.uiModel.setProperty("/messageType", "Error");
      this.uiModel.setProperty("/messageText", errorMessage);
      this.uiModel.setProperty("/messageVisible", true);
      this.oInvisibleMessage.announce(this._translateText("newMessageStrip", [errorMessage]), InvisibleMessageMode.Polite);
    },

    /**
     * Reads the URI for the File Download Service from the Manifest
     * @returns {string} The URI
     */
    _getServiceUri: function () {
      var oComponent = this.getOwnerComponent();
      return oComponent.getManifestObject().resolveUri(oComponent.getManifestEntry("/sap.app/dataSources/fileDownloadService/uri")
        + "?language=" + encodeURIComponent(this.getView().byId("languageInput").getValue()));
    },

    /**
     * Set properties of the UI Model so the response is shown to the user
     * @param {int} iStatus HTTP Status Code
     * @param {object|undefined} oMessage JSON Response as Object (or undefined)
     */
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
    }
  });
});
