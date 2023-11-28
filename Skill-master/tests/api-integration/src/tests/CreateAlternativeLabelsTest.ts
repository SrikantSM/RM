import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { EntityDraftMode, SkillRepository } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctAlternativeLabel, evilAlternativeLabel, forbiddenFirstCharacterAlternativeLabel, correctSkill,
} from './data';

@suite
export class CreateAlternativeLabelsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  static async before() {
    CreateAlternativeLabelsTest.serviceClient = await testEnvironment.getServiceClient();
    CreateAlternativeLabelsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    CreateAlternativeLabelsTest.skillRepository = await testEnvironment.getSkillRepository();
  }

  async before() {
    this.setCorrelationId(CreateAlternativeLabelsTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateAlternativeLabelsTest.skillRepository.deleteOne(correctSkill);
    await CreateAlternativeLabelsTest.skillRepository.alternativeLabelRepository.deleteOne(correctAlternativeLabel);
  }

  @test
  async 'POST to Skill/alternativeLabels with correct data'() {
    await CreateAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateAlternativeLabelsTest.appUser);

    this.response = await CreateAlternativeLabelsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/alternativeLabels`, correctAlternativeLabel);

    assert.equal(this.response.status, 201, 'Expected status code of label creation to be 201 (CREATED).');

    const createdLabelId = this.response.data.ID;
    this.response = await CreateAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
  }

  @test
  async 'POST to Skills/alternativeLabels with non-existing parent skill'() {
    const createdSkillId = uuid();

    this.response = await CreateAlternativeLabelsTest.serviceClient.post(`/SkillService/Skills(ID=${createdSkillId},IsActiveEntity=false)/alternativeLabels`, correctAlternativeLabel);

    assert.equal(this.response.status, 409, 'Expected status code of label creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST to Skill/alternativeLabels active parent skill'() {
    await CreateAlternativeLabelsTest.skillRepository.insertOne(correctSkill);

    this.response = await CreateAlternativeLabelsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/alternativeLabels`, correctAlternativeLabel);

    assert.equal(this.response.status, 409, 'Expected status code of label creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST to Skill/alternativeLabels with evil script tag'() {
    await CreateAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateAlternativeLabelsTest.appUser);

    this.response = await CreateAlternativeLabelsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/alternativeLabels`, evilAlternativeLabel);

    assert.equal(this.response.status, 201, 'Expected status code of label creation with evil script tag to be 201 (CREATED).');

    const createdLabelId = evilAlternativeLabel.ID;
    this.response = await CreateAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
  }

  @test
  async 'POST to Skill/alternativeLabels with forbidden first character'() {
    await CreateAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateAlternativeLabelsTest.appUser);

    this.response = await CreateAlternativeLabelsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/alternativeLabels`, forbiddenFirstCharacterAlternativeLabel);

    assert.equal(this.response.status, 201, 'Expected status code of label creation with evil script tag to be 201 (CREATED).');

    const createdLabelId = forbiddenFirstCharacterAlternativeLabel.ID;
    this.response = await CreateAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
  }
}
