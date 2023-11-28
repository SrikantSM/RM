using ManageResourceRequestService from '../../services/manage';

@cds.search: {ID, name}
annotate ManageResourceRequestService.Customers with {
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

annotate ManageResourceRequestService.Customers with @(Communication : {Contact : {fn : name}});