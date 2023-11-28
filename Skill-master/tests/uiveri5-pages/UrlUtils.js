/**
 * @param {string} sUrl e.g. https://testHost/test/path
 * @returns {string} e.g. https://testHost
 */
module.exports.getBaseOfUrl = function (sUrl) {
  try {
    return sUrl.match(/^(https?:\/\/[^/]+).*$/)[1];
  } catch (err) {
    throw new Error(`Invalid URL "${sUrl}"`);
  }
};
