import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  CatalogRepository, Catalogs2SkillsRepository, EntityDraftMode, SkillRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  catalogWithEmptyDescription, catalogWithEmptyName, catalogWithEvilDescription, catalogWithEvilName, catalogWithExistingName, catalogWithNullDescription, catalogWithNullName, correctCatalog, correctCatalog2Skill, correctCatalog2Skill2, correctSkill,
} from './data';

@suite
export class DraftActivateCatalogsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static catalogRepository: CatalogRepository;

  private static skillRepository: SkillRepository;

  private static catalog2SkillsRepository: Catalogs2SkillsRepository;

  static async before() {
    DraftActivateCatalogsTest.serviceClient = await testEnvironment.getServiceClient();
    DraftActivateCatalogsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DraftActivateCatalogsTest.catalogRepository = await testEnvironment.getCatalogRepository();
    DraftActivateCatalogsTest.skillRepository = await testEnvironment.getSkillRepository();
    DraftActivateCatalogsTest.catalog2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
  }

  async before() {
    this.setCorrelationId(DraftActivateCatalogsTest.serviceClient);
  }

  async after() {
    super.after();
    await DraftActivateCatalogsTest.catalogRepository.deleteMany([correctCatalog, catalogWithExistingName, catalogWithNullName, catalogWithEmptyName, catalogWithNullDescription, catalogWithEmptyDescription, catalogWithEvilName, catalogWithEvilDescription]);
    await DraftActivateCatalogsTest.skillRepository.deleteOne(correctSkill);
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing active catalog'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request of a active catalog to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on a non-existing catalog'() {
    const createdCatalogId = uuid();

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${createdCatalogId},IsActiveEntity=false)/CatalogService.draftActivate`, {});

    assert.equal(this.response.status, 404, 'Expected status code of draft activate request of a non-existing catalog to be 404 (NOT FOUND).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with an existing name'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog);
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithExistingName, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithExistingName.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithExistingName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with a null name'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithNullName, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithNullName.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithNullName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with an empty name'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithEmptyName, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithEmptyName.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithEmptyName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with a null description'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithNullDescription, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithNullDescription.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithNullDescription.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with an empty description'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithEmptyName, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithEmptyName.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithEmptyName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with an evil name'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithEvilName, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithEvilName.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithEvilName.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with an evil description'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(catalogWithEvilDescription, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${catalogWithEvilDescription.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${catalogWithEvilDescription.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with a correct skill assigned'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);
    await DraftActivateCatalogsTest.skillRepository.insertOne(correctSkill);

    const catalog2Skill = { ...correctCatalog2Skill, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID };
    await DraftActivateCatalogsTest.catalog2SkillsRepository.insertOne(catalog2Skill, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft activate request to be 200 (OK).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with a skill with an empty ID assigned'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);
    await DraftActivateCatalogsTest.skillRepository.insertOne(correctSkill);

    const catalog2Skill = { ...correctCatalog2Skill, skill_ID: '', catalog_ID: correctCatalog.ID };
    await DraftActivateCatalogsTest.catalog2SkillsRepository.insertOne(catalog2Skill as any, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with a non-existing skill assigned'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    const catalog2Skill = { ...correctCatalog2Skill, skill_ID: uuid(), catalog_ID: correctCatalog.ID };
    await DraftActivateCatalogsTest.catalog2SkillsRepository.insertOne(catalog2Skill, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (CONFLICT).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'Post to Catalogs/CatalogService.draftActivate on an existing inactive catalog with duplicated skills assigned'() {
    await DraftActivateCatalogsTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);
    await DraftActivateCatalogsTest.skillRepository.insertOne(correctSkill);

    const catalog2Skill1 = { ...correctCatalog2Skill, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID };
    const catalog2Skill2 = { ...correctCatalog2Skill2, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID };
    await DraftActivateCatalogsTest.catalog2SkillsRepository.insertOne(catalog2Skill1, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);
    await DraftActivateCatalogsTest.catalog2SkillsRepository.insertOne(catalog2Skill2, EntityDraftMode.DRAFT_ONLY, DraftActivateCatalogsTest.appUser);

    this.response = await DraftActivateCatalogsTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
    assert.equal(this.response.status, 400, 'Expected status code of draft activate request to be 400 (BAD REQUEST).');

    this.response = await DraftActivateCatalogsTest.serviceClient.get(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }
}
