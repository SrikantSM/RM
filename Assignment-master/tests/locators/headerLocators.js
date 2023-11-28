let sViewName = "capacityGridUi.view.header.Header";

module.exports = {
	getViewSegmentedButton: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idViewButton"
			})
		);
	},
	getViewSegmentedButtonSegment: (sText) => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sViewName,
				properties: {
					text: sText
				}
			})
		);
	},

	getDateRangeSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idDynamicDateRange"
			})
		);
	},

	avgUtilization: element(
		by.control({
			controlType: "sap.m.ObjectStatus",
			viewName: sViewName,
			id: "idAvgUtilizationStatus"
		})
	),

	avgUtilizationLabel: element(
		by.control({
			controlType: "sap.m.Label",
			viewName: sViewName,
			properties: {
				text: "Average Utilization"
			}
		})
	),

	totalResources: element(
		by.control({
			controlType: "sap.m.ObjectNumber",
			viewName: sViewName,
			id: "idTotalResources"
		})
	),

	totalResourcesLabel: element(
		by.control({
			controlType: "sap.m.Label",
			viewName: sViewName,
			properties: {
				text: "Total Number of Resources"
			}
		})
	),

	freeResources: element(
		by.control({
			controlType: "sap.m.ObjectNumber",
			viewName: sViewName,
			id: "idheaderFreeRes"
		})
	),

	freeResourcesLabel: element(
		by.control({
			controlType: "sap.m.Label",
			viewName: sViewName,
			properties: {
				text: "Resources with Free Capacity"
			}
		})
	),

	overbookedResources: element(
		by.control({
			controlType: "sap.m.ObjectNumber",
			viewName: sViewName,
			id: "idheaderOBRes"
		})
	),

	overbookedResourcesLabel: element(
		by.control({
			controlType: "sap.m.Label",
			viewName: sViewName,
			properties: {
				text: "Overbooked Resources"
			}
		})
	)
};
