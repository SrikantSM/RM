using MyProjectExperienceService from '../../myProjectExperienceService';


// Field Level Annotations
annotate MyProjectExperienceService.SkillMasterList with {
    ID
    @(
        ValueList.entity : 'SkillMasterList',
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_NAME}',
            FieldControl : #ReadOnly,
            Text : {
                $value : name,
                ![@UI.TextArrangement] : #TextOnly
            }
        }
    );

    name
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_NAME}',
            FieldControl : #ReadOnly,
        }
    );

	commaSeparatedAlternativeLabels
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_ALTERNATE_LABELS}',
            FieldControl : #ReadOnly,
        }
    );

    commaSeparatedCatalogs
    @(
      // Removed search annotation to avoid CAP warnings for localized field
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_CATALOG_COLUMN}',
            FieldControl : #ReadOnly,
        }
    );

    description
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_DESCRIPTION}',
            FieldControl : #ReadOnly,
        }
    );
    
    catalogAssociations @cds.search;
    
    lifecycleStatus_code @UI.HiddenFilter : true;

};

annotate MyProjectExperienceService.Catalogs2SkillsConsumption with {
    catalog @cds.search;
    // Value Help
    catalog_ID @(
      Common : {
          Label : '{i18n>VALUE_HELP_SKILL_CATALOG_COLUMN}',
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

annotate MyProjectExperienceService.CatalogsConsumption with {
    // Name Filter
    name
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_CATALOG}',
            FieldControl : #ReadOnly,
        }
    );
    // Value Help
    ID
    @(
        Common : {
            Label : '{i18n>VALUE_HELP_SKILL_NAME}',
            Text : name,
            TextArrangement : #TextOnly
        }
    );
    description
    @(
        Search.defaultSearchElement : true,
        Common : {
            Label : '{i18n>SKILL_DESCRIPTION}',
            FieldControl : #ReadOnly,
        }
    );
}

// Skill Value Help
annotate MyProjectExperienceService.SkillMasterList with @(
    UI : {
        SelectionFields : [commaSeparatedAlternativeLabels, name, description, 'catalogAssociations/catalog/name'],
    }
);
