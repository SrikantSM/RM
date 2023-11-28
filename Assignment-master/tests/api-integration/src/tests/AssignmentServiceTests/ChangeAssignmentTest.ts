import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceHeaderRepository, JobDetailRepository, JobDetail, ResourceCapacityRepository, ResourceHeader, ResourceCapacity, Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, ResourceTypesRepository, ResourceRequestRepository, ResourceRequest, ResourceTypes, WorkAssignmentRepository, WorkAssignment, ResourceSupply, Demand, WorkPackage, DemandRepository, ResourceSupplyRepository, WorkPackageRepository, BookedCapacityAggregateRepository } from 'test-commons';
import { v4 as uuid } from 'uuid';

@suite
export class ChangeAssignmentTest {
    private static assignmentServiceClient: AxiosInstance;

    private static uniquifier: Uniquifier;
    private static assignmentRepository: AssignmentsRepository;
    private static assignmentBucketRepository: AssignmentBucketRepository;
    private static resourceSupplyRepository: ResourceSupplyRepository;
    private static resourceRequestRepository: ResourceRequestRepository;
    private static demandRepository: DemandRepository;
    private static workPackageRepository: WorkPackageRepository;
    private static resourceHeaderRepository: ResourceHeaderRepository;
    private static resourceTypesRepository: ResourceTypesRepository;
    private static resourceCapacityRepository: ResourceCapacityRepository;
    private static workAssignmentRepository: WorkAssignmentRepository;
    private static jobDetailRepository: JobDetailRepository;

    private static resourceRequests: ResourceRequest[];

