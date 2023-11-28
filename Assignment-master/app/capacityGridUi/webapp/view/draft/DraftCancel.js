sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseComponentController",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/draft/AssignmentStatus",
		"capacityGridUi/view/table/TablePathAnalysis",
		"sap/m/MessageToast",
		"sap/m/MessageBox"
	],
	function (BaseComponentController, DraftActions, AssignmentStatus, TablePathAnalysis, MessageToast, MessageBox) {
		"use strict";

		return BaseComponentController.extend("capacityGridUi.view.draft.DraftSave", {
			oResponseMap: undefined,

			onInit: function () {
				this.injectMembers();
			},

			cancelAll: function () {
				let aChangedAsgPaths = this.models.table.getChangedAssignmentPaths();
				if (aChangedAsgPaths.length > 0) {
					this._confirmAction(this.oBundle.getText("CANCEL_EDIT_CONFIRM")).then(() => {
						this.oControllers.page.getView().setBusy(true);
						sap.ui.getCore().getMessageManager().removeAllMessages();
						let oPromise = this.sendCancelRequests(aChangedAsgPaths);
						oPromise
							.then(this._cancelAllSuccess.bind(this))
							.catch(() => {
								this.models.message.addServerMessages("transient");
								this.oControllers.messageDialog.open();
							})
							.finally(() => {
								this.oControllers.page.getView().setBusy(false);
							});
					});
				} else {
					this._cancelAllSuccess();
				}
			},

			_cancelAllSuccess: function () {
				// clear the filter
				let oRows = this.oControllers.table.oTable.getBinding("rows");
				oRows.filter([]);
				this.models.message.removeAllMessages();
				this.models.app.setProperty("/draftMsgVisible", false);
				this.oControllers.page.toggleEditMode({ bFocusedEdit: false });
				this.oControllers.table.fetchResources({ reset: true });
				this.models.table.setProperty("/SelectedEditStatus", "All");
				this.models.table.setProperty("/filterDropDownEnabled", false);
			},

			cancelSelected: function (aSelectedAsgPaths) {
				this._confirmAction(this.oBundle.getText("DISCARD_SELECTED_CONFIRM")).then(() => {
					this.oControllers.page.getView().setBusy(true);
					sap.ui.getCore().getMessageManager().removeAllMessages();
					let oPromise = this.sendCancelRequests(aSelectedAsgPaths);
					oPromise
						.then(() => {
							this._afterCancelRequestsCompleted(aSelectedAsgPaths);
							this.oControllers.table.calculateEnablementForToolbarElements();
							// If called without batch, caller has to do error handling.
							this.oControllers.header.fetchKPI();
							this.models.app.setProperty("/draftMsgVisible", false);
						})
						.catch(() => {
							this.models.message.addServerMessages("transient");
							this.oControllers.messageDialog.open();
						})
						.finally(() => {
							this.oControllers.page.getView().setBusy(false);
						});
				});
			},

			_confirmAction: function (sConfirmationMessage) {
				return new Promise(function (resolve) {
					MessageBox.confirm(sConfirmationMessage, function (oEvent) {
						if (oEvent === "OK") {
							resolve();
						}
					});
				});
			},

			// why is this public?
			// component needs to call this for clean up work!
			sendCancelRequests: function (aAsgPaths) {
				let aPromises = [];
				for (let aAsgPath of aAsgPaths) {
					let oAsg = this.models.table.getProperty(aAsgPath);
					if (oAsg.draftExists) {
						let oPromise = this._cancelChange(aAsgPath, oAsg);
						aPromises.push(oPromise);
					}
				}
				return Promise.all(aPromises);
			},

			_cancelChange: function (sAsgPath, oAsg) {
				this.oResponseMap = new Map();
				return new Promise(
					function (resolve, reject) {
						let oPromise = this._sendDeleteAction(oAsg.oContext);
						oPromise
							.then(() => {
								this.oResponseMap.set(sAsgPath, true);
								resolve();
							})
							.catch((oError) => {
								reject(oError);
							});
					}.bind(this)
				);
			},

			_sendDeleteAction: function (oAsgOdataContext) {
				let sessionGuid = "$auto.test";
				let oPromise = oAsgOdataContext.setProperty("action", DraftActions.DELETE, sessionGuid);
				return oPromise;
			},

			_afterCancelRequestsCompleted: function (aSelectedAsgPaths) {
				this.models.table.unmarkAssignmentCopiedOrCut(aSelectedAsgPaths);
				for (let i = aSelectedAsgPaths.length - 1; i >= 0; i--) {
					let sAsgPath = aSelectedAsgPaths[i];
					let oAsg = this.models.table.getProperty(sAsgPath);
					let bResponse = oAsg.draftExists ? this.oResponseMap.get(sAsgPath) : true;
					if (!bResponse || oAsg.changeState === "unChanged") {
						continue;
					}
					if (oAsg.changeState === "empty") {
						this.handleEmptyAsgOnCancelComplete(sAsgPath);
					} else if (oAsg.changeState === "created") {
						this.handleCreatedAsgOnCancelComplete(sAsgPath);
					} else if (oAsg.changeState === "changed") {
						this._handleChangedAsgOnCancelComplete(sAsgPath);
					} else if (oAsg.changeState === "deleted") {
						this._handleDeleteAsgOnCancelComplete(sAsgPath);
					} else {
						throw Error("unexpected state " + oAsg.changeState);
					}
				}
			},

			handleEmptyAsgOnCancelComplete: function (sAsgPath) {
				let sAsgId = this.models.table.getProperty(sAsgPath).asgId;
				this.models.message.removeMessageByTarget(sAsgId);
				this.models.table.removeAssignment(sAsgPath);
				let oAnalysis = new TablePathAnalysis(sAsgPath);
				this.models.table.aggregateAssignmentChanged(oAnalysis.resourcePath);
				this.models.table.aggregateAssignmentError(oAnalysis.resourcePath);
			},

			handleCreatedAsgOnCancelComplete: function (sAsgPath) {
				this.models.table.updateUtilizationsOnDelete(sAsgPath);
				this.handleEmptyAsgOnCancelComplete(sAsgPath);
			},

			_handleChangedAsgOnCancelComplete: function (sAsgPath) {
				let oAsg = this.models.table.getProperty(sAsgPath);

				// assignment status
				let bAsgStatusChanged = oAsg.assignmentStatusValueState === "Information" || oAsg.assignmentStatusValueState === "Error";
				if (bAsgStatusChanged) {
					let sStatusText = this.oBundle.getText("SOFT_BOOKED");
					this.models.table.setProperty(sAsgPath + "/assignmentStatusCode", AssignmentStatus.SOFT_BOOKED_STRING);
					this.models.table.setProperty(sAsgPath + "/assignmentStatusText", sStatusText);
				}

				// utilization
				for (let u = 0; u < oAsg.utilization.length; u++) {
					let oUtilization = oAsg.utilization[u];
					let bUtilizationChanged = oUtilization.utilizationValueState === "Information" || oUtilization.utilizationValueState === "Error";
					if (bUtilizationChanged) {
						let sUtilPath = sAsgPath + "/utilization/" + u;
						let sOldBookedCapacity = this.models.table.getProperty(sUtilPath + "/oldBookedCapacity");
						this.models.table.setProperty(sUtilPath + "/bookedCapacity", sOldBookedCapacity);
						this.models.table.updateUtilizationsOnChange(sUtilPath);
					}
				}

				// assignment (after the others)
				this.models.table.resetAsgValueStates(sAsgPath);
				this.models.table.calculateAssignmentChanged(sAsgPath, "unChanged");
				this.models.table.calculateAssignmentError(sAsgPath);
				this.models.message.removeMessageByTarget(oAsg.asgId);
			},

			_handleDeleteAsgOnCancelComplete: function (sAsgPath) {
				let sAsgId = this.models.table.getProperty(sAsgPath).asgId;
				let aUtilization = this.models.table.getProperty(sAsgPath + "/utilization");
				for (let u = 0; u < aUtilization.length; u++) {
					let oUtilization = aUtilization[u];
					let sUtilPath = sAsgPath + "/utilization/" + u;
					let sOldBookedCapacity = this.models.table.getProperty(sUtilPath + "/oldBookedCapacity");
					this.models.table.setProperty(sUtilPath + "/bookedCapacity", sOldBookedCapacity);
					this.models.table.setProperty(sUtilPath + "/empty", oUtilization.timePeriod ? false : true);
				}
				this.models.table.resetAsgValueStates(sAsgPath);
				this.models.table.calculateAssignmentChanged(sAsgPath, "unChanged");
				this.models.table.calculateAssignmentError(sAsgPath);
				this.models.message.removeMessageByTarget(sAsgId);
				this.models.table.updateUtilizationsOnDiscardDeletion(sAsgPath);
			}
		});
	}
);
