sap.ui.define(
	["capacityGridUi/reuse/controller/BaseViewController", "capacityGridUi/view/message/MessagePopover.controller"],
	function (BaseViewController, MessagePopoverController) {
		"use strict";

		return BaseViewController.extend("capacityGridUi.view.Page", {
			sBreakPoint: undefined,
			oMessagePopoverController: undefined,

			onInit: function () {
				this.injectMembers();
				this.oComponent.oControllers.add("page", this);
				this.oMessagePopoverController = new MessagePopoverController(this.getOwnerComponent(), this.getView());
				this.getView().setBusy(true);
			},

			applyVariant: function (oVariant) {
				this.getView().setBusy(false);
			},

			onSave: function (oEvent) {
				this.oControllers.draftSave.saveAll();
			},

			onCancel: function (oEvent) {
				this.oControllers.table.clearSelectionInTable();
				this.oControllers.draftCancel.cancelAll();
			},

			toggleEditMode: function (oParams) {
				let bEdit = !this.models.app.getProperty("/IsEditMode");
				this.models.app.setProperty("/IsEditMode", bEdit);
				this.models.app.setProperty("/IsDisplayMode", !bEdit);
				this.models.app.setProperty("/IsFilterBarOpen", false);
				this.models.app.setProperty("/IsFocusedEdit", (oParams && oParams.bFocusedEdit) || false);

				this.byId("DynamicSideContent").setShowMainContent(true);

				if (bEdit) {
					this.oControllers.draftKeepAlive.start();
				} else {
					this.oControllers.draftKeepAlive.stop();
				}

				if (sap.ushell && sap.ushell.Container) {
					sap.ushell.Container.setDirtyFlag(bEdit);
				}
			},

			toggleFilter: function () {
				let oSideContent = this.byId("DynamicSideContent");
				this.models.app.setProperty("/IsFilterBarOpen", !oSideContent.getShowSideContent());
				if (this.sBreakPoint === "M" || this.sBreakPoint === "S" || this.sBreakPoint === "XS") {
					if (oSideContent.getShowSideContent()) {
						oSideContent.setShowMainContent(false);
					} else {
						this.models.app.setProperty("/IsFilterBarOpen", false);
						oSideContent.setShowMainContent(true);
					}
				}
				if (this.models.app.getProperty("/IsFilterBarOpen")) {
					this.oControllers.filterBar.onOpenFilterbar();
				} else {
					this.oControllers.table.onCloseFilterBar();
				}
			},

			onBreakpointChanged: function (oEvent) {
				let oSideContent = oEvent.getSource();
				this.sBreakPoint = oEvent.getParameter("currentBreakpoint");
				if (this.sBreakPoint === "M" || this.sBreakPoint === "S" || this.sBreakPoint === "XS") {
					if (oSideContent.getShowSideContent()) {
						oSideContent.setShowMainContent(false);
					} else {
						oSideContent.setShowMainContent(true);
					}
				} else {
					oSideContent.setShowMainContent(true);
				}
			},

			onOpenMessagePopover: function (oEvent) {
				this.openMessagePopover();
			},

			openMessagePopover: function () {
				setTimeout(
					function () {
						this.oMessagePopoverController.open(this.byId("messagePopoverBtn"));
					}.bind(this),
					0
				);
			}
		});
	}
);
