import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import {
    ResourceHeaderRepository, ResourceCapacityRepository,
    ResourceRequestRepository, CapacityRequirementRepository,
    ResourceTypesRepository, JobDetailRepository, OrganizationHeaderRepository, OrganizationDetailRepository,
    EmployeeHeaderRepository,CostCenterRepository, WorkAssignmentRepository, WorkforcePersonRepository, ResourceRequest, CapacityRequirement,
    ResourceHeader, ResourceTypes,CostCenter, ResourceCapacity, JobDetail, OrganizationDetail, OrganizationHeader, EmployeeHeader, WorkAssignment, WorkforcePerson, BookedCapacityAggregateRepository,
    ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository
} from 'test-commons';

@suite
export class AssignmentActiveResourceTest {
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
        AssignmentActiveResourceTest.asgnSrvClientResourceManager = await testEnvironment.getAuthAttrTestUser01ServiceClient();

        AssignmentActiveResourceTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssignmentActiveResourceTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        AssignmentActiveResourceTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssignmentActiveResourceTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AssignmentActiveResourceTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        AssignmentActiveResourceTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AssignmentActiveResourceTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssignmentActiveResourceTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssignmentActiveResourceTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssignmentActiveResourceTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssignmentActiveResourceTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssignmentActiveResourceTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        AssignmentActiveResourceTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AssignmentActiveResourceTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
        
        AssignmentActiveResourceTest.uniquifier = new Uniquifier();

        AssignmentActiveResourceTest.resourceRequests = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssignmentActiveResourceTest.capacityRequirement = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

