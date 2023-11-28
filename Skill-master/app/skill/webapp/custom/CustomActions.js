sap.ui.define(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox"], function (Filter, FilterOperator, MessageBox) {
  "use strict";

  var oApi = {
    extensionApi: undefined,
    liveChangeTimeout: undefined,

    openAssignCatalogsDialog: function () {
      oApi._openDialog(this, true);
    },

    openUnassignCatalogsDialog: function () {
      oApi._openDialog(this, false);
    },

    onConfirmDialog: function (oEvent) {
      var aCatalogIds = oEvent.getParameter("selectedItems").map(function (s) { return s.data("ID"); });
      var oBindingContext = oEvent.getSource().getBindingContext();
      var oModel = oEvent.getSource().getModel();
      var oCatalogAssignmentModel = oEvent.getSource().getModel("catalogAssignment");
      var triggeredAction = oEvent.getSource().data("triggeredAction");
      var i18nResourceBundle = oEvent.getSource().getModel("i18n").getResourceBundle();
      if (aCatalogIds.length === 0) {
        MessageBox.warning(i18nResourceBundle.getText("noCatalogsSelected"), {
          title: i18nResourceBundle.getText("warningDialogTitle")
        });
        return;
      }
      oApi.extensionApi.editFlow.securedExecution(function () {
        try {
          var oActionContext = oModel.bindContext(triggeredAction, oBindingContext);
          oActionContext.setParameter("catalog_IDs", aCatalogIds);

          return oActionContext.execute()
            .then(function (oActionContext) {
              // store that an assignment/unassignment has taken place so
              // that the List Report can be refreshed on back navigation
              oCatalogAssignmentModel.setProperty("/hasChanged", true);

              //refresh the object page section "catalogAssociations"
              return oApi.extensionApi.refresh("catalogAssociations");
            });

        } catch (e) {
          return Promise.reject(e);
        }
      }, {
        updatesDocument: false,
        busy: {
          set: true,
          check: false
        }
      });
    },

    onSearchCatalogs: function (oEvent) {
      clearTimeout(oApi.liveChangeTimeout);
      oApi.searchBinding(oEvent.getSource().getBinding("items"), oEvent.getParameter("value"));
    },

    onLiveChangeCatalogs: function (oEvent) {
      clearTimeout(oApi.liveChangeTimeout);
      var oBinding = oEvent.getSource().getBinding("items");
      var sValue = oEvent.getParameter("value");
      oApi.liveChangeTimeout = setTimeout(function () {
        oApi.searchBinding(oBinding, sValue);
      }, 300);
    },

    searchBinding: function (oBinding, sValue) {
      oBinding.changeParameters({
        "$search": sValue || undefined // explicity set undefined to unset the value on empty string
      });
    },

    /**
     * extension api is needed in order to use singleton
     * @param {*} oExtensionApi is needed in order to use singleton
     * @returns {Promise} dialog promise
     */
    _getCatalogsAssignmentDialog: function (oExtensionApi) {
      oApi.extensionApi = oExtensionApi;
      if (!oExtensionApi.pDialogPromise) {
        oExtensionApi.pDialogPromise = oExtensionApi.loadFragment({
          id: "skill::SkillsObjectPage",
          name: "skill.view.CatalogsAssignmentDialog",
          controller: oApi
        });
      }
      return oExtensionApi.pDialogPromise;
    },

    _openDialog: function (oExtensionApi, isAssign) {
      oApi._getCatalogsAssignmentDialog(oExtensionApi).then(function (oDialog) {
        var i18nResourceBundle = oDialog.getModel("i18n").getResourceBundle();
        var oDialogConfiguration = new sap.ui.model.json.JSONModel({
          title: i18nResourceBundle.getText(isAssign ? "assignCatalogs" : "unassignCatalogs"),
          noDataText: i18nResourceBundle.getText(isAssign ? "noCatalogsFound" : "noCatalogsAssigned"),
          triggeredAction: isAssign ? "SkillService.assignCatalogs(...)" : "SkillService.unassignCatalogs(...)"
        });
        oDialog.setModel(oDialogConfiguration, "dialogConfiguration");
        var sSkillId = oDialog.getBindingContext().getProperty("ID");
        var oBinding = oDialog.getBinding("items");
        oBinding.filter(new Filter({
          path: "skillAssociations",
          operator: isAssign ? FilterOperator.All : FilterOperator.Any,
          variable: "c2s",
          condition: new Filter("c2s/skill_ID", isAssign ? FilterOperator.NE : FilterOperator.EQ, sSkillId)
        }));
        // We do not pass the second parameter here, thus the $search will be removed
        oApi.searchBinding(oBinding);
        oDialog.open();
      });
    }
  };

  return oApi;
});
