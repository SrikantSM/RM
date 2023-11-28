let sTableViewName = "capacityGridUi.view.table.Table";
let sTableViewId = "application-capacity-Display-component---idPage--idTable";

module.exports = {
	workPackageName: (workPackageName) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				viewName: sTableViewName,
				properties: {
					text: workPackageName
				}
			})
		);
	},

	assignmentRow: (sRow) => {
		return element(
			by.control({
				id: "tblCapacity",
				viewName: sTableViewName,
				interaction: {
					idSuffix: sRow
				}
			})
		);
	},

	visibleRowsInResourceTable: element.all(
		by.control({
			controlType: "sap.ui.table.Row",
			ancestor: {
				id: "capacityGridUi::CapacityOverviewPage--fe::table::capacityList::LineItem-innerTable"
			}
		})
	),

	capacityGridTable: element(
		by.control({
			controlType: "sap.ui.table.TreeTable",
			viewName: sTableViewName,
			id: "tblCapacity"
		})
	),

	resourceName: (resName) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				viewName: sTableViewName,
				properties: {
					text: resName
				}
			})
		);
	},

	editableInputBox: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Input",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "bookedCapacity"
				},
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},

	resourceColumnHeader: (sText) => {
		return element(
			by.control({
				controlType: "sap.m.Label",
				viewName: sTableViewName,
				properties: {
					text: sText
				}
			})
		);
	},

	getSpecificResourceRow: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.ui.table.Row",
				ancestor: {
					controlType: "sap.ui.table.TreeTable",
					viewName: sTableViewName,
					id: "tblCapacity"
				},
				descendant: {
					controlType: "sap.m.Link",
					properties: {
						text: resourceName
					}
				}
			})
		);
	},

	getFirstColumn: () => {
		return element(
			by.control({
				controlType: "sap.ui.table.Column",
				id: sTableViewId + "--idNameLabel"
			})
		);
	},

	getEditableUtilizationCell: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Input",
				viewName: sTableViewName,
				bindingPath: {
					path: sPath,
					propertyPath: "bookedCapacity",
					model: "JSONModel"
				}
			})
		);
	},

	getRequestInputCell: (sPath) => {
		return element(
			by.control({
				controlType: "capacityGridUi.reuse.valuehelp.InputWithValueHelp",
				viewName: sTableViewName,
				bindingPath: {
					path: sPath,
					propertyPath: "requestName"
				},
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},

	getRequestInputCellForSUPA: (sPath) => {
		return element(
			by.control({
				controlType: "capacityGridUi.reuse.valuehelp.InputWithValueHelp",
				viewId: "application-capacity-Display-component---idPage--idTable",
				bindingPath: {
					path: sPath,
					propertyPath: "child"
				},
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
				viewName: sTableViewName,
				properties: {
					type: "Active"
				},
				searchOpenDialogs: true
			})
		);
	},

	getActiveSuggestionSelectorForSUPA: () => {
		return element(
			by.control({
				controlType: "sap.m.ColumnListItem",
				viewId: "application-capacity-Display-component---idPage--idTable",
				properties: {
					type: "Active"
				},
				searchOpenDialogs: true
			})
		);
	},

	getUtilizationCell: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.ObjectStatus",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "utilization"
				}
			})
		);
	},
	getDiscardButton: () => {
		return element(
			by.control({
				id: "idBtnRevert",
				viewId: sTableViewId
			})
		);
	},
	getAddButton: () => {
		return element(
			by.control({
				id: "idBtnAddAssignment",
				viewId: sTableViewId
			})
		);
	},
	getDeleteButton: () => {
		return element(
			by.control({
				id: "idBtnDeleteAssignment",
				viewId: sTableViewId
			})
		);
	},
	getEditContextMenuItem: function () {
		return element(
			by.control({
				controlType: "sap.ui.unified.MenuItem",
				viewId: sTableViewId,
				id: "idEditMenuItem-unifiedmenu"
			})
		);
	},
	getFocusedEditContextMenuItem: function () {
		return element(
			by.control({
				controlType: "sap.ui.unified.MenuItem",
				viewId: sTableViewId,
				id: "idFocusedEditMenuItem-unifiedmenu"
			})
		);
	},
	getViewDetailsContextMenuItem: function () {
		return element(
			by.control({
				controlType: "sap.ui.unified.MenuItem",
				viewId: sTableViewId,
				id: "idViewDetailsMenuItem-unifiedmenu"
			})
		);
	},
	getDiscardConfirmationOKButton: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "OK"
				},
				ancestor: {
					controlType: "sap.m.Dialog",
					searchOpenDialogs: true
				}
			})
		);
	},
	getSpecificColumn: (sId) => {
		return element(
			by.control({
				id: sId
			})
		);
	},

	getCostCenterColumn: () => {
		return element(
			by.control({
				controlType: "sap.ui.table.Column",
				descendant: {
					controlType: "sap.m.Label",
					viewName: sTableViewName,
					properties: {
						text: "Cost Center"
					}
				}
			})
		);
	},
	getworkItemName: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "workItemName"
				}
			})
		);
	},
	getCostCenterColumnSUPA: () => {
		return element(
			by.control({
				id: sTableViewId + "--idCostCenterLabel"
			})
		);
	},

	getTitle: () => {
		return element(
			by.control({
				viewName: sTableViewName,
				id: "idGridTitle"
			})
		);
	},

	getUtilizationColumn: () => {
		return element(
			by.control({
				controlType: "sap.ui.table.Column",
				descendant: {
					controlType: "sap.m.Label",
					viewName: sTableViewName,
					properties: {
						text: "Utilization / Assigned Hours"
					}
				}
			})
		);
	},

	getAvgUtilizationStatus: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.ObjectStatus",
				viewName: sTableViewName,
				bindingPath: {
					path: sPath,
					propertyPath: "avgUtilization"
				}
			})
		);
	},

	getAllResources: () => {
		return element.all(
			by.control({
				controlType: "sap.m.Link",
				ancestor: {
					controlType: "sap.ui.table.TreeTable",
					viewName: sTableViewName,
					id: "tblCapacity"
				}
			})
		);
	},

	getAllColumns: () => {
		return element.all(
			by.control({
				controlType: "sap.ui.table.Column",
				ancestor: {
					controlType: "sap.ui.table.TreeTable",
					viewName: sTableViewName,
					id: "tblCapacity"
				}
			})
		);
	},

	getResourceNameColumnMenu: () => {
		return element(
			by.control({
				controlType: "sap.ui.table.ColumnMenu",
				viewName: sTableViewName
			})
		);
	},

	getResourceNameColumnMenuSUPA: () => {
		return element(
			by.control({
				controlType: "sap.ui.table.Column",
				descendant: {
					controlType: "sap.m.Label",
					viewName: sTableViewName,
					properties: {
						text: "Name"
					}
				}
			})
		);
	},

	getSortAscColumnMenuItem: () => {
		return element(
			by.control({
				controlType: "sap.ui.unified.MenuItem",
				viewName: sTableViewName,
				properties: {
					text: "Sort Ascending"
				}
			})
		);
	},

	getSortDescendingColumnMenuItem: () => {
		return element(
			by.control({
				controlType: "sap.ui.unified.MenuItem",
				viewName: sTableViewName,
				properties: {
					text: "Sort Descending"
				}
			})
		);
	},

	getGlobalFilterControl: () => {
		return element(
			by.control({
				viewName: sTableViewName,
				id: "idFilterToggleButton"
			})
		);
	},

	getFilterColumnMenuItemSUPA: () => {
		return element(
			by.control({
				id: "idCostCenterLabel-menu-filter",
				searchOpenDialogs: true
			})
		);
	},

	allCellsInRow: (resourceName, cellControlType) => {
		return element.all(
			by.control({
				controlType: cellControlType,
				ancestor: {
					controlType: "sap.ui.table.Row",
					ancestor: {
						id: "capacityGridUi::CapacityOverviewPage--fe::table::capacityList::LineItem-innerTable"
					},
					descendant: {
						controlType: "sap.ui.mdc.Field",
						properties: {
							value: resourceName
						}
					}
				}
			})
		);
	},

	getNumOfVisibleColumns: () => {
		return element.all(
			by.control({
				controlType: "sap.ui.table.Column",
				ancestor: {
					controlType: "sap.ui.table.TreeTable",
					viewName: sTableViewName,
					id: "tblCapacity"
				}
			})
		);
	},

	getEditAssignmentButton: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sTableViewName,
				id: "idBtnEdit",
				properties: {
					text: "Edit"
				}
			})
		);
	},

	getFocusedEditToolbar: (iCount) => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sTableViewName,
				id: "idBtnEdit",
				properties: {
					text: "Edit (" + iCount + ")"
				}
			})
		);
	},

	getEditAssignmentButtonForSUPA: () => {
		return element(
			by.control({
				id: "application-capacity-Display-component---idPage--idTable--idBtnEdit",
				interaction: {
					idSuffix: "BDI-content"
				}
			})
		);
	},

	contactLink: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				viewName: sTableViewName,
				properties: {
					text: resourceName
				}
			})
		);
	},

	expandArrowOfFirstResource: () => {
		return element(
			by.control({
				id: "tblCapacity",
				viewName: sTableViewName,
				interaction: {
					idSuffix: "rows-row0-treeicon"
				}
			})
		);
	},

	expandArrowOfSecondResource: () => {
		return element(
			by.control({
				id: "tblCapacity",
				viewName: sTableViewName,
				interaction: {
					idSuffix: "rows-row1-treeicon"
				}
			})
		);
	},

	getSettingsBtn: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewName: sTableViewName,
				properties: {
					icon: "sap-icon://action-settings"
				}
			})
		);
	},

	getInfoToolbarText: () => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				ancestor: {
					controlType: "sap.m.OverflowToolbar",
					viewName: sTableViewName,
					properties: {
						design: "Info"
					}
				}
			})
		);
	},

	selectAssignmentStatusCode: function (sPath, sKey) {
		return element(
			by.control({
				controlType: "sap.m.Select",
				viewName: sTableViewName,
				bindingPath: {
					path: sPath,
					propertyPath: "assignmentStatusCode",
					key: sKey
				},
				interaction: {
					idSuffix: "arrow"
				}
			})
		);
	},

	getSelectedAssignmentStatusText: function (sKeyText) {
		return element(
			by.control({
				controlType: "sap.ui.core.Item",
				viewId: sTableViewName,
				i18NText: {
					propertyName: "text",
					key: sKeyText
				},
				searchOpenDialogs: true
			})
		);
	},

	getAssignmentStatusSelect: function (sPath) {
		return element(
			by.control({
				controlType: "sap.m.Select",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "assignmentStatusCode"
				}
			})
		);
	},

	getStaffedHours: function (sPath) {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewName: sTableViewName,
				bindingPath: {
					path: sPath,
					propertyPath: "assignmentDurationInHours"
				}
			})
		);
	},

	getCostCenter: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "costCenter"
				}
			})
		);
	},

	getCustomer: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "customerName"
				}
			})
		);
	},

	getProject: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "projectName"
				}
			})
		);
	},

	getProjectRole: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "projectRoleName"
				}
			})
		);
	},

	getRequest: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "requestName"
				}
			})
		);
	},

	getReferenceObject: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "referenceObjectName"
				}
			})
		);
	},

	getReferenceObjectType: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "referenceObjectTypeName"
				}
			})
		);
	},

	getRequestStatus: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "requestStatusDescription"
				}
			})
		);
	},
	getWorkerType: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "workerType"
				}
			})
		);
	},
	filterDropDown: () => {
		return element(
			by.control({
				id: "idEditStatus",
				viewId: sTableViewId,
				interaction: {
					idSuffix: "arrow"
				}
			})
		);
	},
	filteredResource: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "parent"
				}
			})
		);
	},
	filteredNewlyAddedAssignment: (sPath) => {
		return element(
			by.control({
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "child"
				},
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	filteredAssignment: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				viewId: sTableViewId,
				bindingPath: {
					path: sPath,
					propertyPath: "requestName"
				}
			})
		);
	},
	ChangedDropDownOption: () => {
		return element(
			by.control({
				controlType: "sap.ui.core.ListItem",
				viewId: sTableViewId,
				i18NText: {
					propertyName: "text",
					key: "CHANGED"
				},
				searchOpenDialogs: true
			})
		);
	},
	getProfilePhoto: (sPath) => {
		return element(
			by.control({
				controlType: "sap.m.Avatar",
				viewId: "application-capacity-Display-component---idPage--idTable",
				bindingPath: {
					path: sPath,
					propertyPath: "parent"
				}
			})
		);
	},
	getDeselectButton: () => {
		return element(
			by.control({
				controlType: "sap.ui.table.TreeTable",
				viewName: sTableViewName,
				id: "tblCapacity",
				interaction: {
					idSuffix: "selall"
				}
			})
		);
	}
};
