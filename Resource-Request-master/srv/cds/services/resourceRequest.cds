using com.sap.resourceManagement as rm from '../../../db/cds/index';

service ResourceRequestService @(requires : ['System']) {

  entity ResourceRequests @(restrict : [{
    grant : [
      'READ',
      'WRITE'
    ],
    to    : 'System'
  }])                                              as projection on rm.resourceRequest.ResourceRequests
  {
      ID @readonly,
      displayId @readonly,
      name,
      referenceObject.ID as referenceObjectId,
      startDate,
      endDate,
      requestedCapacity as requiredEffort,
      description
 };

@Capabilities: {
    InsertRestrictions.Insertable: true,
    UpdateRestrictions.Updatable: true,
    DeleteRestrictions.Deletable: true
  }
 entity ReferenceObjects @(restrict : [{
    grant : [
      'READ',
      'WRITE'
    ],
    to    : 'System'
  }])                                              as projection on rm.integration.ReferenceObjects
  {
      ID   @readonly,
      displayId @mandatory,
      name,
      typeCode.code as typeCode,
      startDate,
      endDate
 };

}
