import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencySetRepository, Skill, SkillRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctProficiencySet, correctSkill, mdiProficiencySet, mdiSkill,
} from './data';

@suite
export class PatchSkillsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static createdSkills: Skill[] = [];

  static async before() {
    PatchSkillsTest.serviceClient = await testEnvironment.getServiceClient();
    PatchSkillsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    PatchSkillsTest.skillRepository = await testEnvironment.getSkillRepository();
    PatchSkillsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(PatchSkillsTest.serviceClient);
  }

  async after() {
    super.after();
    await PatchSkillsTest.skillRepository.deleteMany([correctSkill, mdiSkill, ...PatchSkillsTest.createdSkills]);
    await PatchSkillsTest.proficiencySetRepository.deleteMany([correctProficiencySet, mdiProficiencySet]);
  }

  @test
  async 'PATCH the description of an existing inactive skill'() {
    await PatchSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTest.appUser);

    const patchBody = {
      description: uuid(),
    };

    this.response = await PatchSkillsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of skill PATCH request to be 200 (OK).');

    this.response = await PatchSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
    assert.equal(this.response.data.description, patchBody.description, 'Expected new description to be persisted in the skill draft.');
    assert.equal(this.response.data.externalID, correctSkill.externalID, 'Expected external ID to be persisted.');
  }

  @test
  async 'PATCH a non-existing inactive skill'() {
    this.response = await PatchSkillsTest.serviceClient.patch(`/SkillService/Skills(ID=${uuid()},IsActiveEntity=false)`, {});
    assert.equal(this.response.status, 201, 'Expected status code of skill PATCH request to be 201 (CREATED).');
    PatchSkillsTest.createdSkills.push({ ID: this.response.data.ID } as Skill);

    this.response = await PatchSkillsTest.serviceClient.get(`/SkillService/Skills(ID=${this.response.data.ID},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
  }

  @test
  async 'PATCH a existing skill without the full entities are passed'() {
    await PatchSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);

    const patchBodyForDeepUpdate = {
      alternativeLabels: [{
        ID: uuid(),
        language_code: 'en',
        name: uuid(),
      }],
    };

    this.response = await PatchSkillsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`, patchBodyForDeepUpdate);
    assert.equal(this.response.status, 400, 'Expected status code of skill PATCH request to be 400 (BAD REQUEST).');
  }

  @test
  async 'PATCH a existing skill with alternative labels via deep update and provide unallowed values'() {
    await PatchSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);
    await PatchSkillsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);

    const patchBodyForDeepUpdate = {
      OID: null,
      externalID: 'not evil to also check subentity validations',
      description: uuid(),
      proficiencySet_ID: correctProficiencySet.ID,
      texts: [{
        name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
        locale: 'en',
      }],
      alternativeLabels: [{
        ID: uuid(),
        language_code: 'en',
        name: uuid(),
      }],
    };
    this.response = await PatchSkillsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`, patchBodyForDeepUpdate);
    assert.equal(this.response.status, 400, 'Expected status code of skill PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');
  }

  @test
  async 'PATCH a existing skill replicated from MDI'() {
    await PatchSkillsTest.skillRepository.insertOne(mdiSkill, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);
    await PatchSkillsTest.proficiencySetRepository.insertOne(mdiProficiencySet, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);

    const patchBodyForDeepUpdate = {
      OID: uuid(),
      externalID: 'EXT-ID',
      description: uuid(),
      proficiencySet_ID: mdiProficiencySet.ID,
      texts: [{
        name: 'test',
        locale: 'en',
      }],
      alternativeLabels: [{
        ID: uuid(),
        language_code: 'en',
        name: uuid(),
      }],
    };
    this.response = await PatchSkillsTest.serviceClient.patch(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)`, patchBodyForDeepUpdate);
    assert.equal(this.response.status, 400, 'Expected status code of skill PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');
  }

  @test
  async 'PATCH a existing skill with alternative labels via deep update and provide values with forbidden first characters'() {
    await PatchSkillsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);
    await PatchSkillsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, PatchSkillsTest.appUser);

    const patchBodyForDeepUpdate = {
      OID: null,
      externalID: '@externalID',
      description: uuid(),
      proficiencySet_ID: correctProficiencySet.ID,
      texts: [{
        name: '@name',
        locale: 'en',
      }],
      alternativeLabels: [{
        ID: uuid(),
        language_code: 'en',
        name: uuid(),
      }],
    };
    this.response = await PatchSkillsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)`, patchBodyForDeepUpdate);
    assert.equal(this.response.status, 400, 'Expected status code of skill PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');
  }
}
