using ManageResourceRequestService from '../../services/manage';

@cds.search: {ID, name}
annotate ManageResourceRequestService.Projects with {
    ID
@Common : {
        Label : '{i18n>PROJECT_ID}'
    };
    name
@Common.Label                : '{i18n>PROJECT_NAME}'
@Common.FieldControl         : #ReadOnly;
    startDate
@UI.HiddenFilter             : true
@Common.Label                : '{i18n>PROJECT_STARTDATE}'
@Common.FieldControl         : #ReadOnly;
    endDate
@UI.HiddenFilter             : true
@Common.Label                : '{i18n>PROJECT_ENDDATE}'
@Common.FieldControl         : #ReadOnly;
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
@UI.HiddenFilter             : true;
};

annotate ManageResourceRequestService.Projects with @(UI:{
  SelectionFields:[
    ID,
    name,
    customer_ID
  ]
});
