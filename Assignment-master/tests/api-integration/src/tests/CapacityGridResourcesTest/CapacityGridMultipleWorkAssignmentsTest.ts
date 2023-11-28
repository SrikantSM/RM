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
import { CapacityGridMonthlyUtilizationTemporal, CapacityGridHeaderTemporal } from '../../utils';

// This test checks for the presence of same resource with 2 work assignments with different ID's but with same resource details lying in the same year
// It is a valid scenario where in if we query for the current year timeframe, in that case, duplicate resource ID's should not be returned.
@suite
export class CapacityGridMultipleWorkAssignmentsTest {
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
    CapacityGridMultipleWorkAssignmentsTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridMultipleWorkAssignmentsTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridMultipleWorkAssignmentsTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridMultipleWorkAssignmentsTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridMultipleWorkAssignmentsTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridMultipleWorkAssignmentsTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridMultipleWorkAssignmentsTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridMultipleWorkAssignmentsTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridMultipleWorkAssignmentsTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridMultipleWorkAssignmentsTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

    CapacityGridMultipleWorkAssignmentsTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridMultipleWorkAssignmentsTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridMultipleWorkAssignmentsTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridMultipleWorkAssignmentsTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridMultipleWorkAssignmentsTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
    CapacityGridMultipleWorkAssignmentsTest.costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();

    CapacityGridMultipleWorkAssignmentsTest.uniquifier = new Uniquifier();
    CapacityGridMultipleWorkAssignmentsTest.resourceHeader = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridMultipleWorkAssignmentsTest.resourceCapacity = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridMultipleWorkAssignmentsTest.assignment = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridMultipleWorkAssignmentsTest.assignmentBuckets = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridMultipleWorkAssignmentsTest.employeeHeader = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridMultipleWorkAssignmentsTest.workAssignment = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridMultipleWorkAssignmentsTest.workforcePerson = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    
    CapacityGridMultipleWorkAssignmentsTest.organizationDetail = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridMultipleWorkAssignmentsTest.jobDetail = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridMultipleWorkAssignmentsTest.email = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridMultipleWorkAssignmentsTest.phone = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridMultipleWorkAssignmentsTest.workPlaceAddress = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridMultipleWorkAssignmentsTest.profileDetail = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridMultipleWorkAssignmentsTest.costCenter = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');
    CapacityGridMultipleWorkAssignmentsTest.costCenterAttribute = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridMultipleWorkAssignments3Months/com.sap.resourceManagement.organization-CostCenterAttributes.csv', 'CostCenterAttribute');

    CapacityGridMultipleWorkAssignmentsTest.resourceIdConcatenatedString = CapacityGridMultipleWorkAssignmentsTest.getResourceIdConcatenatedString(CapacityGridMultipleWorkAssignmentsTest.resourceHeader.map(r => r.ID));

