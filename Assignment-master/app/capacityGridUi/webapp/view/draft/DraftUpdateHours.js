sap.ui.define(
	[
		"capacityGridUi/view/draft/DraftChange",
		"capacityGridUi/view/draft/DraftActions",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/ODataEntities",
		"sap/ui/core/format/DateFormat",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"capacityGridUi/view/table/TablePathAnalysis"
	],
	function (DraftChange, DraftActions, Views, ODataEntities, DateFormat, MessageBox, MessageToast, TablePathAnalysis) {
		"use strict";

		return DraftChange.extend("capacityGridUi.view.draft.DraftUpdateHours", {
			onInit: function () {
				this.injectMembers();
			},

			update: function (oInput) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				let oUtilContext = oInput.getBindingContext();
				let sUtilPath = oUtilContext.getPath();
				let oPathAnalysis = new TablePathAnalysis(sUtilPath);
				let sAsgPath = oPathAnalysis.assignmentPath;
				let oAsg = this.models.table.getProperty(sAsgPath);
				let sHours = oInput.getValue();
				let oPreviousedingStates = {
					previousUtilizationValueState: this.models.table.getProperty(sUtilPath + "/utilizationValueState"),
					previousUtilizationValueStateText: this.models.table.getProperty(sUtilPath + "/utilizationValueStateText"),
					previousChangedFlag: oAsg.changed,
					previousBookedCapacity: this.models.table.getProperty(sUtilPath + "/copyBookedCapacity")
				};

				// validate
				let bValid = this._validate(oInput, sUtilPath);
				if (!bValid) {
					return;
				}

				// send patch
				let iAction = oAsg.draftExists ? DraftActions.UPDATE : DraftActions.CREATE; // before changing "changed"!
				let oPromise = this._sendPatch(oUtilContext, oAsg, sHours, iAction);
				this.models.table.setProperty(sUtilPath + "/utilizationValueState", "Information");
				this.models.table.setProperty(sUtilPath + "/utilizationValueStateText", this.oBundle.getText("EDITED_CELL_INFO_MSG"));
				this.models.message.removeMessageByTarget(oAsg.asgId, "utilization/" + oPathAnalysis.utilizationIndex);
				this.models.table.updateUtilizationsOnChange(sUtilPath);
				this.models.table.calculateAssignmentChanged(sAsgPath, oAsg.changeState === "unChanged" ? "changed" : oAsg.changeState); // after determine action
				this.models.table.calculateAssignmentError(sAsgPath);
				this.oControllers.table.calculateEnablementForToolbarElements();
				this._handleChangePromise(oPromise);
				oPromise
					.then(() => {
						this._handlePatchSuccess(oPathAnalysis);
					})
					.catch((oError) => {
						this._handlePatchError(oError, oPathAnalysis, oPreviousedingStates);
					});
			},

			_handlePatchSuccess: function (oPathAnalysis) {
				let sUtilPath = oPathAnalysis.utilizationPath;
				let sAsgPath = oPathAnalysis.assignmentPath;
				let aMessageDetails = this.models.message.addServerMessages("persistent", "utilization/" + oPathAnalysis.utilizationIndex);
				if (aMessageDetails.length > 0) {
					this.models.table.setProperty(sUtilPath + "/utilizationValueState", aMessageDetails[0].type);
					this.models.table.setProperty(sUtilPath + "/utilizationValueStateText", aMessageDetails[0].message);
					this.models.table.calculateAssignmentError(sAsgPath);
				}
			},

			_validate: function (oInput, sUtilPath) {
				// client validation - invalid number
				if (!oInput.getProperty("value").match(/^\d+$/)) {
					oInput.setValue(this.models.table.getProperty(sUtilPath + "/copyBookedCapacity"));
					MessageToast.show(this.oBundle.getText("INVALID_NUMBER_REVERTED"), {
						my: sap.ui.core.Popup.Dock.CenterTop,
						of: oInput
					});
					return false;
				}

				// client validation - very huge number
				const MAX_VALUE_IN_A_CELL = 10000;
				if (oInput.getProperty("value") >= MAX_VALUE_IN_A_CELL) {
					oInput.setValue(this.models.table.getProperty(sUtilPath + "/copyBookedCapacity"));
					MessageToast.show(this.oBundle.getText("VERY_HIGH_NUMBER_REVERTED", MAX_VALUE_IN_A_CELL), {
						my: sap.ui.core.Popup.Dock.CenterTop,
						of: oInput
					});
					return false;
				}

				return true;
			},

			_sendPatch: function (oUtilContext, oAsg, sHours, iAction) {
				let aPromises = [];
				let oUtil = oUtilContext.getObject();
				let sView = this.models.app.getProperty("/selectedView");
				let sNavProperty = ODataEntities.bucketNavProperty(sView);
				let sAsgODataPath = sNavProperty + "(assignment_ID=" + oUtil.asgId + ",timePeriod='" + oUtil.timePeriod + "')";
				let iHours = parseInt(sHours, 10);
				if (sView === Views.DAILY) {
					let oDateFormat = DateFormat.getInstance({
						pattern: "yyyy-MM-dd"
					});
					let sDate = oDateFormat.format(new Date(oUtil.timePeriod));
					aPromises.push(
						oAsg.oContext.setProperty(sAsgODataPath + "/bookedCapacityInHours", iHours),
						oAsg.oContext.setProperty(sAsgODataPath + "/date", sDate),
						oAsg.oContext.setProperty(sAsgODataPath + "/action", iAction)
					);
				} else {
					aPromises.push(
						oAsg.oContext.setProperty(sAsgODataPath + "/bookedCapacityInHours", iHours),
						oAsg.oContext.setProperty(sAsgODataPath + "/startDate", oUtil.startDate),
						oAsg.oContext.setProperty(sAsgODataPath + "/endDate", oUtil.endDate),
						oAsg.oContext.setProperty(sAsgODataPath + "/action", iAction)
					);
				}
				return Promise.all(aPromises);
			},

			_handlePatchError: function (oError, oPathAnalysis, oPreviousStates) {
				let sMessage = oError.message;
				try {
					let sUtilPath = oPathAnalysis.utilizationPath;
					let sAsgPath = oPathAnalysis.assignmentPath;
					let oAsg = this.models.table.getProperty(sAsgPath);
					this.models.table.setProperty(sUtilPath + "/bookedCapacity", oPreviousStates.previousBookedCapacity);
					this.models.table.setProperty(sUtilPath + "/utilizationValueState", oPreviousStates.previousUtilizationValueState);
					this.models.table.setProperty(sUtilPath + "/utilizationValueStateText", oPreviousStates.previousUtilizationValueStateText);
					this.models.table.updateUtilizationsOnChange(sUtilPath);
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
