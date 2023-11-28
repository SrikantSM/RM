using ProjectExperienceService from '../projectExperienceService';
    

annotate ProjectExperienceService with @(
    Core.Description: 'Project Experience',
    Core.LongDescription: 'This API enables you to manage the project experience information of your workforce in SAP S/4HANA Cloud for projects, resource management. You can read, create, update, and delete the external work experience or a qualification of a workforce. For reasons of data protection and privacy, only batch requests are available.'
);
    

annotate ProjectExperienceService.Profiles with @(
    Core.LongDescription : 'Profiles',
    Core.Description                                                : 'Read the project experience information of your workforce.',
    Capabilities.ReadRestrictions.Description                       : 'Fetches profiles of all workers.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Fetches profile of a single worker.',
    Capabilities.Updatable                       : false,
    Capabilities.Deletable                       : false,
    Capabilities.Insertable                      : false,
);


annotate ProjectExperienceService.PrimaryWorkAssignment with @(
    Core.LongDescription : 'PrimaryWorkAssignment',
    Core.Description                                                : 'The current primary work assignment of the worker',
    Capabilities.ReadRestrictions.Description                       : 'Fetches the current primary work assignment of all workers.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Fetches the current primary work assignment of a single worker.',
    Capabilities.Updatable                       : false,
    Capabilities.Deletable                       : false,
    Capabilities.Insertable                      : false,
);


annotate ProjectExperienceService.SkillAssignments with @(
    Core.LongDescription : 'SkillAssignments',
    Core.Description                                                : 'The assignments of skills to the profile.',
    Capabilities.ReadRestrictions.Description                       : 'Fetches skills assignment of all workers.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Fetches skills assignment of a single worker.',
    Capabilities.UpdateRestrictions.Description                     : 'Updates skills assignment of a single worker.',
    Capabilities.InsertRestrictions.Description                     : 'Creates skills assignment of a single worker.',
    Capabilities.DeleteRestrictions.Description                     : 'Deletes skills assignment of a single worker.',
);


annotate ProjectExperienceService.ExternalWorkExperience with @(
    Core.LongDescription : 'ExternalWorkExperience',
    Core.Description                                                : 'The assignments that the worker completed in their previous companies.',
    Capabilities.ReadRestrictions.Description                       : 'Fetches external work experiences of all workers.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Fetches external work experiences of a single worker.',
    Capabilities.UpdateRestrictions.Description                     : 'Updates an external work experience of a single worker.',
    Capabilities.InsertRestrictions.Description                     : 'Creates an external work experience of a single worker.',
    Capabilities.DeleteRestrictions.Description                     : 'Deletes an external work experience of a single worker.',
);


annotate ProjectExperienceService.ExternalWorkExperienceSkillAssignments with @(
    Core.LongDescription : 'ExternalWorkExperienceSkillAssignments',
    Core.Description                                                : 'The assignments of skills to the external work experience entry.​',
    Capabilities.ReadRestrictions.Description                       : 'Fetches external work experience skills of all workers.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Fetches external work experience skills of a single worker.',
    Capabilities.UpdateRestrictions.Description                     : 'Updates the skill for an external work experience of a single worker.',
    Capabilities.InsertRestrictions.Description                     : 'Creates a skill for an external work experience of a single worker.',
    Capabilities.DeleteRestrictions.Description                     : 'Deletes a skill from an external work experience of a single worker.',
);


annotate ProjectExperienceService.Profiles with {

    @Core.Description: 'The identifier of the profile.'
    ID;
    
    @Core.Description: 'The identifier of the worker from the source system, for example, from SAP SuccessFactors.'
    workforcePersonExternalID;
    
    @Core.Description: 'The first name of the worker.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'John'
    }
    firstName;
    
    @Core.Description: 'The last name of the worker.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Doe'
    }
    lastName;

    @Core.Description: 'The email address of the worker.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'john.doe@abc.com'
    }
    emailAddress;
    
    @Core.Description: 'The cell phone number of the worker.'
    mobileNumber;

    @Core.Description: 'The date and time when the profile was lasted updated.'
    changedAt;

    @Core.Description: 'The current primary work assignment of the worker.'
    _primaryWorkAssignment;

    @Core.Description: 'The assignments of skills to the profile.'
    _skillAssignments;

    @Core.Description: 'The assignments that the worker completed in their previous companies.'
    _externalWorkExperience;
};


