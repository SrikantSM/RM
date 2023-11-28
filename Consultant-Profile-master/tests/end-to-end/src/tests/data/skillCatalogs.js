const uuid = require('uuid').v4;
const { testRunId } = require('./testRunID.js');

const desc1 = 'Catalog desc One e2e test';
const desc2 = 'Catalog desc Two e2e test';
const desc3 = 'Catalog desc Three e2e test';

const catalogDesc1 = {
    description: desc1,
};

const catalogDesc2 = {
    description: desc2,
};

const catalogDesc3 = {
    description: desc3,
};

const allCatalogDesc = [
    catalogDesc1,
    catalogDesc2,
    catalogDesc3,
];

const catalog1 = {
    ID: uuid(),
    name: `Test Catalog One ${testRunId}`,
    description: desc1,
};

const catalog2 = {
    ID: uuid(),
    name: `Test Catalog Two ${testRunId}`,
    description: desc1,
};

const catalog3 = {
    ID: uuid(),
    name: `Test Catalog Three ${testRunId}`,
    description: desc3,
};

const catalogs = [
    catalog1,
    catalog2,
    catalog3,
];

module.exports = { catalogs, allCatalogDesc };
