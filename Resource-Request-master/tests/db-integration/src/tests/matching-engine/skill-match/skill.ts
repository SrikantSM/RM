import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  WorkAssignmentRepository,
  SkillRepository,
  SkillAssignmentRepository,
  SkillRequirementRepository,
  AlternativeLabelRepository,
  SkillProcedure,
  ProficiencySetRepository,
  ProficiencyLevelRepository,
} from 'test-commons';
import { testEnvironment, TEST_TIMEOUT } from '../../../utils';

import * as data from './data';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';
import * as testcase3 from './test-cases/case-3';
import * as testcase4 from './test-cases/case-4';
import * as testcase5 from './test-cases/case-5';
import * as testcase6 from './test-cases/case-6';
import * as testcase7 from './test-cases/case-7';
import * as testcase8 from './test-cases/case-8';
import * as testcase9 from './test-cases/case-9';
import * as testcase10 from './test-cases/case-10';

let workAssignmentsRepository: WorkAssignmentRepository;
let skillRepository: SkillRepository;
let skillAssignmentRepository: SkillAssignmentRepository;
let skillRequirementRepository: SkillRequirementRepository;
let proficiencySetRepository: ProficiencySetRepository;
let proficiencyLevelRepository: ProficiencyLevelRepository;
let skillLabelRepository: AlternativeLabelRepository;
let skillProcedure: SkillProcedure;

@suite
export class Skill {
  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
    skillRepository = await testEnvironment.getSkillRepository();
    skillAssignmentRepository = await testEnvironment.getSkillAssignmentRepository();
    skillRequirementRepository = await testEnvironment.getSkillRequirementRepository();
    skillLabelRepository = await testEnvironment.getAlternativeLabelRepository();
    skillProcedure = await testEnvironment.getSkillProcedure();
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
  }

  // Deletion of Data before insertion
  private static async refreshData() {
    await workAssignmentsRepository.deleteMany(data.workAssignmentData);
    await skillRepository.deleteMany(data.skillsData);
    await proficiencySetRepository.deleteMany(data.proficiencySetData);
  }

  private static async setup() {
    await workAssignmentsRepository.insertMany(data.workAssignmentData);
    await proficiencySetRepository.ensureDefaultProficiency();
    await proficiencySetRepository.insertMany(data.proficiencySetData);
    await proficiencyLevelRepository.insertMany(data.proficiencyLevelData);
    await skillRepository.insertMany(data.skillsData);
    await skillLabelRepository.insertMany(data.skillLabelData);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'No Skill maintained for Employee '() {
    await testcase1.setupData(skillRequirementRepository);
    const result = await skillProcedure.callProcedure(
      testcase1.resourceRequests,
      testcase1.resource,
    );
    await testcase1.cleanupData(skillRequirementRepository);
    expect(testcase1.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'No Skill maintained for Resource Request '() {
    await testcase2.setupData(skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase2.resourceRequests,
      testcase2.resource,
    );
    await testcase2.cleanupData(skillAssignmentRepository);
    expect(testcase2.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Complete skill match '() {
    await testcase3.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase3.resourceRequests,
      testcase3.resource,
    );
    await testcase3.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase3.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'No Skill Matched'() {
    await testcase4.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase4.resourceRequests,
      testcase4.resource,
    );
    await testcase4.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase4.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Skill partially matched'() {
    await testcase5.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase5.resourceRequests,
      testcase5.resource,
    );
    await testcase5.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase5.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Skill Match for mandatory skills'() {
    await testcase6.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase6.resourceRequests,
      testcase6.resource,
    );
    await testcase6.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase6.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource request has only preferred Skills'() {
    await testcase7.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase7.resourceRequests,
      testcase7.resource,
    );
    await testcase7.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase7.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource does not have the requested Skill'() {
    await testcase8.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase8.resourceRequests,
      testcase8.resource,
    );
    await testcase8.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase8.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource has skill assigned to default proficiency level'() {
    await testcase9.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase9.resourceRequests,
      testcase9.resource,
    );
    await testcase9.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase9.expectation).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Resource Request has skill assigned to default proficiency level'() {
    await testcase10.setupData(skillRequirementRepository, skillAssignmentRepository);
    const result = await skillProcedure.callProcedure(
      testcase10.resourceRequests,
      testcase10.resource,
    );
    await testcase10.cleanupData(skillRequirementRepository, skillAssignmentRepository);
    expect(testcase10.expectation).to.have.deep.members(result);
  }

  static async after() {
    await workAssignmentsRepository.deleteMany(data.workAssignmentData);
    await skillRepository.deleteMany(data.skillsData);
    await proficiencySetRepository.deleteMany(data.proficiencySetData);
  }
}
