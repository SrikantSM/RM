namespace com.sap.resourceManagement.workforce.workAssignment;

using { Country, Currency, managed, sap.common.CodeList, cuid } from '@sap/cds/common';
using com.sap.resourceManagement.employee                     as employee           from '../core/employee';
using com.sap.resourceManagement.organization                 as organization       from '../core/organization';
using com.sap.resourceManagement.resource                     as resource           from '../core/resource';
using com.sap.resourceManagement.workforce.workforceCodelists as workforceCodelists from './WorkforceCodelists';
using com.sap.resourceManagement.workforce.workforceCommon    as workforceCommon    from './WorkforceCommon';
using com.sap.resourceManagement.workforce.workforceTypes     as workforceTypes     from './WorkforceTypes';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db/resource-organization.cds';

entity WorkerType : CodeList {
  key isContingentWorker : Boolean;
}

entity WorkAssignments : workforceCommon.composites {
    workAssignmentID   : String(100) not null;
    externalID         : String(100) not null;
    isContingentWorker : Boolean default false;
    startDate          : Date not null;
    endDate            : Date;
    details            : Composition of many WorkAssignmentDetails on details.parent = $self.ID;
    jobDetails         : Composition of many JobDetails on jobDetails.parent = $self.ID;
    paymentDetails     : Composition of many PaymentDetails on paymentDetails.parent = $self.ID;
    workOrderDetails   : Composition of many WorkOrderDetails on workOrderDetails.parent = $self.ID;
    workPlaceAddresses : Composition of many WorkPlaceAddresses on workPlaceAddresses.parent = $self.ID;
    privateAddresses   : Composition of many WorkAssignmentPrivateAddresses on privateAddresses.parent = $self.ID;
    @odata.navigable : false
    currentWADetails   : Association to one WorkAssignmentDetails on currentWADetails.parent = $self.ID and currentWADetails.validFrom <= $now and currentWADetails.validTo > $now;
    @odata.navigable : false
    rmExtn_Resource    : Association to one resource.Headers on rmExtn_Resource.ID = ID;
    @odata.navigable : false
    toProfileData      : Association to one employee.ProfileDataBuilder on toProfileData.ID = $self.parent;
    // Provide the navigation to the fetch the current JobDetails
    @odata.navigable : false
    currentJD          : Association to one JobDetailsMaxEventSequence on currentJD.parent = $self.ID and currentJD.validFrom <= $now and currentJD.validTo > $now;
    // Provide the navigation to the fetch the current JobDetails
    @odata.navigable : false
    firstJD            : Association to one Extn_WorkAssignmentFirstJobDetails on firstJD.parent = $self.ID and firstJD.jobDetailSequenceNumber = 1;
    toWorkerType       : Association to one WorkerType on toWorkerType.isContingentWorker = $self.isContingentWorker;
}

entity WorkAssignmentDetails : workforceCommon.temporalComposites {
    isPrimary : Boolean;
}

entity WorkAssignmentPrivateAddresses : workforceCommon.temporalComposites, workforceCodelists.ScriptedPersonAddress {
    usage : workforceCodelists.AddressUsageCode;
}

// Temporary
entity WorkPlaceAddresses : workforceCommon.temporalComposites {
    officeLocation : String(256);
}

entity JobDetails : workforceCommon.temporalComposites {
    status                             : workforceCodelists.JobDetailStatusCode;
    legalEntityExternalID              : String(4) not null;
    costCenterExternalID               : cds.UUID;
    costCenter                         : Association to organization.CostCenters on costCenter.ID = costCenterExternalID;
    fte                                : Decimal(3, 2);
    workingHoursPerWeek                : Decimal(5, 2);
    workingDaysPerWeek                 : Decimal(3, 2);
    jobExternalID                      : String(128);
    jobTitle                           : String(256);
    supervisorWorkAssignmentExternalID : String(100);
    country                            : Country not null;
    event                              : workforceCodelists.EventCode;
    eventReason                        : workforceCodelists.EventReasonCode;
    eventSequence                      : Integer;
    orgUnit                            : workforceTypes.OrganizationalUnit;
    superOrdinateOrgUnit1              : workforceTypes.OrganizationalUnit;
    superOrdinateOrgUnit2              : workforceTypes.OrganizationalUnit;
}

