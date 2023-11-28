import { AxiosInstance } from 'axios';
import {
  AppCredentials, AuthType, ServiceClient, TestEnvironment,
} from 'test-commons';
import { Environment } from './Environment';

export class ApiIntegrationTestEnvironment extends TestEnvironment<Environment> {
  private environmentInstance: Environment | null = null;

  private serviceClient: ServiceClient | null = null;

  private fileUploadServiceClient: ServiceClient | null = null;

  private fileDownloadServiceClient: ServiceClient | null = null;

  private healthCheckServiceClient: ServiceClient | null = null;

  private serviceClientUnauthorized: ServiceClient | null = null;

  private fileUploadServiceClientUnauthorized: ServiceClient | null = null;

  private fileDownloadServiceClientUnauthorized: ServiceClient | null = null;

  private defaultLanguageServiceClient: ServiceClient | null = null;

  private defaultLanguageServiceClientUnauthorized: ServiceClient | null = null;

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

  public async getServiceClient(): Promise<AxiosInstance> {
    if (!this.serviceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('CONFIGURATIONEXPERT') || '',
        password: environment.appPasswords.get('CONFIGURATIONEXPERT') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating ServiceClient');
      this.serviceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4');
    }
    try {
      return await this.serviceClient.getAxiosInstance();
    } catch (err) {
      console.error('ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getFileUploadServiceClient(): Promise<AxiosInstance> {
    if (!this.fileUploadServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('CONFIGURATIONEXPERT') || '',
        password: environment.appPasswords.get('CONFIGURATIONEXPERT') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating FileUpload ServiceClient');
      this.fileUploadServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/api/internal/upload/skills/csv');
    }
    try {
      return await this.fileUploadServiceClient.getAxiosInstance();
    } catch (err) {
      console.error('FileUpload ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getFileDownloadServiceClient(): Promise<AxiosInstance> {
    if (!this.fileDownloadServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('CONFIGURATIONEXPERT') || '',
        password: environment.appPasswords.get('CONFIGURATIONEXPERT') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating FileDownload ServiceClient');
      this.fileDownloadServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/api/internal/download/skills/csv');
    }
    try {
      return await this.fileDownloadServiceClient.getAxiosInstance();
    } catch (err) {
      console.error('FileDownload ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getHealthCheckServiceClient(): Promise<AxiosInstance> {
    if (!this.healthCheckServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { authType: AuthType.None };
      console.log('Creating Health Check ServiceClient');
      this.healthCheckServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/actuator');
    }
    try {
      return await this.healthCheckServiceClient.getAxiosInstance();
    } catch (err) {
      console.error('Health Check ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getServiceClientUnauthorized(): Promise<AxiosInstance> {
    if (!this.serviceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating unauthorized ServiceClient');
      this.serviceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4');
    }
    try {
      return await this.serviceClientUnauthorized.getAxiosInstance();
    } catch (err) {
      console.error('Unauthorized ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getFileUploadServiceClientUnauthorized(): Promise<AxiosInstance> {
    if (!this.fileUploadServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating unauthorized FileUpload ServiceClient');
      this.fileUploadServiceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/api/internal/upload/skills/csv');
    }
    try {
      return await this.fileUploadServiceClientUnauthorized.getAxiosInstance();
    } catch (err) {
      console.error('Unauthorized FileUpload ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getFileDownloadServiceClientUnauthorized(): Promise<AxiosInstance> {
    if (!this.fileDownloadServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating unauthorized FileDownload ServiceClient');
      this.fileDownloadServiceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/api/internal/download/skills/csv');
    }
    try {
      return await this.fileDownloadServiceClientUnauthorized.getAxiosInstance();
    } catch (err) {
      console.error('Unauthorized FileDownload ServiceClient could not be created', err);
      process.exit(1);
    }
  }

  public async getDefaultLanguageServiceClient(): Promise<AxiosInstance> {
    if (!this.defaultLanguageServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('RESOURCEMANAGEMENTADMINISTRATOR') || '',
        password: environment.appPasswords.get('RESOURCEMANAGEMENTADMINISTRATOR') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating DefaultLanguage ServiceClient');
      this.defaultLanguageServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/api/internal/default-language');
    }
    try {
      return await this.defaultLanguageServiceClient.getAxiosInstance();
    } catch (err) {
      console.error('DefaultLanguage Service Client could not be created', err);
      process.exit(1);
    }
  }

  public async getDefaultLanguageServiceClientUnauthorized(): Promise<AxiosInstance> {
    if (!this.defaultLanguageServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('CONFIGURATIONEXPERT') || '',
        password: environment.appPasswords.get('CONFIGURATIONEXPERT') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };
      console.log('Creating DefaultLanguage ServiceClient unauthorized');
      this.defaultLanguageServiceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/api/internal/default-language');
    }
    try {
      return await this.defaultLanguageServiceClientUnauthorized.getAxiosInstance();
    } catch (err) {
      console.error('DefaultLanguage Service Client unauthorized could not be created', err);
      process.exit(1);
    }
  }
}
