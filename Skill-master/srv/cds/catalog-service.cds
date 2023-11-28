using com.sap.resourceManagement.skill as rm from '../../db';

service CatalogService @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['CREATE', 'UPDATE', 'UPSERT', 'createCatalogWithDialog'], to: 'SkillCatalogs.Edit' },
  { grant: 'DELETE', to: 'SkillCatalogs.Delete' }
]){
  @UI.DeleteHidden: {$edmJson: {$Ne: [
                    {$Path: 'OID'},
                    {$Null: null}
                ]}}
  @UI.UpdateHidden: {$edmJson: {$Ne: [
                    {$Path: 'OID'},
                    {$Null: null}
                ]}}
  entity Catalogs
  as projection on rm.Catalogs
  actions {
    @cds.odata.bindingparameter.collection
    action createCatalogWithDialog (
      name: String not null,
      description: String not null
    ) returns Catalogs;
  };

  entity Catalogs2Skills as projection on rm.Catalogs2Skills;

  @readonly
  entity Skills
  as projection on rm.Skills {
    ID, name, description, localized
  };
  
  @readonly
  entity Skills.texts
  as projection on rm.Skills.texts;

  annotate Catalogs with @odata.draft.enabled;
}
