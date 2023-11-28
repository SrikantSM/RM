sap.ui.define([], function () {
	"use strict";

	return {
		RESOURCES_ENTITY_SET: "capacityGridHeaderTemporal",
		RESOURCE_DETAILS_ENTITY_SET: "ResourceDetails",
		ASSIGNMENT_ENTITY_SET: "AssignmentsDetailsForCapacityGrid",
		REQUEST_ENTITY_SET: "RequestDetailsForEachAssignment",
		COST_CENTER_ENTITY_SET: "ResourceOrganizationCostCenters",
		KPI_ENTITY_SET: "capacityGridHeaderKPITemporal",
		RESOURCE_ORG_ENTITY_SET: "ResourceOrganizations",
		PROJECT_VH_ENTITY_SET: "ProjectsVH",
		PROJECT_ROLE_VH_ENTITY_SET: "ProjectRoles",
		CUSTOMER_VH_ENTITY_SET: "CustomerVH",
		REQUEST_VH_ENTITY_SET: "RequestsVH",
		REFERENCE_OBJECT_SET: "ReferenceObject",
		ASSIGNMENT_BUCKETS_MONTHLY_ENTITY_SET: "AssignmentBucketsYearMonthAggregate",
		ASSIGNMENT_BUCKETS_WEEKLY_ENTITY_SET: "AssignmentBucketsYearWeekAggregate",
		ASSIGNMENT_BUCKETS_DAILY_ENTITY_SET: "AssignmentBucketsPerDay",

		utilizationEntitySet: function (sView) {
			switch (sView) {
				case "Monthly":
					return "capacityGridMonthlyUtilizationTemporal";
				case "Weekly":
					return "capacityGridWeeklyUtilizationTemporal";
				case "Daily":
					return "capacityGridDailyUtilizationTemporal";
				default:
					throw new Error("unhandled view " + sView);
			}
		},

		bucketNavProperty: function (sView) {
			switch (sView) {
				case "Monthly":
					return "monthlyAggregatedAssignments";
				case "Weekly":
					return "weeklyAggregatedAssignments";
				case "Daily":
					return "dailyAssignments";
				default:
					throw new Error("unhandled view " + sView);
			}
		}
	};
});
