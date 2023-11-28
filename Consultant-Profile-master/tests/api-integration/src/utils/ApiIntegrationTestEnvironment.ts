import { AxiosInstance } from 'axios';
import {
    TestEnvironment,
    ServiceClient,
    AppCredentials,
    AuthType,
} from 'test-commons';
import { Environment } from './Environment';
import { CFServiceType } from './serviceRepository/CFServiceType';
import { UserType } from './serviceRepository/UserType';

export class ApiIntegrationTestEnvironment extends TestEnvironment<Environment> {
    private environmentInstance!: Environment;

    constructor() {
        super(null);
    }

    public async getEnvironment(): Promise<Environment> {
        if (!this.environmentInstance) {
            try {
                console.log('Reading Environment');
                this.environmentInstance = await Environment.createInstance('default-env.json');
            } catch (err) {
                console.error('Environment could not be read.', err);
                process.exit(1);
            }
        }
        return this.environmentInstance;
    }

    public async prepareServiceClient(serviceAppName: string, userType: UserType, authType: AuthType, serviceClientLabel: string, cfServiceLevel?: CFServiceType): Promise<AxiosInstance> {
        const environment = await this.getEnvironment();
        const cloudFoundryClient = await this.getCloudFoundryClient();
        const appCredentials: AppCredentials = this.prepareAppCredentials(cfServiceLevel, userType, environment, authType);
        console.log(`Creating ServiceClient with details: { Service Label = ${serviceClientLabel}, User = ${userType}, Authentication = ${AuthType[authType]} }`);
        const serviceClient: ServiceClient = new ServiceClient(cloudFoundryClient, serviceAppName, appCredentials, '');
        try {
            return await serviceClient.getAxiosInstance();
        } catch (err) {
            console.log(`Unable to create ServiceClient with details: { Service Label = ${serviceClientLabel}, User = ${userType}, Authentication = ${AuthType[authType]} }`);
            process.exit(1);
        }
    }

    private prepareAppCredentials(cfServiceLevel: CFServiceType | undefined, userType: UserType, environment: Environment, authType: AuthType) {
        if (cfServiceLevel !== undefined) {
            return { authType, cfServiceLabel: cfServiceLevel };
        }
        return {
            authType, username: environment.appUsers.get(userType)!, password: environment.appPasswords.get(userType)!, loginHintOrigin: environment.loginHintOrigin,
        };
    }

    public async getSubDomain(): Promise<string> {
        const environment = await this.getEnvironment();
        const cloudFoundryClient = await this.getCloudFoundryClient();
        const accessToken = await cloudFoundryClient.getAccessToken();
        const appGuid = await cloudFoundryClient.getAppGuid(accessToken, environment.srvAppName);
        const appEnvironment = await cloudFoundryClient.getAppEnvironment(accessToken, appGuid);
        const uaaCredentials = cloudFoundryClient.getUaaCredentials(appEnvironment);
        return uaaCredentials.identityzone;
    }
}
