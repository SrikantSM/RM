import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import {
  EntityDraftMode, ProficiencySetRepository, ProficiencyLevel, ProficiencyLevelText, ProficiencyLevelRepository, ProficiencyLevelTextRepository,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';
import { correctProficiencySet, correctProficiencyLevel, correctProficiencyLevelText } from './data';

@suite
export class DraftEditProficiencySetsTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static appUser: string;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static proficiencyLevelRepository: ProficiencyLevelRepository;

  private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

  static async before() {
    DraftEditProficiencySetsTest.serviceClient = await testEnvironment.getServiceClient();
    DraftEditProficiencySetsTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
    DraftEditProficiencySetsTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    DraftEditProficiencySetsTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    DraftEditProficiencySetsTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async before() {
    this.setCorrelationId(DraftEditProficiencySetsTest.serviceClient);
  }

  async after() {
    super.after();
    await DraftEditProficiencySetsTest.proficiencySetRepository.deleteOne(correctProficiencySet);
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftEdit on an existing active proficiency set'() {
    await DraftEditProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftEditProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.ACTIVE_ONLY);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftEditProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.ACTIVE_ONLY);

    this.response = await DraftEditProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)/ProficiencyService.draftEdit`, {});
    assert.equal(this.response.status, 200, 'Expected status code of draft edit request to be 200 (OK).');

    this.response = await DraftEditProficiencySetsTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`);
    assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftEdit on an existing inactive proficiency set'() {
    await DraftEditProficiencySetsTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, DraftEditProficiencySetsTest.appUser);
    const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
    await DraftEditProficiencySetsTest.proficiencyLevelRepository.insertOne(proficiencyLevel, EntityDraftMode.BOTH, DraftEditProficiencySetsTest.appUser);
    const proficiencyLevelText = { ...correctProficiencyLevelText, ID: correctProficiencyLevel.ID } as ProficiencyLevelText;
    await DraftEditProficiencySetsTest.proficiencyLevelTextRepository.insertOne(proficiencyLevelText, EntityDraftMode.BOTH, DraftEditProficiencySetsTest.appUser);

    this.response = await DraftEditProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftEdit`, {});

    assert.equal(this.response.status, 400, 'Expected status code of draft edit request to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.draftEdit on a non-existing proficiency set'() {
    this.response = await DraftEditProficiencySetsTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${uuid()},IsActiveEntity=true)/ProficiencyService.draftEdit`, {});

    assert.equal(this.response.status, 404, 'Expected status code of draft edit request to be 404 (NOT FOUND).');
  }
}
