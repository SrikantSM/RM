import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier, AssignmentsDetailsForCapacityGrid } from '../../utils';

import {
  EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
  WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  Email, EmailRepository, Phone, PhoneRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ProfileDetail, ProfileDetailRepository,
  OrganizationDetail, OrganizationDetailRepository, OrganizationHeader, OrganizationHeaderRepository,
  JobDetail, JobDetailRepository,
  CostCenterRepository, CostCenter, ResourceRequestRepository, ResourceRequest, DemandRepository, Demand, WorkPackage, WorkPackageRepository,
} from 'test-commons';

@suite
export class CapacityGridDailyAssignmentTest {
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
  private static organizationHeaderRepository: OrganizationHeaderRepository;
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
  private static organizationHeader: OrganizationHeader[];
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
    CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridDailyAssignmentTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridDailyAssignmentTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridDailyAssignmentTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridDailyAssignmentTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridDailyAssignmentTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridDailyAssignmentTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridDailyAssignmentTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridDailyAssignmentTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridDailyAssignmentTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    CapacityGridDailyAssignmentTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridDailyAssignmentTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridDailyAssignmentTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridDailyAssignmentTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridDailyAssignmentTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridDailyAssignmentTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    CapacityGridDailyAssignmentTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    CapacityGridDailyAssignmentTest.demandRepository = await testEnvironment.getDemandRepository();
    CapacityGridDailyAssignmentTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

    CapacityGridDailyAssignmentTest.uniquifier = new Uniquifier();
    CapacityGridDailyAssignmentTest.resourceHeader = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridDailyAssignmentTest.resourceCapacity = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridDailyAssignmentTest.assignment = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridDailyAssignmentTest.assignmentBuckets = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridDailyAssignmentTest.employeeHeader = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridDailyAssignmentTest.workAssignment = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridDailyAssignmentTest.workforcePerson = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    CapacityGridDailyAssignmentTest.organizationHeader = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    CapacityGridDailyAssignmentTest.organizationDetail = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridDailyAssignmentTest.jobDetail = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridDailyAssignmentTest.email = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridDailyAssignmentTest.phone = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridDailyAssignmentTest.workPlaceAddress = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridDailyAssignmentTest.profileDetail = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridDailyAssignmentTest.costCenter = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    CapacityGridDailyAssignmentTest.resourceRequests = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    CapacityGridDailyAssignmentTest.demand = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
    CapacityGridDailyAssignmentTest.workPackage = await CapacityGridDailyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridDailyAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

    CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1 = CapacityGridDailyAssignmentTest.resourceHeader[0].ID;
    CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2 = CapacityGridDailyAssignmentTest.resourceHeader[1].ID;
    CapacityGridDailyAssignmentTest.resourceWith2Assignments = CapacityGridDailyAssignmentTest.resourceHeader[2].ID;
    CapacityGridDailyAssignmentTest.resourceWithNoAssignment = CapacityGridDailyAssignmentTest.resourceHeader[3].ID;

    await CapacityGridDailyAssignmentTest.resourceRequestRepository.insertMany(CapacityGridDailyAssignmentTest.resourceRequests);
    await CapacityGridDailyAssignmentTest.demandRepository.insertMany(CapacityGridDailyAssignmentTest.demand);
    await CapacityGridDailyAssignmentTest.workPackageRepository.insertMany(CapacityGridDailyAssignmentTest.workPackage);

