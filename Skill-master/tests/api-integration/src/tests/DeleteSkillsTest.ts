import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, SkillRepository, SkillText, SkillTextRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctSkill, correctSkillText } from './data';

@suite
export class DeleteSkillsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  static async before() {
    DeleteSkillsTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteSkillsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DeleteSkillsTest.skillRepository = await testEnvironment.getSkillRepository();
    DeleteSkillsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async before() {
    this.setCorrelationId(DeleteSkillsTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteSkillsTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'DELETE existing active skill'() {
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await DeleteSkillsTest.skillRepository.insertOne(correctSkill);
    await DeleteSkillsTest.skillTextRepository.insertOne(skillText);

    this.response = await DeleteSkillsTest.serviceClient.delete(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 405, 'Expected status code of skill deletion to be 405 (METHOD NOT ALLOWED).');

    this.response = await DeleteSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');

    this.response = await DeleteSkillsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
  }

  @test
  async 'DELETE existing inactive skill'() {
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await DeleteSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DeleteSkillsTest.appUser);
    await DeleteSkillsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, DeleteSkillsTest.appUser);

    this.response = await DeleteSkillsTest.serviceClient.delete(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of skill deletion to be 204 (NO CONTENT).');

    this.response = await DeleteSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected inactive skill to be deleted, i.e. that the status code of the inactive skill reading to be 404 (NOT FOUND).');

    this.response = await DeleteSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active skill to not be deleted, i.e. that the status code of the active skill reading to be 200 (OK).');

    this.response = await DeleteSkillsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected active label to not be deleted, i.e. that the status code of the active skill text reading to be 200 (OK).');

    this.response = await DeleteSkillsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of skill text reading to be 404 (NOT FOUND).');
  }

  @test
  async 'DELETE non-existing active skill'() {
    this.response = await DeleteSkillsTest.serviceClient.delete(`/SkillService/Skills(ID=${uuid()},IsActiveEntity=true)`);

    assert.equal(this.response.status, 405, 'Expected status code to be 405 (METHOD NOT ALLOWED).');
  }

  @test
  async 'DELETE non-existing inactive skill'() {
    this.response = await DeleteSkillsTest.serviceClient.delete(`/SkillService/Skills(ID=${uuid()},IsActiveEntity=false)`);

    assert.equal(this.response.status, 404, 'Expected status code to be 404 (NOT FOUND).');
  }
}
