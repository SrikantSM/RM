using MyResourcesService from '../../myResourcesService';

// Field Level Annotations
annotate MyResourcesService.ManagerProfileData with {
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
annotate MyResourcesService.ManagerProfileData with @(
    Communication: {
        Contact: {
            fn: managerName,
            email: [ { type: #work, address: mangerEmailAddress } ],
            tel: [
                {type : #work, uri : managerMobilePhoneNumber }
            ]
        }
    }
);
