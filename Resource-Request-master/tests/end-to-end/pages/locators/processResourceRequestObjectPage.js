const Display = {
    Header: {
        objectPageHeaderTitle: element(
            by.control({
                controlType:"sap.m.Title",
                ancestor:{
                    controlType:"sap.uxap.ObjectPageDynamicHeaderTitle"
                }
            })
        )
    },
    generalInformationSection: element(
        by.control({
            id: 'staffResourceRequest::ResourceRequestObjectPage--fe::ObjectPage-anchBar-staffResourceRequest::ResourceRequestObjectPage--fe::FacetSection::GeneralInformation-anchor'
        })
    ),
    collapseHeader: element(
        by.control({
            id: 'staffResourceRequest::ResourceRequestObjectPage--fe::ObjectPage-OPHeaderContent-collapseBtn-img'
        })
    ),
    matchingResourcesSection: element(
        by.control({
            id: 'staffResourceRequest::ResourceRequestObjectPage--fe::ObjectPage-anchBar-staffResourceRequest::ResourceRequestObjectPage--fe::FacetSection::MatchingCandidates-anchor'
        })
    ),
    ForwardButton:element(by.control({
        controlType:"sap.m.Button",
        properties:{
            text: "Forward"
        }
    })),
    ForwardDialog:{
        ProcessingResourceOrgId:element(by.control({
            id:'APD_::processingResourceOrg_ID'
        })),
        ProcessingResourceOrgValueHelp:element(by.control({
            id:'APD_::processingResourceOrg_ID-inner-vhi'
        })),
        ProcessingResourceOrgSearchField:element(by.control({
            id:'ProcessResourceRequestService.forwardResourceRequest::processingResourceOrg_ID::Dialog::qualifier::-search'
        })),
        processingResourceOrgColumnListItem: (resourceOrgCode)=>{
            return element(by.control({
                controlType: "sap.m.Text",
                searchOpenDialogs: true,
                properties:{
                    text: resourceOrgCode
                }
            }));
        },
        ProcessingResourceOrgValueHelpOkButton:element(by.control({
            id: 'ProcessResourceRequestService.forwardResourceRequest::processingResourceOrg_ID-ok'
        })),
        ResourceManagerValueHelp:element(by.control({
            id:'APD_::resourceManager_ID-inner-vhi'
        })),
        ResourceManagerColumnListItem:(resourceManagerSearchField)=> {
            return element(by.control({
                controlType: "sap.m.ColumnListItem",
                searchOpenDialogs: true,
                descendant:{
                    controlType:"sap.m.Text",
                    searchOpenDialogs: true,
                    properties:{
                        text:resourceManagerSearchField
                    }
                }
            }));
        },
        ResourceManagerValueHelpOkButton:element(by.control({
            id:'ProcessResourceRequestService.forwardResourceRequest::resourceManager_ID-ok'
        })),
        ProcessorValueHelp:element(by.control({
            id:'APD_::processor_ID-inner-vhi'
        })),
        ProcessorColumnListItem:(processorValue)=>{
            return element(by.control({
                controlType: "sap.m.ColumnListItem",
                searchOpenDialogs: true,
                descendant:{
                    controlType:"sap.m.Text",
                    searchOpenDialogs: true,
                    properties:{
                        text:processorValue
                    }
                }
            }));
        },
        ProcessorValueHelpOkButton:element(by.control({
            id:'ProcessResourceRequestService.forwardResourceRequest::processor_ID-ok'
        })),
        ForwardButtonWithinDialog:element(by.control({
            controlType:'sap.m.Button',
            searchOpenDialogs:true,
            properties:{
                text:'Forward',
                type:'Emphasized'
            }
        }))

    },

    SetMyResponsibilityButton:element(by.control({
        controlType:"sap.m.Button",
        id: "staffResourceRequest::ResourceRequestObjectPage--fe::DataFieldForAction::ProcessResourceRequestService.setMyResponsibilityResourceRequest",
        properties:{
            text: "Set My Responsibilities"
        }
    })),
    SetMyResponsibilityDialog:{

        AsProcessorDropDown:element(by.control({
            searchOpenDialogs:true,
            id:'APD_::processor-inner-vhi'
        })),
        AsResourceManagerDropDown:element(by.control({
            searchOpenDialogs:true,
            id:'APD_::resourceManager-inner-vhi'
        })),
        asProcessorMdcFieldWithinDialog:(processor)=>element(by.control({
            controlType: 'sap.m.DisplayListItem',
            searchOpenDialogs:true,
            properties:{
                label: processor
            }
        })),

        asResourceManagerMdcFieldWithinDialog:(resourceManager)=>element(by.control({
            controlType: 'sap.m.DisplayListItem',
            searchOpenDialogs:true,
            properties:{
                label: resourceManager
            }
        })),

        SetMyResponsibillityButtonWithinDialog:element(by.control({
            controlType:'sap.m.Button',
            searchOpenDialogs:true,
            properties:{
                text:'Set My Responsibilities',
                type:'Emphasized'
            }
        }))
    },
    ResolveButton:element(by.control({
        controlType:"sap.m.Button",
        properties:{
            text: "Resolve"
        }
    })),
    ResolveOkButton:element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "OK"
        }
    })),
    GeneralInformation:{
        // ProcessingCostCenter:element(by.control({
        //   id:'staffResourceRequest::ResourceRequestObjectPage--F::fe::form::ResourceRequests::com.sap.vocabularies.UI.v1.Facets::GeneralInformation::com.sap.vocabularies.UI.v1.FieldGroup::SubSectionRequest::FormC::FormF::processingCostCenter_ID'
        // })),

        processingResourceOrgValue: (resOrgDesc)=>{
            return element(by.control({
                controlType: "sap.m.Text",
                properties:{
                    text:resOrgDesc
                },
                bindingPath: {
                    propertyPath: "processingResourceOrg/name"
                }
            }));
        },

        resourceManagerLink:(resourceManagerValue)=>{
            return element(by.control({
                controlType: "sap.m.Text",
                properties:{
                    text:resourceManagerValue
                },
                bindingPath: {
                    propertyPath: "resourceManager"
                }
            }));
        },
        processorLink:(processorValue)=>{
            return element(by.control({
                controlType: "sap.m.Text",
                properties:{
                    text:processorValue
                },
                bindingPath: {
                    propertyPath: "processor"
                }
            }));
        }
    },
    MatchingResources:{
        visibleRowsInTable: element.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
                ancestor: {
                    id:
                'staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable'
                }
            })
        ),
        MatchingResourcesTableColumnFirstRowName:element.all(by.control({
            controlType: 'sap.m.Link',
            bindingPath: {
                propertyPath: 'resourceName'
            }
        })),
        MatchingResourcesTableColumnSkillMatch:element.all(by.control({
            controlType: 'sap.m.Text',
            bindingPath: {
                propertyPath: 'skillMatchPercentage'
            }
        })),
        MatchingResourcesColumnAvailabilityMatch:element.all(by.control({
            controlType: 'sap.m.Text',
            bindingPath: {
                propertyPath: 'availabilityMatchPercentage'
            }
        })),
        MatchingResourcesColumnTotalMatch:element.all(by.control({
            controlType: 'sap.m.Text',
            bindingPath: {
                propertyPath: 'totalMatchPercentage'
            }
        })),
        resourceNameinTable: (resourceName)=>{
            return element(by.control({
                controlType: "sap.m.Link",
                properties:{
                    text:resourceName
                }
            }));
        },
        resourceNameinContactCard: (resourceName)=>{
            return element(by.control({
                controlType: "sap.m.Link",
                properties:{
                    text:resourceName,
                    target:"_blank"
                }
            }));
        }

    }
};

module.exports = {
    Display
};

