

sap.ui.define(["sap/m/MessageToast", "resourceRequestLibrary/utils/Constants"], function(MessageToast, Constants) {
	return {
		/**
     * This is called when 'change' action is pressed
     * @public
     * @param {Object} oEvent Event
     */
		onConfirmDistType: function(oEvent) {
			const oBindingContext = oEvent.getSource().getBindingContext();
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
			// if user has changed effort distribution update the draft table
			if (iCurrEffortType !== iSelectedEffortType) {
				oEvent
					.getSource()
					.getBindingContext()
					.setProperty("effortDistributionType_code", iSelectedEffortType).then(
						function() {
							// Fetch Updated value of parent from backend
							const sResourceRequestId = oBindingContext.getProperty("ID");
							const oModel = this.getModel();

							const url = "/ResourceRequests(ID=" +
								sResourceRequestId + ",IsActiveEntity=false)/requestedCapacity";
							// Creating binding context in the current model
							this.oList = oModel.bindProperty(url);

							this.oList
								.requestValue()
								.then(function(fTotalEffort) {
									if (fTotalEffort !== undefined) {
										oBindingContext
											.setProperty(
												"requestedCapacity",
												parseFloat(fTotalEffort).toPrecision(10)
											);
									}
								});


							this.pEffortDistConfirmDialog.then(function(oDialog) {
								oDialog.close();
							});
							let stextForMessageToast;
							if (iSelectedEffortType == Constants.TOTAL_EFFORT)	{
								stextForMessageToast = "effortDistChangePopupTotal";
							} else if (iSelectedEffortType == Constants.DAILY_EFFORT) {
								stextForMessageToast = "effortDistChangePopupDaily";
							} else {
								stextForMessageToast = "effortDistChangePopupWeekly";
							}
							const smessage = this.getModel("i18n").getResourceBundle().getText(stextForMessageToast);
							MessageToast.show(smessage);
						}.bind(this)
					);
			}
		},

		/**
     * This is called when 'Cancel' action is pressed
     * @public
     * @param {Object} oEvent Event
     */
		onClosePopup: function() {
			this.pEffortDistConfirmDialog.then(function(oDialog) {
				oDialog.close();
			});
		},
	};
});
