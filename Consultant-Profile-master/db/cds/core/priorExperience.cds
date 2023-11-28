namespace com.sap.resourceManagement.employee.priorExperience;

using {managed} from '@sap/cds/common';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.config as roles from './config';
using com.sap.resourceManagement.skill as skills from '@sap/rm-skill/db';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db/cds/assignment';
using com.sap.resourceManagement.resourceRequest as request from '@sap/rm-resourceRequest/db/cds/resourceRequest';

@cds.search : {role.name}
entity RoleAssignments : managed {
    key ID          : cds.UUID;
        employee_ID : cds.UUID;
        employee    : Association to employee.Headers
                          on employee.ID = employee_ID;
        profile     : Association to employee.ProfileData
                          on profile.ID = employee_ID;
        role        : Association to roles.ProjectRolesView;
}

//Created for PDM
entity ConsultantRoles as select from RoleAssignments{
    ID,
    employee_ID,
    role.ID as role_ID,
    role.name as role_name
};

entity InternalWorkExperience as select from assignment.AssignmentRequestDetailsView mixin {
    profile  : Association to employee.ProfileData on profile.ID = $projection.employee_ID;
    employee : Association to employee.Headers on employee.ID = $projection.employee_ID;
    internalWorkExperienceSkills : Association to many InternalWorkExperienceSkills
                                        on internalWorkExperienceSkills.assignment_ID = assignment_ID;
} into {
    key assignment_ID,
        resourceRequest_ID,
        assignmentStatus.name as assignmentStatus,
        startDate,
        endDate,
        assignedCapacity,
        ResourceRequest.projectRoleName as rolePlayed,
        ResourceRequest.requestedResourceOrg.name as companyName,
        ResourceRequest.customerName as customerName,
        ResourceRequest.name as requestName,
        ResourceRequest.displayId as requestDisplayId,
        ResourceRequest.workItemName as workItemName,
        employee_ID,
        cast (assignedCapacityinHour as String(20))   as convertedAssignedCapacity: String(20),
         // Associations
        employee,
        profile,
        internalWorkExperienceSkills,
} where assignmentStatus.code = 0 or assignmentStatus.code = 1; // 0 - Hardbooked, 1 - Softbooked

entity AssignmentSkillsBuilder as select from assignment.AssignmentRequestDetailsView
{
    assignment_ID,
    employee_ID,
    SkillRequirements.skillId as skillId,
    SkillRequirements.proficiencyLevelId as proficiencyLevelId,
    SkillRequirements.resourceRequestId as resourceRequest_ID,
};

entity InternalWorkExperienceSkills as select from AssignmentSkillsBuilder mixin {
    profile             : Association to employee.ProfileData on profile.ID = $projection.employee_ID;
    skill               : Association to skills.SkillsConsumption on skill.ID = skillId;
    proficiencyLevel    : Association to skills.ProficiencyLevelsConsumption on proficiencyLevel.ID = proficiencyLevelId;
} into {
    assignment_ID,
    employee_ID,
    skillId,
    proficiencyLevelId,
    profile,
    skill,
    proficiencyLevel,
} where skillId is not NULL;

@assert.unique: {
  uniqueExperience: [ companyName, projectName, rolePlayed, startDate, endDate, employee_ID ],
}
entity ExternalWorkExperience : managed {
    key ID                : cds.UUID;
        companyName       : String(100) @mandatory;
        projectName       : String(40)  @mandatory;
        workPackage       : String(40);
        customer          : String(100);
        rolePlayed        : String(100) @mandatory;
        startDate         : Date        @mandatory;
        endDate           : Date        @mandatory;
        comments          : String(2096);
        employee_ID       : cds.UUID;
        externalWorkExperienceSkills    : Composition of many ExternalWorkExperienceSkills  on externalWorkExperienceSkills.workExperience= $self;
        employee                        : Association to employee.Headers on employee.ID = employee_ID;
        profile                         : Association to employee.ProfileData on profile.ID = employee_ID;
};

@assert.unique: {
  uniqueExperience: [ workExperience, skill, employee_ID, proficiencyLevel_ID ],
}
entity ExternalWorkExperienceSkills : managed {
    key ID                  : cds.UUID;
        workExperience      : Association to ExternalWorkExperience;
        skill               : Association to skills.SkillsConsumption;
        employee_ID         : cds.UUID;
        profile             : Association to employee.ProfileData
                                on profile.ID = employee_ID;
        proficiencyLevel_ID : cds.UUID;
        proficiencyLevel    : Association to skills.ProficiencyLevelsConsumption on proficiencyLevel.ID = proficiencyLevel_ID;
        virtual proficiencyLevelEditMode: Integer;
};

