import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier} from '../../utils';

import {
  EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
  WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  Email, EmailRepository, Phone, PhoneRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ProfileDetail, ProfileDetailRepository,
  OrganizationDetail, OrganizationDetailRepository, OrganizationHeader, OrganizationHeaderRepository,
  JobDetail, JobDetailRepository, ResourceTypes,ResourceSupply, ResourceSupplyRepository, 
  CostCenterRepository, CostCenter, ResourceRequestRepository, ResourceRequest, DemandRepository, Demand, WorkPackage, WorkPackageRepository, CapacityRequirementRepository, CapacityRequirement, ResourceTypesRepository, ProjectRoleRepository
, ProjectRole, Project, ProjectRepository, Customer, CustomerRepository,
  ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository} from 'test-commons';

@suite
export class CapacityGridAssignmentCUDTest {
  private static capacityServiceClientForResMgr: AxiosInstance;

  private static uniquifier: Uniquifier;

  private static resourceRequestRepository: ResourceRequestRepository;
  private static demandRepository: DemandRepository;
  private static workPackageRepository: WorkPackageRepository;
  private static projectRoleRepository: ProjectRoleRepository;

  private static resourceHeaderRepository: ResourceHeaderRepository;
  private static resourceTypesRepository: ResourceTypesRepository;
  private static resourceSupplyRepository: ResourceSupplyRepository;

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
  private static emailRepository: EmailRepository;
  private static phoneRepository: PhoneRepository;
  private static workPlaceAddressRepository: WorkPlaceAddressRepository;
  private static profileDetailsRepository: ProfileDetailRepository;
  private static capacityRequirementRepository: CapacityRequirementRepository;
  private static projectRepository: ProjectRepository;
  private static customerRepository: CustomerRepository;

  private static resourceHeader: ResourceHeader[];
  private static resourceCapacity: ResourceCapacity[];
  private static resourceTypes: ResourceTypes[];
  private static resourceSupply: ResourceSupply[];

  private static resourceRequests: ResourceRequest[];
  private static capacityRequirement: CapacityRequirement[];
  private static demand: Demand[];
  private static workPackage: WorkPackage[];
  private static projectRoles: ProjectRole[];
  private static projects: Project[];
  private static customers: Customer[];

  private static assignment: Assignments[];
  private static assignmentBuckets: AssignmentBucket[];

  private static employeeHeader: EmployeeHeader[];
  private static workAssignment: WorkAssignment[];
  private static workforcePerson: WorkforcePerson[];

  private static organizationDetail: OrganizationDetail[];
  private static organizationHeader: OrganizationHeader[];
  private static jobDetail: JobDetail[];

  private static costCenter: CostCenter[];
  private static email: Email[];
  private static phone: Phone[];
  private static workPlaceAddress: WorkPlaceAddress[];
  private static profileDetail: ProfileDetail[];

  private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
  private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
  private static resourceOrganizations: ResourceOrganizations[];
  private static resourceOrganizationItems: ResourceOrganizationItems[];

