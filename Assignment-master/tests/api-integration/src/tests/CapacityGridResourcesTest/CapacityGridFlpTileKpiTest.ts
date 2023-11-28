import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';

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
export class CapacityGridFlpTileKpiTest {
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

  @timeout(TEST_TIMEOUT)
  static async before() {
    CapacityGridFlpTileKpiTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridFlpTileKpiTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridFlpTileKpiTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridFlpTileKpiTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridFlpTileKpiTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridFlpTileKpiTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridFlpTileKpiTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridFlpTileKpiTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridFlpTileKpiTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridFlpTileKpiTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    CapacityGridFlpTileKpiTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridFlpTileKpiTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridFlpTileKpiTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridFlpTileKpiTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridFlpTileKpiTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridFlpTileKpiTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    CapacityGridFlpTileKpiTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    CapacityGridFlpTileKpiTest.demandRepository = await testEnvironment.getDemandRepository();
    CapacityGridFlpTileKpiTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

    CapacityGridFlpTileKpiTest.uniquifier = new Uniquifier();
    CapacityGridFlpTileKpiTest.resourceHeader = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridFlpTileKpiTest.resourceCapacity = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridFlpTileKpiTest.assignment = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridFlpTileKpiTest.assignmentBuckets = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridFlpTileKpiTest.employeeHeader = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridFlpTileKpiTest.workAssignment = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridFlpTileKpiTest.workforcePerson = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    CapacityGridFlpTileKpiTest.organizationHeader = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    CapacityGridFlpTileKpiTest.organizationDetail = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridFlpTileKpiTest.jobDetail = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridFlpTileKpiTest.email = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridFlpTileKpiTest.phone = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridFlpTileKpiTest.workPlaceAddress = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridFlpTileKpiTest.profileDetail = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridFlpTileKpiTest.costCenter = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    CapacityGridFlpTileKpiTest.resourceRequests = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    CapacityGridFlpTileKpiTest.demand = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.project.demands.csv', 'Demand');
    CapacityGridFlpTileKpiTest.workPackage = await CapacityGridFlpTileKpiTest.uniquifier.getRecords('../data/input/capacityGridAssignment/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

    await CapacityGridFlpTileKpiTest.resourceRequestRepository.insertMany(CapacityGridFlpTileKpiTest.resourceRequests);
    await CapacityGridFlpTileKpiTest.demandRepository.insertMany(CapacityGridFlpTileKpiTest.demand);
    await CapacityGridFlpTileKpiTest.workPackageRepository.insertMany(CapacityGridFlpTileKpiTest.workPackage);

    await CapacityGridFlpTileKpiTest.resourceHeaderRepository.insertMany(CapacityGridFlpTileKpiTest.resourceHeader);
    await CapacityGridFlpTileKpiTest.resourceCapacityRepository.insertMany(CapacityGridFlpTileKpiTest.resourceCapacity)
    await CapacityGridFlpTileKpiTest.assignmentRepository.insertMany(CapacityGridFlpTileKpiTest.assignment);
    await CapacityGridFlpTileKpiTest.assignmentBucketRepository.insertMany(CapacityGridFlpTileKpiTest.assignmentBuckets)
    await CapacityGridFlpTileKpiTest.employeeHeaderRepository.insertMany(CapacityGridFlpTileKpiTest.employeeHeader);
    await CapacityGridFlpTileKpiTest.workAssignmentRepository.insertMany(CapacityGridFlpTileKpiTest.workAssignment)
    await CapacityGridFlpTileKpiTest.workforcePersonRepository.insertMany(CapacityGridFlpTileKpiTest.workforcePerson);
    await CapacityGridFlpTileKpiTest.organizationHeaderRepository.insertMany(CapacityGridFlpTileKpiTest.organizationHeader)
    await CapacityGridFlpTileKpiTest.organizationDetailRepository.insertMany(CapacityGridFlpTileKpiTest.organizationDetail);
    await CapacityGridFlpTileKpiTest.jobDetailRepository.insertMany(CapacityGridFlpTileKpiTest.jobDetail)
    await CapacityGridFlpTileKpiTest.emailRepository.insertMany(CapacityGridFlpTileKpiTest.email);
    await CapacityGridFlpTileKpiTest.phoneRepository.insertMany(CapacityGridFlpTileKpiTest.phone);
    await CapacityGridFlpTileKpiTest.workPlaceAddressRepository.insertMany(CapacityGridFlpTileKpiTest.workPlaceAddress);
    await CapacityGridFlpTileKpiTest.profileDetailsRepository.insertMany(CapacityGridFlpTileKpiTest.profileDetail);
    await CapacityGridFlpTileKpiTest.costCenterRepository.insertMany(CapacityGridFlpTileKpiTest.costCenter);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'OData response must be exactly as expected by the flp tile'() {

    const capacityGridFlpTileKpiResponse = await CapacityGridFlpTileKpiTest.capacityServiceClientForResMgr.get('/averageResourceUtilizationFor12WeeksTileResponse(004808d7-9643-4f8d-8bc5-a9b49bbb0a7b)');

    assert.equal(capacityGridFlpTileKpiResponse.status, 200, "Flp Tile Kpi response status incorrect. Expected status to be 200 (OK)");
    assert.exists(capacityGridFlpTileKpiResponse.data.ID, "Expected ID field to be present in response");
    assert.exists(capacityGridFlpTileKpiResponse.data.number, "Expected number field to be present in response");
    assert.exists(capacityGridFlpTileKpiResponse.data.numberFactor, "Expected numberFactor field to be present in response");
    assert.exists(capacityGridFlpTileKpiResponse.data.numberState, "Expected numberState field to be present in response");

    /*
    Here we skip asserting on particular value because it is not possible to ensure data isolation when multiple tests are run in parallel. 
    Even if we use a filter for resource org, the pipeline user always uses the harcoded one ROO1 and data from other test automates will change the average value. 
    Also we cannot assert the tile value with grid header kpi value because these would be two separate calls and the number of resources might have changed in DB 
    in between the two calls leading to test flakiness...
    */

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridFlpTileKpiTest.resourceHeaderRepository.deleteMany(CapacityGridFlpTileKpiTest.resourceHeader);
    await CapacityGridFlpTileKpiTest.resourceCapacityRepository.deleteMany(CapacityGridFlpTileKpiTest.resourceCapacity);

    await CapacityGridFlpTileKpiTest.assignmentRepository.deleteMany(CapacityGridFlpTileKpiTest.assignment);
    await CapacityGridFlpTileKpiTest.assignmentBucketRepository.deleteMany(CapacityGridFlpTileKpiTest.assignmentBuckets);

    await CapacityGridFlpTileKpiTest.employeeHeaderRepository.deleteMany(CapacityGridFlpTileKpiTest.employeeHeader);
    await CapacityGridFlpTileKpiTest.workAssignmentRepository.deleteMany(CapacityGridFlpTileKpiTest.workAssignment);

    await CapacityGridFlpTileKpiTest.workforcePersonRepository.deleteMany(CapacityGridFlpTileKpiTest.workforcePerson);
    await CapacityGridFlpTileKpiTest.organizationHeaderRepository.deleteMany(CapacityGridFlpTileKpiTest.organizationHeader);

    await CapacityGridFlpTileKpiTest.organizationDetailRepository.deleteMany(CapacityGridFlpTileKpiTest.organizationDetail);
    await CapacityGridFlpTileKpiTest.jobDetailRepository.deleteMany(CapacityGridFlpTileKpiTest.jobDetail);

    await CapacityGridFlpTileKpiTest.emailRepository.deleteMany(CapacityGridFlpTileKpiTest.email);
    await CapacityGridFlpTileKpiTest.phoneRepository.deleteMany(CapacityGridFlpTileKpiTest.phone);
    await CapacityGridFlpTileKpiTest.workPlaceAddressRepository.deleteMany(CapacityGridFlpTileKpiTest.workPlaceAddress);
    await CapacityGridFlpTileKpiTest.profileDetailsRepository.deleteMany(CapacityGridFlpTileKpiTest.profileDetail);
    await CapacityGridFlpTileKpiTest.costCenterRepository.deleteMany(CapacityGridFlpTileKpiTest.costCenter);

    await CapacityGridFlpTileKpiTest.resourceRequestRepository.deleteMany(CapacityGridFlpTileKpiTest.resourceRequests);
    await CapacityGridFlpTileKpiTest.demandRepository.deleteMany(CapacityGridFlpTileKpiTest.demand);
    await CapacityGridFlpTileKpiTest.workPackageRepository.deleteMany(CapacityGridFlpTileKpiTest.workPackage);

  }

}