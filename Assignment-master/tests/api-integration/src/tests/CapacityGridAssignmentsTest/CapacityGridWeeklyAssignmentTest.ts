import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier, AssignmentsDetailsForCapacityGrid } from '../../utils';

import {
  EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
  WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  Email, EmailRepository, Phone, PhoneRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ProfileDetail, ProfileDetailRepository,
  OrganizationDetail, OrganizationDetailRepository, 
  JobDetail, JobDetailRepository,
  CostCenterRepository, CostCenter, ResourceRequestRepository, ResourceRequest, DemandRepository, Demand, WorkPackage, WorkPackageRepository,
} from 'test-commons';

@suite
export class CapacityGridWeeklyAssignmentTest {
  private static capacityServiceClientForResMgr: AxiosInstance;

  private static uniquifier: Uniquifier;

  private static resourceRequestRepository: ResourceRequestRepository;
  private static demandRepository: DemandRepository;
  private static workPackageRepository: WorkPackageRepository;

  private static resourceHeaderRepository: ResourceHeaderRepository;
  private static resourceCapacityRepository: ResourceCapacityRepository;
  private static assignmentRepository: AssignmentsRepository;
  private static assignmentBucketRepository: AssignmentBucketRepository;
  private static employeeHeaderRepository: EmployeeHeaderRepository;
  private static workAssignmentRepository: WorkAssignmentRepository;
  private static workforcePersonRepository: WorkforcePersonRepository;
  private static organizationDetailRepository: OrganizationDetailRepository;
  private static jobDetailRepository: JobDetailRepository;
  private static costCenterRepository: CostCenterRepository;
  private static resourceHeader: ResourceHeader[];
  private static resourceCapacity: ResourceCapacity[];

  private static resourceRequests: ResourceRequest[];
  private static demand: Demand[];
  private static workPackage: WorkPackage[];

  private static assignment: Assignments[];
  private static assignmentBuckets: AssignmentBucket[];

  private static employeeHeader: EmployeeHeader[];
  private static workAssignment: WorkAssignment[];
  private static workforcePerson: WorkforcePerson[];

  private static organizationDetail: OrganizationDetail[];
  private static jobDetail: JobDetail[];

  private static emailRepository: EmailRepository;
  private static phoneRepository: PhoneRepository;
  private static workPlaceAddressRepository: WorkPlaceAddressRepository;
  private static profileDetailsRepository: ProfileDetailRepository;
  private static costCenter: CostCenter[];
  private static email: Email[];
  private static phone: Phone[];
  private static workPlaceAddress: WorkPlaceAddress[];
  private static profileDetail: ProfileDetail[];

  private static resourceWith2Assignments: string;
  private static resourceWithNoAssignment: string;
  private static resourceWithOneAssignment_1: string;
  private static resourceWithOneAssignment_2: string;

