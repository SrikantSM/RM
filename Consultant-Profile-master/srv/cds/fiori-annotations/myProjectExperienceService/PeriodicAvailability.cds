using MyProjectExperienceService from '../../myProjectExperienceService';

// ListReport/Facet Annotations

annotate MyProjectExperienceService.PeriodicAvailability with @(
    UI : {
        HeaderInfo : {
            TypeNamePlural : '{i18n>NEXT_6_MONTHS}'
        },
        LineItem : [
            {  $Type : 'UI.DataField', Value : monthYear,             Label : '{i18n>MONTH}'},
            {  $Type : 'UI.DataField', Value : grossCapacity,         Label : '{i18n>AVAILABLE}' },
            {  $Type : 'UI.DataField', Value : bookedCapacity,        Label : '{i18n>ASSIGNED}' },
            {  $Type : 'UI.DataField', Value : netCapacity,           Label : '{i18n>FREE}' },
            {  Value : utilizationPercentage, Label : '{i18n>UTILIZATION}',
            Criticality : utilizationColor, CriticalityRepresentation:#WithoutIcon }
        ]
    }
);

// Field Level annotations
annotate MyProjectExperienceService.PeriodicAvailability with {
    ID                      @UI.Hidden: true ;
    monthYear               @Common : {
        Label        : '{i18n>MONTH}',
        FieldControl : #ReadOnly,
    }  @UI.Importance : #High;
    bookedCapacity          @Common : {
        Label        : '{i18n>ASSIGNED}',
        FieldControl : #ReadOnly,
    };
    grossCapacity           @Common : {
        Label        : '{i18n>AVAILABLE}',
        FieldControl : #ReadOnly,
    };
    netCapacity             @Common : {
        Label        : '{i18n>FREE}',
        FieldControl : #ReadOnly,
    };
    utilizationPercentage   @Common : {
        Label        : '{i18n>UTILIZATION}',
        FieldControl : #ReadOnly,
    };
    utilizationColor        @UI.Hidden : true;
    CALMONTH                @title : '{i18n>YEAR_MONTH}';
    workforcePersonID       @UI.Hidden : true;
}
