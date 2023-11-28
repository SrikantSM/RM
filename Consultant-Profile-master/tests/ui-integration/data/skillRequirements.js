const uuid = require('uuid').v4;
const skilltext = require('./skillTexts');
const resourceRequest = require('./resourceRequest');
const proficiencyLevelData = require('./proficiencyLevels');

const skillRequirement1 = {
    ID: uuid(),
    RESOURCEREQUEST_ID: resourceRequest.resourceRequestData1.ID,
    SKILL_ID: skilltext.skillText1.ID,
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: proficiencyLevelData.firstProficiencyLevelSet1.ID,
};

const skillRequirement2 = {
    ID: uuid(),
    RESOURCEREQUEST_ID: resourceRequest.resourceRequestData2.ID,
    SKILL_ID: skilltext.skillText2.ID,
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: proficiencyLevelData.firstProficiencyLevelSet2.ID,
};

const skillRequirements = [
    skillRequirement1,
    skillRequirement2,
];

module.exports = {
    skillRequirements,
    skillRequirement1,
    skillRequirement2,
};
