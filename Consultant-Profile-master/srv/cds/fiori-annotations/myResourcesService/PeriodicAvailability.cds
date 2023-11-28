using MyResourcesService from '../../myResourcesService';

// ListReport/Facet Annotations

annotate MyResourcesService.PeriodicAvailability with @(
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
annotate MyResourcesService.PeriodicAvailability with {
    ID                      @UI.Hidden: true ;
    monthYear               @Common.FieldControl : #ReadOnly  @UI.Importance : #High;
    bookedCapacity          @Common.FieldControl : #ReadOnly;
    grossCapacity           @Common.FieldControl : #ReadOnly;
    netCapacity             @Common.FieldControl : #ReadOnly;
    utilizationPercentage   @Common.FieldControl : #ReadOnly;
    utilizationColor        @UI.Hidden : true;
    CALMONTH                @title : '{i18n>YEAR_MONTH}';
    workforcePersonID       @UI.Hidden : true;
}
