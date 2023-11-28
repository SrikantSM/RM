import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  EmployeeHeaderRepository,
  WorkforcePersonRepository,
  WorkAssignmentRepository,
  AlternativeLabelRepository,
  SkillAssignmentRepository,
  RoleAssignmentRepository,
  ResourceHeaderRepository,
  ResourceCapacityRepository,
  ProfileDetailRepository,
  ResourceRequestRepository,
  CapacityRequirementRepository,
  SkillRequirementRepository,
  SkillRepository,
  OrganizationDetailRepository,
  OrganizationHeaderRepository,
  JobDetailRepository,
  SessionVariableProcessor,
  CostCenterRepository,
  ProficiencySetRepository,
  ResourceOrganizationsRepository,
  ResourceOrganizationItemsRepository,
} from 'test-commons';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';

import * as data from './data';
import { matchingCandidates as expectation } from './test-cases/case-1';

let employeeHeaderRepository: EmployeeHeaderRepository;
let workerRepository: WorkforcePersonRepository;
let workAssignmentsRepository: WorkAssignmentRepository;
let skillRepository: SkillRepository;
let skillLabelRepository: AlternativeLabelRepository;
let skillAssignmentRepository: SkillAssignmentRepository;
let roleAssignmentRepository: RoleAssignmentRepository;
let resourceHeaderRepository: ResourceHeaderRepository;
let resourceCapacityRepository: ResourceCapacityRepository;
let profileDetailRepository: ProfileDetailRepository;
let resourceRequestRepository: ResourceRequestRepository;
let capacityRequirementRepository: CapacityRequirementRepository;
let skillRequirementRepository: SkillRequirementRepository;
let organizationDetailsRepository: OrganizationDetailRepository;
let organizationHeaderRepository: OrganizationHeaderRepository;
let jobDetailRepository : JobDetailRepository;
let sessionVariableProcessor: SessionVariableProcessor;
let costCenterRepository : CostCenterRepository;
let proficiencySetRepository : ProficiencySetRepository;
let resourceOrganizationsRepository: ResourceOrganizationsRepository;
let resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;

// const matchingCandidates = testEnvironment.getMatchingCandidates;

@suite
export class TotalMatch {
  private static validFrom = 'VALID-FROM';

