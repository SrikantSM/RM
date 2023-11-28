using ProcessResourceRequestService from '../../services/process';

@cds.search: {ID, code, name}
annotate ProcessResourceRequestService.ProjectRoles with {
    ID
    @UI.HiddenFilter                   : true
    @Common : {
        Label        : '{i18n>PROJECTROLE_NAME}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    code
    @Common: {Label : '{i18n>CODE}'};
    name
    @Common : {
        Label        : '{i18n>PROJECTROLE_NAME}',
        FieldControl : #ReadOnly,
    };
    
    description
    @UI.Hidden: true;
    
    roleLifecycleStatus
    @UI.HiddenFilter : true;
    
    roleLifecycleStatus_code
    @UI.HiddenFilter : true;
};
