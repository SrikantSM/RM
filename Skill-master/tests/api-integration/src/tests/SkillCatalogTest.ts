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
export class SkillCatalogTest extends BaseApiTest {
  private static appUser: string;

  private static serviceClient: AxiosInstance;

  private static catalogRepository: CatalogRepository;

  private static skillRepository: SkillRepository;

  private static catalog2SkillsRepository: Catalogs2SkillsRepository;

  private createdSkills: Skill[] = [];

  private createdCatalogs: Catalog[] = [];

  private createdCatalogs2Skills: Catalogs2Skills[] = [];

  static async before() {
    SkillCatalogTest.serviceClient = await testEnvironment.getServiceClient();
    SkillCatalogTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    SkillCatalogTest.catalogRepository = await testEnvironment.getCatalogRepository();
    SkillCatalogTest.skillRepository = await testEnvironment.getSkillRepository();
    SkillCatalogTest.catalog2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
  }

  async before() {
    this.setCorrelationId(SkillCatalogTest.serviceClient);
  }

  async after() {
    super.after();
    await SkillCatalogTest.catalogRepository.deleteMany(this.createdCatalogs);
    await SkillCatalogTest.skillRepository.deleteMany(this.createdSkills);
    await SkillCatalogTest.catalog2SkillsRepository.deleteMany(this.createdCatalogs2Skills);
  }

  @test
  async 'GET assigned Catalogs Skills/catalogAssociations'() {
    await SkillCatalogTest.skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY, SkillCatalogTest.appUser);
    this.createdSkills.push(correctSkill);

    const catalog1 = {
      ...correctCatalog,
      name: `cat1 ${uuid()}`,
    };
    await SkillCatalogTest.catalogRepository.insertOne(catalog1, EntityDraftMode.BOTH, SkillCatalogTest.appUser);
    this.createdCatalogs.push(catalog1);
    const c2s1 = {
      ...correctCatalog2Skill,
      catalog_ID: catalog1.ID,
      skill_ID: correctSkill.ID,
    };
    await SkillCatalogTest.catalog2SkillsRepository.insertOne(c2s1, EntityDraftMode.BOTH, SkillCatalogTest.appUser);
    this.createdCatalogs2Skills.push(c2s1);

    const catalog2 = {
      ...correctCatalog,
      ID: uuid(),
      name: `cat2 ${uuid()}`,
    };
    await SkillCatalogTest.catalogRepository.insertOne(catalog2, EntityDraftMode.BOTH, SkillCatalogTest.appUser);
    this.createdCatalogs.push(catalog2);
    const c2s2 = {
      ...correctCatalog2Skill,
      ID: uuid(),
      catalog_ID: catalog2.ID,
      skill_ID: correctSkill.ID,
    };
    await SkillCatalogTest.catalog2SkillsRepository.insertOne(c2s2, EntityDraftMode.BOTH, SkillCatalogTest.appUser);
    this.createdCatalogs2Skills.push(c2s2);

    this.response = await SkillCatalogTest.serviceClient.get(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)?$select=commaSeparatedCatalogs&$expand=catalogAssociations`);
    assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
    assert.equal(this.response.data.catalogAssociations.length, 2, 'Expected 2 catalogs are assigned.');
    assert.equal(this.response.data.commaSeparatedCatalogs, `${catalog1.name}, ${catalog2.name}`, 'Expect commaSeparatedCatalogs to be computed correctly');
  }
}
