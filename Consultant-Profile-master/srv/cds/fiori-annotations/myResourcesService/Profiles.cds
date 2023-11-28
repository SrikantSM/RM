using MyResourcesService from '../../myResourcesService';

// Service (CRUD) Operation Annotation
annotate MyResourcesService.Profiles with @(
    Capabilities.SearchRestrictions.Searchable : true,
    Capabilities.SortRestrictions.Sortable : true
);

// Field Level Annotations
annotate MyResourcesService.Profiles with {
    ID
    @UI.Hidden : true;

    costCenter
    @Search.defaultSearchElement : true
    @( Common: 
        { FieldControl : #ReadOnly,
        Label : '{i18n>COST_CENTER}',
        Text  : costCenterDescription,
        TextArrangement : #TextFirst,
	    ValueList : {
		    CollectionPath  : 'CostCenterMasterList',
            SearchSupported :  true,
		    Parameters      : [
            {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'ID'
            },
			{
			    $Type             : 'Common.ValueListParameterInOut',
				LocalDataProperty :  costCenter,
				ValueListProperty : 'costCenterID'
			},
            { 
                $Type:'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'costCenterDescription' 
            }
		]}
    });

    costCenterDescription
    @UI.Hidden : true
    @Search.defaultSearchElement : true;
    
    workerExternalID
    @Search.defaultSearchElement : true
    @Common.FieldControl : #ReadOnly
    @( Common: {Label : '{i18n>EMPLOYEE_ID}'} );

    name
    @Search.defaultSearchElement : true
    @Common.FieldControl : #ReadOnly
    @( Common: {Label : '{i18n>NAME}'} );

    fullName
    @Search.defaultSearchElement : true
    @Common.FieldControl : #ReadOnly
    @( Common: {Label : '{i18n>NAME}'} );

    emailAddress
	@Communication.IsEmailAddress: true
    @Search.defaultSearchElement : true
     @(
        Common : {
            Label        : '{i18n>O_EMAIL}',
            FieldControl : #ReadOnly
        }
    );

    mobilePhoneNumber
	@Communication.IsPhoneNumber: true
    @Common.FieldControl : #ReadOnly;

    officeLocation
    @Search.defaultSearchElement : true
    @Common.FieldControl : #ReadOnly
    @( Common: {Label : '{i18n>OFFICE_LOCATION}'} 
    );

    role
    @Search.defaultSearchElement : true
    @( Common: 
        { FieldControl : #ReadOnly,
        Label : '{i18n>CD_ROLE}',
	    ValueList : {
		    CollectionPath  : 'RoleMasterList',
            SearchSupported :  true,
		    Parameters      : [
			{
			    $Type             : 'Common.ValueListParameterInOut',
				LocalDataProperty :  role,
				ValueListProperty : 'name'
			},
            { 
                $Type:'Common.ValueListParameterDisplayOnly', 
                ValueListProperty: 'code' 
            },
            { 
                $Type:'Common.ValueListParameterDisplayOnly', 
                ValueListProperty: 'description' 
            },

		]}
        });

    managerExternalID
    @Common.FieldControl : #ReadOnly;

    resourceOrg
    @Search.defaultSearchElement : true
    @Common.FieldControl : #ReadOnly;

};

