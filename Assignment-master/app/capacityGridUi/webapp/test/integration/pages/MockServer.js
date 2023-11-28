sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "capacityGridUi/localService/mockserver"],
	function (Opa5, OpaBuilder, mockserver) {
		"use strict";

		let sPageViewName = "view.Page";
		let sTableViewName = "view.table.Table";
		let fnMatchServerRequest = function (oRequest, sUrl, sEntitySet, sAsgId, oData) {
			let sRequestUrl = oRequest.url;
			let oRequestBody = oRequest.requestBody;
			let iRequestAction = oRequestBody ? oRequestBody.action : null;
			let sRequestHours = oRequestBody ? oRequestBody.bookedCapacityInHours : null;
			let bRequestAssignmentStatus = oRequestBody ? oRequestBody.assignmentStatusCode : null;
			if (sUrl === undefined && sEntitySet === undefined && sAsgId === undefined && oData === undefined) return false;
			let bMatch =
				(sUrl === undefined || (typeof sUrl === "string" ? sRequestUrl.includes(sUrl) : sUrl.test(sRequestUrl))) &&
				(sEntitySet === undefined || sRequestUrl.includes(sEntitySet)) &&
				(sAsgId === undefined || sRequestUrl.includes(sAsgId)) &&
				(oData === undefined ||
					((oData.action === undefined || oData.action === iRequestAction) &&
						(oData.bookedCapacityInHours === undefined || oData.bookedCapacityInHours === sRequestHours) &&
						(oData.assignmentStatusCode === undefined || oData.assignmentStatusCode === bRequestAssignmentStatus)));
			return bMatch;
		};

		Opa5.createPageObjects({
			onTheMockServer: {
				actions: {
					resetRequests: function () {
						let sMsg = "When.onTheMockServer.resetRequests()";
						return this.waitFor({
							id: "app",
							viewName: sPageViewName,
							success: function () {
								mockserver.resetRequests();
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					failOnNextRequest: function (oParams) {
						let sMsg =
							"When.onTheMockServer.failOnNextRequest(" +
							(oParams && oParams.code) +
							", " +
							(oParams && oParams.batch) +
							", " +
							(oParams && oParams.count) +
							")";
						return this.waitFor({
							id: "app",
							viewName: sPageViewName,
							success: function () {
								mockserver.failOnNextRequest(oParams);
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					messageOnNextRequest: function (oParams) {
						let sMsg =
							"When.onTheMockServer.messageOnNextRequest()";
						return this.waitFor({
							id: "app",
							viewName: sPageViewName,
							success: function () {
								mockserver.messageOnNextRequest(oParams);
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					requestSentToServer: function (oParams) {
						let sMsg = "Then.onTheMockServer.requestSentToServer(" + oParams + ")";
						return this.waitFor({
							id: "app",
							viewName: sPageViewName,
							success: function () {
								let aRequests = mockserver.getRequests();
								let bMatches = false;
								for (let i = 0; i < aRequests.length; i++) {
									bMatches = fnMatchServerRequest(aRequests[i], oParams.url, oParams.entitySet);
									if (bMatches) {
										break;
									}
								}
								Opa5.assert.ok(bMatches, sMsg);
							},
							errorMessage: sMsg
						});
					},
					assignmentRequestSentToServer: function (oParams) {
						let sMsg = "Then.onTheMockServer.AssignmentRequestSentToServer(" + oParams + ")";
						return this.waitFor({
							controlType: "sap.m.Link",
							viewName: sTableViewName,
							bindingPath: {
								path: oParams.path,
								propertyPath: "requestName"
							},
							visible: false,
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sTableViewName,
								id: "tblCapacity"
							},
							success: function (aLinks) {
								let oAssignment = aLinks[0].getBindingContext().getObject();
								let aRequests = mockserver.getRequests();
								let bMatches = false;
								for (let i = 0; i < aRequests.length; i++) {
									bMatches = fnMatchServerRequest(aRequests[i], oParams.url, oParams.entitySet, oAssignment.asgId, oParams.data);
									if (bMatches) {
										break;
									}
								}
								Opa5.assert.ok(bMatches, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
