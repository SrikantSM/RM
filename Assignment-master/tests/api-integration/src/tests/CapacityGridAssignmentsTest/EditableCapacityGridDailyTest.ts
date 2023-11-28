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
export class EditableCapacityGridDailyTest {
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

    EditableCapacityGridDailyTest.capacityServiceClientForTestUser01 = await testEnvironment.getResourceManagerCapacityServiceClient();
    EditableCapacityGridDailyTest.capacityServiceClientForTestUser02 = await testEnvironment.getAuthAttrTestUser02CapacityServiceClient();

    EditableCapacityGridDailyTest.asgnSrvClientResourceManager = await testEnvironment.getResourceManagerServiceClient();

    EditableCapacityGridDailyTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    EditableCapacityGridDailyTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    EditableCapacityGridDailyTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
    EditableCapacityGridDailyTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    EditableCapacityGridDailyTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    EditableCapacityGridDailyTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    EditableCapacityGridDailyTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    EditableCapacityGridDailyTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    EditableCapacityGridDailyTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    EditableCapacityGridDailyTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    EditableCapacityGridDailyTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    EditableCapacityGridDailyTest.emailRepository = await testEnvironment.getEmailRepository();
    EditableCapacityGridDailyTest.phoneRepository = await testEnvironment.getPhoneRepository();
    EditableCapacityGridDailyTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    EditableCapacityGridDailyTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    EditableCapacityGridDailyTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    EditableCapacityGridDailyTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    EditableCapacityGridDailyTest.demandRepository = await testEnvironment.getDemandRepository();
    EditableCapacityGridDailyTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

    EditableCapacityGridDailyTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    EditableCapacityGridDailyTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

    EditableCapacityGridDailyTest.uniquifier = new Uniquifier();
    EditableCapacityGridDailyTest.resourceHeader = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    EditableCapacityGridDailyTest.resourceCapacity = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    EditableCapacityGridDailyTest.assignment = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    EditableCapacityGridDailyTest.assignmentBuckets = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    EditableCapacityGridDailyTest.resourceSupply = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

    EditableCapacityGridDailyTest.employeeHeader = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    EditableCapacityGridDailyTest.workAssignment = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    EditableCapacityGridDailyTest.workforcePerson = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    EditableCapacityGridDailyTest.organizationHeader = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

    EditableCapacityGridDailyTest.organizationDetail = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    EditableCapacityGridDailyTest.jobDetail = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    EditableCapacityGridDailyTest.email = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    EditableCapacityGridDailyTest.phone = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    EditableCapacityGridDailyTest.workPlaceAddress = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    EditableCapacityGridDailyTest.profileDetail = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    EditableCapacityGridDailyTest.costCenter = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    EditableCapacityGridDailyTest.resourceRequests = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    EditableCapacityGridDailyTest.demand = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.project.demands.csv', 'Demand');
    EditableCapacityGridDailyTest.workPackage = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

    EditableCapacityGridDailyTest.resourceOrganizations = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
    EditableCapacityGridDailyTest.resourceOrganizationItems = await EditableCapacityGridDailyTest.uniquifier.getRecords('../data/input/editableCapacityGridDaily/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');


    await EditableCapacityGridDailyTest.resourceRequestRepository.insertMany(EditableCapacityGridDailyTest.resourceRequests);
    await EditableCapacityGridDailyTest.demandRepository.insertMany(EditableCapacityGridDailyTest.demand);
    await EditableCapacityGridDailyTest.workPackageRepository.insertMany(EditableCapacityGridDailyTest.workPackage);

