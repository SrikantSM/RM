const resourceRequestListReport = {
    goButton: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests-btnSearch'
        })
    ),
    exportArrowDownButton: element(by.control({
        controlType: "sap.m.Button",
        viewId: "staffResourceRequest::ResourceRequestListReport",
        properties: {
            icon: "sap-icon://slim-arrow-down"
        },
        ancestor: {
            id: "staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-export-internalSplitBtn"
        }
    })
    ),
    requestId: element(
        by.control({
            id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::displayId"
        })
    ),
    requestName: element(
        by.control({
            id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::name"
        })
    ),
    filterBarExpandButton: element(by.control({
        controlType: "sap.m.Button",
        id: /-expandBtn$/
    })),
    projectFilterInput: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID'
        })
    ),
    projectFilterInputIcon: element(
        by.control({
            id:
        'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID-inner-vhi'
        })
    ),
    projectFilterValuHelpGeneralSearch: element(
        by.control({
            id:
        'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterFieldValueHelp::project_ID::Dialog::qualifier::-search'
        })
    ),
    projectFilterValuHelpClearButton: element(
        by.control({
            controlType: "sap.ui.core.Icon",
            viewId: "staffResourceRequest::ResourceRequestListReport",
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
            viewId: "staffResourceRequest::ResourceRequestListReport",
            properties : {
                text : "OK"
            }
        })
    ),
    projectRoleFilterInput: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::projectRole_ID'
        })
    ),
    projectRoleFilterInputIcon: element(
        by.control({
            id:
        'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::projectRole_ID-inner-vhi'
        })
    ),
    projectRoleFilterValuHelpGeneralSearch: element(
        by.control({
            id:
        'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterFieldValueHelp::projectRole_ID::Dialog::qualifier::-search'
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
            viewId: "staffResourceRequest::ResourceRequestListReport",
            properties : {
                text : "OK"
            }
        })
    ),

    requestNameFilterField: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::name'
        })
    ),
    customerFilterInput: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project::customer_ID'
        })
    ),
    staffingStatusFilterInput: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::staffingStatus::staffingCode'
        })
    ),
    staffingStatusFilterDropDown: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::staffingStatus::staffingCode-inner-vhi'
        })
    ),
    staffingStatusFilterCheckBox:(sStatus,iEnumValue)=> {
        return element(by.control({
            controlType: "sap.m.Text",
            properties:{
                text:sStatus
            },
            bindingPath: {
                path: `/StaffingStatusCodes(${iEnumValue})`
            }

        }));
    },
    priorityFilterInput: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::priority_code'
        })
    ),
    statusFilterInput: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::requestStatus_code'
        })
    ),
    statusFilterDropDown: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::requestStatus_code-inner-vhi'
        })
    ),
    statusFilterCheckBox:(sStatus,iEnumValue)=> {
        return element(by.control({
            controlType: "sap.m.Text",
            properties:{
                text:sStatus
            },
            bindingPath: {
                path: `/RequestStatuses(${iEnumValue})`
            }

        }));
    },
    projectFilterDeleteIcons:element.all(
        by.control({
            controlType:"sap.ui.core.Icon",
            id:/^staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID-inner-token/
        })
    ),
    resourceRequestTable: element(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-innerTable'
        })
    ),
    visibleRowsInTable: element.all(
        by.control({
            controlType: 'sap.m.ColumnListItem',
            viewName: 'sap.fe.templates.ListReport.ListReport',
            viewId: "staffResourceRequest::ResourceRequestListReport"
        })
    ),
    tableToolBar: element.all(
        by.control({
            id:
          'staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar'

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
