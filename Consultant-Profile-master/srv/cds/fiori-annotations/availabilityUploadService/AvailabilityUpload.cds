using AvailabilityUploadService from '../../availabilityUploadService';

//Availability upload Field Level Annotations
annotate AvailabilityUploadService.AvailabilityUploadData with {
	resourceId @UI.Hidden : true;

    name
    // Removed search annotation to avoid CAP warnings
    // for localized field as the field was concatenated 
    @( Common: {Label : '{i18n>NAME}'} );

	firstName
    @Search.defaultSearchElement : true
	@( Common: {Label : '{i18n>FIRST_NAME}'} );

	lastName
    @Search.defaultSearchElement : true
    @( Common: {Label : '{i18n>LAST_NAME}'} );

	resourceOrg
	@Search.defaultSearchElement : true
	@Common : {
        Label : '{i18n>RESOURCE_ORGANIZATION}',
        FieldControl : #ReadOnly,
        ValueList : {
            CollectionPath  : 'AvailabilityResourceOrg',
            Parameters      : [
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'resourceOrgId'
            },
			{
                $Type             : 'Common.ValueListParameterInOut',
				LocalDataProperty :  resourceOrg,
                ValueListProperty : 'resourceOrg'
            }]
        },
    };

	costCenterId
	@( Common: {Label : '{i18n>COSTCENTER_ID}'} );

	resourceOrgId
	@( Common: {Label : '{i18n>RESOURCE_ORGANIZATIONID_TEXT}'} );

	s4CostCenterId
	@Search.defaultSearchElement : true
    @( Common:
     	{
     		Label : '{i18n>COST_CENTER}'
     	},
		ValueList : {
			 entity          : 'AvailabilityCostCenter',
			 SearchSupported : 'true',
			 Parameters      : [
				 {
					 $Type             : 'Common.ValueListParameterInOut',
					 LocalDataProperty : s4CostCenterId,
					 ValueListProperty : 'costCenterID'
				 }
			 ]
		}
    );

	costCenterDisplay
	@Search.defaultSearchElement : true
    @( Common:
     	{
     		Label : '{i18n>COST_CENTER}'
     	},
		ValueList : {
			 entity          : 'AvailabilityCostCenterDisplay',
			 SearchSupported : 'true',
			 Parameters      : [
				 {
					 $Type             : 'Common.ValueListParameterInOut',
					 LocalDataProperty : costCenterDisplay,
					 ValueListProperty : 'costCenterDisplay'
				 }
			 ]
		}
    );

    workForcePersonExternalId
    @Search.defaultSearchElement : true
    @( Common:
    	{
			Label : '{i18n>L_WORKFORCE_PERSON_ID}'
		},
		ValueList : {
			 entity          : 'AvailabilityWorkForcePersonID',
			 SearchSupported : 'true',
			 Parameters      : [
				 {
					 $Type             : 'Common.ValueListParameterInOut',
					 LocalDataProperty : 'workForcePersonExternalId',
					 ValueListProperty : 'workForcePersonExternalId'
				 }
			 ]
		}
	);

    workAssignmentExternalId
    @Search.defaultSearchElement : true
    @( Common: {Label : '{i18n>WORKASSIGNMENT_ID}'} );

	workAssignmentStartDate
	@( Common: {Label : '{i18n>WORKASSIGNMENT_STARTDATE}'} );

	workAssignmentEndDate
	@( Common: {Label : '{i18n>WORKASSIGNMENT_ENDDATE}'} );

	isBusinessPurposeCompleted
	@( Common: {Label : '{i18n>MARKEDFORDELETION}'},
				FilterDefaultValue: false // FilterDefaultValue available from UI5 1.85 onwards
	);

    availabilitySummaryStatus_code
    @(Common: {Label : '{i18n>STATUS_CODE}'});

    availabilitySummaryStatus
    @UI.Hidden : true
    @title     : '{i18n>L_AVAILABILITY_STATUS}';

	minDate
    @title: '{i18n>CHART_MIN_DATE}';

	maxLimitDate
    @title : '{i18n>CHART_MAX_DATE}';

	requiredDays
    @title: '{i18n>REQUIRED_AVAILABILE_DAYS}';
	
    availableDays
    @title: '{i18n>AVAILABILE_DAYS}';

	isContingentWorker @UI.Hidden : true;

	workerTypeName
	@Search.defaultSearchElement : true
	@Common : {
        Label : '{i18n>WORKER_TYPE}',
        ValueListWithFixedValues : true,
        FieldControl : #ReadOnly,
        ValueList : {
            CollectionPath  : 'WorkerType',
            Parameters      : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty :  workerTypeName,
                ValueListProperty : 'name'
            }]
        },
    };
};

//availabilitySummary Status
annotate AvailabilityUploadService.AvailabilitySummaryStatus with {
  code
  	@Common: {
  	Label : '{i18n>STATUS}',
  	FieldControl : #ReadOnly,
  	Text         : {
       $value                : name,
       ![@UI.TextArrangement] : #TextOnly
      },
      ValueList                : {entity : 'AvailabilitySummaryStatus'},
      ValueListWithFixedValues : true
	};
	name @UI.Hidden : true
};

