import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';

import {
  ResourceRequestRepository,
  ResourceOrganizationsRepository,
  ResourceOrganizationItemsRepository,
  UserResourceOrganizationRepository
} from 'test-commons';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';

import * as data from './data';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';
import * as testcase3 from './test-cases/case-3';

let resourceRequestRepository: ResourceRequestRepository;;
let resourceOrganizationsRepository: ResourceOrganizationsRepository;
let resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
let userResourceOrganizationRepository: UserResourceOrganizationRepository;

@suite
export class Authorization {
  public static async before() {
    await this.getRepositories();
    await this.refreshData();
    await this.setup();
  }

  private static async getRepositories() {
    resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
    resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
    resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
    userResourceOrganizationRepository = await testEnvironment.getUserResourceOrganizationRepository();
  }

  // Deletion of Data before insertion
  private static async refreshData() {
    return Promise.all([
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      resourceOrganizationsRepository.deleteMany(data.resourceOrganizationData),
      resourceOrganizationItemsRepository.deleteMany(data.resourceOrganizationItemsData),
      userResourceOrganizationRepository.deleteMany([...testcase2.userResourceOrganizationData, ...testcase3.userResourceOrganizations])
    ]);
  }

  private static async setup() {
    return Promise.all([
      resourceRequestRepository.insertMany(data.resourceRequestData),
      resourceOrganizationsRepository.insertMany(data.resourceOrganizationData),
      resourceOrganizationItemsRepository.insertMany(data.resourceOrganizationItemsData),
    ]);
  }

  // 1. When ResourceManager is not assigned to any resource organization,only the processing resource organization of RR is expected
  @test(timeout(TEST_TIMEOUT))
  async 'When no resource organizations are assigned'() {
    const result = await testEnvironment.getAuthorizedResourceOrganizations(
      data.resourceRequestData[0].ID,
    );

    expect(result).to.have.deep.members(testcase1.authorizedResourceOrganizations);
  }

  // 2. When ResourceManager is assigned a resource organization same as the processingResourceOrg, the processingResourceOrg is expected
  @test(timeout(TEST_TIMEOUT))
  async 'When assigned resource organization same as processing resource org'() {
    userResourceOrganizationRepository.insertMany(testcase2.userResourceOrganizationData);

    const result = await testEnvironment.getAuthorizedResourceOrganizations(
      data.resourceRequestData[0].ID,
    );

    expect(result).to.have.deep.members(testcase2.authorizedResourceOrganizations);
    userResourceOrganizationRepository.deleteMany(testcase2.userResourceOrganizationData);
  }

  // 3. When ResourceManager is assigned a resource organization not same as processingResourceOrg, the expected result is empty
  @test(timeout(TEST_TIMEOUT))
  async 'When assigned resource organization is not same as resource org'() {
    userResourceOrganizationRepository.insertMany(testcase3.userResourceOrganizations);
    const result = await testEnvironment.getAuthorizedResourceOrganizations(
      data.resourceRequestData[0].ID,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.empty;
    userResourceOrganizationRepository.deleteMany(testcase3.userResourceOrganizations);
  }

  static async after() {
    return Promise.all([
      resourceRequestRepository.deleteMany(data.resourceRequestData),
      resourceOrganizationsRepository.deleteMany(data.resourceOrganizationData),
      resourceOrganizationItemsRepository.deleteMany(data.resourceOrganizationItemsData),
      userResourceOrganizationRepository.deleteMany([...testcase2.userResourceOrganizationData, ...testcase3.userResourceOrganizations])
    ]);
  }
}
