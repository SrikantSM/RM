const { expect } = require('chai');
const proxyquire = require('proxyquire');
const nock = require('nock');

const onboardingUtils = proxyquire('../src/onboarding-utils', {});

const loggerStub = {
  info: () => {},
  error: () => {}, // console.error.bind(console)
};

const expectedHeaders = {
  authorization: 'auth',
  'x-correlationid': 'corrId',
};

describe('onboarding-utils', () => {
  describe('getDomainDependencies', () => {
    beforeEach(() => {
      nock('http://test-skill', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '["d1"]');
      nock('http://test-assignment', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/dependencies').reply(200, '["d2"]');
    });
    it('behaves correctly without service', async () => {
      process.env.destinations = '[{"name": "invalid", "url": "http://test-skill"}]';
      const dependencies = await onboardingUtils.getDomainDependencies(loggerStub, 'auth', 'corrId');
      expect(dependencies).to.deep.equal([]);
    });
    it('behaves correctly with one service', async () => {
      process.env.destinations = '[{"name": "skill-srv-api", "url": "http://test-skill"}]';
      const dependencies = await onboardingUtils.getDomainDependencies(loggerStub, 'auth', 'corrId');
      expect(dependencies).to.deep.equal(['d1']);
    });
    it('behaves correctly with multiple services', async () => {
      process.env.destinations = '[{"name": "skill-srv-api", "url": "http://test-skill"}, {"name": "assignment-srv-api", "url": "http://test-assignment"}]';
      const dependencies = await onboardingUtils.getDomainDependencies(loggerStub, 'auth', 'corrId');
      expect(dependencies).to.deep.equal(['d1', 'd2']);
    });
  });

  describe('forwardOnSubscriptionRequest', () => {
    beforeEach(() => {
      process.env.destinations = '[{"name": "skill-srv-api", "url": "http://test-skill"}]';
      nock('http://test-skill', { reqheaders: expectedHeaders }).put('/mt/v1.0/subscriptions/tenants/tenantId', 'body').reply(200, 'subscribe');
      nock('http://test-skill', { reqheaders: expectedHeaders }).delete('/mt/v1.0/subscriptions/tenants/tenantId').reply(200, 'unsubscribe');
      nock('http://test-skill', { reqheaders: expectedHeaders }).get('/mt/v1.0/subscriptions/tenants/tenantId').reply(400, 'bad');
    });

    it('forwards PUT correctly', async () => {
      const result = await onboardingUtils.forwardOnSubscriptionRequest(loggerStub, 'auth', 'corrId', 'PUT', 'tenantId', 'body');
      expect(result).to.equal('subscribe');
    });

    it('forwards DELETE correctly', async () => {
      const result = await onboardingUtils.forwardOnSubscriptionRequest(loggerStub, 'auth', 'corrId', 'DELETE', 'tenantId', 'body');
      expect(result).to.equal('unsubscribe');
    });

    it('forwards other requests like GET correctly', async () => {
      try {
        await onboardingUtils.forwardOnSubscriptionRequest(loggerStub, 'auth', 'corrId', 'GET', 'tenantId', 'body');
        expect(false, 'should throw').to.be.true;
      } catch (error) {
        expect(error.status).to.equal(400);
      }
    });
  });

  describe('removeDuplicatedDependencies', () => {
    it('works in the empty case', () => {
      const input = [];
      const expected = [];
      const output = onboardingUtils.removeDuplicatedDependencies(input);
      expect(output).to.deep.equal(expected);
    });
    it('works in the non-duplicated case', () => {
      const input = [{ xsappname: 't1' }, { xsappname: 't2' }, { appId: 'a', appName: 'aa' }, { appId: 'b', appName: 'bb' }];
      const expected = [{ xsappname: 't1' }, { xsappname: 't2' }, { appId: 'a', appName: 'aa' }, { appId: 'b', appName: 'bb' }];
      const output = onboardingUtils.removeDuplicatedDependencies(input);
      expect(output).to.deep.equal(expected);
    });
    it('works in the duplicated case', () => {
      const input = [{ xsappname: 't1' }, { xsappname: 't1' }, { appId: 'a', appName: 'aa' }, { appId: 'a', appName: 'aa' }];
      const expected = [{ xsappname: 't1' }, { appId: 'a', appName: 'aa' }];
      const output = onboardingUtils.removeDuplicatedDependencies(input);
      expect(output).to.deep.equal(expected);
    });
  });
});
