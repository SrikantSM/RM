sap.ui.define([], function () {
	"use strict";

	return {
		version: 2,
		view: "Monthly",
		sortOrder: "Ascending",
		sortProperty: "resourceName",
		timePeriod: {
			selectedKey: "6Months",
			fromDate: null,
			toDate: null
		},
		filters: {
			names: [],
			deliveryOrgs: [],
			costCenters: [],
			utilizations: [],
			minFreeHours: ""
		},
		nameColumnWidth: "250px",
		columns: [
			{
				columnKey: "deliveryOrg",
				visible: true,
				index: 0,
				width: "150px" // THIS IS NOT default but we put the same as in the standard variant. migration does not change the users settings for this
			},
			{
				columnKey: "costCenter",
				visible: false,
				index: 1,
				width: "150px"
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
			}
		]
	};
});
