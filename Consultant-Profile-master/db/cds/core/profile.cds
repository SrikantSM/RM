namespace com.sap.resourceManagement.profile;

using com.sap.resourceManagement.employee.ProfileDataBuilder as ProfileDataBuilder from './employee';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.workforce.workforcePerson  as workforcePerson from '../worker/WorkforcePersons';
using com.sap.resourceManagement.workforce.workAssignment   as workAssignment  from '../worker/WorkAssignments';
using com.sap.resourceManagement.employee.qualifications    as qualifications  from './qualifications';
using com.sap.resourceManagement.employee.priorExperience   as priorExperience from './priorExperience';

entity Profiles as select from employee.Headers mixin {
    _primaryWorkAssignment        :  Association to one PrimaryWorkAssignment on _primaryWorkAssignment.profileID = $projection.ID;
    _skillAssignments             :  Association to many SkillAssignments on _skillAssignments.profileID = $projection.ID;
    _externalWorkExperience       :  Association to many ExternalWorkExperience on _externalWorkExperience.profileID = $projection.ID;
} into {
    key ID,
    worker.externalID as workforcePersonExternalID,
    profile.firstName as firstName,
    profile.lastName as lastName,
    profile.emailAddress as emailAddress,
    profile.mobilePhoneNumber as mobileNumber,
    modifiedAt as changedAt,
    _primaryWorkAssignment,
    _skillAssignments,
    _externalWorkExperience,
};

entity PrimaryWorkAssignment as select from workforcePerson.WorkforcePersons mixin {
    currentWorkAssignment : Association to one workAssignment.PrimaryWorkAssignments on currentWorkAssignment.parent = $projection.profileID and currentWorkAssignment.validFrom <= $now and currentWorkAssignment.validTo > $now;
} into {
    key ID as profileID,
    currentWorkAssignment.currentJD.jobTitle as jobTitle,
    currentWorkAssignment.currentJD.supervisorWorkAssignmentExternalID as managerWorkAssignmentExternalID,
    currentWorkAssignment.currentJD.country_name as officeLocation,
    currentWorkAssignment.currentJD.costCenter.costCenterID as costCenterID,
    currentWorkAssignment.currentJD.costCenter.displayName as costCenterDisplayName,
    currentWorkAssignment.workAssignmentID as workAssignmentID,
    currentWorkAssignment.ID as resourceID,
};

entity SkillAssignments as select from qualifications.SkillAssignments {
    key ID,
    @mandatory
    employee_ID as profileID,
    @mandatory
    skill.ID as skillID,
    @mandatory
    proficiencyLevel_ID as proficiencyLevelID,
    @readonly
    skill.name as skillName,
    @readonly
    proficiencyLevel.name as proficiencyLevelName,
    @readonly
    skill.lifecycleStatus.code as skillUsage,
    @readonly
    modifiedBy as changedBy,
    @readonly
    modifiedAt as changedAt,
};


entity ExternalWorkExperience as select from priorExperience.ExternalWorkExperience mixin {
    _skillAssignments : Composition of many ExternalWorkExperienceSkillAssignments on _skillAssignments.externalWorkExperienceID = $projection.ID;
} into {
    key ID,
    @mandatory
    employee_ID as profileID,
    @mandatory
    companyName as company,
    @mandatory
    projectName as project,
    customer,
    @mandatory
    rolePlayed as role,
    @mandatory
    startDate,
    @mandatory
    endDate,
    comments,
    _skillAssignments,
    @readonly
    modifiedBy as changedBy,
    @readonly
    modifiedAt as changedAt,
};

entity ExternalWorkExperienceSkillAssignments as select from priorExperience.ExternalWorkExperienceSkills { 
    key ID,
    @mandatory
    workExperience.ID as externalWorkExperienceID,
    @mandatory
    employee_ID as profileID,
    @mandatory
    skill.ID as skillID,
    @mandatory
    proficiencyLevel_ID as proficiencyLevelID,
    @readonly
    skill.name as skillName,
    @readonly
    proficiencyLevel.name as proficiencyLevelName,
    @readonly
    skill.lifecycleStatus.code as skillUsage,
    @readonly
    modifiedBy as changedBy,
    @readonly
    modifiedAt as changedAt,
};