  @timeout(TEST_TIMEOUT)
  static async before() {

    CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridAssignmentCUDTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridAssignmentCUDTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridAssignmentCUDTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridAssignmentCUDTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridAssignmentCUDTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
    CapacityGridAssignmentCUDTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
    CapacityGridAssignmentCUDTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridAssignmentCUDTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridAssignmentCUDTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridAssignmentCUDTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridAssignmentCUDTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    CapacityGridAssignmentCUDTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridAssignmentCUDTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridAssignmentCUDTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridAssignmentCUDTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridAssignmentCUDTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridAssignmentCUDTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    CapacityGridAssignmentCUDTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    CapacityGridAssignmentCUDTest.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
    CapacityGridAssignmentCUDTest.demandRepository = await testEnvironment.getDemandRepository();
    CapacityGridAssignmentCUDTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
    CapacityGridAssignmentCUDTest.projectRoleRepository = await testEnvironment.getProjectRoleRepository();
    CapacityGridAssignmentCUDTest.projectRepository = await testEnvironment.getProjectRepository();
    CapacityGridAssignmentCUDTest.customerRepository = await testEnvironment.getCustomerRepository();
    CapacityGridAssignmentCUDTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    CapacityGridAssignmentCUDTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

    CapacityGridAssignmentCUDTest.uniquifier = new Uniquifier();
    CapacityGridAssignmentCUDTest.resourceHeader = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridAssignmentCUDTest.resourceCapacity = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridAssignmentCUDTest.resourceTypes = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
    CapacityGridAssignmentCUDTest.resourceSupply = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');
    CapacityGridAssignmentCUDTest.assignment = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridAssignmentCUDTest.assignmentBuckets = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridAssignmentCUDTest.employeeHeader = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridAssignmentCUDTest.workAssignment = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridAssignmentCUDTest.workforcePerson = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    CapacityGridAssignmentCUDTest.organizationHeader = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    CapacityGridAssignmentCUDTest.organizationDetail = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridAssignmentCUDTest.jobDetail = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridAssignmentCUDTest.email = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridAssignmentCUDTest.phone = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridAssignmentCUDTest.workPlaceAddress = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridAssignmentCUDTest.profileDetail = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridAssignmentCUDTest.costCenter = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    CapacityGridAssignmentCUDTest.resourceRequests = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    CapacityGridAssignmentCUDTest.capacityRequirement = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');
    CapacityGridAssignmentCUDTest.demand = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.project.demands.csv', 'Demand');
    CapacityGridAssignmentCUDTest.workPackage = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
    CapacityGridAssignmentCUDTest.projectRoles = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.config-ProjectRoles.csv', 'ProjectRole');
    CapacityGridAssignmentCUDTest.projects = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.project.projects.csv', 'Project');
    CapacityGridAssignmentCUDTest.customers = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.project.customer.csv', 'Customer');
    CapacityGridAssignmentCUDTest.resourceOrganizations = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
    CapacityGridAssignmentCUDTest.resourceOrganizationItems = await CapacityGridAssignmentCUDTest.uniquifier.getRecords('../data/input/capacityGridAssignmentCUD/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

    await CapacityGridAssignmentCUDTest.resourceRequestRepository.insertMany(CapacityGridAssignmentCUDTest.resourceRequests);
    await CapacityGridAssignmentCUDTest.capacityRequirementRepository.insertMany(CapacityGridAssignmentCUDTest.capacityRequirement);
    await CapacityGridAssignmentCUDTest.demandRepository.insertMany(CapacityGridAssignmentCUDTest.demand);
    await CapacityGridAssignmentCUDTest.workPackageRepository.insertMany(CapacityGridAssignmentCUDTest.workPackage);

    await CapacityGridAssignmentCUDTest.resourceHeaderRepository.insertMany(CapacityGridAssignmentCUDTest.resourceHeader);
    await CapacityGridAssignmentCUDTest.resourceCapacityRepository.insertMany(CapacityGridAssignmentCUDTest.resourceCapacity)
    await CapacityGridAssignmentCUDTest.resourceTypesRepository.insertMany(CapacityGridAssignmentCUDTest.resourceTypes);
    await CapacityGridAssignmentCUDTest.resourceSupplyRepository.insertMany(CapacityGridAssignmentCUDTest.resourceSupply);
    await CapacityGridAssignmentCUDTest.assignmentRepository.insertMany(CapacityGridAssignmentCUDTest.assignment);
    await CapacityGridAssignmentCUDTest.assignmentBucketRepository.insertMany(CapacityGridAssignmentCUDTest.assignmentBuckets)
    await CapacityGridAssignmentCUDTest.employeeHeaderRepository.insertMany(CapacityGridAssignmentCUDTest.employeeHeader);
    await CapacityGridAssignmentCUDTest.workAssignmentRepository.insertMany(CapacityGridAssignmentCUDTest.workAssignment)
    await CapacityGridAssignmentCUDTest.workforcePersonRepository.insertMany(CapacityGridAssignmentCUDTest.workforcePerson);
    await CapacityGridAssignmentCUDTest.organizationHeaderRepository.insertMany(CapacityGridAssignmentCUDTest.organizationHeader)
    await CapacityGridAssignmentCUDTest.organizationDetailRepository.insertMany(CapacityGridAssignmentCUDTest.organizationDetail);
    await CapacityGridAssignmentCUDTest.jobDetailRepository.insertMany(CapacityGridAssignmentCUDTest.jobDetail)
    await CapacityGridAssignmentCUDTest.emailRepository.insertMany(CapacityGridAssignmentCUDTest.email);
    await CapacityGridAssignmentCUDTest.phoneRepository.insertMany(CapacityGridAssignmentCUDTest.phone);
    await CapacityGridAssignmentCUDTest.workPlaceAddressRepository.insertMany(CapacityGridAssignmentCUDTest.workPlaceAddress);
    await CapacityGridAssignmentCUDTest.profileDetailsRepository.insertMany(CapacityGridAssignmentCUDTest.profileDetail);
    await CapacityGridAssignmentCUDTest.costCenterRepository.insertMany(CapacityGridAssignmentCUDTest.costCenter);
    await CapacityGridAssignmentCUDTest.projectRoleRepository.insertMany(CapacityGridAssignmentCUDTest.projectRoles);
    await CapacityGridAssignmentCUDTest.projectRepository.insertMany(CapacityGridAssignmentCUDTest.projects);
    await CapacityGridAssignmentCUDTest.customerRepository.insertMany(CapacityGridAssignmentCUDTest.customers);
    await CapacityGridAssignmentCUDTest.resourceOrganizationsRepository.insertMany(CapacityGridAssignmentCUDTest.resourceOrganizations);
    await CapacityGridAssignmentCUDTest.resourceOrganizationItemsRepository.insertMany(CapacityGridAssignmentCUDTest.resourceOrganizationItems);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Duplicate assignments are avoided'() {

    const assignmentPayload = {
        "resource_ID": CapacityGridAssignmentCUDTest.assignment[0].resource_ID,
        "resourceRequest_ID": CapacityGridAssignmentCUDTest.assignment[0].resourceRequest_ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2021-08-01",
        "assignmentEndDate": "2021-09-20",
        "requestStartDate": "2023-04-01",
        "requestEndDate": "2023-09-01",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0
  }

    const assignmentsCreateForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 400);
    //Error message about existing assignment has to be present
    assert.exists(assignmentsCreateForCapacityGridResponse.data.error.message);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Should successfully create an assignment (draft)'() {

    const assignmentPayload = {
        "resource_ID": CapacityGridAssignmentCUDTest.assignment[0].resource_ID,
        "resourceRequest_ID": CapacityGridAssignmentCUDTest.assignment[1].resourceRequest_ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2021-01-01",
        "assignmentEndDate": "2021-01-30",
        "requestStartDate": "2020-11-01",
        "requestEndDate": "2022-02-28",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    //Check 1 - Creation successful
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Check 2 - Assignment should've beeen created outside the horizon too
    assert.notEqual(assignmentsCreateForCapacityGridResponse.data["assignmentEndDate"], assignmentPayload.assignmentEndDate);

    //Check 3 - And that the assignment has been created outside should be propogated too
    assert.exists(assignmentsCreateForCapacityGridResponse.headers["sap-messages"], "Message indicating that the assignment lies outside the planning period not raised");

    //Check 4 - The distribution that is returned to the user should be restricted to the planning period
    assert.equal(assignmentsCreateForCapacityGridResponse.data["dailyAssignments"][assignmentsCreateForCapacityGridResponse.data.dailyAssignments.length - 1].timePeriod, assignmentPayload.assignmentEndDate)

    //Check 5 - The delete on an unsaved assignment should be successful too
    const assignmentsDeleteForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.delete(`/AssignmentsDetailsForCapacityGrid(${assignmentsCreateForCapacityGridResponse.data["assignment_ID"]})`);
    assert.equal(assignmentsDeleteForCapacityGridResponse.status, 204);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Should successfully create a new assignment from copied assignment'() {

    const assignmentPayload = {
        "resource_ID": CapacityGridAssignmentCUDTest.assignment[0].resource_ID, //1raac53c-7524-5ea8-95ae-7748466cff65
        "resourceRequest_ID": CapacityGridAssignmentCUDTest.assignment[1].resourceRequest_ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2021-06-01",
        "assignmentEndDate": "2021-12-31",
        "requestStartDate": "2020-11-01",
        "requestEndDate": "2022-02-28",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "referenceAssignment": CapacityGridAssignmentCUDTest.assignment[1].ID, //request = 2qa3bcb9-108f-5cd9-9b11-578f0dc0f957
        "action": 0,
            "dailyAssignments":[]
        }

    const assignmentsCreateForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    // console.log(assignmentsCreateForCapacityGridResponse.data);

    //Check 1 - Creation successful
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201, 'Assignment copy paste of an existing active assignment unsuccessful');  

    //Check 2 - To check that the assignment is indeed copied from the reference and not just created, 
    //validate that the distribution is same as in the csv
    assert.equal(assignmentsCreateForCapacityGridResponse.data.assignmentDurationInHours,424,'The distribution in the new assignment is different from the copied active assignment');
    assert.equal(assignmentsCreateForCapacityGridResponse.data.monthlyAggregatedAssignments[4].bookedCapacityInHours,120,'The distribution in the new assignment is different from the copied active assignment');
    assert.equal(assignmentsCreateForCapacityGridResponse.data.monthlyAggregatedAssignments[5].bookedCapacityInHours,85,'The distribution in the new assignment is different from the copied active assignment');

    //Check 3 - Update the assignment and then copy the updated assignment.
    const assignmentUpdatePayload1 = {
      "bookedCapacityInHours":0,"startDate":"2021-10-01","endDate":"2021-10-31","action":0
    }
    
    const assignmentsUpdateForCapacityGridResponse1 = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202110')`,assignmentUpdatePayload1);
    assert.equal(assignmentsUpdateForCapacityGridResponse1.status, 200);

    //Let's make the distribution as 0 for all months. This should be allowed while save shouldn't!
    const assignmentUpdatePayload2 = {
      "bookedCapacityInHours":0,"startDate":"2021-11-01","endDate":"2021-11-30","action":0
    }
    const assignmentsUpdateForCapacityGridResponse2 = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202111')`,assignmentUpdatePayload2);
    assert.equal(assignmentsUpdateForCapacityGridResponse2.status, 200);    

    const assignmentUpdatePayload3 = {
      "bookedCapacityInHours":0,"startDate":"2021-12-01","endDate":"2021-12-31","action":0
    }
    const assignmentsUpdateForCapacityGridResponse3 = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202112')`,assignmentUpdatePayload3);
    assert.equal(assignmentsUpdateForCapacityGridResponse3.status, 200);    

    //Now that the distribution is 0 (we will also verify that soon), try creating a new assignment from this draft assignment! 
    //The end result should be that an assignment is created without any buckets!

    const assignmentCopyPayload = {
      "resource_ID": CapacityGridAssignmentCUDTest.assignment[0].resource_ID, //1raac53c-7524-5ea8-95ae-7748466cff65
      "resourceRequest_ID": CapacityGridAssignmentCUDTest.assignment[1].resourceRequest_ID,
      "assignmentStatusCode": 0,
      "assignmentStartDate": "2021-06-01",
      "assignmentEndDate": "2021-12-31",
      "requestStartDate": "2020-11-01",
      "requestEndDate": "2022-02-28",
      "projectId": null,
      "projectName": null,
      "customerId": null,
      "customerName": null,
      "projectRoleName": "ProjectRole T9",
      "referenceAssignment": assignmentsCreateForCapacityGridResponse.data.assignment_ID, 
      "action": 0,
          "dailyAssignments":[]
      }

  const assignmentsCopyCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentCopyPayload);
 
