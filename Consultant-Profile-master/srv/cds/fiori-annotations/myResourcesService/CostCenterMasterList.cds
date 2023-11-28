using MyResourcesService from '../../myResourcesService';

annotate MyResourcesService.CostCenterMasterList with {
  ID
  @(
      UI.Hidden : true,
      ValueList.entity : 'CostCenterMasterList',
      Common : {
          FieldControl : #ReadOnly,
          Text : {
              $value : costCenterDescription,
              ![@UI.TextArrangement] : #TextOnly
          }
      }
  );
  costCenterID
  @Common    : {
    Label : '{i18n>COST_CENTER}'
  };
  costCenterDescription
  @Common : {Label : '{i18n>VALUE_HELP_COSTCENTER_DESCRIPTION}' };
  displayName
  @(
      UI.Hidden : true
  );
  resourceOrganizationID @UI.Hidden : true;
  
  resourceOrganizationName @UI.Hidden : true;

};
