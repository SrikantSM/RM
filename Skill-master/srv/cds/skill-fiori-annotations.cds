using SkillService from './skill-service';
using managed from './managed-fiori-annotations';

////////////////////////////////////////////////////////////////////////////
//
// Skill List Report
//
annotate SkillService.Skills with @(
  Capabilities: {
    SearchRestrictions.Searchable: true,
    DeleteRestrictions.Deletable: false
  },

  Capabilities.SortRestrictions : {
    Sortable              : true,
    NonSortableProperties : [ID, commaSeparatedLanguages]
  },

  UI: {
    SelectionFields: [name, 'texts/locale', 'catalogAssociations/catalog_ID', proficiencySet_ID],

    LineItem: {
      @UI.Criticality: lifecycleStatus.rowCriticality,
      $value : [
        {$Type: 'UI.DataFieldForIntentBasedNavigation', Label: '{i18n>buttonLabelUploadSkills}', SemanticObject: 'Skill', Action: 'Upload', RequiresContext: false},
        {$Type: 'UI.DataFieldForIntentBasedNavigation', Label: '{i18n>buttonLabelDownloadSkills}', SemanticObject: 'Skill', Action: 'Download', RequiresContext: false},
        {Value: ID , Label: '{i18n>labelSkillName}'},
        {Value: commaSeparatedAlternativeLabels , Label: '{i18n>labelAlternativeNames}'},
        {Value: commaSeparatedCatalogs , Label: '{i18n>labelCatalogsColumn}'},
        {Value: commaSeparatedLanguages , Label: '{i18n>labelLanguagesColumn}'},
        {$Type:'UI.DataField', Value: lifecycleStatus_code, Label: '{i18n>labelLifecycleStatus}', Criticality: lifecycleStatus.criticality, CriticalityRepresentation: #WithoutIcon, @HTML5.CssDefaults: { width : '10em'}},
        {Value: proficiencySet_ID, Label: '{i18n>labelProficiencySet}'},
        {Value: description, Label: '{i18n>labelDescription}'}
      ]
    }
  },
  Common: {
    Label: '{i18n>labelSkills}',
    SemanticObject: 'Skill',
    SemanticKey: [ID],
    DraftRoot: {
      NewAction: 'SkillService.createSkillWithDialog'
    }
  }
);

@cds.search: { name, description, commaSeparatedAlternativeLabels, localized.name, localized.description, localized.commaSeparatedAlternativeLabels }
annotate SkillService.Skills with {
  ID @title:'{i18n>ID}' @UI.HiddenFilter @Common: { Text: name, TextArrangement: #TextOnly };
  name @readonly @title:'{i18n>labelSkillName}';
  commaSeparatedAlternativeLabels @readonly @title:'{i18n>labelAlternativeNames}';
  commaSeparatedCatalogs @UI.HiddenFilter @readonly @title:'{i18n>labelCatalogsColumn}';
  commaSeparatedLanguages @UI.HiddenFilter @readonly @title:'{i18n>labelLanguagesColumn}';
  description @readonly @title:'{i18n>labelDescription}' @UI.MultiLineText;
  lifecycleStatus_code @readonly @title:'{i18n>labelLifecycleStatus}' @(
    Common: {
      Text: lifecycleStatus.name,
      TextArrangement: #TextOnly,
      ValueListWithFixedValues: true,
      ValueList: {
        Label: '{i18n>labelLifecycleStatus}',
        CollectionPath: 'LifecycleStatus',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: lifecycleStatus_code, ValueListProperty: 'code' }
        ]
      }
    }
  );
  proficiencySet @UI.Hidden;
  proficiencySet_ID @(
    title: '{i18n>labelProficiencySet}',
    Common: {
      Text: proficiencySet.name,
      TextArrangement: #TextOnly,
      FieldControl: #Mandatory,
      ValueListForValidation: '', //this makes the client validation to check against valueHelp values instead of datatype
      ValueList: {
        Label: '{i18n>labelProficiencySet}',
        CollectionPath: 'ProficiencySets',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: proficiencySet_ID, ValueListProperty: 'ID' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'description' }
        ]
      },
      SemanticObject: 'Proficiency',
      SemanticObjectMapping: [
        {LocalProperty: proficiencySet_ID, SemanticObjectProperty: 'ID'}
      ]
    }
  );
  externalID @UI.Hidden;

}

