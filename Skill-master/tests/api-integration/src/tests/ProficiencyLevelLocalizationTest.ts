import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencyLevel, ProficiencyLevelRepository, ProficiencyLevelText, ProficiencyLevelTextRepository, ProficiencySetRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencyLevel, correctProficiencyLevelText, correctProficiencyLevelTextInAnotherLanguage, correctProficiencySet,
} from './data';

@suite
export class ProficiencyLevelLocalizationTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  static async before() {
    ProficiencyLevelLocalizationTest.serviceClient = await testEnvironment.getServiceClient();
    ProficiencyLevelLocalizationTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    ProficiencyLevelLocalizationTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    ProficiencyLevelLocalizationTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    ProficiencyLevelLocalizationTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async before() {
    this.setCorrelationId(ProficiencyLevelLocalizationTest.serviceClient);
  }

  async after() {
    super.after();
    await ProficiencyLevelLocalizationTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'Expect the localization feature to return correct texts for an active proficiency level'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const proficiencyLevelTextInAnotherLanguage = { ...correctProficiencyLevelTextInAnotherLanguage, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await ProficiencyLevelLocalizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, ProficiencyLevelLocalizationTest.appUser);
    await ProficiencyLevelLocalizationTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, ProficiencyLevelLocalizationTest.appUser);
    await ProficiencyLevelLocalizationTest.proficiencyLevelTextRepository.insertMany([proficiencyLevelText, proficiencyLevelTextInAnotherLanguage], EntityDraftMode.DRAFT_ONLY, ProficiencyLevelLocalizationTest.appUser);

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${correctProficiencyLevel.ID},IsActiveEntity=true)`, { params: { 'sap-language': proficiencyLevelTextInAnotherLanguage.locale } });
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level reading to be 200 (OK).');
    assert.equal(this.response.data.name, proficiencyLevelTextInAnotherLanguage.name, 'Expected correct proficiency level name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctProficiencyLevelTextInAnotherLanguage.locale}, ${correctProficiencyLevelText.locale}`, 'Expected correct proficiency level languages.');

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${correctProficiencyLevel.ID},IsActiveEntity=true)`, { params: { 'sap-language': uuid().substring(0, 2) } });
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level reading to be 200 (OK).');
    assert.equal(this.response.data.name, proficiencyLevelText.name, 'Expected correct proficiency level name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctProficiencyLevelTextInAnotherLanguage.locale}, ${correctProficiencyLevelText.locale}`, 'Expected correct proficiency level languages.');
  }

  @test
  async 'Expect the localization feature to always return fallback texts for an inactive proficiency level'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const proficiencyLevelTextInAnotherLanguage = { ...correctProficiencyLevelTextInAnotherLanguage, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await ProficiencyLevelLocalizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, ProficiencyLevelLocalizationTest.appUser);
    await ProficiencyLevelLocalizationTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.DRAFT_ONLY, ProficiencyLevelLocalizationTest.appUser);
    await ProficiencyLevelLocalizationTest.proficiencyLevelTextRepository.insertMany([proficiencyLevelText, proficiencyLevelTextInAnotherLanguage], EntityDraftMode.DRAFT_ONLY, ProficiencyLevelLocalizationTest.appUser);

    // Patch proficiency level texts to trigger the Java event handlers
    this.response = await ProficiencyLevelLocalizationTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`, {});
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level text patching to be 200 (OK).');

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelTextInAnotherLanguage.ID_texts},IsActiveEntity=false)`, {});
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level text patching to be 200 (OK).');

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${correctProficiencyLevel.ID},IsActiveEntity=false)`, { params: { 'sap-language': proficiencyLevelTextInAnotherLanguage.locale } });
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level reading to be 200 (OK).');
    assert.equal(this.response.data.name, proficiencyLevelText.name, 'Expected correct proficiency level name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctProficiencyLevelTextInAnotherLanguage.locale}, ${correctProficiencyLevelText.locale}`, 'Expected correct proficiency level languages.');

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.get(`/ProficiencyService/ProficiencyLevels(ID=${correctProficiencyLevel.ID},IsActiveEntity=false)`, { params: { 'sap-language': uuid().substring(0, 2) } });
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level reading to be 200 (OK).');
    assert.equal(this.response.data.name, proficiencyLevelText.name, 'Expected correct proficiency level name.');
    assert.equal(this.response.data.commaSeparatedLanguages, `${correctProficiencyLevelTextInAnotherLanguage.locale}, ${correctProficiencyLevelText.locale}`, 'Expected correct proficiency level languages.');
  }

  @test
  async 'Expect swapping locales to be successful (ExternalCollaboration#767)'() {
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    const proficiencyLevelTextInAnotherLanguage = { ...correctProficiencyLevelTextInAnotherLanguage, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;

    await ProficiencyLevelLocalizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, ProficiencyLevelLocalizationTest.appUser);
    await ProficiencyLevelLocalizationTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, ProficiencyLevelLocalizationTest.appUser);
    await ProficiencyLevelLocalizationTest.proficiencyLevelTextRepository.insertMany([proficiencyLevelText, proficiencyLevelTextInAnotherLanguage], EntityDraftMode.BOTH, ProficiencyLevelLocalizationTest.appUser);

    // Swap locales
    this.response = await ProficiencyLevelLocalizationTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelText.ID_texts},IsActiveEntity=false)`, { locale: proficiencyLevelTextInAnotherLanguage.locale });
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level text patching to be 200 (OK).');

    this.response = await ProficiencyLevelLocalizationTest.serviceClient.patch(`/ProficiencyService/ProficiencyLevels_texts(ID_texts=${proficiencyLevelTextInAnotherLanguage.ID_texts},IsActiveEntity=false)`, { locale: proficiencyLevelText.locale });
    assert.equal(this.response.status, 200, 'Expected status code of proficiency level text patching to be 200 (OK).');

    // Activate
    this.response = await ProficiencyLevelLocalizationTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');
  }
}
