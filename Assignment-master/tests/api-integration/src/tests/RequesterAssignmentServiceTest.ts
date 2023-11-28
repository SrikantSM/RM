import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceRequestRepository, CapacityRequirementRepository, ResourceTypesRepository, AssignmentsRepository, AssignmentBucketRepository, Assignments, AssignmentBucket, ResourceRequest, CapacityRequirement, ResourceHeader, ResourceTypes, ResourceCapacity, DemandRepository, Demand, JobDetailRepository, OrganizationDetailRepository, OrganizationHeaderRepository, EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository, CostCenterRepository, CostCenter, OrganizationDetail, OrganizationHeader, JobDetail, EmployeeHeader, WorkAssignment, WorkforcePerson, WorkPackage, WorkPackageRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository, BookedCapacityAggregateRepository } from 'test-commons';

/**
 * In case of 400/403 errors, please check if the following roles are maintained in the space
 * Requester -> `ENV_USER_PROJECTMANAGER` (Check vault to find which user id is to be used)
 * Requester with RequestedResourceOrganization = ROO1 (Alphabet O, not number Zero) -> `ENV_USER_PROJECTMANAGER_AUTHORIZED` (Check vault to find which user id is to be used)
 */

@suite
export class RequesterAssignmentServiceTest {

    private static requesterAssignmentServiceClientAuthForAllReqResOrg: AxiosInstance;
    private static requesterAssignmentServiceClientAuthForSpecificReqResOrg: AxiosInstance;
    private static requesterAssignmentServiceClientForResourceManager: AxiosInstance;

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
        RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForAllReqResOrg = await testEnvironment.getRequesterAssignmentServiceClientAuthForAllReqResOrg();
        RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForSpecificReqResOrg = await testEnvironment.getRequesterAssignmentServiceClientAuthForSpecificReqResOrg();
        RequesterAssignmentServiceTest.requesterAssignmentServiceClientForResourceManager = await testEnvironment.getRequesterAssignmentServiceClientForResourceManager();

        RequesterAssignmentServiceTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        RequesterAssignmentServiceTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();

        RequesterAssignmentServiceTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        RequesterAssignmentServiceTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        RequesterAssignmentServiceTest.demandRepository = await testEnvironment.getDemandRepository();
        RequesterAssignmentServiceTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        RequesterAssignmentServiceTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        RequesterAssignmentServiceTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        RequesterAssignmentServiceTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();

        RequesterAssignmentServiceTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        RequesterAssignmentServiceTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        RequesterAssignmentServiceTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        RequesterAssignmentServiceTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        RequesterAssignmentServiceTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        RequesterAssignmentServiceTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        RequesterAssignmentServiceTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        RequesterAssignmentServiceTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        RequesterAssignmentServiceTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        RequesterAssignmentServiceTest.uniquifier = new Uniquifier();

        RequesterAssignmentServiceTest.assignment = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        RequesterAssignmentServiceTest.assignmentBuckets = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        RequesterAssignmentServiceTest.resourceRequests = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        RequesterAssignmentServiceTest.capacityRequirement = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');
        RequesterAssignmentServiceTest.demand = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.project.demands.csv', 'Demand');
        RequesterAssignmentServiceTest.workPackage = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
        RequesterAssignmentServiceTest.employeeHeader = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');

