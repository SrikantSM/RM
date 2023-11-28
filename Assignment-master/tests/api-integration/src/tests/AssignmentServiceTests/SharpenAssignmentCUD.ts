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
export class SharpenAssignmentCUD {
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

  private assignmentDatesAdjustedWarning = "The assignment dates have been adjusted according to the validity of the resource.";

  @timeout(TEST_TIMEOUT)
  static async before() {

    SharpenAssignmentCUD.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    SharpenAssignmentCUD.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    SharpenAssignmentCUD.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    SharpenAssignmentCUD.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    SharpenAssignmentCUD.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    SharpenAssignmentCUD.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
    SharpenAssignmentCUD.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
    SharpenAssignmentCUD.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    SharpenAssignmentCUD.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    SharpenAssignmentCUD.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    SharpenAssignmentCUD.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    SharpenAssignmentCUD.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    SharpenAssignmentCUD.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    SharpenAssignmentCUD.emailRepository = await testEnvironment.getEmailRepository();
    SharpenAssignmentCUD.phoneRepository = await testEnvironment.getPhoneRepository();
    SharpenAssignmentCUD.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    SharpenAssignmentCUD.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    SharpenAssignmentCUD.costCenterRepository = await testEnvironment.getCostCenterRepository();

    SharpenAssignmentCUD.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    SharpenAssignmentCUD.capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
    SharpenAssignmentCUD.demandRepository = await testEnvironment.getDemandRepository();
    SharpenAssignmentCUD.workPackageRepository = await testEnvironment.getWorkPackageRepository();
    SharpenAssignmentCUD.projectRoleRepository = await testEnvironment.getProjectRoleRepository();
    SharpenAssignmentCUD.projectRepository = await testEnvironment.getProjectRepository();
    SharpenAssignmentCUD.customerRepository = await testEnvironment.getCustomerRepository();
    SharpenAssignmentCUD.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    SharpenAssignmentCUD.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

    SharpenAssignmentCUD.uniquifier = new Uniquifier();
    SharpenAssignmentCUD.resourceHeader = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    SharpenAssignmentCUD.resourceCapacity = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    SharpenAssignmentCUD.resourceTypes = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
    SharpenAssignmentCUD.resourceSupply = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');
    SharpenAssignmentCUD.assignment = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    SharpenAssignmentCUD.assignmentBuckets = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    SharpenAssignmentCUD.employeeHeader = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    SharpenAssignmentCUD.workAssignment = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    SharpenAssignmentCUD.workforcePerson = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    SharpenAssignmentCUD.organizationHeader = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    SharpenAssignmentCUD.organizationDetail = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    SharpenAssignmentCUD.jobDetail = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    SharpenAssignmentCUD.email = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    SharpenAssignmentCUD.phone = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    SharpenAssignmentCUD.workPlaceAddress = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    SharpenAssignmentCUD.profileDetail = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    SharpenAssignmentCUD.costCenter = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    SharpenAssignmentCUD.resourceRequests = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    SharpenAssignmentCUD.capacityRequirement = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.resourceRequest.CapacityRequirements.csv', 'CapacityRequirement');
    SharpenAssignmentCUD.demand = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.project.demands.csv', 'Demand');
    SharpenAssignmentCUD.workPackage = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
    SharpenAssignmentCUD.projectRoles = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.config-ProjectRoles.csv', 'ProjectRole');
    SharpenAssignmentCUD.projects = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.project.projects.csv', 'Project');
    SharpenAssignmentCUD.customers = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.project.customer.csv', 'Customer');
    SharpenAssignmentCUD.resourceOrganizations = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
    SharpenAssignmentCUD.resourceOrganizationItems = await SharpenAssignmentCUD.uniquifier.getRecords('../data/input/sharpenAssignmentCUD/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

    await SharpenAssignmentCUD.resourceRequestRepository.insertMany(SharpenAssignmentCUD.resourceRequests);
    await SharpenAssignmentCUD.capacityRequirementRepository.insertMany(SharpenAssignmentCUD.capacityRequirement);
    await SharpenAssignmentCUD.demandRepository.insertMany(SharpenAssignmentCUD.demand);
    await SharpenAssignmentCUD.workPackageRepository.insertMany(SharpenAssignmentCUD.workPackage);

    await SharpenAssignmentCUD.resourceHeaderRepository.insertMany(SharpenAssignmentCUD.resourceHeader);
    await SharpenAssignmentCUD.resourceCapacityRepository.insertMany(SharpenAssignmentCUD.resourceCapacity)
    await SharpenAssignmentCUD.resourceTypesRepository.insertMany(SharpenAssignmentCUD.resourceTypes);
    await SharpenAssignmentCUD.resourceSupplyRepository.insertMany(SharpenAssignmentCUD.resourceSupply);
    await SharpenAssignmentCUD.assignmentRepository.insertMany(SharpenAssignmentCUD.assignment);
    await SharpenAssignmentCUD.assignmentBucketRepository.insertMany(SharpenAssignmentCUD.assignmentBuckets)
    await SharpenAssignmentCUD.employeeHeaderRepository.insertMany(SharpenAssignmentCUD.employeeHeader);
    await SharpenAssignmentCUD.workAssignmentRepository.insertMany(SharpenAssignmentCUD.workAssignment)
    await SharpenAssignmentCUD.workforcePersonRepository.insertMany(SharpenAssignmentCUD.workforcePerson);
    await SharpenAssignmentCUD.organizationHeaderRepository.insertMany(SharpenAssignmentCUD.organizationHeader)
    await SharpenAssignmentCUD.organizationDetailRepository.insertMany(SharpenAssignmentCUD.organizationDetail);
    await SharpenAssignmentCUD.jobDetailRepository.insertMany(SharpenAssignmentCUD.jobDetail)
    await SharpenAssignmentCUD.emailRepository.insertMany(SharpenAssignmentCUD.email);
    await SharpenAssignmentCUD.phoneRepository.insertMany(SharpenAssignmentCUD.phone);
    await SharpenAssignmentCUD.workPlaceAddressRepository.insertMany(SharpenAssignmentCUD.workPlaceAddress);
    await SharpenAssignmentCUD.profileDetailsRepository.insertMany(SharpenAssignmentCUD.profileDetail);
    await SharpenAssignmentCUD.costCenterRepository.insertMany(SharpenAssignmentCUD.costCenter);
    await SharpenAssignmentCUD.projectRoleRepository.insertMany(SharpenAssignmentCUD.projectRoles);
    await SharpenAssignmentCUD.projectRepository.insertMany(SharpenAssignmentCUD.projects);
    await SharpenAssignmentCUD.customerRepository.insertMany(SharpenAssignmentCUD.customers);
    await SharpenAssignmentCUD.resourceOrganizationsRepository.insertMany(SharpenAssignmentCUD.resourceOrganizations);
    await SharpenAssignmentCUD.resourceOrganizationItemsRepository.insertMany(SharpenAssignmentCUD.resourceOrganizationItems);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Acc01 - Total efforts, resource without CC changes'() {

    //When
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[0].ID, //resource A
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[0].ID, //request A
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    //Then 1 - I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Check 2 - I expect that assignment A is equally distributed within its duration
    assert.equal(assignmentsCreateForCapacityGridResponse.data["assignmentDurationInHours"], 1000);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC02 - Total efforts, resource with CC changes'() {

    //When
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[1].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[0].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    //Then 1 - 	I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2 - 	I expect that assignment A is equally distributed within its duration 
    assert.equal(assignmentsCreateForCapacityGridResponse.data["assignmentDurationInHours"], 1000);
    
    //Then 3 - I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);
    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 4 - I expect that there is no error when I change the assignedHours for the time-period of 01.01.23 - 31.07.23
    const validAssignmentUpdateValidPayload = {
      "bookedCapacityInHours":20,"startDate":"2023-07-01","endDate":"2023-07-31","action":0
    }
    
    const validAssignmentsUpdateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202307')`, validAssignmentUpdateValidPayload);
  
    assert.equal(validAssignmentsUpdateForCapacityGridResponse.data.timePeriod, '202307'); 
    assert.equal(validAssignmentsUpdateForCapacityGridResponse.data.bookedCapacityInHours, 20); 
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 5 - I expect that there is an error when I change the assignedHours for the time-period of 01.08.23 - 31.12.23
    const assignmentUpdateInvalidPayload = {
      "bookedCapacityInHours":20,"startDate":"2023-08-01","endDate":"2023-08-31","action":0
    }
    
    const invalidAssignmentsUpdateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202308')`, assignmentUpdateInvalidPayload);
    assert.isNotNull(invalidAssignmentsUpdateForCapacityGridResponse.data.error, 'The assignment is edited in invalid period, but the error is not raised'); 

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC03 - Total efforts, resource partially inactive'() {

    //When 
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[2].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[0].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    //Then 1: I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);
    assert.equal(assignmentsCreateForCapacityGridResponse.data["assignmentDurationInHours"], 1000);

    //Then 2: I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource
    
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);
    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 3: I expect that there is no error when I change the assignedHours for the time-period of 01.01.23 - 31.07.23
    const validAssignmentUpdateValidPayload = {
      "bookedCapacityInHours":20,"startDate":"2023-07-01","endDate":"2023-07-31","action":0
    }
    
    const validAssignmentsUpdateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202307')`, validAssignmentUpdateValidPayload);
  
    assert.equal(validAssignmentsUpdateForCapacityGridResponse.data.timePeriod, '202307'); 
    assert.equal(validAssignmentsUpdateForCapacityGridResponse.data.bookedCapacityInHours, 20); 
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);  
    
