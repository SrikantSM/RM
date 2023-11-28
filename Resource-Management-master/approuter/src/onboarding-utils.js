const {
  getDependenciesDestinations, onSubscriptionDestination, capGetDependenciesPath, capOnSubscriptionPrefix,
} = require('./constants');

const { getDestinations, request, requestWithRetries } = require('./utils');

/**
 * Accepts a dependency list and returns a new list containing only distinct entries
 * @param {{xsappname: string} | {appId: string, appName: string}[]} dependencies with duplicates
 * @returns {{xsappname: string} | {appId: string, appName: string}[]} dependencies without duplicated
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
 * @param {*} logger to log messages
 * @param {string} authHeader of the request
 * @param {string} requestCorrelationId of the request
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
 * @param {*} logger to log messages
 * @param {string} authHeader of the request
 * @param {string} requestCorrelationId of the request
 * @param {string} httpMethod to forward a request to
 * @param {string} tenantId of the request
 * @param {any} body to forward
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

module.exports.removeDuplicatedDependencies = removeDuplicatedDependencies;
module.exports.forwardOnSubscriptionRequest = forwardOnSubscriptionRequest;
module.exports.getDomainDependencies = getDomainDependencies;
