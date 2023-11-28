using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.ResourceRequests with {
  createdAt                   @UI.Hidden       : true;
  createdBy                   @UI.Hidden       : true;
  modifiedAt                  @UI.Hidden       : true;
  modifiedBy                  @UI.Hidden       : true;
  startTime                   @UI.Hidden       : true;
  endTime                     @UI.Hidden       : true;
  resourceKind                @UI.Hidden       : true;
  requestedCapacityInMinutes  @UI.Hidden       : true;
  effortDistributionType_code @UI.Hidden       : true;
  isResolved                  @UI.Hidden       : true;
  isS4Cloud                   @UI.Hidden       : true;
  isS4CloudNegation           @UI.Hidden       : true;
  resourceRequest_ID          @UI.Hidden       : true;
  resource_ID                 @UI.Hidden       : true;
  referenceObjectFieldControl @UI.Hidden       : true;

  referenceObjectType
                              @Common          : {
    Label     :  '{i18n>REFERENCE_OBJECT_TYPE}',
    FieldControl             : #Mandatory,
    Text                     : {
      $value              : referenceObjectType.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueList                : {
      CollectionPath               : 'ReferenceObjectType',
      Parameters                   : [
        {
          $Type             : 'Common.ValueListParameterInOut',
          LocalDataProperty : 'referenceObjectType_code',
          ValueListProperty : 'code',
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name',
        }
      ]
    },
    ValueListWithFixedValues : true
  };

  referenceObject
                              @Common          : {
    Label        : '{i18n>REFERENCE_ID}',
    FieldControl             : referenceObjectFieldControl,
    Text                     : {
      $value              : referenceObject.displayId,
      @UI.TextArrangement : #TextOnly
    },
    ValueListForValidation: '',
    ValueList                : {
      CollectionPath               : 'ReferenceObject',
      Parameters                   : [
        {
          $Type             : 'Common.ValueListParameterInOut',
          LocalDataProperty : 'referenceObject_ID',
          ValueListProperty : 'ID', // This has a text arranegement to ID
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'displayId',
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name',
        },
        {
          $Type : 'Common.ValueListParameterIn', //Input parameter used for filtering
          LocalDataProperty : 'referenceObjectType_code',
          ValueListProperty : 'typeCode_code',
        }
      ]
    }
  };

  ID
                              @(Common : {
    Label : '{i18n>REQUEST_ID}',
    Text  : {
      $value              : displayId,
      @UI.TextArrangement : #TextOnly
    }
  })
                              @UI.HiddenFilter : true;
  demand
                              @Common          : {
    Label        : '{i18n>DEMAND}',
    FieldControl : #Mandatory,
    Text         : {
      $value              : demand.billingRoleName,
      @UI.TextArrangement : #TextOnly
    },
    ValueList    : {
      CollectionPath  : 'Demands',
      Label           : '{i18n>DEMAND}',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'demand_ID',
          ValueListProperty : 'ID'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'billingRoleName'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'workPackageName'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'projectName'
        },
      ]
    }
  };
  project
                              @Common          : {
    Label        : '{i18n>PROJECT_NAME}',
    FieldControl : #ReadOnly,
    Text         : {
      $value              : project.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueList    : {
      CollectionPath  : 'Projects',
      Label           : '{i18n>PROJECT_NAME}',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'project_ID',
          ValueListProperty : 'ID'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'customer_ID'
        }
      ]
    }
  };
  workpackage
                              @Common          : {
    Label     : '{i18n>WORKPACKAGE_NAME}',
    Text      : {
      $value              : workpackage.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueList : {
      CollectionPath  : 'WorkPackages',
      Label           : '{i18n>WORKPACKAGE_NAME}',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'workpackage_ID',
          ValueListProperty : 'ID'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name'
        },
      ]
    }
  };
  priority
                              @Common          : {
    Label                    : '{i18n>REQUEST_PRIORITY}',
    FieldControl             : #ReadOnly,
    Text                     : {
      $value              : priority.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueList                : {
      CollectionPath               : 'Priorities',
      Parameters                   : [
        {
          $Type             : 'Common.ValueListParameterInOut',
          LocalDataProperty : 'priority_code',
          ValueListProperty : 'code',
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name',
        }
      ],
      PresentationVariantQualifier : 'sortbycode'
    },
    ValueListWithFixedValues : true
  };
  requestStatus
                              @Common          : {
    Label                    : '{i18n>REQUEST_STATUS}',
    FieldControl             : #ReadOnly,
    Text                     : {
      $value              : requestStatus.description,
      @UI.TextArrangement : #TextOnly
    },
    ValueListWithFixedValues : true
  };
  releaseStatus
                              @Common          : {
    Label                    : '{i18n>PUBLISHING_STATUS}',
    FieldControl             : #ReadOnly,
    Text                     : {
      $value              : releaseStatus.description,
      @UI.TextArrangement : #TextOnly
    },
    ValueListWithFixedValues : true
  };
  startDate
                              @Common          : {
    Label        : '{i18n>START_TIME}',
    FieldControl : #ReadOnly,
  };
  endDate
                              @Common          : {
    Label        : '{i18n>END_TIME}',
    FieldControl : #ReadOnly,
  };
  workItemName
                              @Common          : {
    Label : '{i18n>WORKITEM_NAME}'
  };
  projectRole
                              @Common          : {
    Label        : '{i18n>PROJECTROLE_NAME}',
    FieldControl : #ReadOnly,
    Text         : {
      $value              : projectRole.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueList    : {
      CollectionPath  : 'ProjectRoles',
      Label           : '{i18n>PROJECTROLE_NAME}',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'code'
        },
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'projectRole_ID',
          ValueListProperty : 'ID' // This has a text arranegement to project role name
        }
      ]
    },
  };

  requestedResourceOrg
                              @Common          : {
    Label        : '{i18n>REQUESTED_RESOURCE_ORGANIZATION}',
    Text         : {
      $value              : requestedResourceOrg.name,
      @UI.TextArrangement : #TextOnly
    },
    FieldControl : #Mandatory,
    ValueList    : {
      CollectionPath  : 'UnrestrictedResourceOrganizationsConsumption',
      Label           : '{i18n>REQUESTED_RESOURCE_ORGANIZATION}',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'requestedResourceOrg_ID',
          ValueListProperty : 'ID'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'description'
        }
      ]
    },
  };

  processingResourceOrg
                              @Common          : {
    Label        : '{i18n>PROCESSING_RESOURCE_ORGANIZATION}',
    Text         : {
      $value              : processingResourceOrg.name,
      @UI.TextArrangement : #TextOnly
    },
    FieldControl : #Mandatory,
    ValueList    : {
      CollectionPath  : 'UnrestrictedResourceOrganizationsConsumption',
      Label           : '{i18n>PROCESSING_RESOURCE_ORGANIZATION}',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'processingResourceOrg_ID',
          ValueListProperty : 'ID'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'description'
        }
      ]
    },
  };

  resourceManager
                              @Common          : {Label : '{i18n>RESOURCE_MANAGER}'

  };
  processor
                              @Common          : {Label : '{i18n>PROCESSOR}'

  };
  @Measures.Unit : requestedUnit
  requestedCapacity
                              @Common          : {
    Label        : '{i18n>REQUIRED_EFFORTS}',
    FieldControl : #ReadOnly,
  };
  requestedUnit
                              @Common          : {FieldControl : #ReadOnly}
                              @UI.Hidden       : true;
  description
                              @Common.Label    : '{i18n>DESCRIPTION}'
                              @UI.HiddenFilter : true
                              @UI.MultiLineText;
  name
                              @Common          : {Label : '{i18n>REQUEST_NAME}'};
  displayId
                              @Common          : {Label : '{i18n>REQUEST_ID}'};
};

