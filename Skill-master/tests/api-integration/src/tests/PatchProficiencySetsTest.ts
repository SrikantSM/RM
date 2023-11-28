import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { EntityDraftMode, ProficiencySetRepository } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctDefaultLanguage, correctProficiencySet, mdiProficiencySet } from './data';

@suite
export class PatchProficiencySetsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencySetRepository: ProficiencySetRepository;

  static async before() {
    PatchProficiencySetsTest.serviceClient = await testEnvironment.getServiceClient();
    PatchProficiencySetsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    PatchProficiencySetsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(PatchProficiencySetsTest.serviceClient);
  }

  async after() {
    super.after();
    await PatchProficiencySetsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
    await PatchProficiencySetsTest.proficiencySetRepository.deleteOne(mdiProficiencySet);
  }

  @test
  async 'PATCH the name and description of an existing inactive proficiency set'() {
    await PatchProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, PatchProficiencySetsTest.appUser);

    const patchBody = {
      name: uuid(),
      description: uuid(),
    };
    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of set PATCH request to be 200 (OK).');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name is persisted in the set draft.');
    assert.equal(this.response.data.description, patchBody.description, 'Expected new description is persisted in the set draft.');
  }

  @test
  async 'PATCH the name and description of a non-existing inactive proficiency set'() {
    const patchBody = {
      name: uuid(),
      description: uuid(),
    };

    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`, patchBody);
    assert.equal(this.response.status, 201, 'Expected status code of proficiency set creation to be 201 (CREATED).');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new name is persisted in the set draft.');
    assert.equal(this.response.data.description, patchBody.description, 'Expected new description is persisted in the set draft.');
  }

  @test
  async 'PATCH active proficiency set deeply valid'() {
    await PatchProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      OID: null,
      name: uuid(),
      lifecycleStatus_code: 0,
      description: uuid(),
      proficiencyLevels: [
        {
          rank: 1,
          texts: [
            {
              name: uuid(),
              description: uuid(),
              locale: correctDefaultLanguage.code,
            },
          ],
        },
      ],
    };

    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set creation to be 200 (OK).');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)?$expand=proficiencyLevels($expand=texts)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.equal(this.response.data.name, patchBody.name, 'Expected new proficiency set name to be persisted.');
    assert.equal(this.response.data.description, patchBody.description, 'Expected new proficiency set description to be persisted.');
    assert.equal(this.response.data.proficiencyLevels[0].rank, patchBody.proficiencyLevels[0].rank, 'Expected new proficiency level rank to be persisted.');
    assert.equal(this.response.data.proficiencyLevels[0].name, patchBody.proficiencyLevels[0].texts[0].name, 'Expected new proficiency level name to be persisted.');
    assert.equal(this.response.data.proficiencyLevels[0].texts[0].name, patchBody.proficiencyLevels[0].texts[0].name, 'Expected new proficiency level text name to be persisted.');
  }

  @test
  async 'PATCH active proficiency set deeply validations'() {
    await PatchProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      OID: null,
      name: uuid(),
      lifecycleStatus_code: 0,
      description: 'description',
      proficiencyLevels: [],
    };

    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set creation to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)?$expand=proficiencyLevels($expand=texts)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.notEqual(this.response.data.name, patchBody.name, 'Expected new name was not persisted in the draft.');
  }

  @test
  async 'PATCH active proficiency set replicated from MDI'() {
    await PatchProficiencySetsTest.proficiencySetRepository.insertOne(mdiProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      OID: uuid(),
      name: uuid(),
      description: 'description',
      lifecycleStatus_code: 0,
      proficiencyLevels: [{
        odmUUID: uuid(),
        rank: 1,
        texts: [
          {
            name: uuid(),
            description: uuid(),
            locale: correctDefaultLanguage.code,
          },
        ],
      }],
    };

    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${mdiProficiencySet.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set creation to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${mdiProficiencySet.ID},IsActiveEntity=true)?$expand=proficiencyLevels($expand=texts)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.notEqual(this.response.data.name, patchBody.name, 'Expected new name was not persisted in the draft.');
  }

  @test
  async 'PATCH active proficiency set deeply injection'() {
    await PatchProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      OID: null,
      name: uuid(),
      description: 'description',
      lifecycleStatus_code: 0,
      proficiencyLevels: [
        {
          rank: 1,
          texts: [
            {
              name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
              description: uuid(),
              locale: correctDefaultLanguage.code,
            },
          ],
        },
      ],
    };

    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set creation to be 400 (BAD REQUEST).');
    assert.notInclude(this.response.data.error.message, 'full entity', 'Doesn\'t give wrong error message');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)?$expand=proficiencyLevels($expand=texts)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.notEqual(this.response.data.name, patchBody.name, 'Expected new name was not persisted in the draft.');
  }

  @test
  async 'PATCH active proficiency set with more proficiency levels than the maximum count'() {
    const MAX_LEVEL_COUNT = 50;

    await PatchProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    const patchBody = {
      OID: null,
      name: uuid(),
      description: uuid(),
      lifecycleStatus_code: 0,
      proficiencyLevels: [] as any[],
    };

    for (let rank = 1; rank <= MAX_LEVEL_COUNT + 1; rank += 1) {
      const proficiencyLevel = {
        name: uuid(),
        description: uuid(),
        rank,
        texts: [
          {
            name: uuid(),
            description: uuid(),
            locale: correctDefaultLanguage.code,
          },
        ],
      };
      patchBody.proficiencyLevels.push(proficiencyLevel);
    }

    this.response = await PatchProficiencySetsTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set creation to be 400 (BAD REQUEST).');
    assert.include(this.response.data.error.message, 'maximum', 'Gives correct error message');

    this.response = await PatchProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)?$expand=proficiencyLevels($expand=texts)`);
    assert.equal(this.response.status, 200, 'Expected status code of set reading to be 200 (OK).');
    assert.notEqual(this.response.data.name, patchBody.name, 'Expected new name was not persisted in the draft.');
  }
}
