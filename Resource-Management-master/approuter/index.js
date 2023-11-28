const approuter = require('@sap/approuter');
const customOnboardingMiddleware = require('./src/onboarding-middleware');
const customMeteringHandler = require('./src/metering-handler');
const loginLogger = require('./src/login-logger');

const ar = approuter();
ar.first.use(customOnboardingMiddleware);
ar.on('login', customMeteringHandler.onLogin);
ar.on('login', loginLogger.onLogin);
ar.start();
