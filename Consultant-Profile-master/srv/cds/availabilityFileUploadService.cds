using com.sap.resourceManagement.consultantProfile as rm from '../../db';

service AvailabilityFileUploadService @(requires: 'Availability.Upload'){

  @readonly
  entity AvailabilityCostCenter as projection on rm.integration.AvailabilityCostCenter;

}
