const approuter = require('@sap/approuter');
const customOnboardingMiddleware = require('./src/onboarding-middleware');

const ar = approuter();
ar.first.use(customOnboardingMiddleware);
ar.start();
