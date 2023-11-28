const { minimalDefaultLogger } = require('./utils');

async function onLogin(session) {
  const logger = (session.req && session.req.loggingContext && session.req.loggingContext.getLogger
    && session.req.loggingContext.getLogger('/login-logger')) || minimalDefaultLogger;

  logger.info('New Login');
}

module.exports.onLogin = onLogin;
