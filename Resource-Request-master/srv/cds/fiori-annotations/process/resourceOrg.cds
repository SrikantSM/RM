using ProcessResourceRequestService from '../../services/process';

@cds.search :  {
  ID,
  name,
  description
}
annotate ProcessResourceRequestService.UnrestrictedResourceOrganizationsConsumption with {
  ID
  @Common    : {
    Label        : '{i18n>RESOURCE_ORGANIZATION_CODE}',
    FieldControl : #ReadOnly,
    Text         : {
      $value              : name,
      @UI.TextArrangement : #TextSeparate
    }
  };
  name
  @Common    : {Label : '{i18n>RESOURCE_ORGANIZATION_NAME}', };
  description
  @Common    : {Label : '{i18n>RESOURCE_ORGANIZATION_DESCRIPTION}', };
  lifeCycleStatus
  @UI.Hidden : true;
};
