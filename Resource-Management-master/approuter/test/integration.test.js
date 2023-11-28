const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const xsenv = require('@sap/xsenv');
const proxyquire = require('proxyquire');
const path = require('path');

const subscriptionUtils = require('@sap/approuter/lib/utils/subscription-utils');

const onboardingMiddleware = proxyquire('../src/onboarding-middleware', {
  '@sap/approuter/lib/utils/subscription-utils': subscriptionUtils,
});

const loggingContext = {
  getLogger: () => ({
    info: () => {},
    error: () => {}, // console.error.bind(console)
  }),
};

const expectedHeaders = {
  authorization: 'auth',
  'x-correlationid': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
};

function makeFakeReqResNext(url, method = 'GET', body) {
  const req = {
    method,
    headers: {
      authorization: 'auth',
    },
    body,
    loggingContext,
    url,
  };
  const res = {
    end: sinon.spy(),
    setHeader: sinon.spy(),
  };
  const next = sinon.spy();
  return {
    req,
    res,
    next,
  };
}

describe('integration tests', () => {
  beforeEach(() => {
    subscriptionUtils.checkScopes = (req, callback) => setImmediate(() => callback(null, true));
    xsenv.loadEnv(path.resolve(__dirname, 'test-env.json'));
  });

  describe('getDependencies Call', () => {
    it('responds correctly when everything is ok', async () => {
      nock('https://test-assignment', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep1"}]');
      nock('https://test-consultant-profile', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[]');
      nock('https://test-resource-request', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep1"}, {"xsappname":"dep2"}]');
      nock('https://test-skill', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep3"}]');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/dependencies?tenantId=97079a0e-a483-4daf-952e-c9a63aebaf54');
      await onboardingMiddleware(req, res, next);
      expect(res.end.called, 'res.end() called').to.be.true;
      expect(JSON.parse(res.end.firstCall.args[0])).to.deep.equal([{
        appId: 'destination',
        appName: 'destination',
      }, {
        appId: 'mt_dependency2',
        appName: 'mt_dependency2',
      }, {
        xsappname: 'mt_dependency3',
      }, {
        xsappname: 'dep3',
      }, {
        xsappname: 'dep1',
      }, {
        xsappname: 'dep2',
      },
      {
        xsappname: 'auditlog',
      }]);
    });

    it('responds correctly when a domain fails once', async () => {
      nock('https://test-assignment', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(500, 'bad');
      nock('https://test-assignment', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep1"}]');
      nock('https://test-consultant-profile', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[]');
      nock('https://test-resource-request', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep1"}, {"xsappname":"dep2"}]');
      nock('https://test-skill', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep3"}]');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/dependencies?tenantId=97079a0e-a483-4daf-952e-c9a63aebaf54');
      await onboardingMiddleware(req, res, next);
      expect(res.end.called, 'res.end() called').to.be.true;
      expect(JSON.parse(res.end.firstCall.args[0])).to.deep.equal([{
        appId: 'destination',
        appName: 'destination',
      }, {
        appId: 'mt_dependency2',
        appName: 'mt_dependency2',
      }, {
        xsappname: 'mt_dependency3',
      }, {
        xsappname: 'dep3',
      }, {
        xsappname: 'dep1',
      }, {
        xsappname: 'dep2',
      },
      {
        xsappname: 'auditlog',
      }]);
    });

    it('fails correctly when a domain fails thrice', async () => {
      nock('https://test-assignment', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').times(3).reply(500, 'bad');
      nock('https://test-consultant-profile', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[]');
      nock('https://test-resource-request', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep1"}, {"xsappname":"dep2"}]');
      nock('https://test-skill', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep3"}]');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/dependencies?tenantId=97079a0e-a483-4daf-952e-c9a63aebaf54');
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].message).to.equal('bad');
    });

    it('fails correctly when a domain sends an invalid response', async () => {
      nock('https://test-assignment', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, 'bad');
      nock('https://test-consultant-profile', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[]');
      nock('https://test-resource-request', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep1"}, {"xsappname":"dep2"}]');
      nock('https://test-skill', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '[{"xsappname":"dep3"}]');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/dependencies?tenantId=97079a0e-a483-4daf-952e-c9a63aebaf54');
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].message).to.equal('Unexpected token b in JSON at position 0');
    });

    it('fails correctly when authorization fails', async () => {
      const error = new Error('bad auth');
      error.statuscode = 403;
      subscriptionUtils.checkScopes = (req, callback) => setImmediate(() => callback(error, null));
      const { req, res, next } = makeFakeReqResNext('/changed/callback/dependencies?tenantId=97079a0e-a483-4daf-952e-c9a63aebaf54');
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].status).to.equal(403);
    });
  });

  describe('onSubscription PUT call', () => {
    it('responds correctly in the working case', async () => {
      nock('https://test-skill', { reqheaders: expectedHeaders }).put('/mt/v1.0/subscriptions/tenants/tenantId', '{}').reply(200, 'subscribe');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/tenants/tenantId', 'PUT', {});
      await onboardingMiddleware(req, res, next);
      expect(res.end.called, 'res.end() called').to.be.true;
      expect(res.end.firstCall.args[0]).to.equal('subscribe');
    });

    it('fails correctly when the responsible service fails', async () => {
      nock('https://test-skill', { reqheaders: expectedHeaders }).put('/mt/v1.0/subscriptions/tenants/tenantId', '{}').reply(500, 'bad');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/tenants/tenantId', 'PUT', {});
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].status).to.equal(500);
    });

    it('fails correctly when authorization fails', async () => {
      const error = new Error('bad auth');
      error.statuscode = 403;
      subscriptionUtils.checkScopes = (req, callback) => setImmediate(() => callback(error, null));
      const { req, res, next } = makeFakeReqResNext('/changed/callback/tenants/tenantId', 'PUT', {});
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].status).to.equal(403);
    });
  });

  describe('onSubscription DELETE call', () => {
    it('responds correctly in the working case', async () => {
      nock('https://test-skill', { reqheaders: expectedHeaders }).delete('/mt/v1.0/subscriptions/tenants/tenantId', '{}').reply(200, 'unsubscribe');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/tenants/tenantId', 'DELETE', {});
      await onboardingMiddleware(req, res, next);
      expect(res.end.called, 'res.end() called').to.be.true;
      expect(res.end.firstCall.args[0]).to.equal('unsubscribe');
    });

    it('fails correctly when the responsible service fails', async () => {
      nock('https://test-skill', { reqheaders: expectedHeaders }).delete('/mt/v1.0/subscriptions/tenants/tenantId', '{}').reply(500, 'bad');
      const { req, res, next } = makeFakeReqResNext('/changed/callback/tenants/tenantId', 'DELETE', {});
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].status).to.equal(500);
    });

    it('fails correctly when authorization fails', async () => {
      const error = new Error('bad auth');
      error.statuscode = 403;
      subscriptionUtils.checkScopes = (req, callback) => setImmediate(() => callback(error, null));
      const { req, res, next } = makeFakeReqResNext('/changed/callback/tenants/tenantId', 'DELETE', {});
      await onboardingMiddleware(req, res, next);
      expect(next.called, 'next() called').to.be.true;
      expect(next.firstCall.args[0].status).to.equal(403);
    });
  });

  describe('other calls', () => {
    it('should pass through the middleware', async () => {
      const { req, res, next } = makeFakeReqResNext('/some/other/path');
      await onboardingMiddleware(req, res, next);
      expect(res.end.called, 'res.end() not called').to.be.false;
      expect(next.called, 'next() called').to.be.true;
    });
  });
});
