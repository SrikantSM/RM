const subscriptionUtils = require('@sap/approuter/lib/utils/subscription-utils');
const { promisify } = require('util');
const url = require('url');

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

  try {
    if (pathname === subscriptionUtils.getSaaSRegistryCallbackPath().getDependenciesPath) {
      await promisify(subscriptionUtils.checkScopes)(req);

      logger.info('Incoming getDependencies request');
      const auditlogXsappname = JSON.parse(process.env.VCAP_SERVICES).auditlog[0].credentials.uaa.xsappname;
      const approuterDependencies = await promisify(subscriptionUtils.getSaaSRegistryDependencies)(req);
      const allDependencies = [...approuterDependencies, {
        xsappname: auditlogXsappname
      }];
      const distinctDependencies = removeDuplicatedDependencies(allDependencies);

      logger.info('GetDependencies call was completed successful');

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(distinctDependencies));
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
