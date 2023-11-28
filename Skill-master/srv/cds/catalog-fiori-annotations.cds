using CatalogService from './catalog-service';
using managed from './managed-fiori-annotations';

////////////////////////////////////////////////////////////////////////////
//
// Catalog List Report
//
annotate CatalogService.Catalogs with @(
  Capabilities : {
    SearchRestrictions.Searchable: true,
    DeleteRestrictions.Deletable: true
  },

  Capabilities.SortRestrictions : {
    Sortable              : true,
    NonSortableProperties : [ID]
  },

  UI: {
    LineItem:  [
        {Value: ID, Label: '{i18n>labelCatalogName}'},
        {Value: description, Label: '{i18n>labelCatalogDescription}'},
      ],
      
  },
  Common: {
    Label: '{i18n>labelCatalogs}',
    SemanticObject: 'SkillCatalog',
    SemanticKey: [ID],
    DraftRoot: {NewAction: 'CatalogService.createCatalogWithDialog'}
  }
);

@cds.search: { name, description }
annotate CatalogService.Catalogs with {
  ID @title:'{i18n>ID}' @UI.HiddenFilter @Common: { Text: name, TextArrangement: #TextOnly };
  name @title: '{i18n>labelCatalogName}' @Common.FieldControl: #Mandatory;
  description @title: '{i18n>labelCatalogDescription}' @UI.MultiLineText @Common.FieldControl: #Mandatory;
}

////////////////////////////////////////////////////////////////////////////
//
// Catalog Actions
//
annotate CatalogService.Catalogs actions {
  createCatalogWithDialog (
    name @Common: {
      FieldControl: #Mandatory,
      Label: '{i18n>labelCatalogName}'
    },
    description @(
      Common: {
        FieldControl: #Mandatory,
        Label: '{i18n>labelCatalogDescription}'
      },
      UI: {
        MultiLineText: true
      }
    )
  );
}

////////////////////////////////////////////////////////////////////////////
//
// Catalog Object page
//
annotate CatalogService.Catalogs with @(
  UI: {
  HeaderInfo: {
      TypeName: '{i18n>typeNameCatalogsSingular}',
      TypeNamePlural: '{i18n>typeNameCatalogsPlural}',
      Title: { Value: name },
      Description: { Value : description }
    },
  HeaderFacets: [
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData'}
    ],
   Facets: [
      {$Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleAssignedSkills}', Target: 'skillAssociations/@UI.LineItem'}
    ],
    FieldGroup#AdministrativeData: {
      Label: '{i18n>administrativeData}',
      Data: [
        {$Type: 'UI.DataField', Label:'{i18n>createdAt}', Value: createdAt},
        {$Type: 'UI.DataField', Label:'{i18n>modifiedBy}', Value: modifiedBy},
        {$Type: 'UI.DataField', Label:'{i18n>modifiedAt}', Value: modifiedAt}
      ]
    },
    PresentationVariant : {
      RequestAtLeast : [
        OID      ]
    }
  }
);
@cds.search :{ skill.name, skill.description }
annotate CatalogService.Catalogs2Skills with @(
  UI: {
  	HeaderInfo: {
      TypeName: '{i18n>typeNameSkillsSingular}',
  		TypeNamePlural: '{i18n>typeNameSkillsPlural}'
  	}
  },
  UI : {
     //Fields to be shown on List
     LineItem : [
       {Value: skill_ID, Label: '{i18n>labelSkillName}'},
       {Value: skill.description, Label: '{i18n>labelDescription}'}
     ]
  },
  Common.SideEffects: {
    SourceProperties: [
      skill_ID
    ],
    TargetEntities: [
      skill
    ]
  }
);

annotate CatalogService.Skills @(
  Common: {
    Label: '{i18n>labelSkills}',
    SemanticObject: 'Skill'
  }
);

annotate CatalogService.Skills with {
  ID @UI.HiddenFilter @title: '{i18n>labelSkillName}' @Common: { Text: name, TextArrangement: #TextOnly };
  name @title: '{i18n>labelSkillName}';
  description @readonly @title: '{i18n>labelDescription}' @UI.MultiLineText;
};

annotate CatalogService.Catalogs2Skills with {
  ID @UI.Hidden;
  catalog_ID @UI.Hidden;
  skill_ID @title: '{i18n>labelSkills}' @(
    Common : {
      FieldControl: #Mandatory,
      Text: skill.name, TextArrangement: #TextOnly,
      ValueListForValidation: '', //this makes the client validation to check against valueHelp values instead of datatype
      ValueList: {
        Label: '{i18n>labelSkills}',
        CollectionPath: 'Skills',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: skill_ID, ValueListProperty: 'ID' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'description' }
        ]
      },
      SemanticObject: 'Skill',
      SemanticObjectMapping: [
        {LocalProperty: skill_ID, SemanticObjectProperty: 'ID'}
      ],
      SemanticObjectUnavailableActions : ['Upload', 'Download']
    }
  );
};
