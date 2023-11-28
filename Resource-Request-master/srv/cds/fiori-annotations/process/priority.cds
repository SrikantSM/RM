using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.Priorities with {
    code
@UI.Hidden : true
@Common : {
        Label        : '{i18n>ID}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    name
@Common : {
        Label        : '{i18n>REQUEST_PRIORITY}',
        FieldControl : #ReadOnly
    };
};

annotate ProcessResourceRequestService.Priorities with @(UI:{
    PresentationVariant #sortbycode: {
        SortOrder : [
            {
                Property   : 'code',
                Descending : true
            }
        ]
    }
});