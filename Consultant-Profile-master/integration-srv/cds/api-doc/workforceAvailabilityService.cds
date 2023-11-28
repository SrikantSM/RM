using WorkforceAvailabilityService from '../workforceAvailabilityService';

annotate WorkforceAvailabilityService with @(
    Core.Description: 'Workforce Availability',
    Core.LongDescription: 'This API enables you to upload information about the availability of your workforce in SAP S/4HANA Cloud for projects, resource management. You can read, create, and update the availability of your workforce. For reasons of data protection and privacy, only batch requests are available.'
);

annotate WorkforceAvailabilityService.WorkforceAvailability with @(
    Core.LongDescription : 'Workforce Availability',
    Capabilities.ReadRestrictions.Description                       : 'Fetches availability of all workers.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Fetches availability of a single worker with a work assignment and date.',
    Capabilities.UpdateRestrictions.Description                     : 'Updates an availability of a single worker.',
    Capabilities.InsertRestrictions.Description                     : 'Creates an availability of a single worker.',
);

annotate WorkforceAvailabilityService.WorkforceAvailability with {

    @Core.Description: 'The identifier of the availability entry.'
    id;
    
    @Core.Description: 'The identifier of the work assignment that the availability record relates to.'
    workAssignmentID;
    
    @Core.Description: 'The ID of the workforce person.'
    workforcePerson;
    
    @Core.Description: 'The date for the availability record.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '1971-01-01'
    }
    availabilityDate;

    @Core.Description: 'The number of working hours for a date.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '08:00'
    }
    normalWorkingTime;
    
    @Core.Description: 'The list of available time intervals for a date.'
    availabilityIntervals;

    @Core.Description: 'The list of time periods when a workforce person is not available, for a date.'
    availabilitySupplements;
};
