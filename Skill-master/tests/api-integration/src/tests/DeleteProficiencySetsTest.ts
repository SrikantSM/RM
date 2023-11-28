import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencySetRepository, ProficiencyLevelRepository, ProficiencyLevelTextRepository, ProficiencyLevel, ProficiencyLevelText,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctProficiencySet, correctProficiencyLevel, correctProficiencyLevelText } from './data';

@suite
export class DeleteProficiencySetsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  static async before() {
    DeleteProficiencySetsTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteProficiencySetsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DeleteProficiencySetsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    DeleteProficiencySetsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    DeleteProficiencySetsTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async before() {
    this.setCorrelationId(DeleteProficiencySetsTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteProficiencySetsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'DELETE existing active proficiencySet'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencySetsTest.appUser);
    await DeleteProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencySetsTest.appUser);
    await DeleteProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencySetsTest.appUser);

    this.response = await DeleteProficiencySetsTest.serviceClient.delete(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 405, 'Expected status code of proficiency set deletion to be 405 (METHOD NOT ALLOWED).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level reading to be 200 (OK).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of profociency level text reading to be 200 (OK).');
  }

  @test
  async 'DELETE existing inactive proficiencySet'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, DeleteProficiencySetsTest.appUser);
    await DeleteProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, DeleteProficiencySetsTest.appUser);
    await DeleteProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.BOTH, DeleteProficiencySetsTest.appUser);

    this.response = await DeleteProficiencySetsTest.serviceClient.delete(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of proficiency set deletion to be 204 (NO CONTENT).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected inactive proficiency set to be deleted, i.e. that the status code of the inactive proficiency set reading to be 404 (NOT FOUND).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency set to not be deleted, i.e. that the status code of the active proficiency set reading to be 200 (OK).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected inactive proficiency level to be deleted, i.e. that the status code of the inactive proficiency level reading to be 404 (NOT FOUND).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency level to not be deleted, i.e. that the status code of the active proficiency level reading to be 200 (OK).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency level text to not be deleted, i.e. that the status code of the active proficiency level text reading to be 200 (OK).');

    this.response = await DeleteProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of proficiency level text reading to be 404 (NOT FOUND).');
  }

  @test
  async 'DELETE non-existing active proficiency set'() {
    this.response = await DeleteProficiencySetsTest.serviceClient.delete(`/ProficiencyService/ProficiencySets(ID=${uuid()},IsActiveEntity=true)`);

    assert.equal(this.response.status, 405, 'Expected status code to be 405 (METHOD NOT ALLOWED).');
  }

  @test
  async 'DELETE non-existing inactive proficieny set'() {
    this.response = await DeleteProficiencySetsTest.serviceClient.delete(`/ProficiencyService/ProficiencySets(ID=${uuid()},IsActiveEntity=false)`);

    assert.equal(this.response.status, 404, 'Expected status code to be 404 (NOT FOUND).');
  }
}
