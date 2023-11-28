import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { timeout, test } from 'mocha-typescript';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class HealthCheckRepository extends ServiceEndPointsRepository {
    private endPoint: string = '/actuator/health';

    public constructor(private readonly serviceClient: AxiosInstance) {
        super();
    }

    protected static async prepare() {
        await this.prepareHealthCheckServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'GET health check endpoint'() {
        const healthCheckResponse = await ServiceEndPointsRepository.get(this.serviceClient, this.endPoint);
        this.responses.push(healthCheckResponse);
        assert.equal(healthCheckResponse.status, 200, 'Expected status code of health check to be 200 (OK).');
        assert.equal(healthCheckResponse.data.status, 'UP', 'Expected health of the service to be "UP".');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'GET health check endpoint without authorization'() {
        const unauthorizedHealthCheckResponse = await ServiceEndPointsRepository.get(this.serviceClient, '/actuator/info');
        this.responses.push(unauthorizedHealthCheckResponse);
        assert.equal(unauthorizedHealthCheckResponse.status, 401, 'Expected status code of health check to be 401 (Unauthorized).');
    }
}
