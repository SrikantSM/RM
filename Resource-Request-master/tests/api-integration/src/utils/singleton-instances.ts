import { AxiosInstance } from 'axios';
import {
  AppCredentials,
  AuthType,
  ServiceClient,
  TestEnvironment,
} from 'test-commons';

import { Environment } from './environment';

export class ApiIntegrationTestEnvironment extends TestEnvironment<Environment> {
  private environmentInstance: Environment | null = null;

  private manageResourceRequestServiceClient: ServiceClient | null = null;

  private resourceRequestPublicApiServiceClient: ServiceClient | null = null;

  private resourceRequestPublicApiUserFlow: ServiceClient | null = null;

  private projectAdapterServiceClient: ServiceClient | null = null;

  private processResourceRequestServiceClient: ServiceClient | null = null;

  private manageResourceRequestServiceClientUnauthorized: ServiceClient | null = null;

  private processResourceRequestServiceClientUnauthorized: ServiceClient | null = null;

  private healthCheckServiceClient: ServiceClient | null = null;

  private healthCheckServiceClientIntegrationSrv: ServiceClient | null = null;

  private manageResourceRequestServiceClientAuthorized: ServiceClient | null = null;

  private processResourceRequestServiceClientAuthorized: ServiceClient | null = null;

  constructor() {
    super(null);
  }

  public async getEnvironment(): Promise<Environment> {
    if (!this.environmentInstance) {
      try {
        console.log('Reading Environment');
        this.environmentInstance = Environment.createInstance(
          'default-env.json',
        );
      } catch (err) {
        console.error('Environment could not be read', err);
        process.exit(1);
      }
    }
    return this.environmentInstance;
  }