@cds.persistence.exists
entity WorkAssignmentFirstJobDetails : cuid, workforceCommon.temporal {
    parent                             : cds.UUID;
    costCenterExternalID               : cds.UUID;
    jobDetailSequenceNumber            : Integer;
    country_code                       : String(3);
    country_name                       : String(255);
    jobTitle                           : String(256);
    status_code                        : String(32);
    supervisorWorkAssignmentExternalID : String(100);
};

view Extn_WorkAssignmentFirstJobDetails as select from WorkAssignmentFirstJobDetails mixin {
    toOrganizationWithDetails : Association to one organization.HeadersWithDetails on toOrganizationWithDetails.costCenterUUID = costCenterExternalID;
    resourceOrg               : Association to one resourceOrg.ResourceOrganizationItemsView on resourceOrg.costCenterUUID = costCenterExternalID;
    costCenter                : Association to one organization.CostCenters on costCenter.ID = costCenterExternalID;
} into {
    *,
    toOrganizationWithDetails,
    resourceOrg,
    costCenter
};

entity PaymentDetails : workforceCommon.temporalComposites {
    paymentType                : workforceCodelists.PaymentTypeCode not null;
    paymentMethod              : workforceCodelists.PaymentMethodCode not null;
    bankAccountHolderName      : String(256);
    IBAN                       : String(34);
    bankNumber                 : String(15);
    businessIdentifierCode     : String(11);
    bankAccount                : String(35);
    bankAccountType            : workforceCodelists.BankAccountTypeCode;
    bankControlKey             : workforceCodelists.BankControlKeyCode;
    bankAccountReference       : String(20);
    bankAccountCurrency        : Currency;
    bankCountry                : Country;
    additionalPaymentReference : String(40);
}

entity WorkOrderDetails : workforceCommon.temporalComposites {
    supplier : String(10) not null;
}

@cds.persistence.exists
entity JobDetailsMaxEventSeqExtractor : cuid {
    parent                             : cds.UUID;
    validFrom                          : Date;
    validTo                            : Date;
    costCenterExternalID               : cds.UUID;
    fte                                : Decimal(3, 2);
    workingHoursPerWeek                : Decimal(5, 2);
    workingDaysPerWeek                 : Decimal(3, 2);
    jobExternalID                      : String(128);
    jobTitle                           : String(256);
    supervisorWorkAssignmentExternalID : String(100);
    country_code                       : String(3);
    country_name                       : String(256);
    status_code                        : String(32);
    eventReason_code                   : String(255);
    eventSequence                      : Integer;
}

view JobDetailsMaxEventSequence as select from JobDetailsMaxEventSeqExtractor mixin {
    status                         : Association to one workforceCodelists.JobDetailStatusCodes on status.code = status_code;
    eventReason                    : Association to one workforceCodelists.EventReasonCodes on eventReason.code = eventReason_code;
    costCenter                     : Association to one organization.CostCenters on costCenter.ID = costCenterExternalID;
    rmExtn_OrganizationWithDetails : Association to one organization.HeadersWithDetails on rmExtn_OrganizationWithDetails.costCenterUUID = costCenterExternalID;
    resourceOrg                    : Association to one resourceOrg.ResourceOrganizationItemsView on resourceOrg.costCenterUUID = costCenterExternalID;
} into {
    *,
    status,
    eventReason,
    costCenter,
    rmExtn_OrganizationWithDetails,
    resourceOrg
};

view PrimaryWorkAssignments as select from WorkAssignments {
    *,
    details.validFrom as validFrom,
    details.validTo   as validTo
} where details.isPrimary = true and details.validFrom <= $now and details.validTo > $now;
