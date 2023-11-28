module.exports.getDependenciesDestinations = ['consultantProfile-srv-api', 'resourceRequest-srv-api', 'assignment-srv-api', 'skill-srv-api', 'centralServices-srv-api', 'consultantProfile-integration-srv-api', 'project-integration-adapter-api'];
module.exports.onSubscriptionDestination = 'skill-srv-api';
module.exports.capGetDependenciesPath = '/mt/v1.0/subscriptions/dependencies';
module.exports.capOnSubscriptionPrefix = '/mt/v1.0/subscriptions/tenants';

module.exports.meteringDestination = 'centralServices-srv-api';
module.exports.meteringEndpoint = '/v1/newLogin';

module.exports.requestFailureTimeoutMs = 150;