    await CapacityGridMultipleWorkAssignmentsTest.resourceHeaderRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.resourceHeader);
    await CapacityGridMultipleWorkAssignmentsTest.resourceCapacityRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.resourceCapacity);

    await CapacityGridMultipleWorkAssignmentsTest.assignmentRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.assignment);
    await CapacityGridMultipleWorkAssignmentsTest.assignmentBucketRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.assignmentBuckets);

    await CapacityGridMultipleWorkAssignmentsTest.employeeHeaderRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.employeeHeader);
    await CapacityGridMultipleWorkAssignmentsTest.workAssignmentRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.workAssignment);

    await CapacityGridMultipleWorkAssignmentsTest.workforcePersonRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.workforcePerson);
    
    await CapacityGridMultipleWorkAssignmentsTest.organizationDetailRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.organizationDetail);
    await CapacityGridMultipleWorkAssignmentsTest.jobDetailRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.jobDetail);

    await CapacityGridMultipleWorkAssignmentsTest.emailRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.email);
    await CapacityGridMultipleWorkAssignmentsTest.phoneRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.phone);
    await CapacityGridMultipleWorkAssignmentsTest.workPlaceAddressRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.workPlaceAddress);
    await CapacityGridMultipleWorkAssignmentsTest.profileDetailsRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.profileDetail);
    await CapacityGridMultipleWorkAssignmentsTest.costCenterRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.costCenter);
    await CapacityGridMultipleWorkAssignmentsTest.costCenterAttributeRepository.insertMany(CapacityGridMultipleWorkAssignmentsTest.costCenterAttribute);

    await CapacityGridMultipleWorkAssignmentsTest.updateResourceBookedCapacityAggregateTable();

  }

  static async updateResourceBookedCapacityAggregateTable() {

    const statement = `UPSERT COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE SELECT RESOURCE_ID AS RESOURCEID, STARTTIME, SUM(BOOKEDCAPACITYINMINUTES) AS BOOKEDCAPACITYINMINUTES, 0 AS SOFTBOOKEDCAPACITYINMINUTES FROM COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETSVIEW WHERE STARTTIME IS NOT NULL AND RESOURCE_ID IN ${CapacityGridMultipleWorkAssignmentsTest.resourceIdConcatenatedString} GROUP BY STARTTIME, RESOURCE_ID`;
    await CapacityGridMultipleWorkAssignmentsTest.assignmentRepository.statementExecutor.execute(statement);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Testing capacity grid,if there are multiple work assignments maintained against the same resource which are valid for current year'() {

    // Changes for temporal entities 
    const expectedCapacityGridMonthlyUtilizationTempResponse: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilizationMultipleTimeSlicesResponse.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeaderTempResponse: CapacityGridHeaderTemporal[] = await CapacityGridMultipleWorkAssignmentsTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderTempMultipleTimeSlicesResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponse = await CapacityGridMultipleWorkAssignmentsTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });
    const capacityGridMonthlyUtilizationActualResponse = await CapacityGridMultipleWorkAssignmentsTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActualResponse.status, 200, 'Expected status code to be 200 (OK)');

    // temporal response 
    expectedCapacityGridHeaderTempResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
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
          assert.equal(capacityGridHeaderResponseRecord.jobTitle, expectedCapacityGridHeaderRecord.jobTitle, 'Expected jobtitle in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.bookedHours, expectedCapacityGridHeaderRecord.bookedHours, 'Expected bookedHours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.availableHours, expectedCapacityGridHeaderRecord.availableHours, 'Expected availableHours in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });



    //Temporal Response Assertions for monthly utilization 

    expectedCapacityGridMonthlyUtilizationTempResponse.forEach(expectedCapacityGridMonthlyUtilizationRecord => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActualResponse.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
        if ((expectedCapacityGridMonthlyUtilizationRecord.ID == capacityGridMonthlyUtilizationResponseRecord.ID) &&
          (expectedCapacityGridMonthlyUtilizationRecord.timePeriod == capacityGridMonthlyUtilizationResponseRecord.timePeriod)) {
          currentRecordFound = true;
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.timePeriod, expectedCapacityGridMonthlyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response in monthly utilization temporal");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.utilization, Number(expectedCapacityGridMonthlyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response in monthly utilization temporal");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.bookedHours, expectedCapacityGridMonthlyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response in monthly utilization temporal");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.availableHours, expectedCapacityGridMonthlyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response in monthly utilization temporal");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridMonthlyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response in monthly utilization temporal");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridmonthlyutilization temporal');
    });

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridMultipleWorkAssignmentsTest.resourceHeaderRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.resourceHeader);
    await CapacityGridMultipleWorkAssignmentsTest.resourceCapacityRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.resourceCapacity);

    await CapacityGridMultipleWorkAssignmentsTest.assignmentRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.assignment);
    await CapacityGridMultipleWorkAssignmentsTest.assignmentBucketRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.assignmentBuckets);

    await CapacityGridMultipleWorkAssignmentsTest.employeeHeaderRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.employeeHeader);
    await CapacityGridMultipleWorkAssignmentsTest.workAssignmentRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.workAssignment);

    await CapacityGridMultipleWorkAssignmentsTest.workforcePersonRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.workforcePerson);
    
    await CapacityGridMultipleWorkAssignmentsTest.organizationDetailRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.organizationDetail);
    await CapacityGridMultipleWorkAssignmentsTest.jobDetailRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.jobDetail);

    await CapacityGridMultipleWorkAssignmentsTest.emailRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.email);
    await CapacityGridMultipleWorkAssignmentsTest.phoneRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.phone);
    await CapacityGridMultipleWorkAssignmentsTest.workPlaceAddressRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.workPlaceAddress);
    await CapacityGridMultipleWorkAssignmentsTest.profileDetailsRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.profileDetail);
    await CapacityGridMultipleWorkAssignmentsTest.costCenterRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.costCenter);
    await CapacityGridMultipleWorkAssignmentsTest.costCenterAttributeRepository.deleteMany(CapacityGridMultipleWorkAssignmentsTest.costCenterAttribute);

    await CapacityGridMultipleWorkAssignmentsTest.cleanUpResourceBookedCapacityTable();

  }

  static async cleanUpResourceBookedCapacityTable() {

    let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();

    let deleteResourceBookedCapacityRecordsStatement = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${CapacityGridMultipleWorkAssignmentsTest.resourceIdConcatenatedString}`);
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