import { Catalog } from 'test-commons';
import { v4 as uuid } from 'uuid';

const desc1 = 'Catalog desc One api test';
const desc2 = 'Catalog desc Two api test';

const catalogDesc1 = {
    description: desc1,
};

const catalogDesc2 = {
    description: desc2,
};

const allCatalogDesc = [
    catalogDesc1,
    catalogDesc2,
];

const catalog1: Catalog = {
    ID: uuid(),
    name: 'Test Catalog One',
    description: desc1,
};

const catalog2: Catalog = {
    ID: uuid(),
    name: 'Test Catalog Two',
    description: desc2,
};

const catalogs = [
    catalog1,
    catalog2,
];

export {
    catalogs,
    catalog1,
    catalog2,
    allCatalogDesc,
};
