sap.ui.define([
    "sap/ui/model/Model"
], function (Model) {
    "use strict";

    return Model.extend("test.unit.helper.FakeI18nModel", {

        constructor : function (oData) {
            Model.call(this);
            this.oData = oData || {};
        },

        getProperty : function (sProperty) {
            return this.oData[sProperty];
        }

    });

});
