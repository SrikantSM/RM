import { suite, test, timeout } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';
import {
  resourceRequest,
  skillRequirements,
  resourceHeaderData,
  expectedResult,
  expectedMatchingResult,
  skillsData,
  projectRoles,
  proficiencyLevel11,
  resourceOrganizationData,
} from './data';

@suite
export class ResourceRequest {
  static async before() {
    await insertData();
  }

  /* The resource request API test scenario goes as below
   *
   * 1. Project manager create resource request
   * 2. Test Expand feature on draft edit RR
   * 3. Project manager cannot view restricted project roles
   * 4. Project manager can  view un-restricted project roles
   * 5. Non-restricted skills are visible to Project Manager
   * 6. Restricted skills are not visible to Project Manager
   * 7a. Project manager add skills to the created resource request
   * 7b. Project manager tries assigning skill proficiency which is not valid for skill
   * 7c. Project manager tries assigning skill proficiency as null
   * 8. Project manager publish resource reaource request
   * 9. Resource manager read resource request
   * 10. Read Matching Candidates
   * 11. Forward RR to different Resource Org
   * 12. Read Matching Candidates for Forwarded Org
   * 13. Project manager withdraw resource request
   * 14 Project manager delete skills
   * 15. Project manager delete resource request
   * 16. Project manager cannot view restricted resource organizations
   * 17. Project manager can view un-restricted resource organizations
   */

