sap.ui.define([], function () {
	"use strict";
	return {
		VIEW_DAILY: "Day",
		VIEW_WEEKLY: "Week",
		VIEW_MONTHLY: "Month",

		STATIC_COLUMN_COUNT: 5,

		HARD_BOOKED_TEXT: "Hard-Booked",
		SOFT_BOOKED_TEXT: "Soft-Booked",

		FAIL_REQ_ERROR_MESSAGE: "test error 500 from mockserver",

		columnIds: {
			NAME: "idNameLabel",
			RESOURCE_ORG: "idResourceOrg",
			STAFFING_SUMMARY: "idStaffingSummary",
			STAFFING_HRS: "idStaffingHrs",
			ASSIGNMENT_STATUS: "idAssignmentStatus",
			COST_CENTER: "idCostCenterLabel",
			CUSTOMER: "idCustomer",
			PROJECT: "idProject",
			PROJECT_ROLE: "idProjectRole",
			REQUEST: "idRequest",
			WORKER_TYPE: "idWorkerType",
			REQUEST_STATUS: "idRequestStatus",
			WORK_ITEM: "idworkItemName",
			REFERENCE_OBJECT: "idReferenceObject",
			REFERENCE_OBJECT_TYPE: "idReferenceObjectType"
		}
	};
});
