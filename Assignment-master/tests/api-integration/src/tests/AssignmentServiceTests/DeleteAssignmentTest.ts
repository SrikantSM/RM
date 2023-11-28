import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity, Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, ResourceTypesRepository, ResourceRequestRepository, ResourceRequest, ResourceTypes, DemandRepository, WorkPackageRepository, Demand, WorkPackage, ResourceSupplyRepository, ResourceSupply, BookedCapacityAggregateRepository } from 'test-commons';

@suite
export class DeleteAssignmentTest {
    private static assignmentServiceClient: AxiosInstance;

    private static uniquifier: Uniquifier;
    private static assignmentRepository: AssignmentsRepository;
    private static assignmentBucketRepository: AssignmentBucketRepository;
    private static resourceSupplyRepository: ResourceSupplyRepository;

    private static resourceRequestRepository: ResourceRequestRepository;
    private static resourceHeaderRepository: ResourceHeaderRepository;
    private static demandRepository: DemandRepository;
    private static workPackageRepository: WorkPackageRepository;
    private static resourceTypesRepository: ResourceTypesRepository;
    private static resourceCapacityRepository: ResourceCapacityRepository;

    private static resourceRequests: ResourceRequest[];
    private static demand: Demand[];
    private static workPackage: WorkPackage[];

    private static resourceTypes: ResourceTypes[];
    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];

    private static assignment: Assignments[];
    private static assignmentBuckets: AssignmentBucket[];
    private static resourceSupply: ResourceSupply[];
    private static idOfAssignmentOnClosedRequest: string;
    private static idOfAssignmentOnOpenRequest: string;

    @timeout(TEST_TIMEOUT)
    static async before() {
        DeleteAssignmentTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

        DeleteAssignmentTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        DeleteAssignmentTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        DeleteAssignmentTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
        DeleteAssignmentTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        DeleteAssignmentTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        DeleteAssignmentTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        DeleteAssignmentTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        DeleteAssignmentTest.demandRepository = await testEnvironment.getDemandRepository();
        DeleteAssignmentTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

        DeleteAssignmentTest.uniquifier = new Uniquifier();

        DeleteAssignmentTest.resourceHeader = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        DeleteAssignmentTest.resourceCapacity = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        DeleteAssignmentTest.resourceTypes = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');

        DeleteAssignmentTest.assignment = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        DeleteAssignmentTest.assignmentBuckets = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        DeleteAssignmentTest.resourceSupply = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

        DeleteAssignmentTest.resourceRequests = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        DeleteAssignmentTest.demand = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
        DeleteAssignmentTest.workPackage = await DeleteAssignmentTest.uniquifier.getRecords('../data/input/deleteAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

        DeleteAssignmentTest.resourceRequests.forEach(resReq => {
            if (resReq.requestStatus_code == 1) {
                DeleteAssignmentTest.assignment.forEach(asgn => {
                    if (asgn.resourceRequest_ID == resReq.ID) {
                        DeleteAssignmentTest.idOfAssignmentOnClosedRequest = asgn.ID;
                    }
                }
                )
            }
        });

        DeleteAssignmentTest.resourceRequests.forEach(resReq => {
            if (resReq.requestStatus_code == 0) {
                DeleteAssignmentTest.assignment.forEach(asgn => {
                    if (asgn.resourceRequest_ID == resReq.ID) {
                        DeleteAssignmentTest.idOfAssignmentOnOpenRequest = asgn.ID;
                    }
                }
                )
            }
        });

        await DeleteAssignmentTest.resourceHeaderRepository.insertMany(DeleteAssignmentTest.resourceHeader);
        await DeleteAssignmentTest.resourceCapacityRepository.insertMany(DeleteAssignmentTest.resourceCapacity);
        await DeleteAssignmentTest.resourceTypesRepository.insertMany(DeleteAssignmentTest.resourceTypes);

        await DeleteAssignmentTest.assignmentRepository.insertMany(DeleteAssignmentTest.assignment);
        await DeleteAssignmentTest.assignmentBucketRepository.insertMany(DeleteAssignmentTest.assignmentBuckets);
        await DeleteAssignmentTest.resourceSupplyRepository.insertMany(DeleteAssignmentTest.resourceSupply);

        await DeleteAssignmentTest.resourceRequestRepository.insertMany(DeleteAssignmentTest.resourceRequests);
        await DeleteAssignmentTest.demandRepository.insertMany(DeleteAssignmentTest.demand);
        await DeleteAssignmentTest.workPackageRepository.insertMany(DeleteAssignmentTest.workPackage);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment for Open Request can be deleted'() {

        assert.isNotNull(DeleteAssignmentTest.idOfAssignmentOnOpenRequest, 'No Assignments on Open Request could be found. Cannot execute tests');

        const assignmentDeleteActionResponse = await DeleteAssignmentTest.assignmentServiceClient.delete('/Assignments(ID=' + DeleteAssignmentTest.idOfAssignmentOnOpenRequest + ',IsActiveEntity=true)');
        assert.equal(assignmentDeleteActionResponse.status, 204, 'Expected status code to be 204 (OK).');

        // Finally check that the active assignment is no longer in DB
        const assignmentReadActionResponsePostDeletion = await DeleteAssignmentTest.assignmentServiceClient.get('/Assignments(ID=' + DeleteAssignmentTest.idOfAssignmentOnOpenRequest + ',IsActiveEntity=true)');
        assert.equal(assignmentReadActionResponsePostDeletion.status, 404, 'Expected status code to be 404 (NOT_FOUND).');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment for Closed Request canNOT be deleted'() {

        assert.isNotNull(DeleteAssignmentTest.idOfAssignmentOnClosedRequest, 'No Assignments on Closed Request could be found. Cannot execute tests');

        const assignmentDeleteActionResponse = await DeleteAssignmentTest.assignmentServiceClient.delete('/Assignments(ID=' + DeleteAssignmentTest.idOfAssignmentOnClosedRequest + ',IsActiveEntity=true)');
        assert.isAtLeast(assignmentDeleteActionResponse.status, 400, 'Expected status code to be 400.');
        assert.isNotNull(assignmentDeleteActionResponse.data.error, 'Expected error in response');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await DeleteAssignmentTest.cleanUpResourceBookedCapacityTable(DeleteAssignmentTest.resourceHeader.map(r => r.ID));

        await DeleteAssignmentTest.resourceHeaderRepository.deleteMany(DeleteAssignmentTest.resourceHeader);
        await DeleteAssignmentTest.resourceCapacityRepository.deleteMany(DeleteAssignmentTest.resourceCapacity);
        await DeleteAssignmentTest.resourceTypesRepository.deleteMany(DeleteAssignmentTest.resourceTypes);

        await DeleteAssignmentTest.assignmentRepository.deleteMany(DeleteAssignmentTest.assignment);
        await DeleteAssignmentTest.assignmentBucketRepository.deleteMany(DeleteAssignmentTest.assignmentBuckets);
        await DeleteAssignmentTest.resourceSupplyRepository.deleteMany(DeleteAssignmentTest.resourceSupply);

        await DeleteAssignmentTest.resourceRequestRepository.deleteMany(DeleteAssignmentTest.resourceRequests);
        await DeleteAssignmentTest.demandRepository.deleteMany(DeleteAssignmentTest.demand);
        await DeleteAssignmentTest.workPackageRepository.deleteMany(DeleteAssignmentTest.workPackage);
        
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