annotate ProjectExperienceService.PrimaryWorkAssignment with {

    @Core.Description: 'The identifier of the profile.'
    profileID;

    @Core.Description: 'The job title of the worker within the company.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Developer'
    }
    jobTitle;

    @Core.Description: 'The identifier of the work assignment of the worker''s manager.'
    managerWorkAssignmentExternalID;

    @Core.Description: 'The physical location of the worker''s office.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Walldorf'
    }
    officeLocation;

    @Core.Description: 'The identifier of the cost center that the worker belongs to.'
    costCenterID;

    @Core.Description: 'The display name of the cost center that the worker belongs to.'
    costCenterDisplayName;

    @Core.Description: 'The identifier of the work assignment.'
    workAssignmentID;

    @Core.Description: 'The identifier of the resource.'
    resourceID;
};


annotate ProjectExperienceService.SkillAssignments with {

    @Core.Description: 'The identifier of the skill assignment.'
    @Core.Computed
    ID;
    
    @Core.Description: 'The identifier of the profile.'
    profileID;
    
    @Core.Description: 'The identifier of the skill.'
    skillID;
    
    @Core.Description: 'The identifier of the proficiency level that the worker has in the skill.'
    proficiencyLevelID;

    @Core.Description: 'The name of the skill.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Java'
    }
    skillName;
    
    @Core.Description: 'The name of the proficiency level that the worker has in the skill.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Expert'
    }
    proficiencyLevelName;

    @Core.Description: 'The usage status of the skill. The usage of the skill can be restricted or unrestricted.'
    skillUsage;

    @Core.Description: 'The user by whom the skill assignment was last updated.'
    changedBy;

    @Core.Description: 'The date and time when the skill assignment was last updated.'
    changedAt;
};


annotate ProjectExperienceService.ExternalWorkExperience with {

    @Core.Description: 'The identifier of the external work experience entry.​'
    ID;
    
    @Core.Description: 'The identifier of the profile.'
    profileID;
    
    @Core.Description: 'The name of the company.'
    company;
    
    @Core.Description: 'The name of the project.'
    project;

    @Core.Description: 'The name of the customer.'
    customer;
    
    @Core.Description: 'The role of the worker in the project.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Consultant'
    }
    role;

    @Core.Description: 'The start date of the assignment or project.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '15.07.2022'
    }
    startDate;

    @Core.Description: 'The end date of the assignment or project.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '14.07.2023'
    }
    endDate;

    @Core.Description: 'Additional information about the assignment or project.'
    comments;

    @Core.Description: 'The assignments of skills to the external work experience entry.'
    _skillAssignments;

    @Core.Description: 'The user by whom the external work experience was last updated.'
    changedBy;

    @Core.Description: 'The date and time when the external work experience was last updated.'
    changedAt;
};


annotate ProjectExperienceService.ExternalWorkExperienceSkillAssignments with {

    @Core.Description: 'The identifier of the external work experience skill assignment.'
    ID;

    @Core.Description: 'The identifier of the external work experience entry.'
    externalWorkExperienceID;

    @Core.Description: 'The identifier of the profile.'
    profileID;
    
    @Core.Description: 'The identifier of the skill.'
    skillID;
    
    @Core.Description: 'The identifier of the proficiency level that the worker has in the skill.'
    proficiencyLevelID;

    @Core.Description: 'The name of the skill.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Java'
    }
    skillName;

    @Core.Description: 'The name of the proficiency level that the worker has in the skill.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'Expert'
    }
    proficiencyLevelName;

    @Core.Description: 'The usage status of the skill. The usage of the skill can be restricted or unrestricted.'
    skillUsage;

    @Core.Description: 'The user by whom the skill assignment for an external work experience was last updated.'
    changedBy;

    @Core.Description: 'The date and time when the skill assignment for an external work experience was last updated.'
    changedAt;
    
};
