sap.ui.define(
	[
		"capacityGridUi/view/draft/DraftChange",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/ODataEntities",
		"sap/ui/core/format/DateFormat",
		"sap/m/MessageBox",
		"capacityGridUi/view/draft/AssignmentStatus"
	],
	function (DraftChange, DraftActions, Views, ODataEntities, DateFormat, MessageBox, AssignmentStatus) {
		"use strict";

		return DraftChange.extend("capacityGridUi.view.draft.DraftUpdateStatus", {
			onInit: function () {
				this.injectMembers();
			},

			update: function (oEventSelect) {
				let oSelect = oEventSelect.getSource();
				let oAsgContext = oSelect.getBindingContext();
				let sAsgPath = oAsgContext.getPath();
				let oAsg = oAsgContext.getObject();
				let oAssignmentStatusItem = oSelect.getSelectedItem();
				let sAssignmentStatusItemText = oAssignmentStatusItem.getText();
				let oPreviousStates = {
					previousAssignmentStatusValueState: oAsg.assignmentStatusValueState,
					previousAssignmentStatusValueStateText: oAsg.assignmentStatusValueStateText,
					previousChangedFlag: oAsg.changed,
					previousSelectedItem: oEventSelect.getParameter("previousSelectedItem")
				};
				// send patch
				let iAction = oAsg.draftExists ? DraftActions.UPDATE : DraftActions.CREATE; // before changing "changed"!
				let oPromise = this._sendPatch(oAsg, oSelect.getSelectedKey(), iAction);
				this.models.table.setProperty(sAsgPath + "/assignmentStatusValueState", "Information");
				this.models.table.setProperty(sAsgPath + "/assignmentStatusValueStateText", this.oBundle.getText("EDITED_CELL_INFO_MSG"));
				this.models.table.setProperty(sAsgPath + "/assignmentStatusText", sAssignmentStatusItemText);
				this.models.message.removeMessageByTarget(oAsg.asgId, "assignmentStatusCode");
				this.models.table.calculateAssignmentChanged(sAsgPath, oAsg.changeState === "unChanged" ? "changed" : oAsg.changeState); // after determine action
				this.models.table.calculateAssignmentError(sAsgPath);
				this.oControllers.table.calculateEnablementForToolbarElements();
				this._handleChangePromise(oPromise);
				oPromise
					.then(() => {
						this._handlePatchSuccess(oSelect);
					})
					.catch((oError) => {
						this._handlePatchError(oError, sAsgPath, oPreviousStates);
					});
			},

			_handlePatchSuccess: function (oSelect) {
				let oAsgContext = oSelect.getBindingContext();
				let sAsgPath = oAsgContext.getPath();
				let aMessageDetails = this.models.message.addServerMessages("persistent", "assignmentStatusCode");
				if (aMessageDetails.length > 0) {
					this.models.table.setProperty(sAsgPath + "/assignmentStatusValueState", aMessageDetails[0].type);
					this.models.table.setProperty(sAsgPath + "/assignmentStatusValueStateText", aMessageDetails[0].message);
					this.models.table.calculateAssignmentError(sAsgPath);
				}
			},

			_sendPatch: function (oAsg, sKey, iAction) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				let aPromises = [];
				let iStatusKey = parseInt(sKey);
				aPromises.push(oAsg.oContext.setProperty("assignmentStatusCode", iStatusKey));
				aPromises.push(oAsg.oContext.setProperty("action", iAction));
				return Promise.all(aPromises);
			},

			_handlePatchError: function (oError, sAsgPath, oPreviousStates) {
				let sMessage = oError.message;
				let oAsg = this.models.table.getProperty(sAsgPath);
				try {
					this.models.table.setProperty(sAsgPath + "/assignmentStatusCode", oPreviousStates.previousSelectedItem.getKey());
					this.models.table.setProperty(sAsgPath + "/assignmentStatusText", oPreviousStates.previousSelectedItem.getText());
					this.models.table.setProperty(sAsgPath + "/assignmentStatusValueState", oPreviousStates.previousAssignmentStatusValueState);
					this.models.table.setProperty(sAsgPath + "/assignmentStatusValueStateText", oPreviousStates.previousAssignmentStatusValueStateText);
					this.models.table.calculateAssignmentChanged(sAsgPath, oPreviousStates.previousChangedFlag ? oAsg.changeState : "unChanged");
					this.models.table.calculateAssignmentError(sAsgPath);
					this.oControllers.table.calculateEnablementForToolbarElements();
					this.models.message.addServerMessages("transient");
					this.oControllers.messageDialog.open();
				} catch (e) {
					MessageBox.error(sMessage);
				}
			}
		});
	}
);
