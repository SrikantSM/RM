sap.ui.define(
	[
		"capacityGridUi/view/draft/DraftChange",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/view/table/TransformAssignments",
		"capacityGridUi/view/table/TablePathAnalysis"
	],
	function (DraftChange, ODataEntities, TransformAssignments, TablePathAnalysis) {
		"use strict";
		return DraftChange.extend("capacityGridUi.view.draft.DraftCreate", {
			onInit: function () {
				this.injectMembers();
			},

			addNewAssignment: function () {
				let aResourceDetails = this.oControllers.table.getResourceDetailsForAddAsg();
				let oNewAsg = TransformAssignments.transformOnCreateAssignment(this.oComponent.oTimeColumnsMap, this.oBundle);
				this.oControllers.draftCreate.addAssignment(oNewAsg, aResourceDetails).then(() => {
					this.oControllers.table.focusNewRequest(aResourceDetails[0]);
				});
			},

			// why looped in reverse order?
			// we add assignment to the selected resources synchronously, on expand and adding assignment to each resource, the selected indices of next resource changes while looped in sequence.
			addAssignment: async function (oNewAsg, aResourceDetails) {
				return new Promise(
					async function (resolve, reject) {
						for (let i = aResourceDetails.length - 1; i >= 0; i--) {
							await this.expandResourceForAssignment(aResourceDetails[i]).then((bResourceExpanded) => {
								this.addAssignmentToModelForNewAssignment(aResourceDetails[i].resourceContext, oNewAsg);
								if (!bResourceExpanded) {
									this.expandResourceForAssignment(aResourceDetails[i]).then(() => {
										resolve(oNewAsg);
									});
								} else {
									resolve(oNewAsg);
								}
							});
						}
					}.bind(this)
				);
			},

			expandResourceForAssignment: function (oResourceDetails) {
				let oResourceContext = oResourceDetails.resourceContext;
				let oResource = oResourceContext.getObject();

				return new Promise(
					function (resolve, reject) {
						if (oResource.expanded) {
							resolve(true);
						} else {
							if (oResource.assignmentExistsForTheResource) {
								this.oControllers.table.expandRow(oResourceContext, oResourceDetails.resourceIndex).then(() => {
									resolve(true);
								});
							} else {
								resolve(false);
							}
						}
					}.bind(this)
				);
			},

			addAssignmentToModelForNewAssignment: function (oResourceContext, oAssignment) {
				this._addAssignmentToModel(oResourceContext, oAssignment);
				let sResourcePath = oResourceContext.getPath();
				this.models.table.setProperty(sResourcePath + "/assignmentExistsForTheResource", true);
				this.models.table.setProperty(sResourcePath + "/assignmentsLoaded", true);
				this.models.table.setProperty("/filterDropDownEnabled", true);
			},

			_addAssignmentToModel: function (oResourceContext, oAssignment) {
				let sResourcePath = oResourceContext.getPath();
				let oResource = oResourceContext.getObject();
				oAssignment.resource_ID = oResource.resourceID;
				let aAssignments = oResource.assignments ? oResource.assignments : [];
				let iNewAsgIndex = this.models.table.getNewAsgIndex(sResourcePath);
				iNewAsgIndex = iNewAsgIndex === null ? 0 : iNewAsgIndex + 1;
				aAssignments.splice(iNewAsgIndex, 0, oAssignment);
				this.models.table.setProperty(sResourcePath + "/assignments", aAssignments);
				this.models.table.aggregateAssignmentChanged(sResourcePath);
			},

			onChangeRequest: function (oEvent) {
				let oAsgContext = oEvent.getSource().getBindingContext();
				let sRequestId = oEvent.getSource().getSelectedKey();
				let sAsgPath = oAsgContext.getPath();
				this.models.message.removeMessageByTarget(this.models.table.getProperty(sAsgPath).asgId);
				let oAnalysis = new TablePathAnalysis(sAsgPath);
				let sResourceID = this.models.table.getProperty(oAnalysis.resourcePath + "/resourceID");
				// why draft validations in UI ?
				// every time valid request is selected new draft is created irrespective of resource request combination, since backend is not able to validate the resource request combinations in the draft
				// UI to check for resource and request combination when existing request is selected
				let bDraftExistsForRequestSelected = this.models.table.isDraftExistsForRequestSelected(sRequestId, sAsgPath);
				this._cancelAsg(oAsgContext)
					.then(() => {
						if (sRequestId && !bDraftExistsForRequestSelected) {
							let oPromise = this.createNewAsgDraft(sResourceID, sRequestId, null);
							this._hanldeNewAssignmentDraft(oPromise, sAsgPath);
						} else if (bDraftExistsForRequestSelected) {
							this.handleDraftExistsForAssignment(sAsgPath);
						} else {
							this.handleNewAsgUIValidations(sAsgPath);
						}
					})
					.catch((oError) => {
						// why old request details are stored and populated back ?
						// while trying to change request from X to Y the draft of X to be deleted and new draft for Y to be created.
						// failing to delete draft X should revert back the UI to Assignment X.
						let sResourceRequestID = this.models.table.getProperty(sAsgPath + "/oldResourceRequest_ID");
						let sRequestId = this.models.table.getProperty(sAsgPath + "/oldRequestDisplayId");
						let sRequestName = this.models.table.getProperty(sAsgPath + "/oldRequestName");
						this.models.table.setProperty(sAsgPath + "/resourceRequest_ID", sResourceRequestID);
						this.models.table.setProperty(sAsgPath + "/requestDisplayId", sRequestId);
						this.models.table.setProperty(sAsgPath + "/requestName", sRequestName);
						this.models.message.addServerMessages("transient");
						this.oControllers.messageDialog.open();
					});
			},

			handleDraftExistsForAssignment: function (sAsgPath) {
				this.displayDraftExistsError(sAsgPath);
				let oNewAsg = TransformAssignments.transformOnCreateAssignment(this.oComponent.oTimeColumnsMap, this.oBundle);
				oNewAsg.requestValueState = "Information";
				oNewAsg.requestValueStateText = this.oBundle.getText("EDITED_CELL_INFO_MSG");
				this.models.table.setProperty(sAsgPath, oNewAsg);
			},

			displayDraftExistsError: function (sAsgPath) {
				let sAsgId = this.models.table.getProperty(sAsgPath).asgId;
				this.models.message.addClientMessage("transient", this.oBundle.getText("REQUEST_ASSIGNED_TO_RESOURCE"), sAsgId);
				this.oControllers.messageDialog.open();
				this.models.table.calculateAssignmentError(sAsgPath);
			},

			handleNewAsgUIValidations: function (sAsgPath) {
				let sRequestName = this.models.table.getProperty(sAsgPath + "/requestName");
				let oNewAsg = TransformAssignments.transformOnCreateAssignment(this.oComponent.oTimeColumnsMap, this.oBundle);
				if (sRequestName) {
					oNewAsg.requestName = sRequestName;
					oNewAsg.requestValueState = "Error";
					oNewAsg.requestValueStateText = this.oBundle.getText("REQUEST_INVALID_MSG");
					this.models.table.setProperty(sAsgPath, oNewAsg); // Set New Assgignment to model before adding persistent Error as assignment ID keep changing on New Request
					this.models.message.addClientMessage("persistent", this.oBundle.getText("REQUEST_INVALID_MSG"), oNewAsg.asgId, "requestName");
				} else {
					// Remove Error if value is cleared
					oNewAsg.requestValueState = "Information";
					oNewAsg.requestValueStateText = this.oBundle.getText("EDITED_CELL_INFO_MSG");
					this.models.table.setProperty(sAsgPath, oNewAsg);
				}
				this.models.table.calculateAssignmentError(sAsgPath);
			},

			_cancelAsg: function (oAsgContext) {
				if (oAsgContext.getObject().changeState === "created") {
					this.oControllers.page.getView().setBusy(true);
					sap.ui.getCore().getMessageManager().removeAllMessages();
					return new Promise(
						function (resolve, reject) {
							let sAsgPath = oAsgContext.getPath();
							let oPromise = this.oControllers.draftCancel.sendCancelRequests([sAsgPath]);
							oPromise
								.then(() => {
									this.models.table.updateUtilizationsOnDelete(sAsgPath);
									resolve();
								})
								.catch(reject)
								.finally(() => {
									this.oControllers.page.getView().setBusy(false);
								});
						}.bind(this)
					);
				} else {
					return Promise.resolve();
				}
			},

			_hanldeNewAssignmentDraft: function (oPromise, sAsgPath) {
				oPromise
					.then((oParameters) => {
						this.handleAsgOnSuccess(sAsgPath, oParameters.context);
						this.handleServerMessages();
					})
					.catch(() => {
						this._handleAsgOnFail(sAsgPath);
					});
				this._handleChangePromise(oPromise);
			},

			handleServerMessages() {
				let aErrorMsgTargets = this.models.message.addServerMessages("persistent", "requestName");
				for (let i = 0; i < aErrorMsgTargets.length; i++) {
					let sAsgId = aErrorMsgTargets[i].target;
					let sAsgPath = this.models.table.getAssignmentPaths(sAsgId).asgPath;
					this.models.table.setProperty(sAsgPath + "/assignmentValueState", aErrorMsgTargets[i].type);
					this.models.table.calculateAssignmentError(sAsgPath);
				}
			},

			createNewAsgDraft: function (sResourceID, sRequestId, sReferenceAssignmentId) {
				this.oControllers.page.getView().setBusy(true);
				sap.ui.getCore().getMessageManager().removeAllMessages();
				let oPromise = this.sendCreateDraftRequest(sResourceID, sRequestId, sReferenceAssignmentId);
				return oPromise;
			},

			sendCreateDraftRequest: function (sResourceID, sRequestId, sReferenceAsgId) {
				let sView = this.models.app.getProperty("/selectedView");
				let oDateRange = this.models.date.getDisplayTimePeriod(sView);
				let oParameters = {
					$expand: ODataEntities.bucketNavProperty(sView)
				};
				let oBinding = this.models.oDataV4.bindList("/" + ODataEntities.ASSIGNMENT_ENTITY_SET, undefined, undefined, undefined, oParameters);
				oBinding.create(
					{
						resourceRequest_ID: sRequestId,
						resource_ID: sResourceID,
						assignmentStartDate: oDateRange.oDateValidFrom,
						assignmentEndDate: oDateRange.oDateValidTo,
						referenceAssignment: sReferenceAsgId,
						// Hardcoded few random value, as entity is expecting some value even after marking optional
						// Till BE fix the issue
						requestStartDate: "9999-04-01",
						requestEndDate: "9999-09-01",
						projectRoleName: "ProjectRole"
					},
					true
				);
				return new Promise(
					function (resolve, reject) {
						// why not used created () promise to handle success and error?
						// the promise fails only if the transient entity is deleted
						// not able to catch the error scenario, below event will catch the error and message is available in core message manager
						oBinding.attachEvent(
							"createCompleted",
							(oEvent) => {
								let oParameters = oEvent.getParameters();
								if (oParameters.success) {
									resolve(oParameters);
								} else {
									let oParameters = oEvent.getParameters();
									reject(oParameters);
								}
							},
							this
						);
					}.bind(this)
				);
			},

			handleAsgOnSuccess: function (sAsgPath, oContext) {
				let sView = this.models.app.getProperty("/selectedView");
				let oDraftAsg = this.models.table.getDraftAsgByRequest(oContext.getObject().resourceRequest_ID);
				if (oDraftAsg) {
					oDraftAsg.staffedHours = oDraftAsg.staffedHours + oContext.getObject().assignmentDurationInHours;
				}
				let oNewAssignment = TransformAssignments.transformAssignment(this.oComponent.oTimeColumnsMap, oContext, this.oBundle, sView, oDraftAsg);
				this._updateAssignment(oNewAssignment);
				this.models.table.setProperty(sAsgPath, oNewAssignment);
				this.models.table.updateUtilizationsOnCreate(sAsgPath);
				this.models.table.calculateAssignmentChanged(sAsgPath, "created");
				this.models.table.calculateAssignmentError(sAsgPath);
				this.oControllers.page.getView().setBusy(false);
			},

			_updateAssignment: function (oAssignment) {
				oAssignment.oldResourceRequest_ID = oAssignment.resourceRequest_ID;
				oAssignment.oldRequestDisplayId = oAssignment.requestDisplayId;
				oAssignment.oldRequestName = oAssignment.requestName;
				oAssignment.requestValueState = "Information";
				oAssignment.requestValueStateText = this.oBundle.getText("EDITED_CELL_INFO_MSG");
				oAssignment.assignmentStatusValueState = "Information";
				oAssignment.assignmentStatusValueStateText = this.oBundle.getText("EDITED_CELL_INFO_MSG");
				oAssignment.utilization.forEach(
					function (oUtil) {
						oUtil.utilizationValueState = "Information";
						oUtil.utilizationValueStateText = this.oBundle.getText("EDITED_CELL_INFO_MSG");
					}.bind(this)
				);
				return oAssignment;
			},

			_handleAsgOnFail: function (sAsgPath) {
				this.displayFailedMessageForCreate(sAsgPath);
				let oNewAsg = TransformAssignments.transformOnCreateAssignment(this.oComponent.oTimeColumnsMap, this.oBundle);
				this.models.table.setProperty(sAsgPath, oNewAsg);
				this.models.table.calculateAssignmentError(sAsgPath);
				this.oControllers.page.getView().setBusy(false);
			},

			displayFailedMessageForCreate: function (sAsgPath) {
				let sAsgId = sAsgPath ? this.models.table.getProperty(sAsgPath).asgId : null;
				this.models.message.addServerMessages("transient", "", sAsgId);
				this.oControllers.messageDialog.open();
			}
		});
	}
);