  public async getManageResourceRequestServiceClient(): Promise<AxiosInstance> {
    if (!this.manageResourceRequestServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating ManageResourceRequestServiceClient');
        this.manageResourceRequestServiceClient = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/odata/v4/ManageResourceRequestService',
        );
      } catch (err) {
        console.error('ManageResourceRequestServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.manageResourceRequestServiceClient.getAxiosInstance();
  }

  public async getResourceRequestPublicApiServiceClient(): Promise<AxiosInstance> {
    if (!this.resourceRequestPublicApiServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        authType: AuthType.X509Certificate,
        cfServiceLabel: 'xsuaa',
      };

      try {
        console.log('Creating ResourceRequestPublicApiServiceClient');
        let basePath = '/odata/v4/ResourceRequestService';
        if (environment.apiGatewayAppName) {
          console.log('API Gateway exists in space will use it for tests.');
          basePath = '/ResourceRequestService/v1';
        } else {
          console.log('API Gateway does not exists in space or env variable \'API_INTEGRATION_TESTS_API_GATEWAY_APP_NAME\' is not set.');
        }
        this.resourceRequestPublicApiServiceClient = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          basePath,
          undefined,
          environment.apiGatewayAppName,
        );
      } catch (err) {
        console.error(
          'ResourceRequestPublicApiServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.resourceRequestPublicApiServiceClient.getAxiosInstance();
  }

  public async getResourceRequestPublicApiUserFlow(): Promise<AxiosInstance> {
    if (!this.resourceRequestPublicApiUserFlow) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating ResourceRequestPublicApiUserFlow client');
        let basePath = '/odata/v4/ResourceRequestService';
        if (environment.apiGatewayAppName) {
          console.log('API Gateway exists in space will use it for tests.');
          basePath = '/ResourceRequestService/v1';
        } else {
          console.log(
            "API Gateway does not exists in space or env variable 'API_INTEGRATION_TESTS_API_GATEWAY_APP_NAME' is not set.",
          );
        }
        this.resourceRequestPublicApiUserFlow = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          basePath,
          undefined,
          environment.apiGatewayAppName,
        );
      } catch (err) {
        console.error(
          'Authorized ResourceRequestPublicApiServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.resourceRequestPublicApiUserFlow.getAxiosInstance();
  }

  public async getProjectAdapterServiceClient(): Promise<AxiosInstance> {
    if (!this.projectAdapterServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating ProjectIntegrationAdapter ServiceClient');
        this.projectAdapterServiceClient = new ServiceClient(
          cloudFoundryClient,
          environment.projectIntegrationSrvAppName,
          appCredentials,
          '/',
        );
      } catch (err) {
        console.error(
          'ProjectIntegrationAdapter ServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.projectAdapterServiceClient.getAxiosInstance();
  }

  public async getProcessResourceRequestServiceClient(): Promise<AxiosInstance> {
    if (!this.processResourceRequestServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('RESOURCEMANAGER') || '',
        password: environment.appPasswords.get('RESOURCEMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating ProcessResourceRequest ServiceClient');
        this.processResourceRequestServiceClient = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/odata/v4/ProcessResourceRequestService',
        );
      } catch (err) {
        console.error(
          'ProcessResourceRequest ServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.processResourceRequestServiceClient.getAxiosInstance();
  }

  public async getManageResourceRequestServiceClientUnauthorized(): Promise<AxiosInstance> {
    if (!this.manageResourceRequestServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('RESOURCEMANAGER') || '',
        password: environment.appPasswords.get('RESOURCEMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log(
          'Creating Manage Resource Request Service Unauthorized ServiceClient',
        );
        this.manageResourceRequestServiceClientUnauthorized = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/odata/v4/ManageResourceRequestService',
        );
      } catch (err) {
        console.error(
          'Unauthorized Manage Resource Request ServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.manageResourceRequestServiceClientUnauthorized.getAxiosInstance();
  }

  public async getProcessResourceRequestServiceClientUnauthorized(): Promise<AxiosInstance> {
    if (!this.processResourceRequestServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER') || '',
        password: environment.appPasswords.get('PROJECTMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log(
          'Creating unauthorized Process Resource Request ServiceClient',
        );
        this.processResourceRequestServiceClientUnauthorized = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/odata/v4/ProcessResourceRequestService',
        );
      } catch (err) {
        console.error(
          'Unauthorized Process Resource Request ServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.processResourceRequestServiceClientUnauthorized.getAxiosInstance();
  }

  public async getHealthCheckServiceClient(): Promise<AxiosInstance> {
    if (!this.healthCheckServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        authType: AuthType.None,
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating Health Check ServiceClient');
        this.healthCheckServiceClient = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/actuator',
        );
      } catch (err) {
        console.error('Health Check ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.healthCheckServiceClient.getAxiosInstance();
  }

  public async getHealthCheckServiceClientIntegrationSrv(): Promise<AxiosInstance> {
    if (!this.healthCheckServiceClientIntegrationSrv) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        authType: AuthType.None,
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating Health Check ServiceClient');
        this.healthCheckServiceClientIntegrationSrv = new ServiceClient(
          cloudFoundryClient,
          environment.projectIntegrationSrvAppName,
          appCredentials,
          '/actuator',
        );
      } catch (err) {
        console.error('Health Check ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.healthCheckServiceClientIntegrationSrv.getAxiosInstance();
  }

  public async getManageResourceRequestServiceClientAuthorized(): Promise<AxiosInstance> {
    if (!this.manageResourceRequestServiceClientAuthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('PROJECTMANAGER_AUTHORIZED') || '',
        password:
          environment.appPasswords.get('PROJECTMANAGER_AUTHORIZED') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating Authorized ManageResourceRequestServiceClient');
        this.manageResourceRequestServiceClientAuthorized = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/odata/v4/ManageResourceRequestService',
        );
      } catch (err) {
        console.error(
          'Authorized ManageResourceRequestServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.manageResourceRequestServiceClientAuthorized.getAxiosInstance();
  }

  public async getProcessResourceRequestServiceClientAuthorized(): Promise<AxiosInstance> {
    if (!this.processResourceRequestServiceClientAuthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('RESOURCEMANAGER_AUTHORIZED') || '',
        password:
          environment.appPasswords.get('RESOURCEMANAGER_AUTHORIZED') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating Authorized ProcessResourceRequest ServiceClient');
        this.processResourceRequestServiceClientAuthorized = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          '/odata/v4/ProcessResourceRequestService',
        );
      } catch (err) {
        console.error(
          'Authorized ProcessResourceRequest ServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.processResourceRequestServiceClientAuthorized.getAxiosInstance();
  }
}
