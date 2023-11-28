import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { CapacityGridDailyUtilizationTemporal, CapacityGridWeeklyUtilizationTemporal, resourceName1, TEST_TIMEOUT, testEnvironment, Uniquifier, workerType } from '../../utils';

import {
  EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
  WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  Email, EmailRepository, Phone, PhoneRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ProfileDetail, ProfileDetailRepository,
  OrganizationDetail, OrganizationDetailRepository, 
  JobDetail, JobDetailRepository,
  CostCenterRepository, CostCenter,
  CostCenterAttribute, CostCenterAttributeRepository, BookedCapacityAggregateRepository, ProfilePhoto, ProfilePhotoRepository
} from 'test-commons';
import { CapacityGridMonthlyUtilizationTemporal, CapacityGridHeaderTemporal } from '../../utils';

// This test checks for the population of the cost center related fields. Here all the resource belonging to any cost center
// should be displayed. All the fields required for the contact popup for each resource will have to be populated.
@suite
export class CapacityGridUtilizationReadTest {
  private static capacityServiceClientForResMgr: AxiosInstance;
  private static profilePhotoClientForResMgr: AxiosInstance;

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
  private static profilePhoto: ProfilePhoto[];

  private static emailRepository: EmailRepository;
  private static phoneRepository: PhoneRepository;
  private static workPlaceAddressRepository: WorkPlaceAddressRepository;
  private static profileDetailsRepository: ProfileDetailRepository;
  private static profilePhotoRepository: ProfilePhotoRepository;
  private static costCenter: CostCenter[];
  private static email: Email[];
  private static phone: Phone[];
  private static workPlaceAddress: WorkPlaceAddress[];
  private static profileDetail: ProfileDetail[];

  private static resourceIdConcatenatedString: String;

