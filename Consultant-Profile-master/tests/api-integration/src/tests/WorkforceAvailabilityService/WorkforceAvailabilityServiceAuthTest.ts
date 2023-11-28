import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { WorkforceAvailabilityServiceRepository } from '../../utils/serviceRepository/WorkforceAvailabilityService-Repository';
import { allEmployeeHeaders } from '../../data';
import { ProjectExperienceTestUtil } from '../ProjectExperienceService/ProjectExperienceTestUtil';

@suite('WorkforceAvailabilityService/Authorization')
export class WorkforceAvailabilityServiceAuthTest extends WorkforceAvailabilityServiceRepository {
    public constructor() {
        super('');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'GET WorkforceAvailability should be not found.'() {
        const response = await this.get('WorkforceAvailability');
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 Not Found.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST WorkforceAvailability should be not found.'() {
        const response = await this.create(undefined);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 Not Found.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'PATCH WorkforceAvailability should be not found.'() {
        const response = await this.update('WorkforceAvailability', undefined);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 Not Found.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'PUT WorkforceAvailability should be not found.'() {
        const response = await this.update('WorkforceAvailability', undefined);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 Not Found.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'DELETE WorkforceAvailability should be not found.'() {
        const response = await this.delete('WorkforceAvailability');
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 Not Found.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'BATCH call with unauthorized business user should be forbidden.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('WorkforceAvailability');
        const response = await this.postBatchWithUnauthorizedBusinessUser('$batch', requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'BATCH call with unauthorized technical user should be unauthorized.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('WorkforceAvailability');
        const response = await this.postBatchWithUnauthorizedTechnicalUser('$batch', requestBody);
        this.responses.push(response);
        assert.equal(response.status, 401, 'Expected status code should be 401 Unauthorized.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'GET $batch should be disallowed.'() {
        const response = await this.get('$batch');
        this.responses.push(response);
        assert.equal(response.status, 405, 'Expected status code should be 405 Method Not Allowed.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'PUT $batch should be disallowed.'() {
        const response = await this.put('$batch', undefined);
        this.responses.push(response);
        assert.equal(response.status, 405, 'Expected status code should be 405 Method Not Allowed.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'PATCH $batch should be disallowed.'() {
        const response = await this.update('$batch', undefined);
        this.responses.push(response);
        assert.equal(response.status, 405, 'Expected status code should be 405 Method Not Allowed.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'DELETE $batch should be disallowed.'() {
        const response = await this.delete('$batch');
        this.responses.push(response);
        assert.equal(response.status, 405, 'Expected status code should be 405 Method Not Allowed.');
    }
}
