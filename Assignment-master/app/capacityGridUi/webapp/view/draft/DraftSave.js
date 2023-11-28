sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseComponentController",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/table/TablePathAnalysis",
		"sap/m/MessageToast",
		"sap/m/MessageBox"
	],
	function (BaseComponentController, DraftActions, TablePathAnalysis, MessageToast, MessageBox) {
		"use strict";

		return BaseComponentController.extend("capacityGridUi.view.draft.DraftSave", {
			oResponseMap: undefined,

			onInit: function () {
				this.injectMembers();
			},

			saveAll: function () {
				let aClientMessages = this.models.message.getClientMessages();
				if (aClientMessages.length === 0) {
					let aChangedAsgPaths = this.models.table.getChangedAssignmentPaths();
					this._saveAssignments(aChangedAsgPaths);
				} else {
					this.oControllers.page.openMessagePopover();
				}
			},

			_saveAssignments: function (aAsgPaths) {
				this.oControllers.page.getView().setBusy(true);
				sap.ui.getCore().getMessageManager().removeAllMessages();
				this.oControllers.draftChangesTracker.finished().then(this._saveAssignmentsAfterDraftChanges.bind(this, aAsgPaths));
			},

			_saveAssignmentsAfterDraftChanges: function (aAsgPaths) {
				let aPromises = this._sendSaveRequests(aAsgPaths);
				Promise.all(aPromises)
					.then(() => {
						MessageToast.show(this.oBundle.getText("SAVE_SUCCESSFUL"));
						this._afterSaveSuccess();
					})
					.catch(() => {
						this._handlePartialSuccess(aAsgPaths);
						this._handleSaveError();
					})
					.finally(() => {
						this.oControllers.page.getView().setBusy(false);
					});
			},

			_afterSaveSuccess: function () {
				// clear the filter
				let oRows = this.oControllers.table.oTable.getBinding("rows");
				oRows.filter([]);
				this.models.message.removeAllMessages();
				this.models.app.setProperty("/draftMsgVisible", false);
				this.oControllers.page.toggleEditMode({ bFocusedEdit: false });
				this.oControllers.table.calculateButtonEnablement();
				this.oControllers.table.fetchResources({ reset: true });
				this.oControllers.header.fetchKPI();
				this.models.table.setProperty("/SelectedEditStatus", "All");
				this.models.table.setProperty("/filterDropDownEnabled", false);
			},

			_sendSaveRequests: function (aAsgPaths) {
				this.oResponseMap = new Map();
				let aAllPromises = [];
				let oAggregatedAssignments = this._getAggregatedAssignments(aAsgPaths);
				for (let i = 0; i < oAggregatedAssignments.aDistinctProjects.length; i++) {
					let sProject = oAggregatedAssignments.aDistinctProjects[i];
					let aAsgByProject = oAggregatedAssignments.aAllAsignments.filter((oAsg) => oAsg.projectId === sProject);
					let aPromisesByProject = this._sendSaveRequestsByProject(aAsgByProject);
					aAllPromises = aAllPromises.concat(aPromisesByProject);
				}
				return aAllPromises;
			},

			_sendSaveRequestsByProject: function (aAsgByProject) {
				let aPromisesByProject = [];
				let sBatchGroup = "saveAsg";
				for (let i = 0; i < aAsgByProject.length; i++) {
					let oPromiseByProject = this._saveChange(aAsgByProject[i], sBatchGroup);
					aPromisesByProject.push(oPromiseByProject);
				}
				this.models.oDataV4.submitBatch(sBatchGroup);
				return aPromisesByProject;
			},

			_getAggregatedAssignments: function (aAsgPaths) {
				let oAggregatedAssignments = { aAllAsignments: [], aDistinctProjects: [] };
				for (let sAsgPath of aAsgPaths) {
					let oAsg = this.models.table.getProperty(sAsgPath);
					if (oAsg.draftExists) {
						oAsg.asgPath = sAsgPath;
						if (oAggregatedAssignments.aDistinctProjects.indexOf(oAsg.projectId) === -1) {
							oAggregatedAssignments.aDistinctProjects.push(oAsg.projectId);
						}
						oAggregatedAssignments.aAllAsignments.push(oAsg);
					}
				}
				return oAggregatedAssignments;
			},

			_saveChange: function (oAsg, sBatchGroup) {
				return new Promise(
					function (resolve, reject) {
						let oPromise;
						if (oAsg.changeState === "deleted") {
							oPromise = this.deleteAssignment(oAsg.oContext, sBatchGroup);
						} else {
							oPromise = this._sendActivateAction(oAsg.oContext, sBatchGroup);
						}
						oPromise
							.then(() => {
								this.oResponseMap.set(oAsg.asgPath, true);
								resolve();
							})
							.catch(reject);
					}.bind(this)
				);
			},

			_sendActivateAction: function (oAsgOdataContext, sBatchGroup) {
				let oPromise = oAsgOdataContext.setProperty("action", DraftActions.ACTIVATE, sBatchGroup);
				return oPromise;
			},

			deleteAssignment: function (oAsgOdataContext, sBatchGroup) {
				let oPromise = oAsgOdataContext.delete(sBatchGroup);
				return oPromise;
			},

			_handleSaveError: function () {
				this._resetAsgErrorHandling();
				let aErrorMsgTargets = this.models.message.addServerMessages("persistent", "assignment");
				for (let i = 0; i < aErrorMsgTargets.length; i++) {
					let sAsgId = aErrorMsgTargets[i].target;
					let sAsgPath = this.models.table.getAssignmentPaths(sAsgId).asgPath;
					this.models.table.setProperty(sAsgPath + "/assignmentValueState", "Error");
					this.models.table.calculateAssignmentError(sAsgPath);
				}
				this.oControllers.page.openMessagePopover();
			},

			_resetAsgErrorHandling: function () {
				this.models.message.removeAsgMessages();
				let aChangedAsgPaths = this.models.table.getChangedAssignmentPaths();
				for (let sAsgPath of aChangedAsgPaths) {
					this.models.table.setProperty(sAsgPath + "/assignmentValueState", "None");
					let oAnalysis = new TablePathAnalysis(sAsgPath);
					this.models.table.aggregateAssignmentChanged(oAnalysis.resourcePath);
					this.models.table.calculateAssignmentError(sAsgPath);
				}
			},

			_handlePartialSuccess: function (aAsgPaths) {
				let bPartialSucceeded = false;
				for (let i = aAsgPaths.length - 1; i >= 0; i--) {
					let sAsgPath = aAsgPaths[i];
					let oAsg = this.models.table.getProperty(sAsgPath);
					let bResponse = this.oResponseMap.get(sAsgPath);
					if (!bResponse) {
						continue;
					}
					bPartialSucceeded = true;
					if (oAsg.changeState === "created") {
						this._handleCreatedAsgOnSaveComplete(sAsgPath);
					} else if (oAsg.changeState === "changed") {
						this._handleChangedAsgOnSaveComplete(sAsgPath);
					} else if (oAsg.changeState === "deleted") {
						this._handleDeletedAsgOnSaveComplete(sAsgPath);
					}
				}
				if (bPartialSucceeded) {
					MessageToast.show(this.oBundle.getText("SAVE_PARTIAL_SUCCESS"));
				}
			},

			_handleCreatedAsgOnSaveComplete: function (sAsgPath) {
				this.models.table.setProperty(sAsgPath + "/requestValueState", "None");
				this.models.table.setProperty(sAsgPath + "/requestValueStateText", "");
				this._handleChangedAsgOnSaveComplete(sAsgPath);
			},

			_handleChangedAsgOnSaveComplete: function (sAsgPath) {
				let oAsg = this.models.table.getProperty(sAsgPath);
				let bAsgStatusChanged = oAsg.assignmentStatusValueState === "Information" || oAsg.assignmentStatusValueState === "Error";
				if (bAsgStatusChanged) {
					this.models.table.setProperty(sAsgPath + "/assignmentStatusValueState", "None");
					this.models.table.setProperty(sAsgPath + "/assignmentStatusValueStateText", "");
					let sAsgStatusCode = this.models.table.getProperty(sAsgPath + "/assignmentStatusCode");
					this.models.table.setProperty(sAsgPath + "/copyAssignmentStatusCode", sAsgStatusCode);
				}
				// utilization
				for (let u = 0; u < oAsg.utilization.length; u++) {
					let oUtilization = oAsg.utilization[u];
					let bUtilizationChanged = oUtilization.utilizationValueState === "Information" || oUtilization.utilizationValueState === "Error";
					if (bUtilizationChanged) {
						let sUtilPath = sAsgPath + "/utilization/" + u;
						let sBookedCapacity = this.models.table.getProperty(sUtilPath + "/bookedCapacity");
						this.models.table.setProperty(sUtilPath + "/oldBookedCapacity", sBookedCapacity);
					}
				}

				// assignment (after the others)
				this.models.table.resetAsgValueStates(sAsgPath);
				this.models.table.calculateAssignmentChanged(sAsgPath, "unChanged");
				this.models.table.calculateAssignmentError(sAsgPath);
				this.models.message.removeMessageByTarget(oAsg.asgId);
			},

			_handleDeletedAsgOnSaveComplete: function (sAsgPath) {
				let oAsg = this.models.table.getProperty(sAsgPath);
				this.models.message.removeMessageByTarget(oAsg.asgId);
				this.models.table.removeAssignment(sAsgPath);
				let oAnalysis = new TablePathAnalysis(sAsgPath);
				this.models.table.aggregateAssignmentChanged(oAnalysis.resourcePath);
				this.models.table.aggregateAssignmentError(oAnalysis.resourcePath);
			}
		});
	}
);
