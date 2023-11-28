import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, SkillRepository, SkillText, SkillTextRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctSkill, correctSkillText, correctSkillTextInAnotherLanguage } from './data';

@suite
export class SkillLocalizationTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  static async before() {
    SkillLocalizationTest.serviceClient = await testEnvironment.getServiceClient();
    SkillLocalizationTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    SkillLocalizationTest.skillRepository = await testEnvironment.getSkillRepository();
    SkillLocalizationTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async before() {
    this.setCorrelationId(SkillLocalizationTest.serviceClient);
  }

  async after() {
    super.after();
    await SkillLocalizationTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'Expect the localization feature to return correct texts for an active skill'() {
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const skillTextInAnotherLanguage = { ...correctSkillTextInAnotherLanguage, ID: correctSkill.ID } as SkillText;

    await SkillLocalizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, SkillLocalizationTest.appUser);
    await SkillLocalizationTest.skillTextRepository.insertMany([skillText, skillTextInAnotherLanguage], EntityDraftMode.DRAFT_ONLY, SkillLocalizationTest.appUser);

    this.response = await SkillLocalizationTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');

    this.response = await SkillLocalizationTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`, { params: { 'sap-language': skillTextInAnotherLanguage.locale } });
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
    assert.equal(this.response.data.name, skillTextInAnotherLanguage.name, 'Expected correct skill name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctSkillTextInAnotherLanguage.locale}, ${correctSkillText.locale}`, 'Expected correct skill languages.');

    this.response = await SkillLocalizationTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`, { params: { 'sap-language': uuid().substring(0, 2) } });
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
    assert.equal(this.response.data.name, skillText.name, 'Expected correct skill name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctSkillTextInAnotherLanguage.locale}, ${correctSkillText.locale}`, 'Expected correct skill languages.');
  }

  @test
  async 'Expect the localization feature to always return fallback texts for an inactive skill'() {
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const skillTextInAnotherLanguage = { ...correctSkillTextInAnotherLanguage, ID: correctSkill.ID } as SkillText;

    await SkillLocalizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, SkillLocalizationTest.appUser);
    await SkillLocalizationTest.skillTextRepository.insertMany([skillText, skillTextInAnotherLanguage], EntityDraftMode.DRAFT_ONLY, SkillLocalizationTest.appUser);

    // Patch skill texts to trigger the Java event handlers
    this.response = await SkillLocalizationTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, {});
    assert.equal(this.response.status, 200, 'Expected status code of skill text patching to be 200 (OK).');

    this.response = await SkillLocalizationTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillTextInAnotherLanguage.ID_texts},IsActiveEntity=false)`, {});
    assert.equal(this.response.status, 200, 'Expected status code of skill text patching to be 200 (OK).');

    this.response = await SkillLocalizationTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`, { params: { 'sap-language': skillTextInAnotherLanguage.locale } });
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
    assert.equal(this.response.data.name, skillText.name, 'Expected correct skill name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctSkillTextInAnotherLanguage.locale}, ${correctSkillText.locale}`, 'Expected correct skill languages.');

    this.response = await SkillLocalizationTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`, { params: { 'sap-language': uuid().substring(0, 2) } });
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
    assert.equal(this.response.data.name, skillText.name, 'Expected correct skill name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctSkillTextInAnotherLanguage.locale}, ${correctSkillText.locale}`, 'Expected correct skill languages.');
  }

  @test
  async 'Expect swapping locales to be successful (ExternalCollaboration#767)'() {
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const skillTextInAnotherLanguage = { ...correctSkillTextInAnotherLanguage, ID: correctSkill.ID } as SkillText;

    await SkillLocalizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, SkillLocalizationTest.appUser);
    await SkillLocalizationTest.skillTextRepository.insertMany([skillText, skillTextInAnotherLanguage], EntityDraftMode.BOTH, SkillLocalizationTest.appUser);

    // Swap locales
    this.response = await SkillLocalizationTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, { locale: skillTextInAnotherLanguage.locale });
    assert.equal(this.response.status, 200, 'Expected status code of skill text patching to be 200 (OK).');

    this.response = await SkillLocalizationTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillTextInAnotherLanguage.ID_texts},IsActiveEntity=false)`, { locale: skillText.locale });
    assert.equal(this.response.status, 200, 'Expected status code of skill text patching to be 200 (OK).');

    // Activate
    this.response = await SkillLocalizationTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');
  }
}
