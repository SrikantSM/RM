using ProficiencyService from './proficiency-service';
using managed from './managed-fiori-annotations';


////////////////////////////////////////////////////////////////////////////
//
// ProficiencySet List Report
//

annotate ProficiencyService.ProficiencySets with @(
  Common: {
    Label: '{i18n>labelProficiencySet}',
    SemanticObject: 'Proficiency'
  },

  Capabilities : {
    SearchRestrictions.Searchable: true,
    DeleteRestrictions.Deletable: false
  },

  Capabilities.SortRestrictions : {
    Sortable              : true,
    NonSortableProperties : [ID]
  },

  UI: {
    SelectionFields: [name],
    LineItem: [
        {Value: ID, Label: '{i18n>labelProficiencySetName}'},
        {Value: description, Label: '{i18n>labelProficiencySetDescription}'},
      ]
  },
  Common: {
    SemanticKey: [ID],
    DraftRoot: {NewAction: 'ProficiencyService.createProficiencySetWithDialog'}
  }
);

@cds.search: { name, description, proficiencyLevels.localized.name, proficiencyLevels.localized.description }
annotate ProficiencyService.ProficiencySets with {
  ID @title:'{i18n>ID}' @UI.HiddenFilter @Common: { Text: name, TextArrangement: #TextOnly };
  name @title: '{i18n>labelProficiencySetName}' @Common.FieldControl: #Mandatory;
  description @title: '{i18n>labelProficiencySetDescription}' @UI.MultiLineText @Common.FieldControl: #Mandatory;
  isCustom @readonly @UI.Hidden;
}


////////////////////////////////////////////////////////////////////////////
//
// ProficiencySets Actions
//
annotate ProficiencyService.ProficiencySets actions {
  createProficiencySetWithDialog (
    name @Common: {
      FieldControl: #Mandatory,
      Label: '{i18n>labelProficiencySetName}'
    },
    description @(
      Common: {
        FieldControl: #Mandatory,
        Label: '{i18n>labelProficiencySetDescription}'
      },
      UI: {
        MultiLineText: true
      }
    )
  );

  draftEdit @Core.OperationAvailable: isCustom;
}


////////////////////////////////////////////////////////////////////////////
//
// ProficiencySets Object page
//

annotate ProficiencyService.ProficiencySets with 
  @(
  UI: {
    HeaderInfo: {
      TypeName: '{i18n>typeNameProficiencySetsSingular}',
      TypeNamePlural: '{i18n>typeNameProficiencySetsPlural}',
      Title: {Value: name},
      Description: { Value : description }
    },
    HeaderFacets: [
      {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#AdministrativeData'}
    ],
    Facets: [
      {ID:'SkillsFacet', $Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleAssignedSKills}', Target: 'skills/@UI.LineItem'}
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
        OID
      ]
    }
  }
);

annotate ProficiencyService.ProficiencyLevels with {
  ID @UI.Hidden @Common: { Text: name, TextArrangement: #TextOnly };
  name @readonly @title: '{i18n>labelProficiencyLevelName}';
  description @readonly @title: '{i18n>labelProficiencyLevelDescription}' @UI.MultiLineText;
  rank @title: '{i18n>labelProficiencyLevelRank}';
};

annotate ProficiencyService.Skills with @(
  UI: {
  	HeaderInfo: {
      TypeName: '{i18n>typeNameSkillsSingular}',
  		TypeNamePlural: '{i18n>typeNameSkillsPlural}'
  	}
  },
  Common: {
    Label: '{i18n>labelSkills}',
    SemanticObject: 'Skill'
  },
  UI: {
    LineItem: [
      {Value: ID, Label: '{i18n>labelSkillName}'},
      {Value: description, Label: '{i18n>labelDescription}'}
    ]
  }
);

annotate ProficiencyService.Skills with {
  ID @UI.HiddenFilter @title: '{i18n>ID}' @Common: {
    Text: name,
    TextArrangement: #TextOnly,
    SemanticObject: 'Skill',
    SemanticObjectUnavailableActions: ['Upload', 'Download']
  };
  name @title: '{i18n>labelSkillName}';
  description @title: '{i18n>labelDescription}' @UI.MultiLineText;
  proficiencySet_ID @UI.Hidden;
};

////////////////////////////////////////////////////////////////////////////
//
// ProficiencyLevel Object page
//
annotate ProficiencyService.ProficiencyLevels with @(
  Capabilities : {
    DeleteRestrictions.Deletable: false
  },
  Common: {
    SideEffects#languageChanged: {
      SourceEntities:[
        texts
      ],
      SourceProperties: [
        texts.locale
      ],
      TargetProperties: [
        'commaSeparatedLanguages'
      ]
    },
    SideEffects#textsChanged: {
      SourceEntities:[
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
    }
  },
  UI: {
    HeaderInfo: {
      Title: { Value : name },
      Description: { Value : description }
    },
    Facets: [
      {$Type: 'UI.ReferenceFacet', Label: '{i18n>facetTitleProficiencyLevelLabels}', Target: 'texts/@UI.LineItem'}
    ]
  }
);

annotate ProficiencyService.ProficiencyLevels.texts with @(
  UI: {
  	HeaderInfo: {
      TypeName: '{i18n>typeNameProficiencyLevelTextsSingular}',
      TypeNamePlural: '{i18n>typeNameProficiencyLevelTextsPlural}'
    }
  },
  UI: {
    //Fields to be shown on List
    LineItem: [
      {Value: name, Label: '{i18n>labelProficiencyLevelName}'},
      {Value: description, Label: '{i18n>labelDescription}'},
      {Value: locale, Label: '{i18n>labelLanguage}'}
    ]
  },
  Common: {
    SemanticKey: [name]
  }
);

annotate ProficiencyService.ProficiencyLevels.texts with {
  ID @title: '{i18n>ID}' @UI.Hidden;
  ID_texts @title:'{i18n>ID}' @UI.Hidden;
  name @title: '{i18n>labelProficiencyLevelName}' @Common.FieldControl: #Mandatory;
  description @title: '{i18n>labelDescription}' @UI.MultiLineText;
  locale @title: '{i18n>labelLanguage}' @(
    Common: {
      FieldControl: #Mandatory,
      ValueList: {
        Label: '{i18n>labelLanguages}',
        CollectionPath: 'Languages',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: locale, ValueListProperty: 'code' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
        ]
      },
    }
  );
}

annotate ProficiencyService.Languages with {
  name @title: '{i18n>labelLanguage}';
};
