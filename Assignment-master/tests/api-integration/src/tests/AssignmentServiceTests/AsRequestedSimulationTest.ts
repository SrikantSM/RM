import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { ResourceCapacityRepository, ResourceRequestRepository, ResourceHeaderRepository, CapacityRequirementRepository, ResourceTypesRepository, CostCenterRepository, JobDetailRepository, WorkAssignmentRepository, WorkforcePersonRepository, OrganizationDetailRepository, OrganizationHeaderRepository, EmployeeHeaderRepository, ResourceRequest, CapacityRequirement, ResourceHeader, ResourceTypes, ResourceCapacity, Assignments, AssignmentBucket, JobDetail, CostCenter, WorkAssignment, WorkforcePerson, OrganizationDetail, OrganizationHeader, EmployeeHeader } from 'test-commons';

@suite
export class AsRequestedSimulationTest {
  private static assignmentServiceClient: AxiosInstance;

  private static uniquifier: Uniquifier;

  private static resourceRequestRepository: ResourceRequestRepository;
  private static capacityRequirementRepository: CapacityRequirementRepository;
  private static resourceHeaderRepository: ResourceHeaderRepository;
  private static resourceTypesRepository: ResourceTypesRepository;
  private static resourceCapacityRepository: ResourceCapacityRepository;
  private static costCenterRepository: CostCenterRepository;
  private static jobDetailRepository: JobDetailRepository;
  private static workAssignmentRepository: WorkAssignmentRepository;
  private static workforcePersonRepository: WorkforcePersonRepository;
  private static organizationDetailRepository: OrganizationDetailRepository;
  private static organizationHeaderRepository: OrganizationHeaderRepository;
  private static employeeHeaderRepository: EmployeeHeaderRepository;

  private static assignmentIDs: string = "(";

  private static costCenterMultiCostCenter: CostCenter[];
  private static jobDetailMultiCostCenter: JobDetail[];
  private static workAssignmentMultiCostCenter: WorkAssignment[];
  private static workforcePerson: WorkforcePerson[];
  private static organizationDetail: OrganizationDetail[];
  private static organizationHeader: OrganizationHeader[];
  private static employeeHeader: EmployeeHeader[];


  private static resourceRequests: ResourceRequest[];
  private static capacityRequirement: CapacityRequirement[];

  private static resourceRequests1st3rdMonth: ResourceRequest[];
  private static capacityRequirement1st3rdMonth: CapacityRequirement[];

  private static resourceRequestsDailyDistribution: ResourceRequest[];
  private static capacityRequirementDailyDistribution: CapacityRequirement[];

  private static resourceRequestsWeeklyDistribution: ResourceRequest[];
  private static capacityRequirementWeeklyDistribution: CapacityRequirement[];

  private static resourceRequestsMultiCostCenter: ResourceRequest[];
  private static capacityRequirementMultiCostCenter: CapacityRequirement[];

  private static resourceTypes: ResourceTypes[];

  private static resourceHeader: ResourceHeader[];
  private static resourceCapacity: ResourceCapacity[];

  private static resourceHeaderNotAvail2ndMonth: ResourceHeader[];
  private static resourceCapacityNotAvail2ndMonth: ResourceCapacity[];

  private static resourceHeaderNoAvail: ResourceHeader[];
  private static resourceCapacityNoAvail: ResourceCapacity[];

  private static resourceHeaderOverbook: ResourceHeader[];
  private static resourceCapacityOverbook: ResourceCapacity[];

  private static resourceHeaderShortVacation: ResourceHeader[];
  private static resourceCapacityShortVacation: ResourceCapacity[];

  private static resourceHeaderDailyDistribution: ResourceHeader[];
  private static resourceCapacityDailyDistribution: ResourceCapacity[];

  private static resourceHeaderAvailabilityNotMaintained: ResourceHeader[];
  private static resourceCapacityAvailabilityNotMaintained: ResourceCapacity[];

  private static resourceHeaderMultiCostCenter: ResourceHeader[];
  private static resourceCapacityMultiCostCenter: ResourceCapacity[];

