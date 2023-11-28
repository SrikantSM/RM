const http = require('http');
const https = require('https');
const url = require('url');

const { requestFailureTimeoutMs } = require('./constants');

/**
 * Parses and returns the destinations contained in the environment
 * @param {*} logger to log messages
 * @returns {{name: string, url: string}[]} destinations contained in the environment
 */
function getDestinations(logger) {
  try {
    return JSON.parse(process.env.destinations);
  } catch (err) {
    logger.error('Destinations could not be parsed from the process environment', err);
    return [];
  }
}

/**
 * Executes an HTTP request against a given URL and retries a given amount of times when it failed
 * @param {*} logger to log messages
 * @param {number} retries that the request should be send with
 * @param {string} urlString to send the request to
 * @param {any} options should at least contain the method information
 * @param {any} body will be sent to the server when set
 * @returns {Promise<string>} representing the HTTP response
 */
async function requestWithRetries(logger, retries, urlString, options, body) {
  for (let i = 0; i <= retries; i += 1) {
    try {
      logger.info(`Requesting ${urlString}, ${retries - i} retries left`);
      return await request(urlString, options, body);
    } catch (err) {
      logger.error(`Error while trying to request ${urlString}`, err);
      if (i >= retries) {
        throw err;
      }
      logger.info(`Waiting ${requestFailureTimeoutMs} ms until trying requesting ${urlString} again`);
      await new Promise((resolve) => setTimeout(resolve, requestFailureTimeoutMs));
    }
  }
  throw new Error();
}

/**
 * Executes an HTTP request against a given URL
 * @param {string} urlString to send the request to
 * @param {any} additionalOptions should at least contain the method information
 * @param {any} body will be sent to the server when set
 * @returns {Promise<string>} representing the HTTP response
 */
async function request(urlString, additionalOptions, body) {
  return new Promise((resolve, reject) => {
    const {
      protocol, pathname, hostname, port,
    } = url.parse(urlString, true);

    const options = {
      ...additionalOptions,
      path: pathname,
      host: hostname,
      port,
    };

    if (body !== null && body !== undefined) {
      options.headers = {
        ...options.headers,
        'Content-Length': body.length,
      };
    }

    const httpRequest = (protocol.startsWith('https') ? https : http).request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode < 300) {
          resolve(data);
        } else {
          const error = new Error(data);
          error.status = response.statusCode;
          reject(error);
        }
      });
    });

    httpRequest.on('error', (err) => {
      reject(err);
    });

    if (body !== null && body !== undefined) {
      httpRequest.write(body);
    }

    httpRequest.end();
  });
}

const minimalDefaultLogger = {
  info: (...args) => console.info(...args), // eslint-disable-line no-console
  error: (...args) => console.error(...args), // eslint-disable-line no-console
};

module.exports.getDestinations = getDestinations;
module.exports.request = request;
module.exports.requestWithRetries = requestWithRetries;
module.exports.minimalDefaultLogger = minimalDefaultLogger;
