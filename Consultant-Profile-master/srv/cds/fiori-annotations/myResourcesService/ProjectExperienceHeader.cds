using MyResourcesService from '../../myResourcesService';

// Service (CRUD) Operation Annotation
annotate MyResourcesService.ProjectExperienceHeader with @(
    odata.draft.enabled : true,
    Capabilities : {
        SearchRestrictions.Searchable : true,
        Insertable                    : false,
        Updatable                     : true,
        Deletable                     : false
    },
    Capabilities.SortRestrictions : {
    Sortable              : true,
    NonSortableProperties : [ID, commaSeparatedSkills, commaSeparatedRoles]
  },
);


// Field Level Annotations
annotate MyResourcesService.ProjectExperienceHeader with {
    ID
    @UI.HiddenFilter : true
    @UI.Hidden : true;

    commaSeparatedSkills
    @Common.FieldControl : #ReadOnly
    @Search.defaultSearchElement : false
    @UI.HiddenFilter : true
    @( Common: {Label : '{i18n>PD_SKILLS}',
    ValueList : {
		    CollectionPath  : 'SkillMasterList',
            SearchSupported :  true,
		    Parameters      : [
			 {
			     $Type             : 'Common.ValueListParameterInOut',
			 	LocalDataProperty :  'skills/skill_ID',
			 	ValueListProperty : 'name'
			},
            { 
                 $Type:'Common.ValueListParameterDisplayOnly', 
                 ValueListProperty: 'description' 
            }
            ]}

    } );

    commaSeparatedRoles
    @Common.FieldControl : #ReadOnly
    @Search.defaultSearchElement : false
    @UI.HiddenFilter : true
    @( Common: {Label : '{i18n>PROJECT_ROLES}',
    ValueList : {
		    CollectionPath  : 'RoleMasterList',
            SearchSupported :  true,
		    Parameters      : [
			 {
			     $Type             : 'Common.ValueListParameterInOut',
			 	LocalDataProperty :  'roles/role_ID',
			 	ValueListProperty : 'name'
			},
            { 
                 $Type:'Common.ValueListParameterDisplayOnly', 
                 ValueListProperty: 'description' 
            }
            ]}

    } );
}

// ListReport/Facet Annotations
annotate MyResourcesService.ProjectExperienceHeader with @(
    // Show draft indicator at list report
    Common.SemanticKey : [ ID ],
    Common.IsNaturalPerson : true,
    UI : {
        // To present the filter input boxes at the list report header (keeping it blank to remove unnecessary filter input box)
        SelectionFields : [ profile.fullName, profile.workerType.name, 'roles/role_ID',  profile.costCenter, profile.officeLocation, 'skills/skill_ID' , profile.workerExternalID],
        LineItem : [
            // Show worker type in the list report
            { Value : profile.workerType.name, Label : '{i18n>WORKER_TYPE}'},
            // Show profile project roles in list report
            { Value : commaSeparatedRoles, Label : '{i18n>PROJECT_ROLES}'},
            // Show employee ID in list report
            { Value : profile.workerExternalID, Label : '{i18n>EMPLOYEE_ID}'},
            // Show cost center in list report
            { Value : profile.costCenter, Label : '{i18n>COST_CENTER}'},
            // Show location in list report
            { Value : profile.officeLocation, Label : '{i18n>OFFICE_LOCATION}' },
            // Show skills in list report
            { Value : commaSeparatedSkills, Label : '{i18n>PD_SKILLS}',  }

        ],
         PresentationVariant : {
            Visualizations : ['@UI.LineItem'],
            RequestAtLeast : [
            ID,
            profile.initials,
            profile.name,
            profile.fullName,
            profile.firstName,
            profile.lastName,
            profile.mobilePhoneNumber,
            profile.emailAddress,
            profile.resourceOrg,
            profile.role,
            profile.officeLocation,
            profile.costCenter,
            profile.costCenterDescription,
            profilePhoto.profileThumbnail,
            profile.toManager.managerName
            ]
        }
    }
);

