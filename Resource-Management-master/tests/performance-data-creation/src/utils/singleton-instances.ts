import axios, { AxiosInstance } from 'axios';
import { Environment } from './environment';
import { TestEnvironment, IEnvironment, ServiceClient, AppCredentials } from 'test-commons';

interface IBatchRangeEnvironment {
  asgnBatchSize: string;
  batchRange: string;
  asgnCreateByAPI: string;
}

let environmentSingleton: IEnvironment;
let batchRangeEnvironmentSingleton: IBatchRangeEnvironment;
let batchRange = [0, 0];

let testEnvironmentSingleton: TestEnvironment<IEnvironment>;
let assignmentServiceClient: ServiceClient;

async function getEnvironment() {
  if (!environmentSingleton) {
    try {
      console.log('Reading Environment');
      environmentSingleton = await Environment.createInstance(
        'default-env.json',
      );
    } catch (err) {
      console.error('Environment could not be read', err);
      process.exit(1);
    }
  }
  return environmentSingleton;
}

async function getBatchRangeEnvironment() {
  if (!batchRangeEnvironmentSingleton) {
    try {
      console.log('Reading Environment');
      batchRangeEnvironmentSingleton = await Environment.createInstance(
        'default-env.json',
      );
    } catch (err) {
      console.error('Environment could not be read', err);
      process.exit(1);
    }
  }
  return batchRangeEnvironmentSingleton;
}

export async function getTestEnvironment(): Promise<TestEnvironment<IEnvironment>> {
  if (!testEnvironmentSingleton) {
    try {
      const env = await getEnvironment();
      console.log('Reading TestEnvironment');
      testEnvironmentSingleton = new TestEnvironment({
        cfUser: env.cfUser,
        cfPassword: env.cfPassword,
        spaceGuid: env.spaceGuid,
        landscape: env.landscape,
        srvAppName: env.srvAppName,
        tenantId:env.tenantId,
      });
    } catch (err) {
      console.error('Environment could not be read', err);
      process.exit(1);
    }
  }
  return testEnvironmentSingleton;
}

export async function getBatchRange() {
  try {
    const env = await getBatchRangeEnvironment();
    console.log('Reading TestEnvironment');
    let batchRangeString = env.batchRange.split('-', 2);
    batchRange = [Number(batchRangeString[0]), Number(batchRangeString[1])];
    console.log('BatchRange value is: ', batchRangeString);
    if (isNaN(batchRange[0]) || isNaN(batchRange[1])
      || batchRange[0] <= 0 || batchRange[1] <= 0 || batchRange[1] < batchRange[0]) {
      console.error('Invalid value of batchRange: ', env.batchRange);
      process.exit(1);
    }
    if (batchRange[1] < batchRange[0] || batchRange[1] - batchRange[0] >= 100) {
      console.error('Please enter the value of max batchRange of 100');
      process.exit(1);
    }
  } catch (err) {
    console.error('Environment could not be read or Invalid batchRange value ', err);
    process.exit(1);
  }
  return batchRange;
}
export async function getAssignmentServiceClient(): Promise<AxiosInstance> {
  if (!assignmentServiceClient) {
    const environment = await getEnvironment();
    const testEnvironment = await getTestEnvironment();
    const cloudFoundryClient = await testEnvironment.getCloudFoundryClient();
    const appCredentials: AppCredentials = { username: environment.cfUser, password: environment.cfPassword };

    try {
      console.log('Creating Assignment Service Client');
      assignmentServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
    } catch (err) {
      console.error('Assignment Service Client could not be created', err);
      process.exit(1);
    }
  }
  return assignmentServiceClient.getAxiosInstance();
}
export async function isAssignmentCreationByAPI() {
  try {
    const env = await getBatchRangeEnvironment();
    let asgnCreateByAPI: string = env.asgnCreateByAPI;
    if (asgnCreateByAPI.length !== 0 && asgnCreateByAPI.toUpperCase() === "NO") {
      return false;
    }
  } catch (err) {
    console.error('Environment could not be read for assignment creation process ', err);
    process.exit(1);
  }
  return true;
}
export async function getAssignmentBatchSize() {
  const DEFAULT_BATCH_SIZE: number = 10; //in case not maintained or some failure while reading
  try {
    const env = await getBatchRangeEnvironment();
    let asgnBatchSize: string = env.asgnBatchSize;
    if (asgnBatchSize.length !== 0) {
      const batchSize: number = parseInt(asgnBatchSize);
      if (batchSize < 1)
        return DEFAULT_BATCH_SIZE;
      return batchSize;
    }
  } catch (err) {
    console.error('Environment could not be read for assignment creation process ', err);
    process.exit(1);
  }
  return DEFAULT_BATCH_SIZE;
}