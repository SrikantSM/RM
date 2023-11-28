module.exports = {
	Header: {
		objectPageHeaderTitle: element(
			by.control({
				controlType: "sap.m.Title",
				ancestor: {
					controlType: "sap.uxap.ObjectPageDynamicHeaderTitle"
				}
			})
		)
	},
	ProjectTitle: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProject::FormElement::DataField::project::name-label"
		})
	),
	ResourceManagerTitle: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest::FormElement::DataField::resourceManager-label"
		})
	),
	ForwardButton: element(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Forward"
			}
		})
	),

	showDetailsButton: element(
		by.control({
			controlType: "sap.m.Button",
			viewId: "staffResourceRequest::ResourceRequestObjectPage",
			properties: {
				icon: "sap-icon://detail-more"
			}
		})
	),


	CloseButton: element(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Close"
			}
		})
	),

	//------------- Assignment create controls

	objectPageSectionMatchingResources: element(
		by.control({
			controlType: "sap.uxap.ObjectPageSubSection",
			properties: {
				title: "Matching Resources"
			}
		})
	),

	matchingResourceTable: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable"
		})
	),

	visibleRowsInMatchingResourceTable: element.all(
		by.control({
			controlType: "sap.m.ColumnListItem",
			viewName: "sap.fe.templates.ObjectPage.ObjectPage",
			ancestor: {
				id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable"
			}
		})
	),

	staffedEfforts: element(
		//in assignment section
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::FieldGroup::SubSectionRequestEffort::FormElement::DataField::staffingStatus::bookedCapacity::Field"
		})
	),

	matchingCandidatesSection: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--fe::ObjectPage-anchBar-staffResourceRequest::ResourceRequestObjectPage--fe::FacetSection::MatchingCandidates-anchor"
		})
	),
	assignStatusSwitch: element(
		by.control({
			controlType: "sap.m.Switch",
			viewId: "staffResourceRequest::ResourceRequestObjectPage",
			bindingPath: {
				propertyPath: "softBooking"
			}
		})
	),
	assignStatusSelectInPopup: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--idAssignmentStatus",
			searchOpenDialogs: true,
			interaction: {
				idSuffix: "arrow"
			}
		})
	),

	setAssignmentStatus: (status) => {
		return element(
			by.control({
				controlType: "sap.ui.core.ListItem",
				viewId: "staffResourceRequest::ResourceRequestObjectPage",
				bindingPath: {
					path: "/AssignmentStatusSet/" + status,
					propertyPath: "assignmentStatus",
					modelName: "AssignModel"
				},
				searchOpenDialogs: true
			})
		);
	},

	//Assign button in table
	tableRowsAssignButton: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "Assign"
				},
				ancestor: {
					controlType: "sap.m.ColumnListItem",
					ancestor: {
						id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable"
					},
					descendant: {
						controlType: "sap.m.Link",
						properties: {
							text: resourceName
						}
					}
				}
			})
		);
	},

	//Assign buttons in Matching Candidate table (Required for SUPA)
	tableRowsAssignButtonsSUPA: element.all(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Assign"
			},
			ancestor: {
				controlType: "sap.m.ColumnListItem",
				ancestor: {
					id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable"
				}
			}
		})
	),

	//Update buttons in Assignments table(Required for SUPA)
	tableRowsUpdateButtonsSUPA: element.all(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				icon: "sap-icon://edit"
			},
			ancestor: {
				controlType: "sap.m.ColumnListItem",
				ancestor: {
					id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
				}
			}
		})
	),

	//UnAssign buttons in Assignments table(Required for SUPA)
	tableRowsUnAssignButtonsSUPA: element.all(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				icon: "sap-icon://decline"
			},
			ancestor: {
				controlType: "sap.m.ColumnListItem",
				ancestor: {
					id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
				}
			}
		})
	),

	//Quick Assign button in table
	tableRowsQuickAssignButton: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "Quick Assign"
				},
				ancestor: {
					controlType: "sap.m.ColumnListItem",
					ancestor: {
						id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable"
					},
					descendant: {
						controlType: "sap.m.Link",
						properties: {
							text: resourceName
						}
					}
				}
			})
		);
	},

	assignStatusText: element(
		by.control({
			controlType: "sap.m.Text",
			viewId: "staffResourceRequest::ResourceRequestObjectPage",
			bindingPath: {
				propertyPath: "assignmentStatus/name"
			}
		})
	),

	remainingHours: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--remainingText",
			searchOpenDialogs: true
		})
	),

	assignStatusLabel: element(
		by.control({
			controlType: "sap.m.Label",
			viewId: "staffResourceRequest::ResourceRequestObjectPage",
			bindingPath: {
				path: "",
				propertyPath: "/assignmentStatus",
				modelName: "AssignModel"
			},
			searchOpenDialogs: true
		})
	),

	//------------- Assign Dialog ----------

	assignDialog: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--dialog"
		})
	),

	assignDateRange: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--dateRange",
			interaction: "focus"
		})
	),

	assignNumOfHoursInput: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--hoursInput",
			searchOpenDialogs: true,
			interaction: {
				idSuffix: "inner"
			}
		})
	),

	assignDialogOkButton: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--assignButton",
			searchOpenDialogs: true
		})
	),

	assignDialogCancelButton: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--AssignDialog--cancelButton"
		})
	),

	//------------- Assignment Edit action controls ----------

	tableRowsUpdateButton: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					icon: "sap-icon://edit"
				},
				ancestor: {
					controlType: "sap.m.ColumnListItem",
					ancestor: {
						id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
					}
				}
			})
		);
	},

	//-----------------Assignment Delete action controls

	objectPageSectionAssignments: element(
		by.control({
			controlType: "sap.uxap.ObjectPageSubSection",
			properties: {
				title: "Assignments"
			}
		})
	),

	assignmentsSection: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestObjectPage--fe::ObjectPage-anchBar-staffResourceRequest::ResourceRequestObjectPage--fe::FacetSection::AssignResource-anchor"
		})
	),

	assignSwitchStatus: element(
		by.control({
			controlType: "sap.m.Select",
			ancestor: {
				controlType: "sap.m.ColumnListItem",
				ancestor: {
					id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
				}
			}
		})
	),

	visibleRowsInAssignedResourcesTable: element.all(
		by.control({
			controlType: "sap.m.ColumnListItem",
			viewName: "sap.fe.templates.ObjectPage.ObjectPage",
			ancestor: {
				id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
			}
		})
	),

	tableRowsDeleteButton: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					icon: "sap-icon://decline"
				},
				ancestor: {
					controlType: "sap.m.ColumnListItem",
					ancestor: {
						id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
					}
				}
			})
		);
	},

	getSpecificAssignedResourcesRow: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.ColumnListItem",
				ancestor: {
					controlType: "sap.m.Table",
					id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem-innerTable"
				},
				descendant: {
					controlType: "sap.ui.mdc.Field",
					properties: {
						value: resourceName
					}
				}
			})
		);
	},

	AssignedResources: {
		AssignedResourcesTableColumnFirstRowName: element.all(
			by.control({
				controlType: "sap.ui.mdc.Field",
				id: /^staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem::C::ResourceDetails::fullName-/
			})
		)
	},

	dialogBar: element(
		by.control({
			controlType: "sap.m.Bar",
			searchOpenDialogs: true
		})
	),

	dialogOkButton: element(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "OK"
			},
			searchOpenDialogs: true
		})
	),

	dialogCancelButton: element(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Cancel"
			},
			searchOpenDialogs: true
		})
	),

	//------------S4 Test controls -------//

	errorDialog: element(
		by.control({
			controlType: "sap.m.Text",
			properties: {
				text: "Error"
			},
			searchOpenDialogs: true
		})
	),

	errorDialogItem: element(
		by.control({
			controlType: "sap.m.MessageListItem",
			properties: {
				type: "Navigation"
			},
			searchOpenDialogs: true,
			interaction: {
				idSuffix: "content"
			}
		})
	),

	errorDialogMsg: (sMsg) => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				properties: {
					text: sMsg
				},
				searchOpenDialogs: true
			})
		);
	},

	closeErrorDialogButton: element(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Close"
			},
			searchOpenDialogs: true,
			interaction: {
				idSuffix: "BDI-content"
			}
		})
	)
};
