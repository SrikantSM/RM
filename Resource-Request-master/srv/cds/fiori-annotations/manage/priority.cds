using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.Priorities with {
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

annotate ResourceRequestService.Priorities with @(UI:{
    PresentationVariant #sortbycode: {
        SortOrder : [
            {
                Property   : 'code',
                Descending : true
            }
        ]
    }
});