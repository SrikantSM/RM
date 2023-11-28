sap.ui.define([
    "sap/ui/core/Fragment",
    "myResourcesUi/controller/ResourceQuickView",
    "sap/ui/model/resource/ResourceModel"
], function (Fragment, ResourceQuickView, ResourceModel) {
    "use strict";
    return {

        onLinkPress: function (oEvent) {
            var oView = this._view;
            var _controller = new ResourceQuickView();
            var oLink = oEvent.getSource();
            if (!this.oResourceQuickView) {
                this.oResourceQuickView = Fragment.load({
                    id: "resourceQuickViewFragment",
                    name: "myResourcesUi.fragment.ResourceQuickView",
                    controller: _controller
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            if (!oView.getModel("i18ned")) {
                var i18nModel = new ResourceModel({
                    bundleName: "myResourcesUi.i18n.i18n"
                });
                oView.setModel(i18nModel, "i18ned");
            }
            var oData = oEvent.getSource().getBindingContext().getObject();
            var oEmployee = oData.profile;
            var resourceID = oData.ID;
            this.oResourceQuickView.then(function (oDialog) {
                _controller.getResourcePopupModel(oEmployee,resourceID, oView.getModel("i18ned")).then(function (oModel) {
                    oDialog.setModel(oModel);
                    oDialog.openBy(oLink);
                });
            });
        }
    };
});
