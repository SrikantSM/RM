using MyResourcesService from '../../myResourcesService';

// Field Level Annotations
annotate MyResourcesService.Skills with {
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

    skill
    @(
        Common : {
            // SemanticObject : ![SkillAdditionalInfo],
            Text : {
                $value : skill.name,
                ![@UI.TextArrangement] : #TextOnly
            },
            Label : '{i18n>VALUE_HELP_SKILL_TITLE}',
            // Value list configuration to select the skill label and description
            ValueList : {
                CollectionPath : 'SkillMasterList',
                Label: '{i18n>VALUE_HELP_SKILL_TITLE}',
                SearchSupported : true,
                Parameters : [
                    {
                        $Type             : 'Common.ValueListParameterOut',
                        LocalDataProperty : 'skill_ID',
                        ValueListProperty : 'ID'
                    },
                    // Displaying multiple column for Value Help
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'name'
                    },
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'description'
                    },
					{
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'commaSeparatedAlternativeLabels'
                    },
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'commaSeparatedCatalogs'
                    }
                ]
            }
        }
    );
    proficiencyLevel_ID @(
        Common : { FieldControl: proficiencyLevelEditMode,
            ValueListWithFixedValues: true,
            Text : {
                $value : proficiencyLevel.name,
                ![@UI.TextArrangement] : #TextOnly
            },
            // Value list configuration to select the skill label and description
            ValueList : {
                CollectionPath: 'ProficiencyLevels',
                PresentationVariantQualifier: 'skillProficiencyLevelPresentationVariant',
                Parameters : [
                    {
                        $Type             : 'Common.ValueListParameterOut',
                        LocalDataProperty : 'proficiencyLevel_ID',
                        ValueListProperty : 'ID'
                    },
                    {
                        $Type:'Common.ValueListParameterIn',
                        LocalDataProperty: 'skill/proficiencySet_ID',
                        ValueListProperty: 'proficiencySet_ID'
                    },
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'description'
                    }
                ]
            }
        }
    );
}

annotate MyResourcesService.ProficiencyLevels with @(
  UI : {
    PresentationVariant#skillProficiencyLevelPresentationVariant: { 
      Visualizations: [ '@UI.LineItem' ],
      SortOrder: [
        {
          Property: 'rank',
          Descending: false
        }
      ]
    }
  }
);

//Skills Header Annotations
annotate MyResourcesService.Skills with @(
    UI : {
        HeaderInfo : {
            TypeName       : '{i18n>SKILL}',
            TypeNamePlural : '{i18n>SKILLS}'
        }
    }
);

// ListReport/Facet Annotations
annotate MyResourcesService.Skills with @(
    UI : {
        LineItem : [
            { Value : skill_ID, Label : '{i18n>SKILL_NAME}' },
            { Value : proficiencyLevel_ID, Label : '{i18n>PROFICIENCY_LEVEL}' },
        ]
    }
);

annotate MyResourcesService.Skills with @(
    Common : {
        SideEffects #SkillChange : {
            SourceProperties : [skill_ID],
            TargetProperties : ['skill', 'skill_ID','proficiencyLevel', 'proficiencyLevel_ID', 'proficiencyLevelEditMode']
        }
    }
);