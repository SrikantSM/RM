using MyResourcesService from '../../myResourcesService';

// ListReport/Facet Annotations
annotate MyResourcesService.ExternalWorkExperience with @(
    UI : {
        LineItem : [
             { Value : projectName, Label : '{i18n>P_PROJECT_NAME}' },
             { Value : rolePlayed,  Label : '{i18n>ROLE_NAME}' },
             { Value : companyName, Label : '{i18n>P_COMPANY}' },
             { Value : customer,    Label : '{i18n>P_CUSTOMER}' },
             { Value : startDate,   Label : '{i18n>P_START}' },
             { Value : endDate,     Label : '{i18n>P_END}' }
        ]
    }
);

// Field Level Annotations
annotate MyResourcesService.ExternalWorkExperience with {
    ID          @UI.Hidden: true;
    modifiedAt  @UI.Hidden : true;
    modifiedBy  @UI.Hidden : true;
    createdAt   @UI.Hidden : true;
    createdBy   @UI.Hidden : true;
    workPackage @UI.Hidden : true;

    projectName @title: '{i18n>P_PROJECT_NAME}'
    @Common : {
        FieldControl : #Mandatory
    };  
    
    rolePlayed    @Common.FieldControl : #Mandatory;
    companyName   @Common.FieldControl : #Mandatory;
    customer;
    startDate;
    endDate;
    employee_ID  @UI.Hidden : true
                 @UI.HiddenFilter : true;
    comments @(   UI.MultiLineText: true     )
    @title: '{i18n>P_COMMENT}';
}

// Object Page Annotation
annotate MyResourcesService.ExternalWorkExperience with @(
    Common.SemanticKey : [ employee.profile.name ],
    UI : {
        // Header Title and Description
        HeaderInfo : {
            TypeName        : '{i18n>TITLE_EXTERNAL_WORK_EXPERIENCE}',
            TypeNamePlural  : '{i18n>P_ASSIGNMENTS}',
            Title           : { $Type : 'UI.DataField', Value : projectName }
        },

        FieldGroup#GeneralInformation : {
            Data: [
                { $Type : 'UI.DataField', Label : '{i18n>P_PROJECT_NAME}', Value : projectName },
                { $Type : 'UI.DataField', Label : '{i18n>PD_CUSTOMER}', Value : customer },
                { $Type : 'UI.DataField', Label : '{i18n>ROLE}', Value : rolePlayed },
                { $Type : 'UI.DataField', Label : '{i18n>PD_COMPANY}', Value : companyName },
                { $Type : 'UI.DataField', Label : '{i18n>PD_START}', Value : startDate },
                { $Type : 'UI.DataField', Label : '{i18n>PD_END}', Value : endDate } 
            ]
        },

        Facets : [
            
            { $Type: 'UI.CollectionFacet', ID: 'GeneralInformation', Label: '{i18n>P_GENERAL_INFORMATION}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target : '@UI.FieldGroup#GeneralInformation' }
                ]
            },

            { $Type: 'UI.CollectionFacet', ID: 'ExternalWorkExperienceSkills', Label: '{i18n>PD_SKILLS}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target : 'externalWorkExperienceSkills/@UI.LineItem' }
                ]
            },

            { $Type: 'UI.CollectionFacet', ID: 'Comments', Label: '{i18n>P_COMMENT}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Comments' }
                ]
            }
        ],

        FieldGroup#Comments: {
            Data: [
                { $Type: 'UI.DataField', Label: '{i18n>P_TEXT}', Value : comments }
            ]
        }
    }
);