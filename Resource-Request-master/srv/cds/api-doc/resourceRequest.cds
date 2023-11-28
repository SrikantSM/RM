using ResourceRequestService from '../services/resourceRequest';


annotate ResourceRequestService with @(
    Core.Description: 'Resource Request',
    Core.LongDescription: 'This API enables you to create resource requests in SAP S/4HANA Cloud for projects, resource management to find suitable resource and staff them to projects or other activities. You can also update and delete resource requests and manage the reference objects using this API.'
);


annotate ResourceRequestService.ResourceRequests with @(
    Core.LongDescription : 'Resource requests',
    Core.Description                                                : 'Resource requests',
    Capabilities.InsertRestrictions.Description                     : 'Create a new resource request.',
    Capabilities.ReadRestrictions.Description                       : 'Read resource requests.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Read a single resource request.',
    Capabilities.UpdateRestrictions.Description                     : 'Update a resource request.',
    Capabilities.DeleteRestrictions.Description                     : 'Delete a resource request.',
);


annotate ResourceRequestService.ResourceRequests with {

    @Core.Description: 'The identifier for the resource request.'
    ID;

    @Core.Description: 'A human-readable resource request ID.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '0000000018'
    }
    displayId;

    @Core.Description: 'The name of the resource request.'
    name;

    @Core.Description: 'The identifier of the reference object.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '4837baca-b9ca-42e4-8199-b2d78ee36a52'
    }
    referenceObjectId;

    @Core.Description: 'The start date of the resource request.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-01-13'
    }
    startDate;

    @Core.Description: 'The end date of the resource request.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-12-25'
    }
    endDate;

    @Core.Description: 'The number of hours requested in the resource request.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '250'
    }
    requiredEffort;

    @Core.Description: 'The description of the resource request.'
    description;
};

annotate ResourceRequestService.ReferenceObjects with @(
    Core.LongDescription : 'Reference Objects',
    Core.Description                                                : 'Reference Objects',
    Capabilities.InsertRestrictions.Description                     : 'Create a new reference object.',
    Capabilities.ReadRestrictions.Description                       : 'Read reference objects.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Read a single reference object.',
    Capabilities.UpdateRestrictions.Description                     : 'Update a reference object.',
    Capabilities.DeleteRestrictions.Description                     : 'Delete a reference object.',
);

annotate ResourceRequestService.ReferenceObjects with {

    @Core.Description: 'The identifier for the reference object.'
    ID;

    @Core.Description: 'A human-readable reference object ID.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'TestProject'
    }
    displayId;

    @Core.Description: 'The name of the reference object.'
    name;

    @Core.Description: 'The type of the reference object [0 - None, 1 - Project].'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '1'
    }
    typeCode;

    @Core.Description: 'The start date of the reference object.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2023-01-13'
    }
    startDate;

    @Core.Description: 'The end date of the reference object.'
    @Core.Example             : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2023-12-25'
    }
    endDate;

}
