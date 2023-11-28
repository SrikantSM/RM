import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { testEnvironment, TEST_TIMEOUT } from '../utils';

@suite
export class HealthCheckTest {
  private static healthCheckServiceClient: AxiosInstance;
  private static skipHealthCheckEnvironment: string;

  @timeout(TEST_TIMEOUT)
  static async before() {
    HealthCheckTest.healthCheckServiceClient = await testEnvironment.getHealthCheckServiceClient();
    HealthCheckTest.skipHealthCheckEnvironment = await (await testEnvironment.getEnvironment()).skipHealthCheck;
  }

  @test(timeout(TEST_TIMEOUT))
  async 'GET health check endpoint'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClient.get('/health');
    if (HealthCheckTest.skipHealthCheckEnvironment != "YES") {
      assert.equal(healthCheckResponse.status, 200, 'Expected status code of health check to be 200 (OK).');
      assert.equal(healthCheckResponse.data.status, 'UP', 'Expected health of the service to be "UP".');
      }
    else {
        console.log("GET health check endpoint test bypassed");
      }
  }

  @test(timeout(TEST_TIMEOUT))
  async 'GET actuator info endpoint without Authorization'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClient.get('/info');

    assert.equal(healthCheckResponse.status, 401, 'Expected status code of info endpoint to be 401 (Unauthorized).');
  }

  @test
  async 'GET actuator health endpoint does not reveal detailed information'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClient.get('/health');

    assert.equal(healthCheckResponse.status, 200, 'Expected status code of health endpoint to be 200 (OK).');

    const responseBody = healthCheckResponse.data;

    assert.deepEqual(responseBody, { status: 'UP' }, 'Expected response body to not contain any details besides overall status');
  }	  

}
