import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Skill, SkillRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctCreateSkillWithDialogParameters, createSkillWithDialogParametersWithNullDescription, createSkillWithDialogParametersWithNullSkillText, createSkillWithDialogParametersInjection,
} from './data';

@suite
export class CreateSkillWithDialogTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static skillRepository: SkillRepository;

  private static createdSkills: Skill[] = [];

  static async before() {
    CreateSkillWithDialogTest.serviceClient = await testEnvironment.getServiceClient();
    CreateSkillWithDialogTest.skillRepository = await testEnvironment.getSkillRepository();
  }

  async before() {
    this.setCorrelationId(CreateSkillWithDialogTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateSkillWithDialogTest.skillRepository.deleteMany(CreateSkillWithDialogTest.createdSkills);
  }

  @test
  async 'POST to Skills/SkillService.createSkillWithDialog with correct data, generate externalID'() {
    this.response = await CreateSkillWithDialogTest.serviceClient.post('/SkillService/Skills/SkillService.createSkillWithDialog', correctCreateSkillWithDialogParameters);
    CreateSkillWithDialogTest.createdSkills.push({ ID: this.response.data.ID } as Skill);
    assert.equal(this.response.status, 200, 'Expected status code of skill creation to be 200 (OK).');

    this.response = await CreateSkillWithDialogTest.serviceClient.get(`/SkillService/Skills(ID=${this.response.data.ID},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
    assert.isNotEmpty(this.response.data.externalID);
    assert.isTrue(this.response.data.externalID.startsWith('sap-rm://skill/'));
    assert.equal(this.response.data.proficiencySet_ID, null, 'Expected proficiency set to be empty.');
  }

  @test
  async 'POST to Skills/SkillService.createSkillWithDialog with an evil name'() {
    this.response = await CreateSkillWithDialogTest.serviceClient.post('/SkillService/Skills/SkillService.createSkillWithDialog', createSkillWithDialogParametersInjection);
    CreateSkillWithDialogTest.createdSkills.push({ ID: this.response.data.ID } as Skill);
    assert.equal(this.response.status, 200, 'Expected status code of skill creation to be 200 (OK).');
  }

  @test
  async 'POST to Skills/SkillService.createSkillWithDialog with a null name'() {
    this.response = await CreateSkillWithDialogTest.serviceClient.post('/SkillService/Skills/SkillService.createSkillWithDialog', createSkillWithDialogParametersWithNullSkillText);
    assert.equal(this.response.status, 400, 'Expected status code of skill creation to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Skills/SkillService.createSkillWithDialog with a null description'() {
    this.response = await CreateSkillWithDialogTest.serviceClient.post('/SkillService/Skills/SkillService.createSkillWithDialog', createSkillWithDialogParametersWithNullDescription);
    assert.equal(this.response.status, 400, 'Expected status code of skill creation to be 400 (BAD REQUEST).');
  }
}
