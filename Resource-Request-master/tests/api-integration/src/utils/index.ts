import { ApiIntegrationTestEnvironment } from './singleton-instances';

export const testEnvironment = new ApiIntegrationTestEnvironment();

export const TEST_TIMEOUT = 1 * 60 * 1000;
