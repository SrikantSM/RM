const uuid = require('uuid').v4;
const { catalogs } = require('./skillCatalogs');
const { skills } = require('./skills');

const c2s1 = {
    ID: uuid(),
    skill_ID: skills[0].ID,
    catalog_ID: catalogs[0].ID,
};

const c2s2 = {
    ID: uuid(),
    skill_ID: skills[1].ID,
    catalog_ID: catalogs[1].ID,
};

const c2s3 = {
    ID: uuid(),
    skill_ID: skills[2].ID,
    catalog_ID: catalogs[0].ID,
};

const c2s4 = {
    ID: uuid(),
    skill_ID: skills[3].ID,
    catalog_ID: catalogs[0].ID,
};

const c2s5 = {
    ID: uuid(),
    skill_ID: skills[2].ID,
    catalog_ID: catalogs[1].ID,
};

const c2s6 = {
    ID: uuid(),
    skill_ID: skills[3].ID,
    catalog_ID: catalogs[1].ID,
};

const c2s7 = {
    ID: uuid(),
    skill_ID: skills[4].ID,
    catalog_ID: catalogs[1].ID,
};

const c2s8 = {
    ID: uuid(),
    skill_ID: skills[6].ID,
    catalog_ID: catalogs[2].ID,
};

const catalogs2skills = [
    c2s1,
    c2s2,
    c2s3,
    c2s4,
    c2s5,
    c2s6,
    c2s7,
    c2s8,
];

module.exports = {
    catalogs2skills,
};
