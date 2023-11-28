import { TestEnvironment } from 'test-commons';
import { Environment } from './environment';

export const testEnvironment = new TestEnvironment(
  Environment.createInstance('default-env.json'),
);

export const TEST_TIMEOUT = 1 * 60 * 1000;
