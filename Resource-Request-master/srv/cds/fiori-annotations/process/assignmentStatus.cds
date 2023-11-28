using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.AssignmentStatus with {
  code
  @UI.Hidden : true
  @Common    : {
    Label        : '{i18n>CODE}',
    FieldControl : #ReadOnly,
    Text         : {
      $value              : name,
      @UI.TextArrangement : #TextOnly
    },
  };
  name
  @Common    : {
    Label        : '{i18n>ASST_STAT}',
    FieldControl : #ReadOnly
  };
};


annotate ProcessResourceRequestService.AssignmentStatus with @(UI : {PresentationVariant #sortByAsstStatusCode : {SortOrder : [{
  Property   : 'code',
  Descending : false
}]}});
