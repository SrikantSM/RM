import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencyLevel, ProficiencyLevelRepository, ProficiencySetRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctProficiencyLevel, correctProficiencySet } from './data';

@suite
export class PatchProficiencyLevelsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencySetRepository: ProficiencySetRepository;

  static async before() {
    PatchProficiencyLevelsTest.serviceClient = await testEnvironment.getServiceClient();
    PatchProficiencyLevelsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    PatchProficiencyLevelsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    PatchProficiencyLevelsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
  }

  async before() {
    this.setCorrelationId(PatchProficiencyLevelsTest.serviceClient);
  }

  async after() {
    super.after();
    await PatchProficiencyLevelsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'PATCH the name of an existing active proficiency level'() {
    await PatchProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      name: uuid(),
      proficiencySet_ID: correctProficiencySet.ID,
      rank: 0,
      odmUUID: null,
      texts: [{
        name: 'name',
        locale: 'en',
      }],
    };

    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await PatchProficiencyLevelsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.ACTIVE_ONLY);

    this.response = await PatchProficiencyLevelsTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of level PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of level reading to be 200 (OK).');
    assert.equal(this.response.data.name, proficiencyLevel.name, 'Expected old name is persisted in the level draft.');
  }

  @test
  async 'PATCH the name of an existing inactive proficiency level'() {
    await PatchProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, PatchProficiencyLevelsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await PatchProficiencyLevelsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, PatchProficiencyLevelsTest.appUser);

    this.response = await PatchProficiencyLevelsTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of level PATCH request to be 200 (OK).');

    this.response = await PatchProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of level reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be persisted in the level draft.');
  }

  @test
  async 'PATCH the name of a non-existing inactive proficiency level'() {
    await PatchProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, PatchProficiencyLevelsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const createdLevelId = uuid();
    this.response = await PatchProficiencyLevelsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/proficiencyLevels(ID=${createdLevelId},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 201, 'Expected status code of proficiency level creation to be 201 (CREATED).');
  }
}
