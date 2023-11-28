using MyProjectExperienceService from '../../myProjectExperienceService';

// Field Level Annotation
annotate MyProjectExperienceService.Utilization with {

    ID
    @UI.Hidden : true;

    YEAR
    @UI.Hidden : true;

    yearlyUtilization
    @Common.FieldControl : #ReadOnly
    @(title:' ')
    @( Measures.Unit: '%' );

    utilizationColor
    @Common.FieldControl : #ReadOnly;

    workforcePersonID
    @UI.Hidden : true;

};
