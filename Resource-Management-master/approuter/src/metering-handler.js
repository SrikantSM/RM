const { requestWithRetries, getDestinations, minimalDefaultLogger } = require('./utils');
const { meteringDestination, meteringEndpoint } = require('./constants');

async function onLogin(session) {
  const token = session.user && session.user.token && session.user.token.accessToken;
  const logger = (session.req && session.req.loggingContext && session.req.loggingContext.getLogger
    && session.req.loggingContext.getLogger('/metering-handler')) || minimalDefaultLogger;

  if (!token) {
    logger.error('Login for session with no token');
    return;
  }

  const destination = getDestinations(logger).find((d) => meteringDestination === d.name);
  if (!destination) {
    logger.error('Metering Service destination not found');
    return;
  }
  const meteringUrl = destination.url + meteringEndpoint;

  await requestWithRetries(logger, 2, meteringUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }, JSON.stringify({ token })).catch((error) => logger.error(error));
}

module.exports.onLogin = onLogin;
