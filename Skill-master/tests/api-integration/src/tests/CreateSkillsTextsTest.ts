import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, SkillRepository, SkillText, SkillTextRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctSkill, correctSkillText, evilSkillTextName, evilSkillTextDescription, forbiddenFirstCharacterSkillTextName, forbiddenFirstCharacterSkillTextDescription,
} from './data';

@suite
export class CreateSkillsTextsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static skillRepository: SkillRepository;

  private static skillTextRepository: SkillTextRepository;

  static async before() {
    CreateSkillsTextsTest.serviceClient = await testEnvironment.getServiceClient();
    CreateSkillsTextsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    CreateSkillsTextsTest.skillRepository = await testEnvironment.getSkillRepository();
    CreateSkillsTextsTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async before() {
    this.setCorrelationId(CreateSkillsTextsTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateSkillsTextsTest.skillRepository.deleteOne(correctSkill);
    await CreateSkillsTextsTest.skillTextRepository.deleteOne(correctSkillText);
  }

  @test
  async 'POST to Skill/texts with correct data'() {
    const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;

    await CreateSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateSkillsTextsTest.appUser);

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts`, skillText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = this.response.data.ID_texts;
    this.response = await CreateSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }

  @test
  async 'POST to Skills/texts with non-existing parent skill'() {
    const createdSkillId = uuid();

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${createdSkillId},IsActiveEntity=false)/texts`, correctSkillText);

    assert.equal(this.response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST to Skill/texts active parent skill'() {
    await CreateSkillsTextsTest.skillRepository.insertOne(correctSkill);

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/texts`, correctSkillText);

    assert.equal(this.response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST to Skill/texts with an evil script tag in skill name'() {
    const skillText = { ...evilSkillTextName, ID: correctSkill.ID } as SkillText;

    await CreateSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateSkillsTextsTest.appUser);

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts`, skillText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = evilSkillTextName.ID_texts;
    this.response = await CreateSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }

  @test
  async 'POST to Skill/texts with an evil script tag in skill description'() {
    const skillText = { ...evilSkillTextDescription, ID: correctSkill.ID } as SkillText;

    await CreateSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateSkillsTextsTest.appUser);

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts`, skillText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = this.response.data.ID_texts;
    this.response = await CreateSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }

  @test
  async 'POST to Skill/texts with a forbidden first character in skill name'() {
    const skillText = { ...forbiddenFirstCharacterSkillTextName, ID: correctSkill.ID } as SkillText;

    await CreateSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateSkillsTextsTest.appUser);

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts`, skillText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = forbiddenFirstCharacterSkillTextName.ID_texts;
    this.response = await CreateSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }

  @test
  async 'POST to Skill/texts with a forbidden first character in skill description'() {
    const skillText = { ...forbiddenFirstCharacterSkillTextDescription, ID: correctSkill.ID } as SkillText;

    await CreateSkillsTextsTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, CreateSkillsTextsTest.appUser);

    this.response = await CreateSkillsTextsTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/texts`, skillText);

    assert.equal(this.response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

    const createdTextId = forbiddenFirstCharacterSkillTextDescription.ID_texts;
    this.response = await CreateSkillsTextsTest.serviceClient.get(`/SkillService/Skills_texts(ID_texts=${createdTextId},IsActiveEntity=false)`);

    assert.equal(this.response.status, 200, 'Expected status code of text reading to be 200 (OK).');
  }
}
