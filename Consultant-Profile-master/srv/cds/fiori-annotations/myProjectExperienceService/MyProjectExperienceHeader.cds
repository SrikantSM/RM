using MyProjectExperienceService from '../../myProjectExperienceService';

// Service (CRUD) Operation Annotation
annotate MyProjectExperienceService.MyProjectExperienceHeader with @(
    odata.draft.enabled : true,
    Capabilities : {
        SearchRestrictions.Searchable : true,
        Insertable                    : false,
        Updatable                     : true,
        Deletable                     : false
    }
);

// Field Level Annotations
annotate MyProjectExperienceService.MyProjectExperienceHeader with {
    ID @UI.HiddenFilter : true;
}

// ListReport/Facet Annotations
annotate MyProjectExperienceService.MyProjectExperienceHeader with @(
    // Show draft indicator at list report
    Common.SemanticKey : [ ID ],
    Common.IsNaturalPerson : true,
    UI : {
        // To present the filter input boxes at the list report header (keeping it blank to remove unnecessary filter input box)
        SelectionFields : [ profile.emailAddress ],
        LineItem : [
            // Show name and role/jobTitle at list report
            { $Type : 'UI.DataFieldForAnnotation', Label : '{i18n>NAME_AND_TITLE}', Target : '@UI.FieldGroup#NameAndTitle' },
            // Show email address of employee at list report
            { Label : '{i18n>L_EMAIL}', Value : profile.emailAddress },
            // Show mobile phone number of employee at list report
            { Label : '{i18n>PHONE}', Value : profile.mobilePhoneNumber }
        ],
        // FieldGroup to show name and role/jobTitle at list report
        FieldGroup#NameAndTitle : {
            Data : [
                // Show employee's name
                { $Type : 'UI.DataField', Value : profile.name },
                // Show employee's role/jobTitle
                { $Type : 'UI.DataField', Value : profile.role }
            ]
        }
    }
);

// Object Page Annotation
annotate MyProjectExperienceService.MyProjectExperienceHeader with @(
    UI : {
        // Header title(employee name) and description(role/jobTitle)
        HeaderInfo : {
            TypeName       : '{i18n>MY_PROJECT_EXPERIENCE}',
            TypeNamePlural : '{i18n>MY_PROJECT_EXPERIENCE}',
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
                { $Type : 'UI.DataFieldForAnnotation', Label : '{i18n>MANAGER}', Target : 'profile/toManager/@Communication.Contact'}
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
        FieldGroup#ProfilePhoto : {
            Data : [
                { $Type : 'UI.DataField', Value : profilePhoto.profileImage }
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
            //  Profile picture edit collection
            { $Type : 'UI.CollectionFacet', ID : 'Header', Label : '{i18n>Header}', ![@UI.Hidden]: IsActiveEntity,
            Facets : [
                    { $Type : 'UI.ReferenceFacet', Label : '{i18n>PROFILE_PHOTO}', Target : '@UI.FieldGroup#ProfilePhoto' }
                ]
            },
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
                    { $Type  : 'UI.ReferenceFacet', Target : 'periodicAvailability/@UI.LineItem' }
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
