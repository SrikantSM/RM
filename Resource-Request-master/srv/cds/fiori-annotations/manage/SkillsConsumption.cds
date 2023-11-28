using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.SkillsConsumption with {
  ID
  @(
    UI.Hidden : true,
    Common    : {
      FieldControl : #ReadOnly,
      Text         : {
        $value                : name,
        @UI.TextArrangement : #TextOnly
      }
    }
  );
  name
  @Common : {Label : '{i18n>NAME}', };
  description
  @Common : {Label : '{i18n>DESCRIPTION}', };
  commaSeparatedAlternativeLabels
  @Common : {Label : '{i18n>SKILL_ALTERNATE_LABELS}', };
};

annotate ManageResourceRequestService.SkillsConsumption with {
  code
  @UI.Hidden : true;
  externalID
  @UI.Hidden : true;
  lifecycleStatus_code
  @UI.Hidden: true;
};

annotate ManageResourceRequestService.SkillsConsumption with @(UI : {
  QuickViewFacets              : [{
    $Type  : 'UI.ReferenceFacet',
    Target : '@UI.FieldGroup#SkillDescription'
  }],
  FieldGroup #SkillDescription : {Data : [{
    $Type : 'UI.DataField',
    Value : description
  }]},
});
