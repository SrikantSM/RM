using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.ResourceRequests with @(
    UI                               : {
        HeaderInfo                          : {
            TypeName       : '{i18n>TITLE_RESOURCE_REQUEST}',
            TypeNamePlural : '{i18n>TITLE_RESOURCE_REQUESTS}',
            Title          : {
                $Type : 'UI.DataField',
                Value : name
            },
            Description     : {
                $Type : 'UI.DataField',
                Value : displayId
            }
        },

        //Identification holds actions on top
        Identification                      : [
        {
            $Type        : 'UI.DataFieldForAction',
            Label        : '{i18n>ACTION_PUBLISH}',
            Action       : 'ManageResourceRequestService.publishResourceRequest',
            @UI.Hidden   : releaseStatus.isPublished
        },
        {
            $Type        : 'UI.DataFieldForAction',
            Label        : '{i18n>ACTION_WITHDRAW}',
            Action       : 'ManageResourceRequestService.withdrawResourceRequest',
            @UI.Hidden   : releaseStatus.isWithdrawn
        },
        {
            $Type               : 'UI.DataFieldForIntentBasedNavigation',
            Label               : '{i18n>STAFF_APP}',
            SemanticObject      : 'ResourceRequest',
            Action              : 'Display',
            NavigationAvailable : releaseStatus.isPublished
        },
        ],
        HeaderFacets                        : [
        {
            $Type            : 'UI.ReferenceFacet',
            Target           : '@UI.FieldGroup#Effort',
            @UI.Importance : #High
        },
        {
            $Type            : 'UI.ReferenceFacet',
            Target           : '@UI.DataPoint#RequestPriority',
            @UI.Importance : #High
        },
        {
            $Type            : 'UI.ReferenceFacet',
            Target           : '@UI.DataPoint#RequestStatus',
            @UI.Importance : #High
        },
        {
            $Type            : 'UI.ReferenceFacet',
            Target           : '@UI.DataPoint#ReleaseStatus',
            @UI.Importance : #High
        }
        ],
        FieldGroup #Effort                  : {Data : [
        {
            $Type : 'UI.DataField',
            Value : startDate
        },
        {
            $Type : 'UI.DataField',
            Value : endDate
        },
        {
            Label : '{i18n>REQUIRED_EFFORTS}',
            Value : requestedCapacity
        }
        ]},
        DataPoint #RequestPriority          : {
            Title : '{i18n>REQUEST_PRIORITY}',
            Value : priority.name,
            ![@Common.QuickInfo] : '{i18n>REQUEST_PRIORITY}',
        },
        DataPoint #RequestStatus            : {
            Title : '{i18n>REQUEST_STATUS}',
            Value : requestStatus.description,
            ![@Common.QuickInfo] : '{i18n>REQUEST_STATUS}',
        },
        DataPoint #ReleaseStatus            : {
            Title : '{i18n>PUBLISHING_STATUS}',
            Value : releaseStatus.description,
            ![@Common.QuickInfo] : '{i18n>PUBLISHING_STATUS}',
        },
        //Definition of the Facets on the Object Page
        Facets                              : [
        {
            $Type  : 'UI.CollectionFacet',
            ID     : 'Reference',
            Label  : '{i18n>REFERENCE}',
            @UI.Hidden : { $edmJson :{$Path: 'isS4Cloud'}},
            Facets : [
                {
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'SubSectionReference1',
                    Label : '{i18n>REFERENCE_TYPE}',
                    Target : '@UI.FieldGroup#SubSectionReference1'
                },
                {
                    $Type  : 'UI.CollectionFacet',
                    ID     : 'ReferenceObject',
                    Label  : '{i18n>REFERENCE_OBJECT}',
                    Facets : [{
                        $Type  : 'UI.ReferenceFacet',
                        ID     : 'SubSectionReferenceObject',
                        Target : '@UI.FieldGroup#SubSectionReferenceObject'
                    }]
                },
            ]
        },
        {
            $Type  : 'UI.CollectionFacet',
            ID     : 'ProjectInformation',
            Label  : '{i18n>PROJECT_INFORMATION}',
            @UI.Hidden : { $edmJson: { $Not:{$Path: 'isS4Cloud'}}},
            Facets : [
                {
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'SubSectionProjectDemand',
                    Label  : '{i18n>DEMAND_DETAILS}',
                    Target : '@UI.FieldGroup#SubSectionProjectDemand'
                },
                {
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'SubSectionWorkpackage',
                    Label  : '{i18n>WORKPACKAGE_DETAILS}',
                    Target : '@UI.FieldGroup#SubSectionWorkpackage'
                },
                {
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'SubSectionProject',
                    Label  : '{i18n>PROJECT_DETAILS}',
                    Target : '@UI.FieldGroup#SubSectionProject'
                }
            ]
        },
        {
            $Type  : 'UI.CollectionFacet',
            ID     : 'ResourceRequestDetails',
            Label  : '{i18n>RESOURCEREQUEST_DETAILS}',
            Facets : [
                {
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'SubSectionRequest1',
                    Target : '@UI.FieldGroup#SubSectionRequest1'
                },
                {
                    $Type  : 'UI.ReferenceFacet',
                    ID     : 'SubSectionRequest2',
                    Target : '@UI.FieldGroup#SubSectionRequest2'
                }
            ]
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>REQUIRED_SKILLS}',
            Target : 'skillRequirements/@UI.LineItem'
        },
        {
            $Type  : 'UI.CollectionFacet',
            ID     : 'AssignResource',
            Label  : '{i18n>ASSIGNMENTS}',
            Facets : [
                {
                    $Type  : 'UI.CollectionFacet',
                    ID     : 'StaffingSummery',
                    Label  : '{i18n>STAFFING_SUMMARY_FACET}',
                    Facets : [{
                        $Type  : 'UI.ReferenceFacet',
                        Target : '@UI.FieldGroup#SubSectionRequestEffort'
                    }]
                },
                {
                    $Type  : 'UI.ReferenceFacet',
                    Label  : '{i18n>ASSIGNED_RESOURCES}',
                    Target : 'staffingDetails/@UI.PresentationVariant'
                }
            ]
        }


        ],
        FieldGroup #SubSectionReference1 : {Data : [
        {
            $Type : 'UI.DataField',
            Value : referenceObjectType_code,
            Label : '{i18n>REFERENCE_TYPE}'
        }
        ]},
        FieldGroup #SubSectionReferenceObject : {Data : [
        {
            $Type : 'UI.DataField',
            Value : referenceObject_ID,
            Label : '{i18n>REFERENCE_OBJECT_ID}'
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject.name,
            Label : '{i18n>REFERENCE_OBJECT_NAME}'
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject.startDate,
            Label : '{i18n>REFERENCE_OBJECT_START_DATE}'
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject.endDate,
            Label : '{i18n>REFERENCE_OBJECT_END_DATE}'
        }
        ]},
        FieldGroup #SubSectionProjectDemand : {Data : [
        {
            $Type : 'UI.DataField',
            Value : demand.ID
        },
        {
            $Type : 'UI.DataField',
            Value : demand.billingCategory.name
        },
        {
            $Type : 'UI.DataField',
            Value : demand.requestedQuantity,
            Label : '{i18n>ESTIMATED_EFFORT}'
        },
        {
            $Type : 'UI.DataField',
            Value : demand.workItemName,
            Label : '{i18n>WORKITEM_NAME}'
        }
        ]},
        FieldGroup #SubSectionWorkpackage   : {Data : [
        {
            $Type : 'UI.DataField',
            Value : workpackage.name,
        },
        {
            $Type : 'UI.DataField',
            Value : workpackage.startDate
        },
        {
            $Type : 'UI.DataField',
            Value : workpackage.endDate
        }
        ]},
        FieldGroup #SubSectionProject       : {Data : [
        {
            $Type : 'UI.DataField',
            Value : project.name,
        },
        {
            $Type : 'UI.DataField',
            Value : project.startDate
        },
        {
            $Type : 'UI.DataField',
            Value : project.endDate
        },
        {
            $Type : 'UI.DataField',
            Value : project.customer.name
        }
        ]},
        FieldGroup #SubSectionRequest1      : {Data : [
        {
            $Type : 'UI.DataField',
            Value : name
        },
        {
            $Type : 'UI.DataField',
            Value : projectRole_ID
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>RESOURCE_MANAGER}',
            Value : resourceManager
        },
        {
            $Type : 'UI.DataField',
            Value : priority_code
        },
        {
            $Type : 'UI.DataField',
            Value : requestedResourceOrg_ID
        }
        ]},
        FieldGroup #SubSectionRequest2      : {Data : [
        {
            $Type : 'UI.DataField',
            Value : description
        }
        ]},
        FieldGroup #SubSectionRequestEffort : {Data : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>REQUIRED}',
            Value : staffingStatus.requestedCapacity
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>STAFFED_EFFORT}',
            Value : staffingStatus.bookedCapacity
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>REMAINING_EFFORT}',
            Value : staffingStatus.remainingCapacity
        }
        ]},
    },
    Common.SideEffects #DemandChange : {
        SourceProperties : [demand_ID],
        TargetProperties : [
        'demand',
        'workpackage',
        'project',
        'startDate',
        'endDate',
        'requestedCapacity',
        'requestedResourceOrg'
        ]
    } ,
    Common.SideEffects #ReferenceObjectChange : {
        SourceProperties : [referenceObject_ID],
        TargetProperties : [
            'referenceObject',
            'referenceObject.startDate',
            'referenceObject.endDate',
            'referenceObject.name',
            'referenceObject_ID'
        ]
    },
    Common.SideEffects #ReferenceObjectTypeChange : {
        SourceProperties : [referenceObjectType_code],
        TargetProperties : [
            'referenceObjectType',
            'referenceObjectFieldControl',
            'referenceObject_ID',
            'resourceRequests'
        ]
    }
);
