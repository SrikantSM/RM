sap.ui.define([
  "sap/fe/test/ObjectPage",
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/actions/EnterText",
  "skill-proficiency/test/integration/pages/Common"
],
function (ObjectPage, Opa5, Press, EnterText, Common) {
  "use strict";

  // OPTIONAL
  var AdditionalCustomObjectPageDefinition = {
    actions: {},
    assertions: {}
  };

  AdditionalCustomObjectPageDefinition.actions = Object.assign({}, Common.actions, AdditionalCustomObjectPageDefinition.actions);
  AdditionalCustomObjectPageDefinition.assertions = Object.assign({}, Common.assertions, AdditionalCustomObjectPageDefinition.assertions);

  return new ObjectPage(
    {
      appId: "skill-proficiency", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "ProficiencyLevelsDetails", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "ProficiencyLevels" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomObjectPageDefinition
  );
});
