sap.ui.define([], function () {
	"use strict";

	return {
		version: 1,
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
				width: "150px"
			},
			{
				columnKey: "costCenter",
				visible: true,
				index: 1,
				width: "150px"
			},
			{
				columnKey: "averageUtil",
				visible: true,
				index: 2,
				width: "110px"
			},
			{
				columnKey: "utilization",
				visible: true,
				index: 3,
				width: "125px"
			}
		],
		executeOnSelection: false
	};
});