  //Check 4 - Assignment copy of a draft assignment should be successful too
  assert.equal(assignmentsCopyCapacityGridResponse.status, 201, 'Assignment copy-paste of the draft assignment was unsuccessful');

  //Check 5 - How do we know that the draft was copied? Check that the total duration is 0!
  assert.equal(assignmentsCopyCapacityGridResponse.data.assignmentDurationInHours,0,'The distribution in the new assignemnt is different from the copied draft assignment');

  //Check 6 - Save should be prevented
  const assignmentSavePayload = {
    "action":2
  }
  const assignmentsSaveCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.patch(`/AssignmentsDetailsForCapacityGrid(${assignmentsCreateForCapacityGridResponse.data.assignment_ID})`,assignmentSavePayload);
  assert.equal(assignmentsSaveCapacityGridResponse.status, 400, 'Save went through with 0 distribution!');    

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Should thow an error in case of resourceorg mismatch'() {

    const assignmentPayload = {
      "resourceRequest_ID": CapacityGridAssignmentCUDTest.resourceRequests[0].ID,
      "resource_ID": CapacityGridAssignmentCUDTest.resourceHeader[2].ID,
      "assignmentStartDate": "2021-01-01",
      "assignmentEndDate": "2021-01-30",
      "requestStartDate": "2020-11-01",
      "requestEndDate": "2022-02-28",
      "projectId": null,
      "projectName": null,
      "customerId": null,
      "customerName": null,
      "projectRoleName": "ProjectRole T9",
      "action": 0,
          "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Check 1 - Creation unsuccessful
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 400);

