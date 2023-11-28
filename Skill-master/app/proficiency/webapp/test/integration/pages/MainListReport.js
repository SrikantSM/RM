sap.ui.define([
  "sap/fe/test/ListReport",
  "skill-proficiency/test/integration/pages/Common"

], function (ListReport, Common) {
  "use strict";

  // OPTIONAL
  var AdditionalCustomListReportDefinition = {
    actions: {},
    assertions: {}
  };

  AdditionalCustomListReportDefinition.actions = Object.assign({}, Common.actions, AdditionalCustomListReportDefinition.actions);
  AdditionalCustomListReportDefinition.assertions = Object.assign({}, Common.assertions, AdditionalCustomListReportDefinition.assertions);

  return new ListReport(
    {
      appId: "skill-proficiency", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "ProficiencySetsList", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "ProficiencySets" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomListReportDefinition
  );
});
