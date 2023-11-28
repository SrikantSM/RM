import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceRequestRepository, CapacityRequirementRepository, ResourceTypesRepository, AssignmentsRepository, AssignmentBucketRepository, Assignments, AssignmentBucket, ResourceRequest, CapacityRequirement, ResourceHeader, ResourceTypes, ResourceCapacity, DemandRepository, Demand, JobDetailRepository, OrganizationDetailRepository, OrganizationHeaderRepository, EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository, CostCenterRepository, CostCenter, OrganizationDetail, OrganizationHeader, JobDetail, EmployeeHeader, WorkAssignment, WorkforcePerson, WorkPackage, WorkPackageRepository, BookedCapacityAggregateRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository } from 'test-commons';

@suite
export class AssignmentIntegrationTest {

    private static assignmentServiceClient: AxiosInstance;
    private static mockServerStrictAssignmentId: string;
    private static assignmentId: string;
    private static resourceRequestId: string;
    private static resourceId: string;

    private static assignmentBucketId: string;
    private static startTime: string;
    private static uniquifier: Uniquifier;

    private static assignmentRepository: AssignmentsRepository;
    private static assignmentBucketRepository: AssignmentBucketRepository;
    private static resourceRequestRepository: ResourceRequestRepository;
    private static capacityRequirementRepository: CapacityRequirementRepository;
    private static demandRepository: DemandRepository;
    private static workPackageRepository: WorkPackageRepository;
    private static resourceHeaderRepository: ResourceHeaderRepository;
    private static resourceTypesRepository: ResourceTypesRepository;
    private static resourceCapacityRepository: ResourceCapacityRepository;
    private static jobDetailRepository: JobDetailRepository;
    private static organizationDetailRepository: OrganizationDetailRepository;
    private static organizationHeaderRepository: OrganizationHeaderRepository;
    private static employeeHeaderRepository: EmployeeHeaderRepository;
    private static workAssignmentRepository: WorkAssignmentRepository;
    private static workforcePersonRepository: WorkforcePersonRepository;
    private static costCenterRepository: CostCenterRepository;

    private static assignmentIDs: string = "(";

