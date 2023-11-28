/* eslint-disable max-nested-callbacks */
var approuter = require('@sap/approuter');
var vcapUtils = require('@sap/approuter/lib/utils/vcap-utils');
var subscriptionUtils = require('@sap/approuter/lib/utils/subscription-utils');
var got = require('got');

/**
 *  the backend destination is defined in the approuter module:
 *
 *      - name: consultantProfile-integration-srv-api
 *        group: destinations
 *        properties:
 *          name: consultantProfile-integration-srv-api  <------- this is the required backend destination name
 *          url: ~{url}
 *          forwardAuthToken: true
 *
 * here, the destination name is 'srv_api', which is used in the next statement:
 * var backendBaseUrl = getDestinationFromEnv('consultantProfile-integration-srv-api').url;
 */
var backendBaseUrl = getDestinationFromEnv('consultantProfile-integration-srv-api').url;
var backendGetDependenciesCallbackUrl = backendBaseUrl + '/mt/v1.0/subscriptions/dependencies';

var ar = approuter();

//---------------------------------------------------------------------------------------------
// getDependencies
// https://wiki.wdf.sap.corp/wiki/display/CloudFront/CIS+Integration+in+Approuter
//---------------------------------------------------------------------------------------------
ar.first.use('/callback/v1.0/dependencies', function getDependencies(req, res, next) {

    console.log('getDependencies');

    var missingBindingErr = isSaaSRegistryBound();
    if (missingBindingErr) {
        return next(missingBindingErr);
    }

    console.log('checkScopes');
    subscriptionUtils.checkScopes(req, function (err) {
        if (err) {
            return next(err);
        }

        var options = {
            url: backendGetDependenciesCallbackUrl,
            headers: {
                authorization: req.headers.authorization
            }
        };

        console.log('retrieving dependencies from backend: ' + options.url);
        (async () => {
            const { statusCode , body } = await got.get(options).catch(error => err = error);
            if (err) {
                return next(err);
            }
            if (statusCode == 200){
                var backendDependencies = JSON.parse(body);
                console.log('response.body=' + body);
                const auditlogXsappname = JSON.parse(process.env.VCAP_SERVICES).auditlog[0].credentials.uaa.xsappname;
                subscriptionUtils.getSaaSRegistryDependencies(req, (err, dependencies) => {
                    if (err){
                        return next(err);
                    }
                    const allDependencies = [...dependencies, {
                        xsappname: auditlogXsappname
                    }];
                    const mergedDependencies = JSON.stringify(allDependencies.concat(backendDependencies));
                    res.setHeader('Content-Type', 'application/json');
                    res.end(mergedDependencies);
                    console.log('merged dependencies: ' + mergedDependencies);
                });
            }
        })();
    });
});

function isSaaSRegistryBound() {

    if (!vcapUtils.getServiceCredentials({ label: 'saas-registry' })) {
        return subscriptionUtils.getError('Binding to SaaS Registry is required for this type of request', 400);
    }
    return null;
}

function getDestinationFromEnv(destinationName) {

    if (!('destinations' in process.env)) {
        return null;
    }
    var destinations = JSON.parse(process.env.destinations);
    var matchingDestinations = destinations.filter(function (destination) {
        return destination.name === destinationName;
    });
    if (matchingDestinations.length === 0) {
        return null;
    }
    return matchingDestinations[0];
}

ar.start();
