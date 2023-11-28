const http = require('http');
const https = require('https');
const url = require('url');

const {
  getDependenciesDestinations, onSubscriptionDestination, capGetDependenciesPath, capOnSubscriptionPrefix, requestFailureTimeoutMs,
} = require('./constants');

/**
 * Accepts a dependency list and returns a new list containing only distinct entries
 * @param {{xsappname: string} | {appId: string, appName: string}[]} dependencies
 * @returns {{xsappname: string} | {appId: string, appName: string}[]}
 */
function removeDuplicatedDependencies(dependencies) {
  return dependencies.filter(
    (dependency) => dependency === dependencies.find(
      (t) => (t.xsappname && (t.xsappname === dependency.xsappname))
          || (t.appId && t.appName && (t.appId === dependency.appId) && (t.appName === dependency.appName)),
    ),
  );
}

/**
 * Forwards an getDependencies request to all domains and collects the results in one list
 * @param {*} logger
 * @param {string} authHeader
 * @param {string} requestCorrelationId
 * @returns {Promise<({xsappname: string} | {appId: string, appName: string})[]>} dependencies returned by all domains
 */
async function getDomainDependencies(logger, authHeader, requestCorrelationId) {
  const destinationUrls = getDestinations(logger)
    .filter((destination) => getDependenciesDestinations.includes(destination.name))
    .map((destination) => destination.url + capGetDependenciesPath);

  const responses = await Promise.all(destinationUrls.map((destinationUrl) => requestWithRetries(logger, 2, destinationUrl, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'x-correlationid': requestCorrelationId,
    },
  })));

  return responses.reduce((accumulator, response) => accumulator.concat(JSON.parse(response)), []);
}

/**
 * Forwards an onSubscription request to the executing subdomain
 * @param {*} logger
 * @param {string} authHeader
 * @param {string} requestCorrelationId
 * @param {string} httpMethod
 * @param {string} tenantId
 * @param {any} body
 * @returns {Promise<string>} HTTP response of this forwarding request
 */
async function forwardOnSubscriptionRequest(logger, authHeader, requestCorrelationId, httpMethod, tenantId, body) {
  const destination = getDestinations(logger)
    .find((d) => onSubscriptionDestination === d.name);
  const onSubscriptionUrl = `${destination.url + capOnSubscriptionPrefix}/${tenantId}`;

  return request(onSubscriptionUrl, {
    method: httpMethod,
    headers: {
      Authorization: authHeader,
      'x-correlationid': requestCorrelationId,
    },
  }, body);
}

/**
 * Parses and returns the destinations contained in the environment
 * @param {*} logger
 * @returns {{name: string, url: string}[]}
 */
function getDestinations(logger) {
  try {
    return JSON.parse(process.env.destinations);
  } catch (err) {
    logger.error('Destinations could not be parsed from the process environment', err);
    return [];
  }
}

/**
 * Executes an HTTP request against a given URL and retries a given amount of times when it failed
 * @param {*} logger
 * @param {number} retries
 * @param {string} urlString
 * @param {any} additionalOptions should at least contain the method information
 * @param {any} body will be sent to the server when set
 * @returns {Promise<string>} representing the HTTP response
 */
async function requestWithRetries(logger, retries, urlString, options, body) {
  for (let i = 0; i <= retries; i += 1) {
    try {
      logger.info(`Requesting ${urlString}, ${retries - i} retries left`);
      return await request(urlString, options, body);
    } catch (err) {
      logger.error(`Error while trying to request ${urlString}`, err);
      if (i >= retries) {
        throw err;
      }
      logger.info(`Waiting ${requestFailureTimeoutMs} ms until trying requesting ${urlString} again`);
      await new Promise((resolve) => setTimeout(resolve, requestFailureTimeoutMs));
    }
  }
  throw new Error();
}

/**
 * Executes an HTTP request against a given URL
 * @param {string} urlString
 * @param {any} additionalOptions should at least contain the method information
 * @param {any} body will be sent to the server when set
 * @returns {Promise<string>} representing the HTTP response
 */
async function request(urlString, additionalOptions, body) {
  return new Promise((resolve, reject) => {
    const {
      protocol, pathname, hostname, port,
    } = url.parse(urlString, true);

    const options = {
      ...additionalOptions,
      path: pathname,
      host: hostname,
      port,
    };

    if (body !== null && body !== undefined) {
      options.headers = {
        ...options.headers,
        'Content-Length': body.length,
      };
    }

    const httpRequest = (protocol.startsWith('https') ? https : http).request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode < 300) {
          resolve(data);
        } else {
          const error = new Error(data);
          error.status = response.statusCode;
          reject(error);
        }
      });
    });

    httpRequest.on('error', (err) => {
      reject(err);
    });

    if (body !== null && body !== undefined) {
      httpRequest.write(body);
    }

    httpRequest.end();
  });
}

module.exports.removeDuplicatedDependencies = removeDuplicatedDependencies;
module.exports.forwardOnSubscriptionRequest = forwardOnSubscriptionRequest;
module.exports.requestWithRetries = requestWithRetries;
module.exports.getDomainDependencies = getDomainDependencies;
