import { AxiosInstance } from 'axios';
import {
  AppCredentials, AuthType, ServiceClient, TestEnvironment,
} from 'test-commons';
import { Environment } from './environment';

export class ApiIntegrationTestEnvironment extends TestEnvironment<Environment> {

  private environmentInstance: Environment | null = null;
  private assignmentServiceClient: ServiceClient | null = null;
  private capacityServiceClient: ServiceClient | null = null;
  private assignmentServiceClientAuthorized: ServiceClient | null = null;
  private assignmentServiceClientUnauthorized: ServiceClient | null = null;
  private capacityServiceClientAuthorized: ServiceClient | null = null;
  private profilePhotoClientAuthorized: ServiceClient | null = null;
  private capacityServiceClientUnauthorized: ServiceClient | null = null;
  private healthCheckServiceClient: ServiceClient | null = null;
  private assignmentServiceClientAuthAttrUser01: ServiceClient | null = null;
  private assignmentServiceClientAuthAttrUser02: ServiceClient | null = null;
  private capacityServiceClientAuthAttrUser01: ServiceClient | null = null;
  private capacityServiceClientAuthAttrUser02: ServiceClient | null = null;
  private assignmentPublicApiServiceClient: ServiceClient | null = null;
  private assignmentPublicApiUserFlow: ServiceClient | null = null;

  private requesterAssignmentServiceClientAuthForAllReqResOrg: ServiceClient | null = null;
  private requesterAssignmentServiceClientAuthForSpecificReqResOrg: ServiceClient | null = null;
  private requesterAssignmentServiceClientForResourceManager: ServiceClient | null = null;

  private consultantAssignmentServiceClientForConsultant: ServiceClient | null = null;
  private consultantAssignmentServiceClientForResourceManager: ServiceClient | null = null;

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
      const appCredentials: AppCredentials = { username: environment.cfUser, password: environment.cfPassword, loginHintOrigin: environment.loginHintOrigin, };

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

