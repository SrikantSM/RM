import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencySetRepository, ProficiencyLevel,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencySet, correctProficiencyLevelWithoutRank,
} from './data';

@suite
export class CreateProficiencyLevelsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencySetRepository: ProficiencySetRepository;

  static async before() {
    CreateProficiencyLevelsTest.serviceClient = await testEnvironment.getServiceClient();
    CreateProficiencyLevelsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    CreateProficiencyLevelsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(CreateProficiencyLevelsTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateProficiencyLevelsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'POST to ProficiencyLevels with correct data'() {
    const proficiencyLevel = { ...correctProficiencyLevelWithoutRank, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;

    await CreateProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, CreateProficiencyLevelsTest.appUser);

    this.response = await CreateProficiencyLevelsTest.serviceClient.post('/ProficiencyService/ProficiencyLevels', proficiencyLevel);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    this.response = await CreateProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
    assert.equal(this.response.data.rank, 1, 'Expected rank is persisted in the level draft.');
  }

  @test
  async 'POST to ProficiencyLevels with non-existing parent level'() {
    const createdProficiencySetId = uuid();
    const proficiencyLevel = { ...correctProficiencyLevelWithoutRank, proficiencySet_ID: createdProficiencySetId } as ProficiencyLevel;

    this.response = await CreateProficiencyLevelsTest.serviceClient.post('/ProficiencyService/ProficiencyLevels', proficiencyLevel);

    assert.equal(this.response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST to ProficiencyLevels with an active parent'() {
    const proficiencyLevel = { ...correctProficiencyLevelWithoutRank, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;

    await CreateProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet);

    this.response = await CreateProficiencyLevelsTest.serviceClient.post('/ProficiencyService/ProficiencyLevels', proficiencyLevel);

    assert.equal(this.response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
  }
}
