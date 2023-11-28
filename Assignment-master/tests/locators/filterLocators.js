let sViewName = "capacityGridUi.view.filter.FilterBar";

module.exports = {
	getNameFilterControl: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idResourceNameFilter"
			})
		);
	},
	getResourceFilterPanel: element(
		by.control({
			id: "idResourceFilterPanel-expandButton",
			viewName: sViewName
		})
	),
	getUtilizationFilterPanel: element(
		by.control({
			id: "idUtilizationFilterPanel-expandButton",
			viewName: sViewName
		})
	),
	getRequestFilterPanel: element(
		by.control({
			id: "idRequestFilterPanel-expandButton",
			viewName: sViewName
		})
	),
	theResourceFilterPanel: element(
		by.control({
			id: "idResourceFilterPanel",
			viewName: sViewName
		})
	),
	theUtilizationFilterPanel: element(
		by.control({
			id: "idUtilizationFilterPanel",
			viewName: sViewName
		})
	),
	theRequestFilterPanel: element(
		by.control({
			id: "idRequestFilterPanel",
			viewName: sViewName
		})
	),
	getNameFilterInnerControl: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idResourceNameFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},

	getOrgSelector: () => {
		return element(
			by.control({
				controlType: "sap.m.MultiComboBox",
				viewName: sViewName,
				id: "idResourceOrg"
			})
		);
	},
	getCostCenterSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idResourceCostCenterFilter"
			})
		);
	},
	getCostCenterInnerSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idResourceCostCenterFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getProjectInnerSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idProjectFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getCustomerInnerSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idCustomerFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getProjectRoleSelector: () => {
		return element(
			by.control({
				controlType: "sap.m.MultiComboBox",
				viewName: sViewName,
				id: "idProjectRoleFilter"
			})
		);
	},
	getRequestInnerSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idRequestFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getReferenceObjectInnerSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idReferenceObjectFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getReferenceObjectTypeSelector: () => {
		return element(
			by.control({
				controlType: "sap.m.MultiComboBox",
				viewName: sViewName,
				id: "idReferenceObjectTypeFilter"
			})
		);
	},
	getWorkerTypeInnerSelector: () => {
		return element(
			by.control({
				viewName: sViewName,
				id: "idWorkerTypeFilter",
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getActiveSuggestionSelector: () => {
		return element(
			by.control({
				controlType: "sap.m.ColumnListItem",
				viewName: sViewName,
				properties: {
					type: "Active"
				},
				searchOpenDialogs: true
			})
		);
	},
	getMinFreeHourSelector: () => {
		return element(
			by.control({
				controlType: "sap.m.Input",
				viewName: sViewName,
				id: "idMinFreeHours"
			})
		);
	},
	getGoButtonVerticalFilter: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sViewName,
				properties: {
					text: "Go"
				}
			})
		);
	},
	getFilterCloseButton: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sViewName,
				i18NText: {
					propertyName: "tooltip",
					key: "CLOSE"
				}
			})
		);
	},
	getResetButtonVerticalFilter: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sViewName,
				i18NText: {
					propertyName: "text",
					key: "RESET"
				}
			})
		);
	},

	getUtilizationFilterCheckBox: (iIndex) => {
		return element(
			by.control({
				controlType: "sap.m.CheckBox",
				viewName: sViewName,
				properties: {
					editable: true
				},
				ancestor: {
					controlType: "sap.m.CustomListItem",
					viewName: sViewName,
					bindingPath: {
						modelName: "filter",
						path: "/UtilizationFilterRanges/" + iIndex
					},
					ancestor: {
						id: "UtilizationRangeFilterList",
						viewName: sViewName
					}
				},
				interaction: {
					idSuffix: "CbBg"
				}
			})
		);
	}
};