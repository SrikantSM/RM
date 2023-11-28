import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import {
    ResourceHeaderRepository, ResourceCapacityRepository,
    ResourceRequestRepository, CapacityRequirementRepository,
    ResourceTypesRepository, JobDetailRepository, OrganizationHeaderRepository, OrganizationDetailRepository,
    EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository,CostCenterRepository, ResourceRequest, CapacityRequirement,
    ResourceHeader, ResourceTypes, ResourceCapacity, JobDetail, OrganizationDetail, OrganizationHeader, EmployeeHeader, WorkAssignment, WorkforcePerson,CostCenter, BookedCapacityAggregateRepository, ResourceOrganizations, ResourceOrganizationItems, ResourceOrganizationsRepository, ResourceOrganizationItemsRepository
} from 'test-commons';

@suite
export class AssgnMultiCostCenterRestrictedUserTest {
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
    private static costCenter:CostCenter[];
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
        AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager = await testEnvironment.getAuthAttrTestUser01ServiceClient();

        AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssgnMultiCostCenterRestrictedUserTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        AssgnMultiCostCenterRestrictedUserTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssgnMultiCostCenterRestrictedUserTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AssgnMultiCostCenterRestrictedUserTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        AssgnMultiCostCenterRestrictedUserTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AssgnMultiCostCenterRestrictedUserTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssgnMultiCostCenterRestrictedUserTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssgnMultiCostCenterRestrictedUserTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssgnMultiCostCenterRestrictedUserTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssgnMultiCostCenterRestrictedUserTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssgnMultiCostCenterRestrictedUserTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        AssgnMultiCostCenterRestrictedUserTest.uniquifier = new Uniquifier();

        AssgnMultiCostCenterRestrictedUserTest.resourceRequests = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssgnMultiCostCenterRestrictedUserTest.capacityRequirement = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

        AssgnMultiCostCenterRestrictedUserTest.resourceHeader = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssgnMultiCostCenterRestrictedUserTest.resourceTypes = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        AssgnMultiCostCenterRestrictedUserTest.resourceCapacity = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssgnMultiCostCenterRestrictedUserTest.employeeHeader = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        AssgnMultiCostCenterRestrictedUserTest.workAssignment = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssgnMultiCostCenterRestrictedUserTest.workforcePerson = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssgnMultiCostCenterRestrictedUserTest.organizationHeader = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        AssgnMultiCostCenterRestrictedUserTest.organizationDetail = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssgnMultiCostCenterRestrictedUserTest.jobDetail = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        AssgnMultiCostCenterRestrictedUserTest.costCenter = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        AssgnMultiCostCenterRestrictedUserTest.resourceOrganizations = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationItems = await AssgnMultiCostCenterRestrictedUserTest.uniquifier.getRecords('../data/input/asgMultiCostCenterResUser/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.resourceRequests);
        await AssgnMultiCostCenterRestrictedUserTest.capacityRequirementRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.capacityRequirement);

