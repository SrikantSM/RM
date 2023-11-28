using com.sap.resourceManagement as rm from '../../db';

service WorkforceAvailabilityService  @(requires: 'System'){

    entity WorkforceAvailability @(restrict : [{
        grant: ['READ', 'CREATE', 'UPDATE'], 
        to: 'System'
    }]) as projection on rm.employee.workforceAvailability.WorkforceAvailability;

}