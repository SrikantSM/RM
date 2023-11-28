using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.ResourceRequests with @(
  odata.draft.enabled : true,
  Capabilities        : {
    SearchRestrictions.Searchable : false,
    Insertable                    : true,
    Updatable                     : true,
    Deletable                     : true,
    SortRestrictions              : {
      $Type                 : 'Capabilities.SortRestrictionsType',
      NonSortableProperties : [
        ID,
        staffingStatus.description,
        staffingStatus.bookedCapacityHard,
        staffingStatus.bookedCapacitySoft,
        staffingStatus.remainingCapacity
      ],
    },
    FilterRestrictions            : {FilterExpressionRestrictions : [
      {
        Property           : 'startDate',
        AllowedExpressions : 'SingleRange'
      },
      {
        Property           : 'endDate',
        AllowedExpressions : 'SingleRange'
      }
    ]}
  },
  Common.SemanticKey  : [ID],
  UI                  : {

    //List Report: Resource request filter bar fields:
    SelectionFields                       : [
      displayId,
      name,
      staffingStatus.staffingCode,
      priority_code,
      releaseStatus_code,
      projectRole_ID
    ],

    FilterFacets                          : [
      {
        $Type             : 'UI.ReferenceFacet',
        Label             : '{i18n>PROJECT_INFORMATION}',
        ID                : 'FilterFacetProjectInfo',
        Target            : '@UI.FieldGroup#FilterFacetProjectInfo',
        ![@UI.Importance] : #High
      },
      {
        $Type             : 'UI.ReferenceFacet',
        Label             : '{i18n>RESOURCEREQUEST_DETAILS}',
        ID                : 'FilterFacetRequestDetails',
        Target            : '@UI.FieldGroup#FilterFacetRequestDetails',
        ![@UI.Importance] : #High
      },
      {
        $Type             : 'UI.ReferenceFacet',
        Label             : '{i18n>TITLE_EFFORT}',
        ID                : 'FilterFacetEffort',
        Target            : '@UI.FieldGroup#FilterFacetEffort',
        ![@UI.Importance] : #High
      },
      {
        $Type             : 'UI.ReferenceFacet',
        Label             : '{i18n>REFERENCE_OBJECT}',
        ID                : 'FilterFacetReferenceObject',
        Target            : '@UI.FieldGroup#FilterFacetReferenceObject',
        ![@UI.Importance] : #High
      },
      {
        $Type             : 'UI.ReferenceFacet',
        Label             : '{i18n>STAFFING}',
        ID                : 'FilterFacetStaffing',
        Target            : '@UI.FieldGroup#FilterFacetStaffing',
        ![@UI.Importance] : #High
      }
    ],

    FieldGroup #FilterFacetReferenceObject    : {Data : [
      {
        $Type : 'UI.DataField',
        Value : referenceObjectType_code
      },
      {
        $Type : 'UI.DataField',
        Value : referenceObject_ID
      }
    ]},  
    FieldGroup #FilterFacetStaffing    : {Data : [
      {
        $Type : 'UI.DataField',
        Value : staffingDetails.assignmentStatus_code
      }
    ]},

    FieldGroup #FilterFacetProjectInfo    : {Data : [
      {
        $Type : 'UI.DataField',
        Value : demand_ID
      },
      {
        $Type : 'UI.DataField',
        Value : workpackage_ID
      },
      {
        $Type : 'UI.DataField',
        Value : workItemName
      },
      {
        $Type : 'UI.DataField',
        Value : project_ID
      },
      {
        $Type : 'UI.DataField',
        Value : project.customer_ID
      }
    ]},

    FieldGroup #FilterFacetRequestDetails : {Data : [
      {
        $Type : 'UI.DataField',
        Value : requestedResourceOrg_ID
      },
      {
        $Type : 'UI.DataField',
        Value : requestStatus_code
      },
      {
        $Type : 'UI.DataField',
        Value : resourceManager
      },
      {
        $Type : 'UI.DataField',
        Value : processor
      }
    ]},

    FieldGroup #FilterFacetEffort         : {Data : [
      {
        $Type : 'UI.DataField',
        Value : startDate
      },
      {
        $Type : 'UI.DataField',
        Value : endDate
      },
      {
        $Type : 'UI.DataField',
        Value : requestedCapacity
      }
    ]},

    //List Report: Resource request default columns
    LineItem                              : [
      {
        $Type : 'UI.DataField',
        Value : ID,
        ![@HTML5.CssDefaults] : {width : '12rem'}
      },
      {
        $Type : 'UI.DataField',
        Value : name
      },
      {
        $Type : 'UI.DataField',
        Value : startDate
      },
      {
        $Type : 'UI.DataField',
        Value : endDate
      },
      {
        $Type : 'UI.DataField',
        Value : priority_code
      },
      {
        $Type : 'UI.DataField',
        Value : releaseStatus_code
      },
      {
        // $Type  : 'UI.DataFieldForAnnotation',
        // Label  : '{i18n>PROCESSOR}',
        // Target : 'processor/@Communication.Contact'
        Label : '{i18n>PROCESSOR}',
        Value : processor
      },
      {
        $Type : 'UI.DataField',
        Value : projectRole_ID
      }
    ],
    /*
    Default sorting on displayId
    */
    PresentationVariant                   : {
      SortOrder      : [{
        Property   : 'displayId',
        Descending : true
      }],
      Visualizations : ['@UI.LineItem']
    }
  }
);
