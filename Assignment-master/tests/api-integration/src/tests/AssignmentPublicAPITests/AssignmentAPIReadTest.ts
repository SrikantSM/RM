import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { AxiosInstance } from 'axios';
import { WorkAssignmentRepository, WorkAssignment, AssignmentBucket, AssignmentBucketRepository, Assignments, AssignmentsRepository } from 'test-commons';

@suite
export class AssignmentAPIReadTest {

    private static AssignmentPublicAPIClient: AxiosInstance;

    private static uniquifier: Uniquifier;

    private static assignmentRepository: AssignmentsRepository;
    private static assignmentBucketRepository: AssignmentBucketRepository;
    private static workAssignmentRepository: WorkAssignmentRepository;

    private static assignment: Assignments[];
    private static assignmentBuckets: AssignmentBucket[];
    private static workAssignment: WorkAssignment[];

    @timeout(TEST_TIMEOUT)
    static async before() {
        AssignmentAPIReadTest.AssignmentPublicAPIClient = await testEnvironment.getAssignmentPublicApiServiceClient();

        AssignmentAPIReadTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        AssignmentAPIReadTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        AssignmentAPIReadTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();

        AssignmentAPIReadTest.uniquifier = new Uniquifier();

        AssignmentAPIReadTest.assignment = await AssignmentAPIReadTest.uniquifier.getRecords('../data/input/assignmentPublicAPI/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        AssignmentAPIReadTest.assignmentBuckets = await AssignmentAPIReadTest.uniquifier.getRecords('../data/input/assignmentPublicAPI/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        AssignmentAPIReadTest.workAssignment = await AssignmentAPIReadTest.uniquifier.getRecords('../data/input/assignmentPublicAPI/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        for (var i = 0; i < AssignmentAPIReadTest.workAssignment.length; i++) {
            AssignmentAPIReadTest.workAssignment[i].workAssignmentID = `AsgnPubAPI.${i}`;
        }

        await AssignmentAPIReadTest.assignmentRepository.insertMany(AssignmentAPIReadTest.assignment);
        await AssignmentAPIReadTest.assignmentBucketRepository.insertMany(AssignmentAPIReadTest.assignmentBuckets);
        await AssignmentAPIReadTest.workAssignmentRepository.insertMany(AssignmentAPIReadTest.workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get metadata.'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get('/$metadata');
        assert.equal(readAssignment.status, 200);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get all Assignments'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get('/Assignments');
        assert.equal(readAssignment.status, 200);
        assert.isAtLeast(readAssignment.data.value.length, 4);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignment by ID'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPIReadTest.assignment[0].ID})`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.ID, AssignmentAPIReadTest.assignment[0].ID);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignment by ID and expand to _workAssignment'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPIReadTest.assignment[0].ID})?$expand=_workAssignment`);
        assert.equal(readAssignment.status, 200);
        assert.isNotEmpty(readAssignment.data._workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignment by resourceID'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=resourceID eq ${AssignmentAPIReadTest.assignment[0].resource_ID}`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignment by requestID'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=requestID eq ${AssignmentAPIReadTest.assignment[0].resourceRequest_ID}`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignment by requestID and expand to _workAssignment'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=requestID eq ${AssignmentAPIReadTest.assignment[0].resourceRequest_ID}&$expand=_workAssignment`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
        assert.isNotEmpty(readAssignment.data.value[0]._workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignments by start and end date'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=startDate ge 2021-10-01 and endDate le 2021-12-31`);
        assert.equal(readAssignment.status, 200);
        assert.isAtLeast(readAssignment.data.value.length, 3);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignments by resourceID and start/end date'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=resourceID eq ${AssignmentAPIReadTest.assignment[2].resource_ID} and startDate le 2021-12-31 and endDate ge 2021-01-01`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 2);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignments by resourceID and assignment status'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=resourceID eq ${AssignmentAPIReadTest.assignment[2].resource_ID} and isSoftBooked eq true`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignments by resourceID, assignment status and start/end date'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$filter=resourceID eq ${AssignmentAPIReadTest.assignment[2].resource_ID} and isSoftBooked eq true and startDate le 2021-12-31 and endDate ge 2021-01-01`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignments by workAssignmentID'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$expand=_workAssignment&$filter=contains(_workAssignment/workAssignmentID, '${AssignmentAPIReadTest.workAssignment[3].workAssignmentID}')`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 2);
        assert.isNotEmpty(readAssignment.data.value[0]._workAssignment);
        assert.isNotEmpty(readAssignment.data.value[1]._workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get assignments by workAssignmentID and start/end Date'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$expand=_workAssignment&$filter=(contains(_workAssignment/workAssignmentID, '${AssignmentAPIReadTest.workAssignment[3].workAssignmentID}') and startDate le 2021-12-31 and endDate ge 2021-01-01)`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 2);
        assert.isNotEmpty(readAssignment.data.value[0]._workAssignment);
        assert.isNotEmpty(readAssignment.data.value[1]._workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Assignments by workAssignmentID and assignment status'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$expand=_workAssignment&$filter=(contains(_workAssignment/workAssignmentID, '${AssignmentAPIReadTest.workAssignment[3].workAssignmentID}') and isSoftBooked eq true)`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
        assert.isNotEmpty(readAssignment.data.value[0]._workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get assignments by workAssignmentID, assignment status and start/end Date'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$expand=_workAssignment&$filter=(contains(_workAssignment/workAssignmentID, '${AssignmentAPIReadTest.workAssignment[3].workAssignmentID}') and isSoftBooked eq true and startDate le 2021-12-31 and endDate ge 2021-01-01)`);
        assert.equal(readAssignment.status, 200);
        assert.equal(readAssignment.data.value.length, 1);
        assert.isNotEmpty(readAssignment.data.value[0]._workAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get asssignment daily distribution'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/Assignments?$top=1&$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignment.status, 200);
        assert.isNotEmpty(readAssignment.data.value[0]._dailyAssignmentDistribution);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read daily distribution aggregated by week for a given assignment'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/DailyAssignmentDistribution?$filter=assignmentID eq ${AssignmentAPIReadTest.assignment[0].ID}&$apply=groupby((assignmentID,calendarWeek),aggregate(bookedCapacity with sum as totalBookedCapacityForTheWeek))`);
        assert.equal(readAssignment.status, 200);
        assert.isNotNull(readAssignment.data.value[0].totalBookedCapacityForTheWeek);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read daily distribution aggregated by month for a given assignment'() {
        const readAssignment = await AssignmentAPIReadTest.AssignmentPublicAPIClient.get(`/DailyAssignmentDistribution?$filter=assignmentID eq ${AssignmentAPIReadTest.assignment[0].ID}&$apply=groupby((assignmentID,calendarMonth),aggregate(bookedCapacity with sum as totalBookedCapacityForTheMonth))`);
        assert.equal(readAssignment.status, 200);
        assert.isNotNull(readAssignment.data.value[0].totalBookedCapacityForTheMonth);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await AssignmentAPIReadTest.assignmentRepository.deleteMany(AssignmentAPIReadTest.assignment);
        await AssignmentAPIReadTest.assignmentBucketRepository.deleteMany(AssignmentAPIReadTest.assignmentBuckets);
        await AssignmentAPIReadTest.workAssignmentRepository.deleteMany(AssignmentAPIReadTest.workAssignment);
    }
}
