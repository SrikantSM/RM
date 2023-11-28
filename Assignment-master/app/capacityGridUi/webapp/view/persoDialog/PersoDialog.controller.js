sap.ui.define(
	["capacityGridUi/reuse/controller/BaseFragmentController", "capacityGridUi/view/persoDialog/PersoDialogModel", "sap/base/util/deepClone"],
	function (BaseFragmentController, PersoDialogModel, deepClone) {
		"use strict";

		return BaseFragmentController.extend("capacityGridUi.view.persoDialog.PersoDialog", {
			oPersoModel: undefined,

			constructor: function (component, dependent) {
				BaseFragmentController.prototype.constructor.call(this, {
					fragmentName: "capacityGridUi.view.persoDialog.PersoDialog",
					fragmentId: component.createId("PersoDialog"),
					component: component,
					dependent: dependent
				});
			},

			onInit: function () {
				this.injectMembers();
				this.oPersoModel = new PersoDialogModel(this.oBundle);
				let oDialog = this.getFragmentSync();
				oDialog.setModel(this.oPersoModel);
			},

			open: function () {
				this.getFragment().then(
					function (oDialog) {
						let oVariant = this.oControllers.variant.getVariant();
						let aColumns = deepClone(oVariant.columns); // clone in order to not have clean up work on cancel
						this.oPersoModel.setProperty("/ColumnsItems", aColumns);
						oDialog.setShowResetEnabled(true); // for some reason the button stays disabled after being pressed once
						oDialog.open();
					}.bind(this)
				);
			},

			onOk: function (oEvent) {
				let oColumns = oEvent.getParameter("payload").columns;
				this.models.app.setProperty("/columnsVisibility", "showAll");
				if (oColumns.tableItemsChanged) {
					let aColumns = this.oPersoModel.getProperty("/ColumnsItems");
					let bReloadTableData = this._atLeastOneColumnChanged();
					this.oControllers.variant.changeVariant("columns", null, aColumns);
					this.oControllers.table.updateColumns({ leadingColumns: true, timeColumns: false});
					if (bReloadTableData) {
						this.oControllers.table.fetchResources({ reset: true });
					}
				}
				this.getFragmentSync().close();
			},

			_atLeastOneColumnChanged: function () {
				let aCurrentColumns = this.oPersoModel.getProperty("/ColumnsItems");
				let aPreviousColumns = this.oControllers.variant.getVariant().columns;
				for (let i = 0; i < aCurrentColumns.length; i++) {
					for (let j = 0; j < aPreviousColumns.length; j++) {
						if (aCurrentColumns[i].columnKey === aPreviousColumns[j].columnKey && aCurrentColumns[i].visible !== aPreviousColumns[j].visible) {
							return true;
						}
					}
				}
				return false;
			},

			onCancel: function (oEvent) {
				this.getFragmentSync().close();
			},

			onReset: function () {
				let oVariant = this.oControllers.variant.getUnchangedVariant();
				let aColumns = deepClone(oVariant.columns); // clone in order to not have clean up work on cancel
				this.oPersoModel.setProperty("/ColumnsItems", aColumns);
			}
		});
	}
);
