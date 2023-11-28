using MyProjectExperienceService from '../../myProjectExperienceService';

annotate MyProjectExperienceService.ProficiencyLevels with {
  ID
  @Common    : {
    Label : '{i18n>PROFICIENCY_LEVEL}',
    Text  : {
      $value                : name,
      ![@UI.TextArrangement] : #TextOnly
    }
  };
  name
  @Common : {Label : '{i18n>PROFICIENCY_LEVEL}' };
};
