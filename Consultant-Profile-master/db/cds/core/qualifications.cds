namespace com.sap.resourceManagement.employee.qualifications;

using { managed } from '@sap/cds/common';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.skill as skills from '@sap/rm-skill/db';

@cds.search : {skill.name}
@assert.unique: {
  uniqueAssignment: [ employee_ID, skill, proficiencyLevel_ID ],
}
entity SkillAssignments : managed {
    key ID                  : cds.UUID;
        employee_ID         : cds.UUID;
        proficiencyLevel_ID : cds.UUID;
        employee            : Association to employee.Headers on employee.ID = employee_ID;
        profile             : Association to employee.ProfileData on profile.ID = employee_ID;
        skill               : Association to skills.SkillsConsumption;
        proficiencyLevel    : Association to skills.ProficiencyLevelsConsumption on proficiencyLevel.ID = proficiencyLevel_ID;
        virtual proficiencyLevelEditMode: Integer;
}

entity ConsultantSkills as select from SkillAssignments {
    ID,
    employee_ID,
    skill.ID as skill_ID,
    skill.name as skill_name,
    skill.lifecycleStatus.code as lifecycleStatus_code,
    proficiencyLevel.name as proficiencyLevel_name,
    proficiencyLevel.description as proficiencyLevel_description,
    proficiencyLevel.rank as proficiencyLevel_rank,
    proficiencyLevel_ID,
    proficiencyLevel
};

view UnRestrictedSkillsConsumption as select from skills.SkillsConsumption {
    ID,
    catalogAssociations,
    commaSeparatedAlternativeLabels,
    description,
    name,
    lifecycleStatus_code,
    proficiencySet_ID,
    localized
} where
    lifecycleStatus.code = 0;
