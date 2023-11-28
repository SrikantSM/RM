sap.ui.define(
	["capacityGridUi/reuse/controller/BaseFragmentController", "sap/ui/model/json/JSONModel"],
	function (BaseFragmentController, JSONModel) {
		"use strict";

		return BaseFragmentController.extend("capacityGridUi.reuse.exportDialog.ExportProgressDialog", {
			bIsDialogOpen: false,

			constructor: function (component, dependent) {
				BaseFragmentController.prototype.constructor.call(this, {
					fragmentName: "capacityGridUi.reuse.exportDialog.ExportProgressDialog",
					fragmentId: component.createId("ExportProgress"),
					component: component,
					dependent: dependent
				});
			},

			onInit: function () {
				this.injectMembers();
				let oDialog = this.getFragmentSync();
				let oProgressModel = new JSONModel({
					DisplayAnimation: false,
					PercentValue: 0,
					CurrentCount: 0,
					TotalCount: 0
				});
				oDialog.setModel(oProgressModel, "dialogProgress");
			},

			open: function (iResourceCount) {
				this.getFragment().then(
					function (oDialog) {
						if (!oDialog.isOpen()) {
							oDialog.open();
							this.bIsDialogOpen = true;
							this.setProgress(0, iResourceCount, false);
						}
					}.bind(this)
				);
			},

			handleEscape: function (pEscapePending) {
				this.bIsDialogOpen = false;
				pEscapePending.resolve();
			},

			setProgress: function (iCount, iTotalResCount, bAnimate) {
				let oProgressModel = this.getFragmentSync().getModel("dialogProgress");
				oProgressModel.setProperty("/DisplayAnimation", bAnimate);
				oProgressModel.setProperty("/PercentValue", (iCount / iTotalResCount) * 100);
				oProgressModel.setProperty("/CurrentCount", iCount);
				oProgressModel.setProperty("/TotalCount", iTotalResCount);
			},

			close: function () {
				this.getFragmentSync().close();
				this.bIsDialogOpen = false;
			},

			onClose: function () {
				this.close();
			}
		});
	}
);
