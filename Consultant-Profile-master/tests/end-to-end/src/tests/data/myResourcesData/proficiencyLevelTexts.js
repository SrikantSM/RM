const uuid = require('uuid').v4;
const { testRunId } = require('../testRunID.js');
const environment = require('../../../utils').getEnvironment();

const { seleniumTestName } = environment;
const { proficiencyLevels } = require('./proficiencyLevels');

const setOneProficiencyLevelText1 = {
    ID_texts: uuid(),
    name: `Level 1 of Set 1 ${testRunId} ${seleniumTestName}`,
    ID: proficiencyLevels[0].ID,
    locale: 'en',
    description: `Level 1 of Set 1 desc ${testRunId} ${seleniumTestName}`,
};
const setOneProficiencyLevelText2 = {
    ID_texts: uuid(),
    name: `Level 2 of Set 1 ${testRunId}`,
    ID: proficiencyLevels[1].ID,
    locale: 'en',
    description: `Level 2 of Set 1 desc ${testRunId} ${seleniumTestName}`,
};

const setTwoProficiencyLevelText1 = {
    ID_texts: uuid(),
    name: `Level 1 of Set 2 ${testRunId}`,
    ID: proficiencyLevels[2].ID,
    locale: 'en',
    description: `Level 1 of Set 2 desc ${testRunId} ${seleniumTestName}`,
};

const setTwoProficiencyLevelText2 = {
    ID_texts: uuid(),
    name: `Level 2 of Set 2 ${testRunId}`,
    ID: proficiencyLevels[3].ID,
    locale: 'en',
    description: `Level 2 of Set 2 desc ${testRunId} ${seleniumTestName}`,
};

const proficiencyLevelTexts = [
    setOneProficiencyLevelText1,
    setOneProficiencyLevelText2,
    setTwoProficiencyLevelText1,
    setTwoProficiencyLevelText2,
];

module.exports = { proficiencyLevelTexts };
