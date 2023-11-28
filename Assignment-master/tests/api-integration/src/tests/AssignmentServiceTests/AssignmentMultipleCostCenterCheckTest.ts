import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import {
    ResourceHeaderRepository, ResourceCapacityRepository,
    ResourceRequestRepository, CapacityRequirementRepository,
    ResourceTypesRepository, JobDetailRepository, OrganizationHeaderRepository, OrganizationDetailRepository,
    EmployeeHeaderRepository,CostCenterRepository, WorkAssignmentRepository, WorkforcePersonRepository, ResourceRequest, CapacityRequirement,
    ResourceHeader, ResourceTypes,CostCenter, ResourceCapacity, JobDetail, OrganizationDetail, OrganizationHeader, EmployeeHeader, WorkAssignment, WorkforcePerson, BookedCapacityAggregateRepository
} from 'test-commons';

@suite
export class AssignmentMultipleCostCenterCheckTest {
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

    @timeout(TEST_TIMEOUT)
    static async before() {
        AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager = await testEnvironment.getResourceManagerServiceClient();

        AssignmentMultipleCostCenterCheckTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssignmentMultipleCostCenterCheckTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        AssignmentMultipleCostCenterCheckTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssignmentMultipleCostCenterCheckTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AssignmentMultipleCostCenterCheckTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        AssignmentMultipleCostCenterCheckTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AssignmentMultipleCostCenterCheckTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssignmentMultipleCostCenterCheckTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssignmentMultipleCostCenterCheckTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssignmentMultipleCostCenterCheckTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssignmentMultipleCostCenterCheckTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssignmentMultipleCostCenterCheckTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        AssignmentMultipleCostCenterCheckTest.uniquifier = new Uniquifier();

        AssignmentMultipleCostCenterCheckTest.resourceRequests = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssignmentMultipleCostCenterCheckTest.capacityRequirement = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

        AssignmentMultipleCostCenterCheckTest.resourceHeader = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssignmentMultipleCostCenterCheckTest.resourceTypes = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        AssignmentMultipleCostCenterCheckTest.resourceCapacity = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssignmentMultipleCostCenterCheckTest.employeeHeader = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/assignmentMultipleCostCenters/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        AssignmentMultipleCostCenterCheckTest.workAssignment = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssignmentMultipleCostCenterCheckTest.workforcePerson = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/assignmentMultipleCostCenters/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssignmentMultipleCostCenterCheckTest.organizationHeader = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/assignmentMultipleCostCenters/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        AssignmentMultipleCostCenterCheckTest.organizationDetail = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/assignmentMultipleCostCenters/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssignmentMultipleCostCenterCheckTest.jobDetail = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/assignmentMultipleCostCenters/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        AssignmentMultipleCostCenterCheckTest.costCenter = await AssignmentMultipleCostCenterCheckTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');
        await AssignmentMultipleCostCenterCheckTest.resourceRequestRepository.insertMany(AssignmentMultipleCostCenterCheckTest.resourceRequests);
        await AssignmentMultipleCostCenterCheckTest.capacityRequirementRepository.insertMany(AssignmentMultipleCostCenterCheckTest.capacityRequirement);

        await AssignmentMultipleCostCenterCheckTest.resourceTypesRepository.insertMany(AssignmentMultipleCostCenterCheckTest.resourceTypes);

        await AssignmentMultipleCostCenterCheckTest.resourceHeaderRepository.insertMany(AssignmentMultipleCostCenterCheckTest.resourceHeader);
        await AssignmentMultipleCostCenterCheckTest.resourceCapacityRepository.insertMany(AssignmentMultipleCostCenterCheckTest.resourceCapacity);
        await AssignmentMultipleCostCenterCheckTest.jobDetailRepository.insertMany(AssignmentMultipleCostCenterCheckTest.jobDetail);
        await AssignmentMultipleCostCenterCheckTest.organizationDetailRepository.insertMany(AssignmentMultipleCostCenterCheckTest.organizationDetail);
        await AssignmentMultipleCostCenterCheckTest.organizationHeaderRepository.insertMany(AssignmentMultipleCostCenterCheckTest.organizationHeader);
        await AssignmentMultipleCostCenterCheckTest.employeeHeaderRepository.insertMany(AssignmentMultipleCostCenterCheckTest.employeeHeader);
        await AssignmentMultipleCostCenterCheckTest.workAssignmentRepository.insertMany(AssignmentMultipleCostCenterCheckTest.workAssignment);
        await AssignmentMultipleCostCenterCheckTest.workforcePersonRepository.insertMany(AssignmentMultipleCostCenterCheckTest.workforcePerson);
        await AssignmentMultipleCostCenterCheckTest.costCenterRepository.insertMany(AssignmentMultipleCostCenterCheckTest.costCenter);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager with Costcenter can access Assignment entity'() {

        const assignmentService = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager with authorized costcenter can access Assignment Bucket entity'() {

        const assignmentService = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for Resource with  unique cost centers during assignment period'(){

        const payload = {
            resourceId: AssignmentMultipleCostCenterCheckTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentMultipleCostCenterCheckTest.resourceRequests[1].ID,
            start: "2019-10-01",
            end: "2019-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentMultipleCostCenterCheckTest.assignmentIDs = `${AssignmentMultipleCostCenterCheckTest.assignmentIDs} '${simulationActionResponseResMgr.data.ID}'`;

        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
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
            resourceId: AssignmentMultipleCostCenterCheckTest.resourceHeader[2].ID,
            resourceRequestId: AssignmentMultipleCostCenterCheckTest.resourceRequests[1].ID,
            start: "2020-10-01",
            end: "2020-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentMultipleCostCenterCheckTest.assignmentIDs = `${AssignmentMultipleCostCenterCheckTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Expected status code to be 400.');
       

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for resource with multiple cost centers with intersecting validity '(){

        const payload = {
            resourceId: AssignmentMultipleCostCenterCheckTest.resourceHeader[1].ID,
            resourceRequestId: AssignmentMultipleCostCenterCheckTest.resourceRequests[1].ID,
            start: "2020-10-01",
            end: "2020-10-18",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentMultipleCostCenterCheckTest.assignmentIDs = `${AssignmentMultipleCostCenterCheckTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentMultipleCostCenterCheckTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'The assignment cant be created because the resource is assigned to multiple cost centers.');
    }

    

    @timeout(TEST_TIMEOUT)
    static async after() {

        await AssignmentMultipleCostCenterCheckTest.cleanUpResourceBookedCapacityTable(AssignmentMultipleCostCenterCheckTest.resourceHeader.map(r => r.ID));

        await AssignmentMultipleCostCenterCheckTest.resourceRequestRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.resourceRequests);
        await AssignmentMultipleCostCenterCheckTest.capacityRequirementRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.capacityRequirement);
        await AssignmentMultipleCostCenterCheckTest.resourceHeaderRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.resourceHeader);
        await AssignmentMultipleCostCenterCheckTest.resourceTypesRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.resourceTypes);
        await AssignmentMultipleCostCenterCheckTest.resourceCapacityRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.resourceCapacity);
        await AssignmentMultipleCostCenterCheckTest.jobDetailRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.jobDetail);
        await AssignmentMultipleCostCenterCheckTest.organizationHeaderRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.organizationHeader);
        await AssignmentMultipleCostCenterCheckTest.organizationDetailRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.organizationDetail);
        await AssignmentMultipleCostCenterCheckTest.employeeHeaderRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.employeeHeader);
        await AssignmentMultipleCostCenterCheckTest.workAssignmentRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.workAssignment);
        await AssignmentMultipleCostCenterCheckTest.workforcePersonRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.workforcePerson);
        await AssignmentMultipleCostCenterCheckTest.costCenterRepository.deleteMany(AssignmentMultipleCostCenterCheckTest.costCenter);

        AssignmentMultipleCostCenterCheckTest.assignmentIDs = `${AssignmentMultipleCostCenterCheckTest.assignmentIDs} )`;
        let sqlStatementString = AssignmentMultipleCostCenterCheckTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssignmentMultipleCostCenterCheckTest.assignmentIDs}`);
        await AssignmentMultipleCostCenterCheckTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssignmentMultipleCostCenterCheckTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssignmentMultipleCostCenterCheckTest.assignmentIDs}`);        
        await AssignmentMultipleCostCenterCheckTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);        
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
