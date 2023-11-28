using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.ProficiencyLevelsConsumption with {
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