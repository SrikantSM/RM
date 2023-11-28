import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  AlternativeLabel, AlternativeLabelRepository, EntityDraftMode, SkillRepository, SkillText, SkillTextRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  alternativeLabelWithEmptyLanguageCode,
  alternativeLabelWithNullLanguageCode,
  alternativeLabelWithNullName,
  correctAlternativeLabel,
  correctDefaultLanguage,
  correctNonDefaultLanguage,
  skillWithoutExternalID,
  correctSkill,
  correctSkillText,
  correctSkillTextInAnotherLanguage,
  secondCorrectSkillText,
  skillTextWithEmptyDescription,
  skillTextWithEmptyName,
  skillTextWithNonExistingLanguage,
  skillTextWithNullDescription,
  skillTextWithNullLanguage,
  skillTextWithNullName,
  skillWithExistingExternalID,
  skillWithoutProficiencySet,
  skillWithNonExistingProficiencySet,
  evilSkillTextName, evilSkillTextDescription,
} from './data';

@suite
export class DraftActivateSkillsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  private static alternativeLabelRepository: AlternativeLabelRepository;

  static async before() {
    DraftActivateSkillsTest.serviceClient = await testEnvironment.getServiceClient();
    DraftActivateSkillsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DraftActivateSkillsTest.skillRepository = await testEnvironment.getSkillRepository();
    DraftActivateSkillsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
    DraftActivateSkillsTest.alternativeLabelRepository = await testEnvironment.getAlternativeLabelRepository();
  }

  async before() {
    this.setCorrelationId(DraftActivateSkillsTest.serviceClient);
  }

  async after() {
    super.after();
    await DraftActivateSkillsTest.skillRepository.deleteMany([correctSkill, skillWithExistingExternalID, skillWithoutExternalID, skillWithNonExistingProficiencySet, skillWithoutProficiencySet]);
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an alternative label'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing active skill'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request of a active skill to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on a non-existing skill'() {
    const createdSkillId = uuid();

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${createdSkillId},IsActiveEntity=false)/SkillService.draftActivate`, {});

    assert.equal(this.response.status, 404, 'Expected status code of draft activate request of a non-existing skill to be 404 (NOT FOUND).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an existing externalID'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill);
    await DraftActivateSkillsTest.skillRepository.insertOne(skillWithExistingExternalID, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...correctSkillText, ID: skillWithExistingExternalID.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${skillWithExistingExternalID.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${skillWithExistingExternalID.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with a null description'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...skillTextWithNullDescription, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an empty description'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...skillTextWithEmptyDescription, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an script in name field'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...evilSkillTextName, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of skill reading to be 400 (BAD REQUEST).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an script in description field'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...evilSkillTextDescription, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of skill reading to be 400 (BAD REQUEST).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with a non-existing language'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DraftActivateSkillsTest.appUser);
    const skillTextNonExistingLocal = { ...skillTextWithNonExistingLanguage, ID: correctSkill.ID } as SkillText;
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillTextNonExistingLocal, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with a null language'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...skillTextWithNullLanguage, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with a null name'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...skillTextWithNullName, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an empty name'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    const skillText = { ...skillTextWithEmptyName, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an alternative label with a null language code'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const alternativeLabel = { ...alternativeLabelWithNullLanguageCode, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an alternative label with an empty language code'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const alternativeLabel = { ...alternativeLabelWithEmptyLanguageCode, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an alternative label with a null name'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const alternativeLabel = { ...alternativeLabelWithNullName, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with an alternative label with an empty name'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const alternativeLabel = { ...alternativeLabelWithNullLanguageCode, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with two names in the same language for a skill'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const secondSkillText = { ...secondCorrectSkillText, name: correctSkillText.name, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertMany([skillText, secondSkillText], EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with no skill text at all'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill without a skill text for the default language'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillTextInAnotherLanguage, ID: correctSkill.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with no skill text for a language where other labels exist'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID, language_code: correctDefaultLanguage.code } as AlternativeLabel;
    const skillText = { ...correctSkillText, ID: correctSkill.ID, locale: correctNonDefaultLanguage.code } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);
    await DraftActivateSkillsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with multiple skill texts for a language'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillTextEn = { ...correctSkillText, ID: correctSkill.ID, language_code: correctDefaultLanguage.code } as SkillText;
    const skillText = { ...secondCorrectSkillText, ID: correctSkill.ID, language_code: correctDefaultLanguage.code } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertMany([skillTextEn, skillText], EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill without an external ID'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(skillWithoutExternalID, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: skillWithoutExternalID.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${skillWithoutExternalID.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD_REQUEST).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill without assigned proficiency set'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(skillWithoutProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: skillWithoutProficiencySet.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${skillWithoutProficiencySet.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD_REQUEST).');
  }

  @test
  async 'Post to Skills/SkillService.draftActivate on an existing inactive skill with non-existing proficiency set'() {
    await DraftActivateSkillsTest.skillRepository.insertOne(skillWithNonExistingProficiencySet, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    const skillText = { ...correctSkillText, ID: skillWithNonExistingProficiencySet.ID } as SkillText;
    await DraftActivateSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, DraftActivateSkillsTest.appUser);

    this.response = await DraftActivateSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${skillWithNonExistingProficiencySet.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD_REQUEST).');
  }
}
