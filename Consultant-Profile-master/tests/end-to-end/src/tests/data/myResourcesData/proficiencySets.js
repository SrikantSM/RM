const uuid = require('uuid').v4;
const environment = require('../../../utils').getEnvironment();
const { testRunId } = require('../testRunID.js');

const { seleniumTestName } = environment;

const proficiencySetOne = {
    ID: uuid(),
    name: `Proficiency Set One ${testRunId} ${seleniumTestName}`,
    description: `Proficiency Set One ${testRunId} ${seleniumTestName}`,
    isCustom: true,
};

const proficiencySetTwo = {
    ID: uuid(),
    name: `Proficiency Set Two ${testRunId} ${seleniumTestName}`,
    description: `Proficiency Set Two ${testRunId} ${seleniumTestName}`,
    isCustom: true,
};

const proficiencySetOneName = {
    name: `Proficiency Set One ${testRunId} ${seleniumTestName}`,
};

const proficiencySetTwoName = {
    name: `Proficiency Set Two ${testRunId} ${seleniumTestName}`,
};

Object.assign(proficiencySetOne, proficiencySetOneName);
Object.assign(proficiencySetTwo, proficiencySetTwoName);

const proficiencySets = [
    proficiencySetOne,
    proficiencySetTwo,
];

const allProficiencySetNames = [
    proficiencySetOneName,
    proficiencySetTwoName,
];

module.exports = {
    proficiencySets, allProficiencySetNames,
};