  @timeout(TEST_TIMEOUT)
  static async before() {
    CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridWeeklyAssignmentTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridWeeklyAssignmentTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridWeeklyAssignmentTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridWeeklyAssignmentTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridWeeklyAssignmentTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridWeeklyAssignmentTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridWeeklyAssignmentTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridWeeklyAssignmentTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridWeeklyAssignmentTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridWeeklyAssignmentTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridWeeklyAssignmentTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridWeeklyAssignmentTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridWeeklyAssignmentTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridWeeklyAssignmentTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    CapacityGridWeeklyAssignmentTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    CapacityGridWeeklyAssignmentTest.demandRepository = await testEnvironment.getDemandRepository();
    CapacityGridWeeklyAssignmentTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

    CapacityGridWeeklyAssignmentTest.uniquifier = new Uniquifier();
    CapacityGridWeeklyAssignmentTest.resourceHeader = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridWeeklyAssignmentTest.resourceCapacity = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridWeeklyAssignmentTest.assignment = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridWeeklyAssignmentTest.assignmentBuckets = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridWeeklyAssignmentTest.employeeHeader = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridWeeklyAssignmentTest.workAssignment = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridWeeklyAssignmentTest.workforcePerson = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    
    CapacityGridWeeklyAssignmentTest.organizationDetail = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridWeeklyAssignmentTest.jobDetail = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridWeeklyAssignmentTest.email = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridWeeklyAssignmentTest.phone = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridWeeklyAssignmentTest.workPlaceAddress = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridWeeklyAssignmentTest.profileDetail = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridWeeklyAssignmentTest.costCenter = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    CapacityGridWeeklyAssignmentTest.resourceRequests = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    CapacityGridWeeklyAssignmentTest.demand = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
    CapacityGridWeeklyAssignmentTest.workPackage = await CapacityGridWeeklyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridWeeklyAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

    CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1 = CapacityGridWeeklyAssignmentTest.resourceHeader[0].ID;
    CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2 = CapacityGridWeeklyAssignmentTest.resourceHeader[1].ID;
    CapacityGridWeeklyAssignmentTest.resourceWith2Assignments = CapacityGridWeeklyAssignmentTest.resourceHeader[2].ID;
    CapacityGridWeeklyAssignmentTest.resourceWithNoAssignment = CapacityGridWeeklyAssignmentTest.resourceHeader[3].ID;

    await CapacityGridWeeklyAssignmentTest.resourceRequestRepository.insertMany(CapacityGridWeeklyAssignmentTest.resourceRequests);
    await CapacityGridWeeklyAssignmentTest.demandRepository.insertMany(CapacityGridWeeklyAssignmentTest.demand);
    await CapacityGridWeeklyAssignmentTest.workPackageRepository.insertMany(CapacityGridWeeklyAssignmentTest.workPackage);

    await CapacityGridWeeklyAssignmentTest.resourceHeaderRepository.insertMany(CapacityGridWeeklyAssignmentTest.resourceHeader);
    await CapacityGridWeeklyAssignmentTest.resourceCapacityRepository.insertMany(CapacityGridWeeklyAssignmentTest.resourceCapacity)
    await CapacityGridWeeklyAssignmentTest.assignmentRepository.insertMany(CapacityGridWeeklyAssignmentTest.assignment);
    await CapacityGridWeeklyAssignmentTest.assignmentBucketRepository.insertMany(CapacityGridWeeklyAssignmentTest.assignmentBuckets)
    await CapacityGridWeeklyAssignmentTest.employeeHeaderRepository.insertMany(CapacityGridWeeklyAssignmentTest.employeeHeader);
    await CapacityGridWeeklyAssignmentTest.workAssignmentRepository.insertMany(CapacityGridWeeklyAssignmentTest.workAssignment)
    await CapacityGridWeeklyAssignmentTest.workforcePersonRepository.insertMany(CapacityGridWeeklyAssignmentTest.workforcePerson);
    await CapacityGridWeeklyAssignmentTest.organizationDetailRepository.insertMany(CapacityGridWeeklyAssignmentTest.organizationDetail);
    await CapacityGridWeeklyAssignmentTest.jobDetailRepository.insertMany(CapacityGridWeeklyAssignmentTest.jobDetail)
    await CapacityGridWeeklyAssignmentTest.emailRepository.insertMany(CapacityGridWeeklyAssignmentTest.email);
    await CapacityGridWeeklyAssignmentTest.phoneRepository.insertMany(CapacityGridWeeklyAssignmentTest.phone);
    await CapacityGridWeeklyAssignmentTest.workPlaceAddressRepository.insertMany(CapacityGridWeeklyAssignmentTest.workPlaceAddress);
    await CapacityGridWeeklyAssignmentTest.profileDetailsRepository.insertMany(CapacityGridWeeklyAssignmentTest.profileDetail);
    await CapacityGridWeeklyAssignmentTest.costCenterRepository.insertMany(CapacityGridWeeklyAssignmentTest.costCenter);

  }

