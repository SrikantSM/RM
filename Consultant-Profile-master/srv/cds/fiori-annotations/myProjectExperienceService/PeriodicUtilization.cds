using MyProjectExperienceService from '../../myProjectExperienceService';

// ADd temp periodic availability to serve chart
annotate MyProjectExperienceService.PeriodicUtilization with @(    
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
          Property: utilizationPercentage,
          }
        ]
     },
     Analytics.AggregatedProperty #utilizationPercentage : {
        Name                 : 'maxUtilization',
        AggregationMethod    : 'max',
        AggregatableProperty : 'utilizationPercentage',
        ![@Common.Label]     : '{i18n>UTILIZATION}'
    },  
    UI : {
        PresentationVariant: {
        Visualizations : ['@UI.Chart']
        },
        Chart : {
            Title : '{i18n>UTILIZATION_CHART}',
            ChartType : #Line,
            Dimensions : [CALMONTH],
            DynamicMeasures     : ['@Analytics.AggregatedProperty#utilizationPercentage'],
            DimensionAttributes : [{
                $Type     : 'UI.ChartDimensionAttributeType',
                Dimension : CALMONTH,
                Role      : #Category
            }]    

        }
    }
);

  annotate MyProjectExperienceService.PeriodicUtilization with {
    utilizationPercentage   @Aggregation.Aggregatable : true @Common.Label: '{i18n>UTILIZATION}'; 
    monthYear               @UI.Hidden : true;
    CALMONTH				@Aggregation.Groupable : true 
	  @Common: {
		Label : '{i18n>MONTH}',
		FieldControl : #ReadOnly,
		Text         : {
			$value                : monthYear,
			![@UI.TextArrangement] : #TextOnly
			}
		};
};