//Availability upload Field Level Annotations
annotate AvailabilityUploadService.AvailabilityUploadErrors with {
	resourceId 				 @UI.Hidden : true;
	s4costCenterId           @UI.Hidden : true;
	workAssignmentExternalId @UI.Hidden : true;
	availabilityErrorMessage @UI.Hidden : true;
	errorMessage 			 @UI.Hidden : true;
	errorParam1              @UI.Hidden : true;
	errorParam2              @UI.Hidden : true;
	errorParam3              @UI.Hidden : true;
	errorParam4              @UI.Hidden : true;
	invalidKeys              @UI.Hidden : true;
};

annotate AvailabilityUploadService.AvailabilityUploadErrors with @(
  UI: {
    //Fields to be shown on List
    LineItem: [
      { Value : csvRecordIndex, Label : '{i18n>RECORD_NUMBER}' },
	  { Value : startDate, Label: '{i18n>DATE}'},
	  { Value : error_desc, Label : '{i18n>MESSAGE}' },
    ]
  }
);

// Availability Upload Errors Field Level annotations
annotate AvailabilityUploadService.AvailabilityUploadErrors with {
    csvRecordIndex          @Common : {
        Label        : '{i18n>RECORD_NUMBER}'
	};
    startDate               @Common : {
        Label        : '{i18n>DATE}'
	};
	error_desc               @Common : {
        Label        : '{i18n>MESSAGE}'
	};
}

