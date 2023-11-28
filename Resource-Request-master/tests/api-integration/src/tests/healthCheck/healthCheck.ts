import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { testEnvironment, TEST_TIMEOUT } from '../../utils';

@suite
export class HealthCheckTest {
  private static healthCheckServiceClient: AxiosInstance;

  private static healthCheckServiceClientIntegrationSrv: AxiosInstance;

  @timeout(TEST_TIMEOUT)
  static async before() {
    HealthCheckTest.healthCheckServiceClient = await testEnvironment.getHealthCheckServiceClient();
    HealthCheckTest.healthCheckServiceClientIntegrationSrv = await testEnvironment.getHealthCheckServiceClientIntegrationSrv();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'GET health check endpoint for Resource Request Srv'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClient.get(
      '/health',
    );

    assert.equal(
      healthCheckResponse.status,
      200,
      'Expected status code of health check to be 200 (OK).'
    );
    assert.equal(
      healthCheckResponse.data.status,
      'UP',
      'Expected health of the service to be "UP".'
    );
  }

  @test
  async 'GET actuator info endpoint without Authorization for Resource Request Srv'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClient.get('/info');

    assert.equal(
      healthCheckResponse.status,
       401,
       'Expected status code of info endpoint to be 401 (Unauthorized).'
    );
  }

  @test
  async 'GET actuator health endpoint does not reveal detailed information for Resource Request Srv'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClient.get('/health');

    assert.equal(
      healthCheckResponse.status,
      200,
      'Expected status code of health endpoint to be 200 (OK).'
    );

    const responseBody = healthCheckResponse.data;
    assert.deepEqual(
      responseBody,
      { status: 'UP' },
      'Expected response body to not contain any details besides overall status'
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'GET health check endpoint for Project Integration Srv'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClientIntegrationSrv.get(
      '/health',
    );

    assert.equal(
      healthCheckResponse.status,
      200,
      'Expected status code of health check to be 200 (OK).',
    );
    assert.equal(
      healthCheckResponse.data.status,
      'UP',
      'Expected health of the service to be "UP".',
    );
  }

  @test
  async 'GET actuator health endpoint does not reveal detailed information for Project Integration Srv'() {
    const healthCheckResponse = await HealthCheckTest.healthCheckServiceClientIntegrationSrv.get('/health');

    assert.equal(
      healthCheckResponse.status,
      200,
      'Expected status code of health endpoint to be 200 (OK).'
    );

    const responseBody = healthCheckResponse.data;
    assert.deepEqual(
      responseBody,
      { status: 'UP' },
      'Expected response body to not contain any details besides overall status'
    );
  }
}
