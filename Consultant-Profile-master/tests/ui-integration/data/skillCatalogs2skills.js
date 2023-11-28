const uuid = require('uuid').v4;
const {
    catalog1, catalog2, catalog3, catalog4,
} = require('./skillCatalogs');
const {
    skill1, skill2, skill3, skill4, skill5,
} = require('./skills');

const c2s1 = {
    ID: uuid(),
    skill_ID: skill1.ID,
    catalog_ID: catalog1.ID,
};

const c2s2 = {
    ID: uuid(),
    skill_ID: skill2.ID,
    catalog_ID: catalog1.ID,
};

const c2s3 = {
    ID: uuid(),
    skill_ID: skill3.ID,
    catalog_ID: catalog1.ID,
};

const c2s4 = {
    ID: uuid(),
    skill_ID: skill4.ID,
    catalog_ID: catalog1.ID,
};

const c2s5 = {
    ID: uuid(),
    skill_ID: skill3.ID,
    catalog_ID: catalog2.ID,
};

const c2s6 = {
    ID: uuid(),
    skill_ID: skill4.ID,
    catalog_ID: catalog2.ID,
};

const c2s7 = {
    ID: uuid(),
    skill_ID: skill5.ID,
    catalog_ID: catalog2.ID,
};

const c2s8 = {
    ID: uuid(),
    skill_ID: skill2.ID,
    catalog_ID: catalog3.ID,
};

const c2s9 = {
    ID: uuid(),
    skill_ID: skill4.ID,
    catalog_ID: catalog3.ID,
};

const c2s10 = {
    ID: uuid(),
    skill_ID: skill5.ID,
    catalog_ID: catalog3.ID,
};

const c2s11 = {
    ID: uuid(),
    skill_ID: skill3.ID,
    catalog_ID: catalog4.ID,
};

const c2s12 = {
    ID: uuid(),
    skill_ID: skill4.ID,
    catalog_ID: catalog4.ID,
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
    c2s9,
    c2s10,
    c2s11,
    c2s12,
];

module.exports = {
    catalogs2skills,
};
