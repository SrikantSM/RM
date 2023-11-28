using ProjectRoleService from '../../projectRoleService';

//Role texts
annotate ProjectRoleService.Roles_texts with @(
  UI: {
    //Fields to be shown on List
	HeaderInfo: {TypeNamePlural: '{i18n>PROJECTROLE_ROLE_NAMES}'},
    LineItem: [
    { Value : name, Label : '{i18n>PROJECTROLE_NAME}' },
	  { Value : locale, Label: '{i18n>PROJECTROLE_LANGUAGE}'},
	  { Value : description, Label : '{i18n>PROJECTROLE_DESCRIPTION}' },
    ]	
  }
);

annotate ProjectRoleService.Roles_texts with {
  ID_texts @( UI.Hidden: true );
  ID @( UI.Hidden: true );
  name @title:'{i18n>PROJECTROLE_NAME}' @Search.defaultSearchElement;
  description @title:'{i18n>PROJECTROLE_DESCRIPTION}' @Search.defaultSearchElement;

  locale @(
    Common: {
      FieldControl: #Mandatory,
      ValueList: {
        Label: '{i18n>PROJECTROLE_LANGUAGE}',
        CollectionPath: 'Languages',
        Parameters: [
          { $Type:'Common.ValueListParameterInOut', LocalDataProperty: locale, ValueListProperty: 'code' },
          { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' },
        ]
      },
    }
  );
}

annotate ProjectRoleService.Languages with {
  name @title: '{i18n>PROJECTROLE_LANGUAGE}';
};
