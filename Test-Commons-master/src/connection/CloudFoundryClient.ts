import axios from 'axios';
import querystring from 'querystring';
import { CloudFoundryCredentials } from './CloudFoundryCredentials';

export class CloudFoundryClient {
  public constructor(private readonly credentials: CloudFoundryCredentials) {
  }

  public async getAccessToken(): Promise<string> {
    const cfTokenResponse = await axios.request(
      {
        method: 'POST',
        url: `https://login.cf.${this.credentials.landscape}.hana.ondemand.com/oauth/token`,
        headers: {
          Authorization: 'Basic Y2Y6',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
          grant_type: 'password',
          username: this.credentials.username,
          password: this.credentials.password,
        }),
      },
    );

    return cfTokenResponse.data.access_token;
  }

  public async getApps(cfAccessToken: string): Promise<any[]> {
    const cfAppsResponse = await axios.request(
      {
        method: 'GET',
        url: `https://api.cf.${this.credentials.landscape}.hana.ondemand.com/v2/apps?q=space_guid:${this.credentials.spaceGuid}`,
        headers: {
          Authorization: `Bearer ${cfAccessToken}`,
        },
      },
    );

    return cfAppsResponse.data.resources;
  }

  public async getAppGuid(cfAccessToken: string, appName: string): Promise<string> {
    const apps = await this.getApps(cfAccessToken);

    // Try to find the active app
    let app = apps.find((a) => a.entity.name === appName);
    if (app) {
      return app.metadata.guid;
    }

    // Try to find an app deployed with the legacy blue-green deployment
    if (!app) {
      app = apps.find((a) => a.entity.name === `${appName}-blue`);
    }
    if (!app) {
      app = apps.find((a) => a.entity.name === `${appName}-green`);
    }
    if (app) {
      console.log(`Using app deployed with the legacy blue-green deployment: ${app.entity.name}`);
      return app.metadata.guid;
    }

    // Try to find an app with an ongoing blue-green deployment
    if (!app) {
      app = apps.find((a) => a.entity.name === `${appName}-idle`);
    }
    if (!app) {
      app = apps.find((a) => a.entity.name === `${appName}-live`);
    }
    if (app) {
      console.log(`Using app with an ongoing blue-green deployment: ${app.entity.name}. The credentials might be invalid after the deployment is complete.`);
      return app.metadata.guid;
    }

    throw new Error(`There is no app with '${appName}' in space '${this.credentials.spaceGuid}'`);
  }

  public async getAppEnvironment(cfAccessToken: string, appGuid: string): Promise<any> {
    const cfEnvResponse = await axios.request(
      {
        method: 'GET',
        url: `https://api.cf.${this.credentials.landscape}.hana.ondemand.com/v2/apps/${appGuid}/env`,
        headers: {
          Authorization: `Bearer ${cfAccessToken}`,
        },
      },
    );

    return cfEnvResponse.data;
  }

  public async getAppRoute(cfAccessToken: string, appGuid: string): Promise<string> {
    const environment = await this.getAppEnvironment(cfAccessToken, appGuid);
    const { uris } = environment.application_env_json.VCAP_APPLICATION;

    for (const uri of uris) {
      if (uri && !uri.includes('-idle') && !uri.includes('internal')) {
        return uri;
      }
    }

    throw new Error(`There is no active URI of app '${appGuid}'`);
  }

  public getHanaCredentials(appEnvironment: any): any {
    return (appEnvironment.system_env_json.VCAP_SERVICES.hana || [{}])[0].credentials;
  }

  public getUaaCredentials(appEnvironment: any): any {
    return (appEnvironment.system_env_json.VCAP_SERVICES.xsuaa || [{}])[0].credentials;
  }

  public getCfServiceCredentials(appEnvironment: any, cfServiceLabel: string): any {
    const { credentials } = (appEnvironment.system_env_json.VCAP_SERVICES[cfServiceLabel] || [{}])[0];
    if (credentials.uaa !== undefined) {
      return credentials.uaa;
    }
    return credentials;
  }

  public getOwnTenantId(appEnvironment: any): any {
    return (this.getUaaCredentials(appEnvironment) || {}).tenantid;
  }
}
