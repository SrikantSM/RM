const sinon = require('sinon');
const proxyquire = require('proxyquire');
const uuid = require('uuid').v4;
const { expect } = require('chai');

const loginLogger = proxyquire('../src/login-logger', {});

describe('login-logger', () => {
  describe('onLogin', () => {
    it('writes a log', async () => {
      const accessToken = uuid();

      const loggingContext = {
        info: sinon.spy(),
        error: sinon.spy(),
      };
      const getLogger = () => loggingContext;

      const session = {
        user: { token: { accessToken } },
        req: { loggingContext: { getLogger } },
      };
      await loginLogger.onLogin(session);

      expect(loggingContext.info.called).to.be.true;
      expect(loggingContext.error.called).to.be.false;
    });
  });
});
