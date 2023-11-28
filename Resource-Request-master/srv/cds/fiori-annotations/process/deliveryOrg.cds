using ProcessResourceRequestService from '../../services/process';

@cds.search: {code, description}
annotate ProcessResourceRequestService.DeliveryOrganizations with {
    code
@Common : {
        Label        : '{i18n>CODE}',
        FieldControl : #ReadOnly
    };
    description
@Common : {
        Label        : '{i18n>PROCESSING_DELIVERY_ORGANIZATION}',
        FieldControl : #ReadOnly,
    };
    costCenter
@UI.Hidden                   : true;
};