using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.Catalogs2SkillsConsumption with {
    catalog @Search.cascade;
    // Value Help
    catalog_ID @(
      Common : {
          Label : '{i18n>SKILL_CATALOGS}',
          Text : 'catalog/name',
          TextArrangement : #TextOnly,
          ValueList : {
              CollectionPath: 'CatalogsConsumption',
              Parameters: [
                  { $Type:'Common.ValueListParameterInOut', LocalDataProperty: catalog_ID, ValueListProperty: 'ID' },
                  { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'description' },
              ]
          },
      }
    );
}
