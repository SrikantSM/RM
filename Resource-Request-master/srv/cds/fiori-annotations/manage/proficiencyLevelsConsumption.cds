using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.ProficiencyLevelsConsumption with {
  ID
  @Common    : {
    Label : '{i18n>PROFICIENCY_LEVEL}',
    Text  : {
      $value                : name,
      @UI.TextArrangement : #TextOnly
    }
  };
  name
  @Common : {Label : '{i18n>PROFICIENCY_LEVEL}', };
}

annotate ManageResourceRequestService.ProficiencyLevelsConsumption with @(UI:{
    PresentationVariant #SortByRank: {
        SortOrder : [
            {
                Property   : rank,
                Descending : false
            }
        ]
    }
});