        RequesterAssignmentServiceTest.resourceHeader = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        RequesterAssignmentServiceTest.resourceTypes = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        RequesterAssignmentServiceTest.resourceCapacity = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        RequesterAssignmentServiceTest.workAssignment = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        RequesterAssignmentServiceTest.workforcePerson = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        RequesterAssignmentServiceTest.organizationHeader = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        RequesterAssignmentServiceTest.organizationDetail = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        RequesterAssignmentServiceTest.jobDetail = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        RequesterAssignmentServiceTest.costCenter = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        RequesterAssignmentServiceTest.resourceOrganizations = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        RequesterAssignmentServiceTest.resourceOrganizationItems = await RequesterAssignmentServiceTest.uniquifier.getRecords('../data/input/requesterAssignmentService/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await RequesterAssignmentServiceTest.assignmentRepository.insertMany(RequesterAssignmentServiceTest.assignment);
        await RequesterAssignmentServiceTest.assignmentBucketRepository.insertMany(RequesterAssignmentServiceTest.assignmentBuckets);
        await RequesterAssignmentServiceTest.resourceRequestRepository.insertMany(RequesterAssignmentServiceTest.resourceRequests);
        await RequesterAssignmentServiceTest.capacityRequirementRepository.insertMany(RequesterAssignmentServiceTest.capacityRequirement);
        await RequesterAssignmentServiceTest.demandRepository.insertMany(RequesterAssignmentServiceTest.demand);
        await RequesterAssignmentServiceTest.workPackageRepository.insertMany(RequesterAssignmentServiceTest.workPackage);
        await RequesterAssignmentServiceTest.resourceTypesRepository.insertMany(RequesterAssignmentServiceTest.resourceTypes);
        await RequesterAssignmentServiceTest.resourceHeaderRepository.insertMany(RequesterAssignmentServiceTest.resourceHeader);
        await RequesterAssignmentServiceTest.resourceCapacityRepository.insertMany(RequesterAssignmentServiceTest.resourceCapacity);
        await RequesterAssignmentServiceTest.jobDetailRepository.insertMany(RequesterAssignmentServiceTest.jobDetail);
        await RequesterAssignmentServiceTest.organizationDetailRepository.insertMany(RequesterAssignmentServiceTest.organizationDetail);
        await RequesterAssignmentServiceTest.organizationHeaderRepository.insertMany(RequesterAssignmentServiceTest.organizationHeader);
        await RequesterAssignmentServiceTest.employeeHeaderRepository.insertMany(RequesterAssignmentServiceTest.employeeHeader);
        await RequesterAssignmentServiceTest.workAssignmentRepository.insertMany(RequesterAssignmentServiceTest.workAssignment);
        await RequesterAssignmentServiceTest.workforcePersonRepository.insertMany(RequesterAssignmentServiceTest.workforcePerson);
        await RequesterAssignmentServiceTest.costCenterRepository.insertMany(RequesterAssignmentServiceTest.costCenter);

        await RequesterAssignmentServiceTest.resourceOrganizationsRepository.insertMany(RequesterAssignmentServiceTest.resourceOrganizations);
        await RequesterAssignmentServiceTest.resourceOrganizationItemsRepository.insertMany(RequesterAssignmentServiceTest.resourceOrganizationItems);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager cannot accept a proposed assignment'() {

        const acceptPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[0].ID,
            status: 3
        };

        const setAcceptedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientForResourceManager.post('/SetAssignmentStatus', acceptPayload);
        assert.equal(setAcceptedResponse.status, 403, 'Expected status code to be 403 (Unauthorized).');
        assert.equal(setAcceptedResponse.data.error.message, `Not authorized to send event 'SetAssignmentStatus' to 'RequesterAssignmentService'`, 'Expected error message not returned');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager cannot reject a proposed assignment'() {

