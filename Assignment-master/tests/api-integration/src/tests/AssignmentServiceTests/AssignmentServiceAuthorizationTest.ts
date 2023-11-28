import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceRequestRepository, CapacityRequirementRepository, ResourceTypesRepository, ResourceRequest, CapacityRequirement, ResourceHeader, ResourceTypes, ResourceCapacity, DemandRepository, Demand, JobDetailRepository, OrganizationDetailRepository, OrganizationHeaderRepository, EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository, CostCenterRepository, CostCenter, OrganizationDetail, OrganizationHeader, JobDetail, EmployeeHeader, WorkAssignment, WorkforcePerson, WorkPackage, WorkPackageRepository, BookedCapacityAggregateRepository, ResourceOrganizations, ResourceOrganizationItems, ResourceOrganizationsRepository, ResourceOrganizationItemsRepository } from 'test-commons';

@suite
export class AssignmentServiceAuthorizationTest {
    private static asgnSrvClientResourceManager: AxiosInstance;
    private static asgnSrvClientProjectManager: AxiosInstance;

    private static uniquifier: Uniquifier;

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

    private static resourceRequests: ResourceRequest[];
    private static capacityRequirement: CapacityRequirement[];
    private static demand: Demand[];
    private static workPackage: WorkPackage[];

