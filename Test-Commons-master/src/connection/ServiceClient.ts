import axios, { AxiosInstance } from 'axios';
import querystring from 'querystring';
import { promisify } from 'util';
import https from 'https';
import { AppCredentials, AuthType } from './AppCredentials';
import { CloudFoundryClient } from './CloudFoundryClient';

const xssec = require('@sap/xssec');

const { requests } = xssec;

export class ServiceClient {
  private axiosInstance?: AxiosInstance;

  public constructor(private readonly cloudFoundryClient: CloudFoundryClient, private readonly appName: string, private readonly appCredentials: AppCredentials, private readonly basePath: string, private readonly tenantSubdomain?: string, private readonly gatewayAppName?: string) {
  }

  public async getAxiosInstance(): Promise<any> {
    if (!this.axiosInstance) {
      this.axiosInstance = await this.createAxiosInstance();
    }

    return this.axiosInstance;
  }

  private async createAxiosInstance(): Promise<any> {
    const cfAccessToken = await this.cloudFoundryClient.getAccessToken();
    const appGuid = await this.cloudFoundryClient.getAppGuid(cfAccessToken, this.appName);
    let appUri;
    if (this.gatewayAppName && this.gatewayAppName.length > 0) {
      const gatewayAppGuid = await this.cloudFoundryClient.getAppGuid(cfAccessToken, this.gatewayAppName);
      appUri = await this.cloudFoundryClient.getAppRoute(cfAccessToken, gatewayAppGuid);
    } else {
      appUri = await this.cloudFoundryClient.getAppRoute(cfAccessToken, appGuid);
    }
    const appEnvironment = await this.cloudFoundryClient.getAppEnvironment(cfAccessToken, appGuid);
    const uaaCredentials = await this.cloudFoundryClient.getUaaCredentials(appEnvironment);
    const uaaUrl = this.tenantSubdomain ? `https://${this.tenantSubdomain}.${uaaCredentials.uaadomain}` : uaaCredentials.url;
    let certURL;
    if (uaaCredentials.certurl !== undefined && uaaCredentials.certurl !== null) {
      certURL = this.tenantSubdomain ? `https://${this.tenantSubdomain}.authentication.cert.sap.hana.ondemand.com` : uaaCredentials.certurl;
    }
    const baseURL = `https://${appUri}${this.basePath}`;

    let authorizationHeader;

    if (this.appCredentials.authType === AuthType.Basic) {
      authorizationHeader = `Basic ${Buffer.from(`${this.appCredentials.username}:${this.appCredentials.password}`).toString('base64')}`;
    } else if (this.appCredentials.authType === AuthType.ClientCredential) {
      let clientId;
      let clientSecret;
      if (this.appCredentials.cfServiceLabel !== undefined) {
        const cfServiceCredentials = this.cloudFoundryClient.getCfServiceCredentials(appEnvironment, this.appCredentials.cfServiceLabel);
        clientId = cfServiceCredentials.clientid;
        clientSecret = cfServiceCredentials.clientsecret;
      } else if (this.appCredentials.clientId !== null && this.appCredentials.clientId !== undefined && this.appCredentials.clientSecret !== null && this.appCredentials.clientSecret !== undefined) {
        clientId = this.appCredentials.clientId;
        clientSecret = this.appCredentials.clientSecret;
      } else {
        clientId = uaaCredentials.clientid;
        clientSecret = uaaCredentials.clientsecret;
      }
      const appTokenResponse = await axios.request({
        method: 'POST',
        url: `${uaaUrl}/oauth/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });
      authorizationHeader = `Bearer ${appTokenResponse.data.access_token}`;
    } else if (this.appCredentials.authType === AuthType.X509Certificate && this.appCredentials.cfServiceLabel !== undefined) {
      const cfServiceCredentials = this.cloudFoundryClient.getCfServiceCredentials(appEnvironment, this.appCredentials.cfServiceLabel);
      const token = await promisify(requests.requestClientCredentialsToken)(cfServiceCredentials.identityzone, cfServiceCredentials, null, undefined);
      authorizationHeader = `Bearer ${token}`;
    } else if (this.appCredentials.authType === AuthType.None) {
      authorizationHeader = null;
    } else {
      const appTokenResponse = await axios.request({
        method: 'POST',
        url: `${certURL}/oauth/token`,
        httpsAgent: new https.Agent({
          cert: uaaCredentials.certificate,
          key: uaaCredentials.key,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
          grant_type: 'password',
          login_hint: JSON.stringify({ origin: this.appCredentials.loginHintOrigin || 'sap.custom' }),
          username: this.appCredentials.username,
          password: this.appCredentials.password,
          client_id: uaaCredentials.clientid,
        }),
      });
      authorizationHeader = `Bearer ${appTokenResponse.data.access_token}`;
    }

    console.log(`Configuring ServiceClient with base URL ${baseURL}`);

    const headers = authorizationHeader ? {
      Authorization: authorizationHeader,
    } : {};

    return axios.create({
      baseURL,
      validateStatus: () => true,
      timeout: 1 * 60 * 1000,
      headers,
    });
  }
}
