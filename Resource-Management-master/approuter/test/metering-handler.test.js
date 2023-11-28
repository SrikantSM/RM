const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const proxyquire = require('proxyquire');
const uuid = require('uuid').v4;
const { meteringDestination, meteringEndpoint } = require('../src/constants');

const meteringHandler = proxyquire('../src/metering-handler', {});

function createMocks(backendReturnCode, backendMockCount = 1) {
  const accessToken = uuid();

  const meteringMockUrl = 'http://test-metering';
  process.env.destinations = `[{"name": "${meteringDestination}", "url": "${meteringMockUrl}"}]`;

  const expectedHeaders = { authorization: `Bearer ${accessToken}` };
  const expectedBody = JSON.stringify({ token: accessToken });
  const nockScope = nock(meteringMockUrl, { reqheaders: expectedHeaders }).post(meteringEndpoint, expectedBody).times(backendMockCount).reply(backendReturnCode);

  const loggingContext = {
    info: sinon.spy(),
    error: sinon.spy(),
  };
  const getLogger = () => loggingContext;

  const session = {
    user: { token: { accessToken } },
    req: { loggingContext: { getLogger } },
  };

  return { nockScope, session, loggingContext };
}

describe('metering-handler', () => {
  describe('onLogin', () => {
    it('works in the normal case', async () => {
      // mock backend --> 200, env, session
      const { nockScope, session } = createMocks(200);
      // call and await handler
      await meteringHandler.onLogin(session);
      // expect backend to have been called with jwt
      expect(nockScope.isDone()).to.be.true;
    });

    it('retries, but doesn\'t fail when the service is not available', async () => {
      // mock backend --> 500, env, session incl. logging context with spies
      const { nockScope, session, loggingContext } = createMocks(500, 3);
      // call and await handler
      await meteringHandler.onLogin(session);
      // expect backend to have been called with jwt, expect logging mock to have been called for error
      expect(nockScope.isDone()).to.be.true;
      expect(loggingContext.error.calledWithMatch(/request/)).to.be.true;
    });

    it('just logs an error when no JWT is available', async () => {
      // mock backend --> 200, env, session incl. logging context with spies
      const { nockScope, session, loggingContext } = createMocks(200);
      delete session.user.token.accessToken;
      // call and await handler
      await meteringHandler.onLogin(session);
      // expect backend to have not been called, expect logging mock to have been called for error
      expect(nockScope.isDone()).to.be.false;
      expect(loggingContext.error.calledWithMatch(/token/)).to.be.true;
    });

    it('just logs an error when no destination is available', async () => {
      // mock backend --> 200, env, session incl. logging context with spies
      const { nockScope, session, loggingContext } = createMocks(200);
      delete process.env.destinations;
      // call and await handler
      await meteringHandler.onLogin(session);
      // expect backend to have not been called, expect logging mock to have been called for error
      expect(nockScope.isDone()).to.be.false;
      expect(loggingContext.error.calledWithMatch(/destination/)).to.be.true;
    });
  });
});
