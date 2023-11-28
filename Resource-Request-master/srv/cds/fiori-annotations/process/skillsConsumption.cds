using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.SkillsConsumption with {
    ID
    @(
        UI.Hidden : true,
        Common    : {
            FieldControl : #ReadOnly,
            Text         : {
                $value                : name,
                @UI.TextArrangement : #TextOnly
            }
        }
    );
    name
    @Common : {Label : '{i18n>NAME}', };
    description
    @Common : {Label : '{i18n>DESCRIPTION}', };
    commaSeparatedAlternativeLabels
    @Common : {Label : '{i18n>SKILL_ALTERNATE_LABELS}', };
};

annotate ProcessResourceRequestService.SkillsConsumption with @(UI : {
    QuickViewFacets              : [{
        $Type  : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#SkillDescription'
    }],
    FieldGroup #SkillDescription : {Data : [{
        $Type : 'UI.DataField',
        Value : description
    }]},
});
