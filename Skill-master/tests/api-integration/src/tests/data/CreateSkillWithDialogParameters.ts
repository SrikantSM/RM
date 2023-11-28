export interface CreateSkillWithDialogParameters {
  label: string;
  description: string;
}

export const correctCreateSkillWithDialogParameters: CreateSkillWithDialogParameters = {
  label: 'Test Label',
  description: 'Test Description',
} as any as CreateSkillWithDialogParameters;

export const createSkillWithDialogParametersInjection: CreateSkillWithDialogParameters = {
  label: '@<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: '@<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
} as any as CreateSkillWithDialogParameters;

export const createSkillWithDialogParametersWithNullDescription: CreateSkillWithDialogParameters = {
  label: 'Test Label',
} as any as CreateSkillWithDialogParameters;

export const createSkillWithDialogParametersWithNullSkillText: CreateSkillWithDialogParameters = {
  description: 'Test Description',
} as any as CreateSkillWithDialogParameters;