    private static resourceTypes: ResourceTypes[];

    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];
    private static costCenter:CostCenter[];
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
        AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager = await testEnvironment.getResourceManagerServiceClient();
        AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager = await testEnvironment.getProjectManagerServiceClient();

        AssignmentServiceAuthorizationTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssignmentServiceAuthorizationTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        AssignmentServiceAuthorizationTest.demandRepository = await testEnvironment.getDemandRepository();
        AssignmentServiceAuthorizationTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        AssignmentServiceAuthorizationTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssignmentServiceAuthorizationTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AssignmentServiceAuthorizationTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();

        AssignmentServiceAuthorizationTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AssignmentServiceAuthorizationTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssignmentServiceAuthorizationTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssignmentServiceAuthorizationTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssignmentServiceAuthorizationTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssignmentServiceAuthorizationTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssignmentServiceAuthorizationTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

        AssignmentServiceAuthorizationTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AssignmentServiceAuthorizationTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        AssignmentServiceAuthorizationTest.uniquifier = new Uniquifier();

        AssignmentServiceAuthorizationTest.resourceRequests = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssignmentServiceAuthorizationTest.capacityRequirement = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');
        AssignmentServiceAuthorizationTest.demand = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.project.demands.csv', 'Demand');
        AssignmentServiceAuthorizationTest.workPackage = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

        AssignmentServiceAuthorizationTest.resourceHeader = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssignmentServiceAuthorizationTest.resourceTypes = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        AssignmentServiceAuthorizationTest.resourceCapacity = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssignmentServiceAuthorizationTest.employeeHeader = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        AssignmentServiceAuthorizationTest.workAssignment = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssignmentServiceAuthorizationTest.workforcePerson = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssignmentServiceAuthorizationTest.organizationHeader = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        AssignmentServiceAuthorizationTest.organizationDetail = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssignmentServiceAuthorizationTest.jobDetail = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        AssignmentServiceAuthorizationTest.costCenter = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        AssignmentServiceAuthorizationTest.workAssignment = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/assignmentActiveResource/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        AssignmentServiceAuthorizationTest.resourceOrganizations = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AssignmentServiceAuthorizationTest.resourceOrganizationItems = await AssignmentServiceAuthorizationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await AssignmentServiceAuthorizationTest.resourceRequestRepository.insertMany(AssignmentServiceAuthorizationTest.resourceRequests);
        await AssignmentServiceAuthorizationTest.capacityRequirementRepository.insertMany(AssignmentServiceAuthorizationTest.capacityRequirement);
        await AssignmentServiceAuthorizationTest.demandRepository.insertMany(AssignmentServiceAuthorizationTest.demand);
        await AssignmentServiceAuthorizationTest.workPackageRepository.insertMany(AssignmentServiceAuthorizationTest.workPackage);

        await AssignmentServiceAuthorizationTest.resourceTypesRepository.insertMany(AssignmentServiceAuthorizationTest.resourceTypes);

        await AssignmentServiceAuthorizationTest.resourceHeaderRepository.insertMany(AssignmentServiceAuthorizationTest.resourceHeader);
        await AssignmentServiceAuthorizationTest.resourceCapacityRepository.insertMany(AssignmentServiceAuthorizationTest.resourceCapacity);
        await AssignmentServiceAuthorizationTest.jobDetailRepository.insertMany(AssignmentServiceAuthorizationTest.jobDetail);
        await AssignmentServiceAuthorizationTest.organizationDetailRepository.insertMany(AssignmentServiceAuthorizationTest.organizationDetail);
        await AssignmentServiceAuthorizationTest.organizationHeaderRepository.insertMany(AssignmentServiceAuthorizationTest.organizationHeader);
        await AssignmentServiceAuthorizationTest.employeeHeaderRepository.insertMany(AssignmentServiceAuthorizationTest.employeeHeader);
        await AssignmentServiceAuthorizationTest.workAssignmentRepository.insertMany(AssignmentServiceAuthorizationTest.workAssignment);
        await AssignmentServiceAuthorizationTest.workforcePersonRepository.insertMany(AssignmentServiceAuthorizationTest.workforcePerson);
        await AssignmentServiceAuthorizationTest.costCenterRepository.insertMany(AssignmentServiceAuthorizationTest.costCenter);

        await AssignmentServiceAuthorizationTest.resourceOrganizationsRepository.insertMany(AssignmentServiceAuthorizationTest.resourceOrganizations);
        await AssignmentServiceAuthorizationTest.resourceOrganizationItemsRepository.insertMany(AssignmentServiceAuthorizationTest.resourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access Assignment entity'() {

        const assignmentService = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    // @test(timeout(TEST_TIMEOUT))
    async 'Project Manager cannot access Assignment entity'() {

        const assignmentService = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access Assignment Bucket entity'() {

        const assignmentService = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    // @test(timeout(TEST_TIMEOUT))
    async 'Project Manager cannot access Assignment Bucket entity'() {

        const assignmentService = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can invoke total hours simulation action'() {

        const payload = {
            resourceId: AssignmentServiceAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentServiceAuthorizationTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const response = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentServiceAuthorizationTest.assignmentIDs = `${AssignmentServiceAuthorizationTest.assignmentIDs} '${response.data.ID}'`;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager cannot invoke total hours simulation action'() {

        const payload = {
            resourceId: AssignmentServiceAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentServiceAuthorizationTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const response = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentServiceAuthorizationTest.assignmentIDs = `${AssignmentServiceAuthorizationTest.assignmentIDs}, '${response.data.ID}'`;
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can invoke as requested simulation action'() {

        const payload = {
            resourceId: AssignmentServiceAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentServiceAuthorizationTest.resourceRequests[0].ID,
            mode: "I"
        };
        const response = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAssignmentAsRequested', payload);
        AssignmentServiceAuthorizationTest.assignmentIDs = `${AssignmentServiceAuthorizationTest.assignmentIDs}, '${response.data.ID}'`;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager cannot invoke as requested simulation action'() {

        const payload = {
            resourceId: AssignmentServiceAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentServiceAuthorizationTest.resourceRequests[0].ID,
            mode: "I"
        };
        const response = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.post('/SimulateAssignmentAsRequested', payload);
        AssignmentServiceAuthorizationTest.assignmentIDs = `${AssignmentServiceAuthorizationTest.assignmentIDs}, '${response.data.ID}'`;
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Authorization Tests for Assignment CRUD Scenarios'() {

        const payload = {
            resourceId: AssignmentServiceAuthorizationTest.resourceHeader[0].ID,
            resourceRequestId: AssignmentServiceAuthorizationTest.resourceRequests[0].ID,
            start: "2019-10-15",
            end: "2019-12-17",
            duration: "424",
            assignmentStatusCode: 0,
            mode: "I"
        };

        const simulationActionResponseResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.post('/SimulateAsgBasedOnTotalHours', payload);
        AssignmentServiceAuthorizationTest.assignmentIDs = `${AssignmentServiceAuthorizationTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        delete simulationActionResponseResMgr.data["@context"];
        const payloadForDraftCreation = simulationActionResponseResMgr.data;

        /*****************************************************************************************************************
          Testing CREATE DRAFT Authorization
         *****************************************************************************************************************/

        // Project manager canNOT CREATE a DRAFT
        // const draftCreateActionResponseProjMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.post('/Assignments', payloadForDraftCreation);
        // assert.equal(draftCreateActionResponseProjMgr.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');

        // Resource manager can CREATE a DRAFT
        const draftCreateActionResponseResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments', payloadForDraftCreation);

        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        assert.equal(draftCreateActionResponseResMgr.data.ID, payloadForDraftCreation.ID, 'Created draft not in sync with payload');

        assert.equal(draftCreateActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Created draft not in sync with payload');
        assert.equal(draftCreateActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a newly created draft');
        assert.equal(draftCreateActionResponseResMgr.data.assignmentBuckets.length, payloadForDraftCreation.assignmentBuckets.length, 'Created draft not in sync with payload');

        /*****************************************************************************************************************
          Testing READ DRAFT Authorization
         *****************************************************************************************************************/

        // Project manager canNOT READ a DRAFT
        // const draftReadActionResponseProjMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.get('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)');
        // assert.equal(draftReadActionResponseProjMgr.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');

        // Resource Manager can READ a DRAFT
        const draftReadActionResponseResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)');

        assert.isAtLeast(draftReadActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK)');
        assert.equal(draftReadActionResponseResMgr.data.resource_ID, payloadForDraftCreation.resource_ID, 'Read draft resource_ID incorrect');
        assert.equal(draftReadActionResponseResMgr.data.resourceRequest_ID, payloadForDraftCreation.resourceRequest_ID, 'Read draft request_ID incorrect');
        assert.equal(draftReadActionResponseResMgr.data.bookedCapacityInMinutes, payloadForDraftCreation.bookedCapacityInMinutes, 'Read draft bookedCapacityInMinutes incorrect');
        assert.equal(draftReadActionResponseResMgr.data.IsActiveEntity, false, 'Expected isActiveEntity flag to be false for a read draft');

        /*****************************************************************************************************************
          Testing ACTIVATE DRAFT Authorization
         *****************************************************************************************************************/

        const payloadForDraftActivation = {};

        // Project Manager canNOT ACTIVATE a DRAFT
        // const draftActivationActionResponseProjMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        // assert.equal(draftActivationActionResponseProjMgr.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');

        // Resource Manager can ACTIVATE a DRAFT
        const draftActivationActionResponseResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);

        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');
        assert.equal(draftActivationActionResponseResMgr.data.ID, draftCreateActionResponseResMgr.data.ID, 'Activated assignment not in sync with draft');
        assert.equal(draftActivationActionResponseResMgr.data.resource_ID, draftCreateActionResponseResMgr.data.resource_ID, 'Activated assignment not in sync with draft');
        assert.equal(draftActivationActionResponseResMgr.data.resourceRequest_ID, draftCreateActionResponseResMgr.data.resourceRequest_ID, 'Activated assignment not in sync with draft');
        assert.equal(draftActivationActionResponseResMgr.data.bookedCapacityInMinutes, draftCreateActionResponseResMgr.data.bookedCapacityInMinutes, 'Activated assignment not in sync with draft');
        assert.equal(draftActivationActionResponseResMgr.data.IsActiveEntity, true, 'Expected isActiveEntity flag to be true for a newly created active assignment');

        /*****************************************************************************************************************
          Testing Automatic deletion of draft upon activation
         *****************************************************************************************************************/

        // Assignment creation was successful -> Check that the draft is automatically deleted
        const draftReadActionResponsePostActivation = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)');
        assert.equal(draftReadActionResponsePostActivation.status, 404, 'Expected status code to be 404 (NOT_FOUND).');

        /*****************************************************************************************************************
          Testing READ ACTIVE Assignment Authorization
         *****************************************************************************************************************/

        // Resource Manager CAN READ ACTIVE Assignment
        const assignmentReadActionResponseResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + draftActivationActionResponseResMgr.data.ID + ',IsActiveEntity=true)');
        assert.equal(assignmentReadActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');
        assert.equal(assignmentReadActionResponseResMgr.data.ID, draftActivationActionResponseResMgr.data.ID, 'Activated assignment ID not correct');
        assert.equal(assignmentReadActionResponseResMgr.data.resource_ID, draftActivationActionResponseResMgr.data.resource_ID, 'Activated assignment not in sync with draft');
        assert.equal(assignmentReadActionResponseResMgr.data.resourceRequest_ID, draftActivationActionResponseResMgr.data.resourceRequest_ID, 'Activated assignment not in sync with draft');
        assert.equal(assignmentReadActionResponseResMgr.data.bookedCapacityInMinutes, draftActivationActionResponseResMgr.data.bookedCapacityInMinutes, 'Activated assignment not in sync with draft');
        assert.equal(assignmentReadActionResponseResMgr.data.IsActiveEntity, true, 'Expected isActiveEntity flag to be true for a newly created active assignment');

        // Project Manager canNOT READ ACTIVE Assignment
        // const assignmentReadActionResponseProjMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.get('/Assignments(ID=' + draftActivationActionResponseResMgr.data.ID + ',IsActiveEntity=true)');
        // assert.equal(assignmentReadActionResponseProjMgr.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');

        /*****************************************************************************************************************
          Testing DELETE ACTIVE Assignment Authorization
         *****************************************************************************************************************/

        // Project manager canNOT DELETE ACTIVE ASSIGNMENT
        // const assignmentDeleteActionResponseProjMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientProjectManager.delete('/Assignments(ID=' + draftActivationActionResponseResMgr.data.ID + ',IsActiveEntity=true)');
        // assert.equal(assignmentDeleteActionResponseProjMgr.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED).');

        // Resource Manager can DELETE ACTIVE ASSIGNMENT
        const assignmentDeleteActionResponseResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.delete('/Assignments(ID=' + draftActivationActionResponseResMgr.data.ID + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponseResMgr.status, 204, 'Expected status code to be 204 (OK).');

        // Finally check that the active assignment is no longer in DB
        const assignmentReadActionResponsePostActiveAsgnDeletionResMgr = await AssignmentServiceAuthorizationTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + draftActivationActionResponseResMgr.data.ID + ',IsActiveEntity=true)');
        assert.equal(assignmentReadActionResponsePostActiveAsgnDeletionResMgr.status, 404, 'Expected status code to be 404 (NOT_FOUND).');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await AssignmentServiceAuthorizationTest.cleanUpResourceBookedCapacityTable(AssignmentServiceAuthorizationTest.resourceHeader.map(r => r.ID));

        await AssignmentServiceAuthorizationTest.resourceRequestRepository.deleteMany(AssignmentServiceAuthorizationTest.resourceRequests);
        await AssignmentServiceAuthorizationTest.capacityRequirementRepository.deleteMany(AssignmentServiceAuthorizationTest.capacityRequirement);
        await AssignmentServiceAuthorizationTest.demandRepository.deleteMany(AssignmentServiceAuthorizationTest.demand);
        await AssignmentServiceAuthorizationTest.workPackageRepository.deleteMany(AssignmentServiceAuthorizationTest.workPackage);
        await AssignmentServiceAuthorizationTest.resourceHeaderRepository.deleteMany(AssignmentServiceAuthorizationTest.resourceHeader);
        await AssignmentServiceAuthorizationTest.resourceTypesRepository.deleteMany(AssignmentServiceAuthorizationTest.resourceTypes);
        await AssignmentServiceAuthorizationTest.resourceCapacityRepository.deleteMany(AssignmentServiceAuthorizationTest.resourceCapacity);
        await AssignmentServiceAuthorizationTest.jobDetailRepository.deleteMany(AssignmentServiceAuthorizationTest.jobDetail);
        await AssignmentServiceAuthorizationTest.organizationHeaderRepository.deleteMany(AssignmentServiceAuthorizationTest.organizationHeader);
        await AssignmentServiceAuthorizationTest.organizationDetailRepository.deleteMany(AssignmentServiceAuthorizationTest.organizationDetail);
        await AssignmentServiceAuthorizationTest.employeeHeaderRepository.deleteMany(AssignmentServiceAuthorizationTest.employeeHeader);
        await AssignmentServiceAuthorizationTest.workAssignmentRepository.deleteMany(AssignmentServiceAuthorizationTest.workAssignment);
        await AssignmentServiceAuthorizationTest.workforcePersonRepository.deleteMany(AssignmentServiceAuthorizationTest.workforcePerson);
        await AssignmentServiceAuthorizationTest.costCenterRepository.deleteMany(AssignmentServiceAuthorizationTest.costCenter);

        await AssignmentServiceAuthorizationTest.resourceOrganizationsRepository.deleteMany(AssignmentServiceAuthorizationTest.resourceOrganizations);
        await AssignmentServiceAuthorizationTest.resourceOrganizationItemsRepository.deleteMany(AssignmentServiceAuthorizationTest.resourceOrganizationItems);

        AssignmentServiceAuthorizationTest.assignmentIDs = `${AssignmentServiceAuthorizationTest.assignmentIDs} )`;
        let sqlStatementString = AssignmentServiceAuthorizationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssignmentServiceAuthorizationTest.assignmentIDs}`);
        await AssignmentServiceAuthorizationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssignmentServiceAuthorizationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssignmentServiceAuthorizationTest.assignmentIDs}`);        
        await AssignmentServiceAuthorizationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);        
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