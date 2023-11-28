const columnIds = {
	NAME: "idNameLabel",
	RESOURCE_ORG: "idResourceOrg",
	STAFFING_SUMMARY: "idStaffingSummary",
	STAFFING_HRS: "idStaffingHrs",
	ASSIGNMENT_STATUS: "idAssignmentStatus",
	COST_CENTER: "idCostCenterLabel",
	WORKER_TYPE: "idWorkerType"
};

const assignmentStatus = {
	SOFT_BOOKED: 1,
	HARD_BOOKED: 0,
	SOFT_BOOKED_STRING: "1",
	HARD_BOOKED_STRING: "0",
	HARD_BOOKED_TEXT: "HARD_BOOKED",
	SOFT_BOOKED_TEXT: "SOFT_BOOKED"
};

const sourceString = "../capacityGridUi/odata/v4/profilePhoto/profileThumbnail(";

module.exports = {
	columnIds,
	assignmentStatus,
	sourceString
};
