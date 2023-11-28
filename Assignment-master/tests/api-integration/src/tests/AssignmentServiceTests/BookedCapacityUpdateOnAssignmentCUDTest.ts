import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceRequestRepository, CapacityRequirementRepository, ResourceTypesRepository, AssignmentsRepository, AssignmentBucket, ResourceRequest, CapacityRequirement, ResourceHeader, ResourceTypes, ResourceCapacity, DemandRepository, Demand, JobDetailRepository, OrganizationDetailRepository, OrganizationHeaderRepository, EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository, CostCenterRepository, CostCenter, OrganizationDetail, OrganizationHeader, JobDetail, EmployeeHeader, WorkAssignment, WorkforcePerson, WorkPackage, WorkPackageRepository, BookedCapacityAggregateRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository } from 'test-commons';

@suite
export class BookedCapacityUpdateOnAssignmentCUDTest {

    private static assignmentServiceClient: AxiosInstance;
    private static uniquifier: Uniquifier;

    private static assignmentRepository: AssignmentsRepository;
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
    private static bookedCapacityAggregateRepository: BookedCapacityAggregateRepository;

    private static assignmentIDs: string = "(";

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
        BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

        BookedCapacityUpdateOnAssignmentCUDTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();

        BookedCapacityUpdateOnAssignmentCUDTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.demandRepository = await testEnvironment.getDemandRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();

        BookedCapacityUpdateOnAssignmentCUDTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();

        BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        BookedCapacityUpdateOnAssignmentCUDTest.uniquifier = new Uniquifier();

        BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        BookedCapacityUpdateOnAssignmentCUDTest.capacityRequirement = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');
        BookedCapacityUpdateOnAssignmentCUDTest.demand = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.project.demands.csv', 'Demand');
        BookedCapacityUpdateOnAssignmentCUDTest.workPackage = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
        BookedCapacityUpdateOnAssignmentCUDTest.employeeHeader = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');

        BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        BookedCapacityUpdateOnAssignmentCUDTest.resourceTypes = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        BookedCapacityUpdateOnAssignmentCUDTest.resourceCapacity = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        BookedCapacityUpdateOnAssignmentCUDTest.workAssignment = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        BookedCapacityUpdateOnAssignmentCUDTest.workforcePerson = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        BookedCapacityUpdateOnAssignmentCUDTest.organizationHeader = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        BookedCapacityUpdateOnAssignmentCUDTest.organizationDetail = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        BookedCapacityUpdateOnAssignmentCUDTest.jobDetail = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        BookedCapacityUpdateOnAssignmentCUDTest.costCenter = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/bookedCapacityUpdate/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizations = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationItems = await BookedCapacityUpdateOnAssignmentCUDTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await BookedCapacityUpdateOnAssignmentCUDTest.resourceRequestRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests);
        await BookedCapacityUpdateOnAssignmentCUDTest.capacityRequirementRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.capacityRequirement);
        await BookedCapacityUpdateOnAssignmentCUDTest.demandRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.demand);
        await BookedCapacityUpdateOnAssignmentCUDTest.workPackageRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.workPackage);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceTypesRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceTypes);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceHeaderRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceCapacityRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceCapacity);
        await BookedCapacityUpdateOnAssignmentCUDTest.jobDetailRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.jobDetail);
        await BookedCapacityUpdateOnAssignmentCUDTest.organizationDetailRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.organizationDetail);
        await BookedCapacityUpdateOnAssignmentCUDTest.organizationHeaderRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.organizationHeader);
        await BookedCapacityUpdateOnAssignmentCUDTest.employeeHeaderRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.employeeHeader);
        await BookedCapacityUpdateOnAssignmentCUDTest.workAssignmentRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.workAssignment);
        await BookedCapacityUpdateOnAssignmentCUDTest.workforcePersonRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.workforcePerson);
        await BookedCapacityUpdateOnAssignmentCUDTest.costCenterRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.costCenter);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationsRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizations);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationItemsRepository.insertMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationItems);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource booked capacity should get updated correctly on Assignment create/update/delete'() {

        /*****************************************************************************************************************
          Create a Accepted Assignment on Res0 - Req0
        *****************************************************************************************************************/
        let creationPayload = {
            resourceId: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
            resourceRequestId: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[0].ID,
            start: "2021-08-02",
            end: "2021-08-04",
            duration: "24",
            assignmentStatusCode: 3, // Accepted Assignment
            mode: "I"
        };

        let simulationActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', creationPayload);

        BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs = `( '${simulationActionResponseResMgr.data.ID}'`;

        const assignmentIdRes0Req0 = simulationActionResponseResMgr.data["ID"];

        let assignmentBucketListRes0Req0: AssignmentBucket[] = simulationActionResponseResMgr.data["assignmentBuckets"];
        delete simulationActionResponseResMgr.data["@context"];
        let payloadForDraftCreation = simulationActionResponseResMgr.data;
        let draftCreateActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        let payloadForDraftActivation = {};
        let draftActivationActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res0 does not get affected at all
        let sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        let bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);
        let expectedBookedCapacityAggregateResponse: any[] = [];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Convert the Accepted Assignment on Res0 - Req0 to hard-booked
        *****************************************************************************************************************/
        let changePayload = {
            ID: assignmentIdRes0Req0,
            bookedCapacityInMinutes: 1440,
            resourceRequest_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[0].ID,
            resource_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
            assignmentStatus_code: 0, // Converted to Hard-Booked
            assignmentBuckets: [
                {
                    ID: assignmentBucketListRes0Req0[0].ID,
                    startTime: assignmentBucketListRes0Req0[0].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req0[0].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req0[1].ID,
                    startTime: assignmentBucketListRes0Req0[1].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req0[1].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req0[2].ID,
                    startTime: assignmentBucketListRes0Req0[2].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req0[2].assignment_ID,
                }
            ]
        }

        let assignmentChangeActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayload.ID + ',IsActiveEntity=true)', changePayload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res0 updated successfully
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);
        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Create another Accepted Assignment on Res0 - Req1
        *****************************************************************************************************************/
        creationPayload = {
            resourceId: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
            resourceRequestId: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[1].ID,
            start: "2021-08-03",
            end: "2021-08-05",
            duration: "24",
            assignmentStatusCode: 3,
            mode: "I"
        };

        simulationActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', creationPayload);

        BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs = `${BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        const assignmentIdRes0Req1 = simulationActionResponseResMgr.data["ID"];

        delete simulationActionResponseResMgr.data["@context"];
        let assignmentBucketListRes0Req1: AssignmentBucket[] = simulationActionResponseResMgr.data["assignmentBuckets"];
        payloadForDraftCreation = simulationActionResponseResMgr.data;
        draftCreateActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        payloadForDraftActivation = {};
        draftActivationActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res0 updated successfully
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        // Since it is another proposed assignment, the bookedcapacityaggregate should be same as before
        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');


        /*****************************************************************************************************************
          Updating assignment for Res0-Req1 to soft-booked
        *****************************************************************************************************************/
        // Sort to make the update deterministic with respect to dates
        assignmentBucketListRes0Req1.sort((a, b) => a.startTime < b.startTime ? -1 : 1);

        changePayload = {
            ID: assignmentIdRes0Req1,
            bookedCapacityInMinutes: 2400,
            resourceRequest_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[1].ID,
            resource_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
            assignmentStatus_code: 1,
            assignmentBuckets: [
                {
                    ID: assignmentBucketListRes0Req1[0].ID,
                    startTime: assignmentBucketListRes0Req1[0].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req1[0].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req1[1].ID,
                    startTime: assignmentBucketListRes0Req1[1].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req1[1].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req1[2].ID,
                    startTime: assignmentBucketListRes0Req1[2].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req1[2].assignment_ID,
                }
            ]
        }

        assignmentChangeActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayload.ID + ',IsActiveEntity=true)', changePayload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res0 updated successfully
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes", "softBookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        // Now that the proposed assignment has been converted to soft-booked, the bookedcapacityaggregate should be updated
        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480,
                SOFTBOOKEDCAPACITYINMINUTES: 0
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 960,
                SOFTBOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 960,
                SOFTBOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-05 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480,
                SOFTBOOKEDCAPACITYINMINUTES: 480
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');


        /*****************************************************************************************************************
          Updating assignment for Res0-Req1 to hard-booked
        *****************************************************************************************************************/

        changePayload = {
            ID: assignmentIdRes0Req1,
            bookedCapacityInMinutes: 2400,
            resourceRequest_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[1].ID,
            resource_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: assignmentBucketListRes0Req1[0].ID,
                    startTime: assignmentBucketListRes0Req1[0].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req1[0].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req1[1].ID,
                    startTime: assignmentBucketListRes0Req1[1].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req1[1].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req1[2].ID,
                    startTime: assignmentBucketListRes0Req1[2].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req1[2].assignment_ID,
                }
            ]
        }

        assignmentChangeActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayload.ID + ',IsActiveEntity=true)', changePayload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res0 updated successfully
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes", "softBookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        // Now that the soft-booked assignment has been converted to hard-booked, the bookedcapacityaggregate should be updated
        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480,
                SOFTBOOKEDCAPACITYINMINUTES: 0
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 960,
                SOFTBOOKEDCAPACITYINMINUTES: 0
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 960,
                SOFTBOOKEDCAPACITYINMINUTES: 0
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-05 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480,
                SOFTBOOKEDCAPACITYINMINUTES: 0
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Create Assignment on Res1 - Req1
        *****************************************************************************************************************/
        creationPayload = {
            resourceId: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID,
            resourceRequestId: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[1].ID,
            start: "2021-08-02",
            end: "2021-08-06",
            duration: "5",
            assignmentStatusCode: 0,
            mode: "I"
        };

        simulationActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', creationPayload);

        BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs = `${BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs}, '${simulationActionResponseResMgr.data.ID}'`;

        const assignmentIdRes1Req1 = simulationActionResponseResMgr.data["ID"];

        delete simulationActionResponseResMgr.data["@context"];
        payloadForDraftCreation = simulationActionResponseResMgr.data;
        draftCreateActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
        assert.equal(draftCreateActionResponseResMgr.status, 201, 'Expected status code to be 201 (OK).');
        payloadForDraftActivation = {};
        draftActivationActionResponseResMgr = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.post('/Assignments(ID=' + draftCreateActionResponseResMgr.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
        assert.equal(draftActivationActionResponseResMgr.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res1 updated successfully
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 60
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 60
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 60
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID,
                STARTTIME: '2021-08-05 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 60
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID,
                STARTTIME: '2021-08-06 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 60
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Updating assignment for Res0-Req0
        *****************************************************************************************************************/
        // Sort to make the update deterministic with respect to dates
        assignmentBucketListRes0Req0.sort((a, b) => a.startTime < b.startTime ? -1 : 1);

        changePayload = {
            ID: assignmentIdRes0Req0,
            bookedCapacityInMinutes: 2400,
            resourceRequest_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests[0].ID,
            resource_ID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: assignmentBucketListRes0Req0[0].ID,
                    startTime: assignmentBucketListRes0Req0[0].startTime,
                    bookedCapacityInMinutes: 480,
                    assignment_ID: assignmentBucketListRes0Req0[0].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req0[1].ID,
                    startTime: assignmentBucketListRes0Req0[1].startTime,
                    bookedCapacityInMinutes: 600,
                    assignment_ID: assignmentBucketListRes0Req0[1].assignment_ID,
                },
                {
                    ID: assignmentBucketListRes0Req0[2].ID,
                    startTime: assignmentBucketListRes0Req0[2].startTime,
                    bookedCapacityInMinutes: 720,
                    assignment_ID: assignmentBucketListRes0Req0[2].assignment_ID,
                }
            ]
        }

        assignmentChangeActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.patch('/Assignments(ID=' + changePayload.ID + ',IsActiveEntity=true)', changePayload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');

        // Test that booked capacity of Res0 updated correctly
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 1080
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 1200
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-05 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Delete assignment on Res0-Req1
        *****************************************************************************************************************/
        let assignmentDeleteActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.delete('/Assignments(ID=' + assignmentIdRes0Req1 + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 204, 'Expected status code to be 204 (OK).');

        // Test that booked capacity of Res0 updated correctly
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        expectedBookedCapacityAggregateResponse = [
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-02 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 480
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-03 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 600
            },
            {
                RESOURCEID: BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID,
                STARTTIME: '2021-08-04 00:00:00.000000000',
                BOOKEDCAPACITYINMINUTES: 720
            }
        ];

        assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Delete assignment on Res0-Req0
        *****************************************************************************************************************/
        assignmentDeleteActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.delete('/Assignments(ID=' + assignmentIdRes0Req0 + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 204, 'Expected status code to be 204 (OK).');

        // Test that booked capacity of Res0 updated correctly
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[0].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        assert.equal(bookedCapacityAggregateResponse.length, 0, 'Actual booked capacity aggregate not as expected');

        /*****************************************************************************************************************
          Delete assignment on Res1-Req0
        *****************************************************************************************************************/
        assignmentDeleteActionResponse = await BookedCapacityUpdateOnAssignmentCUDTest.assignmentServiceClient.delete('/Assignments(ID=' + assignmentIdRes1Req1 + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 204, 'Expected status code to be 204 (OK).');

        // Test that booked capacity of Res1 updated correctly
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.sqlGenerator.generateSelectStatement(BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.tableName, ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID = '${BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader[1].ID}' order by startTime asc`);
        bookedCapacityAggregateResponse = await BookedCapacityUpdateOnAssignmentCUDTest.bookedCapacityAggregateRepository.statementExecutor.execute(sqlStatementString);

        assert.equal(bookedCapacityAggregateResponse.length, 0, 'Actual booked capacity aggregate not as expected');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await BookedCapacityUpdateOnAssignmentCUDTest.cleanUpResourceBookedCapacityTable(BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader.map(r => r.ID));

        await BookedCapacityUpdateOnAssignmentCUDTest.resourceRequestRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceRequests);
        await BookedCapacityUpdateOnAssignmentCUDTest.capacityRequirementRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.capacityRequirement);
        await BookedCapacityUpdateOnAssignmentCUDTest.demandRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.demand);
        await BookedCapacityUpdateOnAssignmentCUDTest.workPackageRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.workPackage);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceHeaderRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceHeader);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceTypesRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceTypes);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceCapacityRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceCapacity);
        await BookedCapacityUpdateOnAssignmentCUDTest.jobDetailRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.jobDetail);
        await BookedCapacityUpdateOnAssignmentCUDTest.organizationHeaderRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.organizationHeader);
        await BookedCapacityUpdateOnAssignmentCUDTest.organizationDetailRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.organizationDetail);
        await BookedCapacityUpdateOnAssignmentCUDTest.employeeHeaderRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.employeeHeader);
        await BookedCapacityUpdateOnAssignmentCUDTest.workAssignmentRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.workAssignment);
        await BookedCapacityUpdateOnAssignmentCUDTest.workforcePersonRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.workforcePerson);
        await BookedCapacityUpdateOnAssignmentCUDTest.costCenterRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.costCenter);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationsRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizations);
        await BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationItemsRepository.deleteMany(BookedCapacityUpdateOnAssignmentCUDTest.resourceOrganizationItems);

        BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs = `${BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs} )`;
        let sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs}`);
        await BookedCapacityUpdateOnAssignmentCUDTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = BookedCapacityUpdateOnAssignmentCUDTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${BookedCapacityUpdateOnAssignmentCUDTest.assignmentIDs}`);
        await BookedCapacityUpdateOnAssignmentCUDTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
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