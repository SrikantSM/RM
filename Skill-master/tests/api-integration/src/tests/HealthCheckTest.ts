import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { BaseApiTest, testEnvironment } from '../utils';

@suite
export class HealthCheckTest extends BaseApiTest {
  private static healthCheckServiceClient: AxiosInstance;

  static async before() {
    HealthCheckTest.healthCheckServiceClient = await testEnvironment.getHealthCheckServiceClient();
  }

  async before() {
    this.setCorrelationId(HealthCheckTest.healthCheckServiceClient);
  }

  @test
  async 'GET health check endpoint'() {
    this.response = await HealthCheckTest.healthCheckServiceClient.get('/health');

    assert.equal(this.response.status, 200, 'Expected status code of health check to be 200 (OK).');
    assert.equal(this.response.data.status, 'UP', 'Expected health of the service to be "UP".');
  }
}
