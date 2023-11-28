using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.Staffing with {
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

annotate ManageResourceRequestService.Staffing with @(UI : {
  HeaderInfo          : {
    TypeName       : '{i18n>ASSIGNED_RESOURCES}',
    TypeNamePlural : '{i18n>ASSIGNED_RESOURCES}',
    Title : {
        $Type : 'UI.DataField',
        Value : resourceName
    }
  },
  LineItem            : [
    {
      $Type : 'UI.DataFieldForAction',
      Label : '{i18n>ACCEPT_PROPOSAL}',
      Action : 'ManageResourceRequestService.acceptAssignmentProposal',
      InvocationGrouping: #ChangeSet
    },
    {
      $Type : 'UI.DataFieldForAction',
      Label : '{i18n>REJECT_PROPOSAL}',
      Action : 'ManageResourceRequestService.rejectAssignmentProposal',
      InvocationGrouping: #ChangeSet
    },
    {
      $Type : 'UI.DataField',
      Value : workerTypeName
    },
    {
      $Type : 'UI.DataField',
      Label : '{i18n>ASSIGNMENT_START}',
      Value : startDate
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
    },
    {
      $Type : 'UI.DataField',
      Label : '{i18n>ASST_STAT}',
      Value : assignmentStatus.name
    }
  ],
  PresentationVariant : {
    Visualizations : ['@UI.LineItem'],
    RequestAtLeast : [
      ResourceDetails.externalID,
      ResourceDetails.fullName,
      ResourceDetails.role,
      ResourceDetails.firstName,
      ResourceDetails.lastName,
      ResourceDetails.mobilePhoneNumber,
      ResourceDetails.emailAddress,
      ResourceDetails.resourceOrg,
      ResourceDetails.resourceOrgCode,
      ResourceDetails.costCenterDesc,
      ResourceDetails.costCenterID,
      ResourceDetails.country_name,
      ResourceDetails.workforcePersonID,
      ResourceDetails.initials,
      ResourceDetails.toManager.managerName,
      //ResourceDetails.toProfileData.externalID,
      ResourceDetails.workerType.name,
    ]
  }
});
