sap.ui.define(["capacityGridUi/reuse/controller/BaseComponentController"], function (BaseComponentController) {
	"use strict";

	return BaseComponentController.extend("capacityGridUi.view.draft.DraftChange", {
		onInit: function () {
			this.injectMembers();
		},

		_handleChangePromise: function (oPromise) {
			this.oControllers.draftChangesTracker.trackStart();
			this.models.app.setProperty("/draftMsg", this.oBundle.getText("SIMULATION_STARTED"));
			this.models.app.setProperty("/draftMsgVisible", true);
			let sDraftMessage = "";
			oPromise
				.then(() => {
					sDraftMessage = this.oBundle.getText("SIMULATION_COMPLETED");
				})
				.finally(() => {
					this.oControllers.draftChangesTracker.trackEnd();
					this.oControllers.draftChangesTracker.finished().then(() => {
						this.models.app.setProperty("/draftMsg", sDraftMessage);
					});
				});
		}
	});
});
