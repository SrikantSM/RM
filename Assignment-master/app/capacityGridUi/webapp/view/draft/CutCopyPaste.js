sap.ui.define(
	["capacityGridUi/view/draft/DraftChange", "capacityGridUi/view/Views", "capacityGridUi/view/table/TransformAssignments"],
	function (DraftChange, Views, TransformAssignments) {
		"use strict";
		return DraftChange.extend("capacityGridUi.view.draft.CutCopyPaste", {
			sScenario: undefined,
			onInit: function () {
				this.injectMembers();
			},

			copyAssignment: function (aCopiedAssignmentPaths) {
				this.sScenario = "CopyPaste";
				this._copyAssignment(aCopiedAssignmentPaths);
			},

			cutAssignment: function (aCopiedAssignmentPaths) {
				this.sScenario = "CutPaste";
				this._copyAssignment(aCopiedAssignmentPaths);
			},

			_copyAssignment: function (aSelectedAssignmentPaths) {
				let aCopiedAssignmentPaths = this.models.table.getCopiedAssignmentPaths() || [];
				this.models.table.unmarkAssignmentCopiedOrCut(aCopiedAssignmentPaths);
				let aValidAssignmentPathsForCopy = aSelectedAssignmentPaths.filter((sPath) => this.models.table.getProperty(sPath).changeState !== "deleted");
				this.models.table.markAssignmentCopiedOrCut(aValidAssignmentPathsForCopy, this.sScenario);
			},

			pasteAssignment: function (oResourceDetails, aAsgPathsToBePasted) {
				return new Promise((resolve) => {
					this.oControllers.draftCreate.expandResourceForAssignment(oResourceDetails).then((bResourceExpanded) => {
						this._pasteAssignment(oResourceDetails, aAsgPathsToBePasted).then(() => {
							resolve();
						});
					});
				});
			},

			_pasteAssignment: function (oResourceDetails, aAsgPaths) {
				let aDraftAssignmentPromises = [];
				let aEmptyAsgsPromises = [];

				if (this._handleDraftExistsForRequestSelected(aAsgPaths, oResourceDetails)) {
					return;
				}
				for (let i = 0; i < aAsgPaths.length; i++) {
					if (this.models.table.getProperty(aAsgPaths[i]).changeState === "empty") {
						let oEmptyAsgsPromise = this._prepareEmptyAssignments(aAsgPaths[i], [oResourceDetails]);
						aEmptyAsgsPromises.push(oEmptyAsgsPromise);
					} else {
						let oPromise = this._prepareDraftAndActiveAssignments(aAsgPaths[i], oResourceDetails);
						aDraftAssignmentPromises.push(oPromise);
					}
				}
				return new Promise((resolve) => {
					this._handleEmptyAssignments(aEmptyAsgsPromises, oResourceDetails).then(() => {
						this._handleDraftAndActiveAssignments(aDraftAssignmentPromises, aAsgPaths, oResourceDetails).then(() => {
							if (this.sScenario === "CutPaste") {
								this.oControllers.draftDelete.deleteAssignment(aAsgPaths.slice(0));
								resolve();
							}
						});
					});
				});
			},

			_prepareEmptyAssignments: function (sAsgPath, aResourceDetails) {
				let oNewAsg = this.models.table.getProperty(sAsgPath);
				let oAssignmentForPaste = TransformAssignments.transformOnPasteAssignment(oNewAsg);
				let oEmptyAsgsPromise = this.oControllers.draftCreate.addAssignment(oAssignmentForPaste, aResourceDetails);
				return oEmptyAsgsPromise;
			},

			_prepareDraftAndActiveAssignments: function (sAsgPath, oResourceDetails) {
				let sResourceID = oResourceDetails.resourceContext.getObject().resourceID;
				let oAssignment = this.models.table.getProperty(sAsgPath);
				let sReferenceAssignmentId = oAssignment.asgId;
				let sResourceRequestID = oAssignment.resourceRequest_ID;
				let oPromise = this.oControllers.draftCreate.createNewAsgDraft(sResourceID, sResourceRequestID, sReferenceAssignmentId);
				return oPromise;
			},

			_handleDraftExistsForRequestSelected: function (aAsgPaths, oResourceDetails) {
				let bError = false;
				for (let i = 0; i < aAsgPaths.length; i++) {
					let sResourceRequestID = this.models.table.getProperty(aAsgPaths[i]).resourceRequest_ID;
					if (this.models.table.isDraftExistsForRequestSelected(sResourceRequestID, this._getAssignmentPathForAdd(oResourceDetails))) {
						let oAsgPaths = this.models.table.getDraftAssignmentPathForRequest(sResourceRequestID, this._getAssignmentPathForAdd(oResourceDetails));
						this.oControllers.draftCreate.displayDraftExistsError(oAsgPaths.asgPath);
						bError = true;
					}
				}
				return bError;
			},

			_handleEmptyAssignments: function (aEmptyAsgsPromises, oResourceDetails) {
				return new Promise((resolve) => {
					if (aEmptyAsgsPromises.length > 0) {
						Promise.all(aEmptyAsgsPromises).then((aAssignments) => {
							this.oControllers.table.focusNewRequest(oResourceDetails);
							for (let i = 0; i < aAssignments.length; i++) {
								if (aAssignments[i].requestValueState === "Error") {
									let sAsgPath = this.models.table.getAssignmentPaths(aAssignments[i].asgId).asgPath;
									this.oControllers.draftCreate.handleNewAsgUIValidations(sAsgPath);
								}
							}
						});
						resolve();
					} else {
						resolve();
					}
				});
			},

			_handleDraftAndActiveAssignments: function (aPromises, aAsgPaths, oResourceDetails) {
				let oResourceContext = oResourceDetails.resourceContext;

				Promise.all(aPromises).catch(() => {
					this.oControllers.draftCreate.displayFailedMessageForCreate(null);
					this.oControllers.page.getView().setBusy(false);
				});

				this._handleChangePromise(Promise.all(aPromises));

				return new Promise((resolve) => {
					if (aPromises.length > 0) {
						Promise.all(aPromises).then((aAssignmentContexts) => {
							for (let i = 0; i < aAssignmentContexts.length; i++) {
								let sView = this.models.app.getProperty("/selectedView");
								let oNewAsg = TransformAssignments.transformAssignment(
									this.oComponent.oTimeColumnsMap,
									aAssignmentContexts[i].context,
									this.oBundle,
									sView
								);
								this.oControllers.draftCreate.addAssignmentToModelForNewAssignment(oResourceContext, oNewAsg);
								this.oControllers.draftCreate.handleAsgOnSuccess(this._getAssignmentPathForAdd(oResourceDetails), aAssignmentContexts[i].context);
							}
							this.oControllers.draftCreate.handleServerMessages();
							if (this.sScenario === "CopyPaste") {
								this.oControllers.page.getView().setBusy(false);
							}
							this.oControllers.draftCreate.expandResourceForAssignment(oResourceDetails).then(() => {
								this.oControllers.table.focusNewRequest(oResourceDetails);
							});
							resolve();
						});
					} else {
						resolve();
					}
				});
			},

			_getAssignmentPathForAdd: function (oResourceDetails) {
				let iNewAssignmentIndex = this.models.table.getNewAsgIndex(oResourceDetails.resourceContext.getPath());
				iNewAssignmentIndex = iNewAssignmentIndex === null ? 0 : iNewAssignmentIndex + 1;
				return oResourceDetails.resourceContext.getPath() + "/assignments/" + iNewAssignmentIndex;
			},

			calculateButtonEnablement: function (iResourceCount, aAsgPaths) {
				let bAtLeastOneAssignmentNotDeleted = this.models.table.atLeastOneAssignmentNotDeleted(aAsgPaths);
				let bCopiedAssignment = this.models.table.getCopiedAssignmentPaths() ? this.models.table.getCopiedAssignmentPaths().length > 0 : false;

				this.models.table.setProperty("/copyAsgEnabled", iResourceCount === 0 && aAsgPaths.length > 0 && bAtLeastOneAssignmentNotDeleted);
				this.models.table.setProperty("/pasteAsgEnabled", iResourceCount === 1 && bCopiedAssignment && aAsgPaths.length === 0);
			}
		});
	}
);