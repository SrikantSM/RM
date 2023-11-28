sap.ui.define([
  "sap/fe/test/ObjectPage",
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/actions/EnterText",
  "skill/test/integration/pages/Common"
],
function (ObjectPage, Opa5, Press, EnterText, Common) {
  "use strict";

  var PREFIX_ID = "skill::SkillsObjectPage--";
  // OPTIONAL
  var AdditionalCustomObjectPageDefinition = {
    actions: {
      /**
       * Click on an element identified by id sId, e.g. a button sap.m.Button
       * @param {*} sId Id of the element
       * @returns {*} Opa5.waitFor()
       */
      iClickOnTheElement: function (sId) {
        return this.waitFor({
          id: PREFIX_ID + sId,
          actions: new Press(),
          errorMessage: "Can't see " + PREFIX_ID + sId
        });
      },
      /**
       * Type text into an element identified by id sId, e.g. the description of a skill
       * @param {*} sId Id of the element
       * @param {*} sText Text to be entered
       * @returns {*} Opa5.waitFor()
       */
      iTypeTextIntoTheElement: function (sId, sText) {
        return this.waitFor({
          id: PREFIX_ID + sId,
          actions: new EnterText({ text: sText }),
          errorMessage: "Can't see " + PREFIX_ID + sId
        });
      }
    },
    assertions: {
      /**
       * See an element identified id sId
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
       * See the row with row number iNumRows
       * @param {*} sInnerListId Inner table id of the table
       * @param {*} iNumRows Expected number of rows of the table
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeTheListRows: function (sInnerListId, iNumRows) {
        return this.waitFor({
          id: PREFIX_ID + sInnerListId,
          success: function (oList) {
            if (iNumRows === undefined) {
              Opa5.assert.ok(true, "Seen");
            } else {
              Opa5.assert.ok(oList.getItems().length === iNumRows, "Seen " + iNumRows + " rows");
            }
          },
          errorMessage: "Can't see " + PREFIX_ID + sInnerListId
        });
      },
      /**
       * See the language value help
       * @param {string} sSubentityName Navigation Name for the subentity for which the language should be set
       * @param {string} sSubentityProperty Property of the subentity for which the language should be set
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeALanguageValueHelp: function (sSubentityName, sSubentityProperty) {
        var sDialogId = "fe::table::" + sSubentityName + "::LineItem::TableValueHelp::" + sSubentityName + "::" + sSubentityProperty + "-dialog";
        return this.waitFor({
          id: PREFIX_ID + sDialogId,
          success: function () {
            Opa5.assert.ok(true, "Seen");
          },
          errorMessage: "Can't see " + PREFIX_ID + sDialogId
        });
      },
      iShouldSeeAnErrorMessageItem: function () {
        return this.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { type: "Negative" });
      },
      iShouldSeeTheRestrictErrorMessage: function () {
        this.waitFor({
          controlType: "sap.m.Text",
          properties: {
            text: "Error"
          },
          searchOpenDialogs: true,
          success: function(){
            Opa5.assert.ok(true, "Able to see the error after restrict");
          },
          errorMessage: "Cannot see the error after restrict."
        });
      },
      iCloseTheDialog: function () {
        this.waitFor({
          controlType: "sap.m.Button",
          properties: {
            text: "Close"
          },
          searchOpenDialogs: true,
          actions: new Press({
            idSuffix: "content"
          }),
          success: function(){
            Opa5.assert.ok(true, "Able to close the error dialog");
          },
          errorMessage: "Cannot close the error dialog."
        });
      }
    }
  };

  AdditionalCustomObjectPageDefinition.actions = Object.assign({}, Common.actions, AdditionalCustomObjectPageDefinition.actions);
  AdditionalCustomObjectPageDefinition.assertions = Object.assign({}, Common.assertions, AdditionalCustomObjectPageDefinition.assertions);

  return new ObjectPage(
    {
      appId: "skill", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "SkillsObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "Skills" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomObjectPageDefinition
  );
});
