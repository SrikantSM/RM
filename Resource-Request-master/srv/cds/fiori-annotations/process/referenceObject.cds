using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.ReferenceObject with {

  ID
  @UI.Hidden: true
  @UI.HiddenFilter: true
  @Common : {
    Label        : '{i18n>REFERENCE_ID}',
    Text         : {
       $value              : displayId,
       @UI.TextArrangement : #TextOnly
    }
  };

  displayId
  @Common : {
    FieldControl : #ReadOnly,
    Label        : '{i18n>REFERENCE_ID}'
  };

  typeCode
  @UI.Hidden                   : true
  @UI.HiddenFilter             : true;

  name
  @Common        : {
    Label    : '{i18n>REFERENCE_NAME}',
    FieldControl : #ReadOnly
  };

  startDate
  @UI.HiddenFilter: true
  @Common        : {
    Label : '{i18n>REFERENCE_OBJECT_START_DATE}',
    FieldControl : #ReadOnly
  };


  endDate
  @UI.HiddenFilter: true
  @Common        : {
    Label : '{i18n>REFERENCE_OBJECT_END_DATE}',
    FieldControl : #ReadOnly
  };

};
