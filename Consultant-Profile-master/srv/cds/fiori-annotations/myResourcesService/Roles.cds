using MyResourcesService from '../../myResourcesService';

// Field Level Annotations
annotate MyResourcesService.Roles with {
    ID
    @(
        Search.defaultSearchElement : true,
        Common : {
            Text : {
                $value : name,
                ![@UI.TextArrangement] : #TextOnly
            }
        }
    );

    role
    @(
        Common : {
            Text  : {
                $value : role.name,
                ![@UI.TextArrangement] : #TextOnly
            },
            Label : '{i18n>PROJECT_ROLES}',
            // Value list configuration to select the roles
            ValueList : {
                CollectionPath : 'RoleValueHelpList',
                Label: '{i18n>VALUE_HELP_ROLE_TITLE}',
                SearchSupported : true,
                Parameters : [
                    {
                        $Type             : 'Common.ValueListParameterOut',
                        LocalDataProperty : 'role_ID',
                        ValueListProperty : 'ID'
                    },
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'name'
                    },
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'code'
                    },
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'description'
                    },
                ]
            }
        }
    );

}

// Roles Headers Annotation
annotate MyResourcesService.Roles with @(
    UI : {
        HeaderInfo : {
            TypeName : '{i18n>ROLE}',
            TypeNamePlural : '{i18n>ROLES}'
        }
    }
);

// ListReport/Facet Annotations
annotate MyResourcesService.Roles with @(
    UI : {
        SelectionFields: [ role_ID ],
        LineItem : [
            { Value : role_ID, Label : '{i18n>ROLE_NAME}' }
        ]
    }
);
