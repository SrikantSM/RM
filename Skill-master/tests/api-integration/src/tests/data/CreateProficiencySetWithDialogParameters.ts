export interface CreateProficiencySetWithDialogParameters {
  name: string;
  description: string;
}

export const correctCreateProficiencySetWithDialogParameters: CreateProficiencySetWithDialogParameters = {
  name: 'Test Proficiency Set',
  description: 'Test Description',
} as any as CreateProficiencySetWithDialogParameters;

export const createProficiencySetWithDialogParametersWithEvilName: CreateProficiencySetWithDialogParameters = {
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: 'Test Description',
} as any as CreateProficiencySetWithDialogParameters;

export const createProficiencySetWithDialogParametersWithEvilDescription: CreateProficiencySetWithDialogParameters = {
  name: 'Test Proficiency Set',
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
} as any as CreateProficiencySetWithDialogParameters;

export const createProficiencySetWithDialogParametersWithForbiddenFirstCharacterInName: CreateProficiencySetWithDialogParameters = {
  name: '@evil csv injection',
  description: 'Test Description',
} as any as CreateProficiencySetWithDialogParameters;

export const createProficiencySetWithDialogParametersWithNullDescription: CreateProficiencySetWithDialogParameters = {
  name: 'Test Proficiency Set',
} as any as CreateProficiencySetWithDialogParameters;

export const createProficiencySetWithDialogParametersWithNullName: CreateProficiencySetWithDialogParameters = {
  description: 'Test Description',
} as any as CreateProficiencySetWithDialogParameters;
