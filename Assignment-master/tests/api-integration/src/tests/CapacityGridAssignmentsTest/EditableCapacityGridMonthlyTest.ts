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
  ResourceSupply, ResourceSupplyRepository, ResourceOrganizations, ResourceOrganizationsRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository
} from 'test-commons';

@suite
export class EditableCapacityGridMonthlyTest {
  private static capacityServiceClientForTestUser01: AxiosInstance;
  private static capacityServiceClientForTestUser02: AxiosInstance;

  private static asgnSrvClientResourceManager: AxiosInstance;

  private static uniquifier: Uniquifier;

  private static resourceRequestRepository: ResourceRequestRepository;
  private static demandRepository: DemandRepository;
  private static workPackageRepository: WorkPackageRepository;

  private static resourceHeaderRepository: ResourceHeaderRepository;
  private static resourceCapacityRepository: ResourceCapacityRepository;
  private static assignmentRepository: AssignmentsRepository;
  private static assignmentBucketRepository: AssignmentBucketRepository;

  private static resourceSupplyRepository: ResourceSupplyRepository;
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
  private static resourceSupply: ResourceSupply[];

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

  private static assignmentIDs: string = "(";

  private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
  private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
  private static resourceOrganizations: ResourceOrganizations[];
  private static resourceOrganizationItems: ResourceOrganizationItems[];