    private static assignment: Assignments[];
    private static assignmentBuckets: AssignmentBucket[];
    private static resourceRequests: ResourceRequest[];
    private static capacityRequirement: CapacityRequirement[];
    private static demand: Demand[];
    private static workPackage: WorkPackage[];
    private static resourceTypes: ResourceTypes[];
    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];
    private static costCenter: CostCenter[];
    private static organizationDetail: OrganizationDetail[];
    private static organizationHeader: OrganizationHeader[];
    private static jobDetail: JobDetail[];
    private static employeeHeader: EmployeeHeader[];
    private static workAssignment: WorkAssignment[];
    private static workforcePerson: WorkforcePerson[];

    private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
    private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
    private static resourceOrganizations: ResourceOrganizations[];
    private static resourceOrganizationItems: ResourceOrganizationItems[];

    @timeout(TEST_TIMEOUT)
    static async before() {
        AssignmentIntegrationTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

        AssignmentIntegrationTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        AssignmentIntegrationTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();

        AssignmentIntegrationTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssignmentIntegrationTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        AssignmentIntegrationTest.demandRepository = await testEnvironment.getDemandRepository();
        AssignmentIntegrationTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        AssignmentIntegrationTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssignmentIntegrationTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AssignmentIntegrationTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();

        AssignmentIntegrationTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AssignmentIntegrationTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssignmentIntegrationTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssignmentIntegrationTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssignmentIntegrationTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssignmentIntegrationTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssignmentIntegrationTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        AssignmentIntegrationTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AssignmentIntegrationTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        AssignmentIntegrationTest.uniquifier = new Uniquifier();

        AssignmentIntegrationTest.assignment = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        AssignmentIntegrationTest.assignmentBuckets = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        AssignmentIntegrationTest.resourceRequests = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssignmentIntegrationTest.capacityRequirement = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');
        AssignmentIntegrationTest.demand = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.project.demands.csv', 'Demand');
        AssignmentIntegrationTest.workPackage = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
        AssignmentIntegrationTest.employeeHeader = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');

        AssignmentIntegrationTest.resourceHeader = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssignmentIntegrationTest.resourceTypes = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        AssignmentIntegrationTest.resourceCapacity = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssignmentIntegrationTest.workAssignment = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssignmentIntegrationTest.workforcePerson = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssignmentIntegrationTest.organizationHeader = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        AssignmentIntegrationTest.organizationDetail = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssignmentIntegrationTest.jobDetail = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        AssignmentIntegrationTest.costCenter = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        AssignmentIntegrationTest.resourceOrganizations = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AssignmentIntegrationTest.resourceOrganizationItems = await AssignmentIntegrationTest.uniquifier.getRecords('../data/input/assignmentIntegration/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await AssignmentIntegrationTest.assignmentRepository.insertMany(AssignmentIntegrationTest.assignment);
        await AssignmentIntegrationTest.assignmentBucketRepository.insertMany(AssignmentIntegrationTest.assignmentBuckets);
        await AssignmentIntegrationTest.resourceRequestRepository.insertMany(AssignmentIntegrationTest.resourceRequests);
        await AssignmentIntegrationTest.capacityRequirementRepository.insertMany(AssignmentIntegrationTest.capacityRequirement);
        await AssignmentIntegrationTest.demandRepository.insertMany(AssignmentIntegrationTest.demand);
        await AssignmentIntegrationTest.workPackageRepository.insertMany(AssignmentIntegrationTest.workPackage);
        await AssignmentIntegrationTest.resourceTypesRepository.insertMany(AssignmentIntegrationTest.resourceTypes);
        await AssignmentIntegrationTest.resourceHeaderRepository.insertMany(AssignmentIntegrationTest.resourceHeader);
        await AssignmentIntegrationTest.resourceCapacityRepository.insertMany(AssignmentIntegrationTest.resourceCapacity);
        await AssignmentIntegrationTest.jobDetailRepository.insertMany(AssignmentIntegrationTest.jobDetail);
        await AssignmentIntegrationTest.organizationDetailRepository.insertMany(AssignmentIntegrationTest.organizationDetail);
        await AssignmentIntegrationTest.organizationHeaderRepository.insertMany(AssignmentIntegrationTest.organizationHeader);
        await AssignmentIntegrationTest.employeeHeaderRepository.insertMany(AssignmentIntegrationTest.employeeHeader);
        await AssignmentIntegrationTest.workAssignmentRepository.insertMany(AssignmentIntegrationTest.workAssignment);
        await AssignmentIntegrationTest.workforcePersonRepository.insertMany(AssignmentIntegrationTest.workforcePerson);
        await AssignmentIntegrationTest.costCenterRepository.insertMany(AssignmentIntegrationTest.costCenter);

        await AssignmentIntegrationTest.resourceOrganizationsRepository.insertMany(AssignmentIntegrationTest.resourceOrganizations);
        await AssignmentIntegrationTest.resourceOrganizationItemsRepository.insertMany(AssignmentIntegrationTest.resourceOrganizationItems);

        //Creating an assignment on workpackage 'mockServerStrictMode'
        //This should set the mock server to strict mode
        const payload = {
            resourceId: AssignmentIntegrationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentIntegrationTest.resourceRequests[2].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);

        AssignmentIntegrationTest.assignmentIDs = `${AssignmentIntegrationTest.assignmentIDs} '${simulationActionResponseResMgr.data.ID}'`;

        AssignmentIntegrationTest.mockServerStrictAssignmentId = simulationActionResponseResMgr.data["ID"];
        AssignmentIntegrationTest.resourceRequestId = simulationActionResponseResMgr.data["resourceRequest_ID"];
        AssignmentIntegrationTest.resourceId = simulationActionResponseResMgr.data["resource_ID"];
        var assignmentArray = simulationActionResponseResMgr.data["assignmentBuckets"];
        AssignmentIntegrationTest.assignmentBucketId = assignmentArray[0].ID;
        AssignmentIntegrationTest.startTime = assignmentArray[0]["startTime"];
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        const draftCreateActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Draft creation failed while setting the mock server to Strict mode.');

        const payloadForDraftActivation = {};
        const draftActivationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Draft activation failed while setting the mock server to Strict mode.');

        if (draftActivationActionResponseResMgr.status === 200) {
            console.log("Mock server is successfully set to Strict mode.");
        } else {
            console.log("There was an error in setting the mock server to Strict mode.");
        }

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Business Error in S4 during assignment deletion'() {

        const assignmentDeleteActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.delete('/Assignments(ID=' + AssignmentIntegrationTest.assignment[1].ID + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 400, 'Expected status code to be 400.');

        const assignmentReadActionResponsePostDeletion = await AssignmentIntegrationTest.assignmentServiceClient.get('/Assignments(ID=' + AssignmentIntegrationTest.assignment[1].ID + ',IsActiveEntity=true)');
        assert.equal(assignmentReadActionResponsePostDeletion.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Error in S4 (Failed Batch Call) during assignment change'() {

        assert.isNotNull(AssignmentIntegrationTest.assignment[1].ID, 'No Assignments on Open Request could be found. Cannot execute tests');

        const payload = {
            ID: AssignmentIntegrationTest.assignment[1].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: AssignmentIntegrationTest.resourceRequests[0].ID,
            resource_ID: AssignmentIntegrationTest.resourceHeader[0].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AssignmentIntegrationTest.assignmentBuckets[100].ID,
                    startTime: "2020-12-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: AssignmentIntegrationTest.assignment[1].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.patch('/Assignments(ID=' + AssignmentIntegrationTest.assignment[1].ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400.');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Tests for assignment CUD scenarios with S4 integration logic'() {

        /*****************************************************************************************************************
          Assignment creation should succeed, since supply does not exist in S/4
        *****************************************************************************************************************/

        const creationPayload = {
            resourceId: AssignmentIntegrationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentIntegrationTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const simulationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', creationPayload);

        AssignmentIntegrationTest.assignmentIDs = `${AssignmentIntegrationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        AssignmentIntegrationTest.assignmentId = simulationActionResponseResMgr.data["ID"];
        AssignmentIntegrationTest.resourceRequestId = simulationActionResponseResMgr.data["resourceRequest_ID"];
        AssignmentIntegrationTest.resourceId = simulationActionResponseResMgr.data["resource_ID"];
        var assignmentArray = simulationActionResponseResMgr.data["assignmentBuckets"];
        AssignmentIntegrationTest.assignmentBucketId = assignmentArray[0].ID;
        AssignmentIntegrationTest.startTime = assignmentArray[0]["startTime"];
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        const draftCreateActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');

        const payloadForDraftActivation = {};
        const draftActivationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');


        /*****************************************************************************************************************
          Changing of assignment created in previous step should succeed, since the supply exists in S/4'
        *****************************************************************************************************************/

        const changePayload = {
            ID: AssignmentIntegrationTest.assignmentId,
            bookedCapacityInMinutes: 25440,
            resourceRequest_ID: AssignmentIntegrationTest.resourceRequestId,
            resource_ID: AssignmentIntegrationTest.resourceId,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AssignmentIntegrationTest.assignmentBucketId,
                    startTime: AssignmentIntegrationTest.startTime,
                    bookedCapacityInMinutes: 25440,
                    assignment_ID: AssignmentIntegrationTest.assignmentId,
                }
            ]
        }

        let assignmentChangeActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayload.ID + ',IsActiveEntity=true)', changePayload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');

        /*****************************************************************************************************************
          We try to trigger an actual business error for the above assignment now. Mock server is configured to return
          an error in the 'Changeset' for the specific payload below. The batch response status code would be 202 but
          the response status of the changeset within the batch would be 400. This simulates an actual S4 business error.
        *****************************************************************************************************************/

        const changePayloadForS4Error = {
            ID: AssignmentIntegrationTest.assignmentId,
            bookedCapacityInMinutes: 2520,
            resourceRequest_ID: AssignmentIntegrationTest.resourceRequestId,
            resource_ID: AssignmentIntegrationTest.resourceId,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AssignmentIntegrationTest.assignmentBucketId,
                    startTime: AssignmentIntegrationTest.startTime,
                    bookedCapacityInMinutes: 2520,
                    assignment_ID: AssignmentIntegrationTest.assignmentId,
                }
            ]
        }

        assignmentChangeActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayloadForS4Error.ID + ',IsActiveEntity=true)', changePayloadForS4Error);
        assert.equal(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400 (BAD REQUEST).');

        /*****************************************************************************************************************
          We use the above approach but to test to test that the integration of a softbooked assignment is not allowed.
          How do we do that? We set the softbooking flag to true. And with that, the mockserver is should not be hit, 
          and as a result, the error that we expect with this particular payload shall not be received and hence 
          indicating that the integration was avoided.
        *****************************************************************************************************************/

        const changePayloadForUnexpectedError = {
            ID: AssignmentIntegrationTest.assignment[0].ID,
            bookedCapacityInMinutes: 2520,
            resourceRequest_ID: AssignmentIntegrationTest.assignment[0].resourceRequest_ID,
            resource_ID: AssignmentIntegrationTest.assignment[0].resource_ID,
            assignmentStatus_code: 1,
            assignmentBuckets: [
                {
                    startTime: AssignmentIntegrationTest.startTime,
                    bookedCapacityInMinutes: 2520,
                    assignment_ID: AssignmentIntegrationTest.assignment[0].ID,
                }
            ]
        }

        assignmentChangeActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayloadForUnexpectedError.ID + ',IsActiveEntity=true)', changePayloadForUnexpectedError);
        assert.notEqual(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400 (BAD REQUEST).');

        /*****************************************************************************************************************
          Deleting of assignment created in previous step should succeed, since the supply exists in S/4
        *****************************************************************************************************************/

        const assignmentDeleteActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.delete('/Assignments(ID=' + AssignmentIntegrationTest.assignmentId + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 204, 'Expected status code to be 204 (OK).');

        const assignmentReadActionResponsePostDeletion = await AssignmentIntegrationTest.assignmentServiceClient.get('/Assignments(ID=' + AssignmentIntegrationTest.assignmentId + ',IsActiveEntity=true)');
        assert.equal(assignmentReadActionResponsePostDeletion.status, 404, 'Expected status code to be 404 (NOT_FOUND).');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Tests for assignment CUD scenarios for non S4 request'() {

        /*****************************************************************************************************************
          The request we use here is a non-S4 request and does not have any wp, demand, project etc. attributes.
          The S4 integration logic tries to read the wp and demand information for the request to build the payload
          for S4 OData API. Since a non-S4 request should skip the S4 integration, the assignment CUD should still 
          succeed even if no S4 related attributes are maintained for such a request. This serves as a check to ensure
          that S4 integration logic is not invoked for non-S4 request 
        *****************************************************************************************************************/

        const creationPayload = {
            resourceId: AssignmentIntegrationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentIntegrationTest.resourceRequests[4].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const simulationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', creationPayload);

        AssignmentIntegrationTest.assignmentIDs = `${AssignmentIntegrationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        AssignmentIntegrationTest.assignmentId = simulationActionResponseResMgr.data["ID"];
        AssignmentIntegrationTest.resourceRequestId = simulationActionResponseResMgr.data["resourceRequest_ID"];
        AssignmentIntegrationTest.resourceId = simulationActionResponseResMgr.data["resource_ID"];
        var assignmentArray = simulationActionResponseResMgr.data["assignmentBuckets"];
        AssignmentIntegrationTest.assignmentBucketId = assignmentArray[0].ID;
        AssignmentIntegrationTest.startTime = assignmentArray[0]["startTime"];
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        const draftCreateActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');

        const payloadForDraftActivation = {};
        const draftActivationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');


        /*****************************************************************************************************************
          Changing of assignment created in previous step should succeed
        *****************************************************************************************************************/

        const changePayload = {
            ID: AssignmentIntegrationTest.assignmentId,
            bookedCapacityInMinutes: 25440,
            resourceRequest_ID: AssignmentIntegrationTest.resourceRequestId,
            resource_ID: AssignmentIntegrationTest.resourceId,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AssignmentIntegrationTest.assignmentBucketId,
                    startTime: AssignmentIntegrationTest.startTime,
                    bookedCapacityInMinutes: 25440,
                    assignment_ID: AssignmentIntegrationTest.assignmentId,
                }
            ]
        }

        let assignmentChangeActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayload.ID + ',IsActiveEntity=true)', changePayload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');


        /*****************************************************************************************************************
          We try to trigger an actual business error for the above assignment now. Mock server is configured to return
          an error in the 'Changeset' for the specific payload below. The batch response status code would be 202 but
          the response status of the changeset within the batch would be 400. This simulates an actual S4 business error.

          NOTE: THIS SHOULD SUCCEED HOWEVER SINCE IT IS A NON-S4 REQUEST AND MOCK SERVER SHOULD NOT BE INVOLVED HERE
        *****************************************************************************************************************/

        const changePayloadForS4Error = {
            ID: AssignmentIntegrationTest.assignmentId,
            bookedCapacityInMinutes: 2520,
            resourceRequest_ID: AssignmentIntegrationTest.resourceRequestId,
            resource_ID: AssignmentIntegrationTest.resourceId,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AssignmentIntegrationTest.assignmentBucketId,
                    startTime: AssignmentIntegrationTest.startTime,
                    bookedCapacityInMinutes: 2520,
                    assignment_ID: AssignmentIntegrationTest.assignmentId,
                }
            ]
        }

        assignmentChangeActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayloadForS4Error.ID + ',IsActiveEntity=true)', changePayloadForS4Error);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');


        /*****************************************************************************************************************
          Deleting of assignment created in previous step should succeed
        *****************************************************************************************************************/

        const assignmentDeleteActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.delete('/Assignments(ID=' + AssignmentIntegrationTest.assignmentId + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 204, 'Expected status code to be 204 (OK).');

        const assignmentReadActionResponsePostDeletion = await AssignmentIntegrationTest.assignmentServiceClient.get('/Assignments(ID=' + AssignmentIntegrationTest.assignmentId + ',IsActiveEntity=true)');
        assert.equal(assignmentReadActionResponsePostDeletion.status, 404, 'Expected status code to be 404 (NOT_FOUND).');

    }

    // @test(timeout(TEST_TIMEOUT))
    async 'Random business error during assignment creation'() {

        //Mock server to configured to fail always if the Assignment total hours = 99. 
        //This is the simple way to simulate a Create failure from the S/4 service. 
        //All other cases would be already checked in SCP level as part of existing test
        const payload = {
            resourceId: AssignmentIntegrationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentIntegrationTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "99",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const simulationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentIntegrationTest.assignmentIDs = `${AssignmentIntegrationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        delete simulationActionResponseResMgr.data["@context"];

        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        const draftCreateActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');

        const payloadForDraftActivation = {};
        const draftActivationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 400, 'Expected status code to be 400.');
        assert.equal(draftActivationActionResponseResMgr.data.error.message, 'Work package RYPROJID.1.1: Employee 50000730 is already staffed to resource demand 0011.', 'Expected error message returned from mock server');

    }

    // @test(timeout(TEST_TIMEOUT))
    async 'Technical Error during assignment creation'() {

        //Mock Server is configured in such a way that any request in WorkPackage-TimeOutWP will result in delay in response. 
        //This will correspond to technical error on the SCP side.
        const payload = {
            resourceId: AssignmentIntegrationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentIntegrationTest.resourceRequests[3].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const simulationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentIntegrationTest.assignmentIDs = `${AssignmentIntegrationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        delete simulationActionResponseResMgr.data["@context"];

        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        const draftCreateActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');

        const payloadForDraftActivation = {};
        const draftActivationActionResponseResMgr = await AssignmentIntegrationTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 400, 'Expected status code to be 400.');
        assert.equal(draftActivationActionResponseResMgr.data.error.message, 'The assignment could not be created.', 'Expected generic error message');

    }


    @timeout(TEST_TIMEOUT)
    static async after() {

        //Mock server will be set to allow all mode
        const assignmentDeleteActionResponse = await AssignmentIntegrationTest.assignmentServiceClient.delete('/Assignments(ID=' + AssignmentIntegrationTest.mockServerStrictAssignmentId + ',IsActiveEntity=true)');

        if (assignmentDeleteActionResponse.status === 204) {
            console.log("Mock server was successfully set to AllowAll mode.");
        } else {
            console.log("There was an error in resetting the mock server state.");
            console.log("To switch back mode from Strict mode to AllowAll mode, call the GET on this URL (GET without mode parameter) - <service_root>/sap/opu/odata/CPD/SC_PROJ_ENGMT_CREATE_UPD_SRV");
        }

        await AssignmentIntegrationTest.cleanUpResourceBookedCapacityTable(AssignmentIntegrationTest.resourceHeader.map(r => r.ID));

        await AssignmentIntegrationTest.assignmentRepository.deleteMany(AssignmentIntegrationTest.assignment);
        await AssignmentIntegrationTest.assignmentBucketRepository.deleteMany(AssignmentIntegrationTest.assignmentBuckets);
        await AssignmentIntegrationTest.resourceRequestRepository.deleteMany(AssignmentIntegrationTest.resourceRequests);
        await AssignmentIntegrationTest.capacityRequirementRepository.deleteMany(AssignmentIntegrationTest.capacityRequirement);
        await AssignmentIntegrationTest.demandRepository.deleteMany(AssignmentIntegrationTest.demand);
        await AssignmentIntegrationTest.workPackageRepository.deleteMany(AssignmentIntegrationTest.workPackage);
        await AssignmentIntegrationTest.resourceHeaderRepository.deleteMany(AssignmentIntegrationTest.resourceHeader);
        await AssignmentIntegrationTest.resourceTypesRepository.deleteMany(AssignmentIntegrationTest.resourceTypes);
        await AssignmentIntegrationTest.resourceCapacityRepository.deleteMany(AssignmentIntegrationTest.resourceCapacity);
        await AssignmentIntegrationTest.jobDetailRepository.deleteMany(AssignmentIntegrationTest.jobDetail);
        await AssignmentIntegrationTest.organizationHeaderRepository.deleteMany(AssignmentIntegrationTest.organizationHeader);
        await AssignmentIntegrationTest.organizationDetailRepository.deleteMany(AssignmentIntegrationTest.organizationDetail);
        await AssignmentIntegrationTest.employeeHeaderRepository.deleteMany(AssignmentIntegrationTest.employeeHeader);
        await AssignmentIntegrationTest.workAssignmentRepository.deleteMany(AssignmentIntegrationTest.workAssignment);
        await AssignmentIntegrationTest.workforcePersonRepository.deleteMany(AssignmentIntegrationTest.workforcePerson);
        await AssignmentIntegrationTest.costCenterRepository.deleteMany(AssignmentIntegrationTest.costCenter);

        await AssignmentIntegrationTest.resourceOrganizationsRepository.deleteMany(AssignmentIntegrationTest.resourceOrganizations);
        await AssignmentIntegrationTest.resourceOrganizationItemsRepository.deleteMany(AssignmentIntegrationTest.resourceOrganizationItems);

        AssignmentIntegrationTest.assignmentIDs = `${AssignmentIntegrationTest.assignmentIDs} )`;
        let sqlStatementString = AssignmentIntegrationTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssignmentIntegrationTest.assignmentIDs}`);
        await AssignmentIntegrationTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssignmentIntegrationTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssignmentIntegrationTest.assignmentIDs}`);
        await AssignmentIntegrationTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
    }

    @timeout(TEST_TIMEOUT)
    static async cleanUpResourceBookedCapacityTable(resourceIDArray: string[]) {

        if (resourceIDArray.length < 1) return;

        let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
        let resourceIdConcatenatedString: String = '( ';
        resourceIdConcatenatedString = `${resourceIdConcatenatedString} '${resourceIDArray[0]}'`;
        for (var i = 1; i < resourceIDArray.length; i++) {
            resourceIdConcatenatedString = `${resourceIdConcatenatedString}, '${resourceIDArray[i]}'`;
        }
        resourceIdConcatenatedString = `${resourceIdConcatenatedString} )`;
        let deleteResourceBookedCapacityRecords = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${resourceIdConcatenatedString}`);
        await bookedCapacityAggregateRepository.statementExecutor.execute(deleteResourceBookedCapacityRecords);
    }

}
