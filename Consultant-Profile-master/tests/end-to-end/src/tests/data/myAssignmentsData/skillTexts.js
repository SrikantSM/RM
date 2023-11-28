const uuid = require('uuid').v4;
const { testRunId } = require('../testRunID.js');
const environment = require('../../../utils').getEnvironment();

const { seleniumTestName } = environment;
const { skills } = require('./skills');

const skillText1 = {
    ID_texts: uuid(),
    name: `CDS test${testRunId}`,
    ID: skills[0].ID,
    locale: 'en',
    description: `CDS test desc ${testRunId} ${seleniumTestName}`,
};
const skillText2 = {
    ID_texts: uuid(),
    name: `NodeJS test${testRunId}`,
    ID: skills[1].ID,
    locale: 'en',
    description: `NodeJS test desc ${testRunId} ${seleniumTestName}`,
};
const skillText3 = {
    ID_texts: uuid(),
    name: `UI5 test${testRunId}`,
    ID: skills[2].ID,
    locale: 'en',
    description: `UI5 test desc ${testRunId} ${seleniumTestName}`,
};
const skillText4 = {
    ID_texts: uuid(),
    name: `Product Management test${testRunId}`,
    ID: skills[3].ID,
    locale: 'en',
    description: `Product Management test desc ${testRunId} ${seleniumTestName}`,
};
const skillText5 = {
    ID_texts: uuid(),
    name: `Fiori test${testRunId}`,
    ID: skills[4].ID,
    locale: 'en',
    description: `Fiori test desc ${testRunId} ${seleniumTestName}`,
};
const skillTexts = [
    skillText1,
    skillText2,
    skillText3,
    skillText4,
    skillText5,
];

module.exports = { skillTexts };
