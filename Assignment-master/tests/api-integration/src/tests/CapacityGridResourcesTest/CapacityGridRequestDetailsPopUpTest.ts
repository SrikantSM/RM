import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';

import {
  Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, EmployeeHeader, EmployeeHeaderRepository, ResourceHeaderRepository, ResourceHeader,
  WorkAssignment, WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
  ResourceRequestRepository, ResourceRequest, OrganizationDetail, OrganizationDetailRepository, 
  JobDetail, JobDetailRepository, CostCenterRepository, CostCenter
} from 'test-commons';
import { RequestDetailsForEachAssignment } from '../../utils';

@suite
export class CapacityGridRequestDetailsPopUpTest {
  private static capacityServiceClientForResMgr: AxiosInstance;

  private static uniquifier: Uniquifier;
  private static assignmentRepository: AssignmentsRepository;
  private static assignmentBucketRepository: AssignmentBucketRepository;
  private static resourceRequestRepository: ResourceRequestRepository;
  private static resourceHeaderRepository: ResourceHeaderRepository;
  private static employeeHeaderRepository: EmployeeHeaderRepository;
  private static workAssignmentRepository: WorkAssignmentRepository;
  private static workforcePersonRepository: WorkforcePersonRepository;
  private static organizationDetailRepository: OrganizationDetailRepository;
  
  private static jobDetailRepository: JobDetailRepository;
  private static costCenterRepository: CostCenterRepository;
  private static assignment: Assignments[];
  private static assignmentBuckets: AssignmentBucket[];
  private static resourceRequests: ResourceRequest[];
  private static resourceHeader: ResourceHeader[];
  private static employeeHeader: EmployeeHeader[];
  private static workAssignment: WorkAssignment[];
  private static workforcePerson: WorkforcePerson[];
  private static organizationDetail: OrganizationDetail[];
  
  private static jobDetail: JobDetail[];
  private static costCenter: CostCenter[];

  @timeout(TEST_TIMEOUT)
  static async before() {
    CapacityGridRequestDetailsPopUpTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient()

    CapacityGridRequestDetailsPopUpTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
    CapacityGridRequestDetailsPopUpTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    CapacityGridRequestDetailsPopUpTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();

    CapacityGridRequestDetailsPopUpTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    CapacityGridRequestDetailsPopUpTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    CapacityGridRequestDetailsPopUpTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    CapacityGridRequestDetailsPopUpTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    CapacityGridRequestDetailsPopUpTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    CapacityGridRequestDetailsPopUpTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
    CapacityGridRequestDetailsPopUpTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

    CapacityGridRequestDetailsPopUpTest.uniquifier = new Uniquifier();
    CapacityGridRequestDetailsPopUpTest.assignment = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
    CapacityGridRequestDetailsPopUpTest.assignmentBuckets = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
    CapacityGridRequestDetailsPopUpTest.resourceRequests = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
    CapacityGridRequestDetailsPopUpTest.resourceHeader = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
    CapacityGridRequestDetailsPopUpTest.employeeHeader = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
    CapacityGridRequestDetailsPopUpTest.workAssignment = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
    CapacityGridRequestDetailsPopUpTest.workforcePerson = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
    
    CapacityGridRequestDetailsPopUpTest.organizationDetail = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
    CapacityGridRequestDetailsPopUpTest.jobDetail = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
    CapacityGridRequestDetailsPopUpTest.costCenter = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/input/capacitygrid/capacityGridRequestPopup3Months/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

    await CapacityGridRequestDetailsPopUpTest.resourceHeaderRepository.insertMany(CapacityGridRequestDetailsPopUpTest.resourceHeader);
    await CapacityGridRequestDetailsPopUpTest.employeeHeaderRepository.insertMany(CapacityGridRequestDetailsPopUpTest.employeeHeader);
    await CapacityGridRequestDetailsPopUpTest.workAssignmentRepository.insertMany(CapacityGridRequestDetailsPopUpTest.workAssignment);
    await CapacityGridRequestDetailsPopUpTest.workforcePersonRepository.insertMany(CapacityGridRequestDetailsPopUpTest.workforcePerson);
    await CapacityGridRequestDetailsPopUpTest.organizationDetailRepository.insertMany(CapacityGridRequestDetailsPopUpTest.organizationDetail);
    await CapacityGridRequestDetailsPopUpTest.jobDetailRepository.insertMany(CapacityGridRequestDetailsPopUpTest.jobDetail);
    await CapacityGridRequestDetailsPopUpTest.costCenterRepository.insertMany(CapacityGridRequestDetailsPopUpTest.costCenter);

    await CapacityGridRequestDetailsPopUpTest.assignmentRepository.insertMany(CapacityGridRequestDetailsPopUpTest.assignment);
    await CapacityGridRequestDetailsPopUpTest.assignmentBucketRepository.insertMany(CapacityGridRequestDetailsPopUpTest.assignmentBuckets);
    await CapacityGridRequestDetailsPopUpTest.resourceRequestRepository.insertMany(CapacityGridRequestDetailsPopUpTest.resourceRequests);

  }

