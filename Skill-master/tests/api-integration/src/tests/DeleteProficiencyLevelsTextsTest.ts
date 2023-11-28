import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  ProficiencyLevelRepository, ProficiencySetRepository, ProficiencyLevelTextRepository, ProficiencyLevel, ProficiencyLevelText, EntityDraftMode,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencySet, correctProficiencyLevel, correctProficiencyLevelText, secondCorrectProficiencyLevelText,
} from './data';

@suite
export class DeleteProficiencyLevelsTextsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  private static proficiencySetRepository: ProficiencySetRepository;

  static async before() {
    DeleteProficiencyLevelsTextsTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteProficiencyLevelsTextsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DeleteProficiencyLevelsTextsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    DeleteProficiencyLevelsTextsTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
    DeleteProficiencyLevelsTextsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(DeleteProficiencyLevelsTextsTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteProficiencyLevelsTextsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'DELETE existing active proficiency level text'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencyLevelsTextsTest.appUser);
    await DeleteProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencyLevelsTextsTest.appUser);
    await DeleteProficiencyLevelsTextsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.ACTIVE_ONLY, DeleteProficiencyLevelsTextsTest.appUser);

    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency level text deletion to be 400 (BAD REQUEST).');
  }

  @test
  async 'DELETE existing inactive proficiency level text'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const proficiencyLevelText2 = { ...secondCorrectProficiencyLevelText, name: uuid(), ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await DeleteProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, DeleteProficiencyLevelsTextsTest.appUser);
    await DeleteProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, DeleteProficiencyLevelsTextsTest.appUser);
    await DeleteProficiencyLevelsTextsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.BOTH, DeleteProficiencyLevelsTextsTest.appUser);
    await DeleteProficiencyLevelsTextsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText2, EntityDraftMode.DRAFT_ONLY, DeleteProficiencyLevelsTextsTest.appUser);

    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of proficiency level deletion to be 204 (NO CONTENT).');

    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${correctProficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.data.name, proficiencyLevelText2.name, 'Expected name of non-deleted text to be replicated.');

    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active proficiency level text to not be deleted, i.e. that the status code of the active proficiency level text reading to be 200 (OK).');

    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of proficiency level text reading to be 404 (NOT FOUND).');
  }

  @test
  async 'DELETE non-existing active proficiency level text'() {
    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${uuid()},IsActiveEntity=true)`);

    assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
  }

  @test
  async 'DELETE non-existing inactive proficieny level text'() {
    this.response = await DeleteProficiencyLevelsTextsTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${uuid()},IsActiveEntity=false)`);

    assert.equal(this.response.status, 404, 'Expected status code to be 404 (NOT FOUND).');
  }
}