  @timeout(TEST_TIMEOUT)
  static async before() {
    AsRequestedSimulationTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();

    AsRequestedSimulationTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    AsRequestedSimulationTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
    AsRequestedSimulationTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    AsRequestedSimulationTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
    AsRequestedSimulationTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    AsRequestedSimulationTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
    AsRequestedSimulationTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
    AsRequestedSimulationTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    AsRequestedSimulationTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    AsRequestedSimulationTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    AsRequestedSimulationTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    AsRequestedSimulationTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();


    AsRequestedSimulationTest.uniquifier = new Uniquifier();

    AsRequestedSimulationTest.resourceRequests = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    AsRequestedSimulationTest.capacityRequirement = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/reqCapMonthly/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

    AsRequestedSimulationTest.resourceRequests1st3rdMonth = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/reqCap1st3rdMonth/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    AsRequestedSimulationTest.capacityRequirement1st3rdMonth = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/reqCap1st3rdMonth/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

    AsRequestedSimulationTest.resourceRequestsDailyDistribution = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/reqCapDailyDistribution/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    AsRequestedSimulationTest.capacityRequirementDailyDistribution = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/reqCapDailyDistribution/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

    AsRequestedSimulationTest.resourceRequestsWeeklyDistribution = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/reqCapWeeklyDistribution/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    AsRequestedSimulationTest.capacityRequirementWeeklyDistribution = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/reqCapWeeklyDistribution/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

    AsRequestedSimulationTest.resourceRequestsMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    AsRequestedSimulationTest.capacityRequirementMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');

    AsRequestedSimulationTest.resourceHeader = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceTypes = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
    AsRequestedSimulationTest.resourceCapacity = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resFullyFree/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderNotAvail2ndMonth = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resNotAvail2ndMonth/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityNotAvail2ndMonth = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resNotAvail2ndMonth/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderNoAvail = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resNoAvail/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityNoAvail = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resNoAvail/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderOverbook = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resOverbooked/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityOverbook = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resOverbooked/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderShortVacation = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resShortVacations/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityShortVacation = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/resShortVacations/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderAvailabilityNotMaintained = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/resAvailabilityNotMaintainedForSomeDays/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityAvailabilityNotMaintained = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/resAvailabilityNotMaintainedForSomeDays/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderDailyDistribution = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/resFullyFreeDailyDistribution/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityDailyDistribution = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/resFullyFreeDailyDistribution/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    AsRequestedSimulationTest.resourceHeaderMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    AsRequestedSimulationTest.resourceCapacityMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    AsRequestedSimulationTest.costCenterMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');
    AsRequestedSimulationTest.jobDetailMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
    AsRequestedSimulationTest.workAssignmentMultiCostCenter = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    AsRequestedSimulationTest.workforcePerson = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    AsRequestedSimulationTest.organizationDetail = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    AsRequestedSimulationTest.organizationHeader = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
    AsRequestedSimulationTest.employeeHeader = await AsRequestedSimulationTest.uniquifier.getRecords('../data/input/dayWiseDistributionAssignmentAsRequested/multipleTimeSlices/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');

    await AsRequestedSimulationTest.resourceRequestRepository.insertMany(AsRequestedSimulationTest.resourceRequests);
    await AsRequestedSimulationTest.capacityRequirementRepository.insertMany(AsRequestedSimulationTest.capacityRequirement);

    await AsRequestedSimulationTest.resourceRequestRepository.insertMany(AsRequestedSimulationTest.resourceRequests1st3rdMonth);
    await AsRequestedSimulationTest.capacityRequirementRepository.insertMany(AsRequestedSimulationTest.capacityRequirement1st3rdMonth);

    await AsRequestedSimulationTest.resourceRequestRepository.insertMany(AsRequestedSimulationTest.resourceRequestsDailyDistribution);
    await AsRequestedSimulationTest.capacityRequirementRepository.insertMany(AsRequestedSimulationTest.capacityRequirementDailyDistribution);

    await AsRequestedSimulationTest.resourceRequestRepository.insertMany(AsRequestedSimulationTest.resourceRequestsWeeklyDistribution);
    await AsRequestedSimulationTest.capacityRequirementRepository.insertMany(AsRequestedSimulationTest.capacityRequirementWeeklyDistribution);

    await AsRequestedSimulationTest.resourceRequestRepository.insertMany(AsRequestedSimulationTest.resourceRequestsMultiCostCenter);
    await AsRequestedSimulationTest.capacityRequirementRepository.insertMany(AsRequestedSimulationTest.capacityRequirementMultiCostCenter);

    await AsRequestedSimulationTest.resourceTypesRepository.insertMany(AsRequestedSimulationTest.resourceTypes);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeader);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacity);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderNotAvail2ndMonth);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityNotAvail2ndMonth);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderNoAvail);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityNoAvail);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderOverbook);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityOverbook);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderShortVacation);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityShortVacation);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderDailyDistribution);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityDailyDistribution);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderAvailabilityNotMaintained);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityAvailabilityNotMaintained);

    await AsRequestedSimulationTest.resourceHeaderRepository.insertMany(AsRequestedSimulationTest.resourceHeaderMultiCostCenter);
    await AsRequestedSimulationTest.resourceCapacityRepository.insertMany(AsRequestedSimulationTest.resourceCapacityMultiCostCenter);

    await AsRequestedSimulationTest.costCenterRepository.insertMany(AsRequestedSimulationTest.costCenterMultiCostCenter);
    await AsRequestedSimulationTest.jobDetailRepository.insertMany(AsRequestedSimulationTest.jobDetailMultiCostCenter);
    await AsRequestedSimulationTest.workAssignmentRepository.insertMany(AsRequestedSimulationTest.workAssignmentMultiCostCenter);
    await AsRequestedSimulationTest.workforcePersonRepository.insertMany(AsRequestedSimulationTest.workforcePerson);
    await AsRequestedSimulationTest.organizationDetailRepository.insertMany(AsRequestedSimulationTest.organizationDetail);
    await AsRequestedSimulationTest.organizationHeaderRepository.insertMany(AsRequestedSimulationTest.organizationHeader);
    await AsRequestedSimulationTest.employeeHeaderRepository.insertMany(AsRequestedSimulationTest.employeeHeader);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets : Resource without assignments'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resFullyFree/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resFullyFree/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs} '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets : Resource not available for 2nd month'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderNotAvail2ndMonth[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resNotAvail2ndMonth/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resNotAvail2ndMonth/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets : Resource Availability not maintained'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderNoAvail[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets : Resource Overbooked'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderOverbook[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resOverbooked/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resOverbooked/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 3 monthly Buckets : Resource with short Vacations'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderShortVacation[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resShortVacations/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapMonth-resShortVacations/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 2 monthly buckets over 3 Months : Resource without assignments'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests1st3rdMonth[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCap1st3rdMonth-resFullyFree/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCap1st3rdMonth-resFullyFree/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 2 monthly buckets over 3 Months : Resource Availability not maintained'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderNoAvail[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests1st3rdMonth[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCap1st3rdMonth-resNoAvail/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCap1st3rdMonth-resNoAvail/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirements with 2 monthly buckets over 3 Months : Resource Overbooked'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderOverbook[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests1st3rdMonth[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCap1st3rdMonth-resOverbooked/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCap1st3rdMonth-resOverbooked/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirement with Daily buckets for a month: Resource Fully Free'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderDailyDistribution[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequestsDailyDistribution[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapDailyDistribution/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapDailyDistribution/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirement with Weekly Buckets for a month: Resource Fully Free'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderDailyDistribution[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequestsWeeklyDistribution[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapWeeklyDistribution/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapWeeklyDistribution/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirement with Weekly Bucket starting from Tuesday to Monday :Resource has 0 availability on Weekend'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderDailyDistribution[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequestsWeeklyDistribution[1].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    const expectedAssignmentHeader: Assignments[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapWeeklyWeekStartingTuesday/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    const expectedAssignmentBuckets: AssignmentBucket[] = await AsRequestedSimulationTest.uniquifier.getRecords('../data/expected/asRequested/reqCapWeeklyWeekStartingTuesday/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    assert.equal(assignmentService.data.resource_ID, expectedAssignmentHeader[0].resource_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.resourceRequest_ID, expectedAssignmentHeader[0].resourceRequest_ID, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.bookedCapacityInMinutes, expectedAssignmentHeader[0].bookedCapacityInMinutes, 'Incorrect Assignment Header Record');
    assert.equal(assignmentService.data.assignmentBuckets.length, expectedAssignmentBuckets.length, 'Incorrect number of buckets returned by as requested simulation');
    for (let i = 0; i < expectedAssignmentBuckets.length; i++) {
      assert.equal(assignmentService.data.assignmentBuckets[i].startTime.substring(0, 10), expectedAssignmentBuckets[i].startTime.substring(0, 10), "Incorrect Assignment Bucket StartTime");
      assert.equal(assignmentService.data.assignmentBuckets[i].bookedCapacityInMinutes, expectedAssignmentBuckets[i].bookedCapacityInMinutes, "Incorrect Assignment Bucket BookedCapacity");
      assert.equal(assignmentService.data.assignmentBuckets[i].assignment_ID, assignmentService.data.ID, "Incorrect Assignment Bucket Assignment_ID");
    }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Capacity Requirement with Daily Buckets for a month: Resource Availability Not Maintained for Some Days'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderAvailabilityNotMaintained[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequestsDailyDistribution[1].ID,
      mode: "I"
    };

    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);


    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;


    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource with Multiple Cost Centers with overlapping validity'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeaderMultiCostCenter[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequestsMultiCostCenter[0].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    delete assignmentService.data["@context"];
    const payloadForDraftCreation = assignmentService.data;
    const draftCreateActionResponseResMgr = await AsRequestedSimulationTest.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
    assert.equal(draftCreateActionResponseResMgr.status, 400, 'The assignment cant be created because the resource is assigned to multiple cost centers.');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignment can not be created against Capacity Requirement with StartDate > End Date'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[2].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Unpublished Request: Assignments can not be created for requests unless they are published'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[3].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'WrongRequestDate: Assignment can not be created when Request Start Date > Request End Date'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[4].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignment can not be created when Capacity Requirement Start Date < Resource Request Start Date'() {

    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[5].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;

    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignment can not be created when Capacity Requirement End Date > Resource Request End Date'() {
    const payload = {
      resourceId: AsRequestedSimulationTest.resourceHeader[0].ID,
      resourceRequestId: AsRequestedSimulationTest.resourceRequests[6].ID,
      mode: "I"
    };
    const assignmentService = await AsRequestedSimulationTest.assignmentServiceClient.post('/SimulateAssignmentAsRequested', payload);
    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs}, '${assignmentService.data.ID}'`;
    assert.equal(assignmentService.status, 400, 'Expected status code to be 400.');
    assert.isUndefined(assignmentService.data.assignmentBuckets, 'Expected no assignment buckets');
    assert.isUndefined(assignmentService.data.assignment, 'Expected no assignment header');
    assert.isNotNull(assignmentService.data.error, 'Expected error in response');
  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await AsRequestedSimulationTest.resourceRequestRepository.deleteMany(AsRequestedSimulationTest.resourceRequests);
    await AsRequestedSimulationTest.capacityRequirementRepository.deleteMany(AsRequestedSimulationTest.capacityRequirement);

    await AsRequestedSimulationTest.resourceRequestRepository.deleteMany(AsRequestedSimulationTest.resourceRequests1st3rdMonth);
    await AsRequestedSimulationTest.capacityRequirementRepository.deleteMany(AsRequestedSimulationTest.capacityRequirement1st3rdMonth);

    await AsRequestedSimulationTest.resourceRequestRepository.deleteMany(AsRequestedSimulationTest.resourceRequestsDailyDistribution);
    await AsRequestedSimulationTest.capacityRequirementRepository.deleteMany(AsRequestedSimulationTest.capacityRequirementDailyDistribution);

    await AsRequestedSimulationTest.resourceRequestRepository.deleteMany(AsRequestedSimulationTest.resourceRequestsWeeklyDistribution);
    await AsRequestedSimulationTest.capacityRequirementRepository.deleteMany(AsRequestedSimulationTest.capacityRequirementWeeklyDistribution);

    await AsRequestedSimulationTest.resourceRequestRepository.deleteMany(AsRequestedSimulationTest.resourceRequestsMultiCostCenter);
    await AsRequestedSimulationTest.capacityRequirementRepository.deleteMany(AsRequestedSimulationTest.capacityRequirementMultiCostCenter);

    await AsRequestedSimulationTest.resourceTypesRepository.deleteMany(AsRequestedSimulationTest.resourceTypes);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeader);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacity);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderNotAvail2ndMonth);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityNotAvail2ndMonth);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderNoAvail);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityNoAvail);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderOverbook);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityOverbook);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderShortVacation);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityShortVacation);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderDailyDistribution);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityDailyDistribution);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderAvailabilityNotMaintained);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityAvailabilityNotMaintained);

    await AsRequestedSimulationTest.resourceHeaderRepository.deleteMany(AsRequestedSimulationTest.resourceHeaderMultiCostCenter);
    await AsRequestedSimulationTest.resourceCapacityRepository.deleteMany(AsRequestedSimulationTest.resourceCapacityMultiCostCenter);

    await AsRequestedSimulationTest.jobDetailRepository.deleteMany(AsRequestedSimulationTest.jobDetailMultiCostCenter);
    await AsRequestedSimulationTest.costCenterRepository.deleteMany(AsRequestedSimulationTest.costCenterMultiCostCenter);
    await AsRequestedSimulationTest.workAssignmentRepository.deleteMany(AsRequestedSimulationTest.workAssignmentMultiCostCenter);
    await AsRequestedSimulationTest.workforcePersonRepository.deleteMany(AsRequestedSimulationTest.workforcePerson);
    await AsRequestedSimulationTest.organizationDetailRepository.deleteMany(AsRequestedSimulationTest.organizationDetail);
    await AsRequestedSimulationTest.organizationHeaderRepository.deleteMany(AsRequestedSimulationTest.organizationHeader);
    await AsRequestedSimulationTest.employeeHeaderRepository.deleteMany(AsRequestedSimulationTest.employeeHeader);

    AsRequestedSimulationTest.assignmentIDs = `${AsRequestedSimulationTest.assignmentIDs} )`;
    let sqlStatementString = AsRequestedSimulationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AsRequestedSimulationTest.assignmentIDs}`);
    await AsRequestedSimulationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
    sqlStatementString = AsRequestedSimulationTest.resourceRequestRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AsRequestedSimulationTest.assignmentIDs}`);
    await AsRequestedSimulationTest.resourceRequestRepository.statementExecutor.execute(sqlStatementString);
  }
}