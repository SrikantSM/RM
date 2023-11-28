import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceRequestRepository, CapacityRequirementRepository, ResourceTypesRepository, ResourceRequest, CapacityRequirement, ResourceHeader, ResourceTypes, ResourceCapacity, Assignments, AssignmentBucket } from 'test-commons';

@suite
export class TotalHoursSimulationTest {
  private static assignmentServiceClient: AxiosInstance;

  private static uniquifier: Uniquifier;

  private static resourceRequestRepository: ResourceRequestRepository;
  private static capacityRequirementRepository: CapacityRequirementRepository;
  private static resourceHeaderRepository: ResourceHeaderRepository;
  private static resourceTypesRepository: ResourceTypesRepository;
  private static resourceCapacityRepository: ResourceCapacityRepository;

  private static assignmentIDs: string = "(";

  private static resourceRequests: ResourceRequest[];
  private static capacityRequirement: CapacityRequirement[];

  private static resourceTypes: ResourceTypes[];

  private static resourceHeader: ResourceHeader[];
  private static resourceCapacity: ResourceCapacity[];

  private static resourceHeaderNotAvail2ndMonth: ResourceHeader[];
  private static resourceCapacityNotAvail2ndMonth: ResourceCapacity[];

  private static resourceHeaderNoAvail: ResourceHeader[];
  private static resourceCapacityNoAvail: ResourceCapacity[];

