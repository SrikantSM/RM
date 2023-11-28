sap.ui.define(["capacityGridUi/view/draft/DraftChange", "capacityGridUi/view/draft/DraftActions"], function (DraftChange, DraftActions) {
	"use strict";
	return DraftChange.extend("capacityGridUi.view.draft.DraftDelete", {
		oResponseMap: undefined,
		onInit: function () {
			this.injectMembers();
		},

		deleteAssignment: function (aSelectedAsgPaths) {
			this.oControllers.page.getView().setBusy(true);
			sap.ui.getCore().getMessageManager().removeAllMessages();
			let oPromise = this._sendDeleteRequests(aSelectedAsgPaths);
			oPromise
				.then(() => {
					this._afterDeleteRequestsCompleted(aSelectedAsgPaths);
					this.oControllers.table.calculateEnablementForToolbarElements();
				})
				.catch(() => {
					this.models.message.addServerMessages("transient");
					this.oControllers.messageDialog.open();
				})
				.finally(() => {
					this.oControllers.page.getView().setBusy(false);
				});
			this._handleChangePromise(oPromise);
		},

		_sendDeleteRequests: function (aAsgPaths) {
			let aPromises = [];
			for (let sAsgPath of aAsgPaths) {
				let oAsg = this.models.table.getProperty(sAsgPath);
				if (oAsg.changeState !== "deleted" && oAsg.changeState !== "empty") {
					let oPromise = this._handleDeleteAssignment(sAsgPath, oAsg);
					aPromises.push(oPromise);
				}
			}
			return Promise.all(aPromises);
		},

		_handleDeleteAssignment: function (sAsgPath, oAsg) {
			this.oResponseMap = new Map();
			return new Promise(
				function (resolve, reject) {
					let oPromise;
					// In case of assignment created need to delete the assignment in draft status else need to create new draft to lock the assignment
					if (oAsg.changeState === "created") {
						oPromise = this.oControllers.draftSave.deleteAssignment(oAsg.oContext, "$auto.delete");
					} else {
						oPromise = this._sendDraftCreateAction(oAsg);
					}
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

		// Draft is created to lock the assignment in the delete scenario.
		_sendDraftCreateAction: function (oAsg) {
			if (oAsg.draftExists) {
				// no draft needs to be created if aleredy exists.
				return Promise.resolve();
			} else {
				let sessionGuid = "$auto.delete";
				let oPromise = oAsg.oContext.setProperty("action", DraftActions.CREATE, sessionGuid);
				return oPromise;
			}
		},

		_afterDeleteRequestsCompleted: function (aSelectedAsgPaths) {
			for (let i = aSelectedAsgPaths.length - 1; i >= 0; i--) {
				let sAsgPath = aSelectedAsgPaths[i];
				let oAsg = this.models.table.getProperty(sAsgPath);
				let bResponse = oAsg.changeState !== "empty" ? this.oResponseMap.get(sAsgPath) : true;
				if (!bResponse || oAsg.changeState === "deleted") {
					continue;
				}
				this.models.table.unmarkAssignmentCopiedOrCut(aSelectedAsgPaths.slice(i, i + 1));
				if (oAsg.changeState === "empty") {
					this.oControllers.draftCancel.handleEmptyAsgOnCancelComplete(sAsgPath);
				} else if (oAsg.changeState === "created") {
					this._handleDeleteCompleteofNewAsg(sAsgPath);
				} else {
					this._handleDeleteComplete(sAsgPath);
				}
			}
		},

		_handleDeleteComplete: function (sAsgPath) {
			let oAsg = this.models.table.getProperty(sAsgPath);
			// handle visiblity of util Input
			for (let u = 0; u < oAsg.utilization.length; u++) {
				this.models.table.setProperty(sAsgPath + "/utilization/" + u + "/empty", true);
			}
			// assignment (after the others)
			this.models.table.resetAsgValueStates(sAsgPath);
			this.models.message.removeMessageByTarget(oAsg.asgId);
			this.models.table.calculateAssignmentChanged(sAsgPath, "deleted");
			this.models.table.calculateAssignmentError(sAsgPath);
			this.models.table.updateUtilizationsOnDelete(sAsgPath);
		},

		_handleDeleteCompleteofNewAsg: function (sAsgPath) {
			this.oControllers.draftCancel.handleCreatedAsgOnCancelComplete(sAsgPath);
			this.models.app.setProperty("/draftMsgVisible", false);
		}
	});
});