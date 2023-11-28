sap.ui.define(["sap/fe/test/ListReport", "skill-catalog/test/integration/pages/Common", "sap/ui/test/actions/Press"], function (ListReport, Common, Press) {
  "use strict";

  // OPTIONAL
  var AdditionalCustomListReportDefinition = {
    actions: {
      iUnselectRow: function () {
        this.waitFor({
          id: "skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem-innerTable-clearSelection",
          actions: new Press()
        });
      },
      iSelectTheRow: function () {
        this.waitFor({
          controlType: "sap.m.CheckBox",
          viewId: "skill-catalog::CatalogsListReport",
          properties: {
            editable: true
          },
          actions: new Press({
            idSuffix: "CbBg"
          })
        });
      }
    },
    assertions: {}
  };

  AdditionalCustomListReportDefinition.actions = Object.assign({}, Common.actions, AdditionalCustomListReportDefinition.actions);
  AdditionalCustomListReportDefinition.assertions = Object.assign({}, Common.assertions, AdditionalCustomListReportDefinition.assertions);

  return new ListReport(
    {
      appId: "skill-catalog", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "CatalogsListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "Catalogs" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomListReportDefinition
  );
});
