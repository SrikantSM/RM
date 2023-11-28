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
    workforcePersonWithDescription1,
    costCenter1,
    costCenter2,
    jobDetail4,
    jobDetail5,
    jobDetail6,
    jobDetail8,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment6,
    allWorkAssignmentDetail,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { PrimaryWorkAssignment } from '../../serviceEntities/projectExperienceService';
import { ProjectExperienceTestUtil } from './ProjectExperienceTestUtil';

@suite('ProjectExperienceService/PrimaryWorkAssignment')
export class PrimaryWorkAssignmentTest extends ProjectExperienceServiceRepository {
    public constructor() {
        super('$batch');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.phoneRepository.insertMany(allPhone);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.jobDetailRepository.insertMany(allJobDetails);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.phoneRepository.deleteMany(allPhone);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.jobDetailRepository.deleteMany(allJobDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('PrimaryWorkAssignment');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const expectedPrimaryWorkAssignmentList = await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true);
        const allPrimaryWorkAssignments = JSON.parse(expectedPrimaryWorkAssignmentList) as PrimaryWorkAssignment[];
        const expectedPrimaryWorkAssignment1:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment2, jobDetail4, costCenter1);
        const expectedPrimaryWorkAssignment2:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment3, jobDetail5, costCenter2);
        const expectedPrimaryWorkAssignment3:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment4, jobDetail6, costCenter1);
        const expectedPrimaryWorkAssignment4:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment6, jobDetail8, costCenter1);
        const expectedPrimaryWorkAssignments:PrimaryWorkAssignment[] = [expectedPrimaryWorkAssignment1, expectedPrimaryWorkAssignment2, expectedPrimaryWorkAssignment3, expectedPrimaryWorkAssignment4];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(allPrimaryWorkAssignments.length, 4, 'Expected response to contain 4 Profiles.');
        assert.isDefined(allPrimaryWorkAssignments, 'Expected a list of Primary Work Assignment.');
        expect(allPrimaryWorkAssignments).to.deep.include.any.members(expectedPrimaryWorkAssignments);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`PrimaryWorkAssignment(${workforcePersonWithDescription1.ID})`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualPrimaryWorkAssignment = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as PrimaryWorkAssignment;
        const expectedPrimaryWorkAssignment:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment2, jobDetail4, costCenter1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(actualPrimaryWorkAssignment, 'Expected a Primary Work Assignment object.');
        expect(actualPrimaryWorkAssignment).to.deep.equal(expectedPrimaryWorkAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'PrimaryWorkAssignment', '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `PrimaryWorkAssignment(${workforcePersonWithDescription1.ID})`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `PrimaryWorkAssignment(${workforcePersonWithDescription1.ID})`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete a primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `PrimaryWorkAssignment(${workforcePersonWithDescription1.ID})`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }
}
