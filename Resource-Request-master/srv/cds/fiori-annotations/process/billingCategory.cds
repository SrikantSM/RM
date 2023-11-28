using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.BillingCategory with {
    ID
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
        Label        : '{i18n>BILLING_CATEGORY}',
        FieldControl : #ReadOnly
    };
};