        await AssgnMultiCostCenterRestrictedUserTest.resourceTypesRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.resourceTypes);

        await AssgnMultiCostCenterRestrictedUserTest.resourceHeaderRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.resourceHeader);
        await AssgnMultiCostCenterRestrictedUserTest.resourceCapacityRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.resourceCapacity);
        await AssgnMultiCostCenterRestrictedUserTest.jobDetailRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.jobDetail);
        await AssgnMultiCostCenterRestrictedUserTest.organizationDetailRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.organizationDetail);
        await AssgnMultiCostCenterRestrictedUserTest.organizationHeaderRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.organizationHeader);
        await AssgnMultiCostCenterRestrictedUserTest.employeeHeaderRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.employeeHeader);
        await AssgnMultiCostCenterRestrictedUserTest.workAssignmentRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.workAssignment);
        await AssgnMultiCostCenterRestrictedUserTest.workforcePersonRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.workforcePerson);
        await AssgnMultiCostCenterRestrictedUserTest.costCenterRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.costCenter);

        await AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationsRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.resourceOrganizations);
        await AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationItemsRepository.insertMany(AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationItems);
        
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment Attribute user01 can access Assignment entity'() {

        const assignmentService = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment Attribute user01 can access Assignment Bucket entity'() {

        const assignmentService = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Attribute user01 can invoke total hours simulation action'() {

        const payload = {
            resourceId: AssgnMultiCostCenterRestrictedUserTest.resourceHeader[0].ID,
            resourceRequestId: AssgnMultiCostCenterRestrictedUserTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const response = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        AssgnMultiCostCenterRestrictedUserTest.assignmentIDs = `${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs} '${response.data.ID}'`;
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Attribute user01 can invoke as requested simulation action'() {

        const payload = {
            resourceId: AssgnMultiCostCenterRestrictedUserTest.resourceHeader[0].ID,
            resourceRequestId: AssgnMultiCostCenterRestrictedUserTest.resourceRequests[0].ID,
            mode: "I"
        };
        const response = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/SimulateAssignmentAsRequested', payload);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        AssgnMultiCostCenterRestrictedUserTest.assignmentIDs = `${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs}, '${response.data.ID}'`;

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource with unique cost center'() {

        const payload = {
            resourceId: AssgnMultiCostCenterRestrictedUserTest.resourceHeader[0].ID,
            resourceRequestId: AssgnMultiCostCenterRestrictedUserTest.resourceRequests[1].ID,
            start: "2019-10-15",
            end: "2019-10-17",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssgnMultiCostCenterRestrictedUserTest.assignmentIDs = `${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        const draftCreateActionResponseResMgr = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        assert.equal(draftCreateActionResponseResMgr.data.ID, payloadForDraftCreation.ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a newly created draft');
        assert.equal(draftCreateActionResponseResMgr.data.assignmentBuckets.length, payloadForDraftCreation.assignmentBuckets.length, 'Created draft not in sync with payload');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for Resource with multiple cost centers during same assignment duration'(){

        const payload = {
            resourceId: AssgnMultiCostCenterRestrictedUserTest.resourceHeader[2].ID,
            resourceRequestId: AssgnMultiCostCenterRestrictedUserTest.resourceRequests[1].ID,
            start: "2020-10-01",
            end: "2020-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssgnMultiCostCenterRestrictedUserTest.assignmentIDs = `${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        const draftCreateActionResponseResMgr = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Expected status code to be 400.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource with split validity as per request but different cost centers'() {

        const payload = {
            resourceId: AssgnMultiCostCenterRestrictedUserTest.resourceHeader[1].ID,
            resourceRequestId: AssgnMultiCostCenterRestrictedUserTest.resourceRequests[1].ID,
            start: "2020-10-01",
            end: "2020-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssgnMultiCostCenterRestrictedUserTest.assignmentIDs = `${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        const draftCreateActionResponseResMgr = await AssgnMultiCostCenterRestrictedUserTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Expected status code to be 400.');
        assert.isNotNull(draftCreateActionResponseResMgr.data.error, 'User is not authorized for costcenter.');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await AssgnMultiCostCenterRestrictedUserTest.cleanUpResourceBookedCapacityTable(AssgnMultiCostCenterRestrictedUserTest.resourceHeader.map(r => r.ID));

        await AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.resourceRequests);
        await AssgnMultiCostCenterRestrictedUserTest.capacityRequirementRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.capacityRequirement);
        await AssgnMultiCostCenterRestrictedUserTest.resourceHeaderRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.resourceHeader);
        await AssgnMultiCostCenterRestrictedUserTest.resourceTypesRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.resourceTypes);
        await AssgnMultiCostCenterRestrictedUserTest.resourceCapacityRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.resourceCapacity);
        await AssgnMultiCostCenterRestrictedUserTest.jobDetailRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.jobDetail);
        await AssgnMultiCostCenterRestrictedUserTest.organizationHeaderRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.organizationHeader);
        await AssgnMultiCostCenterRestrictedUserTest.organizationDetailRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.organizationDetail);
        await AssgnMultiCostCenterRestrictedUserTest.employeeHeaderRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.employeeHeader);
        await AssgnMultiCostCenterRestrictedUserTest.workAssignmentRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.workAssignment);
        await AssgnMultiCostCenterRestrictedUserTest.workforcePersonRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.workforcePerson);
        await AssgnMultiCostCenterRestrictedUserTest.costCenterRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.costCenter);
        await AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationsRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.resourceOrganizations);
        await AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationItemsRepository.deleteMany(AssgnMultiCostCenterRestrictedUserTest.resourceOrganizationItems);


        AssgnMultiCostCenterRestrictedUserTest.assignmentIDs = `${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs} )`;
        let sqlStatementString = AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs}`);
        await AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssgnMultiCostCenterRestrictedUserTest.assignmentIDs}`);        
        await AssgnMultiCostCenterRestrictedUserTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
    }

    @timeout(TEST_TIMEOUT)
    static async cleanUpResourceBookedCapacityTable(resourceIDArray: string[]) {

        if(resourceIDArray.length < 1) return;

        let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
        let resourceIdConcatenatedString: String = '( ';
        resourceIdConcatenatedString = `${resourceIdConcatenatedString} '${resourceIDArray[0]}'`;
        for(var i = 1 ; i < resourceIDArray.length ; i++) {
            resourceIdConcatenatedString = `${resourceIdConcatenatedString}, '${resourceIDArray[i]}'`;
        }
        resourceIdConcatenatedString = `${resourceIdConcatenatedString} )`;
        let deleteResourceBookedCapacityRecords = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${resourceIdConcatenatedString}`);
        await bookedCapacityAggregateRepository.statementExecutor.execute(deleteResourceBookedCapacityRecords);
    }

}
