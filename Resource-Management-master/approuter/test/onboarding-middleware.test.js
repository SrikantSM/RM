const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const getSaaSRegistryCallbackPathStub = sinon.stub().returns({
  getDependenciesPath: 'some/path/dependencies',
  onSubscriptionPrefix: 'some/path/subscription',
});
const checkScopesStub = sinon.stub().callsFake((req, callback) => setImmediate(() => callback(null, true)));
const getSaaSRegistryDependenciesStub = sinon.stub().callsFake((req, callback) => setImmediate(() => callback(null, ['d1, d2'])));
const subscriptionUtils = {
  getSaaSRegistryCallbackPath: getSaaSRegistryCallbackPathStub,
  checkScopes: checkScopesStub,
  getSaaSRegistryDependencies: getSaaSRegistryDependenciesStub,
};

const getDomainDependenciesStub = sinon.stub().returns(['d2', 'd3']);
const removeDuplicatedDependenciesStub = sinon.stub().returns('d1', 'd2', 'd3');
const forwardOnSubscriptionRequestStub = sinon.stub().returns(Promise.resolve());
const onboardingUtils = {
  getDomainDependencies: getDomainDependenciesStub,
  removeDuplicatedDependencies: removeDuplicatedDependenciesStub,
  forwardOnSubscriptionRequest: forwardOnSubscriptionRequestStub,
};

const loggingContext = {
  getLogger: () => ({
    info: () => {},
    error: () => {}, // console.error.bind(console)
  }),
};

const onboardingMiddleware = proxyquire('../src/onboarding-middleware', {
  '@sap/approuter/lib/utils/subscription-utils': subscriptionUtils,
  './onboarding-utils': onboardingUtils,
});

function makeFakeReqResNext(url) {
  const req = {
    headers: {},
    loggingContext,
    url,
    body: {},
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

describe('onboarding-middleware', () => {
  afterEach(() => {
    checkScopesStub.resetHistory();
    getSaaSRegistryCallbackPathStub.resetHistory();
    getSaaSRegistryDependenciesStub.resetHistory();
    getDomainDependenciesStub.resetHistory();
    removeDuplicatedDependenciesStub.resetHistory();
    forwardOnSubscriptionRequestStub.resetHistory();
  });

  describe('getDependencies', () => {
    it('calls all methods in other modules and responds correctly', async () => {
      const {
        req,
        res,
        next,
      } = makeFakeReqResNext('some/path/dependencies');
      await onboardingMiddleware(req, res, next);
      // check all spies
      expect(getSaaSRegistryCallbackPathStub.called, 'getCallbackPath called').to.be.true;
      expect(checkScopesStub.called, 'checkScopes called').to.be.true;
      expect(getSaaSRegistryDependenciesStub.called, 'getDependencies called').to.be.true;
      expect(getDomainDependenciesStub.called, 'getDomainDependencies called').to.be.true;
      expect(forwardOnSubscriptionRequestStub.called, 'forwardOnSubscriptionRequests not called').to.be.false;
      expect(res.setHeader.called, 'setHeader called').to.be.true;
      expect(res.end.called, 'end called').to.be.true;
      expect(next.called, 'next not called').to.be.false;
    });
  });

  describe('onSubscription', () => {
    it('calls all methods in other modules and responds correctly', async () => {
      const {
        req,
        res,
        next,
      } = makeFakeReqResNext('some/path/subscription/97079a0e-a483-4daf-952e-c9a63aebaf54');
      await onboardingMiddleware(req, res, next);
      // check all spies
      expect(getSaaSRegistryCallbackPathStub.called, 'getCallbackPath called').to.be.true;
      expect(checkScopesStub.called, 'checkScopes called').to.be.true;
      expect(getSaaSRegistryDependenciesStub.called, 'getDependencies not called').to.be.false;
      expect(getDomainDependenciesStub.called, 'getDomainDependencies not called').to.be.false;
      expect(forwardOnSubscriptionRequestStub.called, 'forwardOnSubscriptionRequests called').to.be.true;
      expect(res.setHeader.called, 'setHeader called').to.be.true;
      expect(res.end.called, 'end called').to.be.true;
      expect(next.called, 'next not called').to.be.false;
    });

    it('calls failure methods correctly when tenant ID is missing', async () => {
      const {
        req,
        res,
        next,
      } = makeFakeReqResNext('some/path/subscription/');
      await onboardingMiddleware(req, res, next);
      // check all spies
      expect(getSaaSRegistryCallbackPathStub.called, 'getCallbackPath called').to.be.true;
      expect(checkScopesStub.called, 'checkScopes called').to.be.true;
      expect(getSaaSRegistryDependenciesStub.called, 'getDependencies not called').to.be.false;
      expect(getDomainDependenciesStub.called, 'getDomainDependencies not called').to.be.false;
      expect(forwardOnSubscriptionRequestStub.called, 'forwardOnSubscriptionRequests not called').to.be.false;
      expect(res.setHeader.called, 'setHeader not called').to.be.false;
      expect(res.end.called, 'end not called').to.be.false;
      expect(next.called, 'next called').to.be.true;
      expect(next.firstCall.args[0].status, 'next called with a error status 400').to.equal(400);
    });
  });

  describe('other route', () => {
    it('calls all methods in other modules and responds correctly', async () => {
      const {
        req,
        res,
        next,
      } = makeFakeReqResNext('some/other/path');
      await onboardingMiddleware(req, res, next);
      // check all spies
      expect(getSaaSRegistryCallbackPathStub.called, 'getCallbackPath called').to.be.true;
      expect(checkScopesStub.called, 'checkScopes not called').to.be.false;
      expect(getSaaSRegistryDependenciesStub.called, 'getDependencies not called').to.be.false;
      expect(getDomainDependenciesStub.called, 'getDomainDependencies not called').to.be.false;
      expect(forwardOnSubscriptionRequestStub.called, 'forwardOnSubscriptionRequests not called').to.be.false;
      expect(res.setHeader.called, 'setHeader not called').to.be.false;
      expect(res.end.called, 'end not called').to.be.false;
      expect(next.called, 'next called').to.be.true;
      expect(next.firstCall.args[0], 'next called without arguments').to.be.undefined;
    });
  });

  describe('error', () => {
    it('calls all methods in other modules and responds correctly', async () => {
      getSaaSRegistryCallbackPathStub.throws(); // change stub behavior
      const {
        req,
        res,
        next,
      } = makeFakeReqResNext('some/other/path');
      await onboardingMiddleware(req, res, next);
      // check all spies
      expect(getSaaSRegistryCallbackPathStub.called, 'getCallbackPath called').to.be.true;
      expect(checkScopesStub.called, 'checkScopes not called').to.be.false;
      expect(getSaaSRegistryDependenciesStub.called, 'getDependencies not called').to.be.false;
      expect(getDomainDependenciesStub.called, 'getDomainDependencies not called').to.be.false;
      expect(forwardOnSubscriptionRequestStub.called, 'forwardOnSubscriptionRequests not called').to.be.false;
      expect(res.setHeader.called, 'setHeader not called').to.be.false;
      expect(res.end.called, 'end not called').to.be.false;
      expect(next.called, 'next called').to.be.true;
      expect(next.firstCall.args[0], 'next called with error').to.not.be.undefined;
      // reset stub behavior
      getSaaSRegistryCallbackPathStub.returns({
        getDependenciesPath: 'some/path/dependencies',
        onSubscriptionPrefix: 'some/path/subscription',
      });
    });
  });
});
