import axios from 'axios';
import { promisify } from 'util';

const xssec = require('@sap/xssec');

const { requests } = xssec;

const INSTANCE_MANAGER_CLIENT_LIB_LABEL = 'managing_client_lib';
const INSTANCE_MANAGER_CLIENT_LIB_VALUE = 'instance-manager-client-lib';

export class ServiceManagerClient {
  public static getServiceManagerCredentials(appEnvironment: any) {
    return (appEnvironment.system_env_json.VCAP_SERVICES['service-manager'] || [{}])[0].credentials;
  }

  public static async getAccessToken(credentials: any) {
    const token = await promisify(requests.requestClientCredentialsToken)(null, credentials, null, undefined);
    return token;
  }

  public static async getHanaCredentialsForTenant(accessToken: String, credentials: any, tenantId: String) {
    const labelQuery = `tenant_id eq '${tenantId}' and ${INSTANCE_MANAGER_CLIENT_LIB_LABEL} eq '${INSTANCE_MANAGER_CLIENT_LIB_VALUE}'`;
    const bindings = await this.getServiceBindingsForInstance(credentials.sm_url, accessToken, labelQuery);
    return (bindings[0] || {}).credentials;
  }

  public static async getAllHanaCredentials(accessToken: String, credentials: any) {
    const labelQuery = `${INSTANCE_MANAGER_CLIENT_LIB_LABEL} eq '${INSTANCE_MANAGER_CLIENT_LIB_VALUE}'`;
    const bindings = await this.getServiceBindingsForInstance(credentials.sm_url, accessToken, labelQuery);
    return bindings.map((binding: any) => ({ tenant_id: binding.labels.tenant_id[0], credentials: binding.credentials }));
  }

  private static async getServiceBindingsForInstance(serviceManagerUrl: String, accessToken: String, labelQuery: String) {
    const response = await axios.request({
      method: 'GET',
      url: `${serviceManagerUrl}/v1/service_bindings`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        labelQuery,
      },
    });
    return response.data.items || [];
  }
}
