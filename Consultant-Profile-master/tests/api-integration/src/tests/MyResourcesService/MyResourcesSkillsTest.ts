import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { v4 as uuid } from 'uuid';
import {
    SkillAssignment,
    Skill,
    WorkforcePerson,
    Email,
    Phone,
    ProfileDetail,
    JobDetail,
    ResourceOrganizations,
    WorkAssignment,
    CostCenter, ProficiencyLevel,
    CostCenterAttribute,
} from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmployeeHeaders,
    allSkills,
    allSkillAssignments,
    employeeHeaderWithDescription4,
    skillAssignmentWithDescription6,
    skillAssignmentWithDescription5,
    allEmail,
    allWorkforcePerson,
    skillWithDescription1,
    skillWithDescription2,
    email5,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allJobDetails,
    allCostCenters,
    phone5,
    profileDetail5,
    jobDetail8,
    workAssignment4,
    resourceOrganization1,
    costCenter1,
    allProficiencySet,
    allProficiencyLevel,
    setOneProficiencyLevel1,
    setTwoProficiencyLevel1,
    skillWithDescription3,
    setTwoProficiencyLevel2,
    workforcePersonWithDescription3,
    setFourProficiencyLevel1,
    setThreeProficiencyLevel1,
    email2,
    allResourceOrganizations,
    allResourceOrganizationItems,
    costCenterAttribute1,
    allCostCenterAttributes,
} from '../../data';
import { createSkill, deleteSkill } from '../../data/service/myResourcesService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { Skills } from '../../serviceEntities/myProjectExperienceService/Skills';
import { SkillMasterList } from '../../serviceEntities/myProjectExperienceService/SkillMasterList';
import { MyProjectExperienceHeader } from '../../serviceEntities/myProjectExperienceService/MyProjectExperienceHeader';
import { ProfileData } from '../../serviceEntities/myProjectExperienceService/ProfileData';

@suite('MyResourcesService/Skills')
export class MyResourcesSkillsTest extends MyResourcesServiceRepository {
    public constructor() { super('Skills'); }

