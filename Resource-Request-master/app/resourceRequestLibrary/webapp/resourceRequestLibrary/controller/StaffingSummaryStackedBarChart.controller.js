sap.ui.define(
	["sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
	],
	function(ControllerExtension, Fragment, JSONModel) {
		return ControllerExtension.extend("resourceRequestLibrary.fragment.StaffingSummaryStackedBarChart", {
			oPopover: undefined,
			onOpenStaffingSummary: function(oEvt) {
				const oView = this.base;
				const oModel = new JSONModel();
				const oBindingContext = oEvt.getSource().getBindingContext();
				const staffingStatus = oBindingContext.getObject("staffingStatus");
				if (staffingStatus != null) {
					const requestedCapacity = staffingStatus.requestedCapacity;
					const bookedCapacity = staffingStatus.bookedCapacity;
					const bookedCapacityHard = staffingStatus.bookedCapacityHard;
					const bookedCapacitySoft = staffingStatus.bookedCapacitySoft;
					const remainingCapacity = staffingStatus.remainingCapacity;
					oModel.setData({
						requestedCapacity,
						bookedCapacity,
						bookedCapacityHard,
						bookedCapacitySoft,
						remainingCapacity
					});
				}
				oView.setModel(oModel, "staffingSummaryModel");
				const oChart = oEvt.getSource();
				if (!this.pStaffingSummaryPopover) {
					this.pStaffingSummaryPopover = Fragment.load({
						id: this.base.getView().getController().createId("StaffingSummaryPopover"),
						name: "resourceRequestLibrary.fragment.StaffingSummaryPopover",
						controller: this
					}).then(
						function(oPopover) {
							this.getView().addDependent(oPopover);
							return oPopover;
						}.bind(this)
					);
				}
				this.pStaffingSummaryPopover.then(function(oPopover) {
					oPopover.openBy(oChart);
				});
			}
		});
	}
);
