const uuid = require('uuid').v4;

const catalog1 = {
    ID: uuid(),
    name: 'Test Catalog One',
    description: 'Desc Test Catalog One',
};

const catalog2 = {
    ID: uuid(),
    name: 'Test Catalog Two',
    description: 'Desc Test Catalog Two',
};

const catalog3 = {
    ID: uuid(),
    name: 'Test Catalog Three',
    description: 'Desc Test Catalog Three',
};

const catalog4 = {
    ID: uuid(),
    name: 'Test Catalog Four',
    description: 'Desc Test Catalog Four',
};

const catalogs = [
    catalog1,
    catalog2,
    catalog3,
    catalog4,
];

module.exports = {
    catalogs,
    catalog1,
    catalog2,
    catalog3,
    catalog4,
};