annotate SkillService.LifecycleStatus with {
  code @Common: { Text: name, TextArrangement: #TextOnly }
}

annotate SkillService.ProficiencySets with {
  ID @UI.HiddenFilter @title: '{i18n>labelProficiencySet}' @Common: { Text: name, TextArrangement: #TextOnly };
  name @title: '{i18n>labelProficiencySet}';
  description @readonly @title: '{i18n>labelDescription}' @UI.MultiLineText;
};

////////////////////////////////////////////////////////////////////////////
//
// Skill Object Page
//
annotate SkillService.Skills with @(
  Common: {
    SideEffects#textsChanged: {
      SourceEntities: [
        texts
      ],
      SourceProperties: [
        texts.name,
        texts.description
      ],
      TargetProperties: [
        'name',
        'description'
      ]
    },
    SideEffects#proficiencySetChanged: {
      SourceProperties: [
        proficiencySet_ID
      ],
      TargetEntities: [
        proficiencySet.proficiencyLevels
      ]
    }
  },
  UI: {
    HeaderInfo: {
      TypeName: '{i18n>typeNameSkillsSingular}',
      TypeNamePlural: '{i18n>typeNameSkillsPlural}',
      Title: {Value: name},
      Description: {Value: description}
    },
    Identification: [
      {$Type: 'UI.DataFieldForAction', Label: '{i18n>restrictActionButton}', Action: 'SkillService.restrict', @UI.Hidden: lifecycleStatus.isRestricted },
      {$Type: 'UI.DataFieldForAction', Label: '{i18n>removeRestrictionActionButton}', Action: 'SkillService.removeRestriction', @UI.Hidden: lifecycleStatus.isUnrestricted }
    ],
    HeaderFacets: [
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData'},
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#ProficiencySet'}
    ],
    Facets: [
      {$Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleSkill}', Target: 'texts/@UI.LineItem'},
      {$Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleAlternativeNames}', Target: 'alternativeLabels/@UI.LineItem'},
      {$Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleCatalogs}', Target: 'catalogAssociations/@UI.PresentationVariant'},
      {$Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleProficiencyLevel}', Target: 'proficiencySet/proficiencyLevels/@UI.PresentationVariant'}
    ],
    FieldGroup#AdministrativeData: {
      Label: '{i18n>administrativeData}',
      Data: [
        {$Type: 'UI.DataField', Label:'{i18n>createdAt}', Value: createdAt},
        {$Type: 'UI.DataField', Label:'{i18n>modifiedBy}', Value: modifiedBy},
        {$Type: 'UI.DataField', Label:'{i18n>modifiedAt}', Value: modifiedAt},
        {$Type: 'UI.DataField', Label:'{i18n>labelLifecycleStatus}', Value: lifecycleStatus_code, Criticality: lifecycleStatus.criticality, CriticalityRepresentation:#WithoutIcon}
      ]
    },
    FieldGroup#ProficiencySet: {
      Data: [
        {$Type: 'UI.DataField', Label:'{i18n>labelProficiencySet}', Value: proficiencySet_ID}
      ]
    },
    PresentationVariant : {
      RequestAtLeast : [
        OID
      ]
    }
  }
);

annotate SkillService.Skills.texts with @(
  UI: {
    HeaderInfo: {
      TypeName: '{i18n>typeNameSkillTextsSingular}',
      TypeNamePlural: '{i18n>typeNameSkillTextsPlural}'
    }
  },
  UI: {
    //Fields to be shown on List
    LineItem: [
      {Value: name, Label: '{i18n>labelSkillTextName}'},
      {Value: locale, Label: '{i18n>labelLanguage}'},
      {Value: description, Label: '{i18n>labelDescription}'}
    ]
  },
);

annotate SkillService.AlternativeLabels with @(
  UI: {
    HeaderInfo: {
      TypeName: '{i18n>typeNameAlternativeNamesSingular}',
      TypeNamePlural: '{i18n>typeNameAlternativeNamesPlural}'
    }
  },
  Common: {
    Label: '{i18n>labelAlternativeNames}'
  },
  UI: {
    //Fields to be shown on List
    LineItem: [
      {Value: name, Label: '{i18n>labelAlternativeName}'},
      {Value: language_code, Label: '{i18n>labelLanguage}'}
    ]
  }
);

annotate SkillService.Catalogs2Skills with @(
  UI: {
    HeaderInfo: {
      TypeName: '{i18n>typeNameCatalogsSingular}',
      TypeNamePlural: '{i18n>typeNameCatalogsPlural}'
    },
    LineItem: [
      {Value: catalog_ID, Label: '{i18n>labelCatalogName}'},
      {Value: catalog.description, Label: '{i18n>labelCatalogDescription}'},
    ],
    PresentationVariant : {
      Visualizations : ['@UI.LineItem']
    }
  }
);