    await EditableCapacityGridDailyTest.resourceHeaderRepository.insertMany(EditableCapacityGridDailyTest.resourceHeader);
    await EditableCapacityGridDailyTest.resourceCapacityRepository.insertMany(EditableCapacityGridDailyTest.resourceCapacity)
    await EditableCapacityGridDailyTest.assignmentRepository.insertMany(EditableCapacityGridDailyTest.assignment);
    await EditableCapacityGridDailyTest.assignmentBucketRepository.insertMany(EditableCapacityGridDailyTest.assignmentBuckets)
    await EditableCapacityGridDailyTest.resourceSupplyRepository.insertMany(EditableCapacityGridDailyTest.resourceSupply);
    await EditableCapacityGridDailyTest.employeeHeaderRepository.insertMany(EditableCapacityGridDailyTest.employeeHeader);
    await EditableCapacityGridDailyTest.workAssignmentRepository.insertMany(EditableCapacityGridDailyTest.workAssignment)
    await EditableCapacityGridDailyTest.workforcePersonRepository.insertMany(EditableCapacityGridDailyTest.workforcePerson);
    await EditableCapacityGridDailyTest.organizationHeaderRepository.insertMany(EditableCapacityGridDailyTest.organizationHeader)
    await EditableCapacityGridDailyTest.organizationDetailRepository.insertMany(EditableCapacityGridDailyTest.organizationDetail);
    await EditableCapacityGridDailyTest.jobDetailRepository.insertMany(EditableCapacityGridDailyTest.jobDetail)
    await EditableCapacityGridDailyTest.emailRepository.insertMany(EditableCapacityGridDailyTest.email);
    await EditableCapacityGridDailyTest.phoneRepository.insertMany(EditableCapacityGridDailyTest.phone);
    await EditableCapacityGridDailyTest.workPlaceAddressRepository.insertMany(EditableCapacityGridDailyTest.workPlaceAddress);
    await EditableCapacityGridDailyTest.profileDetailsRepository.insertMany(EditableCapacityGridDailyTest.profileDetail);
    await EditableCapacityGridDailyTest.costCenterRepository.insertMany(EditableCapacityGridDailyTest.costCenter);
    await EditableCapacityGridDailyTest.resourceOrganizationsRepository.insertMany(EditableCapacityGridDailyTest.resourceOrganizations);
    await EditableCapacityGridDailyTest.resourceOrganizationItemsRepository.insertMany(EditableCapacityGridDailyTest.resourceOrganizationItems);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Simulating multiple assignment updates on daily grid...'() {

    //Let's try to edit this one now...
    const payload = {
      bookedCapacityInHours: 20,
      date: "2021-09-01",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ',timePeriod=\'2021-09-01\')', payload);

    assert.equal(assignmentPatchResponse.status, 200, "Assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponse.data.bookedCapacityInHours, 20, "Assignment response doesn't have the udpated booked hours");

    //Due to overriding of the on read, the status is 200 along with the latest values being returned even in failure cases, and hence an additional check to be fully sure
    assert.notExists(assignmentPatchResponse.headers["sap-messages"], "There exists a message that was not expected");

    const payloadForAnotherDay = {
      bookedCapacityInHours: 30,
      date: "2021-10-01",
      action: 0 //for edit
    }

    const assignmentPatchResponseAnotherDay = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ',timePeriod=\'2021-10-01\')', payloadForAnotherDay);

    assert.equal(assignmentPatchResponseAnotherDay.status, 200, "Second time assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponseAnotherDay.data.bookedCapacityInHours, 30, "Assignment response doesn't have the udpated booked hours")

    //Due to overriding of the on read, the status is 200 along with the latest values being returned even in failure cases, and hence an additional check to be fully sure
    assert.notExists(assignmentPatchResponseAnotherDay.headers["sap-messages"], "There exists a message that was not expected");

    const payloadForAnotherAssignment = {
      bookedCapacityInHours: 50,
      date: "2021-10-01",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponseDifferentAssignment = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ',timePeriod=\'202110\')', payloadForAnotherAssignment);

    assert.equal(assignmentPatchResponseDifferentAssignment.status, 200, "Second time assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponseDifferentAssignment.data.bookedCapacityInHours, 50, "Assignment response doesn't have the udpated booked hours")
    //Due to overriding of the on read, the status is 200 along with the latest values being returned even in failure cases, and hence an additional check to be fully sure
    assert.notExists(assignmentPatchResponseDifferentAssignment.headers["sap-messages"], "There exists a message that was not expected");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try updating an assignment outside the validity period.'() {

    const payload = {
      bookedCapacityInHours: 30,
      date: "2021-01-01",
      action: 0 //for edit
    }

    await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ',timePeriod=\'2021-01-01\')', payload);

    /* NOTE: Today, there is no validation done on the dates at the time of draft creation, as it is not possible to enter dates outside of the request period (something we should probably do if we want to turn this into API driven at somepoint). So we will not see an error at this juncture. But this is validated at the time of save and hence let do a save and look out for the message there instead */

    const savepayload = {
      action: 2 //for save
    }

    // Save via the header entity AssignmentsDetailsForCapacityGrid
    const assignmentPatchResponse = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ')', savepayload);

    assert.equal(assignmentPatchResponse.status, 400, "Assignment exists outside the request period. Yet no message was raised (and perhaps the assignment was saved too");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Save the udpated assignments'() {

