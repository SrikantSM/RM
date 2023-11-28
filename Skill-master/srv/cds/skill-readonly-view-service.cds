using com.sap.resourceManagement.skill as rm from '../../db';

service SkillReadonlyViewService @(requires: 'authenticated-user') {
  @readonly
  entity LifecycleStatus as projection on rm.LifecycleStatus;

  @readonly
  entity AlternativeLabelsConsumption as projection on rm.AlternativeLabelsConsumption;

  @readonly
  entity CatalogsConsumption as projection on rm.CatalogsConsumption;

  @readonly
  entity Catalogs2SkillsConsumption as projection on rm.Catalogs2SkillsConsumption;

  @readonly
  entity SkillsConsumption as projection on rm.SkillsConsumption;

  @readonly
  entity ProficiencySetsConsumption as projection on rm.ProficiencySetsConsumption;

  @readonly
  entity ProficiencyLevelsConsumption as projection on rm.ProficiencyLevelsConsumption;
}
