using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.ResourceRequests with @(UI : {
    //Object Page: Header information:
    HeaderInfo                                         : {
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
    Identification                                     : [
    {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>ACTION_RESPONSIBILITY}',
        Action       : 'ProcessResourceRequestService.setMyResponsibilityResourceRequest',
        @UI.Hidden : isResolved
    },
    {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>ACTION_FORWARD}',
        Action       : 'ProcessResourceRequestService.forwardResourceRequest',
        @UI.Hidden : isResolved
    },
    {
        $Type        : 'UI.DataFieldForAction',
        Label        : '{i18n>ACTION_RESOLVE}',
        Action       : 'ProcessResourceRequestService.resolveResourceRequest',
        @UI.Hidden : isResolved
    },
    {
        $Type           : 'UI.DataFieldForIntentBasedNavigation',
        Label           : '{i18n>MANAGE_APP}',
        SemanticObject  : 'ResourceRequest',
        Action          : 'Manage'
    }
    ],

    //Object Page: Information in Header Section:
    HeaderFacets                                       : [
    {
        $Type            : 'UI.ReferenceFacet',
        Target           : '@UI.FieldGroup#FieldGroupResourceRequestHeaderDetails',
        @UI.Importance : #High
    },
    {
        $Type            : 'UI.ReferenceFacet',
        Target           : '@UI.DataPoint#RequestPriority',
        @UI.Importance : #High
    },
    {
        $Type            : 'UI.ReferenceFacet',
        Label            : '',
        Target           : '@UI.DataPoint#RequestStatus',
        @UI.Importance : #High
    },
    {
        $Type            : 'UI.ReferenceFacet',
        Label            : '',
        Target           : '@UI.DataPoint#StaffingStatusDescription',
        @UI.Importance : #High
    }
    ],
    FieldGroup #FieldGroupResourceRequestHeaderDetails : {Data : [
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
    DataPoint #RequestPriority                         : {
        Title : '{i18n>REQUEST_PRIORITY}',
        Value : priority_code,
         ![@Common.QuickInfo] : '{i18n>REQUEST_PRIORITY}',
    },
    DataPoint #StaffingStatusDescription               : {
        Title : '{i18n>STAFFING_STATUS}',
        Value : staffingStatus.staffingStatus.description,
         ![@Common.QuickInfo] : '{i18n>STAFFING_STATUS}',
    },
    DataPoint #RequestStatus                           : {
        Title : '{i18n>REQUEST_STATUS}',
        Value : requestStatus_code,
         ![@Common.QuickInfo] : '{i18n>REQUEST_STATUS}',
    },
    Facets                                             : [
    {
        $Type  : 'UI.CollectionFacet',
        ID     : 'Reference',
        Label  : '{i18n>REFERENCE_OBJECT}',
        @UI.Hidden : { $edmJson :{$Path: 'isS4Cloud' }},
        Facets : [
            {
                $Type: 'UI.ReferenceFacet',
                ID   :  'SubSectionReferenceObject',
                Target: '@UI.FieldGroup#SubSectionReferenceObject' 
            }
        ]
    },    
    {
        $Type  : 'UI.CollectionFacet',
        ID     : 'GeneralInformation',
        Label  : '{i18n>GENERAL_INFORMATION}',
        Facets : [

            {
                $Type  : 'UI.ReferenceFacet',
                ID     : 'SubSectionRequest',
                Label  : '{i18n>REQUEST_DETAILS}',
                Target : '@UI.FieldGroup#SubSectionRequest'
            },
            {
                $Type  : 'UI.ReferenceFacet',
                ID     : 'SubSectionProject',
                Label  : '{i18n>PROJECT_DETAILS}',
                Target : '@UI.FieldGroup#SubSectionProject',
                @UI.Hidden : isS4CloudNegation
            }
        ]
    },
    {
        $Type  : 'UI.ReferenceFacet',
        ID     : 'RequiredSkills',
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
                Target : 'staffing/@UI.PresentationVariant'
            }
        ]
    },

    /*
       Give associationName/@UI.PresentationVariant in order for default sort to work.
       In presentation variant annotation it is mentioned that visualization is @UI.LineItem
       --refer matchingCandidate.cds PresentationVariant annotations for more details

    */

    {
        $Type        : 'UI.ReferenceFacet',
        ID           : 'MatchingCandidates',
        Label        : '{i18n>MATCHING_RESOURCES}',
        Target       : 'matchingCandidates/@UI.PresentationVariant',
        @UI.Hidden : isResolved
    }
    ],
    FieldGroup #SubSectionReferenceObject : {Data : [
        {
            $Type : 'UI.DataField',
            Value : referenceObjectType_code,
            Label     :  '{i18n>REFERENCE_OBJECT_TYPE}'
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject_ID,
            Label        : '{i18n>REFERENCE_ID}'
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject.name,
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject.startDate
        },
        {
            $Type : 'UI.DataField',
            Value : referenceObject.endDate
        }
    ]},
    FieldGroup #SubSectionProject                      : {Data : [
    {
        $Type : 'UI.DataField',
        Value : project.name
    },
    {
        $Type : 'UI.DataField',
        Value : project.customer.name
    },
    {
        $Type : 'UI.DataField',
        Value : workpackage.name
    },
    {
        $Type : 'UI.DataField',
        Value : demand_ID
    },
    {
        $Type : 'UI.DataField',
        Value : demand.workItemName,
        Label : '{i18n>WORKITEM_NAME}'
    }
    ]},
    FieldGroup #SubSectionRequest                      : {Data : [
    {
        Label : '{i18n>REQUEST_NAME}',
        Value : name
    },
    {
        $Type : 'UI.DataField',
        Value : projectRole.name
    },
    {
        $Type : 'UI.DataField',
        Value : effortDistributionType.code
    },
    {
        Label : '{i18n>RESOURCE_MANAGER}',
        Value : resourceManager
    },
    {
        Label : '{i18n>PROCESSOR}',
        Value : processor
    },
    {
        $Type : 'UI.DataField',
        Value : requestedResourceOrg_ID
    },
    {
        $Type : 'UI.DataField',
        Value : processingResourceOrg_ID
    },

    {
        $Type : 'UI.DataField',
        Value : modifiedAt
    },
    {
        $Type : 'UI.DataField',
        Value : modifiedBy
    },
    {
        $Type : 'UI.DataField',
        Value : description
    }
    ]},
    FieldGroup #SubSectionRequestEffort                : {Data : [
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
});
