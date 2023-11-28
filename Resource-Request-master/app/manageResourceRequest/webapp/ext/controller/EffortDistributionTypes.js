sap.ui.define(["sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"resourceRequestLibrary/utils/Constants"], function(MessageToast, JSONModel, Constants) {
	return {
		/**
     * Open Change Effort Distribution Type Popup
     * @public
     * @param {Object} oEvent Event
     */
		onOpenChangeEffortTypePopup: function(oEvent) {
			const that = this;

			// Load fragment and attach to the view
			if (!this.pEffortDistTypeDialog) {
				this.pEffortDistTypeDialog = this.loadFragment({
					id: "effortdisttype",
					name: "manageResourceRequest.ext.view.EffortDistributionTypes",
					controller: this,
				}).then(function(oDialog) {
					that.addDependent(oDialog);
					return oDialog;
				});
			}

			const iCurrEffortType = oEvent
				.getSource()
				.getBindingContext()
				.getProperty("effortDistributionType_code");

			// Open Dialog
			this.pEffortDistTypeDialog.then(function(oDialog) {
				oDialog.open();
				// will be replaced with extenstionAPI byID method in next release
				oDialog.attachAfterOpen(function() {
					const oEffortList = sap.ui
						.getCore()
						.byId("effortdisttype--effortdisttypelist");

					// Every Time Effort Distribution Selection popup is open select the effort distribution in the list
					// eslint-disable-next-line max-nested-callbacks
					oEffortList.getItems().forEach((item) => {
						if (iCurrEffortType === parseInt(item.getCustomData()[0].getKey())) {
							oEffortList.setSelectedItem(item);
						}
					});
				});
			});
		},

		/**
     * Open confirm change Effort Distribution Type Popup
     * @public
     * @param {Object} oEvent Event
     */
		onOpenConfirmEffortTypePopup: function(oEvent) {
			const that = this;

			const iCurrEffortType = oEvent
				.getSource()
				.getBindingContext()
				.getProperty("effortDistributionType_code");

			// Replace this with extenstionAPI byID method when upgrade to UI5 1.87 occurs
			const iSelectedEffortType = parseInt(
				sap.ui
					.getCore()
					.byId("effortdisttype--effortdisttypelist")
					.getSelectedItem()
					.getCustomData()[0]
					.getKey()
			);

			const sRequestedEffort = oEvent
				.getSource()
				.getBindingContext()
				.getProperty("requestedCapacity");

			if (iCurrEffortType != iSelectedEffortType) {
				if ( sRequestedEffort == null || parseFloat(sRequestedEffort) == 0 ) {
					oEvent
						.getSource()
						.getBindingContext()
						.setProperty("effortDistributionType_code", iSelectedEffortType);
					let si18nKeyForMessageToast;
					if (iSelectedEffortType == Constants.TOTAL_EFFORT)	{
						si18nKeyForMessageToast = "effortDistChangePopupTotal";
					} else if (iSelectedEffortType == Constants.DAILY_EFFORT) {
						si18nKeyForMessageToast = "effortDistChangePopupDaily";
					} else {
						si18nKeyForMessageToast = "effortDistChangePopupWeekly";
					}
					const smessage = this.getModel("i18n").getResourceBundle().getText(si18nKeyForMessageToast);
					MessageToast.show(smessage);
				} else {
					const oModel = new JSONModel();
					// Below condition is used to set the message of the dialog
					if ((iSelectedEffortType === Constants.TOTAL_EFFORT) ||
					(iCurrEffortType === Constants.DAILY_EFFORT && iSelectedEffortType === Constants.WEEKLY_EFFORT)) {
						oModel.setData({bDataLoss: false});
					} else {
						oModel.setData({bDataLoss: true});
					}
					if (!this.pEffortDistConfirmDialog) {
						this.pEffortDistConfirmDialog = this.loadFragment({
							id: "effortdistconfirm",
							name: "manageResourceRequest.ext.view.EffortDistributionConfirmPopup",
							controller: this
						}).then(function(oDialog) {
							that.addDependent(oDialog);
							return oDialog;
						});
					}
					this.pEffortDistConfirmDialog.then(function(oDialog) {
						oDialog.open();
						oDialog.setModel(oModel, "flag");
					});
				}
			}

			// Close Dialog
			this.pEffortDistTypeDialog.then(function(oDialog) {
				oDialog.close();
			});
		},

		/**
     * This is called when 'Cancel' action is pressed
     * @public
     */
		onCloseEffortDistributionTypePopup: function() {
			this.pEffortDistTypeDialog.then(function(oDialog) {
				oDialog.close();
			});
		},

		/**
     * Set current effort distribution in the list
     * @public
     * @param {Object} oEvent Event
     */
		setEffortDistType: function(oEvent) {
			const iCurrEffortType = oEvent
				.getSource()
				.getBindingContext()
				.getProperty("effortDistributionType_code");

			// will be replaced with extenstionAPI byID method in next release
			const oEffortList = sap.ui
				.getCore()
				.byId("effortdisttype--effortdisttypelist");

			oEffortList.getItems().forEach((item) => {
				if (iCurrEffortType === parseInt(item.getCustomData()[0].getKey())) {
					oEffortList.setSelectedItem(item);
				}
			});
		},
	};
});
