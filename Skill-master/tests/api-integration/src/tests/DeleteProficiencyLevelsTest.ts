import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  ProficiencyLevelRepository, ProficiencySetRepository, ProficiencyLevelTextRepository, ProficiencyLevel, ProficiencyLevelText, EntityDraftMode,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencySet, correctProficiencyLevel, secondCorrectProficiencyLevelWithoutRank, correctProficiencyLevelText, secondCorrectProficiencyLevelText,
} from './data';

@suite
export class DeleteProficiencyLevelsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  private static proficiencySetRepository: ProficiencySetRepository;

  static async before() {
    DeleteProficiencyLevelsTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteProficiencyLevelsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DeleteProficiencyLevelsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    DeleteProficiencyLevelsTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
    DeleteProficiencyLevelsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(DeleteProficiencyLevelsTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteProficiencyLevelsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'DELETE existing active proficiency level'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencyLevelsTest.appUser);
    await DeleteProficiencyLevelsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencyLevelsTest.appUser);
    await DeleteProficiencyLevelsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencyLevelsTest.appUser);

    this.response = await DeleteProficiencyLevelsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 405, 'Expected status code of proficiency level deletion to be 405 (METHOD NOT ALLOWED).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level reading to be 200 (OK).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of profociency level text reading to be 200 (OK).');
  }

  @test
  async 'DELETE existing inactive proficiency level'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, DeleteProficiencyLevelsTest.appUser);
    await DeleteProficiencyLevelsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, DeleteProficiencyLevelsTest.appUser);
    await DeleteProficiencyLevelsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.BOTH, DeleteProficiencyLevelsTest.appUser);

    this.response = await DeleteProficiencyLevelsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of proficiency level deletion to be 204 (NO CONTENT).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected inactive proficiency level to be deleted, i.e. that the status code of the inactive proficiency set reading to be 404 (NOT FOUND).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency level to not be deleted, i.e. that the status code of the active proficiency level reading to be 200 (OK).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency level text to not be deleted, i.e. that the status code of the active proficiency level text reading to be 200 (OK).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of proficiency level text reading to be 404 (NOT FOUND).');
  }

  @test
  async 'DELETE an already actviated - inactive proficiencylevel and activate'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const secondProficiencyLevel = { ...secondCorrectProficiencyLevelWithoutRank, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const secondProficiencyLevelText = { ...secondCorrectProficiencyLevelText, ID: secondProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencyLevelsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, DeleteProficiencyLevelsTest.appUser);
    await DeleteProficiencyLevelsTest.proficiencyLevelRepository.insertMany([proficiencyLevel, secondProficiencyLevel], EntityDraftMode.BOTH, DeleteProficiencyLevelsTest.appUser);
    await DeleteProficiencyLevelsTest.proficiencyLevelTextRepository.insertMany([proficiencyLevelText, secondProficiencyLevelText], EntityDraftMode.BOTH, DeleteProficiencyLevelsTest.appUser);

    this.response = await DeleteProficiencyLevelsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of proficiency level deletion to be 204 (NO CONTENT).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected inactive proficiency level to be deleted, i.e. that the status code of the inactive proficiency set reading to be 404 (NOT FOUND).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency level to not be deleted, i.e. that the status code of the active proficiency level reading to be 200 (OK).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level text reading to be 200 (OK).');

    this.response = await DeleteProficiencyLevelsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of proficiency level text reading to be 404 (NOT FOUND).');
  }

  @test
  async 'DELETE non-existing active proficiency level'() {
    this.response = await DeleteProficiencyLevelsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels(ID=${uuid()},IsActiveEntity=true)`);

    assert.equal(this.response.status, 405, 'Expected status code to be 405 (METHOD NOT ALLOWED).');
  }

  @test
  async 'DELETE non-existing inactive proficieny level'() {
    this.response = await DeleteProficiencyLevelsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels(ID=${uuid()},IsActiveEntity=false)`);

    assert.equal(this.response.status, 404, 'Expected status code to be 404 (NOT FOUND).');
  }
}