  @test(timeout(TEST_TIMEOUT))
  async 'Request Information to be displayed on the click of the contact details popup for Request Name in CapacityGridView'() {

    const expectedRequestDetailsForEachAssignmentResponse: RequestDetailsForEachAssignment[] = await CapacityGridRequestDetailsPopUpTest.uniquifier.getRecords('../data/expected/capacityGrid/RequestDetailsForEachAssignment.csv', 'RequestDetailsForEachAssignment');
    const RequestDetailsForEachAssignmentActualResponse = await CapacityGridRequestDetailsPopUpTest.capacityServiceClientForResMgr.get('RequestDetailsForEachAssignment?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-01-01T00:00:00Z', 'sap-valid-to': '2021-06-30T00:00:00Z' } });

    assert.equal(RequestDetailsForEachAssignmentActualResponse.status, 200, 'Expected status code to be 200 (OK)');
    expectedRequestDetailsForEachAssignmentResponse.forEach((expectedRequestDetailsForEachAssignmentRecord: RequestDetailsForEachAssignment) => {
      var currentRecordFound = false;
      RequestDetailsForEachAssignmentActualResponse.data.value.forEach((RequestDetailsForEachAssignmentResponseRecord: RequestDetailsForEachAssignment) => {
        if (expectedRequestDetailsForEachAssignmentRecord.resourceRequest_ID == RequestDetailsForEachAssignmentResponseRecord.resourceRequest_ID) {
          currentRecordFound = true;
          assert.equal(RequestDetailsForEachAssignmentResponseRecord.resourceRequest_ID, expectedRequestDetailsForEachAssignmentRecord.resourceRequest_ID, 'Expected resourceRequest_ID in RequestDetailsForEachAssignment view is incorrect');
          assert.equal(RequestDetailsForEachAssignmentResponseRecord.requestDisplayId, expectedRequestDetailsForEachAssignmentRecord.resourceRequest_ID.substring(expectedRequestDetailsForEachAssignmentRecord.resourceRequest_ID.length - 10), 'Expected requestDisplayId in RequestDetailsForEachAssignment view is incorrect');
          assert.equal(RequestDetailsForEachAssignmentResponseRecord.requestName, expectedRequestDetailsForEachAssignmentRecord.requestName, 'Expected requestName in RequestDetailsForEachAssignment view is incorrect');
          assert.equal(RequestDetailsForEachAssignmentResponseRecord.requestStartDate, expectedRequestDetailsForEachAssignmentRecord.requestStartDate, 'Expected requestStartDate in RequestDetailsForEachAssignment view is incorrect');
          assert.equal(RequestDetailsForEachAssignmentResponseRecord.requestEndDate, expectedRequestDetailsForEachAssignmentRecord.requestEndDate, 'Expected requestEndDate in RequestDetailsForEachAssignment view is incorrect');
        }
      })
      assert.equal(currentRecordFound, true, 'RequestDetailsForEachAssignment view Missing for RequestDetailsForEachAssignment');
    });

  }

  @timeout(TEST_TIMEOUT)
  static async after() {

    await CapacityGridRequestDetailsPopUpTest.assignmentRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.assignment);
    await CapacityGridRequestDetailsPopUpTest.assignmentBucketRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.assignmentBuckets);
    await CapacityGridRequestDetailsPopUpTest.resourceRequestRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.resourceRequests);

    await CapacityGridRequestDetailsPopUpTest.resourceHeaderRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.resourceHeader);
    await CapacityGridRequestDetailsPopUpTest.employeeHeaderRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.employeeHeader);
    await CapacityGridRequestDetailsPopUpTest.workAssignmentRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.workAssignment);
    await CapacityGridRequestDetailsPopUpTest.workforcePersonRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.workforcePerson);
    await CapacityGridRequestDetailsPopUpTest.organizationDetailRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.organizationDetail);
    await CapacityGridRequestDetailsPopUpTest.jobDetailRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.jobDetail);
    await CapacityGridRequestDetailsPopUpTest.costCenterRepository.deleteMany(CapacityGridRequestDetailsPopUpTest.costCenter);

  }

}