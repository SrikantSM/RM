import { AxiosInstance, AxiosResponse } from 'axios';
import { Context } from 'mocha';
import { context } from 'mocha-typescript';
import { v4 as uuid } from 'uuid';

const testRunId = uuid();

type Headers = { [s: string]: string; };

/**
 * Remove the signature from a JWT token to mask it
 * @param {string} jwt JWT token or auth header
 * @returns {string} Masked JWT token
 */
function maskJwt(jwt: string): string {
  return `${jwt.split('.').slice(0, -1).join('.')}.XXX`;
}

/**
 * Mask request headers to remove sensible information.
 * At the moment, this is only the JWT signature
 * @param {headers} headers Headers from an Axios request
 * @returns {headers} Masked headers
 */
function maskHeaders(headers?: Headers): Headers {
  if (!headers) return {};
  return {
    ...headers,
    Authorization: maskJwt(headers.Authorization),
  };
}

function printResponse(response: AxiosResponse): void {
  console.log(`request: ${response.config.method} ${response.config.url}`);
  console.log('request headers:');
  console.log(maskHeaders(response.config.headers));
  console.log('request data:', response.config.data);
  console.log('response status:', response.status);
  console.log('response headers:');
  console.log(response.headers);
  console.log('response data:', response.data);
}

function slugify(str: string): string {
  return str.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
}

// We must register our interceptor only once per instance. Instances are global, interceptors persistent
// We must remove the old interceptor before creating a new one
// --> global WeakMap won't leak resources
const alreadyRegisteredInterceptors: WeakMap<AxiosInstance, number> = new WeakMap();

export class BaseApiTest {
  @context mocha: Context | null = null;

  response: AxiosResponse = {
    data: null, status: 0, statusText: '', headers: null, config: {},
  };

  setCorrelationId(serviceClient: AxiosInstance) {
    if (alreadyRegisteredInterceptors.has(serviceClient)) {
      serviceClient.interceptors.request.eject(alreadyRegisteredInterceptors.get(serviceClient)!);
    }
    const interceptor = serviceClient.interceptors.request.use((config) => {
      // eslint-disable-next-line no-param-reassign
      config.headers['x-correlationid'] = `${testRunId}-${this.getTestNameSlug()}-${uuid()}`;
      return config;
    });
    alreadyRegisteredInterceptors.set(serviceClient, interceptor);
  }

  getTestNameSlug(): string {
    // fullTitle has both suite and test name in it
    return slugify(this.mocha?.test?.fullTitle() || '');
  }

  after() {
    if (this.mocha?.currentTest?.state === 'failed' && this.response) {
      printResponse(this.response);
    }
  }
}
