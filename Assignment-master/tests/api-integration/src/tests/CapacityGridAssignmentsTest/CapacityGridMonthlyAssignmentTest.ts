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
export class CapacityGridMonthlyAssignmentTest {
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
    CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridMonthlyAssignmentTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridMonthlyAssignmentTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridMonthlyAssignmentTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridMonthlyAssignmentTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridMonthlyAssignmentTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridMonthlyAssignmentTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridMonthlyAssignmentTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridMonthlyAssignmentTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridMonthlyAssignmentTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    CapacityGridMonthlyAssignmentTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridMonthlyAssignmentTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridMonthlyAssignmentTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridMonthlyAssignmentTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridMonthlyAssignmentTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridMonthlyAssignmentTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    CapacityGridMonthlyAssignmentTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    CapacityGridMonthlyAssignmentTest.demandRepository = await testEnvironment.getDemandRepository();
    CapacityGridMonthlyAssignmentTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

    CapacityGridMonthlyAssignmentTest.uniquifier = new Uniquifier();
    CapacityGridMonthlyAssignmentTest.resourceHeader = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridMonthlyAssignmentTest.resourceCapacity = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridMonthlyAssignmentTest.assignment = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridMonthlyAssignmentTest.assignmentBuckets = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridMonthlyAssignmentTest.employeeHeader = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridMonthlyAssignmentTest.workAssignment = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridMonthlyAssignmentTest.workforcePerson = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    CapacityGridMonthlyAssignmentTest.organizationHeader = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    CapacityGridMonthlyAssignmentTest.organizationDetail = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridMonthlyAssignmentTest.jobDetail = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridMonthlyAssignmentTest.email = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridMonthlyAssignmentTest.phone = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridMonthlyAssignmentTest.workPlaceAddress = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridMonthlyAssignmentTest.profileDetail = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridMonthlyAssignmentTest.costCenter = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    CapacityGridMonthlyAssignmentTest.resourceRequests = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    CapacityGridMonthlyAssignmentTest.demand = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
    CapacityGridMonthlyAssignmentTest.workPackage = await CapacityGridMonthlyAssignmentTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

    CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1 = CapacityGridMonthlyAssignmentTest.resourceHeader[0].ID;
    CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_2 = CapacityGridMonthlyAssignmentTest.resourceHeader[1].ID;
    CapacityGridMonthlyAssignmentTest.resourceWith2Assignments = CapacityGridMonthlyAssignmentTest.resourceHeader[2].ID;
    CapacityGridMonthlyAssignmentTest.resourceWithNoAssignment = CapacityGridMonthlyAssignmentTest.resourceHeader[3].ID;

    await CapacityGridMonthlyAssignmentTest.resourceRequestRepository.insertMany(CapacityGridMonthlyAssignmentTest.resourceRequests);
    await CapacityGridMonthlyAssignmentTest.demandRepository.insertMany(CapacityGridMonthlyAssignmentTest.demand);
    await CapacityGridMonthlyAssignmentTest.workPackageRepository.insertMany(CapacityGridMonthlyAssignmentTest.workPackage);