  private static validTo = 'VALID-TO';

  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    skillRepository = await testEnvironment.getSkillRepository();
    workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
    skillAssignmentRepository = await testEnvironment.getSkillAssignmentRepository();
    skillRequirementRepository = await testEnvironment.getSkillRequirementRepository();
    skillLabelRepository = await testEnvironment.getAlternativeLabelRepository();
    employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    workerRepository = await testEnvironment.getWorkforcePersonRepository();
    roleAssignmentRepository = await testEnvironment.getRoleAssignmentRepository();
    resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    profileDetailRepository = await testEnvironment.getProfileDetailRepository();
    resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
    organizationDetailsRepository = await testEnvironment.getOrganizationDetailRepository();
    organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    jobDetailRepository = await testEnvironment.getJobDetailRepository();
    sessionVariableProcessor = await testEnvironment.getSessionVariableProcessor();
    costCenterRepository = await testEnvironment.getCostCenterRepository();
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
  }

  // Deletion of Data before insertion
  private static async refreshData() {
    return Promise.all([
      employeeHeaderRepository.deleteMany(data.employeeHeaderData),
      workerRepository.deleteMany(data.workerData),
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      skillRepository.deleteMany(data.skillsData),
      skillLabelRepository.deleteMany(data.skillLabelData),
      skillAssignmentRepository.deleteMany(data.skillAssignmentData),
      roleAssignmentRepository.deleteMany(data.roleAssignmentData),
      resourceHeaderRepository.deleteMany(data.resourceHeaderData),
      resourceCapacityRepository.deleteMany(data.resourceCapacityData),
      profileDetailRepository.deleteMany(data.ProfileDetails),
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      capacityRequirementRepository.deleteMany(
        data.resourceRequestCapacityData,
      ),
      skillRequirementRepository.deleteMany(data.skillRequirementsData),
      organizationHeaderRepository.deleteMany(data.organizationHeaders),
      organizationDetailsRepository.deleteMany(data.organizationDetails),
      jobDetailRepository.deleteMany(data.jobDetailData),
      costCenterRepository.deleteMany(data.costCenterData),
      resourceOrganizationsRepository.deleteMany(data.resourceOrganizationData),
      resourceOrganizationItemsRepository.deleteMany(data.resourceOrganizationItemsData),
    ]);
  }

  private static async setup() {
    return Promise.all([
      employeeHeaderRepository.insertMany(data.employeeHeaderData),
      workerRepository.insertMany(data.workerData),
      workAssignmentsRepository.insertMany(data.workAssignmentData),
      skillRepository.insertMany(data.skillsData),
      skillLabelRepository.insertMany(data.skillLabelData),
      skillAssignmentRepository.insertMany(data.skillAssignmentData),
      roleAssignmentRepository.insertMany(data.roleAssignmentData),
      resourceHeaderRepository.insertMany(data.resourceHeaderData),
      resourceCapacityRepository.insertMany(data.resourceCapacityData),
      profileDetailRepository.insertMany(data.ProfileDetails),
      resourceRequestRepository.insertMany(data.resourceRequestData),
      capacityRequirementRepository.insertMany(
        data.resourceRequestCapacityData,
      ),
      skillRequirementRepository.insertMany(data.skillRequirementsData),
      organizationHeaderRepository.insertMany(data.organizationHeaders),
      organizationDetailsRepository.insertMany(data.organizationDetails),
      jobDetailRepository.insertMany(data.jobDetailData),
      costCenterRepository.insertMany(data.costCenterData),
      proficiencySetRepository.ensureDefaultProficiency(),
      resourceOrganizationsRepository.insertMany(data.resourceOrganizationData),
      resourceOrganizationItemsRepository.insertMany(data.resourceOrganizationItemsData),
    ]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - Employee with 100% Match'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-03-30');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-03-30');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[0].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[0].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - Employee with Multiple Roles'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[1].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[1].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - Employee with Partial Match'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[2].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[2].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - Employee with No Roles'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[3].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[3].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - Employee with No Roles Assigned'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[4].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[4].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - Inactive employee should not come up'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[5].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.empty;
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match - No resources fetched when WorkAssignments-JobDetails is not present for the given validity period'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2023-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2023-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[0].ID,
      data.resourceHeaderData[4].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.empty;
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match In case of Day wise Split RR - Employee with 100% Match'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[1].ID,
      data.resourceHeaderData[6].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[6].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Total match In case of Week-wise Split RR - Employee with 100% Match'() {
    await sessionVariableProcessor.set(TotalMatch.validFrom, '2019-01-01');
    await sessionVariableProcessor.set(TotalMatch.validTo, '2019-01-01');
    const result = await testEnvironment.getMatchingCandidates(
      data.resourceRequestData[2].ID,
      data.resourceHeaderData[7].ID,
    );
    const expected = expectation.filter(
      (obj) => obj.RESOURCE_ID === data.resourceHeaderData[7].ID,
    );
    await sessionVariableProcessor.unSet(TotalMatch.validFrom);
    await sessionVariableProcessor.unSet(TotalMatch.validTo);
    expect(expected).to.have.deep.members(result);
  }

  static async after() {
    return Promise.all([
      employeeHeaderRepository.deleteMany(data.employeeHeaderData),
      workerRepository.deleteMany(data.workerData),
      workAssignmentsRepository.deleteMany(data.workAssignmentData),
      skillRepository.deleteMany(data.skillsData),
      skillLabelRepository.deleteMany(data.skillLabelData),
      skillAssignmentRepository.deleteMany(data.skillAssignmentData),
      roleAssignmentRepository.deleteMany(data.roleAssignmentData),
      resourceHeaderRepository.deleteMany(data.resourceHeaderData),
      resourceCapacityRepository.deleteMany(data.resourceCapacityData),
      profileDetailRepository.deleteMany(data.ProfileDetails),
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      capacityRequirementRepository.deleteMany(
        data.resourceRequestCapacityData,
      ),
      skillRequirementRepository.deleteMany(data.skillRequirementsData),
      organizationHeaderRepository.deleteMany(data.organizationHeaders),
      organizationDetailsRepository.deleteMany(data.organizationDetails),
      jobDetailRepository.deleteMany(data.jobDetailData),
      costCenterRepository.deleteMany(data.costCenterData),
      resourceOrganizationsRepository.deleteMany(data.resourceOrganizationData),
      resourceOrganizationItemsRepository.deleteMany(data.resourceOrganizationItemsData),
    ]);
  }
}
