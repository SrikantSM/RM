sap.ui.define([
  "sap/fe/test/ListReport",
  "skill/test/integration/pages/Common"
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
      appId: "skill", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "SkillsListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "Skills" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomListReportDefinition
  );
});