    await CapacityGridMonthlyAssignmentTest.resourceHeaderRepository.insertMany(CapacityGridMonthlyAssignmentTest.resourceHeader);
    await CapacityGridMonthlyAssignmentTest.resourceCapacityRepository.insertMany(CapacityGridMonthlyAssignmentTest.resourceCapacity)
    await CapacityGridMonthlyAssignmentTest.assignmentRepository.insertMany(CapacityGridMonthlyAssignmentTest.assignment);
    await CapacityGridMonthlyAssignmentTest.assignmentBucketRepository.insertMany(CapacityGridMonthlyAssignmentTest.assignmentBuckets)
    await CapacityGridMonthlyAssignmentTest.employeeHeaderRepository.insertMany(CapacityGridMonthlyAssignmentTest.employeeHeader);
    await CapacityGridMonthlyAssignmentTest.workAssignmentRepository.insertMany(CapacityGridMonthlyAssignmentTest.workAssignment)
    await CapacityGridMonthlyAssignmentTest.workforcePersonRepository.insertMany(CapacityGridMonthlyAssignmentTest.workforcePerson);
    await CapacityGridMonthlyAssignmentTest.organizationHeaderRepository.insertMany(CapacityGridMonthlyAssignmentTest.organizationHeader)
    await CapacityGridMonthlyAssignmentTest.organizationDetailRepository.insertMany(CapacityGridMonthlyAssignmentTest.organizationDetail);
    await CapacityGridMonthlyAssignmentTest.jobDetailRepository.insertMany(CapacityGridMonthlyAssignmentTest.jobDetail)
    await CapacityGridMonthlyAssignmentTest.emailRepository.insertMany(CapacityGridMonthlyAssignmentTest.email);
    await CapacityGridMonthlyAssignmentTest.phoneRepository.insertMany(CapacityGridMonthlyAssignmentTest.phone);
    await CapacityGridMonthlyAssignmentTest.workPlaceAddressRepository.insertMany(CapacityGridMonthlyAssignmentTest.workPlaceAddress);
    await CapacityGridMonthlyAssignmentTest.profileDetailsRepository.insertMany(CapacityGridMonthlyAssignmentTest.profileDetail);
    await CapacityGridMonthlyAssignmentTest.costCenterRepository.insertMany(CapacityGridMonthlyAssignmentTest.costCenter);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource with Multiple Assignments: All assignments in the resource period are returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2021-12-31 and endDate ge 2021-03-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWith2Assignments + ' and requestStartDate le 2021-12-31 and requestEndDate ge 2021-03-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 2, "Not all assignments returned for resource with multiple assignments");

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = assignmentsDetailsForCapacityGridResponse.data.value as AssignmentsDetailsForCapacityGrid[];

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = [
      {
        action: 0,
        assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
        resource_ID: CapacityGridMonthlyAssignmentTest.resourceWith2Assignments,
        resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[1].ID,
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-30',
        requestStartDate: '2020-11-01',
        requestEndDate: '2022-02-28',
        requestName: 'CapAsgReq2',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 848,
        workItemName: null,
        assignmentDurationInHours: 424,
        requestedCapacityInHours: 100,
        remainingRequestedCapacityInHours: -748,
        costCenterID: 'CCDE',
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
        requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[1].displayId,
        monthlyAggregatedAssignments: [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202103',
          startDate: '2021-03-01',
          endDate: '2021-03-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202104',
          startDate: '2021-04-01',
          endDate: '2021-04-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202105',
          startDate: '2021-05-01',
          endDate: '2021-05-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202106',
          startDate: '2021-06-01',
          endDate: '2021-06-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202107',
          startDate: '2021-07-01',
          endDate: '2021-07-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202108',
          startDate: '2021-08-01',
          endDate: '2021-08-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202109',
          startDate: '2021-09-01',
          endDate: '2021-09-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 85,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 219,
          action: 0
        }]
      },
      {
        action: 0,
        assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
        resource_ID: CapacityGridMonthlyAssignmentTest.resourceWith2Assignments,
        resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[2].ID,
        assignmentStartDate: '2021-02-03',
        assignmentEndDate: '2021-04-30',
        requestStartDate: '2020-11-01',
        requestEndDate: '2021-10-31',
        requestName: 'CapAsgReq3',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 295,
        workItemName: null,
        assignmentDurationInHours: 295,
        requestedCapacityInHours: 100,
        remainingRequestedCapacityInHours: -195,
        costCenterID: 'CCDE',
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
        requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[2].displayId,
        monthlyAggregatedAssignments: [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202103',
          startDate: '2021-03-01',
          endDate: '2021-03-31',
          bookedCapacityInHours: 88,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202104',
          startDate: '2021-04-01',
          endDate: '2021-04-30',
          bookedCapacityInHours: 107,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202105',
          startDate: '2021-05-01',
          endDate: '2021-05-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202106',
          startDate: '2021-06-01',
          endDate: '2021-06-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202107',
          startDate: '2021-07-01',
          endDate: '2021-07-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202108',
          startDate: '2021-08-01',
          endDate: '2021-08-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202109',
          startDate: '2021-09-01',
          endDate: '2021-09-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[3].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 0,
          action: 0
        }
        ]
      }
    ];

    expectedAssignmentDetails.forEach(header => {
      header.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    actualAssignmentDetails.forEach(header => {
      header.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    expectedAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    actualAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment Header Details and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignments for multiple resources are correctly returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2021-12-31 and endDate ge 2021-10-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1 + ' or resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2021-12-31 and requestEndDate ge 2021-10-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 2, "Expected number of assignments not returned");

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = assignmentsDetailsForCapacityGridResponse.data.value as AssignmentsDetailsForCapacityGrid[];

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid[] = [
      {
        action: 0,
        assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
        resource_ID: CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1,
        resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[0].ID,
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-31',
        requestStartDate: '2021-07-01',
        requestEndDate: '2022-01-31',
        requestName: 'CapAsgReq1',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 200,
        workItemName: null,
        assignmentDurationInHours: 200,
        requestedCapacityInHours: 1000,
        remainingRequestedCapacityInHours: 800,
        costCenterID: 'CCDE',
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
        requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[0].displayId,
        monthlyAggregatedAssignments: [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 80,
          action: 0
        }]
      },
      {
        action: 0,
        assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
        resource_ID: CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_2,
        resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[1].ID,
        assignmentStartDate: '2021-10-01',
        assignmentEndDate: '2021-12-31',
        requestStartDate: '2020-11-01',
        requestEndDate: '2022-02-28',
        requestName: 'CapAsgReq2',
        projectName: null,
        assignmentStatusCode: 0,
        assignmentStatusText: 'Hard-Booked',
        totalRequestBookedCapacityInHours: 848,
        workItemName: null,
        assignmentDurationInHours: 424,
        requestedCapacityInHours: 100,
        remainingRequestedCapacityInHours: -748,
        costCenterID: 'CCIN',
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
        requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[1].displayId,
        monthlyAggregatedAssignments: [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 85,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 219,
          action: 0
        }]
      }
    ];

    expectedAssignmentDetails.forEach(header => {
      header.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    actualAssignmentDetails.forEach(header => {
      header.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    });

    expectedAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    actualAssignmentDetails.sort((a, b) => a.assignment_ID < b.assignment_ID ? -1 : 1);
    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment Header Details and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource with Multiple Assignments: Only assignment with corresponding request intersecting with selected resource period should be returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2022-02-28 and endDate ge 2021-12-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWith2Assignments + ' and requestStartDate le 2022-02-28 and requestEndDate ge 2021-12-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned for resource with multiple assignments but only a few intersecting with the selected resource period");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
      resource_ID: CapacityGridMonthlyAssignmentTest.resourceWith2Assignments,
      resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[1].ID,
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-30',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-02-28',
      requestName: 'CapAsgReq2',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 848,
      workItemName: null,
      assignmentDurationInHours: 424,
      requestedCapacityInHours: 100,
      remainingRequestedCapacityInHours: -748,
      costCenterID: 'CCDE',
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
      requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[1].displayId,
      monthlyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 219,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202201',
          startDate: '2022-01-01',
          endDate: '2022-01-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[2].ID,
          timePeriod: '202202',
          startDate: '2022-02-01',
          endDate: '2022-02-28',
          bookedCapacityInHours: 0,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment Header Details and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Monthly assignment records with 0 booked capacity hours should be returned for missing assignment buckets within request period intersecting with selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2022-01-31 and endDate ge 2021-09-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_2 + ' and requestStartDate le 2022-01-31 and requestEndDate ge 2021-09-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
      resource_ID: CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_2,
      resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[1].ID,
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2020-11-01',
      requestEndDate: '2022-02-28',
      requestName: 'CapAsgReq2',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 848,
      workItemName: null,
      assignmentDurationInHours: 424,
      requestedCapacityInHours: 100,
      remainingRequestedCapacityInHours: -748,
      costCenterID: 'CCIN',
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
      requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[1].displayId,
      monthlyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202109',
          startDate: '2021-09-01',
          endDate: '2021-09-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 85,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 219,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[1].ID,
          timePeriod: '202201',
          startDate: '2022-01-01',
          endDate: '2022-01-31',
          bookedCapacityInHours: 0,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment Header Details and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Monthly assignments with 0 booked capacity should be returned for missing assignment buckets within assignment period intersecting with selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2021-12-31 and endDate ge 2021-10-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2021-12-31 and requestEndDate ge 2021-10-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[0].ID,
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-01-31',
      requestName: 'CapAsgReq1',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 200,
      workItemName: null,
      assignmentDurationInHours: 200,
      requestedCapacityInHours: 1000,
      remainingRequestedCapacityInHours: 800,
      costCenterID: 'CCDE',
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
      requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[0].displayId,
      monthlyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 80,
          action: 0
        }]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment Header Details and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'No monthly assignments records should be returned outside the request period of corresponding assignment'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2022-03-31 and endDate ge 2021-05-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2022-03-31 and requestEndDate ge 2021-05-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignments not returned");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[0].ID,
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-01-31',
      requestName: 'CapAsgReq1',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 200,
      workItemName: null,
      assignmentDurationInHours: 200,
      requestedCapacityInHours: 1000,
      remainingRequestedCapacityInHours: 800,
      costCenterID: 'CCDE',
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
      requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[0].displayId,
      monthlyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202107',
          startDate: '2021-07-01',
          endDate: '2021-07-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202108',
          startDate: '2021-08-01',
          endDate: '2021-08-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202109',
          startDate: '2021-09-01',
          endDate: '2021-09-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 80,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202201',
          startDate: '2022-01-01',
          endDate: '2022-01-31',
          bookedCapacityInHours: 0,
          action: 0
        }
        ]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment Header Details and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignments for resource with multiple timeslice(job details) in the selected resource period should be correctly returned'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2022-03-31 and endDate ge 2021-05-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2022-03-31 and requestEndDate ge 2021-05-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 1, "Expected number of assignment not returned for resource with multiple job details in selected period");

    const expectedAssignmentDetails: AssignmentsDetailsForCapacityGrid = {
      action: 0,
      assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
      resource_ID: CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1,
      resourceRequest_ID: CapacityGridMonthlyAssignmentTest.resourceRequests[0].ID,
      assignmentStartDate: '2021-10-01',
      assignmentEndDate: '2021-12-31',
      requestStartDate: '2021-07-01',
      requestEndDate: '2022-01-31',
      requestName: 'CapAsgReq1',
      projectName: null,
      assignmentStatusCode: 0,
      assignmentStatusText: 'Hard-Booked',
      totalRequestBookedCapacityInHours: 200,
      workItemName: null,
      assignmentDurationInHours: 200,
      requestedCapacityInHours: 1000,
      remainingRequestedCapacityInHours: 800,
      costCenterID: 'CCDE',
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
      requestDisplayId: CapacityGridMonthlyAssignmentTest.resourceRequests[0].displayId,
      monthlyAggregatedAssignments:
        [{
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202107',
          startDate: '2021-07-01',
          endDate: '2021-07-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202108',
          startDate: '2021-08-01',
          endDate: '2021-08-31',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202109',
          startDate: '2021-09-01',
          endDate: '2021-09-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202110',
          startDate: '2021-10-01',
          endDate: '2021-10-31',
          bookedCapacityInHours: 120,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202111',
          startDate: '2021-11-01',
          endDate: '2021-11-30',
          bookedCapacityInHours: 0,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202112',
          startDate: '2021-12-01',
          endDate: '2021-12-31',
          bookedCapacityInHours: 80,
          action: 0
        },
        {
          assignment_ID: CapacityGridMonthlyAssignmentTest.assignment[0].ID,
          timePeriod: '202201',
          startDate: '2022-01-01',
          endDate: '2022-01-31',
          bookedCapacityInHours: 0,
          action: 0
        }
        ]
    };

    const actualAssignmentDetails: AssignmentsDetailsForCapacityGrid = assignmentsDetailsForCapacityGridResponse.data.value[0] as AssignmentsDetailsForCapacityGrid;

    expectedAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);
    actualAssignmentDetails.monthlyAggregatedAssignments?.sort((a, b) => a.timePeriod < b.timePeriod ? -1 : 1);

    assert.deepEqual(actualAssignmentDetails, expectedAssignmentDetails, "Assignment detail and Monthly Aggregated values are incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignments should not be returned for resource that has no assignment'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2022-03-31 and endDate ge 2021-01-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithNoAssignment + ' and requestStartDate le 2022-03-31 and requestEndDate ge 2021-01-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 0, "Assignments returned for resource with no assignments");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Assignments should not be returned for resource with assignments but the requests for which are outside selected resource period'() {

    const assignmentsDetailsForCapacityGridResponse = await CapacityGridMonthlyAssignmentTest.capacityServiceClientForResMgr.get('/AssignmentsDetailsForCapacityGrid?$expand=monthlyAggregatedAssignments($filter=startDate le 2022-05-31 and endDate ge 2022-04-01)&$filter=resource_ID eq ' + CapacityGridMonthlyAssignmentTest.resourceWithOneAssignment_1 + ' and requestStartDate le 2022-05-31 and requestEndDate ge 2022-04-01');

    assert.equal(assignmentsDetailsForCapacityGridResponse.data.value.length, 0, "Assignments for which the corresponding request period lies outside selected resource period is returned");

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridMonthlyAssignmentTest.resourceHeaderRepository.deleteMany(CapacityGridMonthlyAssignmentTest.resourceHeader);
    await CapacityGridMonthlyAssignmentTest.resourceCapacityRepository.deleteMany(CapacityGridMonthlyAssignmentTest.resourceCapacity);

    await CapacityGridMonthlyAssignmentTest.assignmentRepository.deleteMany(CapacityGridMonthlyAssignmentTest.assignment);
    await CapacityGridMonthlyAssignmentTest.assignmentBucketRepository.deleteMany(CapacityGridMonthlyAssignmentTest.assignmentBuckets);

    await CapacityGridMonthlyAssignmentTest.employeeHeaderRepository.deleteMany(CapacityGridMonthlyAssignmentTest.employeeHeader);
    await CapacityGridMonthlyAssignmentTest.workAssignmentRepository.deleteMany(CapacityGridMonthlyAssignmentTest.workAssignment);

    await CapacityGridMonthlyAssignmentTest.workforcePersonRepository.deleteMany(CapacityGridMonthlyAssignmentTest.workforcePerson);
    await CapacityGridMonthlyAssignmentTest.organizationHeaderRepository.deleteMany(CapacityGridMonthlyAssignmentTest.organizationHeader);

    await CapacityGridMonthlyAssignmentTest.organizationDetailRepository.deleteMany(CapacityGridMonthlyAssignmentTest.organizationDetail);
    await CapacityGridMonthlyAssignmentTest.jobDetailRepository.deleteMany(CapacityGridMonthlyAssignmentTest.jobDetail);

    await CapacityGridMonthlyAssignmentTest.emailRepository.deleteMany(CapacityGridMonthlyAssignmentTest.email);
    await CapacityGridMonthlyAssignmentTest.phoneRepository.deleteMany(CapacityGridMonthlyAssignmentTest.phone);
    await CapacityGridMonthlyAssignmentTest.workPlaceAddressRepository.deleteMany(CapacityGridMonthlyAssignmentTest.workPlaceAddress);
    await CapacityGridMonthlyAssignmentTest.profileDetailsRepository.deleteMany(CapacityGridMonthlyAssignmentTest.profileDetail);
    await CapacityGridMonthlyAssignmentTest.costCenterRepository.deleteMany(CapacityGridMonthlyAssignmentTest.costCenter);

    await CapacityGridMonthlyAssignmentTest.resourceRequestRepository.deleteMany(CapacityGridMonthlyAssignmentTest.resourceRequests);
    await CapacityGridMonthlyAssignmentTest.demandRepository.deleteMany(CapacityGridMonthlyAssignmentTest.demand);
    await CapacityGridMonthlyAssignmentTest.workPackageRepository.deleteMany(CapacityGridMonthlyAssignmentTest.workPackage);

  }

}