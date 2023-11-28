using ProjectRoleService from '../../projectRoleService';
using { com.sap.resourceManagement.config.managed } from '../../../../db/cds/core';

//Administrative data
annotate managed with {
  createdAt @( UI.HiddenFilter: true, readonly );
  modifiedAt @( UI.HiddenFilter: true, readonly );
  modifiedBy @( UI.HiddenFilter: true, readonly );
};

annotate ProjectRoleService.Roles with @odata.draft.enabled;
//Roles Field Level Annotations
annotate ProjectRoleService.Roles with {

    code
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>PROJECTROLE_CODE}',
            ValueList: {
					CollectionPath: 'RoleCodes',
					Parameters: [
						{ $Type:'Common.ValueListParameterInOut', LocalDataProperty: code, ValueListProperty: 'code' }
					]
			}
        }
    );

    name
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>PROJECTROLE_NAME}'
        }
    );

    roleLifecycleStatus @UI.Hidden : true
                        @title     : '{i18n>L_ROLELIFECYCLESTATUS}';
                        
	roleLifecycleStatus_code @UI.Hidden : true;

    description
    @(   UI.MultiLineText: true     )
    @Search.defaultSearchElement : false
    @(
        Common : {
            Label        : '{i18n>PROJECTROLE_DESCRIPTION}'
        }
    );
	localized @cds.search;
    createdAt @title : '{i18n>CREATEDAT}';
    modifiedBy @title : '{i18n>MODIFIEDBY}';
    modifiedAt @title : '{i18n>MODIFIEDAT}';
};

//Role ID
annotate ProjectRoleService.Roles with {
  ID @Common: { Text: name, TextArrangement: #TextOnly };
}

// Project Roles List Report
annotate ProjectRoleService.Roles with @(

	Capabilities.SearchRestrictions.Searchable: true,
    UI : {
    	SelectionFields: [ name, code ],

	LineItem : [
				  { Value : ID, Label : '{i18n>PROJECTROLE_NAME}' },
				  { Value : code, Label : '{i18n>PROJECTROLE_CODE}' },
				  { Value : description, Label : '{i18n>PROJECTROLE_DESCRIPTION}' },
				  { $Type :'UI.DataField', Value: roleLifecycleStatus.code, Label: '{i18n>L_LIFECYCLESTATUS}', 
						  Criticality: roleLifecycleStatus.criticality, CriticalityRepresentation:#WithoutIcon},
				  { Value : modifiedBy, Label : '{i18n>MODIFIEDBY}' },
				  { Value : modifiedAt, Label : '{i18n>MODIFIEDAT}' }
				]
			},
	Common: {
		SemanticKey: [ID],
		DraftRoot: {
		  NewAction: 'ProjectRoleService.createRoleWithDialog'
		}
	  }

);

//Role lifecycle status
annotate ProjectRoleService.RoleLifecycleStatus with {
  code @Common: { Text: name, TextArrangement: #TextOnly };
}

// Project Roles Object Page
annotate ProjectRoleService.Roles with @(
  	Common: {
      //Not working as expected.Raised FE issue for the same
       SideEffects#textsChanged: {
      SourceProperties: [
        code
      ],
      TargetEntities:[
        RoleCodes
      ],
      TargetProperties: [
        'code'
      ]
    }
    },

    UI : {
	    	HeaderInfo: {
	      		TypeName: '{i18n>ROLE}',
				TypeNamePlural: '{i18n>PROJECT_ROLES}',
	      		Title: {Value: name},
	      		Description    : {Value : code}
	    },
	    
	    HeaderFacets: [
      			{$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData1'},
				{$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData2'}
    		],
    		FieldGroup#AdministrativeData1: {
		      	Data: [
		        {$Type: 'UI.DataField', Label:'{i18n>CREATEDAT}', Value: createdAt},
		        {$Type: 'UI.DataField', Label:'{i18n>MODIFIEDBY}', Value: modifiedBy},
      		]
    		},
    		FieldGroup#AdministrativeData2: {
		      	Data: [
						{$Type: 'UI.DataField', Label:'{i18n>MODIFIEDAT}', Value: modifiedAt},
						{$Type: 'UI.DataField', Label:'{i18n>L_LIFECYCLESTATUS}', Value: roleLifecycleStatus.code,  
						  Criticality: roleLifecycleStatus.criticality, CriticalityRepresentation:#WithoutIcon}
      				]
    		},
			FieldGroup #RoleCode : {
			Data : [
					{$Type : 'UI.DataField', Label : '{i18n>PROJECTROLE_CODE}', Value : code }
				   ]
			},
			Facets : [		
						{	Label: '{i18n>P_GENERAL_INFORMATION}',
							$Type  : 'UI.ReferenceFacet',
							Target : '@UI.FieldGroup#RoleCode'
						},
						{
							Label: '{i18n>PROJECTROLE_ROLE_NAMES}',
							$Type: 'UI.ReferenceFacet',
							Target: 'texts/@UI.LineItem'
						}
					],
			Identification: [
				{ $Type: 'UI.DataFieldForAction', Label: '{i18n>RESTRICTACTIONBUTTON}', Action: 'ProjectRoleService.restrict', ![@UI.Hidden]: roleLifecycleStatus.isRestricted },
				{ $Type: 'UI.DataFieldForAction', Label: '{i18n>REMOVERESTRICTIONACTIONBUTTON}', Action: 'ProjectRoleService.removeRestriction', ![@UI.Hidden]: roleLifecycleStatus.isUnrestricted }
			]
	}
);

//Role creation with dialog
annotate ProjectRoleService.Roles actions {
@cds.odata.bindingparameter.collection
  createRoleWithDialog (
    // TODO: Enable once OData singletons are supported
    // (https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/380)
    /*
    locale @Common: {
      FieldControl: #Mandatory,
      Label: '{i18n>labelLanguages}'
    } default ProjectRoleService.DefaultLanguage.code,
    */

    code @Common: {
		  FieldControl: #Mandatory,
		  Label: '{i18n>PROJECTROLE_CODE}',
		},
    name @Common: {
			Label: '{i18n>PROJECTROLE_NAME}'
		},
	  description @(
      Common: {
			Label: '{i18n>PROJECTROLE_DESCRIPTION}'
		},
      UI: { MultiLineText: true	}
    )
	);
  }

//RoleCodes Field Level Annotations
annotate ProjectRoleService.RoleCodes with {
	ID @UI.HiddenFilter : true;
	
    code
    @Search.defaultSearchElement : true
    @(
        Common : {
            Label        : '{i18n>PROJECTROLE_CODE}',
        }
    );
};
