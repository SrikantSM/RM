const { expect } = require('chai');
const sinon = require('sinon');
const { promisify } = require('util');
const proxyquire = require('proxyquire');
const xsenv = require('@sap/xsenv');
const path = require('path');

const subscriptionUtils = require('@sap/approuter/lib/utils/subscription-utils');

describe('subscription-utils', () => {
  beforeEach(() => {
    xsenv.loadEnv(path.resolve(__dirname, 'empty-env.json'));
  });

  describe('getCallbackPath', () => {
    it('returns an object with the right properties', () => {
      const callbackPath = subscriptionUtils.getSaaSRegistryCallbackPath();
      expect(callbackPath.getDependenciesPath).to.not.be.undefined;
      expect(callbackPath.onSubscriptionPrefix).to.not.be.undefined;
    });

    it('returns the correct values in the default case', () => {
      const callbackPath = subscriptionUtils.getSaaSRegistryCallbackPath();
      expect(callbackPath.getDependenciesPath).to.equal('/callback/v1.0/dependencies');
      expect(callbackPath.onSubscriptionPrefix).to.equal('/callback/v1.0/tenants');
    });

    it('adapts paths depending on VCAP_SERVICES', () => {
      xsenv.loadEnv(path.resolve(__dirname, 'test-env.json'));
      const callbackPath = subscriptionUtils.getSaaSRegistryCallbackPath();
      expect(callbackPath.getDependenciesPath).to.equal('/changed/callback/dependencies');
      expect(callbackPath.onSubscriptionPrefix).to.equal('/changed/callback/tenants');
    });
  });

  describe('checkScopes', async () => {
    const req = {
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    };
    let xssecStub;

    afterEach(() => {
      if (xssecStub) {
        xssecStub.restore();
      }
    });

    it('rejects when token validation fails', async () => {
      xsenv.loadEnv(path.resolve(__dirname, 'test-env.json'));
      try {
        await promisify(subscriptionUtils.checkScopes)(req);
        expect(false, 'should throw').to.be.true;
      } catch (error) {
        expect(error.statuscode, 'should throw 401').to.equal(401);
      }
    });

    // Real token validation is too hard, as we'd need to create validly signed tokens. Instead, we mock the public interface of xssec
    it('rejects when scopes are not present', async () => {
      const mockCtx = {
        checkLocalScope: sinon.stub().returns(false),
      };
      const stubbedSubscriptionUtils = proxyquire('@sap/approuter/lib/utils/subscription-utils', {
        '@sap/xssec': {
          createSecurityContext: (token, credentials, callback) => callback(null, mockCtx),
        },
      });
      try {
        await promisify(stubbedSubscriptionUtils.checkScopes)(req);
        expect(false, 'should throw').to.be.true;
      } catch (error) {
        expect(error.status, 'should throw 403').to.equal(403);
      }
      expect(mockCtx.checkLocalScope.called, 'checkLocalScope called').to.be.true;
    });

    it('returns true when scopes are present', async () => {
      const mockCtx = {
        checkLocalScope: sinon.stub().returns(true),
      };
      const stubbedSubscriptionUtils = proxyquire('@sap/approuter/lib/utils/subscription-utils', {
        '@sap/xssec': {
          createSecurityContext: (token, credentials, callback) => callback(null, mockCtx),
        },
      });
      expect(await promisify(stubbedSubscriptionUtils.checkScopes)(req)).to.be.true;
      expect(mockCtx.checkLocalScope.called, 'checkLocalScope called').to.be.true;
    });
  });

  describe('getDependencies', () => {
    it('returns the correct dependencies', async () => {
      xsenv.loadEnv(path.resolve(__dirname, 'test-env.json'));
      const result = await promisify(subscriptionUtils.getSaaSRegistryDependencies)(null);
      expect(result).to.deep.equal([{
        appId: 'destination',
        appName: 'destination',
      },
      {
        appId: 'mt_dependency2',
        appName: 'mt_dependency2',
      },
      {
        xsappname: 'mt_dependency3',
      },
      ]);
    });
  });
});