  @test(timeout(TEST_TIMEOUT))
  async '1. Resource with Multiple Assignments: All daily assignment buckets in the resource period are returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2021-10-10 and endDate ge 2021-10-04)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWith2Assignments + ' and requestStartDate le 2021-10-10 and requestEndDate ge 2021-10-04');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 2, "Not all assignment buckets returned for resource with multiple assignments");

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = assignmentsDetailsForCapacityGridResponse.data.value as AssignmentsDetailsForCapacityGrid[];

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = [
      {
        action: 0,
        assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[2].ID,
        resource_ID: CapacityGridWeeklyAssignmentTest.resourceWith2Assignments,
        resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[1].ID,
        costCenterID: 'CCDE',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-30',
        requestStartDate: '2020-11-01',
        requestEndDate: '2022-03-01',
        requestName: 'CapAsgWReq2',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 848,
        workItemName: null,
        assignmentDurationInHours: 424,
        requestedCapacityInHours: 100,
        remainingRequestedCapacityInHours: -748,
        isAssignmentEditable: true,
        resourceOrgCode: null,
        projectId: null,
        customerId: null,
        customerName: null,
        projectRoleName: null,
        referenceAssignment: null,
        referenceObjectId: null,
        referenceObjectName: null,
        referenceObjectTypeCode: null,
        referenceObjectTypeName: null,
        requestStatusCode: 0,
        requestStatusDescription: "Open",
        requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[1].displayId,
        weeklyAggregatedAssignments:
          [{
            assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[2].ID,
            timePeriod: '202140',
            startDate: '2021-10-04',
            endDate: '2021-10-10',
            bookedCapacityInHours: 21,
            action: 0
          }]
      },
      {
        action: 0,
        assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[3].ID,
        resource_ID: CapacityGridWeeklyAssignmentTest.resourceWith2Assignments,
        resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[2].ID,
        costCenterID: 'CCDE',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-10-31',
        requestStartDate: '2020-11-01',
        requestEndDate: '2021-11-30',
        requestName: 'CapAsgWReq3',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 100,
        workItemName: null,
        assignmentDurationInHours: 100,
        requestedCapacityInHours: 100,
        remainingRequestedCapacityInHours: 0,
        isAssignmentEditable: true,
        resourceOrgCode: null,
        projectId: null,
        customerId: null,
        customerName: null,
        projectRoleName: null,
        referenceAssignment: null,
        referenceObjectId: null,
        referenceObjectName: null,
        referenceObjectTypeCode: null,
        referenceObjectTypeName: null,
        requestStatusCode: 0,
        requestStatusDescription: "Open",
        requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[2].displayId,
        weeklyAggregatedAssignments:
          [{
            assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[3].ID,
            timePeriod: '202140',
            startDate: '2021-10-04',
            endDate: '2021-10-10',
            bookedCapacityInHours: 17,
            action: 0
          }]
      }
    ];

