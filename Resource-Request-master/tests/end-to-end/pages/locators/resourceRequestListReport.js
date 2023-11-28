const resourceRequestListReport = {
    goButton: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests-btnSearch'
        })
    ),
    checkboxInFirstRow: element(
        by.control({
            controlType: "sap.m.CheckBox",
            ancestor: {
                controlType: "sap.m.ColumnListItem",
                viewId: "manageResourceRequest::ResourceRequestListReport",
                ancestor: {
                    id: "manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-innerTable"
                }
            }
        })
    ),
    checkboxInFirstRowProject: element(
        by.control({
            controlType: "sap.m.ColumnListItem",
            viewId: "manageResourceRequest::ResourceRequestListReport",
            properties: {
                type: "Active"
            }
        })
    ),
    editingStatusSelectButton: element(
        by.control({
            controlType: 'sap.ui.core.Icon',
            id: 'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::DraftEditingStatus-inner-vhi'
        })
    ),
    editingStatusAll: element(
        by.control({
            controlType: 'sap.m.DisplayListItem',
            properties: {
                label: 'All'
            }
        })
    ),
    editingStatusUnchanged: element(
        by.control({
            controlType: 'sap.m.DisplayListItem',
            properties: {
                label: 'Unchanged'
            }
        })
    ),
    requestId: element(
        by.control({
            id: "manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::displayId"
        })
    ),
    requestName: element(
        by.control({
            id: "manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::name"
        })
    ),
    projectFilterInput: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID'
        })
    ),
    projectFilterInputIcon: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID-inner-vhi'
        })
    ),
    projectFilterValuHelpGeneralSearch: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterFieldValueHelp::project_ID-search'
        })
    ),
    projectFilterValuHelpClearButton: element(
        by.control({
            controlType: "sap.ui.core.Icon",
            viewId: "manageResourceRequest::ResourceRequestListReport",
            properties: {
                src: {
                    regex: {
                        source: "decline"
                    }
                }
            },
            searchOpenDialogs: true
        })
    ),
    projectFilterOkButton: element(
        by.control({
            controlType: "sap.m.Button",
            viewId: "manageResourceRequest::ResourceRequestListReport",
            searchOpenDialogs: true,
            properties:{
                text : "OK"
            }
        })
    ),
    projectRoleFilterInput: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::projectRole_ID'
        })
    ),
    projectRoleFilterInputIcon: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::projectRole_ID-inner-vhi'
        })
    ),
    projectRoleFilterValuHelpGeneralSearch: element(
        by.control({
            id:
            'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterFieldValueHelp::projectRole_ID::Dialog::qualifier::-search'
        })
    ),
    projectRoleFilterValuHelpClearButton: element(
        by.control({
            controlType: "sap.ui.core.Icon",
            properties: {
                src: {
                    regex: {
                        source: "decline"
                    }
                }
            }
        })
    ),
    projectRoleFilterOkButton: element(
        by.control({
            controlType: "sap.m.Button",
            viewId: "manageResourceRequest::ResourceRequestListReport",
            properties:{
                text : "OK"
            }
        })
    ),
    requestNameFilterField: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::name'
        })
    ),
    customerFilterInput: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project::customer_ID'
        })
    ),
    staffStatusFilterInput: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::staffingStatus::staffingCode'
        })
    ),
    priorityCodeFilterInput: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::priority_code'
        })
    ),
    filterBarExpandButton: element(by.control({
        controlType: "sap.m.Button",
        properties: {
            type: "Default"
        },
        id: /-expandBtn$/
    })),
    projectFilterDeleteIcons:element.all(
        by.control({
            controlType:"sap.ui.core.Icon",
            id:/^manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID-inner-token/
        })
    ),
    requestNameDeleteIcons:element.all(
        by.control({
            controlType:"sap.ui.core.Icon",
            id:/^manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::name-inner-token/
        })
    ),
    releaseStatusIcons:element.all(
        by.control({
            controlType:"sap.ui.core.Icon",
            id:/^manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::releaseStatus_code/
        })
    ),
    releaseStatusFilterInput: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::releaseStatus_code'
        })
    ),
    resourceRequestTable: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-innerTable'
        })
    ),
    createButton: element(
        by.control({
            id:
        'manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem::StandardAction::Create'
        })
    ),
    deleteButton:element(
        by.control({
            id:'manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem::StandardAction::Delete'
        })
    ),
    deleteDialogOkButton:element(by.control({
        controlType: "sap.m.Dialog",
        interaction: "focus"
    })).element(by.control({
        controlType: "sap.m.Button",
        autoWait: true,
        properties: {
            text: "Delete"
        }
    })),
    selectAllCheckBox:element(
        by.control({
            id:'manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-innerTable-sa'
        })
    ),
    visibleRowsInTable: element.all(
        by.control({
            controlType: 'sap.m.ColumnListItem',
            viewName: 'sap.fe.templates.ListReport.ListReport',
            viewId: 'manageResourceRequest::ResourceRequestListReport'
        })
    ),
    tableToolBar: element.all(
        by.control({
            id:
          'manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar'

        })
    ),
    plainText: (text)=>{
        return element(by.control({
            controlType: "sap.m.Text",
            properties:{text}
        }));
    }
};

module.exports = resourceRequestListReport;
