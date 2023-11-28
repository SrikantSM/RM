import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';

import {
  EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
  WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  Email, EmailRepository, Phone, PhoneRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ProfileDetail, ProfileDetailRepository,
  OrganizationDetail, OrganizationDetailRepository, JobDetail, JobDetailRepository,
  CostCenterRepository, CostCenter,
  CostCenterAttribute, CostCenterAttributeRepository, BookedCapacityAggregateRepository
} from 'test-commons';
import { CapacityGridDailyUtilizationTemporal, CapacityGridHeaderTemporal } from '../../utils';

// This test checks for the presence of same resource with 2 work assignments with different ID's but with same resource details lying in the same year
// It is a valid scenario where in if we query for the current year timeframe, in that case, duplicate resource ID's should not be returned.
@suite
export class CapacityGridDailyUtilizationMultipleWorkAssignmentsTest {
  private static capacityServiceClientForResMgr: AxiosInstance;

  private static uniquifier: Uniquifier;
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
  private static costCenterAttribute: CostCenterAttribute[];
  private static costCenterAttributeRepository: CostCenterAttributeRepository;
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

  private static resourceIdConcatenatedString: String;

  @timeout(TEST_TIMEOUT)
  static async before() {
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();

    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier = new Uniquifier();
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeader = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceCapacity = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignment = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentBuckets = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.employeeHeader = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workAssignment = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workforcePerson = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.organizationDetail = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.jobDetail = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.email = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.phone = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workPlaceAddress = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.profileDetail = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenter = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');
    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterAttribute = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridDailyUtilization/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.organization-CostCenterAttributes.csv', 'CostCenterAttribute');

    CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceIdConcatenatedString = CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.getResourceIdConcatenatedString(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeader.map(r => r.ID));

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeaderRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeader);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceCapacityRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceCapacity);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignment);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentBucketRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentBuckets);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.employeeHeaderRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.employeeHeader);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workAssignmentRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workAssignment);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workforcePersonRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workforcePerson);
    
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.organizationDetailRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.organizationDetail);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.jobDetailRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.jobDetail);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.emailRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.email);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.phoneRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.phone);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workPlaceAddressRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workPlaceAddress);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.profileDetailsRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.profileDetail);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenter);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterAttributeRepository.insertMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterAttribute);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.updateResourceBookedCapacityAggregateTable();

  }

  static async updateResourceBookedCapacityAggregateTable() {

    const statement = `UPSERT COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE SELECT RESOURCE_ID AS RESOURCEID, STARTTIME, SUM(BOOKEDCAPACITYINMINUTES) AS BOOKEDCAPACITYINMINUTES, 0 AS SOFTBOOKEDCAPACITYINMINUTES FROM COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETSVIEW WHERE STARTTIME IS NOT NULL AND RESOURCE_ID IN ${CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceIdConcatenatedString} GROUP BY STARTTIME, RESOURCE_ID`;
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentRepository.statementExecutor.execute(statement);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Testing capacity grid,Daily Utilization entity should return results only for valid work assignments maintained during the 1st half of the year'() {

    const expectedCapacityGridDailyUtilizationResponse: CapacityGridDailyUtilizationTemporal[] = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridDailyUtilization4MonthsReadMultipleTimeSliceResponse.csv', 'CapacityGridDailyUtilizationTemporal');
    const expectedCapacityGridHeaderResponse: CapacityGridHeaderTemporal[] = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridHeader4MonthsReadMultipleTimeSliceResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponse = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-05-31T00:00:00Z' } });
    const CapacityGridDailyUtilizationActualResponse = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.capacityServiceClientForResMgr.get('capacityGridDailyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-05-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridDailyUtilizationActualResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        if (expectedCapacityGridHeaderRecord.ID == capacityGridHeaderResponseRecord.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecord.ID, expectedCapacityGridHeaderRecord.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.startDate, expectedCapacityGridHeaderRecord.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.costCenter, expectedCapacityGridHeaderRecord.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.costCenterName, expectedCapacityGridHeaderRecord.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.emailAddress, expectedCapacityGridHeaderRecord.emailAddress, 'Expected emailAddress in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.mobileNumber, expectedCapacityGridHeaderRecord.mobileNumber, 'Expected mobileNumber in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.country, expectedCapacityGridHeaderRecord.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.resourceName, expectedCapacityGridHeaderRecord.resourceName, 'Expected resourceName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.firstName, expectedCapacityGridHeaderRecord.firstName, 'Expected firstName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.lastName, expectedCapacityGridHeaderRecord.lastName, 'Expected lastName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.jobTitle, expectedCapacityGridHeaderRecord.jobTitle, 'Expected role in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridDailyUtilizationResponse.forEach(expectedCapacityGridDailyUtilizationRecord => {
      var currentRecordFound = false;
      CapacityGridDailyUtilizationActualResponse.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridDailyUtilizationTemporal) => {
        if ((expectedCapacityGridDailyUtilizationRecord.ID == CapacityGridDailyUtilizationResponseRecord.ID) &&
          (expectedCapacityGridDailyUtilizationRecord.timePeriod == CapacityGridDailyUtilizationResponseRecord.timePeriod)) {
          currentRecordFound = true;
          assert.equal(CapacityGridDailyUtilizationResponseRecord.timePeriod, expectedCapacityGridDailyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.utilization, Number(expectedCapacityGridDailyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.bookedHours, expectedCapacityGridDailyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.availableHours, expectedCapacityGridDailyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridDailyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridDailyUtilization');
    });

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Testing capacity grid,Daily Utilization entity should return results only for valid work assignments maintained during the 2nd half of the year'() {

    const expectedCapacityGridDailyUtilizationResponse: CapacityGridDailyUtilizationTemporal[] = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridDailyUtilization3MonthsReadMultipleTimeSliceResponse.csv', 'CapacityGridDailyUtilizationTemporal');
    const expectedCapacityGridHeaderResponse: CapacityGridHeaderTemporal[] = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridHeader3MonthsReadMultipleTimeSliceResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponse = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });
    const CapacityGridDailyUtilizationActualResponse = await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.capacityServiceClientForResMgr.get('capacityGridDailyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridDailyUtilizationActualResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        if (expectedCapacityGridHeaderRecord.ID == capacityGridHeaderResponseRecord.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecord.ID, expectedCapacityGridHeaderRecord.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.startDate, expectedCapacityGridHeaderRecord.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.costCenter, expectedCapacityGridHeaderRecord.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.costCenterName, expectedCapacityGridHeaderRecord.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.emailAddress, expectedCapacityGridHeaderRecord.emailAddress, 'Expected emailAddress in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.mobileNumber, expectedCapacityGridHeaderRecord.mobileNumber, 'Expected mobileNumber in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.country, expectedCapacityGridHeaderRecord.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.resourceName, expectedCapacityGridHeaderRecord.resourceName, 'Expected resourceName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.firstName, expectedCapacityGridHeaderRecord.firstName, 'Expected firstName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.lastName, expectedCapacityGridHeaderRecord.lastName, 'Expected lastName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.jobTitle, expectedCapacityGridHeaderRecord.jobTitle, 'Expected role in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridDailyUtilizationResponse.forEach(expectedCapacityGridDailyUtilizationRecord => {
      var currentRecordFound = false;
      CapacityGridDailyUtilizationActualResponse.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridDailyUtilizationTemporal) => {
        if ((expectedCapacityGridDailyUtilizationRecord.ID == CapacityGridDailyUtilizationResponseRecord.ID) &&
          (expectedCapacityGridDailyUtilizationRecord.timePeriod == CapacityGridDailyUtilizationResponseRecord.timePeriod)) {
          currentRecordFound = true;
          assert.equal(CapacityGridDailyUtilizationResponseRecord.timePeriod, expectedCapacityGridDailyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.utilization, Number(expectedCapacityGridDailyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.bookedHours, expectedCapacityGridDailyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.availableHours, expectedCapacityGridDailyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridDailyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridDailyUtilization');
    });

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeaderRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceHeader);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceCapacityRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceCapacity);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignment);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentBucketRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.assignmentBuckets);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.employeeHeaderRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.employeeHeader);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workAssignmentRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workAssignment);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workforcePersonRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workforcePerson);
    
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.organizationDetailRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.organizationDetail);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.jobDetailRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.jobDetail);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.emailRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.email);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.phoneRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.phone);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workPlaceAddressRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.workPlaceAddress);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.profileDetailsRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.profileDetail);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenter);
    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterAttributeRepository.deleteMany(CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.costCenterAttribute);

    await CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.cleanUpResourceBookedCapacityTable();

  }

  static async cleanUpResourceBookedCapacityTable() {

    let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();

    let deleteResourceBookedCapacityRecordsStatement = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${CapacityGridDailyUtilizationMultipleWorkAssignmentsTest.resourceIdConcatenatedString}`);
    await bookedCapacityAggregateRepository.statementExecutor.execute(deleteResourceBookedCapacityRecordsStatement);

  }

  static getResourceIdConcatenatedString(resourceIDArray: string[]): String {
    let resIdConcatenatedString: String = '( ';
    resIdConcatenatedString = `${resIdConcatenatedString} '${resourceIDArray[0]}'`;
    for (var i = 1; i < resourceIDArray.length; i++) {
      resIdConcatenatedString = `${resIdConcatenatedString}, '${resourceIDArray[i]}'`;
    }
    resIdConcatenatedString = `${resIdConcatenatedString} )`;
    return resIdConcatenatedString;
  }

}