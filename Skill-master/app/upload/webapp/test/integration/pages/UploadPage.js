sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/matchers/Properties",
  "sap/ui/test/matchers/Ancestor",
  "sap/ui/test/actions/EnterText"
], function (Opa5, Press, Properties, Ancestor, EnterText) {
  "use strict";

  var PREFIX_ID = "application-Skill-Upload-component---app--";

  Opa5.createPageObjects({
    onTheUploadPage: {

      actions: {
        /**
         * select a file that is too large for file upload
         * @param {*} sId Id of the element
         * @returns {*} Opa5.waitFor()
         */
        iSelectALargeFile: function (sId) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            actions: function (oFileUploader) {
              oFileUploader.fireFileSizeExceed({
                fileName: "tooLarge.csv",
                fileSize: 10000000000000
              });
            },
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        },
        /**
         * select a file for fileupload
         * @param {*} sId Id of the element
         * @param {*} sFileName filename to put in the fileuploader form
         * @returns {*} Opa5.waitFor()
         */
        iSelectAFile: function (sId, sFileName) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            actions: function (oFileUploader) {
              var mParameters = {
                files: {
                  "0": {
                    "name": sFileName,
                    "type": "application/vnd.ms-excel",
                    "size": 4000,
                    "lastModifiedDate": "2019-08-14T09:42:09.000Z",
                    "webkitRelativePath": ""
                  },
                  "length": 1
                },
                newValue: sFileName
              };
              oFileUploader.setValue(sFileName);
              oFileUploader.fireChange(mParameters);
            },
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        },
        /**
         * Click on an element
         * @param {*} sId Id of the element
         * @returns {*} Opa5.waitFor()
         */
        iClickOnElement: function (sId) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            actions: new Press()
          });
        },
        /**
         * Click on Close in error dialog
         * @param {*} sId Id of the element
         * @returns {*} Opa5.waitFor()
         */
        iClickOnClose: function () {
          return this.waitFor({
            id: "buttonClose",
            actions: new Press()
          });
        },
        /**
         * Simulate uploading a file with missing mandatory fields
         * @param {*} sId Id of the element
         * @param {*} sMessage Message from the backend
         * @returns {*} Opa5.waitFor()
         */
        iUploadAFileWithBadRequest: function (sId, sMessage) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            actions: function (oFileUploader) {
              var responseRaw = {
                timestamp: "2019-12-09T09:56:52.556+0000",
                status: 400,
                error: "Bad Request",
                message: sMessage,
                path: "/api/internal/upload/skills/csv"
              };
              JSON.stringify(responseRaw);
              var mParameters = {
                fileName: "MultipartFile",
                responseRaw: JSON.stringify(responseRaw),
                status: 400
              };
              oFileUploader.fireUploadComplete(mParameters);
            }
          });
        },
        mockUploadJob: function (oUploadJob) {
          var that = this;
          return this.waitFor({
            actions: function () {
              var oResponse = jQuery.ajax({
                url: "/api/internal/test/uploadjob",
                type: "POST",
                data: JSON.stringify(oUploadJob),
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                }
              });
              that.iWaitForPromise(oResponse);
            }
          });
        },
        iTypeLettersIntoLanguageInput: function (sId, sText) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            actions: new EnterText({
              text: sText,
              keepFocus: true
            }),
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        }
      },

      assertions: {
        /**
         * See an element identified by id sId
         * @param {*} sId Id of the element
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeTheElement: function (sId) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            success: function () {
              Opa5.assert.ok(true, "Seen");
            },
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        },
        /**
         * See an element identified by id sId
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeErrorDialog: function () {
          return this.waitFor({
            id: "errorDialog",
            success: function () {
              Opa5.assert.ok(true, "Seen");
            },
            errorMessage: "Can't see error dialog"
          });
        },
        /**
         * See the language code filled in the file uploader form
         * @param {*} sId Id of the element
         * @param {*} sLanguageCode expected language code
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeLanguage: function (sId, sLanguageCode) {
          return this.waitFor({
            id: PREFIX_ID + sId,

            success: function (oInput) {
              Opa5.assert.ok(oInput.getValue() === sLanguageCode, "Seen");
            },
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        },

        /**
         * See the message strip
         * @param {*} sId Id of the element
         * @param {*} sType type of the element
         * @param {RegExp} oTextRegExp Optional RegExp that the element text must match with
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeFileUploadMessageStripWithMatchingRegExp: function (sId, sType, oTextRegExp) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            success: function (oMessageStrip) {
              Opa5.assert.ok(oMessageStrip.getType() === sType, "MessageStrip has correct type");
              if (oTextRegExp){
                console.log( oMessageStrip.getText());
                Opa5.assert.ok(oTextRegExp.exec(oMessageStrip.getText()), oMessageStrip.getText());
              }
            },
            errorMessage: "Can't see MessageStrip " + PREFIX_ID + sId
          });
        },

        /**
         * At Least on Entry should be shown in the drop down.
         * @param {*} sId Id of the input, for which the value help is shown
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeAtLeastOneValueHelpEntry: function (sId) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            success: function (oPopupList) {
              var aItems = oPopupList.getItems() || [];
              Opa5.assert.ok(aItems.length >= 1, "Value help has shown up successfully");
            }
          });
        },
        /**
         * Errors should be displayed in Error Dialog.
         * @param {*} sErrorMessage contains the text of the error message.
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeErrorInErrorDialog: function (sErrorMessage) {
          return this.waitFor({
            controlType: "sap.m.MessageListItem",
            matchers: {
              ancestor: {
                controlType: "sap.m.List"
              },
              properties: {
                title: sErrorMessage
              }
            },
            success: function () {
              Opa5.assert.ok(true, "Seen");
            },
            errorMessage: "Can't see error message " + sErrorMessage
          });
        }
      }
    }
  });
});
