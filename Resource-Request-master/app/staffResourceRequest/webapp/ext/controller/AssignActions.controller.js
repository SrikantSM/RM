sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/base/util/UriParameters",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/format/DateFormat"
	],
	function(
		ControllerExtension,
		UriParameters,
		MessageToast,
		MessageBox,
		DateFormat
	) {
		return ControllerExtension.extend("assignActions", {
			_oRowContext: undefined,
			_oSwitchStatus: undefined,
			_sAction: undefined,
			_oEdmDateFormat: DateFormat.getInstance({
				pattern: "yyyy-MM-dd"
			}),
			_oData: undefined,
			override: {
				onInit: function() {}
			},

			onQuickAssign: function(oEvent) {
				this._oRowContext = oEvent.getSource().getBindingContext();
				this._sAction = "QuickAssign";

				this.executeActionSecured(this.executeDirectAction);
			},
			onUnAssign: function(oEvent) {
				this._oRowContext = oEvent.getSource().getBindingContext();
				const sResourceName = this._oRowContext.getObject().resourceName;
				this._sAction = "UnAssign";
				MessageBox.confirm(this.getText("UNASSIGN_CONFIRM", [sResourceName]), (oAction) => {
					if (oAction === "OK") {
						this.executeActionSecured(this.executeDirectAction);
					}
				});
			},

			onHardBook: function(oEvent) {
				this._oRowContext = oEvent.getSource().getBindingContext();
				const oStaffed = this._oRowContext.getObject();
				const sResourceName = oStaffed.resourceName;
				const oData = {
					resourceRequestEndDate: new Date(oStaffed.endDate),
					resourceRequestStartDate: new Date(oStaffed.startDate),
					bookedHours: oStaffed.bookedCapacityInHours,
					assignmentStatus: oStaffed.softBooking
				};
				this._oData = oData;
				this._oSwitchStatus = oEvent.getSource();
				this._sAction = "HardBook";
				MessageBox.confirm(this.getText("HARDBOOK_CONFIRM", [sResourceName]), (oAction) => {
					if (oAction === "OK") {
						this.executeActionSecured(this.executeStatusChangeAction);
					} else {
						this._oSwitchStatus.setState(false);
					}
				});
			},

			executeActionSecured: function(executeAction) {
				this.base.editFlow.securedExecution(executeAction.bind(this), {
					busy: {
						set: true,
						check: false
					}
				});
			},

			executeDirectAction: function() {
				return new Promise(
					function(resolve, reject) {
						const oModel = this.getView().getModel();

						const sActionName =
              this._sAction === "QuickAssign" ? "AssignAsRequested" : "DeleteAssignment";
						const sBindingPath =
              "ProcessResourceRequestService." + sActionName + "(...)";
						const oAction = oModel.bindContext(sBindingPath, this._oRowContext);
						const sMsgKey =
              this._sAction === "QuickAssign" ? "ASSIGN_CREATE_SUCCESS" : "ASSIGN_DELETE_SUCCESS";
						sap.ui.getCore().getMessageManager().removeAllMessages();
						oAction
							.execute("$auto.null")
							.then(this.executeActionResolve.bind(this, resolve, sMsgKey))
							.catch(this.executeActionReject.bind(this, reject));
					}.bind(this)
				);
			},

			executeStatusChangeAction: function() {
				return new Promise(
					function(resolve, reject) {
						const oModel = this.getView().getModel();
						const sActionName = "ChangeAssignment";
						const sBindingPath =
              "ProcessResourceRequestService." + sActionName + "(...)";
						const oAction = oModel.bindContext(sBindingPath, this._oRowContext);
						oAction.setParameter(
							"assignedStart",
							this._oEdmDateFormat.format(this._oData.resourceRequestStartDate)
						);
						oAction.setParameter(
							"assignedEnd",
							this._oEdmDateFormat.format(this._oData.resourceRequestEndDate)
						);
						oAction.setParameter(
							"assignedDuration",
							parseInt(this._oData.bookedHours)
						);
						oAction.setParameter("softBooking", !this._oData.assignmentStatus);
						sap.ui.getCore().getMessageManager().removeAllMessages();
						oAction
							.execute("$auto.null")
							.then(this.executeActionResolve.bind(this, resolve))
							.catch(this.executeActionReject.bind(this, reject));
					}.bind(this)
				);
			},

			executeActionResolve: function(resolve) {
				this.base.getExtensionAPI().refresh();
				resolve();
			},

			executeActionReject: function(reject, error) {
				reject();
				if (this._sAction === "HardBook") {
					this._oSwitchStatus.setState(false);
				}
				this.base.messageHandler.showMessageDialog().then(function() {
					sap.ui.getCore().getMessageManager().removeAllMessages();
				});
			},

			statusText: function(bState) {
				return bState ?
					this.getText("SOFTBOOKED") :
					this.getText("HARDBOOKED");
			},

			isOn: function(bState) {
				return bState === false;
			},

			getText: function(sMsgKey, aParams) {
				const oI18NModel = this.getView().getModel("i18n");
				const oBundle = oI18NModel.getResourceBundle();
				return oBundle.getText(sMsgKey, aParams);
			}
		});
	}
);
