using MyResourcesService from '../../myResourcesService';

// Service (CRUD) Operation Annotation
annotate MyResourcesService.RoleValueHelpList with @(
    Capabilities.SearchRestrictions.Searchable : true
);

// Field Level Annotations
annotate MyResourcesService.RoleValueHelpList with {
    ID
    @(
        UI.Hidden : true,
        ValueList.entity : 'RoleValueHelpList',
        Common : {
            FieldControl : #ReadOnly,
            Text : {
                $value : name,
                ![@UI.TextArrangement] : #TextOnly
            }
        }
    );

    name
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_ROLE_NAME}',
            FieldControl : #ReadOnly,
        }
    );

    code
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_ROLE_CODE}',
            FieldControl : #ReadOnly
        }
    );

    description
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_ROLE_DESCRIPTION}',
            FieldControl : #ReadOnly
        }
    );

    roleLifecycleStatus_code @UI.Hidden: true;
};