  @timeout(TEST_TIMEOUT)
  static async before() {

    EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01 = await testEnvironment.getResourceManagerCapacityServiceClient();
    EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser02 = await testEnvironment.getAuthAttrTestUser02CapacityServiceClient();

    EditableCapacityGridMonthlyTest.asgnSrvClientResourceManager = await testEnvironment.getResourceManagerServiceClient();

    EditableCapacityGridMonthlyTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    EditableCapacityGridMonthlyTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    EditableCapacityGridMonthlyTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
    EditableCapacityGridMonthlyTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    EditableCapacityGridMonthlyTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    EditableCapacityGridMonthlyTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    EditableCapacityGridMonthlyTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    EditableCapacityGridMonthlyTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    EditableCapacityGridMonthlyTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    EditableCapacityGridMonthlyTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    EditableCapacityGridMonthlyTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    EditableCapacityGridMonthlyTest.emailRepository = await testEnvironment.getEmailRepository();
    EditableCapacityGridMonthlyTest.phoneRepository = await testEnvironment.getPhoneRepository();
    EditableCapacityGridMonthlyTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    EditableCapacityGridMonthlyTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    EditableCapacityGridMonthlyTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    EditableCapacityGridMonthlyTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    EditableCapacityGridMonthlyTest.demandRepository = await testEnvironment.getDemandRepository();
    EditableCapacityGridMonthlyTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

    EditableCapacityGridMonthlyTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    EditableCapacityGridMonthlyTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
    
    EditableCapacityGridMonthlyTest.uniquifier = new Uniquifier();
    EditableCapacityGridMonthlyTest.resourceHeader = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    EditableCapacityGridMonthlyTest.resourceCapacity = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    EditableCapacityGridMonthlyTest.assignment = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    EditableCapacityGridMonthlyTest.assignmentBuckets = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    EditableCapacityGridMonthlyTest.resourceSupply = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

    EditableCapacityGridMonthlyTest.employeeHeader = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    EditableCapacityGridMonthlyTest.workAssignment = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    EditableCapacityGridMonthlyTest.workforcePerson = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    EditableCapacityGridMonthlyTest.organizationHeader = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    EditableCapacityGridMonthlyTest.organizationDetail = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    EditableCapacityGridMonthlyTest.jobDetail = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    EditableCapacityGridMonthlyTest.email = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    EditableCapacityGridMonthlyTest.phone = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    EditableCapacityGridMonthlyTest.workPlaceAddress = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    EditableCapacityGridMonthlyTest.profileDetail = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    EditableCapacityGridMonthlyTest.costCenter = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    EditableCapacityGridMonthlyTest.resourceRequests = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    EditableCapacityGridMonthlyTest.demand = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.project.demands.csv', 'Demand');
    EditableCapacityGridMonthlyTest.workPackage = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
    EditableCapacityGridMonthlyTest.resourceOrganizations = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
    EditableCapacityGridMonthlyTest.resourceOrganizationItems = await EditableCapacityGridMonthlyTest.uniquifier.getRecords('../data/input/editableCapacityGridMonthly/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');


    await EditableCapacityGridMonthlyTest.resourceRequestRepository.insertMany(EditableCapacityGridMonthlyTest.resourceRequests);
    await EditableCapacityGridMonthlyTest.demandRepository.insertMany(EditableCapacityGridMonthlyTest.demand);
    await EditableCapacityGridMonthlyTest.workPackageRepository.insertMany(EditableCapacityGridMonthlyTest.workPackage);

    await EditableCapacityGridMonthlyTest.resourceHeaderRepository.insertMany(EditableCapacityGridMonthlyTest.resourceHeader);
    await EditableCapacityGridMonthlyTest.resourceCapacityRepository.insertMany(EditableCapacityGridMonthlyTest.resourceCapacity)
    await EditableCapacityGridMonthlyTest.assignmentRepository.insertMany(EditableCapacityGridMonthlyTest.assignment);
    await EditableCapacityGridMonthlyTest.assignmentBucketRepository.insertMany(EditableCapacityGridMonthlyTest.assignmentBuckets)
    await EditableCapacityGridMonthlyTest.resourceSupplyRepository.insertMany(EditableCapacityGridMonthlyTest.resourceSupply);
    await EditableCapacityGridMonthlyTest.employeeHeaderRepository.insertMany(EditableCapacityGridMonthlyTest.employeeHeader);
    await EditableCapacityGridMonthlyTest.workAssignmentRepository.insertMany(EditableCapacityGridMonthlyTest.workAssignment)
    await EditableCapacityGridMonthlyTest.workforcePersonRepository.insertMany(EditableCapacityGridMonthlyTest.workforcePerson);
    await EditableCapacityGridMonthlyTest.organizationHeaderRepository.insertMany(EditableCapacityGridMonthlyTest.organizationHeader)
    await EditableCapacityGridMonthlyTest.organizationDetailRepository.insertMany(EditableCapacityGridMonthlyTest.organizationDetail);
    await EditableCapacityGridMonthlyTest.jobDetailRepository.insertMany(EditableCapacityGridMonthlyTest.jobDetail)
    await EditableCapacityGridMonthlyTest.emailRepository.insertMany(EditableCapacityGridMonthlyTest.email);
    await EditableCapacityGridMonthlyTest.phoneRepository.insertMany(EditableCapacityGridMonthlyTest.phone);
    await EditableCapacityGridMonthlyTest.workPlaceAddressRepository.insertMany(EditableCapacityGridMonthlyTest.workPlaceAddress);
    await EditableCapacityGridMonthlyTest.profileDetailsRepository.insertMany(EditableCapacityGridMonthlyTest.profileDetail);
    await EditableCapacityGridMonthlyTest.costCenterRepository.insertMany(EditableCapacityGridMonthlyTest.costCenter);
    await EditableCapacityGridMonthlyTest.resourceOrganizationsRepository.insertMany(EditableCapacityGridMonthlyTest.resourceOrganizations);
    await EditableCapacityGridMonthlyTest.resourceOrganizationItemsRepository.insertMany(EditableCapacityGridMonthlyTest.resourceOrganizationItems);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Simulating multiple assignment updates on monthly grid...'() {

    //Let's try to edit this one now...
    const payload = {
      bookedCapacityInHours: 20,
      startDate: "2021-09-01",
      endDate: "2021-09-30",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ',timePeriod=\'202109\')', payload);

    assert.equal(assignmentPatchResponse.status, 200, "Assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponse.data.bookedCapacityInHours, 20, "Assignment response doesn't have the udpated booked hours");

    //Due to overriding of the on read, the status is 200 along with the latest values being returned even in failure cases, and hence an additional check to be fully sure
    assert.notExists(assignmentPatchResponse.headers["sap-messages"], "There exists a message that was not expected");

    const payloadForAnotherDay = {
      bookedCapacityInHours: 30,
      startDate: "2021-10-01",
      endDate: "2021-10-31",
      action: 0 //for edit
    }

    const assignmentPatchResponseForAnotherDay = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ',timePeriod=\'202110\')', payloadForAnotherDay);

    assert.equal(assignmentPatchResponseForAnotherDay.status, 200, "Second time assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponseForAnotherDay.data.bookedCapacityInHours, 30, "Assignment response doesn't have the udpated booked hours")

    //Due to overriding of the on read, the status is 200 along with the latest values being returned even in failure cases, and hence an additional check to be fully sure
    assert.notExists(assignmentPatchResponseForAnotherDay.headers["sap-messages"], "There exists a message that was not expected");

    const payloadForAnotherAssignment = {
      bookedCapacityInHours: 50,
      startDate: "2021-10-01",
      endDate: "2021-10-31",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponseForAnotherAssignment = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ',timePeriod=\'202110\')', payloadForAnotherAssignment);
  
    assert.equal(assignmentPatchResponseForAnotherAssignment.status, 200, "Second time assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponseForAnotherAssignment.data.bookedCapacityInHours, 50, "Assignment response doesn't have the udpated booked hours")
    //Due to overriding of the on read, the status is 200 along with the latest values being returned even in failure cases, and hence an additional check to be fully sure
    assert.notExists(assignmentPatchResponseForAnotherAssignment.headers["sap-messages"], "There exists a message that was not expected");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try updating an assignment outside the validity period.'() {

    const payload = {
      bookedCapacityInHours: 30,
      startDate: "2021-01-01",
      endDate: "2021-01-31",
      action: 0 //for edit
    }

    await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ',timePeriod=\'202101\')', payload);

    /* NOTE: Today, there is no validation done on the dates at the time of draft creation, as it is not possible to enter dates outside of the request period (something we should probably do if we want to turn this into API driven at somepoint). So we will not see an error at this juncture. But this is validated at the time of save and hence let do a save and look out for the message there instead */

    const savepayload = {
      action: 2 //for save
    }

    // Save via the header entity AssignmentsDetailsForCapacityGrid
    const assignmentPatchResponse = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ')', savepayload);

    assert.equal(assignmentPatchResponse.status, 400, "Assignment exists outside the request period. Yet no message was raised (and perhaps the assignment was saved too");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Save the udpated assignments'() {

    //Get the assignment details before update
    const assignmentBeforeSave = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.get('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ')');

    // Read the header hours before update
    let assignmentHeaderBeforeUpdate = await EditableCapacityGridMonthlyTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ',IsActiveEntity=true)');

