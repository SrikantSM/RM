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
export class PatchSkillsTextsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  static async before() {
    PatchSkillsTextsTest.serviceClient = await testEnvironment.getServiceClient();
    PatchSkillsTextsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    PatchSkillsTextsTest.skillRepository = await testEnvironment.getSkillRepository();
    PatchSkillsTextsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async before() {
    this.setCorrelationId(PatchSkillsTextsTest.serviceClient);
  }

  async after() {
    super.after();
    await PatchSkillsTextsTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'PATCH the name of an existing active skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      name: uuid(),
      locale: 'en',
      description: 'decription',
      ID: correctSkill.ID,
    };

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await PatchSkillsTextsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.ACTIVE_ONLY);

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of skill text PATCH request to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill text reading to be 200 (OK).');
    assert.equal(this.response.data.name, correctSkillText.name, 'Expected old name to still be present in the skill text draft.');
  }

  @test
  async 'PATCH the name of an existing inactive skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    const patchBody = {
      name: uuid(),
    };

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await PatchSkillsTextsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of skill text PATCH request to be 200 (OK).');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill text reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be persisted in the skill text draft.');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.data.name, patchBody.name, 'Expected name of patched text to be replicated.');
  }

  @test
  async 'PATCH the name of a non-existing inactive skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID };

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, skillText);
    assert.equal(this.response.status, 201, 'Expected status code of skill text creation to be 201 (CREATED).');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill text reading to be 200 (OK).');
    assert.equal(this.response.data.name, skillText.name, 'Expected new name to be persisted.');
  }

  @test
  async 'PATCH the skill text with evil name of an existing inactive skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    const patchBody = {
      name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
    };

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await PatchSkillsTextsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of skill text PATCH request to be 200 (OK).');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be present in the skill text draft.');
  }

  @test
  async 'PATCH the skill text with evil name of a non-existing inactive skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID };
    skillText.name = '<script src="https://evilpage.de/assets/js/evilScript.js"></script>';

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, skillText);
    assert.equal(this.response.status, 201, 'Expected status code of skill text PATCH request to be 201 (CREATED).');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill text reading to be 200 (OK).');
  }

  @test
  async 'PATCH the skill text with forbidden first character in name of an existing inactive skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    const patchBody = {
      name: '@skillName',
    };

    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
    await PatchSkillsTextsTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of skill text PATCH request to be 200 (OK).');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of label reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name to be present in the skill text draft.');
  }

  @test
  async 'PATCH the skill text with forbidden first character in name of a non-existing inactive skill text'() {
    await PatchSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, PatchSkillsTextsTest.appUser);

    const skillText = { ...correctSkillText, ID: correctSkill.ID };
    skillText.name = '@skillName';

    this.response = await PatchSkillsTextsTest.serviceClient.patch(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, skillText);
    assert.equal(this.response.status, 201, 'Expected status code of skill text PATCH request to be 201 (CREATED).');

    this.response = await PatchSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of skill text reading to be 200 (OK).');
  }
}
