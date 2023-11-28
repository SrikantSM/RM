const approuter = require('@sap/approuter');
const httpProxy = require('http-proxy');

// Authentication properties, should be inline with mock-user from srv/src/main/resources/application.yaml
const user = 'authenticated-user';
const password = 'pass';

const proxy = httpProxy.createProxyServer();
const ar = approuter();

ar.beforeRequestHandler.use((req, res, next) => {
  let urlPrefixPosition = req.url.indexOf('/odata/v4');


  // If the request does not target anything, use the normal Approuter logic
  if (urlPrefixPosition === -1) {
    return next();
  }

  // Trim the URL to create an actual OData call
  req.url = req.url.substring(urlPrefixPosition);

  // Proxy the request to the backend
  proxy.web(req, res, {
    target: 'http://localhost:8080/',
    auth: `${user}:${password}`
  }, error => {
    res.statusCode = 500;
    res.end(error.toString());
  });
});

ar.start();