    //Check 2 - Resource org mismatch error
    assert.isNotNull(assignmentsCreateForCapacityGridResponse.data.error, 'Resource Org Mismatch error not found');

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Should delete an assignment successfully'() {

    const assignmentPayload = {
      "action": 1
  }
    //First we do an edit...
    const assignmentsEditForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.patch(`/AssignmentsDetailsForCapacityGrid(${CapacityGridAssignmentCUDTest.assignment[0].ID})`,assignmentPayload);
    //Edit should be successful
    assert.equal(assignmentsEditForCapacityGridResponse.status, 200);

    //Now we do a delete...
    const assignmentsDeleteForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.delete(`/AssignmentsDetailsForCapacityGrid(${CapacityGridAssignmentCUDTest.assignment[0].ID})`);
    console.log(assignmentsDeleteForCapacityGridResponse.data);
    assert.equal(assignmentsDeleteForCapacityGridResponse.status, 204);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Should raise an error if the reference assignment does not exist'() {

    const assignmentPayload = {
      "resource_ID": CapacityGridAssignmentCUDTest.assignment[0].resource_ID, 
      "resourceRequest_ID": CapacityGridAssignmentCUDTest.assignment[0].resourceRequest_ID,
      "assignmentStatusCode": 0,
      "assignmentStartDate": "2021-06-01",
      "assignmentEndDate": "2021-12-31",
      "requestStartDate": "2020-11-01",
      "requestEndDate": "2022-02-28",
      "projectId": null,
      "projectName": null,
      "customerId": null,
      "customerName": null,
      "projectRoleName": "ProjectRole T9",
      "referenceAssignment": CapacityGridAssignmentCUDTest.assignment[0].resource_ID,
      "action": 0,
          "dailyAssignments":[]
      }