  @timeout(TEST_TIMEOUT)
  static async before() {
    CapacityGridUtilizationReadTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient();
    CapacityGridUtilizationReadTest.profilePhotoClientForResMgr = await testEnvironment.getResourceManagerProfilePhotoClient();

    CapacityGridUtilizationReadTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridUtilizationReadTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridUtilizationReadTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridUtilizationReadTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridUtilizationReadTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridUtilizationReadTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridUtilizationReadTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridUtilizationReadTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridUtilizationReadTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
    CapacityGridUtilizationReadTest.costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();

    CapacityGridUtilizationReadTest.emailRepository = await testEnvironment.getEmailRepository();
    CapacityGridUtilizationReadTest.phoneRepository = await testEnvironment.getPhoneRepository();
    CapacityGridUtilizationReadTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
    CapacityGridUtilizationReadTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
    CapacityGridUtilizationReadTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
    CapacityGridUtilizationReadTest.profilePhotoRepository = await testEnvironment.getProfilePhotoRepository();

    CapacityGridUtilizationReadTest.uniquifier = new Uniquifier();
    CapacityGridUtilizationReadTest.resourceHeader = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridUtilizationReadTest.resourceCapacity = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
    CapacityGridUtilizationReadTest.assignment = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridUtilizationReadTest.assignmentBuckets = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridUtilizationReadTest.employeeHeader = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridUtilizationReadTest.workAssignment = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridUtilizationReadTest.workforcePerson = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    CapacityGridUtilizationReadTest.workforcePerson = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    
    CapacityGridUtilizationReadTest.organizationDetail = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridUtilizationReadTest.jobDetail = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridUtilizationReadTest.email = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
    CapacityGridUtilizationReadTest.phone = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
    CapacityGridUtilizationReadTest.workPlaceAddress = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
    CapacityGridUtilizationReadTest.profileDetail = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
    CapacityGridUtilizationReadTest.profilePhoto = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.employee-ProfilePhoto.csv', 'ProfilePhoto');
    CapacityGridUtilizationReadTest.costCenter = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');
    CapacityGridUtilizationReadTest.costCenterAttribute = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridContactPopup3Months/com.sap.resourceManagement.organization-CostCenterAttributes.csv', 'CostCenterAttribute');

    CapacityGridUtilizationReadTest.resourceIdConcatenatedString = CapacityGridUtilizationReadTest.getResourceIdConcatenatedString(CapacityGridUtilizationReadTest.resourceHeader.map(r => r.ID));

    await CapacityGridUtilizationReadTest.resourceHeaderRepository.insertMany(CapacityGridUtilizationReadTest.resourceHeader);
    await CapacityGridUtilizationReadTest.resourceCapacityRepository.insertMany(CapacityGridUtilizationReadTest.resourceCapacity);

    await CapacityGridUtilizationReadTest.assignmentRepository.insertMany(CapacityGridUtilizationReadTest.assignment);
    await CapacityGridUtilizationReadTest.assignmentBucketRepository.insertMany(CapacityGridUtilizationReadTest.assignmentBuckets);

    await CapacityGridUtilizationReadTest.employeeHeaderRepository.insertMany(CapacityGridUtilizationReadTest.employeeHeader);
    await CapacityGridUtilizationReadTest.workAssignmentRepository.insertMany(CapacityGridUtilizationReadTest.workAssignment);

    await CapacityGridUtilizationReadTest.workforcePersonRepository.insertMany(CapacityGridUtilizationReadTest.workforcePerson);
    
    await CapacityGridUtilizationReadTest.organizationDetailRepository.insertMany(CapacityGridUtilizationReadTest.organizationDetail);
    await CapacityGridUtilizationReadTest.jobDetailRepository.insertMany(CapacityGridUtilizationReadTest.jobDetail);

    await CapacityGridUtilizationReadTest.emailRepository.insertMany(CapacityGridUtilizationReadTest.email);
    await CapacityGridUtilizationReadTest.phoneRepository.insertMany(CapacityGridUtilizationReadTest.phone);
    await CapacityGridUtilizationReadTest.workPlaceAddressRepository.insertMany(CapacityGridUtilizationReadTest.workPlaceAddress);
    await CapacityGridUtilizationReadTest.profileDetailsRepository.insertMany(CapacityGridUtilizationReadTest.profileDetail);
    await CapacityGridUtilizationReadTest.costCenterRepository.insertMany(CapacityGridUtilizationReadTest.costCenter);
    await CapacityGridUtilizationReadTest.costCenterAttributeRepository.insertMany(CapacityGridUtilizationReadTest.costCenterAttribute);
    delete CapacityGridUtilizationReadTest.profilePhoto[1]['modifiedAt'];
    await CapacityGridUtilizationReadTest.profilePhotoRepository.insertMany(CapacityGridUtilizationReadTest.profilePhoto);

    await CapacityGridUtilizationReadTest.updateResourceBookedCapacityAggregateTable();

  }
  
  static async updateResourceBookedCapacityAggregateTable() {

    const statement = `UPSERT COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE SELECT RESOURCE_ID AS RESOURCEID, STARTTIME, SUM(BOOKEDCAPACITYINMINUTES) AS BOOKEDCAPACITYINMINUTES, 0 AS SOFTBOOKEDCAPACITYINMINUTES FROM COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETSVIEW WHERE STARTTIME IS NOT NULL AND RESOURCE_ID IN ${CapacityGridUtilizationReadTest.resourceIdConcatenatedString} GROUP BY STARTTIME, RESOURCE_ID`;
    await CapacityGridUtilizationReadTest.assignmentRepository.statementExecutor.execute(statement);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Header KPI read returns correct result when queried for 6 months'() {

    const capacityGridHeaderKPIActual3MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderKPITemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-08-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderKPIActual3MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    /** Unfortunately, we cannot assert on the actual values here as they would depend on the aggregation of resources and assignment present in DB. Since in the 
     * pipeline multiple tests run in parallel, the resource count will differ always and cannot be asserted on a single value. Adding a filter for IDs is not 
     * valid in this case since the actual call will not contain such a filter.
     */
    
  }  

