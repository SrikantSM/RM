using com.sap.resourceManagement as rm from '../../db';
using com.sap.resourceManagement.workforce as workforce from '../../db/cds/worker';
using com.sap.resourceManagement.skill as skills from '@sap/rm-skill/db';

service MyResourcesService @(requires : 'authenticated-user') {

     // Root Entity to access Project Experience of Consultants
    @Capabilities.SearchRestrictions.Searchable : true
    entity ProjectExperienceHeader @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['MyResources.Read', 'MyResources.Edit'],
            // TODO: This is a workaround solution to support instance based authorization. Will be removed once we have concrete solution.
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)' 
        }
    ])  as projection on rm.employee.Headers;
    // Entity to access Consultant's Profile Data
    @Capabilities.SearchRestrictions.Searchable : true
    @readonly
    entity Profiles @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
        }
    ]) as projection on rm.employee.ProfileData;

     // Entity to read profile photo of Consultant
    @readonly
    entity ProfilePhoto @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.employee_ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)' 
        }
    ])  as projection on rm.employee.ProfilePhoto;

    // Entity to read CV of Consultant
    @Capabilities.Deletable: false
    @Capabilities.Insertable: false
    @Capabilities.Updatable: false
    @readOnly
    entity Attachment @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.employee_ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
        }
    ])  as projection on rm.employee.Attachment;

    // Entity to access Consultant's Manager Profile Data
    @readonly
    entity ManagerProfileData @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'toWorkerProfile.resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
        }
    ]) as projection on rm.employee.ManagerProfileData;

    // Entity to Assign Role to Conusltant
    @Capabilities.SearchRestrictions.Searchable : true
    entity Roles @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['MyResources.Read', 'MyResources.Edit'],
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.employee_ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
        }
    ])  as projection on rm.employee.priorExperience.RoleAssignments{ *, role : redirected to RoleMasterList };

    // Entity to Assign Skill/Alternate Skill to Conusltant
    entity Skills @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['MyResources.Read', 'MyResources.Edit'],
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.employee_ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
        }
    ])  as projection on rm.employee.qualifications.SkillAssignments { *, skill : redirected to SkillMasterListAll };

    // Entity to access Project RoleMasterList
    @readonly
    entity RoleMasterList @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on rm.config.ProjectRolesView {
        * ,
        @odata.Type : 'Edm.String'
        ID
    };

    @readonly
    entity WorkerType @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on rm.workforce.workAssignment.WorkerType;

     // Entity for value help to access only Unrestricted Project Role
    @readonly
    entity RoleValueHelpList @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on rm.config.UnRestrictedRolesConsumption {
        * ,
        @odata.Type : 'Edm.String'
        ID
    };

   // Entity to access unrestricted Skills from Catalog
    entity SkillMasterList @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on rm.employee.qualifications.UnRestrictedSkillsConsumption {
        * ,
        cast ('' as String) as commaSeparatedCatalogs: String,
        @odata.Type : 'Edm.String'
        ID,
        localized
    };

    entity CostCenterMasterList @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : '(resourceOrganizationID = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
        }
    ]) as projection on rm.organization.CostCenterItemsView;
    
    // Entity to access all Skills from Catalog
    @readonly
    entity SkillMasterListAll @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
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

    entity Catalogs2SkillsConsumption @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on skills.Catalogs2SkillsConsumption excluding { skill };

    entity CatalogsConsumption @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on skills.CatalogsConsumption;

    // Entity to access Proficiency levels
    entity ProficiencyLevels @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on skills.ProficiencyLevelsConsumption { * };

    // Entity to access Proficiency sets
    @readonly
    entity ProficiencySets @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read'
        }
    ]) as projection on skills.ProficiencySetsConsumption { *, skills : redirected to SkillMasterListAll };

    // Entity to access Consultant's InternalWorkExperience
    @readonly
    entity InternalWorkExperience @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'profile.resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'          
        }
    ]) as select from rm.employee.priorExperience.InternalWorkExperience order by startDate desc;

    // Entity to access Skills used during Consultant's InternalWorkExperience
    @readonly
    entity InternalWorkExperienceSkills @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'profile.resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
        }
    ]) as projection on rm.employee.priorExperience.InternalWorkExperienceSkills{ *, skill : redirected to SkillMasterListAll };

    // Entity to access Consultant's ExternalWorkExperience
    entity ExternalWorkExperience @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['MyResources.Read', 'MyResources.Edit'],
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.employee_ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
        }
    ],
    Capabilities : {
            SortRestrictions : {NonSortableProperties : [projectName]}
        }) as select from rm.employee.priorExperience.ExternalWorkExperience order by startDate desc;

    // Entity to access Skills used during Consultant's ExternalWorkExperience
    entity ExternalWorkExperienceSkills @(restrict : [
        {
            grant : ['READ', 'WRITE'],
            to    : ['MyResources.Read', 'MyResources.Edit'],
            where : 'exists (select 1 from MyResourcesService.Profiles where ID = $outer.employee_ID and resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'

        }
    ]) as projection on rm.employee.priorExperience.ExternalWorkExperienceSkills{ *, skill : redirected to SkillMasterListAll };

    // Entity to access the periodic availability data of employee
    @readonly
    entity PeriodicAvailability @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'profile.resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
        }
    ]) as projection on rm.employee.availability.PeriodicAvailability;

    // Entity to access the periodic utilization data of employee, Created this entity for the chart visualization
    @readonly
    entity PeriodicUtilization @(restrict : [
        {
            grant : ['READ'],
            to    : 'MyResources.Read',
            where : 'profile.resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
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
            to    : 'MyResources.Read',
            where : 'profile.resourceOrgId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
        }
    ]) as projection on rm.employee.availability.Utilization;

}
