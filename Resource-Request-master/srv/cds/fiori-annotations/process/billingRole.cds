using ProcessResourceRequestService from '../../services/process';

@cds.search: {ID, name}
annotate ProcessResourceRequestService.BillingRoles with {
	ID 
	@Common: {
		Label : '{i18n>ID}',
		FieldControl: #ReadOnly,
		Text: {$value: name, @UI.TextArrangement: #TextOnly}
    };
	
	name
	@Common: {
		Label : '{i18n>BILLINGROLE_NAME}',
		FieldControl: #ReadOnly,
	};
};
