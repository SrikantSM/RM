using MyResourcesService from '../../myResourcesService';

// Service (CRUD) Operation Annotation
annotate MyResourcesService.RoleMasterList with @(
    Capabilities.SearchRestrictions.Searchable : true
);

// Field Level Annotations
annotate MyResourcesService.RoleMasterList with {
    ID
    @(
        UI.Hidden : true,
        ValueList.entity : 'RoleMasterList',
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

    )


};

//Mandatory annotation for popover
annotate MyResourcesService.RoleMasterList with @(
 UI.HeaderInfo : {
    Title          : {
        $Type : 'UI.DataField'
    }
	}
);

//QuickViewFacets
annotate MyResourcesService.RoleMasterList with @(
    UI : {
        SelectionFields : [name, code, description],
        QuickViewFacets : [
            {
            $Type  : 'UI.ReferenceFacet',
            Label : ![name],
            Target : '@UI.FieldGroup#PreviousRolesQuickView'
            }
        ],

        FieldGroup #PreviousRolesQuickView : {
            Data : [
                {
                    $Type : 'UI.DataField',
                    Label : '{i18n>PREVIOUS_ROLES_CODE}',
                    Value : code
                },
                {
                    $Type : 'UI.DataField',
                    Label : '{i18n>PREVIOUS_ROLES_DESCRIPTION}',
                    Value : description
                }
            ]
        }
    }
);
