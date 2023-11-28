sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/base/util/UriParameters",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/ui/core/Fragment",
		"sap/ui/core/format/DateFormat",
	],
	function(
		ControllerExtension,
		UriParameters,
		JSONModel,
		MessageToast,
		Fragment,
		DateFormat
	) {
		const Constants = {
			HARD_BOOKED: 0,
			SOFT_BOOKED: 1,
			PROPOSED: 2,
			ACCEPTED: 3,
			REJECTED: 4
		};
		return ControllerExtension.extend("assignDialog", {
			_oEdmDateFormat: DateFormat.getInstance({
				pattern: "yyyy-MM-dd",
			}),
			_sFragmentId: undefined,
			_oFragment: undefined,
			_oRowContext: undefined,
			_sAction: undefined,

			onCreateAssignment: function(oEvent) {
				this._oRowContext = oEvent.getSource().getBindingContext();
				this._sAction = "Create";
				this.openDialog();
			},

			onUpdateAssignment: function(oEvent) {
				this._oRowContext = oEvent.getSource().getBindingContext();
				this._sAction = "Update";
				this.openDialog();
			},

			openDialog: function() {
				this.getFragment().then(
					function(oDialog) {
						this.byIdFragment("hoursInput").setValueState("None");
						this.byIdFragment("dateRange").setValueState("None");
						this._fetchAssignmentStatus().then((aAssignmentStatusSet) => {
							this._hideAssignmentStatusFromPossibleSelection(aAssignmentStatusSet);
							const oData = this.getModelData(aAssignmentStatusSet);
							oDialog.getModel("AssignModel").setData(oData);
							oDialog.getModel("AssignModel").updateBindings(true);
							oDialog.open();
						});
					}.bind(this)
				);
			},

			initFragment: function(oFragment) {
				oFragment.setModel(new JSONModel(), "AssignModel");
			},

			getModelData: function(aAssignmentStatusSet) {
				const oResourceRequest = this.base
					.getView()
					.getBindingContext()
					.getObject();
				if (this._sAction === "Create") {
					const oMatchingCandidate = this._oRowContext.getObject();
					return {
						title: this.getText("ASSIGN_MATCHING"),
						isButtonEnabled: true,
						actionButton: this.getText("ASSIGN"),
						name: oMatchingCandidate.resourceName,
						isEnabledDateRange: true,
						resourceRequestEndDate: new Date(
							oMatchingCandidate.resourceRequestEndDate
						),
						resourceRequestStartDate: new Date(
							oMatchingCandidate.resourceRequestStartDate
						),
						remainingCapacity:
              oResourceRequest.staffingStatus.remainingCapacity,
						resourceRequest_ID: oMatchingCandidate.resourceRequest_ID,
						isEnabledHoursInput: true,
						bookedHours: "",
						assignmentStatus: Constants.HARD_BOOKED, // defaul to Hard-Booked
						isEnabled: true,
						AssignmentStatusSet: aAssignmentStatusSet
					};
				} else {
					const oStaffed = this._oRowContext.getObject();
					return {
						title: this.getText("EDIT_ASSIGNED"),
						isButtonEnabled: oStaffed.assignmentStatus.code !== 4,
						actionButton: this.getText("SAVE"),
						name: oStaffed.resourceName,
						isEnabledDateRange: oStaffed.assignmentStatus.code !== 4,
						resourceRequestEndDate: new Date(oStaffed.endDate),
						resourceRequestStartDate: new Date(oStaffed.startDate),
						resourceRequest_ID: oStaffed.ResourceDetails.resource_ID,
						bookedHours: oStaffed.bookedCapacityInHours,
						isEnabledHoursInput: oStaffed.assignmentStatus.code !== 4,
						remainingCapacity:
              oResourceRequest.staffingStatus.remainingCapacity,
						assignmentStatus: oStaffed.assignmentStatus.code,
						isEnabled: oStaffed.assignmentStatus.code !== 0 && oStaffed.assignmentStatus.code !== 4 &&
						oStaffed.assignmentStatus.code !== 2,
						AssignmentStatusSet: aAssignmentStatusSet
					};
				}
			},

			onOk: function(oEvent) {
				if (this.validate()) {
					const oData = this._oFragment.getModel("AssignModel").getData();
					this._oFragment.setBusy(true);
					this.executeAssignActionSecured(oData);
				}
			},

			onCancel: function(oEvent) {
				this._oFragment.close();
			},

			executeAssignActionSecured: function(oData) {
				this.base.editFlow.securedExecution(
					this.executeAssignAction.bind(this, oData),
					{
						busy: {
							set: true,
							check: false,
						},
					}
				);
			},

			executeAssignAction: function(oData) {
				return new Promise(
					function(resolve, reject) {
						const oModel = this.getView().getModel();
						const sActionName =
              this._sAction === "Create" ? "AssignForSpecificPeriod" : "ChangeAssignment";
						const sBindingPath =
              "ProcessResourceRequestService." + sActionName + "(...)";
						const oAction = oModel.bindContext(sBindingPath, this._oRowContext);
						oAction.setParameter(
							"assignedStart",
							this._oEdmDateFormat.format(oData.resourceRequestStartDate)
						);
						oAction.setParameter(
							"assignedEnd",
							this._oEdmDateFormat.format(oData.resourceRequestEndDate)
						);
						oAction.setParameter(
							"assignedDuration",
							parseInt(oData.bookedHours)
						);
						oAction.setParameter("assignmentStatus", oData.assignmentStatus);
						sap.ui.getCore().getMessageManager().removeAllMessages();
						oAction
							.execute("$auto.null")
							.then(this.executeAssignActionResolve.bind(this, resolve))
							.catch(this.executeAssignActionReject.bind(this, reject));
					}.bind(this)
				);
			},

			executeAssignActionResolve: function(resolve) {
				this._oFragment.setBusy(false);
				this._oFragment.close();
				this.base.getExtensionAPI().refresh();
				resolve();
			},

			executeAssignActionReject: function(reject, error) {
				reject();
				this._oFragment.setBusy(false);
				this.base.messageHandler.showMessageDialog().then(function() {
					sap.ui.getCore().getMessageManager().removeAllMessages();
				});
			},

			onDateRangeChange: function(oEvent) {
				const bValid = oEvent.getParameter("valid");
				const sState = bValid ? "None" : "Error";
				oEvent.getSource().setValueState(sState);
			},

			onHoursChange: function(oEvent) {
				const oInput = oEvent.getSource();
				const sHours = oInput.getValue();
				const oRegExp = new RegExp("^[0-9]*$");
				const bValid = !sHours || oRegExp.test(sHours);
				const sState = bValid ? "None" : "Error";
				oInput.setValueState(sState);
			},

			validate: function() {
				const oDateRangeInput = this.byIdFragment("dateRange");
				const oDurationInput = this.byIdFragment("hoursInput");
				if (!oDateRangeInput.getFrom() || !oDateRangeInput.getTo()) {
					oDateRangeInput.setValueState("Error");
				}
				if (!oDurationInput.getValue()) {
					oDurationInput.setValueState("Error");
				}
				const sDateRangeState = oDateRangeInput.getValueState();
				const sHoursState = oDurationInput.getValueState();
				return sDateRangeState !== "Error" && sHoursState !== "Error";
			},

			// ~~~ fragment controller ~~~~~~~~~~~~~

			getFragment: function() {
				if (this._oFragment) {
					return Promise.resolve(this._oFragment);
				} else {
					return new Promise(
						function(resolve, reject) {
							this.loadFragment().then(
								function(oFragment) {
									this._oFragment = oFragment;
									this.getView().addDependent(oFragment);
									this.initFragment(oFragment);
									resolve(oFragment);
								}.bind(this),
								reject
							);
						}.bind(this)
					);
				}
			},

			loadFragment: function() {
				this._sFragmentId = this.base
					.getView()
					.getController()
					.createId("AssignDialog");
				return Fragment.load({
					id: this._sFragmentId,
					name: "staffResourceRequest.ext.view.AssignDialog",
					controller: this,
				});
			},

			byIdFragment: function(sId) {
				return Fragment.byId(this._sFragmentId, sId);
			},

			getText: function(sMsgKey) {
				const oI18NModel = this.getView().getModel("i18n");
				const oBundle = oI18NModel.getResourceBundle();
				return oBundle.getText(sMsgKey);
			},

			_hideAssignmentStatusFromPossibleSelection: function(aAssignmentStatusSet) {
				this._setAllStatusVisible(aAssignmentStatusSet);
				if (this._sAction === "Update") {
					this._setPossibleAssignmentStatusVisible(aAssignmentStatusSet);
				} else {
					this._hideAssignmentStatus(aAssignmentStatusSet);
				}
			},

			_setAllStatusVisible: function(aAssignmentStatusSet) {
				for (let i = 0; i < aAssignmentStatusSet.length; i++) {
					aAssignmentStatusSet[i].visible = "true";
				}
			},

			_hideAssignmentStatus: function(aAssignmentStatusSet) {
				aAssignmentStatusSet = this._setAssignmentStatusHidden(
					aAssignmentStatusSet,
					Constants.ACCEPTED
				);
				aAssignmentStatusSet = this._setAssignmentStatusHidden(
					aAssignmentStatusSet,
					Constants.REJECTED
				);
			},

			_setPossibleAssignmentStatusVisible: function(aAssignmentStatusSet) {
				const iAssignmentStatusCode =
          this._oRowContext.getObject().assignmentStatus.code;

				switch (iAssignmentStatusCode) {
				case Constants.SOFT_BOOKED:
				  aAssignmentStatusSet = this._setAssignmentStatusHidden(
				    aAssignmentStatusSet,
						Constants.SOFT_BOOKED
					);
					aAssignmentStatusSet = this._setAssignmentStatusHidden(
						aAssignmentStatusSet,
						Constants.PROPOSED
					);
					aAssignmentStatusSet = this._setAssignmentStatusHidden(
						aAssignmentStatusSet,
						Constants.ACCEPTED
					);
					aAssignmentStatusSet = this._setAssignmentStatusHidden(
						aAssignmentStatusSet,
						Constants.REJECTED
					);
					break;
				case Constants.ACCEPTED:
					aAssignmentStatusSet = this._setAssignmentStatusHidden(
						aAssignmentStatusSet,
						Constants.PROPOSED
					);
					aAssignmentStatusSet = this._setAssignmentStatusHidden(
						aAssignmentStatusSet,
						Constants.REJECTED
					);
					aAssignmentStatusSet = this._setAssignmentStatusHidden(
						aAssignmentStatusSet,
						Constants.ACCEPTED
					);
					break;
				default:
          // Invalid status
				}
			},

			_setAssignmentStatusHidden: function(
				aAssignmentStatusSet,
				iAssignmentStatusToBeHidden
			) {
				for (let i = 0; i <= aAssignmentStatusSet.length; i++) {
					if (
						aAssignmentStatusSet[i]["assignmentStatus"] ===
            iAssignmentStatusToBeHidden
					) {
						aAssignmentStatusSet[i].visible = "false";
						return aAssignmentStatusSet;
					}
				}
				return aAssignmentStatusSet;
			},

			_transformAssignmentStatus: function(aContexts) {
				const aStatus = [];
				for (const oContext of aContexts) {
					const oStatus = oContext.getObject();
					const oAssignmentStatus = {};
					oAssignmentStatus.assignmentStatus = oStatus.code;
					oAssignmentStatus.assignmentStatusText = oStatus.name;
					oAssignmentStatus.visible = "true";
					aStatus.push(oAssignmentStatus);
				}
				return aStatus;
			},

			_fetchAssignmentStatus: function() {
				const oAssignModel = this._oFragment.getModel("AssignModel");
				let aAssignmentStatusSet = oAssignModel.getProperty("/AssignmentStatusSet");
				if (
					aAssignmentStatusSet &&
          aAssignmentStatusSet.length > 0
				) {
					return Promise.resolve(aAssignmentStatusSet);
				}
				return new Promise(
					function(resolve, reject) {
						const oAssignmentStatus = this._oFragment
							.getModel()
							.bindList("/AssignmentStatus", undefined, undefined, undefined);
						return oAssignmentStatus.requestContexts().then((aContexts) => {
							aAssignmentStatusSet = this._transformAssignmentStatus(aContexts);
							resolve(aAssignmentStatusSet);
						}, reject);
					}.bind(this)
				);
			},
		});
	}
);