    //Update the assignment -> Original assignment is staffed for 120h during the below dates and we are updating it to 30h 
    const payload = {
      bookedCapacityInHours: 30,
      startDate: "2021-10-01",
      endDate: "2021-10-31",
      action: 1 //for delete and edit
    }

    await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ',timePeriod=\'202110\')', payload);

    //Save the updated assignment
    const savepayload = {
      action: 2 //for save
    }

    // Save via the header entity AssignmentsDetailsForCapacityGrid
    await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ')', savepayload);

    //Read the assignment details again after save
    const assignmentAfterSave = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.get('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ')');

    // Read the header hours after update
    let assignmentHeaderAfterUpdate = await EditableCapacityGridMonthlyTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridMonthlyTest.assignment[2].ID + ',IsActiveEntity=true)');

    //Check the successful save 
    assert.notEqual(assignmentBeforeSave.data.totalRequestBookedCapacityInHours, assignmentAfterSave.data.totalRequestBookedCapacityInHours, "The booked hours isn't updated. Save doesn't seem to be successful");

    // Check update of header hours - Originally header hours should decrease by 90h
    assert.equal(assignmentHeaderAfterUpdate.data.bookedCapacityInMinutes, assignmentHeaderBeforeUpdate.data.bookedCapacityInMinutes - 5400, "Assignment header bookedCapacityInMinutes incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test the locks'() {

    const payload = {
      bookedCapacityInHours: 10,
      startDate: "2021-10-01",
      endDate: "2021-12-31",
      action: 1 //for delete and edit
    }

    await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ',timePeriod=\'202110\')', payload);

    const payload2 = {
      bookedCapacityInHours: 100,
      startDate: "2021-10-01",
      endDate: "2021-10-31",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser02.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ',timePeriod=\'202110\')', payload2);

    assert.notEqual(assignmentPatchResponse.data.error.message.search("locked"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Update a deleted assignment'() {

    //Let's try to edit this one now...
    const payload = {
      bookedCapacityInHours: 20,
      startDate: "2021-09-01",
      endDate: "2021-09-30",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[2].resourceRequest_ID + ',timePeriod=\'202109\')', payload);

    assert.equal(assignmentPatchResponse.status, 404, "Expected error on udpate on deleted assignment not seen");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Ensure validation errors are raised successfully'() {

    const payload = {
      bookedCapacityInHours: 30,
      startDate: "2020-11-01",
      endDate: "2020-11-30",
      action: 0 //for edit
    }

    const assignmentPatchResponse = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[3].ID + ',timePeriod=\'202011\')', payload);
    assert.equal(assignmentPatchResponse.status, 400, "Resource not valid in the given period, yet no message was raised");
    assert.notEqual(assignmentPatchResponse.data.error.message.search("availability"), -1, "Resource not valid in the given period, yet no message was raised");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'No resource capacity errors if resource has no capacity records and zero staffed hours'() {

    const nonZeroStaffedHoursPayload = {
      bookedCapacityInHours: 30,
      startDate: "2022-01-01",
      endDate: "2022-01-31",
      action: 0 //for edit
    }

    const assignmentPatchResponseForNonZeroStaffedHours = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ',timePeriod=\'202201\')', nonZeroStaffedHoursPayload);

    assert.notEqual(assignmentPatchResponseForNonZeroStaffedHours.data.error.message.search("The resource does not have any availability between"), -1, "Expected error message was not returned on invoking non-zero staffing for days with no resource capacity records");

    const zeroStaffedHoursPayload = {
      bookedCapacityInHours: 0,
      startDate: "2022-01-01",
      endDate: "2022-01-31",
      action: 0 //for edit
    }

    const assignmentPatchResponseForZeroStaffedHours = await EditableCapacityGridMonthlyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsYearMonthAggregate(assignment_ID=' + EditableCapacityGridMonthlyTest.assignment[0].ID + ',timePeriod=\'202201\')', zeroStaffedHoursPayload);

    assert.isUndefined(assignmentPatchResponseForZeroStaffedHours.data.error, "Error message was returned even on invoking zero staffing for days with no resource capacity records");

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    for (let i = 0; i < EditableCapacityGridMonthlyTest.assignment.length; i++) {
      const assignment = EditableCapacityGridMonthlyTest.assignment[i];

      if (i === EditableCapacityGridMonthlyTest.assignment.length - 1)
        EditableCapacityGridMonthlyTest.assignmentIDs = `${EditableCapacityGridMonthlyTest.assignmentIDs}'${assignment.ID}')`;
      else
        EditableCapacityGridMonthlyTest.assignmentIDs = `${EditableCapacityGridMonthlyTest.assignmentIDs}'${assignment.ID}',`;

    }

    let sqlStatementString = EditableCapacityGridMonthlyTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${EditableCapacityGridMonthlyTest.assignmentIDs}`);
    await EditableCapacityGridMonthlyTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
    sqlStatementString = EditableCapacityGridMonthlyTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${EditableCapacityGridMonthlyTest.assignmentIDs}`);
    await EditableCapacityGridMonthlyTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
    sqlStatementString = EditableCapacityGridMonthlyTest.assignmentBucketRepository.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', `WHERE ASSIGNMENT_ID IN ${EditableCapacityGridMonthlyTest.assignmentIDs}`);
    await EditableCapacityGridMonthlyTest.assignmentBucketRepository.statementExecutor.execute(sqlStatementString);

    await EditableCapacityGridMonthlyTest.resourceHeaderRepository.deleteMany(EditableCapacityGridMonthlyTest.resourceHeader);
    await EditableCapacityGridMonthlyTest.resourceCapacityRepository.deleteMany(EditableCapacityGridMonthlyTest.resourceCapacity);
    await EditableCapacityGridMonthlyTest.resourceSupplyRepository.deleteMany(EditableCapacityGridMonthlyTest.resourceSupply);

    await EditableCapacityGridMonthlyTest.assignmentRepository.deleteMany(EditableCapacityGridMonthlyTest.assignment);
    await EditableCapacityGridMonthlyTest.assignmentBucketRepository.deleteMany(EditableCapacityGridMonthlyTest.assignmentBuckets);

    await EditableCapacityGridMonthlyTest.employeeHeaderRepository.deleteMany(EditableCapacityGridMonthlyTest.employeeHeader);
    await EditableCapacityGridMonthlyTest.workAssignmentRepository.deleteMany(EditableCapacityGridMonthlyTest.workAssignment);

    await EditableCapacityGridMonthlyTest.workforcePersonRepository.deleteMany(EditableCapacityGridMonthlyTest.workforcePerson);
    await EditableCapacityGridMonthlyTest.organizationHeaderRepository.deleteMany(EditableCapacityGridMonthlyTest.organizationHeader);

    await EditableCapacityGridMonthlyTest.organizationDetailRepository.deleteMany(EditableCapacityGridMonthlyTest.organizationDetail);
    await EditableCapacityGridMonthlyTest.jobDetailRepository.deleteMany(EditableCapacityGridMonthlyTest.jobDetail);

    await EditableCapacityGridMonthlyTest.emailRepository.deleteMany(EditableCapacityGridMonthlyTest.email);
    await EditableCapacityGridMonthlyTest.phoneRepository.deleteMany(EditableCapacityGridMonthlyTest.phone);
    await EditableCapacityGridMonthlyTest.workPlaceAddressRepository.deleteMany(EditableCapacityGridMonthlyTest.workPlaceAddress);
    await EditableCapacityGridMonthlyTest.profileDetailsRepository.deleteMany(EditableCapacityGridMonthlyTest.profileDetail);
    await EditableCapacityGridMonthlyTest.costCenterRepository.deleteMany(EditableCapacityGridMonthlyTest.costCenter);

    await EditableCapacityGridMonthlyTest.resourceRequestRepository.deleteMany(EditableCapacityGridMonthlyTest.resourceRequests);
    await EditableCapacityGridMonthlyTest.demandRepository.deleteMany(EditableCapacityGridMonthlyTest.demand);
    await EditableCapacityGridMonthlyTest.workPackageRepository.deleteMany(EditableCapacityGridMonthlyTest.workPackage);

    await EditableCapacityGridMonthlyTest.resourceOrganizationsRepository.deleteMany(EditableCapacityGridMonthlyTest.resourceOrganizations);
    await EditableCapacityGridMonthlyTest.resourceOrganizationItemsRepository.deleteMany(EditableCapacityGridMonthlyTest.resourceOrganizationItems);

  }

}