sap.ui.define([
  "sap/ui/core/mvc/ControllerExtension",
  "sap/base/Log"
], function (ControllerExtension, Log) {
  "use strict";
  var LIST_REPORT_ROUTE_NAME = "SkillsList";

  return ControllerExtension.extend("skill.ext.controller.ListReportExtension", {
    override: { // this not an overwrite of the base onInit but rather an extend
      onInit: function () {
        this.oLogger = Log.getLogger("skill.ext.controller.ListReportExtension");
        this.oAppComponent = this.base.getAppComponent();
        this.oAssignCatalogsModel = this.oAppComponent.getModel("catalogAssignment");

        this.oAppComponent.getRouter().attachRoutePatternMatched(this.onRoutePatternChanged, this);
      },
      onExit: function () {
        this.oAppComponent.getRouter().detachRoutePatternMatched(this.onRoutePatternChanged, this);
      }
    },

    /**
       * Listener to refresh the List Report table after an assign/unassign Action happened and
       * the user nagivated back from the Object Page.
       *
       * @param {*} oEvent a routePatternMatched event fired when the route pattern changed.
       */
    onRoutePatternChanged: function (oEvent) {
      var sRouteName = oEvent.getParameter("name");
      this.oLogger.trace("Route pattern changed to " + sRouteName);
      if (sRouteName === LIST_REPORT_ROUTE_NAME && this.oAssignCatalogsModel.getProperty("/hasChanged")) {
        this.oLogger.debug("Refreshing the List Report as route changed to " + sRouteName
            + "and catalogs assignments have changed");
        this.oAssignCatalogsModel.setProperty("/hasChanged", false);
        this.base.getExtensionAPI().refresh();
      }
    }
  });
});
