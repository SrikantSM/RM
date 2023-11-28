import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  Skill, Catalog, Catalogs2Skills, CatalogRepository, SkillRepository, Catalogs2SkillsRepository, EntityDraftMode,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctCatalog, correctSkill, correctCatalog2Skill,
} from './data';

@suite
export class AssignSkillToCatalogTest extends BaseApiTest {
  private static appUser: string;

  private static serviceClient: AxiosInstance;

  private static catalogRepository: CatalogRepository;

  private static skillRepository: SkillRepository;

  private static catalog2SkillsRepository: Catalogs2SkillsRepository;

  private createdSkills: Skill[] = [];

  private createdCatalogs: Catalog[] = [];

  private createdCatalogs2Skills: Catalogs2Skills[] = [];

  static async before() {
    AssignSkillToCatalogTest.serviceClient = await testEnvironment.getServiceClient();
    AssignSkillToCatalogTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    AssignSkillToCatalogTest.catalogRepository = await testEnvironment.getCatalogRepository();
    AssignSkillToCatalogTest.skillRepository = await testEnvironment.getSkillRepository();
    AssignSkillToCatalogTest.catalog2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
  }

  async before() {
    this.setCorrelationId(AssignSkillToCatalogTest.serviceClient);
  }

  async after() {
    super.after();
    await AssignSkillToCatalogTest.catalogRepository.deleteMany(this.createdCatalogs);
    await AssignSkillToCatalogTest.skillRepository.deleteMany(this.createdSkills);
    await AssignSkillToCatalogTest.catalog2SkillsRepository.deleteMany(this.createdCatalogs2Skills);
  }

  @test
  async 'POST to Catalogs/skillAssociations with correct data'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const catalog2SkillBody = {
      skill_ID: correctSkill.ID,
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalog2SkillBody);
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);
    assert.isNotEmpty(this.response.data.ID);
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');
  }

  @test
  async 'POST direct to Catalogs2Skills with correct data and active catalog only'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const catalog2SkillBody = {
      skill_ID: correctSkill.ID,
      catalog_ID: correctCatalog.ID,
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.post('/CatalogService/Catalogs2Skills', catalog2SkillBody);
    assert.equal(this.response.status, 409, 'Expected status code of direct catalog2skill creation to be 409 (CONFLICT).');
  }

  @test
  async 'POST direct to Catalogs2Skills with correct data and draft catalog only'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const catalog2SkillBody = {
      skill_ID: correctSkill.ID,
      catalog_ID: correctCatalog.ID,
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.post('/CatalogService/Catalogs2Skills', catalog2SkillBody);
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);
    assert.equal(this.response.status, 201, 'Expected status code of direct catalog2skill creation to be 201 (CREATED).');

    const response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs2Skills(ID=${this.response.data.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(response.status, 400, 'Expected status code of activation to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Catalogs/skillAssociations two times with same data'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const catalog2SkillBody = {
      skill_ID: correctSkill.ID,
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalog2SkillBody);
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);
    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalog2SkillBody);
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of assign the same skill twice to be 400 (BAD REQUEST).');
  }

  @test
  async 'PATCH direct to Catalogs2Skills with correct data'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalog2SkillsRepository.insertOne(correctCatalog2Skill, EntityDraftMode.DRAFT_ONLY, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    this.createdCatalogs2Skills.push(correctCatalog2Skill);
    const patchBody = {
      skill_ID: correctSkill.ID,
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.patch(`/CatalogService/Catalogs2Skills(ID=${correctCatalog2Skill.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of patch Catalogs2Skills to be 200 (OK).');

    this.response = await AssignSkillToCatalogTest.serviceClient.get(`/CatalogService/Catalogs2Skills(ID=${correctCatalog2Skill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of read catalog2skill to be 200 (OK).');
    assert.equal(this.response.data.skill_ID, correctSkill.ID, 'Expected status code to be 200 (OK).');
  }

  @test
  async 'POST to Catalogs/skillAssociations with empty skill_ID and activate'() {
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, AssignSkillToCatalogTest.appUser);
    this.createdCatalogs.push(correctCatalog);

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, {});
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);
    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`,
      {});

    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Catalogs/skillAssociations with not existing skill'() {
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, AssignSkillToCatalogTest.appUser);
    this.createdCatalogs.push(correctCatalog);
    const catalog2SkillBody = {
      skill_ID: uuid(),
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalog2SkillBody);
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');

    const response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(response.status, 400, 'Expected status code of assign the skill which do not exist to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Catalogs/skillAssociations with draft skill only'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);

    const catalog2SkillBody = {
      skill_ID: correctSkill.ID,
    };

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalog2SkillBody);
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of assign the skill which do not exist to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Catalogs/skillAssociations with draft catalog only'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const catalog2SkillBody = {
      skill_ID: correctSkill.ID,

    };
    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalog2SkillBody);
    assert.equal(this.response.status, 201, 'Expected status code of catalog2skill association creation to be 201 (CREATED).');
    this.createdCatalogs2Skills.push({ ID: this.response.data.ID } as Catalogs2Skills);

    this.response = await AssignSkillToCatalogTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of activate a skill assigment with only draft catalog to be 200. (OK).');
  }

  @test
  async 'DELETE /CatalogService/Catalogs2Skills'() {
    await AssignSkillToCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, AssignSkillToCatalogTest.appUser);
    await AssignSkillToCatalogTest.catalog2SkillsRepository.insertOne(correctCatalog2Skill, EntityDraftMode.DRAFT_ONLY, AssignSkillToCatalogTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);

    this.response = await AssignSkillToCatalogTest.serviceClient.delete(`/CatalogService/Catalogs2Skills(ID=${correctCatalog2Skill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 204, 'Expected status code of catalog2skill association deletion to be 204 (NO_CONTENT).');

    this.response = await AssignSkillToCatalogTest.serviceClient.get(`/CatalogService/Catalogs2Skills(ID=${correctCatalog2Skill.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 404, 'Expected status code of read catalog2skill to be 404 (NOT_FOUND).');
  }
}
