import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { v4 as uuid } from 'uuid';
import {
  Skill, Catalog, CatalogRepository, SkillRepository, Catalogs2SkillsRepository, EntityDraftMode,
} from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctCatalog, correctSkill, correctCatalog2Skill, mdiSkill, mdiCatalog,
} from './data';

@suite
export class AssignCatalogsToSkillTest extends BaseApiTest {
  private static appUser: string;

  private static serviceClient: AxiosInstance;

  private static catalogRepository: CatalogRepository;

  private static skillRepository: SkillRepository;

  private static catalog2SkillsRepository: Catalogs2SkillsRepository;

  private createdSkills: Skill[] = [];

  private createdCatalogs: Catalog[] = [];

  static async before() {
    AssignCatalogsToSkillTest.serviceClient = await testEnvironment.getServiceClient();
    AssignCatalogsToSkillTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    AssignCatalogsToSkillTest.catalogRepository = await testEnvironment.getCatalogRepository();
    AssignCatalogsToSkillTest.skillRepository = await testEnvironment.getSkillRepository();
    AssignCatalogsToSkillTest.catalog2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
  }

  async before() {
    this.setCorrelationId(AssignCatalogsToSkillTest.serviceClient);
  }

  async after() {
    super.after();
    await AssignCatalogsToSkillTest.catalogRepository.deleteMany(this.createdCatalogs);
    await AssignCatalogsToSkillTest.skillRepository.deleteMany(this.createdSkills);
  }

  @test
  async 'POST to /Skills(...)/SkillService.assignCatalogs with correct data'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    await AssignCatalogsToSkillTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const assignCatalogsBody = {
      catalog_IDs: [correctCatalog.ID],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.assignCatalogs`, assignCatalogsBody);
    assert.equal(this.response.status, 204, 'Expected status code of assignCatalogs action 204 (NO CONTENT).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.equal(this.response.data.catalogAssociations[0].skill_ID, correctSkill.ID, 'Expect catalog association with correct skill id');
    assert.equal(this.response.data.catalogAssociations[0].catalog_ID, correctCatalog.ID, 'Expect catalog association with correct catalog id');
  }

  @test
  async 'POST to /Skills(...)/SkillService.assignCatalogs to a Skill replicated from MDI'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(mdiSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    await AssignCatalogsToSkillTest.catalogRepository.insertOne(mdiCatalog, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);

    this.createdSkills.push(mdiSkill);
    this.createdCatalogs.push(mdiCatalog);
    const assignCatalogsBody = {
      catalog_IDs: [mdiCatalog.ID],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)/SkillService.assignCatalogs`, assignCatalogsBody);
    assert.equal(this.response.status, 400, 'Expected status code of assignCatalogs action 400 (BAD REQUEST).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.isEmpty(this.response.data.catalogAssociations, 'Expect no catalog association for the respective skill');
  }

  @test
  async 'POST to /Skills(...)/SkillService.unassignCatalogs with correct data'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    await AssignCatalogsToSkillTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    const catalog2skill = { ...correctCatalog2Skill, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID };
    await AssignCatalogsToSkillTest.catalog2SkillsRepository.insertOne(catalog2skill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const assignCatalogsBody = {
      catalog_IDs: [correctCatalog.ID],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.unassignCatalogs`, assignCatalogsBody);
    assert.equal(this.response.status, 204, 'Expected status code of assignCatalogs action 204 (NO CONTENT).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.isEmpty(this.response.data.catalogAssociations, 'Expect no catalog association for the respective skill');
  }

  @test
  async 'POST to /Skills(...)/SkillService.unassignCatalogs to Skill replicated from MDI'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(mdiSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    await AssignCatalogsToSkillTest.catalogRepository.insertOne(mdiCatalog, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    const catalog2skill = { ...correctCatalog2Skill, skill_ID: mdiSkill.ID, catalog_ID: mdiCatalog.ID };
    await AssignCatalogsToSkillTest.catalog2SkillsRepository.insertOne(catalog2skill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);

    this.createdSkills.push(mdiSkill);
    this.createdCatalogs.push(mdiCatalog);
    const unassignCatalogsBody = {
      catalog_IDs: [mdiCatalog.ID],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)/SkillService.unassignCatalogs`, unassignCatalogsBody);
    assert.equal(this.response.status, 400, 'Expected status code of assignCatalogs action 400(BAD REQUEST).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${mdiSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.equal(this.response.data.catalogAssociations[0].skill_ID, mdiSkill.ID, 'Expect catalog association with correct skill id');
    assert.equal(this.response.data.catalogAssociations[0].catalog_ID, mdiCatalog.ID, 'Expect catalog association with correct catalog id');
  }

  @test
  async 'POST to /Skills(...)/SkillService.assignCatalogs with catalog in draft mode from another user'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    await AssignCatalogsToSkillTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, 'test.user@sap.com');

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const assignCatalogsBody = {
      catalog_IDs: [correctCatalog.ID],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.assignCatalogs`, assignCatalogsBody);
    assert.equal(this.response.status, 400, 'Expected status code of assignCatalogs action 400 (BAD REQUEST).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.isEmpty(this.response.data.catalogAssociations, 'Expect no catalog association for the respective skill');
  }

  @test
  async 'POST to /Skills(...)/SkillService.unassignCatalogs with catalog in draft mode from another user'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);
    await AssignCatalogsToSkillTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, 'test.user@sap.com');
    const catalog2skill = { ...correctCatalog2Skill, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID };
    await AssignCatalogsToSkillTest.catalog2SkillsRepository.insertOne(catalog2skill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const assignCatalogsBody = {
      catalog_IDs: [correctCatalog.ID],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.unassignCatalogs`, assignCatalogsBody);
    assert.equal(this.response.status, 400, 'Expected status code of assignCatalogs action 400(BAD REQUEST).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.equal(this.response.data.catalogAssociations[0].skill_ID, correctSkill.ID, 'Expect catalog association with correct skill id');
    assert.equal(this.response.data.catalogAssociations[0].catalog_ID, correctCatalog.ID, 'Expect catalog association with correct catalog id');
  }

  @test
  async 'POST to /Skills(...)/SkillService.assignCatalogs with invalid catalog id'() {
    await AssignCatalogsToSkillTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, AssignCatalogsToSkillTest.appUser);

    this.createdSkills.push(correctSkill);
    this.createdCatalogs.push(correctCatalog);
    const assignCatalogsBody = {
      catalog_IDs: [uuid()],
    };
    this.response = await AssignCatalogsToSkillTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.assignCatalogs`, assignCatalogsBody);
    assert.equal(this.response.status, 400, 'Expected status code of assignCatalogs action 400 (BAD REQUEST).');
    this.response = await AssignCatalogsToSkillTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)?$expand=catalogAssociations`);
    assert.isEmpty(this.response.data.catalogAssociations, 'Expect no catalog association for the respective skill');
  }
}
