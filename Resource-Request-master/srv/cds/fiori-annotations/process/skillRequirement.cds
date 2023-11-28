using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.SkillRequirements with {
    ID
    @UI.Hidden : true;
    skill
    @Common    : {
        SemanticObject : 'skill',
        Label          : '{i18n>SKILL}',
        Text           : {
            $value                : skill.name,
            @UI.TextArrangement : #TextOnly
        }
    };
    proficiencyLevel
    @Common    : {
        Label          : '{i18n>PROFICIENCY_LEVEL}',
        Text           : {
            $value                : proficiencyLevel.name,
            @UI.TextArrangement : #TextOnly
        }
    };
    comment
    @Common    : {Label : '{i18n>COMMENT}'};
};

annotate ProcessResourceRequestService.SkillRequirements with @(UI : {
    LineItem   : [
    {
        $Type : 'UI.DataField',
        Value : skill_ID
    },
    {
        $Type : 'UI.DataField',
        Value : proficiencyLevel_ID
    },
    {
        $Type : 'UI.DataField',
        Label : '{i18n>IMPORTANCE}',
        Value : importance.name
    },
    {
        $Type : 'UI.DataField',
        Value : comment
    }
    ],
    HeaderInfo : {
        TypeName : '{i18n>TITLE_SKILLS}',
        TypeNamePlural : '{i18n>TITLE_SKILLS}' 
    },
});
