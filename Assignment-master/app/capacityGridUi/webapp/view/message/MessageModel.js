sap.ui.define(["sap/ui/model/json/JSONModel", "capacityGridUi/view/table/TablePathAnalysis"], function (JSONModel, TablePathAnalysis) {
	"use strict";

	return JSONModel.extend("capacityGridUi.view.message.MessageModel", {
		constructor: function (oBundle, oTableModel) {
			JSONModel.call(this, {});
			this._setMessages([]);
			this.oBundle = oBundle;
			this.oTableModel = oTableModel;
		},

		// Function will fetch all type of message from SAP Message Manager and Populate with the right target
		// sMsgState: describes weather message is transient or persistent
		// sFocusPath : In case of persistent error Link has to navigate to the specific error field
		// sAsgId :  In case of create new Asg server will not able to pass the Target for failure scenario, In that case caller will pass it.
		addServerMessages: function (sMsgState, sFocusPath, sAsgId) {
			let aErrorMsgDetails = [];
			let oMessageManager = sap.ui.getCore().getMessageManager();
			let oMessageModel = oMessageManager.getMessageModel();
			let aMessages = oMessageModel.getData();
			if (aMessages && aMessages.length > 0) {
				for (let i = 0; i < aMessages.length; i++) {
					let aMsgTargets = aMessages[i].getTarget() ? aMessages[i].getTarget().split("/") : null;
					let sMsgTarget = aMsgTargets ? aMsgTargets[aMsgTargets.length - 1] : sAsgId;
					this.addServerMessage(sMsgState, null, aMessages[i], sFocusPath, sMsgTarget);
					if (sMsgTarget && aMessages[i].type !== "Information") {
						let oErrorMsgDetails = {
							target: sMsgTarget,
							message: aMessages[i].getMessage(),
							type: aMessages[i].type
						};
						// need to return target and message details, as row highlight and value State of the table,cell is dependent on the message from the core model.
						// Will add only unique targets and prioritize Error over any other
						let oExistingMessage = aErrorMsgDetails.find((oMessage) => oMessage.target === sMsgTarget);
						if (!oExistingMessage) {
							aErrorMsgDetails.push(oErrorMsgDetails);
						} else if (oExistingMessage.type !== aMessages[i].type && aMessages[i].type === "Error") {
							aErrorMsgDetails = aErrorMsgDetails.filter((oMessage) => oMessage.target !== sMsgTarget);
							aErrorMsgDetails.push(oErrorMsgDetails);
						}
					}
				}
			}
			return aErrorMsgDetails;
		},

		// This function can be called with the error objects also as in certain cases where message from message model is not realiable
		addServerMessage: function (sMsgState, oErrorObject, oCoreMessage, sFocusPath, sMsgTarget) {
			let oSourceError = oErrorObject ? this._getSourceError(oErrorObject) : null;
			let iErrCode = oSourceError ? oSourceError.status : oCoreMessage.getCode();
			let sMessage = oSourceError ? oSourceError.message : oCoreMessage.getMessage();
			let oServiceTexts = this._getServiceTexts(iErrCode, sMsgTarget, sMessage);
			let oMessage = {
				type: oErrorObject ? "Error" : oCoreMessage.type,
				state: sMsgState,
				message: oServiceTexts.message,
				clientError: false,
				description: oServiceTexts.description,
				target: sMsgTarget,
				focusPath: sFocusPath
			};
			let aMessages = this.getProperty("/messages");
			aMessages.push(oMessage);
			this._setMessages(aMessages);
		},

		_getSourceError: function (oServiceError) {
			if (oServiceError.cause) {
				// request was not processed because the containing batch failed
				return oServiceError.cause;
			} else {
				// batch was ok but the single request failed
				return oServiceError;
			}
		},

		_getServiceTexts: function (iErrCode, sMsgTarget, sMessage) {
			if (sMsgTarget) {
				return {
					message: sMessage,
					description: this._getBreadcrumb(sMsgTarget)
				};
			} else if (iErrCode === 0) {
				return {
					message: this.oBundle.getText("REQUEST_ERROR_CONNECTION_TITLE"),
					description: this.oBundle.getText("REQUEST_ERROR_CONNECTION_DESCRIPTION")
				};
			} else if (iErrCode === 403) {
				return {
					message: this.oBundle.getText("REQUEST_ERROR_FORBIDDEN_TITLE"),
					description: this.oBundle.getText("REQUEST_ERROR_FORBIDDEN_DESCRIPTION")
				};
			} else if (iErrCode === 500) {
				return {
					message: this.oBundle.getText("REQUEST_ERROR_UNEXPECTED_TITLE"),
					description: this.oBundle.getText("REQUEST_ERROR_UNEXPECTED_DESCRIPTION") + "\n\n(" + sMessage + ")"
				};
			} else {
				return {
					message: sMessage,
					description: null
				};
			}
		},

		addClientMessage: function (sMsgState, sMessage, sTarget, sFocusPath) {
			let oMessage = {
				type: "Error",
				state: sMsgState,
				message: sMessage,
				clientError: true,
				description: this._getBreadcrumb(sTarget),
				target: sTarget,
				focusPath: sFocusPath
			};
			let aMessages = this.getProperty("/messages");
			aMessages.push(oMessage);
			this._setMessages(aMessages);
		},

		_getBreadcrumb: function (sAsgId) {
			if (sAsgId) {
				let sAsgPath = this.oTableModel.getAssignmentPaths(sAsgId).asgPath;
				let oAnalysis = new TablePathAnalysis(sAsgPath);
				let oResource = this.oTableModel.getProperty(oAnalysis.resourcePath);
				if (oAnalysis.assignmentPath) {
					let oAsg = this.oTableModel.getProperty(oAnalysis.assignmentPath);
					return oResource.resourceName + " > " + oAsg.requestName;
				} else {
					return oResource.resourceName;
				}
			} else {
				return null;
			}
		},

		removeAllMessages: function () {
			this._setMessages([]);
		},

		removeMessageByTarget: function (sAsgId, sFocusPath) {
			let aMessages = this.getProperty("/messages");
			let aNewMessages = sFocusPath
				? aMessages.filter((oMessage) => !oMessage.target || oMessage.target !== sAsgId || oMessage.focusPath !== sFocusPath)
				: aMessages.filter((oMessage) => !oMessage.target || oMessage.target !== sAsgId);
			this._setMessages(aNewMessages);
		},

		removeAsgMessages: function () {
			let aMessages = this.getProperty("/messages");
			let aNewMessages = aMessages.filter((oMessage) => oMessage.focusPath !== "assignment");
			this._setMessages(aNewMessages);
		},

		removeTransientMessages: function () {
			let aMessages = this.getProperty("/messages");
			let aNewMessages = aMessages.filter((oMessage) => oMessage.state !== "transient");
			this._setMessages(aNewMessages);
		},

		getClientMessages: function () {
			let aMessages = this.getProperty("/messages");
			let aClientMessages = aMessages.filter((oClientMessage) => oClientMessage.clientError);
			return aClientMessages;
		},

		_setMessages: function (aMessages) {
			this.setProperty("/messages", aMessages);
			let aPersistentMessages = aMessages.filter((oMessage) => oMessage.state !== "transient");
			let sMsgType = "Neutral";
			let sMsgBtnIcon = "sap-icon://message-information";
			for (let i = 0; i < aPersistentMessages.length; i++) {
				if (aMessages[i].type === "Error") {
					sMsgType = "Negative";
					sMsgBtnIcon = "sap-icon://message-error";
					break;
				} else if (aMessages[i].type === "Warning") {
					sMsgType = "Critical";
					sMsgBtnIcon = "sap-icon://message-warning";
					break;
				}
			}
			this.setProperty("/count", aPersistentMessages.length);
			this.setProperty("/msgButtonType", sMsgType);
			this.setProperty("/msgButtonIcon", sMsgBtnIcon);
		}
	});
});
