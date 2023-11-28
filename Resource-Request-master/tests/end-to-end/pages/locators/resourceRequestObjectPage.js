const Edit = {
    Header: {
        objectPageHeader: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::ObjectPage-OPHeaderContent'
            })
        )
    },
    AnchorBar: {
        ProjectInformationAnchorButton: element(by.control({
            controlType: "sap.m.Button",
            properties: {
                text: "Project Information"
            }
        })),
        ResourceRequestDetailsAnchorButton:element(by.control({
            controlType: "sap.m.Button",
            properties: {
                text: "Resource Request Details"
            }
        })),
        SkillRequirementsAnchorButton:element(by.control({
            controlType: "sap.m.Button",
            properties: {
                text: "Required Skills"
            }
        })),
        AssignmentsAnchorButton:element(by.control({
            controlType: "sap.m.Button",
            properties: {
                text: "Assignments"
            }
        }))
    },
    ProjectInformation: {
        demandIcon: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FormElement::DataField::demand_ID::Field-edit-inner-vhi'
            })
        ),
        demandFilterExpand: element(
            by.control({
                controlType: 'sap.m.Button',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                properties: {
                    text: 'Show Filters'
                }
            })
        ),
        demandInput: element(
            by.control({
                controlType: "sap.ui.mdc.Field",
                bindingPath: {
                    propertyPath: 'demand_ID'
                }
            })
        ),
        billingRoleMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FieldValueHelp::demand_ID::FilterBar::FilterField::billingRoleName'
            })
        ),
        workpackageMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FieldValueHelp::demand_ID::FilterBar::FilterField::workPackageName'
            })
        ),
        projectMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FieldValueHelp::demand_ID::FilterBar::FilterField::projectName'
            })
        ),
        demandDialogExtraElementToChangeFocus: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FieldValueHelp::demand_ID-search'
            })
        ),
        demandColumnListItemArray: element.all(
            by.control({
                controlType: 'sap.ui.table.Row',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                ancestor: {
                    id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FieldValueHelp::demand_ID::Table'
                }
            })
        ),
        demandDialogOkButton: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FieldValueHelp::demand_ID-ok'
            })
        ),
        workpackageInputField: element(
            by.control({
                controlType: "sap.m.Text",
                bindingPath: {
                    propertyPath: "workpackage/name"
                }
            })
        ),
        projectInputField: element(
            by.control({
                controlType: "sap.m.Text",
                bindingPath: {
                    propertyPath: "project/name"
                }
            })
        )
    },
    ResourceRequestDetails: {
        requestName: element(
            by.control({
                id: "manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::name::Field-edit"
            })
        ),
        projectRoleIcon: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::projectRole_ID::Field-edit-inner-vhi'
            })
        ),
        projectRoleExpandFilter:element(
            by.control({
                controlType: 'sap.m.Button',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                properties: {
                    text: 'Show Filters'
                }
            })
        ),
        projectRoleCodeMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::projectRole_ID::Dialog::qualifier::FilterBar::FilterField::code'
            })
        ),
        projectRoleMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::projectRole_ID::Dialog::qualifier::FilterBar::FilterField::name'
            })
        ),
        projectRoleDialogExtraElementToChangeFocus: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::projectRole_ID::Dialog::qualifier::-search'
            })
        ),
        projectRoleColumnListItemArray: element.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                ancestor: {
                    id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::projectRole_ID::Table'
                }
            })
        ),
        projectRoleDialogOkButton: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::projectRole_ID-ok'
            })
        ),


        //Resource Organization
        resourceOrg: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::requestedResourceOrg_ID::Field-edit-inner'
            })
        ),
        resourceOrgIcon: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::requestedResourceOrg_ID::Field-edit-inner-vhi'
            })
        ),
        resourceOrgCodeExpandFilter:element(
            by.control({
                id: "manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::requestedResourceOrg_ID::FilterBar-btnShowFilters"
            })
        ),
        resourceOrgCodeMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::requestedResourceOrg_ID::FilterBar::FilterField::code'
            })
        ),
        resourceOrgMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::requestedResourceOrg_ID::FilterBar::FilterField::description'
            })
        ),
        resourceOrgDialogExtraElementToChangeFocus: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::requestedResourceOrg_ID-search-inner'
            })
        ),
        resourceOrgColumnListItemArray: element.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                ancestor: {
                    id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::requestedResourceOrg_ID::Table'
                }
            })
        ),
        resourceOrgDialogOkButton: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::requestedResourceOrg_ID-ok'
            })
        ),


        //costCenter
        costCenterMultiInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--F::fe::form::ResourceRequests::com.sap.vocabularies.UI.v1.Facets::ResourceRequestDetails::com.sap.vocabularies.UI.v1.FieldGroup::SubSectionRequest2::FormC::FormF::requestedCostCenter_ID'
            })
        ),
        //requestPriority
        requestPriorityInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::priority_code::Field'
            })
        ),
        requestPriorityInputInner: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::priority_code::Field-edit-inner-vhi'
            })
        ),
        // release status
        releaseStatusInput: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--F::fe::form::ResourceRequests::com.sap.vocabularies.UI.v1.Facets::ResourceRequestDetails::com.sap.vocabularies.UI.v1.FieldGroup::SubSectionRequest2::FormC::FormF::releaseStatus_code'
            })
        ),
        releaseStatusInputInner: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--F::fe::form::ResourceRequests::com.sap.vocabularies.UI.v1.Facets::ResourceRequestDetails::com.sap.vocabularies.UI.v1.FieldGroup::SubSectionRequest2::FormC::FormF::releaseStatus_code-inner'
            })
        ),
        commentTextArea: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest2::FormElement::DataField::description::Field-edit'
            })
        )
    },
    EffortSection: {
        requestedTimeFrame: element(
            by.control({
                id: "manageResourceRequest::ResourceRequestObjectPage--fe::CustomSubSection::effortcustomSection--datePicker12"
            })
        ),
        requiredEffort: element(
            by.control({
                controlType: "sap.m.Input",
                bindingPath: {
                    propertyPath: "requestedCapacity"
                }
            })
        )
    },
    SkillSection: {
        skillCreateButton: element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::StandardAction::Create'
            })
        ),
        skillIcon:element(
            by.control({
                controlType: "sap.ui.core.Icon",
                properties: {
                    src: {
                        regex: {
                            source: "value\\-help"
                        }
                    }
                },
                ancestor: {
                    controlType: "sap.m.ColumnListItem",
                    ancestor: {
                        id: "manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem-innerTable"
                    }
                }
            })
        ),
        skillFilterExpand:element(
            by.control({
                controlType: 'sap.m.Button',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                properties: {
                    text: 'Show Filters'
                }
            })
        ),
        skillNameMultiInput:element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::TableValueHelp::skillRequirements::skill_ID::Dialog::qualifier::FilterBar::FilterField::name'
            })
        ),
        skillDialogExtraElementToChangeFocus:element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::TableValueHelp::skillRequirements::skill_ID::Dialog::qualifier::-search'
            })
        ),
        skillColumnListItemArray: element.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
                viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
                ancestor: {
                    id: 'manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::TableValueHelp::skillRequirements::skill_ID::Table'
                }
            })
        ),
        skillDialogOkButton:element(
            by.control({
                id: 'manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::TableValueHelp::skillRequirements::skill_ID-ok'
            })
        ),
        skillNameInputs: element.all(
            by.control({
                controlType:'sap.ui.mdc.Field',
                bindingPath: {
                    propertyPath: 'skill_ID'
                }
            })
        ),
        skillproficiencyLevelInputs:element.all(
            by.control({
                controlType:'sap.ui.mdc.Field',
                bindingPath: {
                    propertyPath: 'proficiencyLevel_ID'
                }
            })
        ),
        skillproficiencyLevelDropDown:(proficiencyLevel)=>{
            return element(by.control({
                controlType: "sap.m.Text",
                bindingPath: {
                    propertyPath: "name"
                },
                properties: {
                    text: proficiencyLevel
                }
            }));
        },
        skillImportanceInputs:element.all(
            by.control({
                controlType:'sap.ui.mdc.Field',
                bindingPath: {
                    propertyPath: 'importance_code'
                }
            })
        ),
        skillImportanceNewInputs:
            element(by.control({
                controlType: "sap.ui.core.Icon",
                viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                viewId: "manageResourceRequest::ResourceRequestObjectPage",
                properties: {
                    src: {
                        regex: {
                            source: "slim\\-arrow\\-down"
                        }
                    }
                },
                ancestor: {
                    controlType: "sap.ui.mdc.Field",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "manageResourceRequest::ResourceRequestObjectPage",
                    bindingPath: {
                        propertyPath: "importance_code"
                    }
                }
            })),
        skillImportanceDropDown:element.all(
            by.control({
                controlType:'sap.ui.core.Icon',
                properties: {
                    src: {
                        regex: {
                            source: 'slim\\-arrow\\-down'
                        }
                    }
                },
                ancestor: {
                    controlType: 'sap.m.ColumnListItem',
                    ancestor: {
                        id: 'manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem-innerTable'
                    }
                }
            })
        ),
        skillImportanceSelectInput: element(
            by.control({
                controlType: "sap.m.ColumnListItem",
                descendant: {
                    controlType: "sap.m.Text",
                    bindingPath: {
                        path: "/SkillImportanceCodes(1)"
                    }
                }
            })
        )
    },
    saveButton: element(
        by.control({
            id: 'manageResourceRequest::ResourceRequestObjectPage--fe::FooterBar::StandardAction::Save'
        })
    ),
    editButton: element(
        by.control({
            controlType: 'sap.m.Button',
            viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
            properties: {
                text: 'Edit'
            }
        })
    ),
    allIconsWithinTokens: element.all(
        by.control({
            controlType: 'sap.ui.core.Icon',
            viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
            properties: {
                src: {
                    regex: {
                        source: 'sys\\-cancel'
                    }
                }
            }
        })
    ),
    valueHelpGoButton: element(
        by.control({
            controlType: 'sap.m.Button',
            viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
            properties: {
                text: 'Go'
            }
        })
    ),
    valueHelpSelectRowWithText: (rowData)=>{
        return element(by.control({
            controlType: "sap.m.Text",
            properties:{
                text: rowData
            }
        }));
    }
};

const Display = {
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
    ResourceRequestDetails: {
        projectRole: element(
            by.control({
                id: "manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::projectRole_ID::Field"
            })
        )
    },
    WithdrawButton: element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "Withdraw"
        }
    })),
    PublishButton: element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "Publish"
        }
    })),
    DeleteButton: element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "Delete"
        }
    })),
    DeleteConfirmationButton: element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "Delete",
            type: 'Emphasized'
        }
    })),
    assignedResourceRowWithName: (resourceName) => {
        return element(
            by.control({
                controlType: "sap.m.ColumnListItem",
                id:/^manageResourceRequest::ResourceRequestObjectPage--fe::table::staffingDetails::LineItem-innerTableRow-/,
                ancestor:{
                    id: "manageResourceRequest::ResourceRequestObjectPage--fe::table::staffingDetails::LineItem-innerTable"
                },
                descendant:{
                    controlType: "sap.m.Link",
                    properties: {
                        text: resourceName
                    }
                }
            })
        );
    }
};

module.exports = {
    Edit,
    Display
};
