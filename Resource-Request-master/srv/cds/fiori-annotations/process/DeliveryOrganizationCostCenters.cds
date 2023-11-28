using ProcessResourceRequestService from '../../services/process';

@cds.search: {ID, deliveryOrganizationCode, deliveryOrganizationDescription}
annotate ProcessResourceRequestService.DeliveryOrganizationCostCenters with {
    ID
@Common : {
        Label        : '{i18n>COST_CENTER}',
        FieldControl :  #ReadOnly,
        Text         : {
            $value                : ID,
            @UI.TextArrangement : #TextOnly
        }
    };
    deliveryOrganizationCode
@Common : {
        Label        : '{i18n>DELIVERY_ORGANIZATION_CODE}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : deliveryOrganizationDescription,
            @UI.TextArrangement : #TextOnly
        }
    };
    
    
    deliveryOrganizationDescription
@Common : {
        Label        : '{i18n>PROCESSING_DELIVERY_ORGANIZATION}',
        FieldControl : #ReadOnly,
    };

};