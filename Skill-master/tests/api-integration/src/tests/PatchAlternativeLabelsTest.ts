import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  AlternativeLabel, AlternativeLabelRepository, EntityDraftMode, SkillRepository, SkillTextRepository, SkillText,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctAlternativeLabel, correctSkill, correctSkillText } from './data';

@suite
export class PatchAlternativeLabelsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  private static alternativeLabelRepository: AlternativeLabelRepository;

  static async before() {
    PatchAlternativeLabelsTest.serviceClient = await testEnvironment.getServiceClient();
    PatchAlternativeLabelsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    PatchAlternativeLabelsTest.skillRepository = await testEnvironment.getSkillRepository();
    PatchAlternativeLabelsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
    PatchAlternativeLabelsTest.alternativeLabelRepository = await testEnvironment.getAlternativeLabelRepository();
  }

  async before() {
    this.setCorrelationId(PatchAlternativeLabelsTest.serviceClient);
  }

  async after() {
    super.after();
    await PatchAlternativeLabelsTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'PATCH the name of an existing active alternative label'() {
    await PatchAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      name: uuid(),
      skill_ID: correctSkill.ID,
      language_code: 'EN',
    };

    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    await PatchAlternativeLabelsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.ACTIVE_ONLY);

    this.response = await PatchAlternativeLabelsTest.serviceClient.patch(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of label PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
    assert.equal(this.response.data.name, correctAlternativeLabel.name, 'Expected old name still be present in the label draft.');
  }

  @test
  async 'PATCH the name of an existing inactive alternative label'() {
    await PatchAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await PatchAlternativeLabelsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    await PatchAlternativeLabelsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    this.response = await PatchAlternativeLabelsTest.serviceClient.patch(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of label PATCH request to be 200 (OK).');

    this.response = await PatchAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be persisted in the label draft.');

    this.response = await PatchAlternativeLabelsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.data.commaSeparatedAlternativeLabels, patchBody.name, 'Expected alternative label of patched text to be replicated.');
  }

  @test
  async 'PATCH the name of a non-existing inactive alternative label'() {
    await PatchAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const createdLabelId = uuid();
    this.response = await PatchAlternativeLabelsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/alternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 201, 'Expected status code of alternative label creation to be 201 (CREATED).');
  }

  @test
  async 'PATCH the name with an evil script tag of an existing inactive alternative label'() {
    await PatchAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    const patchBody = {
      name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
    };

    const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
    await PatchAlternativeLabelsTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    this.response = await PatchAlternativeLabelsTest.serviceClient.patch(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of label PATCH request with evil script tag to be 200 (OK).');

    this.response = await PatchAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be present in the label draft.');
  }

  @test
  async 'PATCH the name with an evil script tag of a non-existing inactive alternative label'() {
    await PatchAlternativeLabelsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchAlternativeLabelsTest.appUser);

    const patchBody = {
      name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
    };

    const createdLabelId = uuid();
    this.response = await PatchAlternativeLabelsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/alternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 201, 'Expected status code of alternative label creation to be 201 (CREATED).');

    this.response = await PatchAlternativeLabelsTest.serviceClient.get(`/SkillService/AlternativeLabels(ID=${createdLabelId},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
  }
}
