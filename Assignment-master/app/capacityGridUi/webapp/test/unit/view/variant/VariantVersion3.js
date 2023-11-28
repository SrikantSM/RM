sap.ui.define([], function () {
	"use strict";

	/**
	 * Do you want to change the data structure of the variant?
	 * Be aware that on customer end the already saved variants will stay unchanged exist!
	 *
	 * To manage differences you should:
	 *  - increase the version in this file
	 *  - handle version differences in Variant.controller._migrateVariant
	 *
	 * Changing values should not require the above steps.
	 */
	return {
		version: 3,
		view: "Monthly",
		sortOrder: "Ascending",
		sortProperty: "resourceName",
		timePeriod: {
			selectedKey: "6Months",
			fromDate: null, // date is stored as ISO string
			toDate: null // date is stored as ISO string
		},
		filters: {
			names: [],
			resourceOrgs: [],
			costCenters: [],
			utilizations: [],
			projects: [],
			customers: [],
			projectRoles: [],
			requests: [],
			minFreeHours: ""
		},
		nameColumnWidth: "250px",
		columns: [
			{
				columnKey: "resourceOrg",
				visible: true,
				index: 0,
				width: "150px"
			},
			{
				columnKey: "costCenter",
				visible: false,
				index: 1,
				width: "150px" // to accommodate 20 chars of Attribute name and 10 chars of CC ID. This is the max length set by entity definition.
			},
			{
				columnKey: "staffingSummary",
				visible: true,
				index: 2,
				width: "120px"
			},
			{
				columnKey: "staffingHrs",
				visible: true,
				index: 3,
				width: "125px"
			},
			{
				columnKey: "assignmentStatus",
				visible: true,
				index: 4,
				width: "170px"
			},
			{
				columnKey: "project",
				visible: false,
				index: 5,
				width: "150px"
			},
			{
				columnKey: "customer",
				visible: false,
				index: 6,
				width: "150px"
			},
			{
				columnKey: "projectRole",
				visible: false,
				index: 7,
				width: "150px"
			},
			{
				columnKey: "request",
				visible: false,
				index: 8,
				width: "150px"
			}
		]
	};
});