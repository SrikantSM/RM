import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  EmployeeHeaderRepository,
  WorkforcePersonRepository,
  WorkAssignmentRepository,
  ResourceHeaderRepository,
  ResourceCapacityRepository,
  AssignmentsRepository,
  AssignmentBucketRepository,
  UtilizationProcedure,
  BookedCapacityAggregateRepository,
} from 'test-commons';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';

import * as data from './data';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';
import * as testcase3 from './test-cases/case-3';
import * as testcase4 from './test-cases/case-4';
import * as testcase5 from './test-cases/case-5';
import * as testcase6 from './test-cases/case-6';

let employeeHeaderRepository: EmployeeHeaderRepository;
let workerRepository: WorkforcePersonRepository;
let workAssignmentsRepository: WorkAssignmentRepository;
let resourceHeaderRepository: ResourceHeaderRepository;
let resourceCapacityRepository: ResourceCapacityRepository;
let assignmentRepository: AssignmentsRepository;
let assignmentBucketRepository: AssignmentBucketRepository;
let utilizationProcedure: UtilizationProcedure;
let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository;

@suite
export class Utilization {
  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
    workerRepository = await testEnvironment.getWorkforcePersonRepository();
    resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    assignmentRepository = await testEnvironment.getAssignmentsRepository();
    assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
    utilizationProcedure = await testEnvironment.getUtilizationProcedure();
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
      assignmentRepository.insertMany(data.assignmentData),
      assignmentBucketRepository.insertMany(data.assignmentBucketData),
      bookedCapacityAggregateRepository.insertMany(data.bookedCapacityAggregateData),
    ]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource is not utilized for next 90 days'() {
    const STARTTIME = '2019-01-01 00:00:00.000';
    const ENDTIME = '2019-01-03 00:00:00.000';
    const result = await utilizationProcedure.callProcedure(
      testcase1.resource,
      STARTTIME,
      ENDTIME,
    );
    expect(testcase1.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource is utilized for next 90 days'() {
    const STARTTIME = '2019-01-01 00:00:00.000';
    const ENDTIME = '2019-01-03 00:00:00.000';
    const result = await utilizationProcedure.callProcedure(
      testcase2.resource,
      STARTTIME,
      ENDTIME,
    );
    expect(testcase2.expectation).to.have.deep.members(result);
  }

  //

  @test(timeout(TEST_TIMEOUT))
  async 'Resource is partially utilized for next 90 days'() {
    const STARTTIME = '2019-01-01 00:00:00.000';
    const ENDTIME = '2019-01-03 00:00:00.000';
    const result = await utilizationProcedure.callProcedure(
      testcase3.resource,
      STARTTIME,
      ENDTIME,
    );
    expect(testcase3.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource is partially available & completely utilized for those available dates'() {
    const STARTTIME = '2019-01-01 00:00:00.000';
    const ENDTIME = '2019-01-03 00:00:00.000';
    const result = await utilizationProcedure.callProcedure(
      testcase4.resource,
      STARTTIME,
      ENDTIME,
    );
    expect(testcase4.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource is over utilized for next 90 days'() {
    const STARTTIME = '2019-01-01 00:00:00.000';
    const ENDTIME = '2019-01-03 00:00:00.000';
    const result = await utilizationProcedure.callProcedure(
      testcase5.resource,
      STARTTIME,
      ENDTIME,
    );
    expect(testcase5.expectation).to.have.deep.members(result);
  }

  // Need to test again for this

  @test(timeout(TEST_TIMEOUT))
  async 'Resource is not utilized as availability is zero'() {
    const STARTTIME = '2019-01-01 00:00:00.000';
    const ENDTIME = '2019-01-03 00:00:00.000';
    const result = await utilizationProcedure.callProcedure(
      testcase6.resource,
      STARTTIME,
      ENDTIME,
    );
    expect(testcase6.expectation).to.have.deep.members(result);
  }

  static async after() {
    return Promise.all([
      employeeHeaderRepository.deleteMany(data.employeeHeaderData),
      workerRepository.deleteMany(data.workerData),
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      resourceHeaderRepository.deleteMany(data.resourceHeaderData),
      resourceCapacityRepository.deleteMany(data.resourceCapacityData),
      assignmentRepository.deleteMany(data.assignmentData),
      assignmentBucketRepository.deleteMany(data.assignmentBucketData),
      bookedCapacityAggregateRepository.deleteMany(data.bookedCapacityAggregateData),
    ]);
  }
}
