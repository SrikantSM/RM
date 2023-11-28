using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.ResourceDetails with {
    fullName
    @Common : {
        Label: '{i18n>NAME}',
    };

    resource_ID
    @UI.HiddenFilter : true;
    
    workAssignmentID
    @UI.HiddenFilter : true;
    
    workAssignmentExternalID
    @UI.HiddenFilter : true;
    
    costCenter
    @UI.HiddenFilter : true;
    
    companyCodeCostCenter
    @UI.HiddenFilter : true;
    
    costCenterID
    @UI.HiddenFilter : true;
    
    companyCode
    @UI.HiddenFilter : true;
    
    controllingArea
    @UI.HiddenFilter : true;
    
    country_code
    @UI.HiddenFilter : true;
    
    country_name
    @UI.HiddenFilter : true;
    
    role
    @UI.HiddenFilter : true;
    
    deliveryOrg
    @UI.HiddenFilter : true;
    
    deliveryOrgCode
    @UI.HiddenFilter : true;
    
    managerExternalID
    @UI.HiddenFilter : true;
    
    externalID
    @UI.HiddenFilter : true;
    
    workforcePersonID
    @UI.HiddenFilter : true;
    
    emailAddress
    @UI.HiddenFilter : true;
    
    mobilePhoneNumber
    @UI.HiddenFilter : true;
    
    firstName
    @UI.HiddenFilter : true;
    
    lastName
    @UI.HiddenFilter : true;

    resourceOrg
    @UI.HiddenFilter : true;

    resourceOrgCode
    @UI.HiddenFilter : true;

    isContingentWorker
    @UI.HiddenFilter : true;

    initials
    @UI.HiddenFilter : true;
};
