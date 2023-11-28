using ManageResourceRequestService from '../../services/manage';

@cds.search: {code, name}
annotate ManageResourceRequestService.ProjectRoles with {
    ID
@UI.HiddenFilter: true
@Common : {
        Label        : '{i18n>PROJECTROLE_NAME}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    code
@Common                      : {Label : '{i18n>CODE}'};
    name
@Common : {
        Label        : '{i18n>PROJECTROLE_NAME}',
        FieldControl : #ReadOnly,
    };
    description
@UI.Hidden                   : true;
    roleLifecycleStatus_code
@UI.Hidden                   : true;
};
