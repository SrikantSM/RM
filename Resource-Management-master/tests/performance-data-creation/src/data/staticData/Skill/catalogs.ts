import { Catalog } from 'test-commons';
import { NUMBER_OF_CATALOGS, CATALOG_ID_TEMPLATE } from './config';
import { predictableUuid } from '../../../utils';

const catalogs: Catalog[] = [];

for (let i = 0; i < NUMBER_OF_CATALOGS; i += 1) {
  const catalog: Catalog = {
    ID: predictableUuid(CATALOG_ID_TEMPLATE, i),
    name: `Catalog Name ${i}`,
    description: `Catalog Description ${i}`,
  };
  catalogs.push(catalog);
}

export { catalogs };
