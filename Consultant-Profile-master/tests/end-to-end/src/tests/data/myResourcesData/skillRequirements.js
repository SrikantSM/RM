const uuid = require('uuid').v4;
const { skillTexts } = require('./skillTexts');
const { resourceRequestData } = require('./resourceRequest');
const { proficiencyLevels } = require('./proficiencyLevels');

const skillRequirement1 = {
    ID: uuid(),
    RESOURCEREQUEST_ID: resourceRequestData[0].ID,
    SKILL_ID: skillTexts[0].ID,
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: proficiencyLevels[1].ID,
};

const skillRequirements = [
    skillRequirement1,
];

module.exports = { skillRequirements };
