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
    externalWorkExperience1,
    externalWorkExperience2,
    externalWorkExperience3,
    externalWorkExperience4,
    employeeHeaderWithDescription3,
    employeeHeaderWithDescription1,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProjectExperienceTestUtil } from './ProjectExperienceTestUtil';
import {
    ExternalWorkExperience,
} from '../../serviceEntities/projectExperienceService';

@suite('ProjectExperienceService/ExternalWorkExperience')
export class ExternalWorkExperienceAPITest extends ProjectExperienceServiceRepository {
    readonly externalWorkExperienceID = 'b3a980c8-257e-429a-a8d3-f1c2c1695ed2';

    readonly externalWorkExperienceID2 = 'c3a980c8-257e-429a-a8d3-f1c2c1695ef2';

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
    async 'Get all external work experience.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('ExternalWorkExperience');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualExternalWorkExperience = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true)) as ExternalWorkExperience[];
        const expectedExternalWorkExperience1:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience1);
        const expectedExternalWorkExperience2:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience2);
        const expectedExternalWorkExperience3:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience3);
        const expectedExternalWorkExperience4:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience4);
        const expectedExternalWorkExperience:ExternalWorkExperience[] = [expectedExternalWorkExperience1, expectedExternalWorkExperience2, expectedExternalWorkExperience3, expectedExternalWorkExperience4];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(actualExternalWorkExperience.length, 4, 'Expected response to contain 4 ExternalWorkExperience.');
        assert.isDefined(actualExternalWorkExperience, 'Expected a list of ExternalWorkExperience.');
        expect(actualExternalWorkExperience).to.deep.include.any.members(expectedExternalWorkExperience);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a external work experience.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`ExternalWorkExperience(${externalWorkExperience1.ID})`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualExternalWorkExperience = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as ExternalWorkExperience;
        const expectedExternalWorkExperience:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(actualExternalWorkExperience, 'Expected a ExternalWorkExperience.');
        expect(actualExternalWorkExperience).to.deep.equal(expectedExternalWorkExperience);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID, employeeHeaderWithDescription3.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const actualExternalWorkExperience = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as ExternalWorkExperience;
        externalWorkExperience.customer = null;
        externalWorkExperience.comments = null;
        externalWorkExperience.changedAt = this.changedAt;
        externalWorkExperience.changedBy = this.changedBy;
        actualExternalWorkExperience.changedAt = actualExternalWorkExperience.changedAt?.slice(0, 10);
        expect(actualExternalWorkExperience).to.deep.equal(externalWorkExperience);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a non-unique external work experience.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription3.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of profile ID, company, project, role, start date, and end date is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a non-unique external work experience.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription3.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of profile ID, company, project, role, start date, and end date is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a non-unique external work experience.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription3.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered combination of profile ID, company, project, role, start date, and end date is not unique. Please enter a unique combination.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience with a profile ID that does not exist.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, this.externalWorkExperienceID2, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
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
    async 'Update an external work experience with a profile ID that does not exist.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, this.externalWorkExperienceID2, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
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
    async 'Upsert an external work experience with a profile ID that does not exist.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, this.externalWorkExperienceID2, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
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
    async 'Create an external work experience with missing profile ID.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, undefined, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.ExternalWorkExperience\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience with missing profile ID.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, undefined, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.ExternalWorkExperience\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience with missing profile ID.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, undefined, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'profileID\' in entity \'ProjectExperienceService.ExternalWorkExperience\' is required');
        assert.equal(errorResponse.error.target, 'profileID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience with non-guid profile ID.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, 'notaguid', 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience with non-guid profile ID.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, 'notaguid', 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience with non-guid profile ID.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, 'notaguid', 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'profileID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience with draft exists.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription1.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience with draft exists.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription1.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience with draft exists.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription1.ID, 'TestCompany', 'TestProject', 'TestRole', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create an external work experience with start date greater than end date.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, undefined, 'TestCompany', 'TestProject', 'TestRole', '2021-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'ExternalWorkExperience', JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start date must be before the end date.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience with start date greater than end date.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, undefined, 'TestCompany', 'TestProject', 'TestRole', '2021-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start date must be before the end date.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience with start date greater than end date.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, undefined, 'TestCompany', 'TestProject', 'TestRole', '2021-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start date must be before the end date.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience with draft exists.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `ExternalWorkExperience(${externalWorkExperience1.ID})`, '{}');
        const responseDraftEdit = await this.enableDraftEdit(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftEdit);
        assert.equal(responseDraftEdit.status, 200, 'Expected status code should be 200 (Ok).');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A draft of this profile exists in the system. Please save the draft first before updating the external work experience.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const responseDraftDelete = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update an external work experience.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID, employeeHeaderWithDescription3.ID, 'TestCompany2', 'TestProject2', 'TestRole2', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `ExternalWorkExperience(${this.externalWorkExperienceID})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '200 OK');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert an external work experience.'() {
        const externalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperienceRequestBody(this.externalWorkExperienceID2, employeeHeaderWithDescription3.ID, 'TestCompany3', 'TestProject3', 'TestRole3', '2017-01-01', '2020-01-01');
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, JSON.stringify(externalWorkExperience));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience.'() {
        let requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `ExternalWorkExperience(${this.externalWorkExperienceID})`, '{}');
        let response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '204 No Content');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `ExternalWorkExperience(${this.externalWorkExperienceID2})`, '{}');
        response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '204 No Content');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience that does not exist.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', 'ExternalWorkExperience(b3a980c8-257e-429a-a8d3-f1c2c1695007)', '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '404 Not Found');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }
}