    //Try to create an assignment
    const assignmentsCreateForCapacityGridResponse = await CapacityGridAssignmentCUDTest.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Check 1 - Creation unsuccessful
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 400);

    //Check 2 - Resource org mismatch error
    assert.isNotNull(assignmentsCreateForCapacityGridResponse.data.error, 'Resource Org Mismatch error not found');

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridAssignmentCUDTest.resourceHeaderRepository.deleteMany(CapacityGridAssignmentCUDTest.resourceHeader);
    await CapacityGridAssignmentCUDTest.resourceCapacityRepository.deleteMany(CapacityGridAssignmentCUDTest.resourceCapacity);
    await CapacityGridAssignmentCUDTest.resourceTypesRepository.deleteMany(CapacityGridAssignmentCUDTest.resourceTypes);
    await CapacityGridAssignmentCUDTest.capacityRequirementRepository.deleteMany(CapacityGridAssignmentCUDTest.capacityRequirement);

    await CapacityGridAssignmentCUDTest.assignmentRepository.deleteMany(CapacityGridAssignmentCUDTest.assignment);
    await CapacityGridAssignmentCUDTest.assignmentBucketRepository.deleteMany(CapacityGridAssignmentCUDTest.assignmentBuckets);

    await CapacityGridAssignmentCUDTest.employeeHeaderRepository.deleteMany(CapacityGridAssignmentCUDTest.employeeHeader);
    await CapacityGridAssignmentCUDTest.workAssignmentRepository.deleteMany(CapacityGridAssignmentCUDTest.workAssignment);

    await CapacityGridAssignmentCUDTest.workforcePersonRepository.deleteMany(CapacityGridAssignmentCUDTest.workforcePerson);
    await CapacityGridAssignmentCUDTest.organizationHeaderRepository.deleteMany(CapacityGridAssignmentCUDTest.organizationHeader);

    await CapacityGridAssignmentCUDTest.organizationDetailRepository.deleteMany(CapacityGridAssignmentCUDTest.organizationDetail);
    await CapacityGridAssignmentCUDTest.jobDetailRepository.deleteMany(CapacityGridAssignmentCUDTest.jobDetail);

    await CapacityGridAssignmentCUDTest.emailRepository.deleteMany(CapacityGridAssignmentCUDTest.email);
    await CapacityGridAssignmentCUDTest.phoneRepository.deleteMany(CapacityGridAssignmentCUDTest.phone);
    await CapacityGridAssignmentCUDTest.workPlaceAddressRepository.deleteMany(CapacityGridAssignmentCUDTest.workPlaceAddress);
    await CapacityGridAssignmentCUDTest.profileDetailsRepository.deleteMany(CapacityGridAssignmentCUDTest.profileDetail);
    await CapacityGridAssignmentCUDTest.costCenterRepository.deleteMany(CapacityGridAssignmentCUDTest.costCenter);

    await CapacityGridAssignmentCUDTest.resourceRequestRepository.deleteMany(CapacityGridAssignmentCUDTest.resourceRequests);
    await CapacityGridAssignmentCUDTest.demandRepository.deleteMany(CapacityGridAssignmentCUDTest.demand);
    await CapacityGridAssignmentCUDTest.workPackageRepository.deleteMany(CapacityGridAssignmentCUDTest.workPackage);
    await CapacityGridAssignmentCUDTest.projectRoleRepository.deleteMany(CapacityGridAssignmentCUDTest.projectRoles);
    await CapacityGridAssignmentCUDTest.projectRepository.deleteMany(CapacityGridAssignmentCUDTest.projects);
    await CapacityGridAssignmentCUDTest.customerRepository.deleteMany(CapacityGridAssignmentCUDTest.customers);

    await CapacityGridAssignmentCUDTest.resourceOrganizationsRepository.deleteMany(CapacityGridAssignmentCUDTest.resourceOrganizations);
    await CapacityGridAssignmentCUDTest.resourceOrganizationItemsRepository.deleteMany(CapacityGridAssignmentCUDTest.resourceOrganizationItems);

  }

}