namespace com.sap.resourceManagement.resourceRequest;

using com.sap.resourceManagement.resourceRequest as resourceRequest from '../resourceRequest';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.employee.qualifications as employee from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.skill as skill from '@sap/rm-skill/db';
using com.sap.resourceManagement.employee.availability as availability from '@sap/rm-consultantProfile/db';

view ResourceSkills as
 select from employee.ConsultantSkills as  consutantSkills
 inner join resource.ResourceDetails as resource
 on consutantSkills.employee_ID = resource.workforcePersonID
 {

    Key   resource.resource_ID as resourceID,
    Key   consutantSkills.skill_ID    as skillID,
          resource.fullName    as resourceName,
          consutantSkills.skill_name  as skillName,
          consutantSkills.proficiencyLevel_ID   as proficiencyLevelID,
          consutantSkills.proficiencyLevel_name as proficiencyLevelName,
          consutantSkills.proficiencyLevel_rank as proficiencyLevelRank
 };

@cds.autoexpose
view CompareResourceSkills as
  select from resourceRequest.SkillRequirementsView as requestSkills
  inner join ResourceSkills as resourceSkills
    on requestSkills.skillId = resourceSkills.skillID
  {
    key requestSkills.resourceRequestId,
    key resourceSkills.resourceID,
    key requestSkills.skillId,
        resourceSkills.skillName,
        requestSkills.proficiencyLevelId  as requestedProficiencyLevelID,
        requestSkills.proficiencyLevelRank as requestProficiencyLevelRank,
        resourceSkills.proficiencyLevelID as resourceProficiencyLevelID,
        resourceSkills.proficiencyLevelName as resourceProficiencyLevelName,
        resourceSkills.proficiencyLevelRank as resourceProficiencyLevelRank,
        requestSkills.proficiencySetMaxRank,
        requestSkills.importanceCode      as importance,
  };
