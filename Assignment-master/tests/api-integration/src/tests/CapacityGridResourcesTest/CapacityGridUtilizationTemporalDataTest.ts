import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { CapacityGridDailyUtilizationTemporal, TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import {
  EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
  WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  OrganizationDetail, OrganizationDetailRepository, JobDetail, JobDetailRepository,
  CostCenterRepository, CostCenter,
  CostCenterAttribute, CostCenterAttributeRepository, BookedCapacityAggregateRepository,
  ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository
} from 'test-commons';
import { CapacityGridMonthlyUtilizationTemporal, CapacityGridHeaderTemporal } from '../../utils';

// This test would check for 2 funtionalities. 1 : Temporal data handling. Here, only the cost centers valid during the current year and 
// its corresponding resource should be displayed in the resource utilization application and correspondingly Header KPI's should be calculated
// This test should return only the resources belonging to CCDE
// This test queries 2 times one for the 1st half of the year and another for the 2nd half of the year. Always the same set of data needs to be returned.
@suite
export class CapacityGridUtilizationTemporalDataTest {
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
  private static costCenter: CostCenter[];
  private static assignment: Assignments[];
  private static assignmentBuckets: AssignmentBucket[];

  private static employeeHeader: EmployeeHeader[];
  private static workAssignment: WorkAssignment[];
  private static workforcePerson: WorkforcePerson[];

  private static organizationDetail: OrganizationDetail[];
  
  private static jobDetail: JobDetail[];
  private static costCenterAttribute: CostCenterAttribute[];
  private static costCenterAttributeRepository: CostCenterAttributeRepository;

  private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
  private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
  private static resourceOrganizations: ResourceOrganizations[];
  private static resourceOrganizationItems: ResourceOrganizationItems[];

  private static resourceIdConcatenatedString: String;

  @timeout(TEST_TIMEOUT)
  static async before() {
    CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr = await testEnvironment.getAuthAttrTestUser01CapacityServiceClient();

    CapacityGridUtilizationTemporalDataTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridUtilizationTemporalDataTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridUtilizationTemporalDataTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridUtilizationTemporalDataTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    CapacityGridUtilizationTemporalDataTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridUtilizationTemporalDataTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridUtilizationTemporalDataTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridUtilizationTemporalDataTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridUtilizationTemporalDataTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
    CapacityGridUtilizationTemporalDataTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
    CapacityGridUtilizationTemporalDataTest.costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();
    CapacityGridUtilizationTemporalDataTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    CapacityGridUtilizationTemporalDataTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

    CapacityGridUtilizationTemporalDataTest.uniquifier = new Uniquifier();

    CapacityGridUtilizationTemporalDataTest.resourceHeader = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridUtilizationTemporalDataTest.resourceCapacity = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');

    CapacityGridUtilizationTemporalDataTest.assignment = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridUtilizationTemporalDataTest.assignmentBuckets = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridUtilizationTemporalDataTest.costCenter = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.organization-costCenters.csv', 'CostCenter');

    CapacityGridUtilizationTemporalDataTest.employeeHeader = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridUtilizationTemporalDataTest.workAssignment = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

    CapacityGridUtilizationTemporalDataTest.workforcePerson = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    CapacityGridUtilizationTemporalDataTest.costCenterAttribute = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.organization-CostCenterAttributes.csv', 'CostCenterAttribute');

    CapacityGridUtilizationTemporalDataTest.organizationDetail = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridUtilizationTemporalDataTest.jobDetail = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

    CapacityGridUtilizationTemporalDataTest.resourceIdConcatenatedString = CapacityGridUtilizationTemporalDataTest.getResourceIdConcatenatedString(CapacityGridUtilizationTemporalDataTest.resourceHeader.map(r => r.ID));
    CapacityGridUtilizationTemporalDataTest.resourceOrganizations = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
    CapacityGridUtilizationTemporalDataTest.resourceOrganizationItems = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridTempData3Months/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

    await CapacityGridUtilizationTemporalDataTest.resourceHeaderRepository.insertMany(CapacityGridUtilizationTemporalDataTest.resourceHeader);
    await CapacityGridUtilizationTemporalDataTest.resourceCapacityRepository.insertMany(CapacityGridUtilizationTemporalDataTest.resourceCapacity);

    await CapacityGridUtilizationTemporalDataTest.assignmentRepository.insertMany(CapacityGridUtilizationTemporalDataTest.assignment);
    await CapacityGridUtilizationTemporalDataTest.assignmentBucketRepository.insertMany(CapacityGridUtilizationTemporalDataTest.assignmentBuckets);

    await CapacityGridUtilizationTemporalDataTest.employeeHeaderRepository.insertMany(CapacityGridUtilizationTemporalDataTest.employeeHeader);
    await CapacityGridUtilizationTemporalDataTest.workAssignmentRepository.insertMany(CapacityGridUtilizationTemporalDataTest.workAssignment);

    await CapacityGridUtilizationTemporalDataTest.workforcePersonRepository.insertMany(CapacityGridUtilizationTemporalDataTest.workforcePerson);
    
    await CapacityGridUtilizationTemporalDataTest.organizationDetailRepository.insertMany(CapacityGridUtilizationTemporalDataTest.organizationDetail);
    await CapacityGridUtilizationTemporalDataTest.jobDetailRepository.insertMany(CapacityGridUtilizationTemporalDataTest.jobDetail);
    await CapacityGridUtilizationTemporalDataTest.costCenterRepository.insertMany(CapacityGridUtilizationTemporalDataTest.costCenter);
    await CapacityGridUtilizationTemporalDataTest.costCenterAttributeRepository.insertMany(CapacityGridUtilizationTemporalDataTest.costCenterAttribute);

    await CapacityGridUtilizationTemporalDataTest.resourceOrganizationsRepository.insertMany(CapacityGridUtilizationTemporalDataTest.resourceOrganizations);
    await CapacityGridUtilizationTemporalDataTest.resourceOrganizationItemsRepository.insertMany(CapacityGridUtilizationTemporalDataTest.resourceOrganizationItems);

    await CapacityGridUtilizationTemporalDataTest.updateResourceBookedCapacityAggregateTable();

  }
  
  static async updateResourceBookedCapacityAggregateTable() {

    const statement = `UPSERT COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE SELECT RESOURCE_ID AS RESOURCEID, STARTTIME, SUM(BOOKEDCAPACITYINMINUTES) AS BOOKEDCAPACITYINMINUTES, 0 AS SOFTBOOKEDCAPACITYINMINUTES FROM COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETSVIEW WHERE STARTTIME IS NOT NULL AND RESOURCE_ID IN ${CapacityGridUtilizationTemporalDataTest.resourceIdConcatenatedString} GROUP BY STARTTIME, RESOURCE_ID`;
    await CapacityGridUtilizationTemporalDataTest.assignmentRepository.statementExecutor.execute(statement);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Daily utilization value correctly returned for RM restricted to Resource Organization ROO1 (CostCenter CCDE)'() {

    const expectedCapacityGridDailyUtilizationResponseFirstHalf: CapacityGridDailyUtilizationTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridDailyUtilizationTemporal1stHalf.csv', 'CapacityGridDailyUtilizationTemporal');
    const expectedCapacityGridHeaderResponseFirstHalf: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridHeaderTemporal1stHalf.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponseFirstHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-03-31T00:00:00Z' } });
    const CapacityGridDailyUtilizationActualResponseFirstHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('capacityGridDailyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-03-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponseFirstHalf.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridDailyUtilizationActualResponseFirstHalf.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponseFirstHalf.forEach((expectedCapacityGridHeaderRecordFirstHalf: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponseFirstHalf.data.value.forEach((capacityGridHeaderResponseRecordFirstHalf: CapacityGridHeaderTemporal) => {
        if ((expectedCapacityGridHeaderRecordFirstHalf.ID == capacityGridHeaderResponseRecordFirstHalf.ID)) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.ID, expectedCapacityGridHeaderRecordFirstHalf.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.startDate, expectedCapacityGridHeaderRecordFirstHalf.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.costCenter, expectedCapacityGridHeaderRecordFirstHalf.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.costCenterName, expectedCapacityGridHeaderRecordFirstHalf.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.country, expectedCapacityGridHeaderRecordFirstHalf.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.jobTitle, expectedCapacityGridHeaderRecordFirstHalf.jobTitle, 'Expected role in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.avgUtilization, expectedCapacityGridHeaderRecordFirstHalf.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridDailyUtilizationResponseFirstHalf.forEach((expectedCapacityGridDailyUtilizationRecord: CapacityGridDailyUtilizationTemporal) => {
      var currentRecordFound = false;
      CapacityGridDailyUtilizationActualResponseFirstHalf.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridDailyUtilizationTemporal) => {
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
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for CapacityGridDailyUtilization');
    });

    const expectedCapacityGridDailyUtilizationResponseSecondHalf: CapacityGridDailyUtilizationTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridDailyUtilizationTemporal2ndHalf.csv', 'CapacityGridDailyUtilizationTemporal');
    const expectedCapacityGridHeaderResponseSecondHalf: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridDialyUtilization/CapacityGridHeaderTemporal2ndHalf.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponseSecondHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });
    const CapacityGridDailyUtilizationActualResponseSecondHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('capacityGridDailyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponseSecondHalf.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridDailyUtilizationActualResponseSecondHalf.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponseSecondHalf.forEach((expectedCapacityGridHeaderRecordSecondHalf: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponseSecondHalf.data.value.forEach((capacityGridHeaderResponseRecordSecondHalf: CapacityGridHeaderTemporal) => {
        if (expectedCapacityGridHeaderRecordSecondHalf.ID == capacityGridHeaderResponseRecordSecondHalf.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.ID, expectedCapacityGridHeaderRecordSecondHalf.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.startDate, expectedCapacityGridHeaderRecordSecondHalf.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.costCenter, expectedCapacityGridHeaderRecordSecondHalf.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.costCenterName, expectedCapacityGridHeaderRecordSecondHalf.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.country, expectedCapacityGridHeaderRecordSecondHalf.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.jobTitle, expectedCapacityGridHeaderRecordSecondHalf.jobTitle, 'Expected role in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.avgUtilization, expectedCapacityGridHeaderRecordSecondHalf.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    expectedCapacityGridDailyUtilizationResponseSecondHalf.forEach((expectedCapacityGridDailyUtilizationRecord: CapacityGridDailyUtilizationTemporal) => {
      var currentRecordFound = false;
      CapacityGridDailyUtilizationActualResponseSecondHalf.data.value.forEach((CapacityGridDailyUtilizationResponseRecord: CapacityGridDailyUtilizationTemporal) => {
        if ((expectedCapacityGridDailyUtilizationRecord.ID == CapacityGridDailyUtilizationResponseRecord.ID) &&
          (expectedCapacityGridDailyUtilizationRecord.timePeriod == CapacityGridDailyUtilizationResponseRecord.timePeriod)) {
          currentRecordFound = true;
          assert.equal(CapacityGridDailyUtilizationResponseRecord.timePeriod, expectedCapacityGridDailyUtilizationRecord.timePeriod, "Incorrect Capacity Grid timePeriod Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.utilization, Number(expectedCapacityGridDailyUtilizationRecord.utilization), CapacityGridDailyUtilizationResponseRecord.timePeriod)
          assert.equal(CapacityGridDailyUtilizationResponseRecord.bookedHours, expectedCapacityGridDailyUtilizationRecord.bookedHours, "Incorrect Capacity Grid bookedHours Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.availableHours, expectedCapacityGridDailyUtilizationRecord.availableHours, "Incorrect Capacity Grid availableHours Response");
          assert.equal(CapacityGridDailyUtilizationResponseRecord.freeHours, Number(expectedCapacityGridDailyUtilizationRecord.freeHours), "Incorrect Capacity Grid freeHours Response");

        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for CapacityGridDailyUtilization');
    });

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Monthly utilization value correctly returned for RM restricted to Resource Organization ROO1 (CostCenter CCDE)'() {

    // temporal expected response 
    const expectedCapacityGridMonthlyUtilizationTempResponseFirstHalf: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilizationTemporalResponseFirstHalf.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeaderTempResponseFirstHalf: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderTemporalDataFirstHalf.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponseFirstHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-06-30T00:00:00Z' } });
    const capacityGridMonthlyUtilizationActualResponseFirstHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-06-30T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponseFirstHalf.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActualResponseFirstHalf.status, 200, 'Expected status code to be 200 (OK)');
    expectedCapacityGridHeaderTempResponseFirstHalf.forEach((expectedCapacityGridHeaderRecordFirstHalf: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponseFirstHalf.data.value.forEach((capacityGridHeaderResponseRecordFirstHalf: CapacityGridHeaderTemporal) => {
        if ((expectedCapacityGridHeaderRecordFirstHalf.ID == capacityGridHeaderResponseRecordFirstHalf.ID)) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.ID, expectedCapacityGridHeaderRecordFirstHalf.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.startDate, expectedCapacityGridHeaderRecordFirstHalf.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.costCenter, expectedCapacityGridHeaderRecordFirstHalf.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.costCenterName, expectedCapacityGridHeaderRecordFirstHalf.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.country, expectedCapacityGridHeaderRecordFirstHalf.country, 'Expected country in header incorrect for first half');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.jobTitle, expectedCapacityGridHeaderRecordFirstHalf.jobTitle, 'Expected job title in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.avgUtilization, expectedCapacityGridHeaderRecordFirstHalf.avgUtilization, 'Expected avgUtilization in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.bookedHours, expectedCapacityGridHeaderRecordFirstHalf.bookedHours, 'Expected bookedhours in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.availableHours, expectedCapacityGridHeaderRecordFirstHalf.availableHours, 'Expected available hours in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader temporal');
    });

    expectedCapacityGridMonthlyUtilizationTempResponseFirstHalf.forEach((expectedCapacityGridMonthlyUtilizationRecord: CapacityGridMonthlyUtilizationTemporal) => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActualResponseFirstHalf.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
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

    const expectedCapacityGridMonthlyUtilizationResponseSecondHalf: CapacityGridMonthlyUtilizationTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridMonthlyUtilizationTemporalResponseSecondHalf.csv', 'CapacityGridMonthlyUtilizationTemporal');
    const expectedCapacityGridHeaderResponseSecondHalf: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/CapacityGridHeaderTemporalDataResponseSecondHalf.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponseSecondHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-07-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });
    const capacityGridMonthlyUtilizationActualResponseSecondHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-07-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponseSecondHalf.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(capacityGridMonthlyUtilizationActualResponseSecondHalf.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponseSecondHalf.forEach((expectedCapacityGridHeaderRecordSecondHalf: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponseSecondHalf.data.value.forEach((capacityGridHeaderResponseRecordSecondHalf: CapacityGridHeaderTemporal) => {
        if (expectedCapacityGridHeaderRecordSecondHalf.ID == capacityGridHeaderResponseRecordSecondHalf.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.ID, expectedCapacityGridHeaderRecordSecondHalf.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.startDate, expectedCapacityGridHeaderRecordSecondHalf.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.costCenter, expectedCapacityGridHeaderRecordSecondHalf.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.costCenterName, expectedCapacityGridHeaderRecordSecondHalf.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.country, expectedCapacityGridHeaderRecordSecondHalf.country == '' ? null : expectedCapacityGridHeaderRecordSecondHalf.country, 'Expected country in header incorrect in second half');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.jobTitle, expectedCapacityGridHeaderRecordSecondHalf.jobTitle == '' ? null : expectedCapacityGridHeaderRecordSecondHalf.jobTitle, 'Expected Job title in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.avgUtilization, expectedCapacityGridHeaderRecordSecondHalf.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader temporal');
    });

    expectedCapacityGridMonthlyUtilizationResponseSecondHalf.forEach((expectedCapacityGridMonthlyUtilizationRecord: CapacityGridMonthlyUtilizationTemporal) => {
      var currentRecordFound = false;
      capacityGridMonthlyUtilizationActualResponseSecondHalf.data.value.forEach((capacityGridMonthlyUtilizationResponseRecord: CapacityGridMonthlyUtilizationTemporal) => {
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
  async 'Weekly utilization value correctly returned for RM restricted to Resource Organization ROO1 (CostCenter CCDE)'() {

    const expectedCapacityGridHeaderResponseFirstHalf: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridWeeklyUtilization/CapacityGridHeaderTemporal1stHalf.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponseFirstHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-03-31T00:00:00Z' } });
    const CapacityGridWeeklyUtilizationActualResponseFirstHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('capacityGridWeeklyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-03-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponseFirstHalf.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridWeeklyUtilizationActualResponseFirstHalf.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponseFirstHalf.forEach((expectedCapacityGridHeaderRecordFirstHalf: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponseFirstHalf.data.value.forEach((capacityGridHeaderResponseRecordFirstHalf: CapacityGridHeaderTemporal) => {
        if ((expectedCapacityGridHeaderRecordFirstHalf.ID == capacityGridHeaderResponseRecordFirstHalf.ID)) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.ID, expectedCapacityGridHeaderRecordFirstHalf.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.startDate, expectedCapacityGridHeaderRecordFirstHalf.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.costCenter, expectedCapacityGridHeaderRecordFirstHalf.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.costCenterName, expectedCapacityGridHeaderRecordFirstHalf.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.country, expectedCapacityGridHeaderRecordFirstHalf.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.jobTitle, expectedCapacityGridHeaderRecordFirstHalf.jobTitle, 'Expected role in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordFirstHalf.avgUtilization, expectedCapacityGridHeaderRecordFirstHalf.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

    const expectedCapacityGridHeaderResponseSecondHalf: CapacityGridHeaderTemporal[] = await CapacityGridUtilizationTemporalDataTest.uniquifier.getRecords('../data/expected/capacityGrid/capacityGridWeeklyUtilization/CapacityGridHeaderTemporal2ndHalf.csv', 'CapacityGridHeaderTemporal');

    const capacityGridHeaderActualResponseSecondHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });
    const CapacityGridWeeklyUtilizationActualResponseSecondHalf = await CapacityGridUtilizationTemporalDataTest.capacityServiceClientForResMgr.get('capacityGridWeeklyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-12-31T00:00:00Z' } });

    assert.equal(capacityGridHeaderActualResponseSecondHalf.status, 200, 'Expected status code to be 200 (OK)');
    assert.equal(CapacityGridWeeklyUtilizationActualResponseSecondHalf.status, 200, 'Expected status code to be 200 (OK)');

    expectedCapacityGridHeaderResponseSecondHalf.forEach((expectedCapacityGridHeaderRecordSecondHalf: CapacityGridHeaderTemporal) => {
      var currentRecordFound = false;
      capacityGridHeaderActualResponseSecondHalf.data.value.forEach((capacityGridHeaderResponseRecordSecondHalf: CapacityGridHeaderTemporal) => {
        if (expectedCapacityGridHeaderRecordSecondHalf.ID == capacityGridHeaderResponseRecordSecondHalf.ID) {
          currentRecordFound = true;
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.ID, expectedCapacityGridHeaderRecordSecondHalf.ID, 'Expected ID in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.startDate, expectedCapacityGridHeaderRecordSecondHalf.startDate, 'Expected startDate in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.costCenter, expectedCapacityGridHeaderRecordSecondHalf.costCenter, 'Expected costCenter in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.costCenterName, expectedCapacityGridHeaderRecordSecondHalf.costCenterName, 'Expected costCenterName in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.country, expectedCapacityGridHeaderRecordSecondHalf.country, 'Expected country in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.jobTitle, expectedCapacityGridHeaderRecordSecondHalf.jobTitle, 'Expected role in header incorrect');
          assert.equal(capacityGridHeaderResponseRecordSecondHalf.avgUtilization, expectedCapacityGridHeaderRecordSecondHalf.avgUtilization, 'Expected avgUtilization in header incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'Capacity Grid Record Missing for capacitygridheader');
    });

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridUtilizationTemporalDataTest.resourceHeaderRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.resourceHeader);
    await CapacityGridUtilizationTemporalDataTest.resourceCapacityRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.resourceCapacity);

    await CapacityGridUtilizationTemporalDataTest.assignmentRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.assignment);
    await CapacityGridUtilizationTemporalDataTest.assignmentBucketRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.assignmentBuckets);

    await CapacityGridUtilizationTemporalDataTest.employeeHeaderRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.employeeHeader);
    await CapacityGridUtilizationTemporalDataTest.workAssignmentRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.workAssignment);

    await CapacityGridUtilizationTemporalDataTest.workforcePersonRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.workforcePerson);
    
    await CapacityGridUtilizationTemporalDataTest.organizationDetailRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.organizationDetail);
    await CapacityGridUtilizationTemporalDataTest.jobDetailRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.jobDetail);
    await CapacityGridUtilizationTemporalDataTest.costCenterRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.costCenter);
    await CapacityGridUtilizationTemporalDataTest.costCenterAttributeRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.costCenterAttribute);

    await CapacityGridUtilizationTemporalDataTest.resourceOrganizationsRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.resourceOrganizations);
    await CapacityGridUtilizationTemporalDataTest.resourceOrganizationItemsRepository.deleteMany(CapacityGridUtilizationTemporalDataTest.resourceOrganizationItems);

    await CapacityGridUtilizationTemporalDataTest.cleanUpResourceBookedCapacityTable();

  }

  static async cleanUpResourceBookedCapacityTable() {

    let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();

    let deleteResourceBookedCapacityRecordsStatement = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${CapacityGridUtilizationTemporalDataTest.resourceIdConcatenatedString}`);
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
