using MyResourcesService from '../../myResourcesService';

// ListReport/Facet Annotations
annotate MyResourcesService.InternalWorkExperienceSkills with @(
    UI : {

        HeaderInfo : {
            TypeNamePlural : '{i18n>CD_SKILLS}'
        },
        LineItem : [
            { Value : skillId, Label : '{i18n>CDS_NAME}' },
            { Value : proficiencyLevelId, Label : '{i18n>PROFICIENCY_LEVEL}' },
        ]
    }
);

// Field Level Annotations
annotate MyResourcesService.InternalWorkExperienceSkills with {
    skillId @(
        Common : {
            Text : {
                $value                : skill.name,
                ![@UI.TextArrangement] : #TextOnly
            }
        }
    );
    proficiencyLevelId @(
        Common : {
            Text : {
                $value : proficiencyLevel.name,
                ![@UI.TextArrangement] : #TextOnly
            },
        }
    );
}
