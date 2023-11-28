using MyProjectExperienceService from '../../myProjectExperienceService';

// Field Level Annotations
annotate MyProjectExperienceService.ManagerProfileData with {
    ID
    @UI.Hidden : true;

    emailAddress
    @Search.defaultSearchElement : true
     @(
        Common : {
            Label        : '{i18n>O_EMAIL}',
            FieldControl : #ReadOnly
        }
    );

    managerExternalID
    @Common.FieldControl : #ReadOnly;

}

// Manager's ContactCard Annotation
annotate MyProjectExperienceService.ManagerProfileData with @(
    Communication: {
        Contact: {
            fn: managerName,
            email: [ { type: #work, address: mangerEmailAddress } ],
            tel: [
                {type : #cell, uri : managerMobilePhoneNumber }
            ]
        }
    }
);
