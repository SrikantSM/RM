using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.Staffing with {
  startDate
  @Common        : {FieldControl : #ReadOnly};

  assignmentStatus
  @Common        : {
    Label                    : '{i18n>ASST_STAT}',
    FieldControl             : #ReadOnly,
    Text                     : {
      $value              : assignmentStatus.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueList                : {
      CollectionPath               : 'AssignmentStatus',
      Parameters                   : [
        {
          $Type             : 'Common.ValueListParameterInOut',
          LocalDataProperty : 'assignmentStatus_code',
          ValueListProperty : 'code',
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name',
        }
      ],
      PresentationVariantQualifier : 'sortByAsstStatusCode'
    },
    ValueListWithFixedValues : true
  };

  endDate
  @Common        : {FieldControl : #ReadOnly};

  bookedCapacity
  @Measures.Unit : bookedCapacityUnit
  @Common        : {FieldControl : #ReadOnly};

  workerTypeName
  @Common        : {
    Label        : '{i18n>WORKER_TYPE}',
    FieldControl : #ReadOnly,
  };
}

annotate ProcessResourceRequestService.Staffing with @(UI : {
  HeaderInfo                       : {TypeNamePlural : '{i18n>ASSIGNED_RESOURCES}'},

  FieldGroup #EditDeleteAssignment : {Data : [
    {
      $Type      : 'UI.DataFieldForAction',
      Label      : '{i18n>UPDATE_ASSIGNMENT}',
      Action     : 'ProcessResourceRequestService.ChangeAssignment',
      @UI.Hidden : isAssignmentNotDeletable
    },
    {
      $Type      : 'UI.DataFieldForAction',
      Label      : '{i18n>DELETE_ASSIGNMENT}',
      Action     : 'ProcessResourceRequestService.DeleteAssignment',
      @UI.Hidden : isAssignmentNotDeletable
    }
  ]},

  LineItem                         : [
    {
      $Type : 'UI.DataField',
      Value : workerTypeName
    },
    {
      $Type             : 'UI.DataField',
      Label             : '{i18n>ASSIGNMENT_START}',
      Value             : startDate,
      ![@UI.Importance] : #High
    },
    {
      $Type             : 'UI.DataField',
      Label             : '{i18n>ASST_STAT}',
      Value             : assignmentStatus.name,
      ![@UI.Importance] : #High
    },
    {
      $Type : 'UI.DataField',
      Label : '{i18n>ASSIGNMENT_END}',
      Value : endDate
    },
    {
      $Type : 'UI.DataField',
      Label : '{i18n>ASSIGNED}',
      Value : bookedCapacity
    }
  ],
  PresentationVariant              : {
    Visualizations : ['@UI.LineItem'],
    RequestAtLeast : [
      bookedCapacityInHours,
      ResourceDetails.externalID,
      ResourceDetails.fullName,
      ResourceDetails.workerType.name,
      ResourceDetails.role,
      ResourceDetails.firstName,
      ResourceDetails.lastName,
      ResourceDetails.mobilePhoneNumber,
      ResourceDetails.emailAddress,
      ResourceDetails.resourceOrg,
      ResourceDetails.resourceOrgCode,
      ResourceDetails.costCenterDesc,
      ResourceDetails.costCenterID,
      ResourceDetails.resource_ID,
      ResourceDetails.country_name,
      ResourceDetails.workforcePersonID,
      ResourceDetails.initials,
      ResourceDetails.toManager.managerName,
      workforcePersonID,
      initials
    ]
  }
});
