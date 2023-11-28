import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  Catalog, Skill, Catalogs2Skills, SkillRepository, CatalogRepository, Catalogs2SkillsRepository, EntityDraftMode,
} from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctSkill, correctCatalog, correctCatalog2Skill, mdiCatalog,
} from './data';

@suite
export class DeleteCatalogTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static catalogRepository: CatalogRepository;

  private static skillRepository: SkillRepository;

  private static catalog2SkillsRepository: Catalogs2SkillsRepository;

  private static appUser: string;

  private static createdCatalogs: Catalog[] = [];

  private static createdSkills: Skill[] = [];

  private static createdCatalog2Skills: Catalogs2Skills[] = [];

  static async before() {
    DeleteCatalogTest.serviceClient = await testEnvironment.getServiceClient();
    DeleteCatalogTest.catalogRepository = await testEnvironment.getCatalogRepository();
    DeleteCatalogTest.skillRepository = await testEnvironment.getSkillRepository();
    DeleteCatalogTest.catalog2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
    DeleteCatalogTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
  }

  async before() {
    this.setCorrelationId(DeleteCatalogTest.serviceClient);
  }

  async after() {
    super.after();
    await DeleteCatalogTest.catalogRepository.deleteMany(DeleteCatalogTest.createdCatalogs);
    await DeleteCatalogTest.skillRepository.deleteMany(DeleteCatalogTest.createdSkills);
    await DeleteCatalogTest.catalog2SkillsRepository.deleteMany(DeleteCatalogTest.createdCatalog2Skills);
  }

  @test
  async 'DELETE to Catalogs without skill association'() {
    DeleteCatalogTest.createdCatalogs.push(correctCatalog);
    await DeleteCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY, DeleteCatalogTest.appUser);
    const deleteResponse = await DeleteCatalogTest.serviceClient.delete(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);
    this.response = await DeleteCatalogTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);

    assert.equal(deleteResponse.status, 204, 'Expected status code of catalog deletion to be 204 (NO CONTENT).');
    assert.equal(this.response.status, 404, 'Expected status code of catalog reading to be 404 (NOT FOUND).');
  }

  @test
  async 'DELETE to Catalogs replicated from MDI'() {
    DeleteCatalogTest.createdCatalogs.push(mdiCatalog);
    await DeleteCatalogTest.catalogRepository.insertOne(mdiCatalog, EntityDraftMode.ACTIVE_ONLY, DeleteCatalogTest.appUser);
    const deleteResponse = await DeleteCatalogTest.serviceClient.delete(`/CatalogService/Catalogs(ID=${mdiCatalog.ID},IsActiveEntity=true)`);
    this.response = await DeleteCatalogTest.serviceClient.get(`/CatalogService/Catalogs(ID=${mdiCatalog.ID},IsActiveEntity=true)`);

    assert.equal(deleteResponse.status, 400, 'Expected status code of catalog deletion to be 400 (BAD REQUEST).');
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'DELETE to Catalogs with skill association'() {
    const catalog2Skill = { ...correctCatalog2Skill, CATALOG_ID: correctCatalog.ID, SKILL_ID: correctSkill.ID };
    await DeleteCatalogTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY, DeleteCatalogTest.appUser);
    await DeleteCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, DeleteCatalogTest.appUser);
    DeleteCatalogTest.createdCatalogs.push(correctCatalog);
    DeleteCatalogTest.createdSkills.push(correctSkill);
    DeleteCatalogTest.createdCatalog2Skills.push(catalog2Skill);
    await DeleteCatalogTest.catalog2SkillsRepository.insertOne(catalog2Skill, EntityDraftMode.ACTIVE_ONLY, DeleteCatalogTest.appUser);
    const deleteResponse = await DeleteCatalogTest.serviceClient.delete(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);
    this.response = await DeleteCatalogTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);

    assert.equal(deleteResponse.status, 400, 'Expected status code of catalog deletion to be 400 (BAD REQUEST).');
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }
}
