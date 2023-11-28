using MyProjectExperienceService from '../../myProjectExperienceService';

// Service (CRUD) Operation Annotation
annotate MyProjectExperienceService.SkillMasterListAll with @(
    Capabilities.SearchRestrictions.Searchable : true
);

// Field Level Annotations
annotate MyProjectExperienceService.SkillMasterListAll with {
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
annotate MyProjectExperienceService.SkillMasterListAll with @(
 UI.HeaderInfo : {
    Title          : {
        $Type : 'UI.DataField'
    }
	}
);

// QuickViewFacets to display Skill Label name and its description
annotate MyProjectExperienceService.SkillMasterListAll with @(
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
