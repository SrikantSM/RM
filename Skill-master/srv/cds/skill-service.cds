using com.sap.resourceManagement.skill as rm from '../../db';
using sap.common as common from '@sap/cds/common';

service SkillService @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['CREATE', 'UPDATE', 'UPSERT', 'createSkillWithDialog', 'restrict', 'removeRestriction', 'assignCatalogs', 'unassignCatalogs'], to: 'Skills.Edit' },
  { grant: 'DELETE', to: 'Skills.Delete' }
]){

  @readonly
  entity LifecycleStatus as
    select from rm.LifecycleStatus {
      code,
      name,
      descr,
      case
        when code = 0 then true
        else false
      end as isUnrestricted: Boolean,
      case
        when code = 1 then true
        else false
      end as isRestricted: Boolean,
      /* Criticality values: 0 = no color, 1 = red (error), 2 = yellow (warning), 3 = green (success) */
      case
        when code = 0 then 3
        else 1
      end as criticality: Integer,
      case
        when code = 1 then 1
        else 0
      end as rowCriticality: Integer
    };

  @readonly
  entity LifecycleStatus.texts
  as projection on rm.LifecycleStatus.texts;

  @UI.DeleteHidden: {$edmJson: {$Ne: [
                    {$Path: 'OID'},
                    {$Null: null}
                ]}}
  @UI.UpdateHidden: {$edmJson: {$Ne: [
                    {$Path: 'OID'},
                    {$Null: null}
                ]}}
  entity Skills
  as projection on rm.Skills
  actions {
    @cds.odata.bindingparameter.collection
    action createSkillWithDialog (
      locale: String(14) @readonly,
      label: String not null,
      description: String not null
    ) returns Skills;

    action restrict () returns Skills;

    action removeRestriction () returns Skills;

    action assignCatalogs(
      catalog_IDs: many UUID
    );

    action unassignCatalogs(
      catalog_IDs: many UUID
    );

  };

  entity Skills.texts
  as projection on rm.Skills.texts;

  entity AlternativeLabels
  as projection on rm.AlternativeLabels;

  @readonly
  entity Catalogs2Skills
  as projection on rm.Catalogs2Skills {
    ID, skill, catalog, skill_ID, catalog_ID
  };

  @readonly
  entity Catalogs
  as projection on rm.Catalogs {
    ID, name, description, skillAssociations
  };

  @readonly
  entity ProficiencySets
  as projection on rm.ProficiencySets {
    ID, name, description, proficiencyLevels
  };

  @readonly
  entity ProficiencyLevels
  as projection on rm.ProficiencyLevels {
    ID, name, description, rank, localized, proficiencySet, proficiencySet_ID
  };

  @readonly
  entity ProficiencyLevels.texts
  as projection on rm.ProficiencyLevels.texts;

  @readonly
  entity DefaultLanguage
  as projection on rm.DefaultLanguage;

  @readonly
  entity Languages
  as projection on common.Languages;

  @readonly
  entity Languages.texts
  as projection on common.Languages.texts;

  annotate Skills with @odata.draft.enabled;
}