    //Get the assignment details before update
    const assignmentBeforeSave = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.get('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ')');

    // Read the header hours before update
    let assignmentHeaderBeforeUpdate = await EditableCapacityGridDailyTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ',IsActiveEntity=true)');

    //Update the assignment, On 10.01.2021, the assignment bucket is for 7h and we are updating it here to 30h -> increase of 23h
    const payload = {
      bookedCapacityInHours: 30,
      date: "2021-10-01",
      action: 1 //for delete old draft and edit new
    }

    await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ',timePeriod=\'2021-10-01\')', payload);

    //Save the updated assignment
    const savepayload = {
      action: 2 //for save
    }

    // Save via the header entity AssignmentsDetailsForCapacityGrid
    await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ')', savepayload);

    //Read the assignment details again after save
    const assignmentAfterSave = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.get('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ')');

    // Read the header hours after update
    let assignmentHeaderAfterUpdate = await EditableCapacityGridDailyTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridDailyTest.assignment[2].ID + ',IsActiveEntity=true)');

    //Check the successful save 
    assert.notEqual(assignmentBeforeSave.data.totalRequestBookedCapacityInHours, assignmentAfterSave.data.totalRequestBookedCapacityInHours, "The booked hours isn't updated. Save doesn't seem to be successful");

    // Check update of header hours - Originally header hours should increase by 23h
    assert.equal(assignmentHeaderAfterUpdate.data.bookedCapacityInMinutes, assignmentHeaderBeforeUpdate.data.bookedCapacityInMinutes + 1380, "Assignment header bookedCapacityInMinutes incorrect");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test the locks'() {

    const payload = {
      bookedCapacityInHours: 10,
      date: "2021-10-01",
      action: 1 //for delete and edit
    }

    await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ',timePeriod=\'2021-10-01\')', payload);

    const payload2 = {
      bookedCapacityInHours: 100,
      date: "2021-10-01",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser02.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ',timePeriod=\'2021-10-01\')', payload2);

    assert.notEqual(assignmentPatchResponse.data.error.message.search("locked"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Update a deleted assignment'() {

    //Let's try to edit this one now...
    const payload = {
      bookedCapacityInHours: 20,
      date: "2021-09-01",
      action: 1 //for delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[2].resourceRequest_ID + ',timePeriod=\'2021-09-01\')', payload);

    assert.equal(assignmentPatchResponse.status, 404, "Expected error on udpate on deleted assignment not seen");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Ensure validation errors are raised successfully'() {

    const payload = {
      bookedCapacityInHours: 30,
      date: "2020-11-01",
      action: 0 //for edit
    }

    const assignmentPatchResponse = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[3].ID + ',timePeriod=\'2020-01-01\')', payload);

    assert.equal(assignmentPatchResponse.status, 400, "Resource not valid in the given period, yet no message was raised");
    assert.notEqual(assignmentPatchResponse.data.error.message.search("availability"), -1, "Resource not valid in the given period, yet no message was raised");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Ensure assignment creation is possible on a day with zero capacity'() {

    const payload = {
      bookedCapacityInHours: 7,
      date: "2021-10-10",
      action: 1 //delete and edit
    }

    const assignmentPatchResponse = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[1].ID + ',timePeriod=\'2021-10-10\')', payload);
    assert.equal(assignmentPatchResponse.status, 200, "Assignment udpate was unsuccessful! Status is not 200!");
    assert.equal(assignmentPatchResponse.data.bookedCapacityInHours, 7, "Assignment response doesn't have the udpated booked hours");

  }

  @test(timeout(TEST_TIMEOUT))
  async 'No resource capacity errors if resource has no capacity records and zero staffed hours'() {

    const nonZeroStaffedHoursPayload = {
      bookedCapacityInHours: 30,
      date: "2022-01-01",
      action: 0 //for edit
    }

    const assignmentPatchResponseForNonZeroStaffedHours = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ',timePeriod=\'2022-01-01\')', nonZeroStaffedHoursPayload);

    assert.notEqual(assignmentPatchResponseForNonZeroStaffedHours.data.error.message.search("The resource does not have any availability between"), -1, "Expected error message was not returned on invoking non-zero staffing for days with no resource capacity records");

    const zeroStaffedHoursPayload = {
      bookedCapacityInHours: 0,
      date: "2022-01-01",
      action: 0 //for edit
    }

    const assignmentPatchResponseForZeroStaffedHours = await EditableCapacityGridDailyTest.capacityServiceClientForTestUser01.patch('AssignmentBucketsPerDay(assignment_ID=' + EditableCapacityGridDailyTest.assignment[0].ID + ',timePeriod=\'2022-01-01\')', zeroStaffedHoursPayload);

    assert.isUndefined(assignmentPatchResponseForZeroStaffedHours.data.error, "Error message was returned even on invoking zero staffing for days with no resource capacity records");

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    for (let i = 0; i < EditableCapacityGridDailyTest.assignment.length; i++) {
      const assignment = EditableCapacityGridDailyTest.assignment[i];

      if (i === EditableCapacityGridDailyTest.assignment.length - 1)
        EditableCapacityGridDailyTest.assignmentIDs = `${EditableCapacityGridDailyTest.assignmentIDs}'${assignment.ID}')`;
      else
        EditableCapacityGridDailyTest.assignmentIDs = `${EditableCapacityGridDailyTest.assignmentIDs}'${assignment.ID}',`;

    }

    let sqlStatementString = EditableCapacityGridDailyTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${EditableCapacityGridDailyTest.assignmentIDs}`);
    await EditableCapacityGridDailyTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
    sqlStatementString = EditableCapacityGridDailyTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${EditableCapacityGridDailyTest.assignmentIDs}`);
    await EditableCapacityGridDailyTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
    sqlStatementString = EditableCapacityGridDailyTest.assignmentBucketRepository.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', `WHERE ASSIGNMENT_ID IN ${EditableCapacityGridDailyTest.assignmentIDs}`);
    await EditableCapacityGridDailyTest.assignmentBucketRepository.statementExecutor.execute(sqlStatementString);

    await EditableCapacityGridDailyTest.resourceHeaderRepository.deleteMany(EditableCapacityGridDailyTest.resourceHeader);
    await EditableCapacityGridDailyTest.resourceCapacityRepository.deleteMany(EditableCapacityGridDailyTest.resourceCapacity);
    await EditableCapacityGridDailyTest.resourceSupplyRepository.deleteMany(EditableCapacityGridDailyTest.resourceSupply);

    await EditableCapacityGridDailyTest.assignmentRepository.deleteMany(EditableCapacityGridDailyTest.assignment);
    await EditableCapacityGridDailyTest.assignmentBucketRepository.deleteMany(EditableCapacityGridDailyTest.assignmentBuckets);

    await EditableCapacityGridDailyTest.employeeHeaderRepository.deleteMany(EditableCapacityGridDailyTest.employeeHeader);
    await EditableCapacityGridDailyTest.workAssignmentRepository.deleteMany(EditableCapacityGridDailyTest.workAssignment);

    await EditableCapacityGridDailyTest.workforcePersonRepository.deleteMany(EditableCapacityGridDailyTest.workforcePerson);
    await EditableCapacityGridDailyTest.organizationHeaderRepository.deleteMany(EditableCapacityGridDailyTest.organizationHeader);

    await EditableCapacityGridDailyTest.organizationDetailRepository.deleteMany(EditableCapacityGridDailyTest.organizationDetail);
    await EditableCapacityGridDailyTest.jobDetailRepository.deleteMany(EditableCapacityGridDailyTest.jobDetail);

    await EditableCapacityGridDailyTest.emailRepository.deleteMany(EditableCapacityGridDailyTest.email);
    await EditableCapacityGridDailyTest.phoneRepository.deleteMany(EditableCapacityGridDailyTest.phone);
    await EditableCapacityGridDailyTest.workPlaceAddressRepository.deleteMany(EditableCapacityGridDailyTest.workPlaceAddress);
    await EditableCapacityGridDailyTest.profileDetailsRepository.deleteMany(EditableCapacityGridDailyTest.profileDetail);
    await EditableCapacityGridDailyTest.costCenterRepository.deleteMany(EditableCapacityGridDailyTest.costCenter);

    await EditableCapacityGridDailyTest.resourceRequestRepository.deleteMany(EditableCapacityGridDailyTest.resourceRequests);
    await EditableCapacityGridDailyTest.demandRepository.deleteMany(EditableCapacityGridDailyTest.demand);
    await EditableCapacityGridDailyTest.workPackageRepository.deleteMany(EditableCapacityGridDailyTest.workPackage);

    await EditableCapacityGridDailyTest.resourceOrganizationsRepository.deleteMany(EditableCapacityGridDailyTest.resourceOrganizations);
    await EditableCapacityGridDailyTest.resourceOrganizationItemsRepository.deleteMany(EditableCapacityGridDailyTest.resourceOrganizationItems);
  }

}