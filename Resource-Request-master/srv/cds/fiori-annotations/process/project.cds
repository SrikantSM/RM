using ProcessResourceRequestService from '../../services/process';

@cds.search: {ID, name}
annotate ProcessResourceRequestService.Projects with {
    ID
@Common : {
        Label        : '{i18n>PROJECT_ID}',
        FieldControl : #ReadOnly
    };
    name
@Common : {
        Label        : '{i18n>PROJECT_NAME}',
        FieldControl : #ReadOnly,
    };
    startDate
@UI.Hidden                   : true
@Common.Label                : '{i18n>START_TIME}';
    endDate
@UI.Hidden                   : true
@Common.Label                : '{i18n>END_TIME}';
    customer
@Common : {
        Label        : '{i18n>CUSTOMER_NAME}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : customer.name,
            @UI.TextArrangement : #TextOnly
        },
        ValueList    : {
            CollectionPath  : 'Customers',
            SearchSupported : true,
            Parameters      : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : 'customer_ID',
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name'
                },
            ]
        }
    };
    serviceOrganization
@UI.Hidden                   : true;
};

annotate ProcessResourceRequestService.Projects with @(UI:{
  SelectionFields:[
    ID,
    name,
    customer_ID
  ]
});
