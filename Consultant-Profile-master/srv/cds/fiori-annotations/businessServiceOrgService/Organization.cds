using BusinessServiceOrgService from '../../businessServiceOrgService';
using { com.sap.resourceManagement.config.managed } from '../../../../db/cds/core';

annotate BusinessServiceOrgService.BSODetails with {
	@Search.defaultSearchElement: true
    code
     @( Common:
     	{
     		Label : '{i18n>SERVICEORG_CODE}'},
         	ValueList : {
				 entity          : 'ServiceOrganizationCode',
				 SearchSupported : 'true',
				 Parameters      : [
					 {
						 $Type             : 'Common.ValueListParameterInOut',
						 LocalDataProperty : 'serviceOrgCode',
						 ValueListProperty : 'serviceOrgCode'
					 }
				 ]
            }
    );

    @Search.defaultSearchElement: true
    description
        @( Common: {Label : '{i18n>SERVICEORG_DESCRIPTION}',
                    QuickInfo : '{i18n>SERVICEORG_DESCRIPTION}' } );
    @Search.defaultSearchElement: true
    companyCode
    	@( Common: {Label : '{i18n>SERVICEORG_COMPANYCODE}'} );
    controllingArea
        @( Common: {Label : '{i18n>SERVICEORG_CONTRLAREA}',
                    QuickInfo : '{i18n>SERVICEORG_CONTRLAREA}' } );
    @Search.defaultSearchElement: true
    costCenter
    @( Common:
     	{
     		Label : '{i18n>SERVICEORG_COSTCENTER}'},
         	ValueList : {
				 entity          : 'BSODetails',
				 SearchSupported : 'true',
				 Parameters      : [
					 {
						 $Type             : 'Common.ValueListParameterInOut',
						 LocalDataProperty : 'costCenter',
						 ValueListProperty : 'costCenter'
					 }
				 ]
            }
    );

    costCenterUUID
        @( Common: {Label : '{i18n>SERVICEORG_CCUUID}'} );

    isDelivery      @UI.Hidden : true;
    modifiedAt      @UI.Hidden : true;
    modifiedBy      @UI.Hidden : true;
    createdAt       @UI.Hidden : true;
    createdBy       @UI.Hidden : true;
    isSales         @UI.Hidden : true;

    toDeliveryStatus
    @UI.Hidden : true
    @title     : '{i18n>SERVICEORG_ISDELORG}';

};

//organization Status
annotate BusinessServiceOrgService.OrganizationStatus with {
  code
  	@Common: {
  	Label : '{i18n>SERVICEORG_ISDELORG}',
  	FieldControl : #ReadOnly,
  	Text         : {
       $value                : name,
       ![@UI.TextArrangement] : #TextOnly
      }
	};
	name @UI.Hidden : true
};

// Service Organizations List Report
annotate BusinessServiceOrgService.BSODetails with @(

	Capabilities.SearchRestrictions.Searchable: true,
    UI : {
    		SelectionFields: [ description, costCenter, code ],
		//intent for upload button to navigate to upload app
		LineItem : [
			 {$Type: 'UI.DataFieldForIntentBasedNavigation', Label: '{i18n>SERVICEORG_UPLOAD}', SemanticObject: 'businessServiceOrgUi', Action: 'upload', RequiresContext: false},
            { Value : code, Label : '{i18n>SERVICEORG_CODE}' , @HTML5.CssDefaults: { width : '10em'} },
            { Value : description, Label : '{i18n>SERVICEORG_DESCRIPTION}', @HTML5.CssDefaults: { width : '12em'} },
            { $Type: 'UI.DataField', Value : toDeliveryStatus.code, Label : '{i18n>SERVICEORG_ISDELORG}', @HTML5.CssDefaults: { width : '10em'} },
            { Value : companyCode, Label : '{i18n>SERVICEORG_COMPANYCODE}' },
            { Value : controllingArea, Label : '{i18n>SERVICEORG_CONTRLAREA}', @HTML5.CssDefaults: { width : '12em'} },
            { Value : costCenter, Label : '{i18n>SERVICEORG_COSTCENTER}', @HTML5.CssDefaults: { width : '10em'} }
		],

        HeaderInfo: {
	      		TypeName: '{i18n>SERVICE_ORGANIZATIONS}',
				TypeNamePlural: '{i18n>SERVICE_ORGANIZATIONS}'
	    }
	}



);

//serviceOrgCode Field Level Annotations
annotate BusinessServiceOrgService.ServiceOrganizationCode with {
    serviceOrgCode
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>SERVICEORG_CODE}',
        }
    );
};
