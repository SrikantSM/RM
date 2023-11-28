using ManageResourceRequestService from '../../services/manage';
@cds.search: {catalogAssociations.catalog.name}
annotate ManageResourceRequestService.SkillsConsumptionVH with {
  ID
  @(
    UI.HiddenFilter: true,
    Common    : {
      Label : '{i18n>SKILL}',
      FieldControl : #ReadOnly,
      Text         : {
        $value                : name,
        @UI.TextArrangement : #TextOnly
      }
    }
  );
  name
  @(
    Search.defaultSearchElement : true,
    Common                      : {Label : '{i18n>SKILL}', }
  );
  description
  @(
    Search.defaultSearchElement : true,
    Common                      : {Label : '{i18n>DESCRIPTION}', }
  );
  commaSeparatedAlternativeLabels
  @(
    Search.defaultSearchElement : true,
    Common                      : {Label : '{i18n>SKILL_ALTERNATE_LABELS}', }
  );
  commaSeparatedCatalogs
  @(
    Common                      : {Label : '{i18n>SKILL_CATALOGS}', }
  );
  catalogAssociations @Search.cascade;
  code
  @UI.Hidden : true;
  externalID
  @UI.Hidden : true;
  lifecycleStatus_code
  @UI.Hidden: true;
  proficiencySet_ID
  @UI.Hidden: true;
};

// Skill Value Help
annotate ManageResourceRequestService.SkillsConsumptionVH with @(
    UI : {
         SelectionFields : [commaSeparatedAlternativeLabels, name, description, 'catalogAssociations/catalog/name'],
         }
);
