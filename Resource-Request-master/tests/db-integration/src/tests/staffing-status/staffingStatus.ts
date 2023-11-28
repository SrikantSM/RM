import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  ResourceRequestRepository,
  AssignmentsRepository,
  AssignmentBucketRepository,
  StaffingStatus,
} from 'test-commons';
import { TEST_TIMEOUT, testEnvironment } from '../../utils';

import * as data from './data';

import { expectedResult } from './test-cases';

let resourceRequestRepository: ResourceRequestRepository;
let assignmentRepository: AssignmentsRepository;
let assignmentBucketRepository: AssignmentBucketRepository;

@suite
export class StaffingStatusTest {
  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    // staffingStatusesRepository = await testEnvironment.getStaffingStatusRepository();
    assignmentRepository = await testEnvironment.getAssignmentsRepository();
    assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
  }

  // Deletion of Data before insertion
  private static async refreshData() {
    return Promise.all([
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      assignmentRepository.deleteMany(data.assignmentData),
      assignmentBucketRepository.deleteMany(data.assignmentBucketData),
    ]);
  }

  private static async setup() {
    return Promise.all([
      resourceRequestRepository.insertMany(data.resourceRequestData),
      assignmentRepository.insertMany(data.assignmentData),
      assignmentBucketRepository.insertMany(data.assignmentBucketData),
    ]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Staffing status Over-Staffed'() {
    const actualResult: StaffingStatus[] = await testEnvironment.getStaffingStatus(
      expectedResult[0].ID,
    );
    expect(actualResult).to.eql([expectedResult[0]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Staffing status Fully-Staffed'() {
    const actualResult: StaffingStatus[] = await testEnvironment.getStaffingStatus(
      expectedResult[1].ID,
    );
    expect(actualResult).to.eql([expectedResult[1]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Staffing status Under-Staffed'() {
    const actualResult: StaffingStatus[] = await testEnvironment.getStaffingStatus(
      expectedResult[2].ID,
    );
    expect(actualResult).to.eql([expectedResult[2]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Staffing status Not-Staffed'() {
    const actualResult: StaffingStatus[] = await testEnvironment.getStaffingStatus(
      expectedResult[3].ID,
    );
    expect(actualResult).to.eql([expectedResult[3]]);
  }

  static async after() {
    return Promise.all([
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      assignmentRepository.deleteMany(data.assignmentData),
      assignmentBucketRepository.deleteMany(data.assignmentBucketData),
    ]);
  }
}
