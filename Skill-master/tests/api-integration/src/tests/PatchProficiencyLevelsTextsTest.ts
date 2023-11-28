import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencyLevel, ProficiencyLevelRepository, ProficiencyLevelText, ProficiencyLevelTextRepository, ProficiencySetRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctProficiencyLevel, correctProficiencySet, correctProficiencyLevelText } from './data';

@suite
export class PatchProficiencyLevelsTextsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencySetRepository: ProficiencySetRepository;

  static async before() {
    PatchProficiencyLevelsTextsTest.serviceClient = await testEnvironment.getServiceClient();
    PatchProficiencyLevelsTextsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    PatchProficiencyLevelsTextsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    PatchProficiencyLevelsTextsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    PatchProficiencyLevelsTextsTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async before() {
    this.setCorrelationId(PatchProficiencyLevelsTextsTest.serviceClient);
  }

  async after() {
    super.after();
    await PatchProficiencyLevelsTextsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'PATCH the name of an existing active proficiency level text'() {
    await PatchProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await PatchProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      name: uuid(),
      locale: 'en',
      description: 'decription',
      ID: proficiencyLevel.ID,
    };

    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: proficiencyLevel.ID } as ProficiencyLevelText;
    await PatchProficiencyLevelsTextsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.ACTIVE_ONLY);

    this.response = await PatchProficiencyLevelsTextsTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of text PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
    assert.equal(this.response.data.name, proficiencyLevelText.name, 'Expected old name is persisted in the text draft.');
  }

  @test
  async 'PATCH the name of an existing inactive proficiency level text'() {
    await PatchProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, PatchProficiencyLevelsTextsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await PatchProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, PatchProficiencyLevelsTextsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: proficiencyLevel.ID } as ProficiencyLevelText;
    await PatchProficiencyLevelsTextsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.BOTH, PatchProficiencyLevelsTextsTest.appUser);

    this.response = await PatchProficiencyLevelsTextsTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)/texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of text PATCH request to be 200 (OK).');

    this.response = await PatchProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be persisted in the text draft.');

    this.response = await PatchProficiencyLevelsTextsTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.data.name, patchBody.name, 'Expected name of patched text to be replicated.');
  }

  @test
  async 'PATCH the name of a non-existing inactive proficiency level text'() {
    await PatchProficiencyLevelsTextsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, PatchProficiencyLevelsTextsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await PatchProficiencyLevelsTextsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, PatchProficiencyLevelsTextsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const createdTextId = uuid();
    this.response = await PatchProficiencyLevelsTextsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/proficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=false)/texts(ID_texts=${createdTextId},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 201, 'Expected status code of proficiency level text creation to be 201 (CREATED).');
  }
}
