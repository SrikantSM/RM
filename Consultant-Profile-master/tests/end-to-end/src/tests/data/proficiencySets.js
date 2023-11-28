const uuid = require('uuid').v4;
const environment = require('../../utils').getEnvironment();

const { seleniumTestName } = environment;

const proficiencySetOne = {
    ID: uuid(),
    name: `Proficiency Set One ${seleniumTestName}`,
    description: `Proficiency Set One ${seleniumTestName}`,
    isCustom: true,
};

const proficiencySetTwo = {
    ID: uuid(),
    name: `Proficiency Set Two ${seleniumTestName}`,
    description: `Proficiency Set Two ${seleniumTestName}`,
    isCustom: true,
};

const proficiencySetOneName = {
    name: `Proficiency Set One ${seleniumTestName}`,
};

const proficiencySetTwoName = {
    name: `Proficiency Set Two ${seleniumTestName}`,
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
