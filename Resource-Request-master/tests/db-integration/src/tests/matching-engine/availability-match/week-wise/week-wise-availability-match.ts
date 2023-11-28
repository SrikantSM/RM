import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  EmployeeHeaderRepository,
  WorkforcePersonRepository,
  WorkAssignmentRepository,
  ResourceHeaderRepository,
  ResourceCapacityRepository,
  CapacityRequirementRepository,
  ResourceRequestRepository,
  AssignmentBucketRepository,
  AssignmentsRepository,
  AvailabilityProcedure,
  BookedCapacityAggregateRepository,
} from 'test-commons';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';

import * as data from './data';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';
import * as testcase3 from './test-cases/case-3';
import * as testcase4 from './test-cases/case-4';
import * as testcase5 from './test-cases/case-5';
import * as testcase6 from './test-cases/case-6';
import * as testcase7 from './test-cases/case-7';

let employeeHeaderRepository: EmployeeHeaderRepository;
let workerRepository: WorkforcePersonRepository;
let workAssignmentsRepository: WorkAssignmentRepository;
let resourceHeaderRepository: ResourceHeaderRepository;
let resourceCapacityRepository: ResourceCapacityRepository;
let resourceRequestRepository: ResourceRequestRepository;
let capacityRequirementRepository: CapacityRequirementRepository;
let assignmentRepository: AssignmentsRepository;
let assignmentBucketRepository: AssignmentBucketRepository;
let availabilityProcedure: AvailabilityProcedure;
let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository;

@suite
export class WeekWiseAvailabilityMatch {
  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    workerRepository = await testEnvironment.getWorkforcePersonRepository();
    workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
    resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
    assignmentRepository = await testEnvironment.getAssignmentsRepository();
    assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    availabilityProcedure = await testEnvironment.getAvailabilityProcedure();
    bookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
  }

  // Deletion of Data before insertion
  private static async refreshData() {
    return Promise.all([
      employeeHeaderRepository.deleteMany(data.employeeHeaderData),
      workerRepository.deleteMany(data.workerData),
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      resourceHeaderRepository.deleteMany(data.resourceHeaderData),
      resourceCapacityRepository.deleteMany(data.resourceCapacityData),
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      capacityRequirementRepository.deleteMany(
        data.resourceRequestCapacityData,
      ),
      assignmentRepository.deleteMany(data.assignmentData),
      assignmentBucketRepository.deleteMany(data.assignmentBucketData),
      bookedCapacityAggregateRepository.deleteMany(data.bookedCapacityAggregateData),
    ]);
  }

  private static async setup() {
    return Promise.all([
      employeeHeaderRepository.insertMany(data.employeeHeaderData),
      workerRepository.insertMany(data.workerData),
      workAssignmentsRepository.insertMany(data.workAssignmentData),
      resourceHeaderRepository.insertMany(data.resourceHeaderData),
      resourceCapacityRepository.insertMany(data.resourceCapacityData),
      resourceRequestRepository.insertMany(data.resourceRequestData),
      capacityRequirementRepository.insertMany(
        data.resourceRequestCapacityData,
      ),
      assignmentRepository.insertMany(data.assignmentData),
      assignmentBucketRepository.insertMany(data.assignmentBucketData),
      bookedCapacityAggregateRepository.insertMany(data.bookedCapacityAggregateData),
    ]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'The week-wise availability of the resource is same as the requested week-wise efforts'() {
    const result = await availabilityProcedure.callProcedure(
      testcase1.resourceRequests,
      testcase1.resource,
    );
    expect(testcase1.expectation).to.eql(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'The week-wise availability of the resource is partially same as the requested week-wise efforts'() {
    const result = await availabilityProcedure.callProcedure(
      testcase2.resourceRequests,
      testcase2.resource,
    );
    expect(testcase2.expectation).to.eql(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'The resource is not available as per the requested week-wise efforts'() {
    const result = await availabilityProcedure.callProcedure(
      testcase3.resourceRequests,
      testcase3.resource,
    );
    expect(testcase3.expectation).to.eql(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'The week-wise available minutes of the resource is more than requested'() {
    const result = await availabilityProcedure.callProcedure(
      testcase4.resourceRequests,
      testcase4.resource,
    );
    expect(testcase4.expectation).to.eql(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource has zero week-wise availability for the requested duration'() {
    const result = await availabilityProcedure.callProcedure(
      testcase5.resourceRequests,
      testcase5.resource,
    );
    expect(testcase5.expectation).to.eql(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource Request start and end is mid of a month and resource has availability maintained for both the months'() {
    const result = await availabilityProcedure.callProcedure(
      testcase6.resourceRequests,
      testcase6.resource,
    );

    expect(testcase6.expectation).to.eql(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource has partial week-wise availability maintained for the requested duration'() {
    const result = await availabilityProcedure.callProcedure(
      testcase7.resourceRequests,
      testcase7.resource,
    );

    expect(testcase7.expectation).to.eql(result);
  }

  static async after() {
    return Promise.all([
      employeeHeaderRepository.deleteMany(data.employeeHeaderData),
      workerRepository.deleteMany(data.workerData),
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      resourceHeaderRepository.deleteMany(data.resourceHeaderData),
      resourceCapacityRepository.deleteMany(data.resourceCapacityData),
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      capacityRequirementRepository.deleteMany(
        data.resourceRequestCapacityData,
      ),
      assignmentRepository.deleteMany(data.assignmentData),
      assignmentBucketRepository.deleteMany(data.assignmentBucketData),
      bookedCapacityAggregateRepository.deleteMany(data.bookedCapacityAggregateData),
    ]);
  }
}
