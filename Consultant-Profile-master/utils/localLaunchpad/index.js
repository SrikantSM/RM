const approuter = require('@sap/approuter');
const httpProxy = require('http-proxy');

// Authentication properties, should be inline with mock-user from srv/src/main/resources/application.yaml
const user = 'authenticated-user@sap.com';
const password = 'pass';

const proxy = httpProxy.createProxyServer();
const ar = approuter();

ar.beforeRequestHandler.use((req, res, next) => {
    let urlPrefixPosition = req.url.indexOf('/odata/v4');

    //If the request does not target the OData service, it might be the FileUploadService
    if (urlPrefixPosition === -1) {
        urlPrefixPosition = req.url.indexOf('/AvailabilityFileUploadService');
    }

    //If the request does not target the OData service, it might be the FileDownloadService
    if (urlPrefixPosition === -1) {
        urlPrefixPosition = req.url.indexOf('/AvailabilityFileDownloadService');
    }

    //If the request does not target the OData service, it might be the FileUploadService
    if (urlPrefixPosition === -1) {
        urlPrefixPosition = req.url.indexOf('/ServiceOrgUploadService');
    }

    //If the request does not target the OData service, it might be the FileDownloadService
    if (urlPrefixPosition === -1) {
        urlPrefixPosition = req.url.indexOf('/ServiceOrgDownloadService');
    }

    // If the request does not target anything, use the normal Approuter logic
    if (urlPrefixPosition === -1) {
        return next();
    }

    // Trim the URL to create an actual OData call
    req.url = req.url.substring(urlPrefixPosition);

    console.log('url' + req.url);
    // Proxy the request to the backend

    if (req.url.includes('ReplicationScheduleService')) {
        proxy.web(req, res, {
            target: 'http://localhost:8081/',
            auth: `${user}:${password}`
        }, error => {
            res.statusCode = 500;
            res.end(error.toString());
        });
    }
    else {
        proxy.web(req, res, {
            target: 'http://localhost:8080/',
            auth: `${user}:${password}`
        }, error => {
            res.statusCode = 500;
            res.end(error.toString());
        });
    }

});

ar.start();
