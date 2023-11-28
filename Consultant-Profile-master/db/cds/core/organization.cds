namespace com.sap.resourceManagement.organization;

using { managed, temporal, sap.common.CodeList } from '@sap/cds/common';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.workforce.workAssignment as workAssignment from '../worker/WorkAssignments';
using com.sap.resourceManagement.workforce.workforceCodelists as workforceCodelists from '../worker/WorkforceCodelists';
using com.sap.resourceManagement.workforce.workforceCommon as workforceCommons from '../worker/WorkforceCommon';
using com.sap.resourceManagement.config as config from '@sap/rm-centralServices/db';

type Code : String(5);

entity OrganizationStatus : CodeList {
  key code : String(1);
}

entity Headers : managed { //CPM Table /CPD/PWSC_ORGID
    key code               : Code;
        //A code can represent type of org like cost center / work center /...
        isSales       : String(1);
        isDelivery    : String(1);
        description   : String(1024);
  		toDeliveryStatus : Association to one OrganizationStatus on toDeliveryStatus.code = $self.isDelivery;
        @odata.navigable : false
        toCompanyCodes : Association to many Details on toCompanyCodes.code = code and toCompanyCodes.unitType = 'CC';
        @odata.navigable : false
        toCostCenters : Association to many Details on toCostCenters.code = code and toCostCenters.unitType = 'CS';
};

entity Details : managed { //CPM Table /cpd/pwsc_orgpid
    key code             : Code;
    key unitKey          : String(10);
    key unitType         : String(10) enum {
            ControllingArea         = 'CA';
            CompanyCode             = 'CC';
            SalesOrganization       = 'SO';
            DistributionChannel     = 'SC';
            Division                = 'SD';
            PurchaseOrganization    = 'PO';
            CostCenter              = 'CS';
            Plant                   = 'PL';
        };
        //Avoid calculated field in join - prefill concatenated value
        compositeUnitKey : String(100);
        organization     : Association to one Headers on organization.code = code;
}

entity HeadersDetailsBuilder as select from Headers mixin {
    organization : Association to one Headers on organization.code = $projection.code;
    toCostcenter : Association to one CostCenters on toCostcenter.costCenterID = $projection.costCenter and toCostcenter.companyCode = $projection.companyCode;
} into {
    *,
    key toCostCenters.unitKey      as costCenter,
        toCompanyCodes.unitKey     as companyCode,
        toCostcenter,
        organization
};

entity HeadersWithDetails as select from HeadersDetailsBuilder {
    *,
    toCostcenter.controllingArea as controllingArea,
    toCostcenter.ID as costCenterUUID,
} where toCostcenter.ID is not null;

view ServiceOrganizationCode as
	 select distinct key code as serviceOrgCode from  HeadersWithDetails;

/**
* Reference: https://github.wdf.sap.corp/DMA/DMA/blob/master/finance/ControllingObject/costCenter/costCenter.cds
* Using the domain model aligned data model as reference for the cost center and using the same within the RM solution.
* The fields that are not required from RM perspective will not be populated during integration
**/
/**
* Cost Center
* - with unique key
* - external key for display
* - validity of cost center itself (sorted by start date)
* - attributes (time dependent, partly localized)
*
**/

entity CostCenters : managed {
    key ID                   : cds.UUID;
        costCenterID         : String(10);
        displayName          : String(30);
        logicalSystem        : String(10);
        isExcluded           : Boolean default false;
        companyCode          : String(4);
        controllingArea      : String(4);
        @cascade         : {![all] : true}
        costCenterValidity   : Composition of many CostCenterValidity on costCenterValidity.parent = $self.ID;
        @cascade         : {![all] : true}
        costCenterAttributes : Composition of many CostCenterAttributes on costCenterAttributes.parent = $self.ID;
}


/**
* Reference: https://github.wdf.sap.corp/DMA/DMA/blob/master/finance/ControllingObject/costCenter/costCenter.cds
* Using the domain model aligned data model as reference for the cost center and using the same within the RM solution.
* The fields that are not required from RM perspective will not be populated during integration
**/
/**
* Cost center core attributes (time dependent)
* - cost center responsible as pointer to Worker
* - blocked indicators
* - name and description (in S/4 limited to String(20) and String(40))
*
**/
entity CostCenterAttributes : workforceCommons.temporal, workforceCommons.trackParent {
    key ID          : cds.UUID;
        name        : localized String(20); // TODO: DMA consistency regarding behavior of field length
        description : localized String(40); // TODO: DMA consistency regarding behavior of field length
        responsible : cds.UUID;
}

entity CostCenterValidity : workforceCommons.temporalComposites {
    isValid : Boolean;
}

entity DeliveryOrganizations as select from Headers mixin {
    toCostCenter : Association to many DeliveryOrganizationCostCenters on toCostCenter.deliveryOrganizationCode = $projection.code;
} into {
    key code,
        description,
        toCostCenter
} where isDelivery = 'X';

entity DeliveryOrganizationCostCenters as select from HeadersWithDetails {
    key costCenter  as ID,
        code        as deliveryOrganizationCode,
        description as deliveryOrganizationDescription
} where isDelivery = 'X';

entity CostCenterItemsView as select from CostCenters mixin {
    resourceOrganizationItems: Association to config.ResourceOrganizationItems on resourceOrganizationItems.costCenterId = $projection.costCenterID;
} into {
    ID,
    costCenterID,
    displayName,
    costCenterAttributes.description as costCenterDescription,
    resourceOrganizationItems.resourceOrganization.displayId as resourceOrganizationID,
    resourceOrganizationItems.resourceOrganization.name as resourceOrganizationName
};
