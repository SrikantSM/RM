sap.ui.define([
  "sap/fe/test/ObjectPage",
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/actions/EnterText",
  "skill-catalog/test/integration/pages/Common"
],
function (ObjectPage, Opa5, Press, EnterText, Common) {
  "use strict";

  var PREFIX_ID = "skill-catalog::CatalogsObjectPage--";
  // OPTIONAL
  var AdditionalCustomObjectPageDefinition = {
    actions: {
      /**
       * Click on a skill name on the skills value help and then click on the OK button
       * @param {string} skill Text of the selected skill
       * @returns {*} Opa5.waitFor()
       */
      iSelectASkillFromTheValueHelp: function (skill) {
        var sOkId = "fe::table::skillAssociations::LineItem::TableValueHelp::skillAssociations::skill_ID" + "-ok";
        this.iClickOnTheElementTypeWithProperty("sap.m.Text", { text: skill });
        return this.waitFor({
          id: PREFIX_ID + sOkId,
          actions: new Press(),
          errorMessage: "Can't see " + PREFIX_ID + sOkId
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
      }
    }
  };

  AdditionalCustomObjectPageDefinition.actions = Object.assign({}, Common.actions, AdditionalCustomObjectPageDefinition.actions);
  AdditionalCustomObjectPageDefinition.assertions = Object.assign({}, Common.assertions, AdditionalCustomObjectPageDefinition.assertions);

  return new ObjectPage(
    {
      appId: "skill-catalog", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "CatalogsObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "Catalogs" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomObjectPageDefinition
  );
});