    private static resourceTypes: ResourceTypes[];
    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];

    private static assignment: Assignments[];
    private static jobDetail: JobDetail[];
    private static assignmentBuckets: AssignmentBucket[];
    private static resourceSupply: ResourceSupply[];

    private static workAssignment: WorkAssignment[];
    private static demand: Demand[];
    private static workPackage: WorkPackage[];

    @timeout(TEST_TIMEOUT)
    static async before() {
        ChangeAssignmentTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

        ChangeAssignmentTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        ChangeAssignmentTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        ChangeAssignmentTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
        ChangeAssignmentTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        ChangeAssignmentTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        ChangeAssignmentTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        ChangeAssignmentTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        ChangeAssignmentTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        ChangeAssignmentTest.demandRepository = await testEnvironment.getDemandRepository();
        ChangeAssignmentTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        ChangeAssignmentTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();


        ChangeAssignmentTest.uniquifier = new Uniquifier();

        ChangeAssignmentTest.resourceHeader = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        ChangeAssignmentTest.resourceCapacity = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        ChangeAssignmentTest.resourceTypes = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');

        ChangeAssignmentTest.assignment = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        ChangeAssignmentTest.assignmentBuckets = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        ChangeAssignmentTest.resourceSupply = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');


        ChangeAssignmentTest.resourceRequests = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        ChangeAssignmentTest.demand = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
        ChangeAssignmentTest.workPackage = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

        ChangeAssignmentTest.workAssignment = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
        ChangeAssignmentTest.jobDetail = await ChangeAssignmentTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

        await ChangeAssignmentTest.resourceHeaderRepository.insertMany(ChangeAssignmentTest.resourceHeader);
        await ChangeAssignmentTest.resourceCapacityRepository.insertMany(ChangeAssignmentTest.resourceCapacity);
        await ChangeAssignmentTest.resourceTypesRepository.insertMany(ChangeAssignmentTest.resourceTypes);

        await ChangeAssignmentTest.assignmentRepository.insertMany(ChangeAssignmentTest.assignment);
        await ChangeAssignmentTest.assignmentBucketRepository.insertMany(ChangeAssignmentTest.assignmentBuckets);
        await ChangeAssignmentTest.resourceSupplyRepository.insertMany(ChangeAssignmentTest.resourceSupply);

        await ChangeAssignmentTest.resourceRequestRepository.insertMany(ChangeAssignmentTest.resourceRequests);
        await ChangeAssignmentTest.demandRepository.insertMany(ChangeAssignmentTest.demand);
        await ChangeAssignmentTest.workPackageRepository.insertMany(ChangeAssignmentTest.workPackage);
        await ChangeAssignmentTest.workAssignmentRepository.insertMany(ChangeAssignmentTest.workAssignment);
        await ChangeAssignmentTest.jobDetailRepository.insertMany(ChangeAssignmentTest.jobDetail);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment for Open Request can be edited'() {

        const payload = {
            ID: ChangeAssignmentTest.assignment[0].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: ChangeAssignmentTest.resourceRequests[1].ID,
            resource_ID: ChangeAssignmentTest.resourceHeader[0].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: ChangeAssignmentTest.assignmentBuckets[26].ID,
                    startTime: "2020-12-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: ChangeAssignmentTest.assignment[0].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await ChangeAssignmentTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');
        assert.isNotNull(assignmentChangeActionResponse.data.assignmentBuckets, 'Expected assignment buckets');
        assert.isNotNull(assignmentChangeActionResponse.data.assignment, 'Expected sassignment header');
        assert.isUndefined(assignmentChangeActionResponse.data.error, 'Expected no error in response');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment cannot be changed from hard-booked to proposed'() {

        const payload = {
            ID: ChangeAssignmentTest.assignment[0].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: ChangeAssignmentTest.resourceRequests[1].ID,
            resource_ID: ChangeAssignmentTest.resourceHeader[0].ID,
            assignmentStatus_code: 2,
            assignmentBuckets: [
                {
                    ID: ChangeAssignmentTest.assignmentBuckets[26].ID,
                    startTime: "2020-12-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: ChangeAssignmentTest.assignment[0].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await ChangeAssignmentTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        // the error message text has changed. Will update here once UA review is done.
        // assert.equal(assignmentChangeActionResponse.data.error.message, 'Assignment status cannot be changed to proposed. The assignment is already booked.', 'Expected error message not returned');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment cannot be changed from hard-booked to soft-booked'() {

        const payload = {
            ID: ChangeAssignmentTest.assignment[0].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: ChangeAssignmentTest.resourceRequests[1].ID,
            resource_ID: ChangeAssignmentTest.resourceHeader[0].ID,
            assignmentStatus_code: 1,
            assignmentBuckets: [
                {
                    ID: ChangeAssignmentTest.assignmentBuckets[26].ID,
                    startTime: "2020-12-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: ChangeAssignmentTest.assignment[0].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await ChangeAssignmentTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        // the error message text has changed. Will update here once UA review is done.
        // assert.equal(assignmentChangeActionResponse.data.error.message, 'Assignment status cannot be changed from hard-booked to soft-booked', 'Expected error message not returned');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment for Closed Request cannot be edited'() {

        const payload = {
            ID: ChangeAssignmentTest.assignment[1].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: ChangeAssignmentTest.resourceRequests[0].ID,
            resource_ID: ChangeAssignmentTest.resourceHeader[2].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: ChangeAssignmentTest.assignmentBuckets[101].ID,
                    startTime: "2020-12-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: ChangeAssignmentTest.assignment[1].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await ChangeAssignmentTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.isAtLeast(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400.');
        assert.isNotNull(assignmentChangeActionResponse.data.error, 'Expected error in response');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing an assignment by creating(POST in changeset) buckets on a new month'() {

        // POST a new month and DELETE existing months
        const payload = {
            ID: ChangeAssignmentTest.assignment[0].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: ChangeAssignmentTest.resourceRequests[1].ID,
            resource_ID: ChangeAssignmentTest.resourceHeader[0].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: uuid(),
                    startTime: "2020-09-04T00:00:00Z",
                    bookedCapacityInMinutes: 311,
                    assignment_ID: ChangeAssignmentTest.assignment[0].ID,
                }
            ]
        }

        ChangeAssignmentTest.assignmentBuckets.push(payload.assignmentBuckets[0]);
        const assignmentChangeActionResponse = await ChangeAssignmentTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');
        assert.isNotNull(assignmentChangeActionResponse.data.assignmentBuckets, 'Expected assignment buckets');
        assert.isNotNull(assignmentChangeActionResponse.data.assignment, 'Expected sassignment header');
        assert.isUndefined(assignmentChangeActionResponse.data.error, 'Expected no error in response');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing an assignment by updating(PATCH in changeset) existing month'() {

        // PATCH an existing month and DELETE other months
        const payload = {
            ID: ChangeAssignmentTest.assignment[2].ID,
            bookedCapacityInMinutes: 400,
            resourceRequest_ID: ChangeAssignmentTest.resourceRequests[0].ID,
            resource_ID: ChangeAssignmentTest.resourceHeader[1].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: uuid(),
                    startTime: "2020-10-10T00:00:00Z",
                    bookedCapacityInMinutes: 411,
                    assignment_ID: ChangeAssignmentTest.assignment[1].ID,
                }
            ]
        }

        ChangeAssignmentTest.assignmentBuckets.push(payload.assignmentBuckets[0]);
        const assignmentChangeActionResponse = await ChangeAssignmentTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200 (OK).');
        assert.isNotNull(assignmentChangeActionResponse.data.assignmentBuckets, 'Expected assignment buckets');
        assert.isNotNull(assignmentChangeActionResponse.data.assignment, 'Expected sassignment header');
        assert.isUndefined(assignmentChangeActionResponse.data.error, 'Expected no error in response');

    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await ChangeAssignmentTest.cleanUpResourceBookedCapacityTable(ChangeAssignmentTest.resourceHeader.map(r => r.ID));

        await ChangeAssignmentTest.resourceHeaderRepository.deleteMany(ChangeAssignmentTest.resourceHeader);
        await ChangeAssignmentTest.resourceCapacityRepository.deleteMany(ChangeAssignmentTest.resourceCapacity);
        await ChangeAssignmentTest.resourceTypesRepository.deleteMany(ChangeAssignmentTest.resourceTypes);

        await ChangeAssignmentTest.assignmentRepository.deleteMany(ChangeAssignmentTest.assignment);
        await ChangeAssignmentTest.assignmentBucketRepository.deleteMany(ChangeAssignmentTest.assignmentBuckets);
        await ChangeAssignmentTest.resourceSupplyRepository.deleteMany(ChangeAssignmentTest.resourceSupply);

        await ChangeAssignmentTest.resourceRequestRepository.deleteMany(ChangeAssignmentTest.resourceRequests);
        await ChangeAssignmentTest.demandRepository.deleteMany(ChangeAssignmentTest.demand);
        await ChangeAssignmentTest.workPackageRepository.deleteMany(ChangeAssignmentTest.workPackage);
        await ChangeAssignmentTest.workAssignmentRepository.deleteMany(ChangeAssignmentTest.workAssignment);
        await ChangeAssignmentTest.jobDetailRepository.deleteMany(ChangeAssignmentTest.jobDetail);
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