const uuid = require('uuid').v4;
const skills = require('./skills');

const alternativeLabel1 = {
    ID: uuid(),
    name: 'CDS test',
    skill_ID: skills.skill1.ID,
    language_code: 'en',
};

const alternativeLabel2 = {
    ID: uuid(),
    name: 'NodeJS test',
    skill_ID: skills.skill2.ID,
    language_code: 'en',
};

const alternativeLabel3 = {
    ID: uuid(),
    name: 'UI5 test',
    skill_ID: skills.skill3.ID,
    language_code: 'en',
};

const alternativeLabel4 = {
    ID: uuid(),
    name: 'Product Management test',
    skill_ID: skills.skill4.ID,
    language_code: 'en',
};

const alternativeLabel5 = {
    ID: uuid(),
    name: 'SAP Fiori test',
    skill_ID: skills.skill5.ID,
    language_code: 'en',
};

const alternativeLabels = [
    alternativeLabel1,
    alternativeLabel2,
    alternativeLabel3,
    alternativeLabel4,
    alternativeLabel5,
];

module.exports = {
    alternativeLabels,
    alternativeLabel1,
    alternativeLabel2,
    alternativeLabel3,
    alternativeLabel4,
    alternativeLabel5,
};
