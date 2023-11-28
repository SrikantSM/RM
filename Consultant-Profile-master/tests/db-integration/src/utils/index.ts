import { TestEnvironment } from 'test-commons';
import { Environment } from './Environment';

export const TEST_TIMEOUT = 1 * 60 * 1000;
export const dbIntegrationTestEnvironment = new TestEnvironment(
    Environment.createInstance('default-env.json'),
);