    @timeout(TEST_TIMEOUT * 2)
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
        await this.skillAssignmentRepository.insertMany(allSkillAssignments);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.insertMany(allCostCenterAttributes);
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
        await this.skillAssignmentRepository.deleteMany(allSkillAssignments);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.deleteMany(allCostCenterAttributes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned skills of consultants.'() {
        const response = await this.get();
        this.responses.push(response);
        const consultantSkills = response.data.value as Skills[];
        const expectedConsultantSkills = this.prepareExpected([skillAssignmentWithDescription5, skillAssignmentWithDescription6]);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantSkills, 'Expected a list assigned skills.');
        assert.isTrue(consultantSkills.length >= 2, 'Expected at least 2 assigned skills');
        expect(consultantSkills).to.deep.include.any.members(expectedConsultantSkills);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned skills of consultants without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    // TODO Check if expand on assigned skills is possible with proficiency level
    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned skills of consultants with skill and consultant details.'() {
        const response = await this.get('?$expand=skill,employee,profile,proficiencyLevel');
        this.responses.push(response);
        const consultantSkills = response.data.value as SkillMasterList[];
        const expectedConsultantSkills = this.prepareExpected(
            [skillAssignmentWithDescription5, skillAssignmentWithDescription6],
            [skillWithDescription1, skillWithDescription2],
            {
                workforcePerson: workforcePersonWithDescription3,
                email: email5,
                phone: phone5,
                profileDetail: profileDetail5,
                jobDetail: jobDetail8,
                managerWorkAssignment: workAssignment4,
                resourceOrganization: resourceOrganization1,
                costCenter: costCenter1,
                costCenterAttribute: costCenterAttribute1,
            },
            [setOneProficiencyLevel1, setTwoProficiencyLevel1],
        );

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantSkills, 'Expected a list assigned skills.');
        assert.isTrue(consultantSkills.length >= 2, 'Expected at least 2 assigned skills');
        expect(consultantSkills).to.deep.include.any.members(expectedConsultantSkills);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Select a list of all assigned skills of consultants with skill details.'() {
        const response = await this.get('?$select=ID,IsActiveEntity,employee_ID,skill_ID&$expand=skill($select=ID,name,lifecycleStatus_code)');
        this.responses.push(response);
        const consultantSkills = response.data.value as SkillMasterList[];
        const expectedConsultantSkills = this.prepareSelectExpected(
            [skillAssignmentWithDescription5, skillAssignmentWithDescription6],
            [skillWithDescription1, skillWithDescription2],
        );
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantSkills, 'Expected a list assigned skills.');
        assert.isTrue(consultantSkills.length >= 2, 'Expected atleast 2 assigned skills');
        expect(consultantSkills).to.deep.include.any.members(expectedConsultantSkills);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned skills of consultants with skill and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=skill,employee,profile');
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Draft flow on assigning a skill to a consultant without passing level ID.'() {
        const emptyData = {};

        const responseDraftEditCreate = await this.enableDraftEdit(createSkill.employee_ID);
        this.responses.push(responseDraftEditCreate);

        const responseDraftCreate = await this.createDraftEmptyData(employeeHeaderWithDescription4.ID, 'skills', emptyData);
        this.responses.push(responseDraftCreate);

        const responseDraftPatch = await this.update(`(ID=${responseDraftCreate.data.ID},IsActiveEntity=false)`, { skill_ID: skillWithDescription3.ID });
        this.responses.push(responseDraftPatch);

        const responseDraftActivate = await this.activateDraft(createSkill.employee_ID);
        this.responses.push(responseDraftActivate);

        const responseGet = await this.get(`(ID=${responseDraftCreate.data.ID},IsActiveEntity=true)`);
        this.responses.push(responseGet);

        // const responseDraftEditDelete = await this.enableDraftEdit(createSkill.employee_ID);
        // this.responses.push(responseDraftEditDelete);

        const responseDelete = await this.delete(`(ID=${responseDraftCreate.data.ID},IsActiveEntity=false)`);
        this.responses.push(responseDelete);

        const reponseDraftActivateDelete = await this.activateDraft(createSkill.employee_ID);
        this.responses.push(reponseDraftActivateDelete);

        assert.equal(responseDraftCreate.status, 201, 'Expected status code for draft create should be 201(Created).');
        assert.equal(responseDraftPatch.status, 200, 'Expected status code for draft patch should be 200(Ok).');
        assert.equal(responseDraftActivate.status, 400, 'Expected status code for draft activate should be 400(Bad Request).');
        assert.equal(responseGet.status, 404, 'Expected status code to get list of skills should be 404(Not Found).');
        assert.equal(responseDelete.status, 204, 'Expected status code for delete should be 204(No Content).');
        assert.equal(reponseDraftActivateDelete.status, 200, 'Expected status code draft activate after delete should be 200(Ok).');

        assert.equal(responseDraftCreate.data.proficiencyLevelEditMode, 1, 'Expected value of proficiencyLevelEditMode is 1.');
        assert.equal(responseDraftCreate.data.proficiencyLevel_ID, null, 'Expected value of proficiencyLevel_ID is null.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill to a consultant.'() {
        this.responses.push(await this.enableDraftEdit(createSkill.employee_ID));
        this.responses.push(await this.create(createSkill));
        const responseDraftActivate = await this.activateDraft(createSkill.employee_ID);
        this.responses.push(responseDraftActivate);
        assert.equal(responseDraftActivate.status, 200, 'Error in assigning a skill to consultant, expected status code should be 200(Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill to a consultant without authorization.'() {
        this.responses.push(await this.enableDraftEdit(createSkill.employee_ID));
        this.responses.push(await this.create(createSkill));
        const responseDraftActivate = await this.activateDraftWithoutAuthorization(createSkill.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(createSkill.employee_ID));

        assert.equal(responseDraftActivate.status, 403, 'Expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a duplicate skill to a consultant should not be allowed.'() {
        const duplicateSkillAssignment: Skills = {
            ID: uuid(),
            employee_ID: employeeHeaderWithDescription4.ID,
            skill_ID: skillWithDescription1.ID,
        };
        this.responses.push(await this.enableDraftEdit(duplicateSkillAssignment.employee_ID));
        this.responses.push(await this.create(duplicateSkillAssignment));
        const responseDraftActivate = await this.activateDraft(duplicateSkillAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(duplicateSkillAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning Duplicate Skill is not allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a no skill to a consultant should not be allowed.'() {
        const noSkillAssignment: Skills = {
            ID: uuid(),
            employee_ID: skillAssignmentWithDescription6.employee_ID,
        };
        this.responses.push(await this.enableDraftEdit(noSkillAssignment.employee_ID));
        this.responses.push(await this.create(noSkillAssignment));
        const responseDraftActivate = await this.activateDraft(noSkillAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(noSkillAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assign a no skill to a consultant should not be allowed., expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a skill having skill_ID as whitesSpaces only to a consultant should not be allowed.'() {
        const whiteSpacesSkillAssignment: Skills = {
            ID: uuid(),
            skill_ID: '    ',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(whiteSpacesSkillAssignment.employee_ID));
        this.responses.push(await this.create(whiteSpacesSkillAssignment));
        const responseDraftActivate = await this.activateDraft(whiteSpacesSkillAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(whiteSpacesSkillAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assign a skill having skill_ID as whitesSpaces only to a consultant should not be allowed., expected status code should be 400(Bad Request).');
        assert.equal(responseDraftActivate.data.error.message, 'Select a skill or delete the line.', 'Expected error message is "There is an empty line in the Skills section.Select a skill or delete the line."');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a blank skill to a consultant should not be allowed.'() {
        const blankSkillAssignment: Skills = {
            ID: uuid(),
            skill_ID: '',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(blankSkillAssignment.employee_ID));
        this.responses.push(await this.create(blankSkillAssignment));
        const responseDraftActivate = await this.activateDraft(blankSkillAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(blankSkillAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a Blank Skill is not allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a non-existing skill to a consultant should not be allowed.'() {
        const nonExistingSkillAssignment: Skills = {
            ID: uuid(),
            skill_ID: uuid(),
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(nonExistingSkillAssignment.employee_ID));
        this.responses.push(await this.create(nonExistingSkillAssignment));
        const responseDraftActivate = await this.activateDraft(nonExistingSkillAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(nonExistingSkillAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a non-existing Skill is not allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a skill of non-guid to a consultant should not be allowed.'() {
        const nonGuidSkillAssignment: Skills = {
            ID: uuid(),
            skill_ID: 'randomSkillLabelID',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(nonGuidSkillAssignment.employee_ID));
        this.responses.push(await this.create(nonGuidSkillAssignment));
        const responseDraftActivate = await this.activateDraft(nonGuidSkillAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(nonGuidSkillAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a non-guid Skill is not allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a invalid skillID as more than 30 character skill to a consultant should not be allowed.'() {
        const moreThan30CharacterSkillAssignment: Skills = {
            ID: uuid(),
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(moreThan30CharacterSkillAssignment.employee_ID));
        this.responses.push(await this.create(moreThan30CharacterSkillAssignment));
        const responseDraftCreate = await this.update(`(ID='${moreThan30CharacterSkillAssignment.ID}',IsActiveEntity=false)`, { skill_ID: 'randomStringrandomStringrandomStringrandomStringrandomString' });
        this.responses.push(responseDraftCreate);
        this.responses.push(await this.deleteDraft(moreThan30CharacterSkillAssignment.employee_ID));

        assert.equal(responseDraftCreate.status, 400, 'Assign a invalid skillID as more than 30 character skill to a consultant should not be allowed., expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned skill to a consultant.'() {
        const response = await this.get(`(ID=${createSkill.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const consultantSkill = response.data;
        delete consultantSkill['@context'];
        delete consultantSkill['@metadataEtag'];
        consultantSkill.modifiedAt = null;
        consultantSkill.modifiedBy = null;
        consultantSkill.createdAt = null;
        consultantSkill.createdBy = null;
        const expectedConsultantSkill = this.prepareExpected([createSkill as SkillAssignment]);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantSkill, 'Expected previously assigned skill.');
        expect(consultantSkill).to.eql(expectedConsultantSkill[0]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned skill to a consultant without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned skill to a consultant with skill and consultant details.'() {
        const response = await this.get(`(ID=${createSkill.ID},IsActiveEntity=true)?$expand=skill,employee,profile,proficiencyLevel`);
        this.responses.push(response);
        const consultantSkill = response.data;
        delete consultantSkill['@context'];
        delete consultantSkill['@metadataEtag'];
        consultantSkill.modifiedAt = null;
        consultantSkill.modifiedBy = null;
        console.log(consultantSkill);
        consultantSkill.createdAt = null;
        consultantSkill.employee.modifiedAt = null;
        consultantSkill.employee.modifiedBy = null;
        const expectedConsultantSkill = this.prepareExpected(
            [createSkill as SkillAssignment],
            [skillWithDescription3],
            {
                workforcePerson: workforcePersonWithDescription3,
                email: email5,
                phone: phone5,
                profileDetail: profileDetail5,
                jobDetail: jobDetail8,
                managerWorkAssignment: workAssignment4,
                resourceOrganization: resourceOrganization1,
                costCenter: costCenter1,
                costCenterAttribute: costCenterAttribute1,
            },
            [setThreeProficiencyLevel1],
        );
        expectedConsultantSkill[0].createdBy = email2.address;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantSkill, 'Expected previously assigned skill.');
        expect(consultantSkill).to.eql(expectedConsultantSkill[0]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned skill to a consultant with skill and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=true)?$expand=employee,skill,proficiencyLevel`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the assigned skill of a consultant.'() {
        this.responses.push(await this.enableDraftEdit(createSkill.employee_ID));
        const response = await this.update(`(ID=${createSkill.ID},IsActiveEntity=false)`, createSkill);
        this.responses.push(response);

        assert.equal(response.status, 200, 'Updating/Changing assigned skill of a consultant.');
        assert.equal(response.data.proficiencyLevelEditMode, 7, 'Expected value of proficiencyLevelEditMode is 1.');
        this.responses.push(await this.activateDraft(createSkill.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a skill from a consultant.'() {
        this.responses.push(await this.enableDraftEdit(deleteSkill.employee_ID));
        const responseDeleteSkill = await this.delete(`(ID=${deleteSkill.ID},IsActiveEntity=false)`);
        this.responses.push(responseDeleteSkill);
        const responseDraftActivate = await this.activateDraft(deleteSkill.employee_ID);
        this.responses.push(responseDraftActivate);
        const responseTrue = await this.get(`(ID=${deleteSkill.ID},IsActiveEntity=true)`);
        this.responses.push(responseTrue);
        const responseFalse = await this.get(`(ID=${deleteSkill.ID},IsActiveEntity=false)`);
        this.responses.push(responseFalse);
        const response = await this.get();
        this.responses.push(response);
        const consultantSkills = response.data.value as Skills[];
        const expectedConsultantSkills = this.prepareExpected([skillAssignmentWithDescription5, skillAssignmentWithDescription6]);
        consultantSkills.forEach((expectedConsultantSkill, i) => {
            consultantSkills[i].modifiedAt = null!;
            const localExpectedConsultantSkill = expectedConsultantSkill;
            localExpectedConsultantSkill.modifiedBy = email5.address;
        });
        expectedConsultantSkills.forEach((expectedConsultantSkill) => {
            const localExpectedConsultantSkill = expectedConsultantSkill;
            localExpectedConsultantSkill.modifiedBy = email5.address;
        });
        this.responses.push(await this.deleteDraft(deleteSkill.employee_ID));
        assert.equal(responseDeleteSkill.status, 204, 'Expected the unassignment a skill to a consultant, expected status code should be 204 (No Content).');
        assert.equal(responseDraftActivate.status, 200, 'Error in unassigning a skill to consultant, expected status code should be 200(Ok).');
        assert.equal(responseTrue.status, 404, 'Unexpected the unassigned skill of consultant, expected status code should be 404 (Not Found).');
        assert.equal(responseFalse.status, 404, 'Unexpected the unassigned skill of consultant, expected status code should be 404 (Not Found).');
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantSkills, 'Expected a list assigned skills.');
        assert.isTrue(consultantSkills.length >= 2, 'Expected atleast one Profile');
        expect(consultantSkills).to.deep.include.any.members(expectedConsultantSkills);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a skill from a consultant without authorization.'() {
        this.responses.push(await this.enableDraftEdit(deleteSkill.employee_ID));
        const responseDeleteSkill = await this.deleteWithoutAuthorization(`(ID=${deleteSkill.ID},IsActiveEntity=false)`);
        this.responses.push(responseDeleteSkill);
        const responseDraftActivate = await this.activateDraftWithoutAuthorization(deleteSkill.employee_ID);
        this.responses.push(responseDraftActivate);
        const responseTrue = await this.get(`(ID=${deleteSkill.ID},IsActiveEntity=true)`);
        this.responses.push(responseTrue);
        const responseFalse = await this.get(`(ID=${deleteSkill.ID},IsActiveEntity=false)`);
        this.responses.push(responseFalse);
        this.responses.push(await this.deleteDraft(deleteSkill.employee_ID));

        assert.equal(responseDeleteSkill.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(responseDraftActivate.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(responseTrue.status, 404, 'Unexpected the unassigned skill of consultant, expected status code should be 404 (Not Found).');
        assert.equal(responseFalse.status, 404, 'Unexpected the unassigned skill of consultant, expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check that a proficiency level of a existing skill is changeable'() {
        this.responses.push(await this.enableDraftEdit(skillAssignmentWithDescription6.employee_ID));
        const response = await this.update(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: setTwoProficiencyLevel2.ID });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(skillAssignmentWithDescription6.employee_ID);
        this.responses.push(responseDraftActivate);
        const activatedSkill = await this.get(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=true)`);
        this.responses.push(activatedSkill);

        assert.equal(response.status, 200, 'Expected status code should be 200 (OK)');
        assert.equal(activatedSkill.data.proficiencyLevel_ID, setTwoProficiencyLevel2.ID, 'Expected proficiency level should be setOneProficiencyLevel2');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check that blank skill without an level is not possible'() {
        this.responses.push(await this.enableDraftEdit(skillAssignmentWithDescription6.employee_ID));
        const response = await this.update(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=false)`, { proficiencyLevel_ID: null });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(skillAssignmentWithDescription6.employee_ID);
        this.responses.push(responseDraftActivate);
        const activeSkill = await this.get(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=true)`);
        this.responses.push(activeSkill);
        this.responses.push(await this.deleteDraft(skillAssignmentWithDescription6.employee_ID));
        assert.equal(response.status, 200, 'It should be possible to remove a proficiency level in draft mode, expected status code should be 200(OK)');
        assert.equal(responseDraftActivate.status, 400, 'It should be not possible to activate a skill without a proficiency level, expected status code should be 400(BAD REQUEST)');
        assert.equal(activeSkill.data.proficiencyLevel_ID, setTwoProficiencyLevel2.ID, 'The proficiency level should be identical');

        this.responses.push(await this.update(`(ID=${skillAssignmentWithDescription6.ID},IsActiveEntity=true)`, { proficiencyLevel_ID: setTwoProficiencyLevel1.ID }));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check if it is possible to choose a proficiency level from other proficiency set'() {
        this.responses.push(await this.enableDraftEdit(skillAssignmentWithDescription5.employee_ID));
        const getSkill = await this.get(`(ID=${skillAssignmentWithDescription5.ID},IsActiveEntity=true)?$expand=skill,employee,profile,proficiencyLevel`);
        this.responses.push(getSkill);
        const newSkill = { proficiencyLevel_ID: setFourProficiencyLevel1.ID, ...getSkill.data };
        const response = await this.update(`(ID=${getSkill.data.ID},IsActiveEntity=false)`, newSkill);
        this.responses.push(response);
        const skillAfterUpdate = await this.get(`(ID=${skillAssignmentWithDescription5.ID},IsActiveEntity=true)?$expand=skill,employee,profile,proficiencyLevel`);
        this.responses.push(skillAfterUpdate);
        const activatedSkill = await this.get(`(ID=${skillAssignmentWithDescription5.ID},IsActiveEntity=true)`);
        this.responses.push(activatedSkill);
        assert.equal(response.status, 400, 'It should be not possible to persist a skill with proficiency level from other set, expected status code should be 400(BAD REQUEST)');
        assert.equal(activatedSkill.data.proficiencyLevel_ID, getSkill.data.proficiencyLevel_ID, 'The proficiency level should be identical');

        this.responses.push(await this.deleteDraft(skillAssignmentWithDescription5.employee_ID));
    }

    private prepareExpected(assignedConsultantSkills: SkillAssignment[], skill?: Skill[], profile?: { workforcePerson: WorkforcePerson, email: Email, phone: Phone, profileDetail: ProfileDetail, jobDetail: JobDetail, managerWorkAssignment: WorkAssignment, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute }, proficiencyLevel?: ProficiencyLevel[]) {
        const expectedConsultantSkills: Skills[] = [];
        assignedConsultantSkills.forEach((assignedConsultantSkill, i) => {
            const expectedConsultantSkill: Skills = this.prepareExpectedAssignedSkills(assignedConsultantSkill);
            if (skill !== undefined && profile !== undefined && proficiencyLevel !== undefined) {
                expectedConsultantSkill.skill = this.skillToSkillMasterList(skill[i]);
                expectedConsultantSkill.employee = this.prepareEmployee(assignedConsultantSkill.employee_ID);
                expectedConsultantSkill.profile = this.prepareProfile(profile);
                expectedConsultantSkill.proficiencyLevel = this.prepareProficiencyLevel(proficiencyLevel[i]);
            }
            expectedConsultantSkills.push(expectedConsultantSkill);
        });
        return expectedConsultantSkills;
    }

    private prepareExpectedAssignedSkills(assignedSkill: SkillAssignment) {
        const skills: Skills = {
            ID: assignedSkill.ID,
            HasActiveEntity: false,
            HasDraftEntity: false,
            IsActiveEntity: true,
            createdAt: null!,
            createdBy: null!,
            proficiencyLevelEditMode: 7,
            employee_ID: assignedSkill.employee_ID,
            modifiedAt: null!,
            modifiedBy: null!,
            skill_ID: assignedSkill.skill_ID,
            proficiencyLevel_ID: assignedSkill.proficiencyLevel_ID,
        };
        return skills;
    }

    private prepareProficiencyLevel(proficiencyLevel: ProficiencyLevel) {
        const newProficiencyLevel: ProficiencyLevel = {
            ID: proficiencyLevel.ID!,
            name: proficiencyLevel.name!,
            description: proficiencyLevel.description!,
            proficiencySet_ID: proficiencyLevel.proficiencySet_ID!,
            rank: proficiencyLevel.rank!,
        };
        return newProficiencyLevel;
    }

    private prepareEmployee(employeeID: string) {
        const employee: MyProjectExperienceHeader = {
            ID: employeeID,
            commaSeparatedSkills: null!,
            commaSeparatedRoles: null!,
            HasActiveEntity: false,
            HasDraftEntity: false,
            IsActiveEntity: true,
            createdAt: null!,
            createdBy: null!,
            modifiedAt: null!,
            modifiedBy: null!,
        };
        return employee;
    }

    private prepareProfile(profile: { workforcePerson: WorkforcePerson, email: Email, phone: Phone, profileDetail: ProfileDetail, jobDetail: JobDetail, managerWorkAssignment: WorkAssignment, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute }) {
        const preparedProfile: ProfileData = {
            ID: profile.workforcePerson.ID,
            dataSubjectRole: 'Project Team Member',
            workerExternalID: profile.workforcePerson.externalID,
            emailAddress: profile.email.address,
            profilePhotoURL: null!,
            firstName: null!,
            lastName: null!,
            initials: null!,
            mobilePhoneNumber: null!,
            name: null!,
            role: profile.jobDetail.jobTitle,
            managerExternalID: profile.managerWorkAssignment.externalID,
            officeLocation: 'Germany',
            resourceOrg: `${profile.resourceOrganization.name} (${profile.resourceOrganization.displayId})`,
            resourceOrgId: profile.resourceOrganization.displayId,
            costCenterDescription: profile.costCenterAttribute.description,
            costCenter: profile.costCenter.costCenterID,
            isContingentWorker: false,
            fullName: null!,
        };
        return preparedProfile;
    }

    private prepareSelectExpected(assignedConsultantSkills: SkillAssignment[], skill?: Skill[]) {
        const expectedConsultantSkills: Skills[] = [];
        assignedConsultantSkills.forEach((assignedConsultantSkill, i) => {
            const expectedConsultantSkill: Skills = this.prepareSelectAssignedSkills(assignedConsultantSkill);
            if (skill !== undefined) {
                expectedConsultantSkill.skill = this.selectSkill(skill[i]);
            }
            expectedConsultantSkills.push(expectedConsultantSkill);
        });
        return expectedConsultantSkills;
    }

    private prepareSelectAssignedSkills(assignedSkill: SkillAssignment) {
        const skills: Skills = {
            ID: assignedSkill.ID,
            IsActiveEntity: true,
            employee_ID: assignedSkill.employee_ID,
            skill_ID: assignedSkill.skill_ID,
        };
        return skills;
    }

    private skillToSkillMasterList(skill: Skill) {
        const skillMasterList: SkillMasterList = {
            ID: skill.ID!,
            name: skill.name!,
            description: skill.description!,
            lifecycleStatus_code: skill.lifecycleStatus_code,
            commaSeparatedAlternativeLabels: null!,
            proficiencySet_ID: skill.proficiencySet_ID,
        };
        return skillMasterList;
    }

    private selectSkill(skill: Skill) {
        const skillMasterList: SkillMasterList = {
            ID: skill.ID!,
            name: skill.name!,
            lifecycleStatus_code: skill.lifecycleStatus_code,
        };
        return skillMasterList;
    }
}
