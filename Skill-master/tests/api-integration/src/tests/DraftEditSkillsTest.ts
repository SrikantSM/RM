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
export class DraftEditSkillsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  static async before() {
    DraftEditSkillsTest.serviceClient = await testEnvironment.getServiceClient();
    DraftEditSkillsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DraftEditSkillsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
    DraftEditSkillsTest.skillRepository = await testEnvironment.getSkillRepository();
  }

  async before() {
    this.setCorrelationId(DraftEditSkillsTest.serviceClient);
  }

  async after() {
    super.after();
    await DraftEditSkillsTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'POST to Skills/SkillService.draftEdit on an existing active skill'() {
    await DraftEditSkillsTest.skillRepository.insertOne(correctSkill);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    DraftEditSkillsTest.skillTextRepository.insertOne(skillText);

    this.response = await DraftEditSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.draftEdit`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft edit request to be 200 (OK).');

    this.response = await DraftEditSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'POST to Skills/SkillService.draftEdit on an existing inactive skill'() {
    await DraftEditSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DraftEditSkillsTest.appUser);

    this.response = await DraftEditSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftEdit`, {});

    assert.equal(this.response.status, 400, 'Expected status code of draft edit request to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Skills/SkillService.draftEdit on an non-existing skill'() {
    this.response = await DraftEditSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${uuid()},IsActiveEntity=true)/SkillService.draftEdit`, {});

    assert.equal(this.response.status, 404, 'Expected status code of draft edit request to be 404 (NOT FOUND).');
  }
}