    expectedAssignmentDetails.forEach(header => {
      header.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    actualAssignmentDetails.forEach(header => {
      header.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    expectedAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    actualAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '2. Weekly assignment buckets for multiple resources are correctly returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2021-10-10 and endDate ge 2021-10-04)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1 + ' or resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2021-10-10 and requestEndDate ge 2021-10-04');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 2, "Expected number of assignments not returned");

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = assignmentsDetailsForCapacityGridResponse.data.value as AssignmentsDetailsForCapacityGrid[];

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = [
      {
        action: 0,
        assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[0].ID,
        resource_ID: CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1,
        resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[0].ID,
        costCenterID: 'CCDE',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-31',
        requestStartDate: '2021-07-01',
        requestEndDate: '2022-02-01',
        requestName: 'CapAsgWReq1',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 200,
        workItemName: null,
        assignmentDurationInHours: 200,
        requestedCapacityInHours: 1000,
        remainingRequestedCapacityInHours: 800,
        isAssignmentEditable: true,
        resourceOrgCode: null,
        projectId: null,
        customerId: null,
        customerName: null,
        projectRoleName: null,
        referenceAssignment: null,
        referenceObjectId: null,
        referenceObjectName: null,
        referenceObjectTypeCode: null,
        referenceObjectTypeName: null,
        requestStatusCode: 0,
        requestStatusDescription: "Open",
        requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[0].displayId,
        weeklyAggregatedAssignments:
          [{
            assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[0].ID,
            timePeriod: '202140',
            startDate: '2021-10-04',
            endDate: '2021-10-10',
            bookedCapacityInHours: 27,
            action: 0
          }]
      },
      {
        action: 0,
        assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[1].ID,
        resource_ID: CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2,
        resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[1].ID,
        costCenterID: 'CCIN',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-31',
        requestStartDate: '2020-11-01',
        requestEndDate: '2022-03-01',
        requestName: 'CapAsgWReq2',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 848,
        workItemName: null,
        assignmentDurationInHours: 424,
        requestedCapacityInHours: 100,
        remainingRequestedCapacityInHours: -748,
        isAssignmentEditable: true,
        resourceOrgCode: null,
        projectId: null,
        customerId: null,
        customerName: null,
        projectRoleName: null,
        referenceAssignment: null,
        referenceObjectId: null,
        referenceObjectName: null,
        referenceObjectTypeCode: null,
        referenceObjectTypeName: null,
        requestStatusCode: 0,
        requestStatusDescription: "Open",
        requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[1].displayId,
        weeklyAggregatedAssignments:
          [{
            assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[1].ID,
            timePeriod: '202140',
            startDate: '2021-10-04',
            endDate: '2021-10-10',
            bookedCapacityInHours: 27,
            action: 0
          }]
      }
    ];

    expectedAssignmentDetails.forEach(header => {
      header.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    actualAssignmentDetails.forEach(header => {
      header.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    expectedAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    actualAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '3. Resource with Multiple Assignments: Only assignment buckets with corresponding request intersecting with selected resource period should be returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2021-12-19 and endDate ge 2021-12-13)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWith2Assignments + ' and requestStartDate le 2021-12-19 and requestEndDate ge 2021-12-13');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned for resource with multiple assignments but only a few intersecting with the selected resource period");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[2].ID,
      resource_ID: CapacityGridWeeklyAssignmentTest.resourceWith2Assignments,
      resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[1].ID,
      costCenterID: 'CCDE',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-30',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-03-01',
      requestName: 'CapAsgWReq2',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 848,
      workItemName: null,
      assignmentDurationInHours: 424,
      requestedCapacityInHours: 100,
      remainingRequestedCapacityInHours: -748,
      isAssignmentEditable: true,
      resourceOrgCode: null,
      projectId: null,
      customerId: null,
      customerName: null,
      projectRoleName: null,
      referenceAssignment: null,
      referenceObjectId: null,
      referenceObjectName: null,
      referenceObjectTypeCode: null,
      referenceObjectTypeName: null,
      requestStatusCode: 0,
      requestStatusDescription: "Open",
      requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[1].displayId,
      weeklyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[2].ID,
          timePeriod: '202150',
          startDate: '2021-12-13',
          endDate: '2021-12-19',
          bookedCapacityInHours: 14,
          action: 0
        }]
    };


    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '4. Weekly assignment buckets with 0 booked capacity hours should be returned for missing assignment buckets within request period intersecting with selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2022-01-09 and endDate ge 2022-01-03)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2022-01-09 and requestEndDate ge 2022-01-03');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[1].ID,
      resource_ID: CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2,
      resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[1].ID,
      costCenterID: 'CCIN',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-03-01',
      requestName: 'CapAsgWReq2',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 848,
      workItemName: null,
      assignmentDurationInHours: 424,
      requestedCapacityInHours: 100,
      remainingRequestedCapacityInHours: -748,
      isAssignmentEditable: true,
      resourceOrgCode: null,
      projectId: null,
      customerId: null,
      customerName: null,
      projectRoleName: null,
      referenceAssignment: null,
      referenceObjectId: null,
      referenceObjectName: null,
      referenceObjectTypeCode: null,
      referenceObjectTypeName: null,
      requestStatusCode: 0,
      requestStatusDescription: "Open",
      requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[1].displayId,
      weeklyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[1].ID,
          timePeriod: '202201',
          startDate: '2022-01-03',
          endDate: '2022-01-09',
          bookedCapacityInHours: 0,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '5. Weekly assignment buckets with 0 booked capacity should be returned for missing assignment buckets within assignment period intersecting with selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2021-10-10 and endDate ge 2021-10-04)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2021-10-10 and requestEndDate ge 2021-10-04');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[0].ID,
      costCenterID: 'CCDE',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-02-01',
      requestName: 'CapAsgWReq1',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 200,
      workItemName: null,
      assignmentDurationInHours: 200,
      requestedCapacityInHours: 1000,
      remainingRequestedCapacityInHours: 800,
      isAssignmentEditable: true,
      resourceOrgCode: null,
      projectId: null,
      customerId: null,
      customerName: null,
      projectRoleName: null,
      referenceAssignment: null,
      referenceObjectId: null,
      referenceObjectName: null,
      referenceObjectTypeCode: null,
      referenceObjectTypeName: null,
      requestStatusCode: 0,
      requestStatusDescription: "Open",
      requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[0].displayId,
      weeklyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[0].ID,
          timePeriod: '202140',
          startDate: '2021-10-04',
          endDate: '2021-10-10',
          bookedCapacityInHours: 27,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '6. No assignment buckets records should be returned outside the request period of corresponding assignment'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2021-07-04 and endDate ge 2021-06-21)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2021-07-04 and requestEndDate ge 2021-06-21');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[0].ID,
      costCenterID: 'CCDE',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-02-01',
      requestName: 'CapAsgWReq1',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 200,
      workItemName: null,
      assignmentDurationInHours: 200,
      requestedCapacityInHours: 1000,
      remainingRequestedCapacityInHours: 800,
      isAssignmentEditable: true,
      resourceOrgCode: null,
      projectId: null,
      customerId: null,
      customerName: null,
      projectRoleName: null,
      referenceAssignment: null,
      referenceObjectId: null,
      referenceObjectName: null,
      referenceObjectTypeCode: null,
      referenceObjectTypeName: null,
      requestStatusCode: 0,
      requestStatusDescription: "Open",
      requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[0].displayId,
      weeklyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[0].ID,
          timePeriod: '202126',
          startDate: '2021-07-01',
          endDate: '2021-07-04',
          bookedCapacityInHours: 0,
          action: 0
        }]
    }

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '7. Assignment buckets for resource with multiple timeslice(job details) in the selected resource period should be correctly returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2021-10-10 and endDate ge 2021-10-04)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2021-10-10 and requestEndDate ge 2021-10-04');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignment not returned for resource with multiple job details in selected period");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[1].ID,
      resource_ID: CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_2,
      resourceRequest_ID: CapacityGridWeeklyAssignmentTest.resourceRequests[1].ID,
      costCenterID: 'CCIN',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-03-01',
      requestName: 'CapAsgWReq2',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 848,
      workItemName: null,
      assignmentDurationInHours: 424,
      requestedCapacityInHours: 100,
      remainingRequestedCapacityInHours: -748,
      isAssignmentEditable: true,
      resourceOrgCode: null,
      projectId: null,
      customerId: null,
      customerName: null,
      projectRoleName: null,
      referenceAssignment: null,
      referenceObjectId: null,
      referenceObjectName: null,
      referenceObjectTypeCode: null,
      referenceObjectTypeName: null,
      requestStatusCode: 0,
      requestStatusDescription: "Open",
      requestDisplayId: CapacityGridWeeklyAssignmentTest.resourceRequests[1].displayId,
      weeklyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridWeeklyAssignmentTest.assignment[1].ID,
          timePeriod: '202140',
          startDate: '2021-10-04',
          endDate: '2021-10-10',
          bookedCapacityInHours: 27,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.weeklyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async '8. Weekly assignment buckets should not be returned for resource that has no assignment'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2022-03-31 and endDate ge 2021-01-01)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithNoAssignment + ' and requestStartDate le 2022-03-31 and requestEndDate ge 2021-01-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 0, "Assignments returned for resource with no assignments");

  }

  @test(timeout(TEST_TIMEOUT))
  async '9. Weekly assignment buckets should not be returned for resource with assignments but the requests for which are outside selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridWeeklyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=weeklyAggregatedAssignments($filter=startDate le 2022-05-31 and endDate ge 2022-04-01)&$filter=resource_ID eq ' + CapacityGridWeeklyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2022-05-31 and requestEndDate ge 2022-04-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 0, "Assignments for which the corresponding request period lies outside selected resource period is returned");

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridWeeklyAssignmentTest.resourceHeaderRepository.deleteMany(CapacityGridWeeklyAssignmentTest.resourceHeader);
    await CapacityGridWeeklyAssignmentTest.resourceCapacityRepository.deleteMany(CapacityGridWeeklyAssignmentTest.resourceCapacity);

    await CapacityGridWeeklyAssignmentTest.assignmentRepository.deleteMany(CapacityGridWeeklyAssignmentTest.assignment);
    await CapacityGridWeeklyAssignmentTest.assignmentBucketRepository.deleteMany(CapacityGridWeeklyAssignmentTest.assignmentBuckets);

    await CapacityGridWeeklyAssignmentTest.employeeHeaderRepository.deleteMany(CapacityGridWeeklyAssignmentTest.employeeHeader);
    await CapacityGridWeeklyAssignmentTest.workAssignmentRepository.deleteMany(CapacityGridWeeklyAssignmentTest.workAssignment);

    await CapacityGridWeeklyAssignmentTest.workforcePersonRepository.deleteMany(CapacityGridWeeklyAssignmentTest.workforcePerson);
    
    await CapacityGridWeeklyAssignmentTest.organizationDetailRepository.deleteMany(CapacityGridWeeklyAssignmentTest.organizationDetail);
    await CapacityGridWeeklyAssignmentTest.jobDetailRepository.deleteMany(CapacityGridWeeklyAssignmentTest.jobDetail);

    await CapacityGridWeeklyAssignmentTest.emailRepository.deleteMany(CapacityGridWeeklyAssignmentTest.email);
    await CapacityGridWeeklyAssignmentTest.phoneRepository.deleteMany(CapacityGridWeeklyAssignmentTest.phone);
    await CapacityGridWeeklyAssignmentTest.workPlaceAddressRepository.deleteMany(CapacityGridWeeklyAssignmentTest.workPlaceAddress);
    await CapacityGridWeeklyAssignmentTest.profileDetailsRepository.deleteMany(CapacityGridWeeklyAssignmentTest.profileDetail);
    await CapacityGridWeeklyAssignmentTest.costCenterRepository.deleteMany(CapacityGridWeeklyAssignmentTest.costCenter);

    await CapacityGridWeeklyAssignmentTest.resourceRequestRepository.deleteMany(CapacityGridWeeklyAssignmentTest.resourceRequests);
    await CapacityGridWeeklyAssignmentTest.demandRepository.deleteMany(CapacityGridWeeklyAssignmentTest.demand);
    await CapacityGridWeeklyAssignmentTest.workPackageRepository.deleteMany(CapacityGridWeeklyAssignmentTest.workPackage);

  }

}