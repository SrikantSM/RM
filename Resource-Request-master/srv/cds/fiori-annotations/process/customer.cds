using ProcessResourceRequestService from '../../services/process';

@cds.search: {ID, name}
annotate ProcessResourceRequestService.Customers with {
    ID
@Common : {
        Label        : '{i18n>CUSTOMER_ID}',
        FieldControl : #ReadOnly
    };
    name
@Common : {
        Label        : '{i18n>CUSTOMER_NAME}',
        FieldControl : #ReadOnly,
    };
};

annotate ProcessResourceRequestService.Customers with @(Communication : {Contact : {fn : name}});