// Object Page Annotation
annotate MyResourcesService.ProjectExperienceHeader with @(
    UI : {
        // Header title(employee name) and description(role/jobTitle)
        HeaderInfo : {
            TypeName       : '{i18n>RESOURCE}',
            TypeNamePlural : '{i18n>RESOURCES}',
            Title          : {Value : profile.name},
            Description    : {Value : profile.role},
            ImageUrl       : profilePhoto.profileImage,
            Initials       : profile.initials,
        },
        HeaderFacets : [
            // Header facet to show resource organization, office location and manager contact card of the employee
            { $Type : 'UI.ReferenceFacet', Label : '{i18n>ORGANIZATIONAL_INFORMATION}', Target : '@UI.FieldGroup#OrganizationInformation' },
            // Header facet to show mobile phone number and email of the employee
            { $Type : 'UI.ReferenceFacet', Label : '{i18n>CONTACT_INFORMATION}', Target : '@UI.FieldGroup#ContactInformation' },
            { $Type : 'UI.ReferenceFacet', Label : '{i18n>AVERAGE_UTILIZATION}', ID : 'UtilizationIndicator', Target : '@UI.DataPoint#UtilizationIndicator' },
            // Header facet to show change record details
            { $Type : 'UI.ReferenceFacet', Label : '{i18n>CHANGE_RECORD}', ID : 'ChangedRecordData', Target : '@UI.FieldGroup#ModifiedDetails' }
        ],
        FieldGroup#OrganizationInformation : {
            Data : [
                // show employee's worker type
                { $Type : 'UI.DataField', Label : '{i18n>WORKER_TYPE}', Value : profile.workerType.name },
                // show employee's resource organization
                { $Type : 'UI.DataField', Label : '{i18n>RESOURCE_ORGANIZATION}', Value : profile.resourceOrg },
                // show employee's cost center
                { $Type : 'UI.DataField', Label : '{i18n>COST_CENTER}', Value : profile.costCenter },
                // show employee's manager contact card
                { $Type : 'UI.DataFieldForAnnotation', Label : '{i18n>MANAGER}', Target : 'profile/toManager/@Communication.Contact'},
            ]
        },
        FieldGroup#ContactInformation : {
            Data : [
                // show employee's mobile phone number
                { $Type : 'UI.DataField', Label : '{i18n>MOBILE}', Value : profile.mobilePhoneNumber },
                // show employee's email
                { $Type : 'UI.DataField', Label : '{i18n>O_EMAIL}', Value : profile.emailAddress },
                // show employee's office location
                { $Type : 'UI.DataField', Label : '{i18n>OFFICE_LOCATION}', Value : profile.officeLocation }
            ]
        },
        FieldGroup#ModifiedDetails : {
            Data : [
                // show profile last updation details
                {$Type: 'UI.DataField', Label:'{i18n>MODIFIEDBY}', Value: modifiedBy},
                {$Type: 'UI.DataField', Label:'{i18n>MODIFIEDAT}', Value: modifiedAt}
            ]
        },
        FieldGroup#Resume : {
            Data : [
                { $Type : 'UI.DataField', Value : attachment.content }
            ]
        },
        DataPoint#UtilizationIndicator : {
            Value         : utilization.yearlyUtilization,
            TargetValue   : 100,
            Title         : '{i18n>AVERAGE_UTILIZATION}',
            Visualization : #Progress,
            ![@Common.QuickInfo] : '{i18n>AVERAGE_UTILIZATION}',
            Criticality : utilization.utilizationColor,
            CriticalityRepresentation:#WithoutIcon
        },
        // Object page collections to present qualifications,
        Facets: [
            // Qualifications collection
            { $Type : 'UI.CollectionFacet', ID : 'Qualifications', Label : '{i18n>QUALIFICATIONS}',
                Facets : [
                    // employee's skills list facet
                    { $Type : 'UI.ReferenceFacet', Target : 'skills/@UI.LineItem' }
                ]
            },
            // Periodic Availability collection
            { $Type : 'UI.CollectionFacet', ID : 'PeriodicAvailability', Label : '{i18n>AVAILABILITY}',
                Facets : [
                    { $Type  : 'UI.ReferenceFacet', Target : 'periodicUtilization/@UI.PresentationVariant' },
                    { $Type : 'UI.ReferenceFacet', Target : 'periodicAvailability/@UI.LineItem' }
                ]
            },
            // Prior Experience collection
            { $Type : 'UI.CollectionFacet', ID : 'PriorExperience', Label : '{i18n>PRIOR_EXPERIENCE}',
                Facets : [
                    // employee's roles list facet
                    { $Type : 'UI.CollectionFacet', ID : 'PreviousRoles', Label : '{i18n>PREVIOUS_ROLES}',
                        Facets : [
                            { $Type  : 'UI.ReferenceFacet', Target : 'roles/@UI.LineItem' }
                        ]
                    },
                    { $Type : 'UI.CollectionFacet', ID : 'InternalWorkExperience', Label : '{i18n>INTERNAL_WORK_EXPERIENCE}',
                        Facets : [
                            { $Type  : 'UI.ReferenceFacet', Target : 'internalWorkExperience/@UI.LineItem' }
                        ]
                    },
                    { $Type : 'UI.CollectionFacet', ID : 'ExternalWorkExperience', Label : '{i18n>EXTERNAL_WORK_EXPERIENCE}',
                        Facets : [
                            { $Type  : 'UI.ReferenceFacet', Target : 'externalWorkExperience/@UI.LineItem' }
                        ]
                    }
                ]
            },
            { $Type : 'UI.CollectionFacet', ID : 'Attachment', Label : '{i18n>ATTACHMENT}',
                Facets : [
                    { ID : 'ResumeSection' , $Type : 'UI.ReferenceFacet', Label : '{i18n>RESUME}', Target : '@UI.FieldGroup#Resume' }
                ]
            }

        ]
    }
);
