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
    externalWorkExperienceSkills11,
    setOneProficiencyLevel1,
    skillWithDescription1,
    externalWorkExperienceSkills31,
    externalWorkExperience3,
    employeeHeaderWithDescription1,
    externalWorkExperience2,
    employeeHeaderWithDescription2,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProjectExperienceTestUtil } from './ProjectExperienceTestUtil';
import { ExternalWorkExperienceSkillAssignments } from '../../serviceEntities/projectExperienceService';

@suite('ProjectExperienceService/ExternalWorkExperienceSkillAssignments')
export class ExternalWorkExperienceSkillAssignmentsTest extends ProjectExperienceServiceRepository {
    readonly externalWorkExperienceSkillAssignmentID = 'b3a980c8-257e-429a-a8d3-f1c2c1695ed2';

    readonly externalWorkExperienceSkillAssignmentID2 = 'c3a980c8-257e-429a-a8d3-f1c2c1695ef2';

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
    async 'Get all external work experience skill assignments.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('ExternalWorkExperienceSkillAssignments');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualExternalWorkExperienceSkillAssignments = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true)) as ExternalWorkExperienceSkillAssignments[];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(actualExternalWorkExperienceSkillAssignments.length, 5, 'Expected response to contain 5 ExternalWorkExperienceSkillAssignments.');
        assert.isDefined(actualExternalWorkExperienceSkillAssignments, 'Expected a list of ExternalWorkExperienceSkillAssignments.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get an external work experience skill assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`ExternalWorkExperienceSkillAssignments(${externalWorkExperienceSkills31.ID})`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualExternalWorkExperienceSkillAssignment = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as ExternalWorkExperienceSkillAssignments;
        const expectedExternalWorkExperienceSkillAssignment:ExternalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignments(externalWorkExperience3, externalWorkExperienceSkills31, skillWithDescription1, setOneProficiencyLevel1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(actualExternalWorkExperienceSkillAssignment, 'Expected a expectedExternalWorkExperienceSkillAssignment.');
        expect(actualExternalWorkExperienceSkillAssignment).to.deep.equal(expectedExternalWorkExperienceSkillAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const actualExternalWorkExperienceSkillAssignments = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as ExternalWorkExperienceSkillAssignments;
        externalWorkExperienceSkillAssignments.proficiencyLevelName = null;
        externalWorkExperienceSkillAssignments.skillName = null;
        externalWorkExperienceSkillAssignments.skillUsage = null;
        externalWorkExperienceSkillAssignments.changedAt = this.changedAt;
        externalWorkExperienceSkillAssignments.changedBy = this.changedBy;
        actualExternalWorkExperienceSkillAssignments.changedAt = actualExternalWorkExperienceSkillAssignments.changedAt?.slice(0, 10);
        expect(actualExternalWorkExperienceSkillAssignments).to.deep.equal(externalWorkExperienceSkillAssignments);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a non-unique external work experience skill assignment.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of work experience ID, profile ID, skill ID, and proficiency level ID is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a non-unique external work experience skill assignment.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of work experience ID, profile ID, skill ID, and proficiency level ID is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a non-unique external work experience skill assignment.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of work experience ID, profile ID, skill ID, and proficiency level ID is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with a external work experience ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, this.externalWorkExperienceSkillAssignmentID2, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered external work experience ID does not exist.');
        assert.equal(errorResponse.error.target, 'externalWorkExperienceID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience skill assignment with a external work experience ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, this.externalWorkExperienceSkillAssignmentID2, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered external work experience ID does not exist.');
        assert.equal(errorResponse.error.target, 'externalWorkExperienceID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience skill assignment with a external work experience ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, this.externalWorkExperienceSkillAssignmentID2, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered external work experience ID does not exist.');
        assert.equal(errorResponse.error.target, 'externalWorkExperienceID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with a profile ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, this.externalWorkExperienceSkillAssignmentID2, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Update an external work experience skill assignment with a profile ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, this.externalWorkExperienceSkillAssignmentID2, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Upsert an external work experience skill assignment with a profile ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, this.externalWorkExperienceSkillAssignmentID2, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Create an external work experience skill assignment with a skill ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, this.externalWorkExperienceSkillAssignmentID2, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Update an external work experience skill assignment with a skill ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, this.externalWorkExperienceSkillAssignmentID2, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Upsert an external work experience skill assignment with a skill ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, this.externalWorkExperienceSkillAssignmentID2, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Create an external work experience skill assignment with a proficiency level ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, this.externalWorkExperienceSkillAssignmentID2);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Update an external work experience skill assignment with a proficiency level ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, this.externalWorkExperienceSkillAssignmentID2);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Upsert an external work experience skill assignment with a proficiency level ID that does not exist.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, this.externalWorkExperienceSkillAssignmentID2);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
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
    async 'Create an external work experience skill assignment with missing external work experience ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, undefined, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'externalWorkExperienceID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'externalWorkExperienceID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with missing external work experience ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, undefined, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'externalWorkExperienceID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'externalWorkExperienceID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with missing external work experience ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, undefined, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'externalWorkExperienceID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'externalWorkExperienceID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with missing profile ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, undefined, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with missing profile ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, undefined, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with missing profile ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, undefined, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with missing skill ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, undefined, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'skillID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with missing skill ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, undefined, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'skillID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with missing skill ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, undefined, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'skillID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'skillID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with missing proficiency level ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'proficiencyLevelID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with missing proficiency level ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'proficiencyLevelID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with missing proficiency level ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'proficiencyLevelID\' in entity \'ProjectExperienceService.ExternalWorkExperienceSkillAssignments\' is required');
        assert.equal(errorResponse.error.target, 'proficiencyLevelID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with a non-guid external work experience ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, 'notaguid', employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'externalWorkExperienceID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with a non-guid external work experience ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, 'notaguid', employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'externalWorkExperienceID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with a non-guid external work experience ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, 'notaguid', employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'externalWorkExperienceID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with a non-guid profile ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, 'notaguid', skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with a non-guid profile ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, 'notaguid', skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with a non-guid profile ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, 'notaguid', skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with a non-guid skill ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, 'notaguid', setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'skillID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with a non-guid skill ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, 'notaguid', setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'skillID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with a non-guid skill ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, 'notaguid', setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'skillID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment with a non-guid proficiency level ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, 'notaguid');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'proficiencyLevelID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a external work experience skill assignment with a non-guid proficiency level ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, 'notaguid');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'proficiencyLevelID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a external work experience skill assignment with a non-guid proficiency level ID.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, 'notaguid');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'proficiencyLevelID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience skill assignment when draft exists.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperienceSkillAssignments', JSON.stringify(externalWorkExperienceSkillAssignments));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience skill assignment.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience skill assignment when draft exists.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience skill assignment.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience skill assignment when draft exists.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience skill assignment.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience skill assignment when draft exists.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `ExternalWorkExperienceSkillAssignments(${externalWorkExperienceSkills11.ID})`, '{}');
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience skill assignment.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience skill assignment.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID, externalWorkExperience2.ID, employeeHeaderWithDescription1.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '200 OK');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience skill assignment.'() {
        const externalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignmentsRequestBody(this.externalWorkExperienceSkillAssignmentID2, externalWorkExperience3.ID, employeeHeaderWithDescription2.ID, skillWithDescription1.ID, setOneProficiencyLevel1.ID);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, JSON.stringify(externalWorkExperienceSkillAssignments));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience skill assignment.'() {
        let requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID})`, '{}');
        let response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '204 No Content');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `ExternalWorkExperienceSkillAssignments(${this.externalWorkExperienceSkillAssignmentID2})`, '{}');
        response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '204 No Content');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience skill assignment that does not exist.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', 'ExternalWorkExperienceSkillAssignments(b3a980c8-257e-429a-a8d3-f1c2c1695007)', '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '404 Not Found');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }
}
