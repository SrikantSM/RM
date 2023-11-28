using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.SkillRequirements with {
  ID
  @UI.Hidden : true;
  skill
  @(Common : {
    SemanticObject : 'skill',
    Label          : '{i18n>TITLE_SKILLS}',
    FieldControl   : skillFieldControl,
    Text           : {
      $value                : skill.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueListForValidation: '', //this makes the client validation to check against valueHelp values instead of datatype
    ValueList      : {
      CollectionPath  : 'SkillsConsumptionVH',
      Label          : '{i18n>TITLE_SKILLS}',
      SearchSupported : true,
      Parameters      : [
      {
        $Type             : 'Common.ValueListParameterOut',
        LocalDataProperty : 'skill_ID',
        ValueListProperty : 'ID' // This has a text arrangement to skill name
      },
      {
        $Type             : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty : 'commaSeparatedAlternativeLabels'
      },
      {
        $Type             : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty : 'description'
      },
      {
        $Type             : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty : 'commaSeparatedCatalogs'
      }
      ]
    }
  });
  proficiencyLevel
  @(Common : {
    FieldControl   : proficiencyLevelFieldControl,
    Label          : '{i18n>PROFICIENCY_LEVEL}',
    Text           : {
      $value                : proficiencyLevel.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueListWithFixedValues : true,
    ValueList : {
      CollectionPath: 'ProficiencyLevelsConsumption',
      PresentationVariantQualifier : 'SortByRank',
      Parameters: [
        {
          $Type:'Common.ValueListParameterIn',
          LocalDataProperty: 'skill/proficiencySet_ID',
          ValueListProperty: 'proficiencySet_ID'
        },
        {
          $Type:'Common.ValueListParameterOut',
          LocalDataProperty: 'proficiencyLevel_ID',
          ValueListProperty: 'ID'
        },
        {
          $Type:'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'description'
        }
      ]
    }
  });
  importance
  @Common    : {
    Label                    : '{i18n>IMPORTANCE}',
    FieldControl   : skillFieldControl,
    Text                     : {
      $value                : importance.name,
      @UI.TextArrangement : #TextOnly
    },
    ValueListWithFixedValues : true
  };
  comment
  @Common    : {
    Label : '{i18n>COMMENT}',
    FieldControl   : skillFieldControl,
  };
};

annotate ManageResourceRequestService.SkillRequirements with @(UI : {
  HeaderInfo : {
    TypeName : '{i18n>TITLE_SKILLS}',
    TypeNamePlural : '{i18n>TITLE_SKILLS}'
  },
  LineItem   : [
  {
    $Type : 'UI.DataField',
    Label : '{i18n>SKILL}',
    Value : skill_ID
  },
  {
    $Type : 'UI.DataField',
    Value : proficiencyLevel_ID
  },
  {
    $Type : 'UI.DataField',
    Value : importance_code
  },
  {
    $Type : 'UI.DataField',
    Value : comment
  }
  ],
});

annotate ManageResourceRequestService.SkillRequirements with @(Common : {SideEffects #SkillChange : {
  SourceProperties : [skill_ID],
  TargetProperties : ['skill', 'skill_ID','proficiencyLevel','proficiencyLevel_ID','proficiencyLevelFieldControl', 'importance', 'importance_code', 'comment'],
}
});