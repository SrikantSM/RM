using MyProjectExperienceService from '../../myProjectExperienceService';

//ConsultantSkills Entity Level Annotations
annotate MyProjectExperienceService.ExternalWorkExperienceSkills with @(
    UI : {
        HeaderInfo : {
            TypeNamePlural : '{i18n>PD_SKILLS}'
        },
        LineItem : [
            { Value : skill_ID, Label : '{i18n>PDS_NAME}' },
            { Value : proficiencyLevel_ID, Label : '{i18n>PROFICIENCY_LEVEL}' },
        ]
    }
);

// Field Level Annotations
annotate MyProjectExperienceService.ExternalWorkExperienceSkills with {
    ID @(
        Search.defaultSearchElement : true,
        Common : {
            Text  : {
                $value                : name,
                ![@UI.TextArrangement] : #TextOnly
            }
        }
    );
    skill @(
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_TITLE}',
            Text      : {
                $value                : skill.name,
                ![@UI.TextArrangement] : #TextOnly
            },
            ValueList : {
                CollectionPath          : 'SkillMasterList',
                Label : '{i18n>VALUE_HELP_SKILL_TITLE}',
                SearchSupported : true,
                Parameters      : [
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
                PresentationVariantQualifier: 'externalWorkExperienceProficiencyLevelPresentationVariant',
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
                    // Displaying multiple column for Value Help
                    {
                        $Type             : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty : 'description'
                    }
                ]
            }
        }
    );
}

annotate MyProjectExperienceService.ExternalWorkExperienceSkills with @(
    Common : {
        SideEffects #SkillChange : {
            SourceProperties : [skill_ID],
            TargetProperties : ['skill', 'skill_ID','proficiencyLevel', 'proficiencyLevel_ID', 'proficiencyLevelEditMode']
        }
    }
);

annotate MyProjectExperienceService.ProficiencyLevels with @(
  UI : {
    PresentationVariant#externalWorkExperienceProficiencyLevelPresentationVariant: { 
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