  // 1. Project manager create resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Create S4 Resource Request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const draftCreation = await resourceRequestClient.post(
      '/ResourceRequests',
      resourceRequest[0],
    );
    assert.equal(draftCreation.status, 201);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );

    assert.equal(draftActivation.status, 200);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create generic Resource Request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const draftCreation = await resourceRequestClient.post(
      '/ResourceRequests',
      resourceRequest[1],
    );
    assert.equal(draftCreation.status, 201);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[1].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );

    assert.equal(draftActivation.status, 200);
  }

  // 2. Test Expand feature on draft edit of S4 RR
  @test(timeout(TEST_TIMEOUT))
  async 'Resource Request - Draft Edit'() {
    const expectedDemand = {
      ID: 'ab188671-2ce5-4258-928f-1b76ea251f46',
      requestedQuantity: 100,
      billingRoleName: 'Junior Consultant',
      billingCategory: { ID: 'RRA', name: 'Billable' },
    };
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const response = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.draftEdit?$select=demand_ID&$expand=demand($select=ID,billingRoleName,requestedQuantity;$expand=billingCategory($select=ID,name))`,
      {},
    );
    assert.equal(response.status, 200);
    assert.deepEqual(response.data.demand, expectedDemand);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );
    assert.equal(draftActivation.status, 200);
  }

  // 3. Project manager cannot view restricted project roles
  @test(timeout(TEST_TIMEOUT))
  async 'Restricted project roles are not visible to the Project Manager'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const response = await resourceRequestClient.get(`/ProjectRoles(ID='${projectRoles[1].ID}')`);
    assert.equal(response.status, 404);
  }

  // 4. Project manager can view un-restricted project roles
  @test(timeout(TEST_TIMEOUT))
  async 'Unrestricted project roles are visible to the Project Manager'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const response = await resourceRequestClient.get(`/ProjectRoles(ID='${projectRoles[0].ID}')`);
    assert.equal(response.status, 200);
  }

  // 5. Non-restricted skills are visible to Project Manager
  @test(timeout(TEST_TIMEOUT))
  async 'Non-restricted skills are visible to Project Manager'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const response = await resourceRequestClient.get(`/SkillsConsumptionVH(${skillsData[0].ID})`, {});
    assert.equal(response.status, 200);
  }

  // 6. Restricted skills are not visible to Project Manager
  @test(timeout(TEST_TIMEOUT))
  async 'Restricted skills are not visible to Project Manager'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const restrictedSkill = await resourceRequestClient.get(`/SkillsConsumptionVH(${skillsData[1].ID})`, {});
    assert.equal(restrictedSkill.status, 404);
  }

  // 7a. Project manager add skills to the created resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Create Skill Requirement'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const editDraft = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.draftEdit`,
      { PreserveChanges: true },
    );
    console.log('Edit draft RR');
    assert.equal(editDraft.status, 200);

    const createSkill = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/skillRequirements`,
      {},
    );
    console.log('create Skill');
    assert.equal(createSkill.status, 201);

    skillRequirements.ID = createSkill.data.ID;
    const updateSkill = await resourceRequestClient.patch(
      `SkillRequirements(ID=${skillRequirements.ID},IsActiveEntity=false)`,
      {
        skill_ID: skillRequirements.SKILL_ID,
        importance_code: skillRequirements.IMPORTANCE_CODE,
        proficiencyLevel_ID: skillRequirements.PROFICIENCYLEVEL_ID,
      },
    );
    console.log('update Skill');
    assert.equal(updateSkill.status, 200);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );
    console.log('Activate Skill');
    assert.equal(draftActivation.status, 200);
  }

  // 7b. Project manager tries assigning skill proficiency which is not valid for skill
  @test(timeout(TEST_TIMEOUT))
  async 'Create Skill Requirement Negative(Proficiency Level Check)'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const editDraft = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.draftEdit`,
      { PreserveChanges: true },
    );
    console.log('Edit draft RR');
    assert.equal(editDraft.status, 200);

    const createSkill = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/skillRequirements`,
      {},
    );
    console.log('create Skill');
    assert.equal(createSkill.status, 201);

    skillRequirements.ID = createSkill.data.ID;
    const updateSkill = await resourceRequestClient.patch(
      `SkillRequirements(ID=${skillRequirements.ID},IsActiveEntity=false)`,
      {
        skill_ID: skillsData[2].ID,
        importance_code: 1,
        proficiencyLevel_ID: proficiencyLevel11.ID,
      },
    );
    console.log('update Skill');
    assert.equal(updateSkill.status, 200);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );
    // If only one error is thrown then we do not have a details section in the error body.
    assert.equal(draftActivation.data.error.details, undefined);
    assert.equal(draftActivation.data.error.message, `Enter a valid proficiency level for the skill "${skillsData[2].name}".`);
    assert.equal(draftActivation.status, 400);

    const draftDiscard = await resourceRequestClient.delete(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)`,
      {},
    );
    console.log('Activate Skill');
    assert.equal(draftDiscard.status, 204);
  }

  // 7c. Project manager tries assigning skill proficiency as null
  @test(timeout(TEST_TIMEOUT))
  async 'Create Skill Requirement Negative(Proficiency Level null Check)'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const editDraft = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.draftEdit`,
      { PreserveChanges: true },
    );

    assert.equal(editDraft.status, 200);

    const createSkill = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/skillRequirements`,
      {},
    );

    assert.equal(createSkill.status, 201);

    skillRequirements.ID = createSkill.data.ID;
    const updateSkill = await resourceRequestClient.patch(
      `SkillRequirements(ID=${skillRequirements.ID},IsActiveEntity=false)`,
      {
        skill_ID: skillsData[2].ID,
        importance_code: 1,
      },
    );

    assert.equal(updateSkill.status, 200);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );
    // If only one error is thrown then we do not have a details section in the error body.
    assert.equal(draftActivation.data.error.details, undefined);
    assert.equal(draftActivation.data.error.message, `Enter a proficiency level for the skill "${skillsData[2].name}".`);
    assert.equal(draftActivation.status, 400);

    const draftDiscard = await resourceRequestClient.delete(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)`,
      {},
    );
    assert.equal(draftDiscard.status, 204);
  }

  // 8. Project manager publish resource resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Publish Resource Request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const response = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.publishResourceRequest`,
      {},
    );
    assert.equal(response.status, 200);
  }

  // 9. Resource manager read resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Read Resource Request'() {
    const expectedResultForSpeceficTest = {
      '@context': '$metadata#ResourceRequests(ID,description,demand(ID,billingRole(ID,name)))/$entity', ID: '5c4398bd-d835-441e-9636-54b2ae58b192', description: 'Budget constraints/high demand in the Project so please assign accordingly. Low cost resource required', demand: { ID: 'ab188671-2ce5-4258-928f-1b76ea251f46', billingRole: { ID: 'RRAPITEST', name: 'Junior Consultant' } },
    };
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClient();

    const response = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest[0].ID})?$select=ID,description&$expand=demand($select=ID;$expand=billingRole($select=ID,name))`,
    );
    assert.equal(response.status, 200);
    delete response.data['@metadataEtag'];
    assert.deepEqual(response.data, expectedResultForSpeceficTest);
  }

  // 10. Read Matching Candidates
  @test(timeout(TEST_TIMEOUT))
  async 'Read Matching Candidates'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClient();

    const response = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest[0].ID})/matchingCandidates`,
    );

    const result = response.data.value.filter((i: any) => {
      for (const resource of resourceHeaderData) {
        if (resource.ID === i.resource_ID) return true;
      }
      return false;
    });

    assert.equal(response.status, 200);
    expect(expectedResult).to.have.deep.members(result);
  }

  // 11. Forward RR to different Resource Org
  @test(timeout(TEST_TIMEOUT))
  async 'Forward RR to different Resource Org'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClient();

    const response = await processRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID})/ProcessResourceRequestService.forwardResourceRequest`,
      {
        requestedResourceOrg_ID: resourceOrganizationData[0].displayId,
        processingResourceOrg_ID: resourceOrganizationData[1].displayId,
      },
    );

    assert.equal(response.status, 200);
  }

  // 12. Read Matching Candidates for Forwarded Org
  @test(timeout(TEST_TIMEOUT))
  async 'Fetch Matching Candidates for Forwarded Org'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClient();

    const matchingResponse = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest[0].ID})/matchingCandidates`,
    );

    const result = matchingResponse.data.value.filter((i: any) => {
      for (const resource of resourceHeaderData) {
        if (resource.ID === i.resource_ID) return true;
      }
      return false;
    });

    assert.equal(matchingResponse.status, 200);
    expect(expectedMatchingResult).to.have.deep.members(result);
  }

  // 13. Project manager withdraw resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Withdraw Resource Request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const response = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.withdrawResourceRequest`,
      {},
    );

    assert.equal(response.status, 200);
  }

  // 14. Project manager delete skills
  @test(timeout(TEST_TIMEOUT))
  async 'Delete Skill Requirement'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const editDraft = await resourceRequestClient.post(
      `ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)/ManageResourceRequestService.draftEdit`,
      { PreserveChanges: true },
    );

    assert.equal(editDraft.status, 200);

    const getSkillRequirements = await resourceRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/skillRequirements`,
    );

    assert.equal(getSkillRequirements.status, 200);
    skillRequirements.ID = getSkillRequirements.data.value[0].ID;
    const response = await resourceRequestClient.delete(
      `/SkillRequirements(ID=${skillRequirements.ID},IsActiveEntity=false)`,
    );
    assert.equal(response.status, 204);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );
    assert.equal(draftActivation.status, 200);
  }

  // 15. Project manager delete resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Delete Resource Request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const response = await resourceRequestClient.delete(
      `/ResourceRequests(ID=${resourceRequest[0].ID},IsActiveEntity=true)`,
    );

    assert.equal(response.status, 204);
  }

  // 16. Project manager cannot view restricted resource organizations
  @test(timeout(TEST_TIMEOUT))
  async 'Restricted resource organizations are not visible to the Project Manager'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const response = await resourceRequestClient.get(`/UnrestrictedResourceOrganizationsConsumption(ID='${resourceOrganizationData[2].displayId}')`);
    assert.equal(response.status, 404);
  }

  // 17. Project manager can view un-restricted resource organizations
  @test(timeout(TEST_TIMEOUT))
  async 'Unrestricted resource organizations are visible to the Project Manager'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    const response = await resourceRequestClient.get(`/UnrestrictedResourceOrganizationsConsumption(ID='${resourceOrganizationData[0].displayId}')`);
    assert.equal(response.status, 200);
  }

  static async after() {
    await deleteData();
  }
}