  @timeout(TEST_TIMEOUT)
  static async before() {
    TotalHoursSimulationTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

    TotalHoursSimulationTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    TotalHoursSimulationTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
    TotalHoursSimulationTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    TotalHoursSimulationTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
    TotalHoursSimulationTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();

    TotalHoursSimulationTest.uniquifier = new Uniquifier();

    TotalHoursSimulationTest.resourceRequests = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    TotalHoursSimulationTest.capacityRequirement = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

    TotalHoursSimulationTest.resourceHeader = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    TotalHoursSimulationTest.resourceTypes = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
    TotalHoursSimulationTest.resourceCapacity = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    TotalHoursSimulationTest.resourceHeaderNotAvail2ndMonth = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resNotAvail2ndMonth/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    TotalHoursSimulationTest.resourceCapacityNotAvail2ndMonth = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resNotAvail2ndMonth/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    TotalHoursSimulationTest.resourceHeaderNoAvail = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resNoAvail/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    TotalHoursSimulationTest.resourceCapacityNoAvail = await TotalHoursSimulationTest.uniquifier.getRecords('../data/input/resNoAvail/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    await TotalHoursSimulationTest.resourceRequestRepository.insertMany(TotalHoursSimulationTest.resourceRequests);
    await TotalHoursSimulationTest.capacityRequirementRepository.insertMany(TotalHoursSimulationTest.capacityRequirement);

    await TotalHoursSimulationTest.resourceTypesRepository.insertMany(TotalHoursSimulationTest.resourceTypes);

    await TotalHoursSimulationTest.resourceHeaderRepository.insertMany(TotalHoursSimulationTest.resourceHeader);
    await TotalHoursSimulationTest.resourceCapacityRepository.insertMany(TotalHoursSimulationTest.resourceCapacity);

    await TotalHoursSimulationTest.resourceHeaderRepository.insertMany(TotalHoursSimulationTest.resourceHeaderNotAvail2ndMonth);
    await TotalHoursSimulationTest.resourceCapacityRepository.insertMany(TotalHoursSimulationTest.resourceCapacityNotAvail2ndMonth);

    await TotalHoursSimulationTest.resourceHeaderRepository.insertMany(TotalHoursSimulationTest.resourceHeaderNoAvail);
    await TotalHoursSimulationTest.resourceCapacityRepository.insertMany(TotalHoursSimulationTest.resourceCapacityNoAvail);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets and fully available resource : Assignment shorter than request period'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-10-15",
      end: "2019-12-17",
      duration: "424",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs} '${assignmentService.data.ID}'`;
    const expectedAssignmentHeader: Assignments[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resFree-subPeriod/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resFree-subPeriod/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by total hour simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets and fully available resource : Assignment across full request period'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-10-01",
      end: "2019-12-31",
      duration: "424",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    const expectedAssignmentHeader: Assignments[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resFree-FullPeriod/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resFree-FullPeriod/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by total hour simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets and resource not available for 2nd month : Assignment for 1st month'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeaderNotAvail2ndMonth[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-10-01",
      end: "2019-10-31",
      duration: "120",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    const expectedAssignmentHeader: Assignments[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resNotAvail2ndMonth-firstMonth/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resNotAvail2ndMonth-firstMonth/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by total hour simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets and resource not available for 2nd month : Assignment across full request period'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeaderNotAvail2ndMonth[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-10-01",
      end: "2019-12-31",
      duration: "339",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    const expectedAssignmentHeader: Assignments[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resNotAvail2ndMonth-FullPeriod/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await TotalHoursSimulationTest.uniquifier.getRecords('../data/expected/userDefinedPeriod/reqCapMonth-resNotAvail2ndMonth-FullPeriod/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by total hour simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets and no availability for 2nd month : Assignment for 2nd month'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeaderNoAvail[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-11-01",
      end: "2019-11-30",
      duration: "1",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Specific business restrictions for user defined periods : No Assignment Start Date'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "",
      end: "2020-01-01",
      duration: "424",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Specific business restrictions for user defined periods : No Assignment End Date'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-11-11",
      end: "",
      duration: "1",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Specific business restrictions for user defined periods : No staffed hours'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-11-11",
      end: "2019-12-24",
      duration: "0",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400 (BAD_REQUEST).');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Specific business restrictions for user defined periods : Assignment Start before Request Start'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-09-30",
      end: "2019-12-24",
      duration: "100",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Specific business restrictions for user defined periods : Assignment End after Request End'() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-11-11",
      end: "2020-01-02",
      duration: "100",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'WrongAssignmentDate : Assignment with start Date > End date can not be created '() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[0].ID,
      start: "2019-12-29",
      end: "2019-12-01",
      duration: "424",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400 (BAD_REQUEST).');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Unpublished Request: Assignments can not be created for requests unless they are published '() {

    const payload = {
      resourceId: TotalHoursSimulationTest.resourceHeader[0].ID,
      resourceRequestId: TotalHoursSimulationTest.resourceRequests[1].ID,
      start: "2019-12-02",
      end: "2019-12-29",
      duration: "424",
      mode:"I",
      assignmentStatusCode:1
    };
    const assignmentService = await TotalHoursSimulationTest.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');

  }


  @timeout(TEST_TIMEOUT)
  static async after() {

    await TotalHoursSimulationTest.resourceRequestRepository.deleteMany(TotalHoursSimulationTest.resourceRequests);
    await TotalHoursSimulationTest.capacityRequirementRepository.deleteMany(TotalHoursSimulationTest.capacityRequirement);
    await TotalHoursSimulationTest.resourceHeaderRepository.deleteMany(TotalHoursSimulationTest.resourceHeader);
    await TotalHoursSimulationTest.resourceTypesRepository.deleteMany(TotalHoursSimulationTest.resourceTypes);
    await TotalHoursSimulationTest.resourceCapacityRepository.deleteMany(TotalHoursSimulationTest.resourceCapacity);

    await TotalHoursSimulationTest.resourceHeaderRepository.deleteMany(TotalHoursSimulationTest.resourceHeaderNotAvail2ndMonth);
    await TotalHoursSimulationTest.resourceCapacityRepository.deleteMany(TotalHoursSimulationTest.resourceCapacityNotAvail2ndMonth);

    await TotalHoursSimulationTest.resourceHeaderRepository.deleteMany(TotalHoursSimulationTest.resourceHeaderNoAvail);
    await TotalHoursSimulationTest.resourceCapacityRepository.deleteMany(TotalHoursSimulationTest.resourceCapacityNoAvail);

    TotalHoursSimulationTest.assignmentIDs = `${TotalHoursSimulationTest.assignmentIDs} )`;
    let sqlStatementString = TotalHoursSimulationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${TotalHoursSimulationTest.assignmentIDs}`);
    await TotalHoursSimulationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
    sqlStatementString = TotalHoursSimulationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${TotalHoursSimulationTest.assignmentIDs}`);        
    await TotalHoursSimulationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);    

  }

}