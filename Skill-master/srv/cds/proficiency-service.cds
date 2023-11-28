using com.sap.resourceManagement.skill as rm from '../../db';
using sap.common as common from '@sap/cds/common';

service ProficiencyService @(restrict: [
  { grant: ['READ'], to: 'authenticated-user' },
  { grant: ['CREATE', 'UPDATE', 'UPSERT', 'createProficiencySetWithDialog', 'moveUp', 'moveDown'], to: 'Proficiencies.Edit' },
  { grant: 'DELETE', to: 'Proficiencies.Delete' }
]){
  @UI.DeleteHidden: {$edmJson: {$Ne: [
                    {$Path: 'OID'},
                    {$Null: null}
                ]}}
  @UI.UpdateHidden: {$edmJson: {$Ne: [
                    {$Path: 'OID'},
                    {$Null: null}
                ]}}
  entity ProficiencySets
  as projection on rm.ProficiencySets
  actions {
    @cds.odata.bindingparameter.collection
    action createProficiencySetWithDialog (
      name: String not null,
      description: String not null
    ) returns ProficiencySets;

    // "Overwrite" the default draftEdit action, so it is available to be annotated
    action draftEdit(PreserveChanges: Boolean) returns ProficiencySets;
  };

  entity ProficiencyLevels
  as projection on rm.ProficiencyLevels;

  entity ProficiencyLevels.texts
  as projection on rm.ProficiencyLevels.texts;

  @readonly
  entity Skills
  as projection on rm.Skills {
    ID, name, description, proficiencySet_ID, proficiencySet, localized
  };

  @readonly
  entity Skills.texts
  as projection on rm.Skills.texts;

  @readonly
  entity Languages
  as projection on common.Languages;

  @readonly
  entity Languages.texts
  as projection on common.Languages.texts;

  entity DefaultLanguage
  as projection on rm.DefaultLanguage;

  annotate ProficiencySets with @odata.draft.enabled;
}

