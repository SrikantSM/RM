using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.ReferenceObjectType with {
  code
  @UI.Hidden : true
  @UI.HiddenFilter: true
  @Common    : {
    Label        : '{i18n>CODE}',
    FieldControl : #ReadOnly,
    Text         : {
      $value              : name,
      @UI.TextArrangement : #TextOnly
    },
  };
  name
  @Common : {
        Label        : '{i18n>REFERENCE_TYPE}',
        FieldControl : #ReadOnly
    };
};