    await CapacityGridDailyAssignmentTest.resourceHeaderRepository.insertMany(CapacityGridDailyAssignmentTest.resourceHeader);
    await CapacityGridDailyAssignmentTest.resourceCapacityRepository.insertMany(CapacityGridDailyAssignmentTest.resourceCapacity)
    await CapacityGridDailyAssignmentTest.assignmentRepository.insertMany(CapacityGridDailyAssignmentTest.assignment);
    await CapacityGridDailyAssignmentTest.assignmentBucketRepository.insertMany(CapacityGridDailyAssignmentTest.assignmentBuckets)
    await CapacityGridDailyAssignmentTest.employeeHeaderRepository.insertMany(CapacityGridDailyAssignmentTest.employeeHeader);
    await CapacityGridDailyAssignmentTest.workAssignmentRepository.insertMany(CapacityGridDailyAssignmentTest.workAssignment)
    await CapacityGridDailyAssignmentTest.workforcePersonRepository.insertMany(CapacityGridDailyAssignmentTest.workforcePerson);
    await CapacityGridDailyAssignmentTest.organizationHeaderRepository.insertMany(CapacityGridDailyAssignmentTest.organizationHeader)
    await CapacityGridDailyAssignmentTest.organizationDetailRepository.insertMany(CapacityGridDailyAssignmentTest.organizationDetail);
    await CapacityGridDailyAssignmentTest.jobDetailRepository.insertMany(CapacityGridDailyAssignmentTest.jobDetail)
    await CapacityGridDailyAssignmentTest.emailRepository.insertMany(CapacityGridDailyAssignmentTest.email);
    await CapacityGridDailyAssignmentTest.phoneRepository.insertMany(CapacityGridDailyAssignmentTest.phone);
    await CapacityGridDailyAssignmentTest.workPlaceAddressRepository.insertMany(CapacityGridDailyAssignmentTest.workPlaceAddress);
    await CapacityGridDailyAssignmentTest.profileDetailsRepository.insertMany(CapacityGridDailyAssignmentTest.profileDetail);
    await CapacityGridDailyAssignmentTest.costCenterRepository.insertMany(CapacityGridDailyAssignmentTest.costCenter);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource with Multiple Assignments: All daily assignment buckets in the resource period are returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-10-03 and date ge 2021-10-01)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWith2Assignments + ' and requestStartDate le 2021-10-03 and requestEndDate ge 2021-10-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 2, "Not all assignment buckets returned for resource with multiple assignments");

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = assignmentsDetailsForCapacityGridResponse.data.value as AssignmentsDetailsForCapacityGrid[];

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = [
      {
        action: 0,
        assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
        resource_ID: CapacityGridDailyAssignmentTest.resourceWith2Assignments,
        resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[1].ID,
        costCenterID: 'CCDE',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-30',
        requestStartDate: '2020-11-01',
        requestEndDate: '2022-03-01',
        requestName: 'CapAsgDReq2',
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
        requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[1].displayId,
        dailyAssignments:
          [{
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
            timePeriod: '2021-10-01',
            date: '2021-10-01',
            bookedCapacityInHours: 7,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
            timePeriod: '2021-10-02',
            date: '2021-10-02',
            bookedCapacityInHours: 7,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
            timePeriod: '2021-10-03',
            date: '2021-10-03',
            bookedCapacityInHours: 7,
            action: 0
          }]
      },
      {
        action: 0,
        assignment_ID: CapacityGridDailyAssignmentTest.assignment[3].ID,
        resource_ID: CapacityGridDailyAssignmentTest.resourceWith2Assignments,
        resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[2].ID,
        costCenterID: 'CCDE',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-10-31',
        requestStartDate: '2020-11-01',
        requestEndDate: '2021-11-30',
        requestName: 'CapAsgDReq3',
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
        requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[2].displayId,
        dailyAssignments:
          [{
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[3].ID,
            timePeriod: '2021-10-01',
            date: '2021-10-01',
            bookedCapacityInHours: 6,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[3].ID,
            timePeriod: '2021-10-02',
            date: '2021-10-02',
            bookedCapacityInHours: 6,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[3].ID,
            timePeriod: '2021-10-03',
            date: '2021-10-03',
            bookedCapacityInHours: 6,
            action: 0
          }]
      }
    ];

    expectedAssignmentDetails.forEach(header => {
      header.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    actualAssignmentDetails.forEach(header => {
      header.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    expectedAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    actualAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Daily assignment buckets for multiple resources are correctly returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-10-03 and date ge 2021-10-01)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1 + ' or resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2021-10-03 and requestEndDate ge 2021-10-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 2, "Expected number of assignments not returned");

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = assignmentsDetailsForCapacityGridResponse.data.value as AssignmentsDetailsForCapacityGrid[];

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = [
      {
        action: 0,
        assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
        resource_ID: CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1,
        resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[0].ID,
        costCenterID: 'CCDE',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-31',
        requestStartDate: '2021-07-01',
        requestEndDate: '2022-02-01',
        requestName: 'CapAsgDReq1',
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
        requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[0].displayId,
        dailyAssignments:
          [{
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
            timePeriod: '2021-10-01',
            date: '2021-10-01',
            bookedCapacityInHours: 6,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
            timePeriod: '2021-10-02',
            date: '2021-10-02',
            bookedCapacityInHours: 6,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
            timePeriod: '2021-10-03',
            date: '2021-10-03',
            bookedCapacityInHours: 6,
            action: 0
          }]
      },
      {
        action: 0,
        assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
        resource_ID: CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2,
        resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[1].ID,
        costCenterID: 'CCIN',
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-31',
        requestStartDate: '2020-11-01',
        requestEndDate: '2022-03-01',
        requestName: 'CapAsgDReq2',
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
        requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[1].displayId,
        dailyAssignments:
          [{
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
            timePeriod: '2021-10-01',
            date: '2021-10-01',
            bookedCapacityInHours: 6,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
            timePeriod: '2021-10-02',
            date: '2021-10-02',
            bookedCapacityInHours: 6,
            action: 0
          },
          {
            assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
            timePeriod: '2021-10-03',
            date: '2021-10-03',
            bookedCapacityInHours: 6,
            action: 0
          }]
      }
    ];

    expectedAssignmentDetails.forEach(header => {
      header.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    actualAssignmentDetails.forEach(header => {
      header.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    expectedAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    actualAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource with Multiple Assignments: Only assignment buckets with corresponding request intersecting with selected resource period should be returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-11-06 and date ge 2021-11-04)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWith2Assignments + ' and requestStartDate le 2021-11-06 and requestEndDate ge 2021-12-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned for resource with multiple assignments but only a few intersecting with the selected resource period");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
      resource_ID: CapacityGridDailyAssignmentTest.resourceWith2Assignments,
      resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[1].ID,
      costCenterID: 'CCDE',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-30',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-03-01',
      requestName: 'CapAsgDReq2',
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
      requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[1].displayId,
      dailyAssignments:
        [{
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
          timePeriod: '2021-11-04',
          date: '2021-11-04',
          bookedCapacityInHours: 5,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
          timePeriod: '2021-11-05',
          date: '2021-11-05',
          bookedCapacityInHours: 5,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[2].ID,
          timePeriod: '2021-11-06',
          date: '2021-11-06',
          bookedCapacityInHours: 5,
          action: 0
        }]
    };


    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Daily assignment buckets with 0 booked capacity hours should be returned for missing assignment buckets within request period intersecting with selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-10-01 and date ge 2021-09-29)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2021-10-01 and requestEndDate ge 2021-09-29');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
      resource_ID: CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2,
      resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[1].ID,
      costCenterID: 'CCIN',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-03-01',
      requestName: 'CapAsgDReq2',
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
      requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[1].displayId,
      dailyAssignments:
        [{
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
          timePeriod: '2021-09-29',
          date: '2021-09-29',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
          timePeriod: '2021-09-30',
          date: '2021-09-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
          timePeriod: '2021-10-01',
          date: '2021-10-01',
          bookedCapacityInHours: 6,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Daily assignment buckets with 0 booked capacity should be returned for missing assignment buckets within assignment period intersecting with selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-10-07 and date ge 2021-10-04)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2021-10-07 and requestEndDate ge 2021-10-04');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[0].ID,
      costCenterID: 'CCDE',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-02-01',
      requestName: 'CapAsgDReq1',
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
      requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[0].displayId,
      dailyAssignments:
        [{
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
          timePeriod: '2021-10-04',
          date: '2021-10-04',
          bookedCapacityInHours: 6,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
          timePeriod: '2021-10-05',
          date: '2021-10-05',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
          timePeriod: '2021-10-06',
          date: '2021-10-06',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
          timePeriod: '2021-10-07',
          date: '2021-10-07',
          bookedCapacityInHours: 6,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'No daily assignment buckets records should be returned outside the request period of corresponding assignment'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-07-01 and date ge 2021-06-01)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2021-07-01 and requestEndDate ge 2021-06-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[0].ID,
      costCenterID: 'CCDE',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-02-01',
      requestName: 'CapAsgDReq1',
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
      requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[0].displayId,
      dailyAssignments:
        [{
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[0].ID,
          timePeriod: '2021-07-01',
          date: '2021-07-01',
          bookedCapacityInHours: 0,
          action: 0
        }]
    }

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignment buckets for resource with multiple timeslice(job details) in the selected resource period should be correctly returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2021-10-03 and date ge 2021-10-01)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2021-10-03 and requestEndDate ge 2021-10-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignment not returned for resource with multiple job details in selected period");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
      resource_ID: CapacityGridDailyAssignmentTest.resourceWithOneAssignment_2,
      resourceRequest_ID: CapacityGridDailyAssignmentTest.resourceRequests[1].ID,
      costCenterID: 'CCIN',
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-03-01',
      requestName: 'CapAsgDReq2',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 848,
      workItemName: null,
      assignmentDurationInHours: 424,
      requestedCapacityInHours: 100,
      remainingRequestedCapacityInHours: -748,
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
      requestDisplayId: CapacityGridDailyAssignmentTest.resourceRequests[1].displayId,
      isAssignmentEditable: true,
      resourceOrgCode: null,
      dailyAssignments:
        [{
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
          timePeriod: '2021-10-01',
          date: '2021-10-01',
          bookedCapacityInHours: 6,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
          timePeriod: '2021-10-02',
          date: '2021-10-02',
          bookedCapacityInHours: 6,
          action: 0
        },
        {
          assignment_ID: CapacityGridDailyAssignmentTest.assignment[1].ID,
          timePeriod: '2021-10-03',
          date: '2021-10-03',
          bookedCapacityInHours: 6,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.dailyAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(expectedAssignmentDetails, actualAssignmentDetails, "Assignment header details and daily assignment values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Daily assignment buckets should not be returned for resource that has no assignment'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2022-03-31 and date ge 2021-01-01)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithNoAssignment + ' and requestStartDate le 2022-03-31 and requestEndDate ge 2021-01-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 0, "Assignments returned for resource with no assignments");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Daily assignment buckets should not be returned for resource with assignments but the requests for which are outside selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridDailyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=dailyAssignments($filter=date le 2022-05-31 and date ge 2022-04-01)&$filter=resource_ID eq ' + CapacityGridDailyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2022-05-31 and requestEndDate ge 2022-04-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 0, "Assignments for which the corresponding request period lies outside selected resource period is returned");

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridDailyAssignmentTest.resourceHeaderRepository.deleteMany(CapacityGridDailyAssignmentTest.resourceHeader);
    await CapacityGridDailyAssignmentTest.resourceCapacityRepository.deleteMany(CapacityGridDailyAssignmentTest.resourceCapacity);

    await CapacityGridDailyAssignmentTest.assignmentRepository.deleteMany(CapacityGridDailyAssignmentTest.assignment);
    await CapacityGridDailyAssignmentTest.assignmentBucketRepository.deleteMany(CapacityGridDailyAssignmentTest.assignmentBuckets);

    await CapacityGridDailyAssignmentTest.employeeHeaderRepository.deleteMany(CapacityGridDailyAssignmentTest.employeeHeader);
    await CapacityGridDailyAssignmentTest.workAssignmentRepository.deleteMany(CapacityGridDailyAssignmentTest.workAssignment);

    await CapacityGridDailyAssignmentTest.workforcePersonRepository.deleteMany(CapacityGridDailyAssignmentTest.workforcePerson);
    await CapacityGridDailyAssignmentTest.organizationHeaderRepository.deleteMany(CapacityGridDailyAssignmentTest.organizationHeader);

    await CapacityGridDailyAssignmentTest.organizationDetailRepository.deleteMany(CapacityGridDailyAssignmentTest.organizationDetail);
    await CapacityGridDailyAssignmentTest.jobDetailRepository.deleteMany(CapacityGridDailyAssignmentTest.jobDetail);

    await CapacityGridDailyAssignmentTest.emailRepository.deleteMany(CapacityGridDailyAssignmentTest.email);
    await CapacityGridDailyAssignmentTest.phoneRepository.deleteMany(CapacityGridDailyAssignmentTest.phone);
    await CapacityGridDailyAssignmentTest.workPlaceAddressRepository.deleteMany(CapacityGridDailyAssignmentTest.workPlaceAddress);
    await CapacityGridDailyAssignmentTest.profileDetailsRepository.deleteMany(CapacityGridDailyAssignmentTest.profileDetail);
    await CapacityGridDailyAssignmentTest.costCenterRepository.deleteMany(CapacityGridDailyAssignmentTest.costCenter);

    await CapacityGridDailyAssignmentTest.resourceRequestRepository.deleteMany(CapacityGridDailyAssignmentTest.resourceRequests);
    await CapacityGridDailyAssignmentTest.demandRepository.deleteMany(CapacityGridDailyAssignmentTest.demand);
    await CapacityGridDailyAssignmentTest.workPackageRepository.deleteMany(CapacityGridDailyAssignmentTest.workPackage);

  }

}