        const rejectPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[0].ID,
            status: 4
        };

        const setRejectedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientForResourceManager.post('/SetAssignmentStatus', rejectPayload);
        assert.equal(setRejectedResponse.status, 403, 'Expected status code to be 403 (Unauthorized).');
        assert.equal(setRejectedResponse.data.error.message, `Not authorized to send event 'SetAssignmentStatus' to 'RequesterAssignmentService'`, 'Expected error message not returned');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Requester not authorized for requested resource org of request cannot accept a proposed assignment'() {

        const acceptPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[2].ID,
            status: 3
        };

        const setAcceptedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForSpecificReqResOrg.post('/SetAssignmentStatus', acceptPayload);
        assert.equal(setAcceptedResponse.status, 400, 'Expected status code to be 400 (Bad Request).');
        assert.equal(setAcceptedResponse.data.error.message, `You are not authorized for the resource organization.`, 'Expected error message not returned');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Requester not authorized for requested resource org of request cannot reject a proposed assignment'() {

        const rejectPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[2].ID,
            status: 4
        };

        const setRejectedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForSpecificReqResOrg.post('/SetAssignmentStatus', rejectPayload);
        assert.equal(setRejectedResponse.status, 400, 'Expected status code to be 400 (Bad Request).');
        assert.equal(setRejectedResponse.data.error.message, `You are not authorized for the resource organization.`, 'Expected error message not returned');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Requester authorized for all requested resource organizations can accept a proposed assignment'() {

        const acceptPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[2].ID,
            status: 3
        };

        const setAcceptedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForAllReqResOrg.post('/SetAssignmentStatus', acceptPayload);
        assert.equal(setAcceptedResponse.status, 204, 'Expected status code to be 204 (No Content).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Requester authorized for all requested resource organizations can reject a proposed assignment'() {

        const rejectPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[3].ID,
            status: 4
        };

        const setRejectedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForAllReqResOrg.post('/SetAssignmentStatus', rejectPayload);
        assert.equal(setRejectedResponse.status, 204, 'Expected status code to be 204 (No Content).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Requester authorized for requested resource org of request can accept a proposed assignment'() {

        const acceptPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[0].ID,
            status: 3
        };

        const setAcceptedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForSpecificReqResOrg.post('/SetAssignmentStatus', acceptPayload);
        assert.equal(setAcceptedResponse.status, 204, 'Expected status code to be 204 (No Content).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Requester authorized for requested resource org of request can reject a proposed assignment'() {

        const rejectPayload = {
            assignmentID: RequesterAssignmentServiceTest.assignment[1].ID,
            status: 4
        };

        const setRejectedResponse = await RequesterAssignmentServiceTest.requesterAssignmentServiceClientAuthForSpecificReqResOrg.post('/SetAssignmentStatus', rejectPayload);
        assert.equal(setRejectedResponse.status, 204, 'Expected status code to be 204 (No Content).');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await RequesterAssignmentServiceTest.cleanUpResourceBookedCapacityTable(RequesterAssignmentServiceTest.resourceHeader.map(r => r.ID));

        await RequesterAssignmentServiceTest.assignmentRepository.deleteMany(RequesterAssignmentServiceTest.assignment);
        await RequesterAssignmentServiceTest.assignmentBucketRepository.deleteMany(RequesterAssignmentServiceTest.assignmentBuckets);
        await RequesterAssignmentServiceTest.resourceRequestRepository.deleteMany(RequesterAssignmentServiceTest.resourceRequests);
        await RequesterAssignmentServiceTest.capacityRequirementRepository.deleteMany(RequesterAssignmentServiceTest.capacityRequirement);
        await RequesterAssignmentServiceTest.demandRepository.deleteMany(RequesterAssignmentServiceTest.demand);
        await RequesterAssignmentServiceTest.workPackageRepository.deleteMany(RequesterAssignmentServiceTest.workPackage);
        await RequesterAssignmentServiceTest.resourceHeaderRepository.deleteMany(RequesterAssignmentServiceTest.resourceHeader);
        await RequesterAssignmentServiceTest.resourceTypesRepository.deleteMany(RequesterAssignmentServiceTest.resourceTypes);
        await RequesterAssignmentServiceTest.resourceCapacityRepository.deleteMany(RequesterAssignmentServiceTest.resourceCapacity);
        await RequesterAssignmentServiceTest.jobDetailRepository.deleteMany(RequesterAssignmentServiceTest.jobDetail);
        await RequesterAssignmentServiceTest.organizationHeaderRepository.deleteMany(RequesterAssignmentServiceTest.organizationHeader);
        await RequesterAssignmentServiceTest.organizationDetailRepository.deleteMany(RequesterAssignmentServiceTest.organizationDetail);
        await RequesterAssignmentServiceTest.employeeHeaderRepository.deleteMany(RequesterAssignmentServiceTest.employeeHeader);
        await RequesterAssignmentServiceTest.workAssignmentRepository.deleteMany(RequesterAssignmentServiceTest.workAssignment);
        await RequesterAssignmentServiceTest.workforcePersonRepository.deleteMany(RequesterAssignmentServiceTest.workforcePerson);
        await RequesterAssignmentServiceTest.costCenterRepository.deleteMany(RequesterAssignmentServiceTest.costCenter);

        await RequesterAssignmentServiceTest.resourceOrganizationsRepository.deleteMany(RequesterAssignmentServiceTest.resourceOrganizations);
        await RequesterAssignmentServiceTest.resourceOrganizationItemsRepository.deleteMany(RequesterAssignmentServiceTest.resourceOrganizationItems);
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
