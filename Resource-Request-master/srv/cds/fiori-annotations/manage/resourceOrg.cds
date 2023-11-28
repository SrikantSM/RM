using ManageResourceRequestService from '../../services/manage';

@cds.search :  {
  ID,
  name,
  description
}
annotate ManageResourceRequestService.UnrestrictedResourceOrganizationsConsumption with {
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
