using ProcessResourceRequestService from '../../services/process';

@cds.search: {code, description}
annotate ProcessResourceRequestService.EffortDistributionTypes with {
    code
@Common : {
        Label        : '{i18n>EFFORT_DISTRIBUTION}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : description,
            @UI.TextArrangement : #TextOnly
        }
    };
    description
@Common : {
        Label        : '{i18n>EFFORT_DISTRIBUTION}',
        FieldControl : #ReadOnly,
    };
};