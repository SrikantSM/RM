import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, SkillRepository, SkillText, SkillTextRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctSkill, correctSkillText, correctSkillTextInAnotherLanguage, secondCorrectSkillText,
} from './data';

@suite
export class DeleteSkillsTextsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  static async before() {
    DeleteSkillsTextsTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteSkillsTextsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DeleteSkillsTextsTest.skillRepository = await testEnvironment.getSkillRepository();
    DeleteSkillsTextsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async before() {
    this.setCorrelationId(DeleteSkillsTextsTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteSkillsTextsTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'DELETE existing active skill text'() {
    await DeleteSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DeleteSkillsTextsTest.appUser);

    const skillText1 = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const skillText2 = { ...correctSkillTextInAnotherLanguage, ID: correctSkill.ID } as SkillText;
    await DeleteSkillsTextsTest.skillTextRepository.insertMany([skillText1, skillText2]);

    this.response = await DeleteSkillsTextsTest.serviceClient.delete(`/SkillService/Skills_texts(ID_texts=${skillText2.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 400, 'Expected status code of skill text deletion to be 400 (BAD REQUEST).');
  }

  @test
  async 'DELETE non-existing active skill text'() {
    const createdTextId = uuid();
    this.response = await DeleteSkillsTextsTest.serviceClient.delete(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=true)`);

    assert.equal(this.response.status, 400, 'Expected status code of skill text deletion to be 400 (BAD REQUEST).');
  }

  @test
  async 'DELETE existing inactive skill text'() {
    await DeleteSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DeleteSkillsTextsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    const skillText2 = { ...secondCorrectSkillText, name: uuid(), ID: correctSkill.ID } as SkillText;
    await DeleteSkillsTextsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, DeleteSkillsTextsTest.appUser);
    await DeleteSkillsTextsTest.skillTextRepository.insertOne(skillText2, EntityDraftMode.DRAFT_ONLY, DeleteSkillsTextsTest.appUser);

    this.response = await DeleteSkillsTextsTest.serviceClient.delete(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of skill text deletion to be 204 (OK).');

    this.response = await DeleteSkillsTextsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.data.name, skillText2.name, 'Expected name of non-deleted text to be replicated.');

    this.response = await DeleteSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of inactive skill text reading to be 404 (NOT FOUND).');

    this.response = await DeleteSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of active skill text reading to be 200 (OK).');
  }

  @test
  async 'DELETE non-existing inactive skill text'() {
    const createdTextId = uuid();
    this.response = await DeleteSkillsTextsTest.serviceClient.delete(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 404, 'Expected status code of alternative label deletion to be 404 (NOT FOUND).');
  }
}
