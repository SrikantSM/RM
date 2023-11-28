using ProcessResourceRequestService from '../../services/process';

@cds.odata.valuelist
annotate ProcessResourceRequestService.RequestStatuses with {
    code
@UI.Hidden : true
@Common : {
        Label        : '{i18n>ID}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : description,
            @UI.TextArrangement : #TextOnly
        }
    };
    description
@Common : {
        Label        : '{i18n>REQUEST_STATUS}',
        FieldControl : #ReadOnly
    };
};