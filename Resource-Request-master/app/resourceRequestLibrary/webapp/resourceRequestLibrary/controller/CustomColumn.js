sap.ui.define(
	[
		"sap/ui/core/Fragment",
		"resourceRequestLibrary/controller/ResourceQuickView",
		"sap/ui/model/resource/ResourceModel"
	],
	function(Fragment, ResourceQuickView, ResourceModel) {
		return {

			linkPressed: function(oEvent) {
				const oView = this._view;
				const _controller = new ResourceQuickView();
				const oLink = oEvent.getSource();
				if (!this.pEffortDistCalendarView) {
					this.pEffortDistCalendarView = Fragment.load({
						id: "resourceRequestLibraryFragment",
						name: "resourceRequestLibrary.fragment.ResourceQuickView",
						controller: _controller,
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				if (!oView.getModel("i18ned")) {
					const i18nModel = new ResourceModel({
						bundleName: "resourceRequestLibrary.i18n.i18n"
					});
					oView.setModel(i18nModel, "i18ned");
				}
				const oData = oEvent.getSource().getBindingContext().getObject();
				const oEmployee = oData.ResourceDetails || oData.resources;
				this.pEffortDistCalendarView.then(function(oDialog) {
					// eslint-disable-next-line max-len
					_controller.getResourcePopupModel(oEmployee, oView.getModel("i18ned"), oDialog.getParent().getId().includes("staffResourceRequest") ).then(function(oModel) {
						oDialog.setModel(oModel);
						oDialog.openBy(oLink);
					});
				});
			}
		};
	});
