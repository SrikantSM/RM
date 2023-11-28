import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import {
    ResourceHeaderRepository, ResourceCapacityRepository,
    ResourceRequestRepository, CapacityRequirementRepository,
    ResourceTypesRepository, JobDetailRepository, OrganizationHeaderRepository, OrganizationDetailRepository,
    EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository, CostCenterRepository, ResourceRequest, CapacityRequirement,
    ResourceHeader, ResourceTypes, ResourceCapacity, JobDetail, OrganizationDetail, OrganizationHeader, EmployeeHeader, WorkAssignment, WorkforcePerson, CostCenter, BookedCapacityAggregateRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository
} from 'test-commons';

@suite
export class AssignmentInstanceBasedAuthorizationTest {
    private static asgnSrvClientResourceManager: AxiosInstance;

    private static uniquifier: Uniquifier;

    private static resourceRequestRepository: ResourceRequestRepository;
    private static capacityRequirementRepository: CapacityRequirementRepository;
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

    private static resourceRequests: ResourceRequest[];
    private static capacityRequirement: CapacityRequirement[];
    private static costCenter: CostCenter[];
    private static resourceTypes: ResourceTypes[];
    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];
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
        AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager = await testEnvironment.getAuthAttrTestUser01ServiceClient();

        AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssignmentInstanceBasedAuthorizationTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        AssignmentInstanceBasedAuthorizationTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssignmentInstanceBasedAuthorizationTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AssignmentInstanceBasedAuthorizationTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        AssignmentInstanceBasedAuthorizationTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AssignmentInstanceBasedAuthorizationTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssignmentInstanceBasedAuthorizationTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssignmentInstanceBasedAuthorizationTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssignmentInstanceBasedAuthorizationTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssignmentInstanceBasedAuthorizationTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssignmentInstanceBasedAuthorizationTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

        AssignmentInstanceBasedAuthorizationTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AssignmentInstanceBasedAuthorizationTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        AssignmentInstanceBasedAuthorizationTest.uniquifier = new Uniquifier();

        AssignmentInstanceBasedAuthorizationTest.resourceRequests = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssignmentInstanceBasedAuthorizationTest.capacityRequirement = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

        AssignmentInstanceBasedAuthorizationTest.resourceHeader = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssignmentInstanceBasedAuthorizationTest.resourceTypes = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        AssignmentInstanceBasedAuthorizationTest.resourceCapacity = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssignmentInstanceBasedAuthorizationTest.employeeHeader = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        AssignmentInstanceBasedAuthorizationTest.workAssignment = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssignmentInstanceBasedAuthorizationTest.workforcePerson = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssignmentInstanceBasedAuthorizationTest.organizationHeader = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        AssignmentInstanceBasedAuthorizationTest.organizationDetail = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssignmentInstanceBasedAuthorizationTest.jobDetail = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        AssignmentInstanceBasedAuthorizationTest.costCenter = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        AssignmentInstanceBasedAuthorizationTest.resourceOrganizations = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AssignmentInstanceBasedAuthorizationTest.resourceOrganizationItems = await AssignmentInstanceBasedAuthorizationTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.resourceRequests);
        await AssignmentInstanceBasedAuthorizationTest.capacityRequirementRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.capacityRequirement);

        await AssignmentInstanceBasedAuthorizationTest.resourceTypesRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.resourceTypes);

        await AssignmentInstanceBasedAuthorizationTest.resourceHeaderRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.resourceHeader);
        await AssignmentInstanceBasedAuthorizationTest.resourceCapacityRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.resourceCapacity);
        await AssignmentInstanceBasedAuthorizationTest.jobDetailRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.jobDetail);
        await AssignmentInstanceBasedAuthorizationTest.organizationDetailRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.organizationDetail);
        await AssignmentInstanceBasedAuthorizationTest.organizationHeaderRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.organizationHeader);
        await AssignmentInstanceBasedAuthorizationTest.employeeHeaderRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.employeeHeader);
        await AssignmentInstanceBasedAuthorizationTest.workAssignmentRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.workAssignment);
        await AssignmentInstanceBasedAuthorizationTest.workforcePersonRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.workforcePerson);
        await AssignmentInstanceBasedAuthorizationTest.costCenterRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.costCenter);

        await AssignmentInstanceBasedAuthorizationTest.resourceOrganizationsRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.resourceOrganizations);
        await AssignmentInstanceBasedAuthorizationTest.resourceOrganizationItemsRepository.insertMany(AssignmentInstanceBasedAuthorizationTest.resourceOrganizationItems);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Attribute user01 can access Assignment entity'() {

        const assignmentService = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Attribute user01 can access Assignment Bucket entity'() {

        const assignmentService = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Attribute user02 can invoke total hours simulation action'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const response = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs} '${response.data.ID}'`;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Attribute user01 can invoke as requested simulation action'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[0].ID,
            mode: "I"
        };
        const response = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAssignmentAsRequested', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}, '${response.data.ID}'`;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource manager with valid cost center'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[1].ID,
            start: "2019-10-15",
            end: "2019-10-17",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);

        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        assert.equal(draftCreateActionResponseResMgr.data.ID, payloadForDraftCreation.ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a newly created draft');
        assert.equal(draftCreateActionResponseResMgr.data.assignmentBuckets.length, payloadForDraftCreation.assignmentBuckets.length, 'Created draft not in sync with payload');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource manager with invalid cost center'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[1].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[1].ID,
            start: "2019-10-15",
            end: "2019-10-17",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Expected status code to be 400.');
        assert.isNotNull(draftCreateActionResponseResMgr.data.error, 'User is not authorized for costcenter.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource with short validity'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[2].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[1].ID,
            start: "2019-10-15",
            end: "2019-10-17",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        assert.equal(draftCreateActionResponseResMgr.data.ID, payloadForDraftCreation.ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a newly created draft');
        assert.equal(draftCreateActionResponseResMgr.data.assignmentBuckets.length, payloadForDraftCreation.assignmentBuckets.length, 'Created draft not in sync with payload');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource with 2019 validity as per request but invalid cost center'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[3].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[1].ID,
            start: "2019-10-15",
            end: "2019-10-17",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Expected status code to be 400.');
        assert.isNotNull(draftCreateActionResponseResMgr.data.error, 'User is not authorized for costcenter.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource with split validity as per request but different cost centers'() {

        const payload = {
            resourceId: AssignmentInstanceBasedAuthorizationTest.resourceHeader[2].ID,
            resourceRequestId: AssignmentInstanceBasedAuthorizationTest.resourceRequests[1].ID,
            start: "2020-10-15",
            end: "2020-10-17",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentInstanceBasedAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Expected status code to be 400.');
        assert.isNotNull(draftCreateActionResponseResMgr.data.error, 'User is not authorized for costcenter.');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await AssignmentInstanceBasedAuthorizationTest.cleanUpResourceBookedCapacityTable(AssignmentInstanceBasedAuthorizationTest.resourceHeader.map(r => r.ID));

        await AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.resourceRequests);
        await AssignmentInstanceBasedAuthorizationTest.capacityRequirementRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.capacityRequirement);
        await AssignmentInstanceBasedAuthorizationTest.resourceHeaderRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.resourceHeader);
        await AssignmentInstanceBasedAuthorizationTest.resourceTypesRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.resourceTypes);
        await AssignmentInstanceBasedAuthorizationTest.resourceCapacityRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.resourceCapacity);
        await AssignmentInstanceBasedAuthorizationTest.jobDetailRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.jobDetail);
        await AssignmentInstanceBasedAuthorizationTest.organizationHeaderRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.organizationHeader);
        await AssignmentInstanceBasedAuthorizationTest.organizationDetailRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.organizationDetail);
        await AssignmentInstanceBasedAuthorizationTest.employeeHeaderRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.employeeHeader);
        await AssignmentInstanceBasedAuthorizationTest.workAssignmentRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.workAssignment);
        await AssignmentInstanceBasedAuthorizationTest.workforcePersonRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.workforcePerson);
        await AssignmentInstanceBasedAuthorizationTest.costCenterRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.costCenter);

        await AssignmentInstanceBasedAuthorizationTest.resourceOrganizationsRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.resourceOrganizations);
        await AssignmentInstanceBasedAuthorizationTest.resourceOrganizationItemsRepository.deleteMany(AssignmentInstanceBasedAuthorizationTest.resourceOrganizationItems);

        AssignmentInstanceBasedAuthorizationTest.assignmentIDs = `${AssignmentInstanceBasedAuthorizationTest.assignmentIDs} )`;
        let sqlStatementString = AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}`);
        await AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssignmentInstanceBasedAuthorizationTest.assignmentIDs}`);
        await AssignmentInstanceBasedAuthorizationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
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
