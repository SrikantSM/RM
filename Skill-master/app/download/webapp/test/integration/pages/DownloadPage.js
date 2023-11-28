sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/matchers/Properties",
  "sap/ui/test/matchers/Ancestor",
  "sap/ui/test/actions/EnterText"
], function (Opa5, Press, Properties, Ancestor, EnterText) {
  "use strict";

  var PREFIX_ID = "application-Skill-Download-component---app--";
  Opa5.createPageObjects({
    onTheDownloadPage: {

      actions: {
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
         * See the error message strip
         * @param {*} sId Id of the element
         * @param {*} sErrorMessage expected error message
         * @returns {*} Opa5.waitFor()
         */
        iShouldSeeFileDownloadErrorMessage: function (sId, sErrorMessage) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            success: function (oMessageStrip) {
              Opa5.assert.ok((oMessageStrip.getText() === sErrorMessage) && (oMessageStrip.getType() === "Error"), "Seen");
            },
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        },
        iShouldSeeFileDownloadSuccessMessage: function (sId) {
          return this.waitFor({
            id: PREFIX_ID + sId,
            success: function (oMessageStrip) {
              Opa5.assert.ok(oMessageStrip.getType() === "Success", "Seen");
            },
            errorMessage: "Can't see " + PREFIX_ID + sId
          });
        }
      }
    }
  });
});