  public async getCapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating Capacity Service Client');
        this.capacityServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/CapacityService');
      } catch (err) {
        console.error('Capacity Service Client could not be created', err);
        process.exit(1);
      }
    }
    return this.capacityServiceClient.getAxiosInstance();
  }

  public async getResourceManagerServiceClient(): Promise<AxiosInstance> {
    if (!this.assignmentServiceClientAuthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating ServiceClient');
        this.assignmentServiceClientAuthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.assignmentServiceClientAuthorized.getAxiosInstance();
  }

  public async getProjectManagerServiceClient(): Promise<AxiosInstance> {
    if (!this.assignmentServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('PROJECTMANAGER') || '', password: environment.appPasswords.get('PROJECTMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating unauthorized ServiceClient');
        this.assignmentServiceClientUnauthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('Unauthorized ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.assignmentServiceClientUnauthorized.getAxiosInstance();
  }

  public async getAuthAttrTestUser01ServiceClient(): Promise<AxiosInstance> {
    if (!this.assignmentServiceClientAuthAttrUser01) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('AUTHATTRTESTUSER01') || '', password: environment.appPasswords.get('AUTHATTRTESTUSER01') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating Assignment ServiceClient For AuthAttrTestUser01');
        this.assignmentServiceClientAuthAttrUser01 = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('Assignment ServiceClient For AuthAttrTestUser01 could not be created', err);
        process.exit(1);
      }
    }
    return this.assignmentServiceClientAuthAttrUser01.getAxiosInstance();
  }

  public async getAuthAttrTestUser02ServiceClient(): Promise<AxiosInstance> {
    if (!this.assignmentServiceClientAuthAttrUser02) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('AUTHATTRTESTUSER02') || '', password: environment.appPasswords.get('AUTHATTRTESTUSER02') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating Assignment ServiceClient For AuthAttrTestUser02');
        this.assignmentServiceClientAuthAttrUser02 = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/AssignmentService');
      } catch (err) {
        console.error('Assignment ServiceClient For AuthAttrTestUser02 could not be created', err);
        process.exit(1);
      }
    }
    return this.assignmentServiceClientAuthAttrUser02.getAxiosInstance();
  }  

  public async getResourceManagerCapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClientAuthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { authType: AuthType.Bearer, username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating ResourceManagerCapacityServiceClient');
        this.capacityServiceClientAuthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/CapacityService');
      } catch (err) {
        console.error('Resource Manager CapacityServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.capacityServiceClientAuthorized.getAxiosInstance();
  }

  public async getResourceManagerProfilePhotoClient(): Promise<AxiosInstance> {
    if (!this.profilePhotoClientAuthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating getResourceManagerProfilePhotoClient');
        this.profilePhotoClientAuthorized = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4');
      } catch (err) {
        console.error('Resource Manager ProfilePhotoClient could not be created', err);
        process.exit(1);
      }
    }
    return this.profilePhotoClientAuthorized.getAxiosInstance();
  }

  public async getProjectManagerCapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClientUnauthorized) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('PROJECTMANAGER') || '', password: environment.appPasswords.get('PROJECTMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

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

  public async getAuthAttrTestUser01CapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClientAuthAttrUser01) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('AUTHATTRTESTUSER01') || '', password: environment.appPasswords.get('AUTHATTRTESTUSER01') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating Capacity ServiceClient For AuthAttrTestUser01');
        this.capacityServiceClientAuthAttrUser01 = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/CapacityService');
      } catch (err) {
        console.error('Capacity ServiceClient For AuthAttrTestUser01 could not be created', err);
        process.exit(1);
      }
    }
    return this.capacityServiceClientAuthAttrUser01.getAxiosInstance();
  }

  public async getAuthAttrTestUser02CapacityServiceClient(): Promise<AxiosInstance> {
    if (!this.capacityServiceClientAuthAttrUser02) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('AUTHATTRTESTUSER02') || '', password: environment.appPasswords.get('AUTHATTRTESTUSER02') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating Capacity ServiceClient For AuthAttrTestUser02');
        this.capacityServiceClientAuthAttrUser02 = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/CapacityService');
      } catch (err) {
        console.error('Capacity ServiceClient For AuthAttrTestUser02 could not be created', err);
        process.exit(1);
      }
    }
    return this.capacityServiceClientAuthAttrUser02.getAxiosInstance();
  }

  public async getRequesterAssignmentServiceClientAuthForAllReqResOrg(): Promise<AxiosInstance> {
    if (!this.requesterAssignmentServiceClientAuthForAllReqResOrg) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('PROJECTMANAGER') || '', password: environment.appPasswords.get('PROJECTMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating requesterAssignmentServiceClientAuthForAllReqResOrg');
        this.requesterAssignmentServiceClientAuthForAllReqResOrg = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/RequesterAssignmentService');
      } catch (err) {
        console.error('requesterAssignmentServiceClientAuthForAllReqResOrg could not be created', err);
        process.exit(1);
      }
    }
    return this.requesterAssignmentServiceClientAuthForAllReqResOrg.getAxiosInstance();
  }

  public async getRequesterAssignmentServiceClientAuthForSpecificReqResOrg(): Promise<AxiosInstance> {
    if (!this.requesterAssignmentServiceClientAuthForSpecificReqResOrg) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('PROJECTMANAGER_AUTHORIZED') || '', password: environment.appPasswords.get('PROJECTMANAGER_AUTHORIZED') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating requesterAssignmentServiceClientAuthForSpecificReqResOrg');
        this.requesterAssignmentServiceClientAuthForSpecificReqResOrg = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/RequesterAssignmentService');
      } catch (err) {
        console.error('requesterAssignmentServiceClientAuthForSpecificReqResOrg could not be created', err);
        process.exit(1);
      }
    }
    return this.requesterAssignmentServiceClientAuthForSpecificReqResOrg.getAxiosInstance();
  }

  public async getRequesterAssignmentServiceClientForResourceManager(): Promise<AxiosInstance> {
    if (!this.requesterAssignmentServiceClientForResourceManager) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating requesterAssignmentServiceClientForResourceManager');
        this.requesterAssignmentServiceClientForResourceManager = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/RequesterAssignmentService');
      } catch (err) {
        console.error('requesterAssignmentServiceClientForResourceManager could not be created', err);
        process.exit(1);
      }
    }
    return this.requesterAssignmentServiceClientForResourceManager.getAxiosInstance();
  }

  public async getConsultantAssignmentServiceClientForResourceManager(): Promise<AxiosInstance> {
    if (!this.consultantAssignmentServiceClientForResourceManager) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('RESOURCEMANAGER') || '', password: environment.appPasswords.get('RESOURCEMANAGER') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating consultantAssignmentServiceClientForResourceManager');
        this.consultantAssignmentServiceClientForResourceManager = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/ConsultantAssignmentService');
      } catch (err) {
        console.error('consultantAssignmentServiceClientForResourceManager could not be created', err);
        process.exit(1);
      }
    }
    return this.consultantAssignmentServiceClientForResourceManager.getAxiosInstance();
  }

  public async getConsultantAssignmentServiceClientForConsultant(): Promise<AxiosInstance> {
    if (!this.consultantAssignmentServiceClientForConsultant) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { username: environment.appUsers.get('CONSULTANT') || '', password: environment.appPasswords.get('CONSULTANT') || '', loginHintOrigin: environment.loginHintOrigin, };

      try {
        console.log('Creating consultantAssignmentServiceClientForConsultant');
        this.consultantAssignmentServiceClientForConsultant = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/odata/v4/ConsultantAssignmentService');
      } catch (err) {
        console.error('consultantAssignmentServiceClientForConsultant could not be created', err);
        process.exit(1);
      }
    }
    return this.consultantAssignmentServiceClientForConsultant.getAxiosInstance();
  }

  public async getHealthCheckServiceClient(): Promise<AxiosInstance> {
    if (!this.healthCheckServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = { authType: AuthType.None };

      try {
        console.log('Creating Health Check ServiceClient');
        this.healthCheckServiceClient = new ServiceClient(cloudFoundryClient, environment.srvAppName, appCredentials, '/actuator');
      } catch (err) {
        console.error('Health Check ServiceClient could not be created', err);
        process.exit(1);
      }
    }
    return this.healthCheckServiceClient.getAxiosInstance();
  }

  public async getAssignmentPublicApiServiceClient(): Promise<AxiosInstance> {
    if (!this.assignmentPublicApiServiceClient) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        authType: AuthType.X509Certificate,
        cfServiceLabel: 'xsuaa',
      };

      try {
        console.log('Creating AssignmentPublicApiServiceClient');
        let basePath = '/odata/v4/Assignment';
        if (environment.apiGatewayAppName) {
          console.log('API Gateway exists in space will use it for tests.');
          basePath = '/AssignmentService/v1';
        } else {
          console.log('API Gateway does not exists in space or env variable \'API_INTEGRATION_TESTS_API_GATEWAY_APP_NAME\' is not set.');
        }
        this.assignmentPublicApiServiceClient = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          basePath,
          undefined,
          environment.apiGatewayAppName,
        );
      } catch (err) {
        console.error(
          'AssignmentPublicApiServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.assignmentPublicApiServiceClient.getAxiosInstance();
  }

  public async getAssignmentPublicApiUserFlow(): Promise<AxiosInstance> {
    if (!this.assignmentPublicApiUserFlow) {
      const environment = await this.getEnvironment();
      const cloudFoundryClient = await this.getCloudFoundryClient();
      const appCredentials: AppCredentials = {
        username: environment.appUsers.get('RESOURCEMANAGER') || '',
        password: environment.appPasswords.get('RESOURCEMANAGER') || '',
        loginHintOrigin: environment.loginHintOrigin,
      };

      try {
        console.log('Creating AssignmentPublicApiUserFlow client');
        let basePath = '/odata/v4/Assignment';
        if (environment.apiGatewayAppName) {
          console.log('API Gateway exists in space will use it for tests.');
          basePath = '/AssignmentService/v1';
        } else {
          console.log(
            "API Gateway does not exists in space or env variable 'API_INTEGRATION_TESTS_API_GATEWAY_APP_NAME' is not set.",
          );
        }
        this.assignmentPublicApiUserFlow = new ServiceClient(
          cloudFoundryClient,
          environment.srvAppName,
          appCredentials,
          basePath,
          undefined,
          environment.apiGatewayAppName,
        );
      } catch (err) {
        console.error(
          'Authorized AssignmentPublicApiServiceClient could not be created',
          err,
        );
        process.exit(1);
      }
    }
    return this.assignmentPublicApiUserFlow.getAxiosInstance();
  }

}
