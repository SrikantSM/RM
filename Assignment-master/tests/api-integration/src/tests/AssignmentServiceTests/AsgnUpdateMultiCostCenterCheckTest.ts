import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { BookedCapacityAggregateRepository, ResourceHeaderRepository, JobDetailRepository, JobDetail, ResourceCapacityRepository, ResourceHeader, ResourceCapacity, Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, ResourceTypesRepository, ResourceRequestRepository, ResourceRequest, ResourceTypes, WorkAssignmentRepository, WorkAssignment, ResourceSupply, Demand, WorkPackage, DemandRepository, ResourceSupplyRepository, WorkPackageRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository, FillTimeDimProcedure } from 'test-commons';


@suite
export class AsgnUpdateMultiCostCenterCheckTest {
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
    private static fillTimeDimProcedure : FillTimeDimProcedure;

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

    private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
    private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
    private static resourceOrganizations: ResourceOrganizations[];
    private static resourceOrganizationItems: ResourceOrganizationItems[];

    @timeout(TEST_TIMEOUT)
    static async before() {
        AsgnUpdateMultiCostCenterCheckTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

        AsgnUpdateMultiCostCenterCheckTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        AsgnUpdateMultiCostCenterCheckTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        AsgnUpdateMultiCostCenterCheckTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
        AsgnUpdateMultiCostCenterCheckTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AsgnUpdateMultiCostCenterCheckTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        AsgnUpdateMultiCostCenterCheckTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        AsgnUpdateMultiCostCenterCheckTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AsgnUpdateMultiCostCenterCheckTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AsgnUpdateMultiCostCenterCheckTest.demandRepository = await testEnvironment.getDemandRepository();
        AsgnUpdateMultiCostCenterCheckTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        AsgnUpdateMultiCostCenterCheckTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        AsgnUpdateMultiCostCenterCheckTest.fillTimeDimProcedure = await testEnvironment.getFillTimeDimProcedure();

        AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
        AsgnUpdateMultiCostCenterCheckTest.fillTimeDimProcedure = await testEnvironment.getFillTimeDimProcedure();
        AsgnUpdateMultiCostCenterCheckTest.uniquifier = new Uniquifier();

        AsgnUpdateMultiCostCenterCheckTest.resourceHeader = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');

        AsgnUpdateMultiCostCenterCheckTest.resourceCapacity = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AsgnUpdateMultiCostCenterCheckTest.resourceTypes = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');

        AsgnUpdateMultiCostCenterCheckTest.assignment = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        AsgnUpdateMultiCostCenterCheckTest.assignmentBuckets = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        AsgnUpdateMultiCostCenterCheckTest.resourceSupply = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

        AsgnUpdateMultiCostCenterCheckTest.resourceRequests = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AsgnUpdateMultiCostCenterCheckTest.demand = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
        AsgnUpdateMultiCostCenterCheckTest.workPackage = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

        AsgnUpdateMultiCostCenterCheckTest.workAssignment = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
        AsgnUpdateMultiCostCenterCheckTest.jobDetail = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

        AsgnUpdateMultiCostCenterCheckTest.resourceOrganizations = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationItems = await AsgnUpdateMultiCostCenterCheckTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        const currentYearStart = new Date(Date.UTC(2017,1,1));
        const currentYearPlusTwoStart = new Date(Date.UTC(2020, 1, 1));
        await this.fillTimeDimProcedure.callProcedure('05', currentYearStart.toJSON(), currentYearPlusTwoStart.toJSON());

        await AsgnUpdateMultiCostCenterCheckTest.resourceHeaderRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceHeader);
        await AsgnUpdateMultiCostCenterCheckTest.resourceCapacityRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceCapacity);
        await AsgnUpdateMultiCostCenterCheckTest.resourceTypesRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceTypes);

        await AsgnUpdateMultiCostCenterCheckTest.assignmentRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.assignment);
        await AsgnUpdateMultiCostCenterCheckTest.assignmentBucketRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.assignmentBuckets);
        await AsgnUpdateMultiCostCenterCheckTest.resourceSupplyRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceSupply);

        await AsgnUpdateMultiCostCenterCheckTest.resourceRequestRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceRequests);
        await AsgnUpdateMultiCostCenterCheckTest.demandRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.demand);
        await AsgnUpdateMultiCostCenterCheckTest.workPackageRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.workPackage);
        await AsgnUpdateMultiCostCenterCheckTest.workAssignmentRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.workAssignment);
        await AsgnUpdateMultiCostCenterCheckTest.jobDetailRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.jobDetail);
        await AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationsRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceOrganizations);
        await AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationItemsRepository.insertMany(AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationItems);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment update operation for resource with multiple cost centers'() {

        const payload = {
            ID: AsgnUpdateMultiCostCenterCheckTest.assignment[0].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: AsgnUpdateMultiCostCenterCheckTest.resourceRequests[1].ID,
            resource_ID: AsgnUpdateMultiCostCenterCheckTest.resourceHeader[2].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AsgnUpdateMultiCostCenterCheckTest.assignmentBuckets[26].ID,
                    startTime: "2020-12-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: AsgnUpdateMultiCostCenterCheckTest.assignment[0].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await AsgnUpdateMultiCostCenterCheckTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 400, 'Expected status code to be 400.');

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource with multiple cost centers with intersecting validity'() {

        const payload = {
            ID: AsgnUpdateMultiCostCenterCheckTest.assignment[0].ID,
            bookedCapacityInMinutes: 300,
            resourceRequest_ID: AsgnUpdateMultiCostCenterCheckTest.resourceRequests[1].ID,
            resource_ID: AsgnUpdateMultiCostCenterCheckTest.resourceHeader[0].ID,
            assignmentStatus_code: 0,
            assignmentBuckets: [
                {
                    ID: AsgnUpdateMultiCostCenterCheckTest.assignmentBuckets[26].ID,
                    startTime: "2020-10-04T00:00:00Z",
                    bookedCapacityInMinutes: 300,
                    assignment_ID: AsgnUpdateMultiCostCenterCheckTest.assignment[0].ID,
                }
            ]
        }

        const assignmentChangeActionResponse = await AsgnUpdateMultiCostCenterCheckTest.assignmentServiceClient.patch('/Assignments(ID=' + payload.ID + ',IsActiveEntity=true)', payload);
        assert.equal(assignmentChangeActionResponse.status, 200, 'Expected status code to be 200.');

    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await AsgnUpdateMultiCostCenterCheckTest.cleanUpResourceBookedCapacityTable(AsgnUpdateMultiCostCenterCheckTest.resourceHeader.map(r => r.ID));

        await AsgnUpdateMultiCostCenterCheckTest.resourceHeaderRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceHeader);
        await AsgnUpdateMultiCostCenterCheckTest.resourceCapacityRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceCapacity);
        await AsgnUpdateMultiCostCenterCheckTest.resourceTypesRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceTypes);

        await AsgnUpdateMultiCostCenterCheckTest.assignmentRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.assignment);
        await AsgnUpdateMultiCostCenterCheckTest.assignmentBucketRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.assignmentBuckets);
        await AsgnUpdateMultiCostCenterCheckTest.resourceSupplyRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceSupply);

        await AsgnUpdateMultiCostCenterCheckTest.resourceRequestRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceRequests);
        await AsgnUpdateMultiCostCenterCheckTest.demandRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.demand);
        await AsgnUpdateMultiCostCenterCheckTest.workPackageRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.workPackage);
        await AsgnUpdateMultiCostCenterCheckTest.workAssignmentRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.workAssignment);
        await AsgnUpdateMultiCostCenterCheckTest.jobDetailRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.jobDetail);
        await AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationsRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceOrganizations);
        await AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationItemsRepository.deleteMany(AsgnUpdateMultiCostCenterCheckTest.resourceOrganizationItems);
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
