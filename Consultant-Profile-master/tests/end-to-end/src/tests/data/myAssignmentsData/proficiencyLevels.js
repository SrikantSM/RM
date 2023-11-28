const uuid = require('uuid').v4;
const { testRunId } = require('../testRunID.js');
const environment = require('../../../utils').getEnvironment();
const { proficiencySets } = require('./proficiencySets');

const { seleniumTestName } = environment;

const setOneProficiencyLevelName1 = {
    name: `Level 1 of Set 1 ${testRunId} ${seleniumTestName}`,
};

const setOneProficiencyLevelName2 = {
    name: `Level 2 of Set 1 ${testRunId} ${seleniumTestName}`,
};

const setTwoProficiencyLevelName1 = {
    name: `Level 1 of Set 2 ${testRunId} ${seleniumTestName}`,
};

const setTwoProficiencyLevelName2 = {
    name: `Level 2 of Set 2 ${testRunId} ${seleniumTestName}`,
};

const allProficiencyLevelNames = [
    setOneProficiencyLevelName1,
    setOneProficiencyLevelName2,
    setTwoProficiencyLevelName1,
    setTwoProficiencyLevelName2,
];

const setOneProficiencyLevel1 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets[0].ID,
    description: `Level 1 of Set 1 desc ${testRunId} ${seleniumTestName}`,
    rank: 1,
};

const setOneProficiencyLevel2 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets[0].ID,
    description: `Level 2 of Set 1 desc ${testRunId} ${seleniumTestName}`,
    rank: 2,
};

const setTwoProficiencyLevel1 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets[1].ID,
    description: `Level 1 of Set 2 desc ${testRunId} ${seleniumTestName}`,
    rank: 1,
};

const setTwoProficiencyLevel2 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets[1].ID,
    description: `Level 2 of Set 2 desc ${testRunId} ${seleniumTestName}`,
    rank: 2,
};

Object.assign(setOneProficiencyLevel1, setOneProficiencyLevelName1);
Object.assign(setOneProficiencyLevel2, setOneProficiencyLevelName2);
Object.assign(setTwoProficiencyLevel1, setTwoProficiencyLevelName1);
Object.assign(setTwoProficiencyLevel2, setTwoProficiencyLevelName2);

const proficiencyLevels = [
    setOneProficiencyLevel1,
    setOneProficiencyLevel2,
    setTwoProficiencyLevel1,
    setTwoProficiencyLevel2,
];

module.exports = {
    allProficiencyLevelNames, proficiencyLevels,
};
