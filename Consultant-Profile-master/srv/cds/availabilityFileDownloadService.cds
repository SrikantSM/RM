using com.sap.resourceManagement.consultantProfile as rm from '../../db';

service AvailabilityFileDownloadService @(requires: 'Availability.Download'){

  @readonly
  entity AvailabilityCostCenter as projection on rm.integration.AvailabilityCostCenter;

  @readonly
  entity AvailabilityWorkForcePersonID as projection on rm.integration.AvailabilityWorkForcePersonID
	where isBusinessPurposeCompleted = false;

}
