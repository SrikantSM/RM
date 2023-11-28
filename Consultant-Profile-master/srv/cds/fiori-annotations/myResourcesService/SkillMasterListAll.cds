using MyResourcesService from '../../myResourcesService';

// Service (CRUD) Operation Annotation
annotate MyResourcesService.SkillMasterListAll with @(
    Capabilities.SearchRestrictions.Searchable : true
);

// Field Level Annotations
annotate MyResourcesService.SkillMasterListAll with {
    ID
    @(
        UI.Hidden : true,
        ValueList.entity : 'SkillMasterListAll',
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
            Label : '{i18n>VALUE_HELP_SKILL_NAME}',
            FieldControl : #ReadOnly,
        }
    );

    description
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_DESCRIPTION}',
            FieldControl : #ReadOnly,
        }
    );

};

//Mandatory annotation for popover
annotate MyResourcesService.SkillMasterListAll with @(
 UI.HeaderInfo : {
    Title          : {
        $Type : 'UI.DataField'
    }
	}
);

// QuickViewFacets to display Skill Label name and its description
annotate MyResourcesService.SkillMasterListAll with @(
    UI : {
        SelectionFields : [name, description],
        QuickViewFacets : [
            {
                $Type : 'UI.ReferenceFacet',
                Label : ![name],
                Target : '@UI.FieldGroup#SkillQuickView'
            }
        ],

        FieldGroup#SkillQuickView : {
            Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>SKILL_DESCRIPTION}',
                Value : description
            }
        ]}
    }
);
