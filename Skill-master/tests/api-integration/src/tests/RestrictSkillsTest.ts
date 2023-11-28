import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { EntityDraftMode, SkillRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctSkill, mdiSkill } from './data';

@suite
export class RestrictSkillsTest extends BaseApiTest {
  private static skillRepository: SkillRepository;

  private static appUser: string;

  private static serviceClient: AxiosInstance;

  static skillTextRepository: any;

  static async before() {
    RestrictSkillsTest.serviceClient = await testEnvironment.getServiceClient();
    RestrictSkillsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    RestrictSkillsTest.skillRepository = await testEnvironment.getSkillRepository();
    RestrictSkillsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async before() {
    this.setCorrelationId(RestrictSkillsTest.serviceClient);
  }

  async after() {
    super.after();
    await RestrictSkillsTest.skillRepository.deleteOne(correctSkill);
    await RestrictSkillsTest.skillRepository.deleteOne(mdiSkill);
  }

  @test
  async 'Restrict existing skill (POST /Skills(..)/SkillService.restrict'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...correctSkill, lifecycleStatus_code: 0 });

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.restrict`, {});
    assert.equal(this.response.status, 200, 'Expect status code of restriction action to be 200 (OK)');
    assert.equal(this.response.data.lifecycleStatus_code, 1, 'Skill lifecycle status should be restricted (1)');
  }

  @test
  async 'Restrict skill replicated from MDI (POST /Skills(..)/SkillService.restrict'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...mdiSkill, lifecycleStatus_code: 0 });

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)/SkillService.restrict`, {});
    assert.equal(this.response.status, 409, 'Expected status code of restriction action to be 409.');
  }

  @test
  async 'Restrict already restricted skill (POST /Skills(..)/SkillService.restrict'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...correctSkill, lifecycleStatus_code: 1 });

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.restrict`, {});
    assert.equal(this.response.status, 409, 'Expect status code of restriction action to be 409 as skill is already restricted');
  }

  @test
  async 'Restrict draft skill (POST /Skills(..)/SkillService.restrict)'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...correctSkill, lifecycleStatus_code: 0 }, EntityDraftMode.DRAFT_ONLY, RestrictSkillsTest.appUser);

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.restrict`, {});
    assert.equal(this.response.status, 409, 'Expect status code of restriction action to be 409 as skill has active draft');
  }

  @test
  async 'Unrestrict restricted skill (POST /Skills(..)/SkillService.removeRestriction'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...correctSkill, lifecycleStatus_code: 1 });

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.removeRestriction`, {});
    assert.equal(this.response.status, 200, 'Expect status code of unrestriction action to be 200 (OK)');
    assert.equal(this.response.data.lifecycleStatus_code, 0, 'Skill attribute lifecycle');
  }

  @test
  async 'Unrestrict restricted skill replicated from MDI (POST /Skills(..)/SkillService.removeRestriction'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...mdiSkill, lifecycleStatus_code: 1 });

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)/SkillService.removeRestriction`, {});
    assert.equal(this.response.status, 409, 'Expect status code of unrestriction action to be 409');
  }

  @test
  async 'Unrestrict already unrestricted skill (POST /Skills(..)/SkillService.removeRestriction'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...correctSkill, lifecycleStatus_code: 0 });

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.removeRestriction`, {});
    assert.equal(this.response.status, 409, 'Expect status code of unrestriction action to be 409 as skill is already unrestricted');
  }

  @test
  async 'Unrestrict draft skill (POST /Skills(..)/SkillService.removeRestriction)'() {
    await RestrictSkillsTest.skillRepository.insertOne({ ...correctSkill, lifecycleStatus_code: 0 }, EntityDraftMode.DRAFT_ONLY, RestrictSkillsTest.appUser);

    this.response = await RestrictSkillsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.removeRestriction`, {});
    assert.equal(this.response.status, 409, 'Expect status code of unrestriction action to be 400 as skill has active draft');
  }
}