// Availability upload List Report
annotate AvailabilityUploadService.AvailabilityUploadData with @(
	Capabilities.SearchRestrictions.Searchable: true,
    UI : {
    	SelectionFields: [ workerTypeName, resourceOrg, workForcePersonExternalId, s4CostCenterId, availabilitySummaryStatus.code ],
		LineItem : [
		  {$Type: 'UI.DataFieldForIntentBasedNavigation', Label: '{i18n>BUTTON_LABEL_DOWNLOAD}',
        			SemanticObject: 'availabilityUpload', Action: 'Download', RequiresContext: false},
		  {$Type: 'UI.DataFieldForIntentBasedNavigation', Label: '{i18n>BUTTON_LABEL_UPLOAD}',
			SemanticObject: 'availabilityUpload', Action: 'Upload', RequiresContext: false},
		  { Value : name, 						Label : '{i18n>NAME}' },
		  { Value : workerTypeName, 			Label : '{i18n>WORKER_TYPE}' },
		  { Value : resourceOrg, 				Label : '{i18n>RESOURCE_ORGANIZATION}' },
		  { Value : costCenterDisplay, 			Label : '{i18n>COST_CENTER}' },
		  { Value : workForcePersonExternalId, 	Label : '{i18n>L_WORKFORCE_PERSON_ID}' },
		  { Value : workAssignmentExternalId, 	Label : '{i18n>WORKASSIGNMENT_ID}' },
		  { $Type :'UI.DataField', Value: availabilitySummaryStatus.code, Label: '{i18n>STATUS}',
			  Criticality: availabilitySummaryStatus.criticality, CriticalityRepresentation:#WithoutIcon},
          { $Type  : 'UI.DataFieldForAnnotation', Label  : '{i18n>TOTAL_UPLOAD_STATUS}', ID : 'OverallUploadStatus',
          Target : '@UI.Chart#OverallUploadStatusChart' }
		],

		PresentationVariant  : {
			Visualizations : ['@UI.LineItem'],
			RequestAtLeast : [
				workAssignmentStartDate,
				workAssignmentEndDate
			]
		}
	}
);

// Avaiablity capacity chart
annotate AvailabilityUploadService.AvailabilityPeriodicCount with @(    
    Aggregation.ApplySupported:
     {
         $Type : 'Aggregation.ApplySupportedType',
         Transformations : [
             'aggregate',
             'groupby',
             'filter',
             'expand'
         ],
		 AggregatableProperties: [{ 
			Property: dayCount,
		}]
     },
     Analytics.AggregatedProperty #availableNoOfDays :
         {
             Name : 'availableNoOfDays',
             AggregationMethod : 'sum',
             AggregatableProperty : 'dayCount',
             ![@Common.Label] : '{i18n>NUMBER_OF_DAYS}'
         },   
    UI : {
        PresentationVariant: {
        Visualizations : ['@UI.Chart']		
        },
        Chart : {
            Title : '{i18n>DATA_UPLOADED_FOR_YEAR}',
            ChartType : #Column,
            Dimensions :
            [
                YEAR,
				CALMONTH                
            ],
            DynamicMeasures : ['@Analytics.AggregatedProperty#availableNoOfDays'],
			DimensionAttributes : [
			{
                $Type     : 'UI.ChartDimensionAttributeType',
                Dimension : CALMONTH,
                Role      : #Category
            },
			{
                $Type     : 'UI.ChartDimensionAttributeType',
                Dimension : YEAR,
                Role      : #Category
            }
			]    
        }
    }
);

  annotate AvailabilityUploadService.AvailabilityPeriodicCount with {
      dayCount              @Aggregation.Aggregatable : true;
	  CALMONTH				@Aggregation.Groupable : true 
	  @Common: {
		Label : '{i18n>MONTH}',
		FieldControl : #ReadOnly,
		Text         : {
			$value                : monthYear,
			![@UI.TextArrangement] : #TextOnly
			}
		};
	  monthYear @UI.Hidden : true;
      YEAR                  @Aggregation.Groupable : true @Common.FieldControl : #ReadOnly @Common.Label: '{i18n>YEAR}';
};

//Employee Availability Data Object Page
annotate AvailabilityUploadService.AvailabilityUploadData with @(
    UI : {
	    	HeaderInfo: {
	      		TypeName: '{i18n>AVAILABILITY_DETAIL}',
				TypeNamePlural: '{i18n>WORKFORCE_PERSONS}',
	      		Title: {Value: name}
	    	},
			HeaderFacets: [
				{$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData1'},
            	{$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData2'},
				{$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Status'},
            	{$Type: 'UI.ReferenceFacet', Target : '@UI.Chart#OverallUploadStatusChart' }
            	],
			FieldGroup#AdministrativeData1: {
				Data: [
				{$Type: 'UI.DataField', Label:'{i18n>RESOURCE_ORGANIZATION}', Value: resourceOrg},
				{$Type: 'UI.DataField', Label:'{i18n>COST_CENTER}', Value: costCenterDisplay}
				]
            },
			FieldGroup#AdministrativeData2: {
			Data: [
				{$Type: 'UI.DataField', Label:'{i18n>L_WORKFORCE_PERSON_ID}', Value: workForcePersonExternalId},
				{$Type: 'UI.DataField', Label:'{i18n>WORKASSIGNMENT_ID}', Value: workAssignmentExternalId}
				]
			},
			FieldGroup#Status: {
			Data: [
				{$Type: 'UI.DataField', Label:'{i18n>STATUS}', Value: availabilitySummaryStatus.code,
                	Criticality: availabilitySummaryStatus.criticality, CriticalityRepresentation:#WithoutIcon}
				]
			},
			
			//Availability Error
			Facets : [
				{ $Type : 'UI.ReferenceFacet', Label : '{i18n>DATA_UPLOADED}', Target : 'availabilityPeriodicCount/@UI.PresentationVariant' },
				{ $Type : 'UI.ReferenceFacet', Label : '{i18n>ERRORS}', Target : 'availabilityUploadErrors/@UI.LineItem' }
			]
	}
);

annotate AvailabilityUploadService.AvailabilityUploadData with @(
	UI : {
			Chart#OverallUploadStatusChart : {
			$Type : 'UI.ChartDefinitionType',
			Description   : '{i18n>TOTAL_UPLOAD_STATUS}',
			ChartType : #Donut,
			Measures : [
				uploadDataPercentage
			],
			MeasureAttributes : [
				{
					$Type : 'UI.ChartMeasureAttributeType',
					Measure : uploadDataPercentage,
					Role : #Axis1,
					DataPoint : '@UI.DataPoint#OverallUploadStatus'
				}
			]
			},
			//Donut Indicator:
			DataPoint#OverallUploadStatus : {
				Title         : '{i18n>TOTAL_UPLOAD_STATUS}',
				Value         : uploadDataPercentage,
				TargetValue   : 100,
				CriticalityCalculation : {
					ImprovementDirection: #Target,					
					DeviationRangeLowValue: 60,
					ToleranceRangeLowValue: 80,
					ToleranceRangeHighValue: 110,
					DeviationRangeHighValue: 120,
				}
			}
	}
);
//COST_CENTER Field Level Annotations
annotate AvailabilityUploadService.AvailabilityCostCenter with {
    costCenterID
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>COST_CENTER}',
        }
    );
	description
  	@Common : {Label : '{i18n>VALUE_HELP_COSTCENTER_DESCRIPTION}' };
};

annotate AvailabilityUploadService.AvailabilityCostCenterDisplay with {
    costCenterDisplay
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>COST_CENTER}',
        }
    );
};

//workForcePersonExternalId Field Level Annotations
annotate AvailabilityUploadService.AvailabilityWorkForcePersonID with {
    workForcePersonExternalId
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>L_WORKFORCE_PERSON_ID}',
        }
    );
	isBusinessPurposeCompleted @UI.Hidden : true;
};

annotate AvailabilityUploadService.WorkerType with {
	name
	@Search.defaultSearchElement : true
	@(
        Common : {
            Label        : '{i18n>WORKER_TYPE}',
        }
    );
	isContingentWorker @UI.Hidden : true;
	descr @UI.Hidden : true;
};

//Resource organization Field Level Annotations
annotate AvailabilityUploadService.AvailabilityResourceOrg with {
    resourceOrgId
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>RESOURCE_ORGANIZATION_ID}',
        }
    );
	resourceOrg
	@Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>RESOURCE_ORGANIZATION_NAME}',
        }
    );
};
