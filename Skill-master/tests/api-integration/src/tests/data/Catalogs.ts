import { Catalog } from 'test-commons';
import { v4 as uuid } from 'uuid';

export const correctCatalog: Catalog = {
  ID: uuid(),
  name: uuid(),
  description: 'IT-Skills',
};

export const mdiCatalog: Catalog = {
  ID: uuid(),
  OID: uuid(),
  name: uuid(),
  description: 'IT-Skills',
};

export const catalog1: Catalog = {
  ID: uuid(),
  name: 'catalogAPI1',
  description: 'IT-Skills',
};

export const catalog2: Catalog = {
  ID: uuid(),
  name: 'catalogAPI2',
  description: 'IT-Skills',
};

export const catalogWithExistingName: Catalog = {
  ID: uuid(),
  name: correctCatalog.name,
  description: 'catalogWithExistingName description',
};

export const catalogWithNullName: Catalog = {
  ID: uuid(),
  name: null,
  description: 'catalogWithNullName description',
} as any as Catalog;

export const catalogWithEmptyName: Catalog = {
  ID: uuid(),
  name: '',
  description: 'catalogWithEmptyName description',
};

export const catalogWithNullDescription: Catalog = {
  ID: uuid(),
  name: 'catalogWithNullDescription name',
  description: null,
} as any as Catalog;

export const catalogWithEmptyDescription: Catalog = {
  ID: uuid(),
  name: 'catalogWithEmptyDescription name',
  description: '',
};

export const catalogWithEvilName: Catalog = {
  ID: uuid(),
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: 'catalogWithEvilName description',
};

export const catalogWithEvilDescription: Catalog = {
  ID: uuid(),
  name: 'catalogWithEvilDescription name',
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
};
