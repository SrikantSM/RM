using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.DeliveryOrganizationCostCenters with {
	ID 
	@Common: {
		Label : '{i18n>COST_CENTER}',
		FieldControl: #ReadOnly
    };
	
	deliveryOrganizationCode
	@Common: {
		Label : '{i18n>DELIVERY_ORGANIZATION_CODE}',
        Text  : {
            $value                : deliveryOrganizationDescription,
            @UI.TextArrangement : #TextOnly
        },
		FieldControl: #ReadOnly
    };
    deliveryOrganizationDescription
@Common : {
        Label        : '{i18n>REQUESTED_DELIVERY_ORGANIZATION}',
        FieldControl : #ReadOnly
    };	
};