  @test(timeout(TEST_TIMEOUT))
  async 'Resource header and monthly utilization read returns correct result when queried for 3 months and 6 months'() {

    const expectedCapacityGridMonthlyUtilization3MonthsResponse: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilization3MonthsReadResponse.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeader3MonthsResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeader3MonthsReadResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActual3MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-06-30T00:00:00Z' } });
    const capacityGridMonthlyUtilizationActual3MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-06-30T00:00:00Z' } });

    assert.equal(capacityGridHeaderActual3MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActual3MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeader3MonthsResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActual3MonthsResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
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
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridMonthlyUtilization3MonthsResponse.forEach(expectedCapacityGridMonthlyUtilizationRecord => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActual3MonthsResponse.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
        if ((expectedCapacityGridMonthlyUtilizationRecord.ID == capacityGridMonthlyUtilizationResponseRecord.ID) &&
          (expectedCapacityGridMonthlyUtilizationRecord.timePeriod == capacityGridMonthlyUtilizationResponseRecord.timePeriod)) {
          currentRecordFound = true;
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.timePeriod, expectedCapacityGridMonthlyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.utilization, Number(expectedCapacityGridMonthlyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.bookedHours, expectedCapacityGridMonthlyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.availableHours, expectedCapacityGridMonthlyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridMonthlyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridmonthlyutilization');
    });

    const expectedCapacityGridMonthlyUtilization6MonthsResponse: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilization6MonthsReadResponse.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeader6MonthsResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeader6MonthsReadResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActual6MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-07-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });
    const capacityGridMonthlyUtilizationActual6MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-07-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActual6MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActual6MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeader6MonthsResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActual6MonthsResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        if (expectedCapacityGridHeaderRecord.ID == capacityGridHeaderResponseRecord.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecord.ID, expectedCapacityGridHeaderRecord.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.startDate, expectedCapacityGridHeaderRecord.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.costCenter, expectedCapacityGridHeaderRecord.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.costCenterName, expectedCapacityGridHeaderRecord.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.emailAddress, expectedCapacityGridHeaderRecord.emailAddress, 'Expected emailAddress in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.mobileNumber, expectedCapacityGridHeaderRecord.mobileNumber, 'Expected mobileNumber in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.country, expectedCapacityGridHeaderRecord.country == '' ? null : expectedCapacityGridHeaderRecord.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.resourceName, expectedCapacityGridHeaderRecord.resourceName, 'Expected resourceName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.firstName, expectedCapacityGridHeaderRecord.firstName, 'Expected firstName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.lastName, expectedCapacityGridHeaderRecord.lastName, 'Expected lastName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.jobTitle, expectedCapacityGridHeaderRecord.jobTitle == '' ? null : expectedCapacityGridHeaderRecord.jobTitle, 'Expected job title in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridMonthlyUtilization6MonthsResponse.forEach(expectedCapacityGridMonthlyUtilizationRecord => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActual6MonthsResponse.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
        if ((expectedCapacityGridMonthlyUtilizationRecord.ID == capacityGridMonthlyUtilizationResponseRecord.ID) &&
          (expectedCapacityGridMonthlyUtilizationRecord.timePeriod == capacityGridMonthlyUtilizationResponseRecord.timePeriod)) {
          currentRecordFound = true;
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.timePeriod, expectedCapacityGridMonthlyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.utilization, Number(expectedCapacityGridMonthlyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.bookedHours, expectedCapacityGridMonthlyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.availableHours, expectedCapacityGridMonthlyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridMonthlyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridmonthlyutilization');
    });

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource header and weekly utilization read returns correct result when queried for 2 months and 1 month'() {

    const expectedCapacityGridWeeklyUtilization1MonthsResponse: CapacityGridWeeklyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridWeeklyUtilization/CapacityGridWeeklyUtilization2MonthsReadResponse.csv', 'CapacityGridWeeklyUtilizationTemporal');
    const expectedCapacityGridHeader1MonthsResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridWeeklyUtilization/CapacityGridHeader2MonthsReadResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActual1MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-03-20T00:00:00Z' } });
    const CapacityGridWeeklyUtilizationActual1MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('capacityGridWeeklyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-03-20T00:00:00Z' } });

    assert.equal(capacityGridHeaderActual1MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridWeeklyUtilizationActual1MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeader1MonthsResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActual1MonthsResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
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
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridWeeklyUtilization1MonthsResponse.forEach(expectedCapacityGridDailyUtilizationRecord => {
      var currentRecordFound = false;
      CapacityGridWeeklyUtilizationActual1MonthsResponse.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridWeeklyUtilizationTemporal) => {
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
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridWeeklyUtilization');
    });


    const expectedCapacityGridHeader2MonthsResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridWeeklyUtilization/CapacityGridHeader1MonthsReadResponse.csv', 'CapacityGridHeaderTemporal');
    const capacityGridHeaderActual2MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-20T00:00:00Z' } });

    assert.equal(capacityGridHeaderActual2MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    expectedCapacityGridHeader2MonthsResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActual2MonthsResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
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
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

  }  

  @test(timeout(TEST_TIMEOUT))
  async 'Resource header and daily utilization read returns correct result when queried for 2 months and 1 month'() {

    const expectedCapacityGridDailyUtilization1MonthsResponse: CapacityGridDailyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridDailyUtilization2MonthsReadResponse.csv', 'CapacityGridDailyUtilizationTemporal');
    const expectedCapacityGridHeader1MonthsResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridHeader2MonthsReadResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActual1MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-04-30T00:00:00Z' } });
    const CapacityGridDailyUtilizationActual1MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('capacityGridDailyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-03-01T00:00:00Z', 'sap-valid-to': '2021-04-30T00:00:00Z' } });

    assert.equal(capacityGridHeaderActual1MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridDailyUtilizationActual1MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeader1MonthsResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActual1MonthsResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
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
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridDailyUtilization1MonthsResponse.forEach(expectedCapacityGridDailyUtilizationRecord => {
      var currentRecordFound = false;
      CapacityGridDailyUtilizationActual1MonthsResponse.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridDailyUtilizationTemporal) => {
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

    const expectedCapacityGridDailyUtilization2MonthsResponse: CapacityGridDailyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridDailyUtilization1MonthsReadResponse.csv', 'CapacityGridDailyUtilizationTemporal');
    const expectedCapacityGridHeader2MonthsResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridHeader1MonthsReadResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActual2MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
    const CapacityGridDailyUtilizationActual2MonthsResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('capacityGridDailyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActual2MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridDailyUtilizationActual2MonthsResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeader2MonthsResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActual2MonthsResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
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
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridDailyUtilization2MonthsResponse.forEach(expectedCapacityGridDailyUtilizationRecord => {
      var currentRecordFound = false;
      CapacityGridDailyUtilizationActual2MonthsResponse.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridDailyUtilizationTemporal) => {
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
  async 'Adding sorting criteria on resourceName field in the capacityGridHeader and the returned result should be sorted by Ascending order'() {

    const expectedCapacityGridMonthlyUtilizationNameSortResponse: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilizationSortingCriteriaInURLResponse.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeaderNameSortResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderSortingCriteriaInURLResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualNameSortResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get(`/capacityGridHeaderTemporal?sap-valid-from=2021-10-01T00:00:00Z&sap-valid-to=2021-10-31T00:00:00Z&$orderby=resourceName`);
    const capacityGridMonthlyUtilizationActualNameSortResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get(`/capacityGridMonthlyUtilizationTemporal?sap-valid-from=2021-10-01T00:00:00Z&sap-valid-to=2021-10-31T00:00:00Z`);

    assert.equal(capacityGridHeaderActualNameSortResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActualNameSortResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderNameSortResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      let index = 0;
      capacityGridHeaderActualNameSortResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        if(index > 0 && capacityGridHeaderResponseRecord.resourceName) {
          assert.isTrue(capacityGridHeaderResponseRecord.resourceName >= capacityGridHeaderActualNameSortResponse.data.value[index-1].resourceName, "Resource Name not in sorted order");
        }
        index++;
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
          assert.equal(capacityGridHeaderResponseRecord.workforcePersonID, expectedCapacityGridHeaderRecord.workforcePersonID, 'Expected workforcePersonID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.bookedHours, expectedCapacityGridHeaderRecord.bookedHours, 'Expected bookedHours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.availableHours, expectedCapacityGridHeaderRecord.availableHours, 'Expected availableHours in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridMonthlyUtilizationNameSortResponse.forEach(expectedCapacityGridMonthlyUtilizationRecord => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActualNameSortResponse.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
        if (expectedCapacityGridMonthlyUtilizationRecord.ID == capacityGridMonthlyUtilizationResponseRecord.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.timePeriod, expectedCapacityGridMonthlyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.utilization, Number(expectedCapacityGridMonthlyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.bookedHours, expectedCapacityGridMonthlyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.availableHours, expectedCapacityGridMonthlyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridMonthlyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridmonthlyutilization');
    });

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Adding sorting criteria on AverageUtilization field in the capacityGridHeader and the returned result should be sorted by Descending order'() {

    const expectedCapacityGridHeaderAvgUtilSortResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridHeaderActualAvgUtilSortResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualAvgUtilSortResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get(`/capacityGridHeaderTemporal?sap-valid-from=2021-10-01T00:00:00Z&sap-valid-to=2021-10-31T00:00:00Z&$orderby=avgUtilization desc`);

    assert.equal(capacityGridHeaderActualAvgUtilSortResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderAvgUtilSortResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      let index = 0;
      capacityGridHeaderActualAvgUtilSortResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        if(index > 0 && capacityGridHeaderResponseRecord.avgUtilization) {
          assert.isTrue(capacityGridHeaderResponseRecord.avgUtilization <= capacityGridHeaderActualAvgUtilSortResponse.data.value[index-1].avgUtilization, "Avaerage utilization not in sorted order");
        }
        index++;
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
          assert.equal(capacityGridHeaderResponseRecord.workforcePersonID, expectedCapacityGridHeaderRecord.workforcePersonID, 'Expected workforcePersonID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.bookedHours, expectedCapacityGridHeaderRecord.bookedHours, 'Expected bookedHours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.availableHours, expectedCapacityGridHeaderRecord.availableHours, 'Expected availableHours in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Adding sorting criteria on workerType field in the capacityGridHeader and the returned result should be sorted by Descending order'() {

    const capacityGridHeaderActualWorkerTypeSortResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get(`/capacityGridHeaderTemporal?sap-valid-from=2021-10-01T00:00:00Z&sap-valid-to=2021-10-31T00:00:00Z&$orderby=workerType desc`);

    assert.equal(capacityGridHeaderActualWorkerTypeSortResponse.status, 200, 'Expected status code to be 200 (OK)');

    for(var i = 1; i<capacityGridHeaderActualWorkerTypeSortResponse.data.value.lenth; i++ ) {
      assert.isTrue(capacityGridHeaderActualWorkerTypeSortResponse.data.value[i].workerType <= capacityGridHeaderActualWorkerTypeSortResponse.data.value[i-1].workerType, "Worker type not in descending order");
    }

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Adding filter criteria to return only such records with worker type as External Worker in the capacityGridHeader'() {

    const expectedCapacityGridHeaderResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderFilterWorkerTypeInURLResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get(`/capacityGridHeaderTemporal?sap-valid-from=2021-10-01T00:00:00Z&sap-valid-to=2021-10-31T00:00:00Z&$filter=contains(workerType,'${workerType.name}')`);
    assert.equal(capacityGridHeaderActualResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        assert.equal(capacityGridHeaderResponseRecord.workerType, 'External Worker', "Filtered result contains non external workers too" );
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
          assert.equal(capacityGridHeaderResponseRecord.jobTitle, expectedCapacityGridHeaderRecord.jobTitle, 'Expected JobTitle in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.workerType, expectedCapacityGridHeaderRecord.workerType, 'Expected workerType in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Adding filter criteria on Resource Name field in the capacityGridHeader and the returned result should only contain the filtered results'() {

    const expectedCapacityGridHeaderAvgUtilSortResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderFilterResourceNameInURLResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualAvgUtilSortResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get(`/capacityGridHeaderTemporal?sap-valid-from=2021-10-01T00:00:00Z&sap-valid-to=2021-10-31T00:00:00Z&$filter=contains(resourceName,'${resourceName1.name}')`);

    assert.equal(capacityGridHeaderActualAvgUtilSortResponse.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderAvgUtilSortResponse.forEach((expectedCapacityGridHeaderRecord: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualAvgUtilSortResponse.data.value.forEach((capacityGridHeaderResponseRecord: CapacityGridHeaderTemporal) => {
        assert.equal(capacityGridHeaderResponseRecord.resourceName, 'Santa Claus', "Filtered response contains resources with other names too");
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
          assert.equal(capacityGridHeaderResponseRecord.workforcePersonID, expectedCapacityGridHeaderRecord.workforcePersonID, 'Expected workforcePersonID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.bookedHours, expectedCapacityGridHeaderRecord.bookedHours, 'Expected booked hours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.availableHours, expectedCapacityGridHeaderRecord.availableHours, 'Expected available hours in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource Information to be displayed on the click of the contact details popup for Resource Name in CapacityGridView'() {

    const expectedCapacityGridMonthlyUtilizationResponse: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilizationContactDetailsPopUpResponse.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeaderResponse: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationReadTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderContantDetailsPopUpResponse.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
    const capacityGridMonthlyUtilizationActualResponse = await CapacityGridUtilizationReadTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });

    const year = new Date(Date.now()).getFullYear();

    //   check profilephoto for employee1
    const capacityGridProilePhotoForEmployee1Response = await CapacityGridUtilizationReadTest.profilePhotoClientForResMgr.get( '/profilePhoto/profileThumbnail('+CapacityGridUtilizationReadTest.employeeHeader[0].ID +')' );
    assert.equal(capacityGridProilePhotoForEmployee1Response.status, 200,'Expected status code to be 200 (OK)' );
    assert.equal(capacityGridProilePhotoForEmployee1Response.headers["cache-control"], "public; max-age=86400", "expected the cache control value to be public; max-age=86400" );
    assert.equal(capacityGridProilePhotoForEmployee1Response.headers["last-modified"],"Wed, 11 Nov 2020 00:00:00 GMT", "expected the last-modified value to be from the DB " );

    // check profilephoto for employee2
    const capacityGridProilePhotoForEmployee2Response = await CapacityGridUtilizationReadTest.profilePhotoClientForResMgr.get( '/profilePhoto/profileThumbnail('+CapacityGridUtilizationReadTest.employeeHeader[1].ID +')' );
    assert.equal(capacityGridProilePhotoForEmployee2Response.status, 200,'Expected status code to be 200 (OK)' );
    assert.equal(capacityGridProilePhotoForEmployee2Response.headers["cache-control"], "public; max-age=86400", "expected the cache control value to be public; max-age=86400" );
    assert.include(capacityGridProilePhotoForEmployee2Response.headers["last-modified"], year, "The current year should be part of the last-modified as the value set in the API is Instant.now()");

    assert.equal(capacityGridHeaderActualResponse.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActualResponse.status, 200, 'Expected status code to be 200 (OK)');

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
          assert.equal(capacityGridHeaderResponseRecord.jobTitle, expectedCapacityGridHeaderRecord.jobTitle, 'Expected job title in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.avgUtilization, expectedCapacityGridHeaderRecord.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.bookedHours, expectedCapacityGridHeaderRecord.bookedHours, 'Expected bookedHours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.availableHours, expectedCapacityGridHeaderRecord.availableHours, 'Expected availableHours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecord.isPhotoPresent, true, 'Expected availableHours in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridMonthlyUtilizationResponse.forEach(expectedCapacityGridMonthlyUtilizationRecord => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActualResponse.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
        if (expectedCapacityGridMonthlyUtilizationRecord.ID == capacityGridMonthlyUtilizationResponseRecord.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.timePeriod, expectedCapacityGridMonthlyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.utilization, Number(expectedCapacityGridMonthlyUtilizationRecord.utilization), "Incorrect Capacity Grid utilization Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.bookedHours, expectedCapacityGridMonthlyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.availableHours, expectedCapacityGridMonthlyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(capacityGridMonthlyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridMonthlyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridmonthlyutilization');
    });
  }


  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridUtilizationReadTest.resourceHeaderRepository.deleteMany(CapacityGridUtilizationReadTest.resourceHeader);
    await CapacityGridUtilizationReadTest.resourceCapacityRepository.deleteMany(CapacityGridUtilizationReadTest.resourceCapacity);

    await CapacityGridUtilizationReadTest.assignmentRepository.deleteMany(CapacityGridUtilizationReadTest.assignment);
    await CapacityGridUtilizationReadTest.assignmentBucketRepository.deleteMany(CapacityGridUtilizationReadTest.assignmentBuckets);

    await CapacityGridUtilizationReadTest.employeeHeaderRepository.deleteMany(CapacityGridUtilizationReadTest.employeeHeader);
    await CapacityGridUtilizationReadTest.workAssignmentRepository.deleteMany(CapacityGridUtilizationReadTest.workAssignment);

    await CapacityGridUtilizationReadTest.workforcePersonRepository.deleteMany(CapacityGridUtilizationReadTest.workforcePerson);
    
    await CapacityGridUtilizationReadTest.organizationDetailRepository.deleteMany(CapacityGridUtilizationReadTest.organizationDetail);
    await CapacityGridUtilizationReadTest.jobDetailRepository.deleteMany(CapacityGridUtilizationReadTest.jobDetail);

    await CapacityGridUtilizationReadTest.emailRepository.deleteMany(CapacityGridUtilizationReadTest.email);
    await CapacityGridUtilizationReadTest.phoneRepository.deleteMany(CapacityGridUtilizationReadTest.phone);
    await CapacityGridUtilizationReadTest.workPlaceAddressRepository.deleteMany(CapacityGridUtilizationReadTest.workPlaceAddress);
    await CapacityGridUtilizationReadTest.profileDetailsRepository.deleteMany(CapacityGridUtilizationReadTest.profileDetail);
    await CapacityGridUtilizationReadTest.costCenterRepository.deleteMany(CapacityGridUtilizationReadTest.costCenter);
    await CapacityGridUtilizationReadTest.costCenterAttributeRepository.deleteMany(CapacityGridUtilizationReadTest.costCenterAttribute);

    await CapacityGridUtilizationReadTest.profilePhotoRepository.deleteMany(CapacityGridUtilizationReadTest.profilePhoto);

    await CapacityGridUtilizationReadTest.cleanUpResourceBookedCapacityTable();

  }

  static async cleanUpResourceBookedCapacityTable() {

    let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();

    let deleteResourceBookedCapacityRecordsStatement = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${CapacityGridUtilizationReadTest.resourceIdConcatenatedString}`);
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