annotate ProcessResourceRequestService.ResourceRequests actions {
  setMyResponsibilityResourceRequest(processor @UI.ParameterDefaultValue : true
                                               @Common                   : {
    Label                    : '{i18n>AS_PROCESSOR}',
    ValueListWithFixedValues : true
  }, resourceManager  @UI.ParameterDefaultValue : true
                                               @Common                   : {
    Label                    : '{i18n>AS_RESOURCE_MANAGER}',
    ValueListWithFixedValues : true
  }
  );

  @cds.odata.bindingparameter.name : '_it'
  forwardResourceRequest(
  @UI.ParameterDefaultValue        : _it.processingResourceOrg.name
  processingResourceOrg_ID
                                               @Common                   : {
    Label     : '{i18n>FORWARD_TO}',
    Text      : {
      $value              : processingResourceOrg.description,
      @UI.TextArrangement : #TextOnly
    },
    ValueList : {
      Label           : '{i18n>PROCESSING_RESOURCE_ORGANIZATION}',
      CollectionPath  : 'UnrestrictedResourceOrganizationsConsumption',
      SearchSupported : true,
      Parameters      : [
        {
          $Type             : 'Common.ValueListParameterOut',
          LocalDataProperty : 'processingResourceOrg_ID',
          ValueListProperty : 'ID'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name'
        },
        {
          $Type             : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'description'
        }
      ]
    }
  },
                                               @UI.ParameterDefaultValue : _it.requestedResourceOrg.name
  requestedResourceOrg_ID
                                               @Common                   : {
    Label        : '{i18n>REQUESTED_RESOURCE_ORGANIZATION}',
    FieldControl : #ReadOnly
  }
  );
}
