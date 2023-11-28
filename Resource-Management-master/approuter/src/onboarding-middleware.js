const subscriptionUtils = require('@sap/approuter/lib/utils/subscription-utils');
const { promisify } = require('util');
const url = require('url');
const uuid = require('uuid').v4;
const onboardingUtils = require('./onboarding-utils');

/**
 * Middleware to intercept multitenancy getDependencies and onSubscription calls and forward them to appropriate domains
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next step in the middleware chain
 * @returns {undefined}
 */
module.exports = async function (req, res, next) {
  const logger = req.loggingContext.getLogger('/onboarding-middleware');
  const { pathname } = url.parse(req.url);
  const correlationId = getCorrelationId(req);

  try {
    if (pathname === subscriptionUtils.getSaaSRegistryCallbackPath().getDependenciesPath) {
      await promisify(subscriptionUtils.checkScopes)(req);

      logger.info('Incoming getDependencies request');
      // Workaroud until saasRegistryEnabled flog is available, see: https://jtrack.wdf.sap.corp/browse/NGPBUG-166711
      const auditlogXsappname = JSON.parse(process.env.VCAP_SERVICES).auditlog[0].credentials.uaa.xsappname;
      const approuterDependencies = await promisify(subscriptionUtils.getSaaSRegistryDependencies)(req);
      const domainDependencies = await onboardingUtils.getDomainDependencies(logger, req.headers.authorization, correlationId);
      const allDependencies = [...approuterDependencies, ...domainDependencies, {
        xsappname: auditlogXsappname,
      }];
      const distinctDependencies = onboardingUtils.removeDuplicatedDependencies(allDependencies);

      logger.info('GetDependencies call was completed successful');

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(distinctDependencies));
    } else if (pathname.startsWith(`${subscriptionUtils.getSaaSRegistryCallbackPath().onSubscriptionPrefix}/`)) {
      await promisify(subscriptionUtils.checkScopes)(req);

      logger.info(`Incoming subscription request (${req.body.eventType || req.method})`);

      const tenantId = pathname.substring((`${subscriptionUtils.getSaaSRegistryCallbackPath().onSubscriptionPrefix}/`).length);

      if (!tenantId) {
        const error = new Error('The tenant ID must be set');
        error.status = 400;
        throw error;
      }

      const onSubscriptionResponse = await onboardingUtils.forwardOnSubscriptionRequest(logger, req.headers.authorization, correlationId, req.method, tenantId, JSON.stringify(req.body));

      logger.info(`Subscription was successful (${req.body.eventType || req.method})`); // Message used for Dashboards
      if (req.method === 'DELETE') {
        logger.info(`Tenant ${tenantId} deleted`);
      } else if (req.body.eventType === 'CREATE') {
        logger.info(`Tenant ${tenantId} onboarded`);
      } if (req.body.eventType === 'UPDATE') {
        logger.info(`Tenant ${tenantId} updated`);
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(onSubscriptionResponse);
    } else {
      next();
    }
  } catch (err) {
    logger.error(`Error in onboarding middleware (${(req.body && req.body.eventType) || req.method})`, err); // Message used for Dashboards
    // If the error comes from xssec.createSecurityContext, it will contain statuscode and not status
    if (!err.status) {
      err.status = err.statuscode;
    }
    next(err);
  }
};

/**
 * Reads the correlation ID from a given request and generates a new one when there is not correlation ID set
 * @param {*} request to get the correlationId for
 * @returns {undefined}
 */
function getCorrelationId(request) {
  return request.headers['x-correlationid'] || request.headers['x-request-id'] || request.headers['x-vcap-request-id'] || uuid();
}
