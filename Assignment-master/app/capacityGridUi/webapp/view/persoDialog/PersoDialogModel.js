sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	return JSONModel.extend("capacityGridUi.view.persoDialog.PersoDialogModel", {
		constructor: function (oBundle) {
			let oData = {
				// Static data
				Items: [
					{
						columnKey: "costCenter",
						text: oBundle.getText("COST_CENTER")
					},
					{
						columnKey: "workerType",
						text: oBundle.getText("WORKER_TYPE")
					},
					{
						columnKey: "resourceOrg",
						text: oBundle.getText("RESOURCE_ORGANIZATION")
					},
					{
						columnKey: "staffingHrs",
						text: oBundle.getText("STAFFING_HRS")
					},
					{
						columnKey: "staffingSummary",
						text: oBundle.getText("STAFFING_SUMMARY")
					},
					{
						columnKey: "assignmentStatus",
						text: oBundle.getText("ASSIGNMENT_STATUS")
					},
					{
						columnKey: "project",
						text: oBundle.getText("PROJECT")
					},
					{
						columnKey: "customer",
						text: oBundle.getText("CUSTOMER")
					},
					{
						columnKey: "projectRole",
						text: oBundle.getText("PROJECT_ROLE")
					},
					{
						columnKey: "request",
						text: oBundle.getText("REQUEST")
					},
					{
						columnKey: "requestStatus",
						text: oBundle.getText("REQUEST_STATUS")
					},
					{
						columnKey: "workItemName",
						text: oBundle.getText("WORK_ITEM")
					},
					{
						columnKey: "referenceObject",
						text: oBundle.getText("REFERENCE_OBJECT")
					},
					{
						columnKey: "referenceObjectType",
						text: oBundle.getText("REFERENCE_OBJECT_TYPE")
					}
				],
				// Runtime data (set by controller)
				ColumnsItems: []
			};
			JSONModel.call(this, oData);
		}
	});
});