        AssignmentActiveResourceTest.resourceHeader = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssignmentActiveResourceTest.resourceTypes = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        AssignmentActiveResourceTest.resourceCapacity = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssignmentActiveResourceTest.employeeHeader = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        AssignmentActiveResourceTest.workAssignment = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssignmentActiveResourceTest.workforcePerson = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssignmentActiveResourceTest.organizationHeader = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        AssignmentActiveResourceTest.organizationDetail = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssignmentActiveResourceTest.jobDetail = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        AssignmentActiveResourceTest.costCenter = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');
        AssignmentActiveResourceTest.resourceOrganizations = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AssignmentActiveResourceTest.resourceOrganizationItems = await AssignmentActiveResourceTest.uniquifier.getRecords('../data/input/asgInstanceAuthorization/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await AssignmentActiveResourceTest.resourceRequestRepository.insertMany(AssignmentActiveResourceTest.resourceRequests);
        await AssignmentActiveResourceTest.capacityRequirementRepository.insertMany(AssignmentActiveResourceTest.capacityRequirement);

        await AssignmentActiveResourceTest.resourceTypesRepository.insertMany(AssignmentActiveResourceTest.resourceTypes);

        await AssignmentActiveResourceTest.resourceHeaderRepository.insertMany(AssignmentActiveResourceTest.resourceHeader);
        await AssignmentActiveResourceTest.resourceCapacityRepository.insertMany(AssignmentActiveResourceTest.resourceCapacity);
        await AssignmentActiveResourceTest.jobDetailRepository.insertMany(AssignmentActiveResourceTest.jobDetail);
        await AssignmentActiveResourceTest.organizationDetailRepository.insertMany(AssignmentActiveResourceTest.organizationDetail);
        await AssignmentActiveResourceTest.organizationHeaderRepository.insertMany(AssignmentActiveResourceTest.organizationHeader);
        await AssignmentActiveResourceTest.employeeHeaderRepository.insertMany(AssignmentActiveResourceTest.employeeHeader);
        await AssignmentActiveResourceTest.workAssignmentRepository.insertMany(AssignmentActiveResourceTest.workAssignment);
        await AssignmentActiveResourceTest.workforcePersonRepository.insertMany(AssignmentActiveResourceTest.workforcePerson);
        await AssignmentActiveResourceTest.costCenterRepository.insertMany(AssignmentActiveResourceTest.costCenter);
        
        await AssignmentActiveResourceTest.resourceOrganizationsRepository.insertMany(AssignmentActiveResourceTest.resourceOrganizations);
        await AssignmentActiveResourceTest.resourceOrganizationItemsRepository.insertMany(AssignmentActiveResourceTest.resourceOrganizationItems);


    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager with Costcenter can access Assignment entity'() {

        const assignmentService = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager with authorized costcenter can access Assignment Bucket entity'() {

        const assignmentService = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Checking active resource  with validity starting from 31st oct 2015-9999'(){

        const payload = {
            resourceId: AssignmentActiveResourceTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentActiveResourceTest.resourceRequests[1].ID,
            start: "2019-10-01",
            end: "2019-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentActiveResourceTest.assignmentIDs = `${AssignmentActiveResourceTest.assignmentIDs} '${simulationActionResponseResMgr.data.ID}'`;

        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;
        

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        assert.equal(draftCreateActionResponseResMgr.data.ID, payloadForDraftCreation.ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a newly created draft');
        assert.equal(draftCreateActionResponseResMgr.data.assignmentBuckets.length, payloadForDraftCreation.assignmentBuckets.length, 'Created draft not in sync with payload');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Checking active resource for the assignment validity period from 1st oct 2020-9999'(){

        const payload = {
            resourceId: AssignmentActiveResourceTest.resourceHeader[1].ID,
            resourceRequestId: AssignmentActiveResourceTest.resourceRequests[1].ID,
            start: "2020-10-01",
            end: "2020-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentActiveResourceTest.assignmentIDs = `${AssignmentActiveResourceTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;
       
        
        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        assert.equal(draftCreateActionResponseResMgr.data.ID, payloadForDraftCreation.ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a newly created draft');
        assert.equal(draftCreateActionResponseResMgr.data.assignmentBuckets.length, payloadForDraftCreation.assignmentBuckets.length, 'Created draft not in sync with payload');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Checking for inactive resource who doesnt have validity during the assignment creation '(){

        const payload = {
            resourceId: AssignmentActiveResourceTest.resourceHeader[2].ID,
            resourceRequestId: AssignmentActiveResourceTest.resourceRequests[1].ID,
            start: "2019-10-01",
            end: "2019-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentActiveResourceTest.assignmentIDs = `${AssignmentActiveResourceTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Resource Inactive ,Assignment cannot be created.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Checking for inactive resource with intersecting validity during assignment creation '(){

        const payload = {
            resourceId: AssignmentActiveResourceTest.resourceHeader[3].ID,
            resourceRequestId: AssignmentActiveResourceTest.resourceRequests[1].ID,
            start: "2019-10-01",
            end: "2019-10-15",
            duration: "42",
            assignmentStatusCode: 0,
            mode: "I"
        };
        const simulationActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentActiveResourceTest.assignmentIDs = `${AssignmentActiveResourceTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;
        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentActiveResourceTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 400, 'Resource Inactive ,Assignment cannot be created.');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await AssignmentActiveResourceTest.cleanUpResourceBookedCapacityTable(AssignmentActiveResourceTest.resourceHeader.map(r => r.ID));

        await AssignmentActiveResourceTest.resourceRequestRepository.deleteMany(AssignmentActiveResourceTest.resourceRequests);
        await AssignmentActiveResourceTest.capacityRequirementRepository.deleteMany(AssignmentActiveResourceTest.capacityRequirement);
        await AssignmentActiveResourceTest.resourceHeaderRepository.deleteMany(AssignmentActiveResourceTest.resourceHeader);
        await AssignmentActiveResourceTest.resourceTypesRepository.deleteMany(AssignmentActiveResourceTest.resourceTypes);
        await AssignmentActiveResourceTest.resourceCapacityRepository.deleteMany(AssignmentActiveResourceTest.resourceCapacity);
        await AssignmentActiveResourceTest.jobDetailRepository.deleteMany(AssignmentActiveResourceTest.jobDetail);
        await AssignmentActiveResourceTest.organizationHeaderRepository.deleteMany(AssignmentActiveResourceTest.organizationHeader);
        await AssignmentActiveResourceTest.organizationDetailRepository.deleteMany(AssignmentActiveResourceTest.organizationDetail);
        await AssignmentActiveResourceTest.employeeHeaderRepository.deleteMany(AssignmentActiveResourceTest.employeeHeader);
        await AssignmentActiveResourceTest.workAssignmentRepository.deleteMany(AssignmentActiveResourceTest.workAssignment);
        await AssignmentActiveResourceTest.workforcePersonRepository.deleteMany(AssignmentActiveResourceTest.workforcePerson);
        await AssignmentActiveResourceTest.costCenterRepository.deleteMany(AssignmentActiveResourceTest.costCenter);
        await AssignmentActiveResourceTest.resourceOrganizationsRepository.deleteMany(AssignmentActiveResourceTest.resourceOrganizations);
        await AssignmentActiveResourceTest.resourceOrganizationItemsRepository.deleteMany(AssignmentActiveResourceTest.resourceOrganizationItems);


        AssignmentActiveResourceTest.assignmentIDs = `${AssignmentActiveResourceTest.assignmentIDs} )`;
        let sqlStatementString = AssignmentActiveResourceTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssignmentActiveResourceTest.assignmentIDs}`);
        await AssignmentActiveResourceTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssignmentActiveResourceTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssignmentActiveResourceTest.assignmentIDs}`);
        await AssignmentActiveResourceTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);        
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
