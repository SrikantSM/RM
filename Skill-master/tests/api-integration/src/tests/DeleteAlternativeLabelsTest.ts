import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  AlternativeLabel, AlternativeLabelRepository, EntityDraftMode, SkillRepository, SkillTextRepository, SkillText,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctAlternativeLabel, secondCorrectAlternativeLabel, correctSkill, correctSkillText,
} from './data';

@suite
export class DeleteAlternativeLabelsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  private static alternativeLabelRepository: AlternativeLabelRepository;

  static async before() {
    DeleteAlternativeLabelsTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteAlternativeLabelsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DeleteAlternativeLabelsTest.skillRepository = await testEnvironment.getSkillRepository();
    DeleteAlternativeLabelsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
    DeleteAlternativeLabelsTest.alternativeLabelRepository = await testEnvironment.getAlternativeLabelRepository();
  }

  async before() {
    this.setCorrelationId(DeleteAlternativeLabelsTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteAlternativeLabelsTest.skillRepository.deleteOne(correctSkill);
    await DeleteAlternativeLabelsTest.alternativeLabelRepository.deleteOne(correctAlternativeLabel);
  }

  @test
  async 'DELETE existing active alternative label'() {
    await DeleteAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DeleteAlternativeLabelsTest.appUser);

    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DeleteAlternativeLabelsTest.alternativeLabelRepository.insertOne(alternativeLabel);

    this.response = await DeleteAlternativeLabelsTest.serviceClient.delete(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 400, 'Expected status code of alternative label deletion to be 400 (BAD REQUEST).');
  }

  @test
  async 'DELETE non-existing active alternative label'() {
    const createdLabelId = uuid();
    this.response = await DeleteAlternativeLabelsTest.serviceClient.delete(`/SkillService/AlternativeLabels(ID=${createdLabelId},IsActiveEntity=true)`);
    assert.equal(this.response.status, 400, 'Expected status code of alternative label deletion to be 400 (BAD REQUEST).');
  }

  @test
  async 'DELETE existing inactive alternative label'() {
    await DeleteAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, DeleteAlternativeLabelsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await DeleteAlternativeLabelsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, DeleteAlternativeLabelsTest.appUser);

    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    const alternativeLabel2 = { ...secondCorrectAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    await DeleteAlternativeLabelsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.BOTH, DeleteAlternativeLabelsTest.appUser);
    await DeleteAlternativeLabelsTest.alternativeLabelRepository.insertOne(alternativeLabel2, EntityDraftMode.DRAFT_ONLY, DeleteAlternativeLabelsTest.appUser);

    this.response = await DeleteAlternativeLabelsTest.serviceClient.delete(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of alternative label deletion to be 204 (OK).');

    this.response = await DeleteAlternativeLabelsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.data.commaSeparatedAlternativeLabels, alternativeLabel2.name, 'Expected alternative label of non-deleted text to be replicated.');

    this.response = await DeleteAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of inactive alternative label reading to be 404 (NOT FOUND).');

    this.response = await DeleteAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of active alternative label reading to be 200 (OK).');
  }

  @test
  async 'DELETE non-existing inactive alternative label'() {
    const createdLabelId = uuid();
    this.response = await DeleteAlternativeLabelsTest.serviceClient.delete(`/SkillService/AlternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 404, 'Expected status code of alternative label deletion to be 404 (NOT FOUND).');
  }
}
