import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { v4 as uuid } from 'uuid';
import { ProficiencyLevelRepository } from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allSkills,
    allEmployeeHeaders,
    allEmail,
    allExternalWorkExperience,
    allExternalWorkExperienceSkills,
    externalWorkExperience1,
    skillWithDescription1,
    allWorkforcePerson,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allJobDetails,
    allOrganizationDetails,
    allOrganizationHeaders,
    allCostCenters,
    allProficiencySet,
    allProficiencyLevel,
    setOneProficiencyLevel1,
    setTwoProficiencyLevel1,
    externalWorkExperienceSkills41,
    externalWorkExperienceSkills42,
    externalWorkExperience4,
    employeeHeaderWithDescription4,
    setOneProficiencyLevel2,
    allResourceOrganizations,
    allResourceOrganizationItems,
} from '../../data';
import { createExternalWorkExperienceSkills } from '../../data/service/myResourcesService';
import { ExternalWorkExperienceSkills } from '../../serviceEntities/myProjectExperienceService/ExternalWorkExperience';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('MyResourcesService/ExternalWorkExperienceSkills')
export class MyResourcesExternalWorkExperienceSkillsTest extends MyResourcesServiceRepository {
    public constructor() { super('ExternalWorkExperienceSkills'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.proficiencyLevelRepository.insertMany(allProficiencyLevel);
        await this.skillRepository.insertMany(allSkills);
        await this.externalWorkExperienceRepository.insertMany(allExternalWorkExperience);
        await this.externalWorkExperienceSkillsRepository.insertMany(allExternalWorkExperienceSkills);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.skillRepository.deleteMany(allSkills);
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
        await this.externalWorkExperienceRepository.deleteMany(allExternalWorkExperience);
        await this.externalWorkExperienceSkillsRepository.deleteMany(allExternalWorkExperienceSkills);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in external work experience.'() {
        const response = await this.get();
        this.responses.push(response);
        const externalWorkExperienceSkills = response.data.value as ExternalWorkExperienceSkills[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(externalWorkExperienceSkills, 'Expected a list of skills used in external work experience.');
        assert.isUndefined(
            externalWorkExperienceSkills.find(
                (externalWorkExperienceSkill) => (
                    externalWorkExperienceSkill.ID === externalWorkExperienceSkills41.ID
                    && externalWorkExperienceSkill.workExperience_ID === externalWorkExperience1.ID
                    && externalWorkExperienceSkill.skill_ID === skillWithDescription1.ID
                ),
            ),
            'Expected externalWorkExperienceSkills41.',
        );
        assert.isUndefined(
            externalWorkExperienceSkills.find(
                (externalWorkExperienceSkill) => (
                    externalWorkExperienceSkill.ID === externalWorkExperienceSkills42.ID
                    && externalWorkExperienceSkill.workExperience_ID === externalWorkExperience1.ID
                    && externalWorkExperienceSkill.skill_ID === skillWithDescription1.ID
                ),
            ),
            'Expected externalWorkExperienceSkills42.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in external work experience without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in external work experience with external work experience and skill details.'() {
        const response = await this.get('?$expand=skill,workExperience');
        this.responses.push(response);
        const externalWorkExperienceSkills = response.data.value as ExternalWorkExperienceSkills[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(externalWorkExperienceSkills, 'Expected a list of skills used in external work experience with external work experience and skill details.');
        assert.isUndefined(
            externalWorkExperienceSkills.find(
                (externalWorkExperienceSkill) => (
                    externalWorkExperienceSkill.ID === externalWorkExperienceSkills42.ID
                    && externalWorkExperienceSkill.workExperience_ID === externalWorkExperience1.ID
                    && externalWorkExperienceSkill.skill_ID === skillWithDescription1.ID
                    && externalWorkExperienceSkill.workExperience !== undefined
                    && externalWorkExperienceSkill.skill !== undefined
                ),
            ),
            'Expected externalWorkExperienceSkills22 with external work experience and skill details.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in external work experience with external work experience and skill details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=skill,workExperience');
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in the external work experience.'() {
        const response = await this.get(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const externalWorkExperienceSkills = response.data as ExternalWorkExperienceSkills;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            externalWorkExperienceSkills.ID === externalWorkExperienceSkills41.ID
            && externalWorkExperienceSkills.workExperience_ID === externalWorkExperience4.ID
            && externalWorkExperienceSkills.skill_ID === skillWithDescription1.ID,
            'Expected externalWorkExperienceSkills41.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in the external work experience without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in external work experience with external work experience and skill details.'() {
        const response = await this.get(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)?$expand=workExperience,skill`);
        this.responses.push(response);
        const externalWorkExperienceSkills = response.data as ExternalWorkExperienceSkills;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            externalWorkExperienceSkills.ID === externalWorkExperienceSkills41.ID
            && externalWorkExperienceSkills.workExperience_ID === externalWorkExperience4.ID
            && externalWorkExperienceSkills.skill_ID === skillWithDescription1.ID
            && externalWorkExperienceSkills.workExperience !== undefined
            && externalWorkExperienceSkills.skill !== undefined,
            'Expected externalWorkExperienceSkills41 with expertanl work experience and skill details.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in external work experience with external work experience and skill details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)?$expand=workExperience,skill`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill to a external work experience is allowed.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.create(createExternalWorkExperienceSkills);
        this.responses.push(response);
        const responseLevel = await this.update(`(ID=${createExternalWorkExperienceSkills.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: createExternalWorkExperienceSkills.proficiencyLevel_ID });
        this.responses.push(responseLevel);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseLevel.data.proficiencyLevelEditMode, 7, 'Expected value of proficiencyLevelEditMode is 7.');
        assert.equal(responseDraftActivate.status, 200, 'Assigning a skill to external work experience should be possible and expected status code should be 200(Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill to a external work experience is not allowed without authorization.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        this.responses.push(await this.create(createExternalWorkExperienceSkills));
        const responseDraftActivate = await this.activateDraftWithoutAuthorization(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 403, 'Expected status code should be 403 (Forbidden).');
        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing a skill to a external work experience is allowed.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, { skill_ID: skillWithDescription1.ID, proficiencyLevel_ID: setOneProficiencyLevel1.ID });
        this.responses.push(response);
        this.responses.push(await this.activateDraft(employeeHeaderWithDescription4.ID));
        assert.equal(response.status, 200, 'Changing a skill to external work experience should be possible and expected status code should be 200(OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing a skill to a external work experience is not allowed without authorization.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const updatePreviousSkillsUsedRecord = externalWorkExperienceSkills41;
        updatePreviousSkillsUsedRecord.skill_ID = skillWithDescription1.ID!;
        const response = await this.updateWithoutAuthorization(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, updatePreviousSkillsUsedRecord);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a skill to a external work experience is allowed.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.delete(`(ID=${createExternalWorkExperienceSkills.ID},IsActiveEntity=false)`);
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 200, 'Unassigning a skill to a external work experience is allowed.');
        assert.equal(response.status, 204, 'Unassigning a skill to external work experience should be possible and expected status code should be 204(No Content).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill with forbidden characters is not allowed.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const skillWithForbiddenCharacters = createExternalWorkExperienceSkills;
        skillWithForbiddenCharacters.skill_ID = '<script>';
        this.responses.push(await this.create(skillWithForbiddenCharacters));
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 400, 'Assigning a skill with forbidden characters is not allowed and expected status is 400(Bad Request)');
        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill as whitespace is not allowed.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const skillAsWhiteSpace = createExternalWorkExperienceSkills;
        skillAsWhiteSpace.skill_ID = '     ';
        this.responses.push(await this.create(skillAsWhiteSpace));
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 400, 'Assigning a skill as whitespace is not allowed and expected status is 400(Bad Request)');
        assert.equal(responseDraftActivate.data.error.message, 'There is an empty line in the Skills section of the project "projectName3". Select a skill or delete the line.', 'Expected error message is: There is an empty line in the Skills section of the project "projectName1".Select a skill or delete the line.');
        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a skill to a external work experience is not allowed without authorization.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.deleteWithoutAuthorization(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check that a proficiency level of a existing skill is changeable'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: setOneProficiencyLevel2.ID });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(response.status, 200, 'Expected status code should be 200 (OK)');
        assert.equal(response.data.proficiencyLevel_ID, setOneProficiencyLevel2.ID);

        await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)`, { proficiencyLevel_ID: setOneProficiencyLevel1.ID });
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check that default proficiency level is always possible'() {
        const defaultProficiencyLevelID = ProficiencyLevelRepository.defaultProficiencyLevelId;
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: defaultProficiencyLevelID });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(response.status, 200, 'Skill should have the default proficiency level,expected status code should be 200(Ok).');
        assert.equal(response.data.proficiencyLevel_ID, defaultProficiencyLevelID);

        this.responses.push(await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)`, { proficiencyLevel_ID: setOneProficiencyLevel1.ID }));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check that blank skill without an level is not possible'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: null });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);
        const activeExternalWorkExperience = await this.get(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=true)`);
        this.responses.push(activeExternalWorkExperience);

        assert.equal(response.status, 200, 'It should be possible to remove a proficiency level in draft mode, expected status code should be 200(OK)');
        assert.equal(responseDraftActivate.status, 400, 'It should be not possible to activate a skill without a proficiency level, expected status code should be 400(BAD REQUEST)');
        assert.equal(activeExternalWorkExperience.data.proficiencyLevel_ID, setOneProficiencyLevel1.ID, 'The proficiency level should be identical');

        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check if it is possible to choose a proficiency level from other proficiency set'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: setTwoProficiencyLevel1.ID });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(response.status, 200, 'It should be possible to create a externalWorkExperience draft with proficiency level from other set, expected status code should be 200(OK)');
        assert.equal(responseDraftActivate.status, 200, 'It should be possible to activate externalWorkExperience with proficiencyLevel from other skill, expected status code should be 200(OK)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check if it is possible to choose a non-existing proficiency level'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.update(`(ID=${externalWorkExperienceSkills41.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: uuid() });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);

        assert.equal(response.status, 200, 'It should be possible to create a externalWorkExperience draft with proficiency level from other set, expected status code should be 200(OK)');
        assert.equal(responseDraftActivate.status, 400, 'It should not be possible to activate externalWorkExperience with proficiencyLevel from other skill, expected status code should be 400(BAD REQUEST)');

        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));
    }
}
