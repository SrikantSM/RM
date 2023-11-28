import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { v4 as uuid } from 'uuid';
import {
  EntityDraftMode, ProficiencySetRepository, ProficiencyLevelRepository, ProficiencyLevelTextRepository, ProficiencySet, ProficiencyLevel, ProficiencyLevelText,
} from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencySet, secondCorrectProficiencySet, evilCsvProficiencySetName, evilProficiencyLevelName, evilProficiencyLevelDescription, evilProficiencySetName, evilProficiencySetDescription, correctProficiencyLevel, secondCorrectProficiencyLevel, correctProficiencyLevelText, secondCorrectProficiencyLevelText, correctProficiencyLevelTextInAnotherLanguage, proficiencySetWithNullDescription, proficiencySetWithNullName, proficiencySetWithEmptyDescription, proficiencySetWithEmptyName, proficiencyLevelTextWithNullName, proficiencyLevelTextWithNullDescription, proficiencyLevelTextWithEmptyName, proficiencyLevelTextWithEmptyDescription, proficiencyLevelWithInvalidRank,
} from './data';

@suite
export class DraftActivateProficiencySetsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  static async before() {
    DraftActivateProficiencySetsTest.serviceClient = await testEnvironment.getServiceClient();
    DraftActivateProficiencySetsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DraftActivateProficiencySetsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    DraftActivateProficiencySetsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    DraftActivateProficiencySetsTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async before() {
    this.setCorrelationId(DraftActivateProficiencySetsTest.serviceClient);
  }

  async after() {
    super.after();
    await DraftActivateProficiencySetsTest.proficiencySetRepository.deleteMany([correctProficiencySet, secondCorrectProficiencySet, proficiencySetWithNullDescription, proficiencySetWithNullName, proficiencySetWithEmptyDescription, proficiencySetWithEmptyName, evilProficiencySetName, evilCsvProficiencySetName, evilProficiencySetDescription]);
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a proficiency level'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing active proficiency set'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request of an active proficiency set to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on a non-existing proficiency set'() {
    const createdProficiencySetId = uuid();

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${createdProficiencySetId},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});

    assert.equal(this.response.status, 404, 'Expected status code of draft activate request of a non-existing proficiency set to be 404 (NOT FOUND).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a null description'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(proficiencySetWithNullDescription, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: proficiencySetWithNullDescription.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithNullDescription.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithNullDescription.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a null name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(proficiencySetWithNullName, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: proficiencySetWithNullName.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithNullName.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithNullName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with an empty description'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(proficiencySetWithEmptyDescription, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: proficiencySetWithEmptyDescription.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithEmptyDescription.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithEmptyDescription.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with an empty name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(proficiencySetWithEmptyName, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: proficiencySetWithEmptyName.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithEmptyName.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${proficiencySetWithEmptyName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a null proficiency level name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...proficiencyLevelTextWithNullName, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a null proficiency level description'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...proficiencyLevelTextWithNullDescription, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with an empty proficiency level name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...proficiencyLevelTextWithEmptyName, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with an empty proficiency level description'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...proficiencyLevelTextWithEmptyDescription, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a duplicated name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, DraftActivateProficiencySetsTest.appUser);
    const secondProficiencySet = { ...secondCorrectProficiencySet, name: correctProficiencySet.name } as ProficiencySet;
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: secondCorrectProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(secondProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${secondProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${secondProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with no proficiency level texts at all'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with no proficiency levels at all'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set without a proficiency level text for the default language'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelTextInAnotherLanguage, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with multiple proficiency level text for a language'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const secondProficiencyLevelText = { ...secondCorrectProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(secondProficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with multiple proficiency levels with the same name in the same language'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const secondProficiencyLevel = { ...secondCorrectProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const secondProficiencyLevelText = { ...secondCorrectProficiencyLevelText, ID: secondCorrectProficiencyLevel.ID, name: correctProficiencyLevelText.name } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(secondProficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(secondProficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate on an existing inactive proficiency set with a proficiency level without a rank'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...proficiencyLevelWithInvalidRank, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: proficiencyLevelWithInvalidRank.ID } as ProficiencyLevelText;
    const secondProficiencyLevelText = { ...secondCorrectProficiencyLevelText, ID: proficiencyLevelWithInvalidRank.ID } as ProficiencyLevelText;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(secondProficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftActivate with an evil script tag in set name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(evilProficiencySetName, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${evilProficiencySetName.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});

    assert.equal(this.response.status, 400, 'Expected status code of text creation to be 400 (BAD_REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${evilProficiencySetName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftActivate with an evil script tag in set description'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(evilProficiencySetDescription, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${evilProficiencySetDescription.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});

    assert.equal(this.response.status, 400, 'Expected status code of text creation to be 400 (BAD_REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${evilProficiencySetDescription.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftActivate with an evil script tag in level name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...evilProficiencyLevelName, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});

    assert.equal(this.response.status, 400, 'Expected status code of text creation to be 400 (BAD_REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftActivate with an evil script tag in level description'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    const proficiencyLevel = { ...evilProficiencyLevelDescription, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});

    assert.equal(this.response.status, 400, 'Expected status code of text creation to be 400 (BAD_REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftActivate with a forbidden first character in set name'() {
    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(evilCsvProficiencySetName, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${evilCsvProficiencySetName.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});

    assert.equal(this.response.status, 400, 'Expected status code of text creation to be 400 (BAD_REQUEST).');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${evilCsvProficiencySetName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'Post to ProficiencySets/ProficiencyService.draftActivate with more proficiency levels than the maximum count'() {
    const MAX_LEVEL_COUNT = 50;

    await DraftActivateProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    for (let rank = 1; rank <= MAX_LEVEL_COUNT + 1; rank += 1) {
      const proficiencyLevel = {
        ...correctProficiencyLevel,
        ID: uuid(),
        proficiencySet_ID: correctProficiencySet.ID,
        name: correctProficiencyLevel.name + rank,
        rank,
      } as ProficiencyLevel;
      await DraftActivateProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);

      const proficiencyLevelText = {
        ...correctProficiencyLevelText,
        ID_texts: uuid(),
        ID: proficiencyLevel.ID,
        name: correctProficiencyLevel.name + rank,
      } as ProficiencyLevelText;
      await DraftActivateProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.DRAFT_ONLY, DraftActivateProficiencySetsTest.appUser);
    }

    this.response = await DraftActivateProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request of an active proficiency set to be 400 (BAD REQUEST).');
    assert.include(this.response.data.error.message, 'maximum', 'Gives correct error message');

    this.response = await DraftActivateProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 404, 'Expected status code of proficiency set reading to be 404 (NOT FOUND).');
  }
}