    //Then 4: I expect that there is an error when I change the assignedHours for the time-period of 01.08.23 - 31.12.23
    const assignmentUpdateInvalidPayload = {
      "bookedCapacityInHours":20,"startDate":"2023-08-01","endDate":"2023-08-31","action":0
    }
    
    const invalidAssignmentsUpdateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202308')`, assignmentUpdateInvalidPayload);
    assert.isNotNull(invalidAssignmentsUpdateForCapacityGridResponse.data.error, 'The assignment is edited in invalid period, but the error is not raised'); 

    //Then 4: I expect that I can save the assignment a duration within 01.01.23 - 31.07.23
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"].length,9);

    //There should only be distribution for 7 months where the resource is actually valid. But is it right to have 0 for the others?
    // TODO: https://jira.tools.sap/browse/EPPMC4P-7359

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC04 - Total efforts, resource inactive'() {
  
    //When
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[2].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[3].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-08-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    //Then 1 - I expect that no draft for assignment A for resource A & request A is created  
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 400);

    //Then 2 - I expect an error message assignment cannot be created because resource is inactive
    assert.equal(assignmentsCreateForCapacityGridResponse.data.error.message, 'Cannot create assignment. Resource is inactive.'); 

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC05 - Daily/weekly/monthly efforts, resource without CC changes'() {
  
  // When
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[2].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[4].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);
    
    //Then  1 - I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2 - 	I expect that assignment A is equally distributed within each weeky/month 
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][0].bookedCapacityInHours,40);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC06, ACC07 - Daily/weekly/monthly efforts, resource with CC changes, 1st CC only'() {
  
  // When
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[4].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[4].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-12-31",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Then 1 - 	I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2 - I expect that assignment A is equally distributed within each day/week/month 
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][0].bookedCapacityInHours,40);

    //Then 3 - I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);
    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 4 - I expect an warning message that the assignment could not be fulfilled for the periods 01.08.23 to 31.12.23
    assert.equal(jsonWarning.length, 6);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC08 - Daily/weekly/monthly efforts, resource with CC & resOrg changes'() {
  
    //Given
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[2].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[4].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    //When
    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Then 1: I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2: I expect that assignment A is equally distributed within each day/week/month
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][0].bookedCapacityInHours,40);

    //Then 3: I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);

    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 4: I expect an warning message that the assignment could not be fulfilled for the periods 01.08.23 to 31.12.23
    assert.equal(jsonWarning.length, 6);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC09 - Daily/weekly/monthly efforts, resource inactive'() {
  
    //Given
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[1].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[3].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-09-30",
        "requestStartDate": "2023-08-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    //When
    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Then 1: I expect that no draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 400);

    //Then 2: I expect an error message assignment cannot be created because resource is inactive
    assert.equal(assignmentsCreateForCapacityGridResponse.data.error.message,"Cannot create assignment. Resource is inactive.");    

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC10 - Daily/weekly/monthly efforts, resource partially inactive'() {
  
    //Given
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[1].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[4].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-12-31",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    //When
    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Then 1: I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2: I expect that assignment A is equally distributed within each day/week/month
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][0].bookedCapacityInHours,40);

    //Then 3: I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource  
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);
    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 4: I expect an warning message that the assignment could not be fulfilled for the periods 01.08.23 to 31.12.23
    assert.equal(jsonWarning.length, 6);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC11 - Daily/weekly/monthly efforts, resource in between inactive'() {
  
    //Given
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[5].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[4].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-12-31",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    //When
    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Then 1: I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2: I expect that assignment A is equally distributed within each day/week/month
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][0].bookedCapacityInHours,40);

    //Then 3: I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);
    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 4: I expect an warning message that the assignment could not be fulfilled for the periods 01.08.23 to 31.12.23
    assert.equal(jsonWarning.length, 6);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'ACC12 - Total efforts, resource in between inactive'() {
  
    //Given
    const assignmentPayload = {
        "resource_ID": SharpenAssignmentCUD.resourceHeader[5].ID, 
        "resourceRequest_ID": SharpenAssignmentCUD.resourceRequests[0].ID,
        "assignmentStatusCode": 0,
        "assignmentStartDate": "2023-01-01",
        "assignmentEndDate": "2023-12-31",
        "requestStartDate": "2023-01-01",
        "requestEndDate": "2023-12-31",
        "projectId": null,
        "projectName": null,
        "customerId": null,
        "customerName": null,
        "projectRoleName": "ProjectRole T9",
        "action": 0,
            "dailyAssignments":[]
  }

    //When
    const assignmentsCreateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.post('/AssignmentsDetailsForCapacityGrid',assignmentPayload);

    //Then 1: I expect that a draft for assignment A for resource A & request A is created
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 2: I expect that assignment A is equally distributed across the time-periods 01.01.23-31.07.21. 
    // The inactive period in between shall be treated the same way as a change in the cost center.
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][0].bookedCapacityInHours,161);
    assert.equal(assignmentsCreateForCapacityGridResponse.data["monthlyAggregatedAssignments"][7].bookedCapacityInHours,0);

    //Then 3: I expect a warning message that assignment A has been adapted accoding to the validity dates of the resource
    const jsonWarning = JSON.parse(assignmentsCreateForCapacityGridResponse.headers["sap-messages"]);
    assert.equal(jsonWarning[0].message,this.assignmentDatesAdjustedWarning)
    assert.equal(jsonWarning[0].numericSeverity,3);
    assert.exists(jsonWarning[0].target);

    //Then 4: I expect that there is no error when I change the assignedHours for the time-period of 01.01.23 - 31.07.23

    const validAssignmentUpdateValidPayload = {
      "bookedCapacityInHours":20,"startDate":"2023-07-01","endDate":"2023-07-31","action":0
    }
    
    const validAssignmentsUpdateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202307')`, validAssignmentUpdateValidPayload);
  
    assert.equal(validAssignmentsUpdateForCapacityGridResponse.data.timePeriod, '202307'); 
    assert.equal(validAssignmentsUpdateForCapacityGridResponse.data.bookedCapacityInHours, 20); 
    assert.equal(assignmentsCreateForCapacityGridResponse.status, 201);

    //Then 6: I expect that there is an error when I set the assignedHours > 0 for the time-period of 01.08.23 - 31.08.23
    const assignmentUpdateInvalidPayload = {
      "bookedCapacityInHours":20,"startDate":"2023-08-01","endDate":"2023-08-31","action":0
    }
    
    const invalidAssignmentsUpdateForCapacityGridResponse = await SharpenAssignmentCUD.capacityServiceClientForResMgr.patch(`/AssignmentBucketsYearMonthAggregate(assignment_ID=${assignmentsCreateForCapacityGridResponse.data.assignment_ID},timePeriod='202308')`, assignmentUpdateInvalidPayload);
    assert.isNotNull(invalidAssignmentsUpdateForCapacityGridResponse.data.error, 'The assignment is edited in invalid period, but the error is not raised'); 


  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await SharpenAssignmentCUD.resourceHeaderRepository.deleteMany(SharpenAssignmentCUD.resourceHeader);
    await SharpenAssignmentCUD.resourceCapacityRepository.deleteMany(SharpenAssignmentCUD.resourceCapacity);
    await SharpenAssignmentCUD.resourceTypesRepository.deleteMany(SharpenAssignmentCUD.resourceTypes);
    await SharpenAssignmentCUD.capacityRequirementRepository.deleteMany(SharpenAssignmentCUD.capacityRequirement);

    await SharpenAssignmentCUD.assignmentRepository.deleteMany(SharpenAssignmentCUD.assignment);
    await SharpenAssignmentCUD.assignmentBucketRepository.deleteMany(SharpenAssignmentCUD.assignmentBuckets);

    await SharpenAssignmentCUD.employeeHeaderRepository.deleteMany(SharpenAssignmentCUD.employeeHeader);
    await SharpenAssignmentCUD.workAssignmentRepository.deleteMany(SharpenAssignmentCUD.workAssignment);

    await SharpenAssignmentCUD.workforcePersonRepository.deleteMany(SharpenAssignmentCUD.workforcePerson);
    await SharpenAssignmentCUD.organizationHeaderRepository.deleteMany(SharpenAssignmentCUD.organizationHeader);

    await SharpenAssignmentCUD.organizationDetailRepository.deleteMany(SharpenAssignmentCUD.organizationDetail);
    await SharpenAssignmentCUD.jobDetailRepository.deleteMany(SharpenAssignmentCUD.jobDetail);

    await SharpenAssignmentCUD.emailRepository.deleteMany(SharpenAssignmentCUD.email);
    await SharpenAssignmentCUD.phoneRepository.deleteMany(SharpenAssignmentCUD.phone);
    await SharpenAssignmentCUD.workPlaceAddressRepository.deleteMany(SharpenAssignmentCUD.workPlaceAddress);
    await SharpenAssignmentCUD.profileDetailsRepository.deleteMany(SharpenAssignmentCUD.profileDetail);
    await SharpenAssignmentCUD.costCenterRepository.deleteMany(SharpenAssignmentCUD.costCenter);

    await SharpenAssignmentCUD.resourceRequestRepository.deleteMany(SharpenAssignmentCUD.resourceRequests);
    await SharpenAssignmentCUD.demandRepository.deleteMany(SharpenAssignmentCUD.demand);
    await SharpenAssignmentCUD.workPackageRepository.deleteMany(SharpenAssignmentCUD.workPackage);
    await SharpenAssignmentCUD.projectRoleRepository.deleteMany(SharpenAssignmentCUD.projectRoles);
    await SharpenAssignmentCUD.projectRepository.deleteMany(SharpenAssignmentCUD.projects);
    await SharpenAssignmentCUD.customerRepository.deleteMany(SharpenAssignmentCUD.customers);

    await SharpenAssignmentCUD.resourceOrganizationsRepository.deleteMany(SharpenAssignmentCUD.resourceOrganizations);
    await SharpenAssignmentCUD.resourceOrganizationItemsRepository.deleteMany(SharpenAssignmentCUD.resourceOrganizationItems);

  }

}