annotate SkillService.ProficiencyLevels with @(
  UI: {
    HeaderInfo: {
      TypeName: '{i18n>typeNameProficiencyLevelsSingular}',
      TypeNamePlural: '{i18n>typeNameProficiencyLevelsPlural}'
    }
  },
  Common.SemanticKey: [ID, name],
  UI : {
    PresentationVariant: {
      Visualizations: [ '@UI.LineItem' ],
      SortOrder: [
        {
          Property: 'rank',
          Descending: true
        }
      ]
    },
     //Fields to be shown on List
    LineItem : [
      {Value: name, Label: '{i18n>labelProficiencyLevelName}'},
      {Value: description, Label: '{i18n>labelProficiencyLevelDescription}'},
      {Value: rank, Label: '{i18n>labelProficiencyLevelRank}'}
    ]
  }
);

annotate SkillService.ProficiencyLevels {
  ID @UI.Hidden;
  name @title: '{i18n>labelProficiencyLevelName}';
  description @title: '{i18n>labelProficiencyLevelDescription}' @UI.MultiLineText;
  rank @title: '{i18n>labelProficiencyLevelRank}';
  proficiencySet_ID @UI.Hidden;
}

annotate SkillService.Catalogs2Skills {
  ID @UI.Hidden;
  skill_ID @UI.Hidden;
  catalog_ID @title: '{i18n>labelCatalog}' @Common: {
    Text: catalog.name,
    TextArrangement: #TextOnly,
    SemanticObject: 'SkillCatalog',
    SemanticObjectMapping: [
      {LocalProperty: catalog_ID, SemanticObjectProperty: 'ID'}
    ],
    ValueList: {
        Label: '{i18n>labelCatalogs}',
        CollectionPath: 'Catalogs',
        Parameters: [
          { $Type:'Common.ValueListParameterOut', LocalDataProperty: catalog_ID, ValueListProperty: 'ID' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'description' }
        ]
      },
  };
};

annotate SkillService.Catalogs with {
  ID @UI.HiddenFilter @title: '{i18n>labelCatalogName}' @(
    Common: {
      Text: name,
      TextArrangement: #TextOnly,
    }
  );
  description @title: '{i18n>labelCatalogDescription}' @UI.MultiLineText;
  name @title: '{i18n>labelCatalogName}';
}

annotate SkillService.AlternativeLabels with {
  ID @title:'{i18n>ID}' @UI.Hidden;
  name @title:'{i18n>labelAlternativeName}';
  language_code @title: '{i18n>labelLanguages}' @(
    Common: {
      FieldControl: #Mandatory,
      ValueList: {
        Label: '{i18n>labelLanguages}',
        CollectionPath: 'Languages',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: language_code, ValueListProperty: 'code' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' },
        ]
      },
    }
  );
  skill_ID @UI.Hidden;
}

annotate SkillService.Skills.texts with {
  ID @title:'{i18n>ID}' @UI.Hidden;
  ID_texts @title:'{i18n>ID}' @UI.Hidden;
  name @title:'{i18n>labelSkillName}';
  description @title:'{i18n>labelDescription}' @UI.MultiLineText;
  locale @title: '{i18n>labelLanguages}' @(
    Common: {
      FieldControl: #Mandatory,
      ValueList: {
        Label: '{i18n>labelLanguages}',
        CollectionPath: 'Languages',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: locale, ValueListProperty: 'code' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' },
        ]
      },
    }
  );
  commaSeparatedAlternativeLabels @UI.Hidden;
}

annotate SkillService.Skills actions {
  createSkillWithDialog (
    @Common: {
      Label: '{i18n>labelLanguage}',
    }
    @UI.ParameterDefaultValue: DefaultLanguage.language_code
    locale,

    @Common: {
      FieldControl: #Mandatory,
      Label: '{i18n>labelSkillName}'
    }
    label,

    @Common: {
      FieldControl: #Mandatory,
      Label: '{i18n>labelDescription}'
    }
    @UI.MultiLineText: true
    description
  );
  @Common.SideEffects: {
    TargetProperties : [
      'lifecycleStatus',
      'modifiedAt',
      'modifiedBy'
    ]
  }
  @Common.IsActionCritical: true
  restrict;

  @Common.SideEffects: {
    TargetProperties : [
      'lifecycleStatus',
      'modifiedAt',
      'modifiedBy'
    ]
  }
  @Common.IsActionCritical: true
  removeRestriction;
}

annotate SkillService.Languages with {
  name @title: '{i18n>labelLanguage}';
};
