sap.ui.define(["capacityGridUi/reuse/DateUtils", "capacityGridUi/view/Views", "sap/base/util/deepClone"], function (Utils, Views, deepClone) {
	"use strict";
	return {
		// Converts odata in json format to json data format expected by UI
		transformAssignment: function (oTimeColumnsMap, oContext, oi18nModel, sView, oDraftAsg) {
			let oAssignment = oContext.getObject();
			let oNewAssignment = {};
			this._transformProperties(oAssignment, oi18nModel, oNewAssignment, oDraftAsg);
			this._transformUISpecifics(oContext, oNewAssignment, oi18nModel);
			oNewAssignment.utilization = this._transformUtilizations(oTimeColumnsMap, oAssignment, sView);
			return oNewAssignment;
		},

		_transformProperties: function (oAssignment, oi18nModel, oNewAssignment, oDraftAsg) {
			let staffedHours = oDraftAsg ? oDraftAsg.staffedHours : oAssignment.requestedCapacityInHours - oAssignment.remainingRequestedCapacityInHours;
			let sStaffedHoursText = oi18nModel.getText("STAFFED_HOURS", [staffedHours, oAssignment.requestedCapacityInHours]);
			oNewAssignment.staffedHours = staffedHours;
			oNewAssignment.staffedHoursText = sStaffedHoursText;
			oNewAssignment.requestStatusDescription = oAssignment.requestStatusDescription;
			oNewAssignment.workItemName = oAssignment.workItemName;
			oNewAssignment.RemainingEffort = oDraftAsg ? oDraftAsg.RemainingEffort : oAssignment.remainingRequestedCapacityInHours;
			oNewAssignment.requestedCapacityInHours = oAssignment.requestedCapacityInHours;
			oNewAssignment.assignmentStatusCode = "" + oAssignment.assignmentStatusCode;
			oNewAssignment.copyAssignmentStatusCode = "" + oAssignment.assignmentStatusCode;
			oNewAssignment.assignmentStatusText = oAssignment.assignmentStatusText;
			oNewAssignment.assignmentDurationInHours = oAssignment.assignmentDurationInHours;
			oNewAssignment.asgId = oAssignment.assignment_ID;
			oNewAssignment.resourceRequest_ID = oAssignment.resourceRequest_ID;
			oNewAssignment.RequiredEffort = oAssignment.requestedCapacityInHours;
			oNewAssignment.isAssignmentEditable = oAssignment.isAssignmentEditable;
			oNewAssignment.projectId = oAssignment.projectId;
			oNewAssignment.projectName = oAssignment.projectName;
			oNewAssignment.customerId = oAssignment.customerId;
			oNewAssignment.customerName = oAssignment.customerName;
			oNewAssignment.projectRoleName = oAssignment.projectRoleName;
			oNewAssignment.referenceObjectId = oAssignment.referenceObjectId;
			oNewAssignment.referenceObjectName = oAssignment.referenceObjectName;
			oNewAssignment.referenceObjectTypeName = oAssignment.referenceObjectTypeName;
			oNewAssignment.requestName = oAssignment.requestName;
			oNewAssignment.requestDisplayId = oAssignment.requestDisplayId;
			oNewAssignment.resource_ID = oAssignment.resource_ID;
		},

		_transformUISpecifics: function (oAsgContext, oNewAssignment, oi18nModel) {
			oNewAssignment.parent = false;
			oNewAssignment.child = true;
			oNewAssignment.changeState = oAsgContext ? "unChanged" : "empty";
			oNewAssignment.error = false;
			oNewAssignment.warning = false;
			oNewAssignment.changed = oNewAssignment.changeState === "empty";
			oNewAssignment.draftExists = false;
			oNewAssignment.draftTime = null;
			oNewAssignment.assignmentValueState = "None";
			oNewAssignment.assignmentStatusValueStateText = oAsgContext ? "" : oi18nModel.getText("EDITED_CELL_INFO_MSG");
			oNewAssignment.assignmentStatusValueState = oAsgContext ? "None" : "Information";
			oNewAssignment.requestValueState = oAsgContext ? "None" : "Information";
			oNewAssignment.requestValueStateText = oAsgContext ? "" : oi18nModel.getText("EDITED_CELL_INFO_MSG");
			oNewAssignment.oldResourceRequest_ID = null;
			oNewAssignment.oldRequestDisplayId = null;
			oNewAssignment.oldRequestName = null;
			oNewAssignment.copyState = "None";
			oNewAssignment.oContext = oAsgContext;
		},

		_transformUtilizations: function (oTimeColumnsMap, oAssignment, sView) {
			let aTransformedUtils = [];

			let aUtils = this._getAssignmentUtilizations(oAssignment, sView);

			let oUiOnlyTimeColumnsMap = new Map(oTimeColumnsMap);
			aUtils.forEach((oUtil) => {
				let sUtilKey = oTimeColumnsMap.getKeyByTimePeriod(oUtil.timePeriod, sView);
				oUiOnlyTimeColumnsMap.delete(sUtilKey);
				let oTransformedUtil = this._transformUtilization(oAssignment, sUtilKey, oUtil);
				aTransformedUtils.push(oTransformedUtil);
			});

			// Keep blank for columns that are only shown in the UI
			if (aUtils.length !== oTimeColumnsMap.size) {
				oUiOnlyTimeColumnsMap.forEach((oUtil, sUtilKey) => {
					let oTransformedUtil = this._transformUtilization(oAssignment, sUtilKey, null);
					aTransformedUtils.push(oTransformedUtil);
				});
			}

			// Sort array in yearmonth order
			aTransformedUtils.sort((a, b) => {
				return a.key - b.key;
			});

			return aTransformedUtils;
		},

		_getAssignmentUtilizations: function (oAssignment, sView) {
			switch (sView) {
				case Views.DAILY:
					return oAssignment.dailyAssignments;
				case Views.WEEKLY:
					return oAssignment.weeklyAggregatedAssignments;
				case Views.MONTHLY:
					return oAssignment.monthlyAggregatedAssignments;
				default:
					throw Error("unhandled view: " + sView);
			}
		},

		_transformUtilization: function (oAssignment, sUtilKey, oUtil) {
			return {
				// backend
				asgId: oAssignment.assignment_ID ? oAssignment.assignment_ID : oAssignment.asgId,
				isAssignmentEditable: oAssignment.isAssignmentEditable,
				bookedCapacity: oUtil ? oUtil.bookedCapacityInHours.toString() : null,
				copyBookedCapacity: oUtil ? oUtil.bookedCapacityInHours.toString() : null,
				oldBookedCapacity: oUtil ? oUtil.bookedCapacityInHours.toString() : null,
				timePeriod: oUtil ? oUtil.timePeriod : null,
				startDate: oUtil ? oUtil.startDate : null,
				endDate: oUtil ? oUtil.endDate : null,
				action: null,
				// ui specifics
				key: parseInt(sUtilKey, 10),
				parent: false,
				child: true,
				empty: !oUtil,
				utilizationValueState: "None",
				utilizationValueStateText: ""
			};
		},

		transformOnCreateAssignment: function (oTimeColumnMap, oi18nModel) {
			let oNewAssignment = {
				asgId: new Date().getTime().toString(),
				isAssignmentEditable: false
			};
			let oAsgContext = null;
			this._transformUISpecifics(oAsgContext, oNewAssignment, oi18nModel);
			let aTransformedUtils = [];
			oTimeColumnMap.forEach((oUtil, sUtilKey) => {
				let oTransformedUtil = this._transformUtilization(oNewAssignment, sUtilKey, null);
				aTransformedUtils.push(oTransformedUtil);
			});
			oNewAssignment.utilization = aTransformedUtils;
			return oNewAssignment;
		},

		transformOnPasteAssignment: function (oAssignment) {
			let oNewAssignment = deepClone(oAssignment);
			oNewAssignment.asgId = this._createAssignmentGUID();
			oNewAssignment.copyState = "None";

			return oNewAssignment;
		},

		// some random function to generate local empty assignment GUID
		_createAssignmentGUID: function () {
			let iTime = new Date().getTime();
			let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				let r = (iTime + Math.random() * 16) % 16 | 0;
				iTime = Math.floor(iTime / 16);
				return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
			});
			return uuid;
		}
	};
});