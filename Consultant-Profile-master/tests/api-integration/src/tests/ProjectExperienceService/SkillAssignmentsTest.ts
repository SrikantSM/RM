import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { ProjectExperienceServiceRepository } from '../../utils/serviceRepository/ProjectExperienceService-Repository';
import {
    allEmail,
    allEmployeeHeaders,
    allWorkforcePerson,
    allPhone,
    allProfiles,
    allCostCenters,
    allWorkAssignment,
    allJobDetails,
    allProficiencySet,
    allProficiencyLevel,
    allSkills,
    allSkillAssignments,
    allExternalWorkExperience,
    allExternalWorkExperienceSkills,
    setOneProficiencyLevel1,
    setOneProficiencyLevel2,
    setTwoProficiencyLevel1,
    skillAssignmentWithDescription1,
    skillAssignmentWithDescription2,
    skillAssignmentWithDescription3,
    skillAssignmentWithDescription4,
    skillAssignmentWithDescription5,
    skillAssignmentWithDescription6,
    skillWithDescription1,
    skillWithDescription2,
    employeeHeaderWithDescription3,
    employeeHeaderWithDescription1,
    setTwoProficiencyLevel2,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { SkillAssignments } from '../../serviceEntities/projectExperienceService/SkillAssignments';
import { ProjectExperienceTestUtil } from './ProjectExperienceTestUtil';

@suite('ProjectExperienceService/SkillAssignments')
export class SkillAsssignmentsTest extends ProjectExperienceServiceRepository {
    readonly skillAssignmentID = 'b3a980c8-257e-429a-a8d3-f1c2c1695ed2';

    readonly skillAssignmentID2 = 'c3a980c8-257e-429a-a8d3-f1c2c1695ef2';

    readonly changedAt = new Date().toISOString().slice(0, 10);

    readonly changedBy = 'anonymous';

    public constructor() {
        super('$batch');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.emailRepository.insertMany(allEmail);
        await this.phoneRepository.insertMany(allPhone);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.proficiencyLevelRepository.insertMany(allProficiencyLevel);
        await this.skillRepository.insertMany(allSkills);
        await this.skillAssignmentRepository.insertMany(allSkillAssignments);
        await this.externalWorkExperienceRepository.insertMany(allExternalWorkExperience);
        await this.externalWorkExperienceSkillsRepository.insertMany(allExternalWorkExperienceSkills);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.emailRepository.deleteMany(allEmail);
        await this.phoneRepository.deleteMany(allPhone);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.skillAssignmentRepository.deleteMany(allSkillAssignments);
        await this.externalWorkExperienceRepository.deleteMany(allExternalWorkExperience);
        await this.externalWorkExperienceSkillsRepository.deleteMany(allExternalWorkExperienceSkills);
        await this.skillRepository.deleteMany(allSkills);
        await this.proficiencyLevelRepository.deleteMany(allProficiencyLevel);
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get all skill assignments.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('SkillAssignments');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualSkillAssignments = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true)) as SkillAssignments[];
        const expectedSkillAssignments1:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription1, skillWithDescription1, setOneProficiencyLevel1);
        const expectedSkillAssignments2:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription2, skillWithDescription1, setOneProficiencyLevel2);
        const expectedSkillAssignments3:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription3, skillWithDescription2, setTwoProficiencyLevel1);
        const expectedSkillAssignments4:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription4, skillWithDescription2, setTwoProficiencyLevel1);
        const expectedSkillAssignments5:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription5, skillWithDescription1, setOneProficiencyLevel1);
        const expectedSkillAssignments6:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription6, skillWithDescription2, setTwoProficiencyLevel1);
        const expectedSkillAssignments:SkillAssignments[] = [expectedSkillAssignments1, expectedSkillAssignments2, expectedSkillAssignments3, expectedSkillAssignments4, expectedSkillAssignments5, expectedSkillAssignments6];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(actualSkillAssignments.length, 6, 'Expected response to contain 5 SkillAssignments.');
        assert.isDefined(actualSkillAssignments, 'Expected a list of SkillAssignments.');
        expect(actualSkillAssignments).to.deep.include.any.members(expectedSkillAssignments);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`SkillAssignments(${skillAssignmentWithDescription1.ID})`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualSkillAssignment = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as SkillAssignments;
        const expectedSkillAssignment:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription1, skillWithDescription1, setOneProficiencyLevel1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(actualSkillAssignment, 'Expected a SkillAssignment.');
        expect(actualSkillAssignment).to.deep.equal(expectedSkillAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const actualSkillAssignment = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as SkillAssignments;
        skillAssignment.proficiencyLevelName = null;
        skillAssignment.skillName = null;
        skillAssignment.skillUsage = null;
        skillAssignment.changedAt = this.changedAt;
        skillAssignment.changedBy = this.changedBy;
        actualSkillAssignment.changedAt = actualSkillAssignment.changedAt?.slice(0, 10);
        expect(actualSkillAssignment).to.deep.equal(skillAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a non-unique skill assignment.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of profile ID, skill ID, and proficiency level ID is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a non-unique skill assignment.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of profile ID, skill ID, and proficiency level ID is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a non-unique skill assignment.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of profile ID, skill ID, and proficiency level ID is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with a profile ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, this.skillAssignmentID2, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered profile ID does not exist.');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with a profile ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, this.skillAssignmentID2, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered profile ID does not exist.');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with a profile ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, this.skillAssignmentID2, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered profile ID does not exist.');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with a skill ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, this.skillAssignmentID2, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered skill ID does not exist.');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with a skill ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, this.skillAssignmentID2, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered skill ID does not exist.');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with a skill ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, this.skillAssignmentID2, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered skill ID does not exist.');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with a proficiency level ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, this.skillAssignmentID2);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered proficiency level ID does not exist.');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with a proficiency level ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, this.skillAssignmentID2);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered proficiency level ID does not exist.');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with a proficiency level ID that does not exist.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, this.skillAssignmentID2);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered proficiency level ID does not exist.');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with missing profile ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, undefined, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with missing profile ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, undefined, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with missing profile ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, undefined, skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with missing skill ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, undefined, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'skillID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with missing skill ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, undefined, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'skillID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with missing skill ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, undefined, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'skillID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with missing proficiency level ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'proficiencyLevelID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with missing proficiency level ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'proficiencyLevelID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with missing proficiency level ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'proficiencyLevelID\' in entity \'ProjectExperienceService.SkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with non-guid profile ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, 'notaguid', skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with non-guid profile ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, 'notaguid', skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with non-guid profile ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, 'notaguid', skillWithDescription2.ID, setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with non-guid skill ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, 'notaguid', setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'skillID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with non-guid skill ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, 'notaguid', setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'skillID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with non-guid skill ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, 'notaguid', setTwoProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'skillID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment with non-guid proficiency level ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, 'notaguid');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'proficiencyLevelID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment with non-guid proficiency level ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, 'notaguid');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'proficiencyLevelID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment with non-guid proficiency level ID.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription2.ID, 'notaguid');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'proficiencyLevelID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a skill assignment when draft exists.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription1.ID, skillWithDescription2.ID, setTwoProficiencyLevel2.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'SkillAssignments', JSON.stringify(skillAssignment));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the skill.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment when draft exists.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription1.ID, skillWithDescription2.ID, setTwoProficiencyLevel2.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the skill.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment when draft exists.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription1.ID, skillWithDescription2.ID, setTwoProficiencyLevel2.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the skill.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete a skill assignment when draft exists.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `SkillAssignments(${skillAssignmentWithDescription1.ID})`, '{}');
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the skill.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a skill assignment.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID, employeeHeaderWithDescription3.ID, skillWithDescription1.ID, setOneProficiencyLevel2.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `SkillAssignments(${this.skillAssignmentID})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '200 OK');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID, employeeHeaderWithDescription3.ID, skillWithDescription1.ID, setOneProficiencyLevel2.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '200 OK');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a skill assignment to create it.'() {
        const skillAssignment = ProjectExperienceTestUtil.prepareSkillAssignmentsRequestBody(this.skillAssignmentID2, employeeHeaderWithDescription3.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `SkillAssignments(${this.skillAssignmentID2})`, JSON.stringify(skillAssignment));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete a skill assignment.'() {
        let requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `SkillAssignments(${this.skillAssignmentID})`, '{}');
        let response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '204 No Content');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `SkillAssignments(${this.skillAssignmentID2})`, '{}');
        response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '204 No Content');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete a skill assignment that does not exist.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', 'SkillAssignments(b3a980c8-257e-429a-a8d3-f1c2c1695007)', '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '404 Not Found');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }
}
