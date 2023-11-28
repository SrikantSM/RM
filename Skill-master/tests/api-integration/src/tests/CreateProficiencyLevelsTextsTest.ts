import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencySetRepository, ProficiencyLevelRepository, ProficiencyLevel,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencyLevel, correctProficiencySet, correctProficiencyLevelText,
} from './data';

@suite
export class CreateProficiencyLevelsTextsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  static async before() {
    CreateProficiencyLevelsTextsTest.serviceClient = await testEnvironment.getServiceClient();
    CreateProficiencyLevelsTextsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    CreateProficiencyLevelsTextsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    CreateProficiencyLevelsTextsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(CreateProficiencyLevelsTextsTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateProficiencyLevelsTextsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'POST to ProficiencySets/proficiencyLevels/texts with correct data'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;

    await CreateProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, CreateProficiencyLevelsTextsTest.appUser);
    await CreateProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, CreateProficiencyLevelsTextsTest.appUser);

    this.response = await CreateProficiencyLevelsTextsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/proficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)/texts`, correctProficiencyLevelText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = this.response.data.ID_texts;
    this.response = await CreateProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencyLevels/texts with correct data'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;

    await CreateProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, CreateProficiencyLevelsTextsTest.appUser);
    await CreateProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, CreateProficiencyLevelsTextsTest.appUser);

    this.response = await CreateProficiencyLevelsTextsTest.serviceClient.post(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)/texts`, correctProficiencyLevelText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = this.response.data.ID_texts;
    this.response = await CreateProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencyLevels/texts with non-existing parent level'() {
    const createdProficiencyLevelId = uuid();

    this.response = await CreateProficiencyLevelsTextsTest.serviceClient.post(`/ProficiencyService/ProficiencyLevels(ID=${createdProficiencyLevelId},IsActiveEntity=false)/texts`, correctProficiencyLevelText);

    assert.equal(this.response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST to ProficiencyLevels/texts active parent'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;

    await CreateProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet);
    await CreateProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel);

    this.response = await CreateProficiencyLevelsTextsTest.serviceClient.post(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)/texts`, correctProficiencyLevelText);

    assert.equal(this.response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
  }
}
