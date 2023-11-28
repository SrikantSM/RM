using MyProjectExperienceService from '../../myProjectExperienceService';

// Service (CRUD) Operation Annotation
annotate MyProjectExperienceService.ProfileData with @(
    Capabilities.SearchRestrictions.Searchable : true
);

// Field Level Annotations
annotate MyProjectExperienceService.ProfileData with {
    ID
    @UI.Hidden : true;

    workerExternalID
    @Common.FieldControl : #ReadOnly;

    name
    @Search.defaultSearchElement : true
    @Common.FieldControl : #ReadOnly;

    emailAddress
	@Communication.IsEmailAddress: 'true'
    @Search.defaultSearchElement : true
     @(
        Common : {
            Label        : '{i18n>O_EMAIL}',
            FieldControl : #ReadOnly
        }
    );

    mobilePhoneNumber
	@Communication.IsPhoneNumber: 'true'
    @Common.FieldControl : #ReadOnly;

    officeLocation
    @Common.FieldControl : #ReadOnly;

    role
    @Common.FieldControl : #ReadOnly;

    managerExternalID
    @Common.FieldControl : #ReadOnly;

    resourceOrg
    @Common.FieldControl : #ReadOnly;

    costCenter
    @( Common: 
        { 
            FieldControl : #ReadOnly,
            Text  : costCenterDescription,
            TextArrangement : #TextFirst,
        }
    );
}
