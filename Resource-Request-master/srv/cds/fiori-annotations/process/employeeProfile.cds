using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.EmployeeProfiles with {
    ID
                      @UI.Hidden : true
                      @Common : {
        Label        : '{i18n>ID}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    workerExternalID  @Common : {Label : '{i18n>ID}'};
    name
                      @Common : {
        Label        : '{i18n>NAME}',
        FieldControl : #ReadOnly
    };
    emailAddress      @UI.Hidden : true;
    mobilePhoneNumber @UI.Hidden : true;
    role              @UI.Hidden : true;
    managerExternalID @UI.Hidden : true;
    officeLocation    @UI.Hidden : true;
    deliveryOrg       @UI.Hidden : true;
};

annotate ProcessResourceRequestService.EmployeeProfiles with @(Communication : {Contact : {fn : name}});