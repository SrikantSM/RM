const { expect } = require('chai');
const proxyquire = require('proxyquire');
const nock = require('nock');

const utils = proxyquire('../src/utils', {});

const loggerStub = {
  info: () => {},
  error: () => {}, // console.error.bind(console)
};

describe('utils', () => {
  describe('requestWithRetries', () => {
    it('succeeds on first try success, passing headers', async () => {
      const reqheaders = { 'x-testheader': 'testheader' };
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(200, 'resp');
      const options = {
        method: 'PATCH',
        headers: reqheaders,
      };
      const res = await utils.requestWithRetries(loggerStub, 2, 'http://test/test', options, 'body');
      expect(res).to.equal('resp');
    });
    it('succeeds on third try success, passing headers', async () => {
      const reqheaders = { 'x-testheader': 'testheader' };
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(400, 'bad');
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(400, 'bad');
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(200, 'resp');
      const options = {
        method: 'PATCH',
        headers: reqheaders,
      };
      const res = await utils.requestWithRetries(loggerStub, 2, 'http://test/test', options, 'body');
      expect(res).to.equal('resp');
    });
    it('fails on no success', async () => {
      const reqheaders = { 'x-testheader': 'testheader' };
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(400, 'bad');
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(400, 'bad');
      nock('http://test', { reqheaders }).patch('/test', 'body').reply(400, 'bad');
      const options = {
        method: 'PATCH',
        headers: reqheaders,
      };
      try {
        await utils.requestWithRetries(loggerStub, 2, 'http://test/test', options, 'body');
        expect(false, 'should throw').to.be.true;
      } catch (error) {
        expect(error.status).to.equal(400);
      }
    });
  });
});
