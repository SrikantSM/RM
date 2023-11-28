import { AxiosInstance } from 'axios';
import {
  AppCredentials, ServiceClient, TestEnvironment,
} from 'test-commons';
import { Environment } from './environment';

export class demoDataSetupEnv extends TestEnvironment<Environment> {
  private environmentInstance: Environment | null = null;

  private serviceClient: ServiceClient | null = null;

  private serviceClientUnauthorized: ServiceClient | null = null;

  private capacityServiceClient: ServiceClient | null = null;

  private capacityServiceClientUnauthorized: ServiceClient | null = null;  

  private assignmentServiceClient: ServiceClient | null = null;


  constructor() {
    super(null);
  }

  public async getEnvironment(): Promise<Environment> {
    if (!this.environmentInstance) {
      try {
        console.log('Reading Environment');
        this.environmentInstance = await Environment.createInstance('default-env.json');
      } catch (err) {
        console.error('Environment could not be read', err);
        process.exit(1);
      }
    }
    return this.environmentInstance;
  }

  public async getAssignmentServiceClient(): Promise<AxiosInstance> {
    if (!this.assignmentServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.cfUser, password: environment.cfPassword };

      try {
        console.log('Creating Assignment Service Client');
        this.assignmentServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('Assignment Service Client could not be created', err);
        process.exit(1);
      }
    }
    return this.assignmentServiceClient.getAxiosInstance();
  }

  public async getResourceManagerServiceClient(): Promise<AxiosInstance> {
    if (!this.serviceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '' };

      try {
        console.log('Creating ServiceClient');
        this.serviceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.serviceClient.getAxiosInstance();
  }

  public async getProjectManagerServiceClient(): Promise<AxiosInstance> {
    if (!this.serviceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('PROJECTMANAGER') || '', password: environment.appPasswords.get('PROJECTMANAGER') || '' };

      try {
        console.log('Creating unauthorized ServiceClient');
        this.serviceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('Unauthorized ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.serviceClientUnauthorized.getAxiosInstance();
  }

  public async getResourceManagerCapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '' };

      try {
        console.log('Creating ResourceManagerCapacityServiceClient');
        this.capacityServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/CapacityService');
      } catch (err) {
        console.error('Resource Manager CapacityServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.capacityServiceClient.getAxiosInstance();
  }

  public async getProjectManagerCapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('PROJECTMANAGER') || '', password: environment.appPasswords.get('PROJECTMANAGER') || '' };

      try {
        console.log('Creating ProjectManagerCapacityServiceClient');
        this.capacityServiceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/CapacityService');
      } catch (err) {
        console.error('ProjectManagerCapacityServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.capacityServiceClientUnauthorized.getAxiosInstance();
  }
}
