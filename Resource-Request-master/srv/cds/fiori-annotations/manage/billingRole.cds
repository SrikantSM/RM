using ManageResourceRequestService from '../../services/manage';

@cds.search:{ID, name }
annotate ManageResourceRequestService.BillingRoles with {
    ID
@Common : {
        Label : '{i18n>ID}',
        Text  : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    name
@Common : {
        Label        : '{i18n>BILLINGROLE_NAME}',
        FieldControl : #ReadOnly,
    };
};