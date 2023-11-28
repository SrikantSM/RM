sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("myAssignmentsUi.controller.BaseController", {

        getModel: function(name) {
            return this.getView().getModel(name);
        },

        getModelProperty: function(name, path) {
            return this.getView().getModel(name).getProperty(path);
        },

        setModel: function(oModel, name) {
            return this.getView().setModel(oModel, name);
        },

        setModelProperty: function(name, path, data) {
            return this.getView().getModel(name).setProperty(path, data);
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getI18nText: function(sKey, args) {
            return this.getResourceBundle().getText(sKey, args);
        }

    });

});
