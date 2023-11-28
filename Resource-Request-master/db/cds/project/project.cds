namespace com.sap.resourceManagement.project;

using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db';

@cds.search : {customer.name}
entity Projects {
    key ID                  : String(24);
        name                : String(40);
        customer            : Association to Customers;
        startDate           : Date;
        endDate             : Date;
        serviceOrganization : Association to organization.Headers;
        workPackages        : Composition of many WorkPackages
                                  on workPackages.project = $self;
}

entity WorkPackages {
    key ID        : String(40);
        name      : String(60);
        project   : Association to Projects;
        startDate : Date;
        endDate   : Date;

        @cascade: {delete}
        demands   : Association to many Demands
                      on demands.workPackage = $self;
}

entity Demands {
  key ID                                : UUID;
      externalID                        : String(24);
      startDate                         : Date;
      endDate                           : Date;
      requestedQuantity                 : Decimal(10, 2);
      requestedUoM                      : String(3);
      workItem                          : String(10);
      workItemName                      : String(40);
      billingRole                       : Association to BillingRoles;
      billingCategory                   : Association to BillingCategories;
      workPackage                       : Association to WorkPackages;
      deliveryOrganization              : Association to organization.DeliveryOrganizations
                                          on deliveryOrganization_code = deliveryOrganization.code;
      deliveryOrganization_code         : organization.Code;
      demandCapacityRequirements        : Composition of many DemandCapacityRequirements on demandCapacityRequirements.demand = $self;
      deliveryOrganizationToCostCenters : Association to many organization.DeliveryOrganizationCostCenters
                                          on deliveryOrganizationToCostCenters.deliveryOrganizationCode = deliveryOrganization_code;
};

entity DemandCapacityRequirements {
    key ID                : UUID;
        demand            : Association to Demands;
        startDate         : Date;
        endDate           : Date;
        requestedQuantity : Decimal(10, 2);
        requestedUoM      : String(3);
};

entity Customers {
    key ID   : String(10);
        name : String(100);
}

entity BillingRoles {
    key ID   : String(30);
        name : localized String;
};

entity BillingCategories {
    key ID   : String(3);
        name : localized String;
};


