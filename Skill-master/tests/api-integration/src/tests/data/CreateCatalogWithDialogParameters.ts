export interface CreateCatalogWithDialogParameters {
  name: string;
  description: string;
}

export const correctCreateCatalogWithDialogParameters: CreateCatalogWithDialogParameters = {
  name: 'Test Catalog',
  description: 'Test Description',
} as any as CreateCatalogWithDialogParameters;

export const createCatalogWithDialogParametersWithEvilName: CreateCatalogWithDialogParameters = {
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: 'Test Description',
} as any as CreateCatalogWithDialogParameters;

export const createCatalogWithDialogParametersWithEvilDescription: CreateCatalogWithDialogParameters = {
  name: 'Test Catalog',
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
} as any as CreateCatalogWithDialogParameters;

export const createCatalogWithDialogParametersWithForbiddenFirstCharacterInName: CreateCatalogWithDialogParameters = {
  name: '@evil csv injection',
  description: 'Test Description',
} as any as CreateCatalogWithDialogParameters;

export const createCatalogWithDialogParametersWithNullDescription: CreateCatalogWithDialogParameters = {
  name: 'Test Catalog',
} as any as CreateCatalogWithDialogParameters;

export const createCatalogWithDialogParametersWithNullCatalogText: CreateCatalogWithDialogParameters = {
  description: 'Test Description',
} as any as CreateCatalogWithDialogParameters;
