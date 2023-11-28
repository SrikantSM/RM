using MyResourcesService from '../../myResourcesService';

// ListReport/Facet Annotations
annotate MyResourcesService.InternalWorkExperience with @(
    UI : {
        LineItem : [             
             { Value : requestName,      Label : '{i18n>REQUEST_NAME}' },
             { Value : requestDisplayId, Label : '{i18n>REQUEST_ID}' },
             { Value : workItemName,     Label : '{i18n>WORKITEM_NAME}' },
             { Value : rolePlayed,  Label : '{i18n>ROLE_NAME}' },
             { Value : companyName, Label : '{i18n>REQ_RESOURCE_ORGANIZATION}' },
             { Value : customerName,    Label : '{i18n>C_CUSTOMER}' },
             { Value : startDate,   Label : '{i18n>C_START}' },
             { Value : endDate,     Label : '{i18n>C_END}' },
             { Value : assignmentStatus, Label : '{i18n>ASSIGNMENT_STATUS}' }
        ]
    }
);

// Field Level Annotations
annotate MyResourcesService.InternalWorkExperience with {
    resourceRequest_ID @UI.Hidden : true;
    workPackage       @UI.Hidden : true;
    assignedCapacity  @UI.Hidden : true;
    requestName       @Common.FieldControl : #ReadOnly  @UI.Importance : #High;
    requestDisplayId  @Common.FieldControl : #ReadOnly;
    workItemName      @Common.FieldControl : #ReadOnly;
    rolePlayed        @Common.FieldControl : #ReadOnly;
    customerName      @Common.FieldControl : #ReadOnly;
    companyName       @Common.FieldControl : #ReadOnly;
    startDate         @Common.FieldControl : #ReadOnly;
    endDate           @Common.FieldControl : #ReadOnly;
    convertedAssignedCapacity  @Common.FieldControl : #ReadOnly
    @title : '{i18n>C_ASSIGNED}';
    employee_ID       @UI.Hidden : true;
    assignment_ID     @UI.Hidden : true;
    assignmentStatus @Common.FieldControl : #ReadOnly
    @title     : '{i18n>ASSIGNMENT_STATUS}';
}

// Object Page Annotation
annotate MyResourcesService.InternalWorkExperience with @(
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
                { $Type : 'UI.DataField', Label : '{i18n>C_ASSIGNED}',   Value : convertedAssignedCapacity },
                { $Type:  'UI.DataField', Label : '{i18n>ASSIGNMENT_STATUS}', Value : assignmentStatus }
            ]
        },
        Facets : [

             { $Type: 'UI.CollectionFacet', ID: 'GeneralInformation', Label: '{i18n>C_GENERAL_INFORMATION}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target : '@UI.FieldGroup#GeneralInformation' }
                ]
            },

            { $Type: 'UI.CollectionFacet', ID: 'InternalWorkExperienceSkills', Label: '{i18n>CD_REQ_SKILLS}',
                Facets: [
                    { $Type : 'UI.ReferenceFacet', Target : 'internalWorkExperienceSkills/@UI.LineItem' }
                ]
            }
        ],

    }
);
