using com.sap.resourceManagement as rm from '../../db';
using com.sap.resourceManagement.skill as skills from '@sap/rm-skill/db';

service MyProjectExperienceService @(requires : 'authenticated-user') {
    // Root Entity to access Project Experience of Consultants
    entity MyProjectExperienceHeader @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.ID and LOWER(emailAddress) = $user)'
        }
    ])  as projection on rm.employee.Headers;

    // Entity to access Consultant's Profile Data
    @readonly
    entity ProfileData @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(emailAddress) = $user'
        }
    ]) as projection on rm.employee.ProfileData;

    // Entity to store profile photo of Consultant
    entity ProfilePhoto @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.employee_ID and LOWER(emailAddress) = $user)'
        }
    ])  as projection on rm.employee.ProfilePhoto;

    // Entity to store CV of Consultant
    entity Attachment @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.employee_ID and LOWER(emailAddress) = $user)'
        }
    ])  as projection on rm.employee.Attachment;

    // Entity to access Consultant's Manager Profile Data
    @readonly
    entity ManagerProfileData @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(toWorkerProfile.emailAddress) = $user and toWorkerProfile.managerExternalID = externalID'
        }
    ]) as projection on rm.employee.ManagerProfileData;

    // Entity to Assign Role to Conusltant
    entity Roles @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.employee_ID and LOWER(emailAddress) = $user)'
        }
    ])  as projection on rm.employee.priorExperience.RoleAssignments{ *, role : redirected to RoleMasterList };

    // Entity to Assign Skill/Alternate Skill to Conusltant
    entity Skills @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.employee_ID and LOWER(emailAddress) = $user)'
        }
    ]) as projection on rm.employee.qualifications.SkillAssignments { *, skill : redirected to SkillMasterListAll };

    // Entity to access Proficiency levels
    @readonly
    entity ProficiencyLevels @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on skills.ProficiencyLevelsConsumption { * };

    // Entity to access Proficiency sets
            @readonly
            entity ProficiencySets @(restrict : [
                {
                    grant : ['READ'],
                    to    : 'ProjExp.Read'
                }
            ]) as projection on skills.ProficiencySetsConsumption { *, skills : redirected to SkillMasterListAll };

    // Entity to access Project RoleMasterList
    @readonly
    entity RoleMasterList @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on rm.config.ProjectRolesView {
        * ,
        @odata.Type : 'Edm.String'
        ID
    };

	 // Entity for value help to access only Unrestricted Project Role
    @readonly
    entity RoleValueHelpList @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on rm.config.UnRestrictedRolesConsumption {
        * ,
        @odata.Type : 'Edm.String'
        ID
    };

    @readonly
    entity WorkerType @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on rm.workforce.workAssignment.WorkerType;

    // Entity to access unrestricted Skills from Catalog
    @readonly
    entity SkillMasterList @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on rm.employee.qualifications.UnRestrictedSkillsConsumption {
        * ,
        cast ('' as String) as commaSeparatedCatalogs: String,
        @odata.Type : 'Edm.String'
        ID,
        localized
    };

    // Entity to access all Skills from Catalog
    @readonly
    entity SkillMasterListAll @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on skills.SkillsConsumption {
        @odata.Type : 'Edm.String'
        ID,
        catalogAssociations,
        name,
        description,
        commaSeparatedAlternativeLabels,
        lifecycleStatus_code,
        proficiencySet_ID,
        proficiencySet,
        localized
    };

    @readonly
    entity Catalogs2SkillsConsumption @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on skills.Catalogs2SkillsConsumption excluding { skill };

    @readonly
    entity CatalogsConsumption @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read'
        }
    ]) as projection on skills.CatalogsConsumption;

    // Entity to access Consultant's InternalWorkExperience
    @readonly
    entity InternalWorkExperience @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(profile.emailAddress) = $user and profile.ID = employee_ID'
        }
    ]) as select from rm.employee.priorExperience.InternalWorkExperience order by startDate desc;

    // Entity to access Skills used during Consultant's InternalWorkExperience
    @readonly
    entity InternalWorkExperienceSkills @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(profile.emailAddress) = $user and profile.ID = employee_ID'
        }
    ]) as projection on rm.employee.priorExperience.InternalWorkExperienceSkills{ *, skill : redirected to SkillMasterListAll };

    // Entity to access Consultant's ExternalWorkExperience
    entity ExternalWorkExperience @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.employee_ID and LOWER(emailAddress) = $user)'
        }
    ],
    Capabilities : {
        SortRestrictions : {NonSortableProperties : [projectName]}
    }) as select from rm.employee.priorExperience.ExternalWorkExperience order by startDate desc;

    // Entity to access Skills used during Consultant's ExternalWorkExperience
    entity ExternalWorkExperienceSkills @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['ProjExp.Read', 'ProjExp.Edit'],
            where : 'exists (select 1 from MyProjectExperienceService.ProfileData where ID = $outer.employee_ID and LOWER(emailAddress) = $user)'
        }
    ]) as projection on rm.employee.priorExperience.ExternalWorkExperienceSkills{ *, skill : redirected to SkillMasterListAll };

    // Entity to access the periodic availability data of employee
    @readonly
    entity PeriodicAvailability @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(profile.emailAddress) = $user and profile.ID = workforcePersonID'
        }
    ]) as projection on rm.employee.availability.PeriodicAvailability;

    // Entity to access the periodic utilization data of employee, Created this entity for the chart visualization
    @readonly
    entity PeriodicUtilization @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(profile.emailAddress) = $user and profile.ID = workforcePersonID'
        }
    ]) as projection on rm.employee.availability.PeriodicUtilization{
        ID,
        workforcePersonID,
        CALMONTH,
        utilizationPercentage,
        monthYear,
        profile
    };
    // Entity to access the utilization data of employee
    @readonly
    entity Utilization @(restrict : [
        {
            grant : ['READ'],
            to    : 'ProjExp.Read',
            where : 'LOWER(profile.emailAddress) = $user and profile.ID = workforcePersonID'
        }
    ]) as projection on rm.employee.availability.Utilization;
}
