const uuid = require('uuid').v4;
const { testRunId } = require('../testRunID.js');
const { proficiencySets } = require('./proficiencySets');
const environment = require('../../../utils').getEnvironment();

const { seleniumTestName } = environment;

const skillName1 = {
    name: `CDS test ${testRunId} ${seleniumTestName}`,
};

const skillName2 = {
    name: `NodeJS ${testRunId} ${seleniumTestName}`,
};

const skillName3 = {
    name: `UI5 ${testRunId} ${seleniumTestName}`,
};

const skillName4 = {
    name: `Product Management ${testRunId} ${seleniumTestName}`,
};

const skillName5 = {
    name: `Fiori ${testRunId} ${seleniumTestName}`,
};

const skillName6 = {
    name: `CAP ${testRunId} ${seleniumTestName}`,
};

const skillName7 = {
    name: `Java ${testRunId} ${seleniumTestName}`,
};

const allSkillNames = [
    skillName1,
    skillName2,
    skillName3,
    skillName4,
    skillName5,
    skillName6,
    skillName7,
];

const skill1 = {
    ID: uuid(),
    description: `CDS desc ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `CDS alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySets[0].ID,
};

const skill2 = {
    ID: uuid(),
    description: `NodeJS desc ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `NodeJS alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySets[0].ID,
};

const skill3 = {
    ID: uuid(),
    description: `UI5 desc ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `UI5 alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySets[0].ID,
};

const skill4 = {
    ID: uuid(),
    description: `Product Management desc ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `Product Management alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySets[0].ID,
};

const skill5 = {
    ID: uuid(),
    description: `Fiori desc ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `Fiori alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySets[0].ID,
};

const skill6 = {
    ID: uuid(),
    description: `CAP desc ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `CAP alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 1,
    proficiencySet_ID: proficiencySets[0].ID,
};

const skill7 = {
    ID: uuid(),
    description: `Java ${testRunId} ${seleniumTestName}`,
    commaSeparatedAlternativeLabels: `Java alt name ${testRunId} ${seleniumTestName}`,
    externalID: uuid(),
    lifecycleStatus_code: 1,
    proficiencySet_ID: proficiencySets[1].ID,
};

Object.assign(skill1, skillName1);
Object.assign(skill2, skillName2);
Object.assign(skill3, skillName3);
Object.assign(skill4, skillName4);
Object.assign(skill5, skillName5);
Object.assign(skill6, skillName6);
Object.assign(skill7, skillName7);

const skills = [
    skill1,
    skill2,
    skill3,
    skill4,
    skill5,
    skill6,
    skill7,
];

module.exports = {
    allSkillNames, skills,
};
