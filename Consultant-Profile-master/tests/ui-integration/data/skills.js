const uuid = require('uuid').v4;
const { skillLifecycleStatus } = require('./skillLifecycleStatus');

const unrestrictedCode = skillLifecycleStatus[0].code;
const proficiencySets = require('./proficiencySets');

const skill1 = {
    ID: uuid(),
    externalID: uuid(),
    name: 'CDS test',
    description: 'CDS test desc',
    lifecycleStatus_code: unrestrictedCode,
    proficiencySet_ID: proficiencySets.proficiencySet1.ID,
};

const skill2 = {
    ID: uuid(),
    externalID: uuid(),
    name: 'NodeJS test',
    description: 'NodeJS test desc',
    lifecycleStatus_code: unrestrictedCode,
    proficiencySet_ID: proficiencySets.proficiencySet2.ID,
};

const skill3 = {
    ID: uuid(),
    externalID: uuid(),
    name: 'UI5 test',
    description: 'UI5 test desc',
    lifecycleStatus_code: unrestrictedCode,
    proficiencySet_ID: proficiencySets.proficiencySet3.ID,
};

const skill4 = {
    ID: uuid(),
    externalID: uuid(),
    name: 'Product Management test',
    description: 'Product Management test desc',
    lifecycleStatus_code: unrestrictedCode,
    proficiencySet_ID: proficiencySets.proficiencySet4.ID,
};

const skill5 = {
    ID: uuid(),
    externalID: uuid(),
    name: 'SAP Fiori test',
    description: 'Fiori test desc',
    lifecycleStatus_code: unrestrictedCode,
    proficiencySet_ID: proficiencySets.proficiencySet5.ID,
};

const skills = [
    skill1,
    skill2,
    skill3,
    skill4,
    skill5,
];

module.exports = {
    skills,
    skill1,
    skill2,
    skill3,
    skill4,
    skill5,
};
