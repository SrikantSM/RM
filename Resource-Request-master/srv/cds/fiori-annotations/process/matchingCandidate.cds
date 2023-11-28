using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.MatchingCandidates with @(
    Capabilities       : {
        SearchRestrictions.Searchable : true,
        SortRestrictions   : {
        $Type                 : 'Capabilities.SortRestrictionsType',
        NonSortableProperties : [
            remainingCapacity,
            resource_ID,
            resourceRequest_ID,
            resourceRequestStartDate,
            resourceRequestEndDate,
            initials,
            workforcePersonID,
            commaSeparatedProjectRoles
        ]
    }
    }
);
annotate ProcessResourceRequestService.MatchingCandidates with {

    remainingCapacity
    @UI.HiddenFilter: true;

    resource_ID
    @UI.HiddenFilter: true;

    resourceRequest_ID
    @UI.HiddenFilter: true;

    resourceRequestStartDate
    @UI.HiddenFilter: true;

    resourceRequestEndDate
    @UI.HiddenFilter: true;

    initials
    @UI.HiddenFilter: true;

    workforcePersonID
    @UI.HiddenFilter: true;

    commaSeparatedProjectRoles
    @UI.HiddenFilter: true;
};
annotate ProcessResourceRequestService.MatchingCandidates with {
    resourceName
    @Common : {
        Label        : '{i18n>NAME}',
        ValueList    : {
            CollectionPath  : 'ResourceDetails',
            Label        : '{i18n>Name}',
            SearchSupported : true,
            Parameters      : [
            {
                $Type             : 'Common.ValueListParameterOut',
                LocalDataProperty : 'resourceName',
                ValueListProperty : 'fullName'
            }
            ]
        },
    };
    availabilityMatchPercentage
@Common : {
        Label        : '{i18n>AVAILABILITY_MATCH}',
        FieldControl : #ReadOnly,
        }
    @( Measures.Unit: 'concentr-percent' );
    skillMatchPercentage
@Common : {
        Label        : '{i18n>SKILL_MATCH}',
        FieldControl : #ReadOnly,
    }
    @( Measures.Unit: 'concentr-percent' );
    utilizationPercentage
@Common : {
        Label        : '{i18n>UTILIZATION}',
        FieldControl : #ReadOnly,
    }
    @( Measures.Unit: 'concentr-percent' );
    totalMatchPercentage
    @Measures.Unit : 'concentr-percent'
@Common : {
        Label        : '{i18n>TOTAL_MATCH}',
        FieldControl : #ReadOnly,
    };
    workerTypeName
@Common : {
        Label        : '{i18n>WORKER_TYPE}',
        FieldControl : #ReadOnly,
        ValueListWithFixedValues : true,
        ValueList : {
            Label        : '{i18n>WORKER_TYPE}',
            CollectionPath  : 'WorkerType',
            SearchSupported : true,
            Parameters      : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : 'workerTypeName',
                    ValueListProperty : 'name'
                }
            ]
        }
    };
    commaSeparatedProjectRoles
 @Common.Label: '{i18n>PROJECT_ROLES}';
};

annotate ProcessResourceRequestService.MatchingCandidates with @(UI : {
    HeaderInfo                 : {
        TypeName : '{i18n>MATCHING_RESOURCES}',
        TypeNamePlural : '{i18n>MATCHING_RESOURCES}'
    },
    FieldGroup #AssignResource : {Data : [{
        $Type  : 'UI.DataFieldForAction',
        Label  : '{i18n>ASSIGN_FOR_SPECIFIC_PERIOD}',
        Action : 'ProcessResourceRequestService.AssignForSpecificPeriod'
    },{
        $Type  : 'UI.DataFieldForAction',
        Label  : '{i18n>ASSIGN_AS_REQUESTED}',
        Action : 'ProcessResourceRequestService.AssignAsRequested'
    } ]},
    LineItem                   : [
        {
            $Type  : 'UI.DataField',
            Value  : workerTypeName,
            ![@HTML5.CssDefaults] : {width : '9rem'}
        },
        {
            $Type  : 'UI.DataField',
            Value  : commaSeparatedProjectRoles,
            ![@UI.Importance] : #High
        },
        {
            $Type  : 'UI.DataField',
            Value  : totalMatchPercentage,
            ![@UI.Importance] : #High,
            ![@HTML5.CssDefaults] : {width : '9rem'}
        },
        {
            $Type  : 'UI.DataField',
            Value  : availabilityMatchPercentage,
            ![@UI.Importance] : #High,
            ![@HTML5.CssDefaults] : {width : '11rem'}
        },
        {
            $Type  : 'UI.DataField',
            Value  : skillMatchPercentage,
            ![@UI.Importance] : #High,
            ![@HTML5.CssDefaults] : {width : '9rem'}
        },
        {
            $Type  : 'UI.DataField',
            Value  : utilizationPercentage,
            ![@HTML5.CssDefaults] : {width : '11rem'}
        }
    ],
    /*

    Default sorting annotation on particular colums
    */
    PresentationVariant        : {
        SortOrder      : [{
            Property   : 'totalMatchPercentage',
            Descending : true
        }],
        Visualizations : ['@UI.LineItem'],
        RequestAtLeast : [resourceRequestStartDate,
        resourceRequestEndDate,
        remainingCapacity,
        resources.externalID,
        resources.fullName,
        resources.role,
        resources.firstName,
        resources.lastName,
        resources.mobilePhoneNumber,
        resources.emailAddress,
        resources.resourceOrg,
        resources.costCenterID,
        resources.resource_ID,
        resources.resourceOrgCode,
        resources.costCenterDesc,
        resources.country_name,
        resources.workforcePersonID,
        resources.initials,
        resources.toManager.managerName,
        workforcePersonID,
        initials,
        resources.workerType.name
        ]
    }
});
