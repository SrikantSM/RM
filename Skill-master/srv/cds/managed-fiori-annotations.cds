using {com.sap.resourceManagement.skill.managed} from '../../db';

annotate com.sap.resourceManagement.skill.managed with {
  createdAt @UI.HiddenFilter @Core.Immutable @readonly @title: '{i18n>createdAt}';
  modifiedBy @UI.HiddenFilter @readonly @title: '{i18n>modifiedBy}';
  modifiedAt @UI.HiddenFilter @readonly @title: '{i18n>modifiedAt}';
}
