import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  WorkAssignmentRepository,
  RoleAssignmentRepository,
  RoleMatchProcedure,
} from 'test-commons';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';

import * as data from './data';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';

let workAssignmentsRepository: WorkAssignmentRepository;
let roleAssignmentRepository: RoleAssignmentRepository;
let roleMatchProcedure: RoleMatchProcedure;

@suite
export class RoleMatch {
  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
    roleAssignmentRepository = await testEnvironment.getRoleAssignmentRepository();
    roleMatchProcedure = await testEnvironment.getRoleMatchProcedure();
  }

  // Deletion of Data before insertion
  private static async refreshData() {
    return Promise.all([
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      roleAssignmentRepository.deleteMany(data.roleAssignmentData),
    ]);
  }

  private static async setup() {
    return Promise.all([
      workAssignmentsRepository.insertMany(data.workAssignmentData),
      roleAssignmentRepository.insertMany(data.roleAssignmentData),
    ]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'one role filter is passed'() {
    const result = await roleMatchProcedure.callProcedure(
      testcase1.resource,
      testcase1.projectRole_ID,
    );
    expect(testcase1.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'No role filter is passed'() {
    const result = await roleMatchProcedure.callProcedure(
      testcase2.resource,
      testcase2.projectRole_ID,
    );
    expect(testcase2.expectation).to.have.deep.members(result);
  }

  static async after() {
    return Promise.all([
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      roleAssignmentRepository.deleteMany(data.roleAssignmentData),
    ]);
  }
}
