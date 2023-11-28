sap.ui.define([
	"resourceRequestLibrary/utils/DateHelper"],
function(DateHelper) {
	const DATE_PICKER = "manageResourceRequest::ResourceRequestObjectPage" +
        "--fe::CustomSubSection::effortcustomSection--datePicker12";
	let oDate;
	let oStartDate;
	let oEndDate;
	let oChangedStartDate;
	let oChangedEndDate;

	return {
		onBeforeOpenDateSelection: function() {
			oDate = sap.ui.getCore().
				byId(DATE_PICKER);
			oStartDate = oDate.getDateValue();
			oEndDate = oDate.getSecondDateValue();
		},
		onDateChange: function(oEvent) {
			const that = this;
			oDate = sap.ui.getCore().
				byId(DATE_PICKER);
			const oBindingContext = oEvent.getSource().getBindingContext();
			const oRequestedStartDate = oStartDate ? oStartDate :
				new Date(oBindingContext.getProperty("workpackage/startDate"));
			const oRequestedEndDate = oEndDate ? oEndDate :
				new Date(oBindingContext.getProperty("workpackage/endDate"));
			const iEffortDistributionType = oBindingContext
				.getProperty("effortDistributionType_code");
			const iRequstedCapacity = parseInt(
				oBindingContext.getProperty("requestedCapacity")
			);
			oChangedStartDate = sap.ui.getCore()
				.byId(DATE_PICKER)
				.getDateValue();
			oChangedEndDate = sap.ui.getCore()
				.byId(DATE_PICKER)
				.getSecondDateValue();

			if ((oChangedStartDate > oRequestedStartDate ||
                    oChangedEndDate < oRequestedEndDate) &&
                        iEffortDistributionType != 0 &&
							iRequstedCapacity > 0) {
				sap.ui.getCore()
					.byId(DATE_PICKER)
					.setDateValue(oRequestedStartDate);
				sap.ui.getCore()
					.byId(DATE_PICKER)
					.setSecondDateValue(oRequestedEndDate);
				// Load fragment and attach to the view
				if (!this.pEffortDistDateConfirmDialog) {
					this.pEffortDistDateConfirmDialog = this.loadFragment({
						id: "effortdistdate",
						name: "manageResourceRequest.ext.view.EffortDistributionDateConfirmPopup",
						controller: this,
					}).then(function(oDialog) {
						that.addDependent(oDialog);
						return oDialog;
					});
				}
				// Open Dialog
				this.pEffortDistDateConfirmDialog.then(function(oDialog) {
					oDialog.open();
				});
			}
		},


		onConfirmChangeDateRange: function(oEvent) {
			// real time change summation
			const oBindingContext = oEvent.getSource().getBindingContext();
			const sResourceRequestId = oBindingContext.getProperty("ID");

			oStartDate = oChangedStartDate;
			oEndDate = oChangedEndDate;

			sap.ui.getCore()
				.byId(DATE_PICKER)
				.setDateValue(oChangedStartDate);
			sap.ui.getCore()
				.byId(DATE_PICKER)
				.setSecondDateValue(oChangedEndDate);

			const oModel = this.getModel();

			const url = "/ResourceRequests(ID=" + sResourceRequestId + ",IsActiveEntity=false)/requestedCapacity";
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

			this.pEffortDistDateConfirmDialog.then(function(oDialog) {
				oDialog.close();
			});
		},
		/**
     * This is called when 'Cancel' action is pressed
     * @public
     * @param {Object} oEvent Event
     */
		onClosePopup: function(oEvent) {
			this.pEffortDistDateConfirmDialog.then(function(oDialog) {
				oDialog.close();
			});
		},
	};
});
