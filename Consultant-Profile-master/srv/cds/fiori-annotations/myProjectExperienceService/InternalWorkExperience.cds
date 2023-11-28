using MyProjectExperienceService from '../../myProjectExperienceService';

// ListReport/Facet Annotations
annotate MyProjectExperienceService.InternalWorkExperience with @(
    UI : {
        LineItem : [
             { Value : requestName,      Label : '{i18n>REQUEST_NAME}' },
             { Value : requestDisplayId, Label : '{i18n>REQUEST_ID}' },
             { Value : workItemName,     Label : '{i18n>WORKITEM_NAME}' },
             { Value : rolePlayed,       Label : '{i18n>ROLE_NAME}' },
             { Value : companyName,      Label : '{i18n>REQ_RESOURCE_ORGANIZATION}' },
             { Value : customerName,     Label : '{i18n>C_CUSTOMER}' },
             { Value : startDate,        Label : '{i18n>C_START}' },
             { Value : endDate,          Label : '{i18n>C_END}' },
             { Value : assignmentStatus, Label : '{i18n>ASSIGNMENT_STATUS}' }
        ]
    }
);

// Field Level Annotations
annotate MyProjectExperienceService.InternalWorkExperience with {
    resourceRequest_ID  @UI.Hidden : true;
    workPackage         @UI.Hidden : true;
    assignedCapacity    @UI.Hidden : true;
    requestName         @Common : {
        Label        : '{i18n>REQUEST_NAME}',
        FieldControl : #ReadOnly,
    }  @UI.Importance : #High;
    requestDisplayId    @Common : {
        Label        : '{i18n>REQUEST_ID}',
        FieldControl : #ReadOnly,
    };
    workItemName   @Common : {
        Label        : '{i18n>WORKITEM_NAME}',
        FieldControl : #ReadOnly,
    };
    rolePlayed          @Common : {
        Label        : '{i18n>ROLE_NAME}',
        FieldControl : #ReadOnly,
    };
    customerName        @Common : {
        Label        : '{i18n>C_CUSTOMER}',
        FieldControl : #ReadOnly,
    };
    companyName         @Common : {
        Label        : '{i18n>REQ_RESOURCE_ORGANIZATION}',
        FieldControl : #ReadOnly,
    };
    startDate           @Common : {
        Label        : '{i18n>C_START}',
        FieldControl : #ReadOnly,
    };
    endDate             @Common : {
        Label        : '{i18n>C_END}',
        FieldControl : #ReadOnly,
    };
    convertedAssignedCapacity  @Common.FieldControl : #ReadOnly
    @title : '{i18n>C_EFFORT}';
    employee_ID         @UI.Hidden : true;
    assignment_ID       @UI.Hidden : true;
    assignmentStatus @Common.FieldControl : #ReadOnly
    @title     : '{i18n>ASSIGNMENT_STATUS}';
}

// Object Page Annotation
annotate MyProjectExperienceService.InternalWorkExperience with @(
    Common.SemanticKey : [ employee.profile.name ],
    UI : {
        // Header Title and Description
        HeaderInfo : {
            TypeName        : '{i18n>TITLE_INTERNAL_WORK_EXPERIENCE}',
            TypeNamePlural  : '{i18n>P_ASSIGNMENTS}',
            Title           : { $Type : 'UI.DataField', Value : requestName }
        },

        FieldGroup#GeneralInformation : {
            Data: [
                { $Type : 'UI.DataField', Label : '{i18n>REQUEST_ID}', Value : requestDisplayId },
                { $Type : 'UI.DataField', Label : '{i18n>WORKITEM_NAME}', Value : workItemName },
                { $Type : 'UI.DataField', Label : '{i18n>CD_CUSTOMER}', Value : customerName },
                { $Type : 'UI.DataField', Label : '{i18n>ROLE}', Value : rolePlayed },
                { $Type : 'UI.DataField', Label : '{i18n>REQ_RESOURCE_ORGANIZATION}', Value : companyName },
                { $Type : 'UI.DataField', Label : '{i18n>CD_START}', Value : startDate },
                { $Type : 'UI.DataField', Label : '{i18n>CD_END}', Value : endDate },
                { $Type : 'UI.DataField', Label : '{i18n>C_EFFORT}',   Value : convertedAssignedCapacity },
                { $Type:  'UI.DataField', Label : '{i18n>ASSIGNMENT_STATUS}', Value : assignmentStatus }
            ]
        },
        Facets : [

             { $Type: 'UI.CollectionFacet', ID: 'GeneralInformation', Label: '{i18n>C_GENERAL_INFORMATION}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target : '@UI.FieldGroup#GeneralInformation' }
                ]
            },

            { $Type: 'UI.CollectionFacet', ID: 'InternalWorkExperienceSkills', Label: '{i18n>CD_SKILLS}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target : 'internalWorkExperienceSkills/@UI.LineItem' }
                ]
            }
        ],

    }
);
