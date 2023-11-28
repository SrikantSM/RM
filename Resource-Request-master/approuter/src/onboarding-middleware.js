const subscriptionUtils = require('@sap/approuter/lib/utils/subscription-utils');
const { promisify } = require('util');
const url = require('url');
const uuid = require('uuid').v4;
const onboardingUtils = require('./onboarding-utils');

/**
 * Middleware to intercept multitenancy getDependencies and onSubscription calls and forward them to appropriate domains
 */
module.exports = async function (req, res, next) {
  const logger = req.loggingContext.getLogger('/onboarding-middleware');
  const { pathname } = url.parse(req.url);
  const correlationId = getCorrelationId(req);

  logger.info(`Pathname: ${pathname}`);

  try {
    if (pathname === subscriptionUtils.getSaaSRegistryCallbackPath().getDependenciesPath) {
      await promisify(subscriptionUtils.checkScopes)(req);

      logger.info(`Incoming getDependencies request: ${req.url} (Correlation ID: ${correlationId})`);

      const auditlogXsappname = JSON.parse(process.env.VCAP_SERVICES).auditlog[0].credentials.uaa.xsappname;
      const approuterDependencies = await promisify(subscriptionUtils.getSaaSRegistryDependencies)(req);
      const domainDependencies = await onboardingUtils.getDomainDependencies(logger, req.headers.authorization, correlationId);
      const allDependencies = [...approuterDependencies, ...domainDependencies, {
        xsappname: auditlogXsappname
      }];
      const distinctDependencies = onboardingUtils.removeDuplicatedDependencies(allDependencies);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(distinctDependencies));
    } else if (pathname.startsWith(`${subscriptionUtils.getSaaSRegistryCallbackPath().onSubscriptionPrefix}/`)) {
      await promisify(subscriptionUtils.checkScopes)(req);

      logger.info(`Incoming subscription request (${req.method}): ${req.url} (Correlation ID: ${correlationId})`);

      const tenantId = pathname.substring((`${subscriptionUtils.getSaaSRegistryCallbackPath().onSubscriptionPrefix}/`).length);

      if (!tenantId) {
        const error = new Error('The tenant ID must be set');
        error.status = 400;
        throw error;
      }

      const onSubscriptionResponse = await onboardingUtils.forwardOnSubscriptionRequest(logger, req.headers.authorization, correlationId, req.method, tenantId, JSON.stringify(req.body));

      logger.info(`Subscription was successful for tenant ${tenantId}`);

      res.setHeader('Content-Type', 'application/json');
      res.end(onSubscriptionResponse);
    } else {
      next();
    }
  } catch (err) {
    logger.error('Error in onboarding middleware', err);
    // If the error comes from xssec.createSecurityContext, it will contain statuscode and not status
    if (!err.status) {
      err.status = err.statuscode;
    }
    next(err);
  }
};

/**
 * Reads the correlation ID from a given request and generates a new one when there is not correlation ID set
 * @param {*} request
 */
function getCorrelationId(request) {
  return request.headers['x-correlationid'] || request.headers['x-request-id'] || request.headers['x-vcap-request-id'] || uuid();
}
