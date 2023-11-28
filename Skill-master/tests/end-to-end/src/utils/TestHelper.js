const uuid = require('uuid').v4;
const remote = require('selenium-webdriver/remote');
const utils = require('.');
const loginHelper = require('../../../uiveri5-pages/LoginHelper');
const urlUtils = require('../../../uiveri5-pages/UrlUtils');

class TestHelper {
  constructor() {
    this.utils = utils;
    this.testData = {};
    this.testRunID = uuid();

    this.failedOne = false;
    this.failedLast = false;
    const customReporter = {
      specDone: (result) => {
        if (result && result.failedExpectations && result.failedExpectations.length > 0) {
          this.failedOne = true;
          this.failedLast = true;
        } else {
          this.failedLast = false;
        }
      },
    };
    jasmine.getEnv().addReporter(customReporter);

    // Register selenium file detector to allow a remote test execution with file uploads
    browser.setFileDetector(new remote.FileDetector());
  }

  /**
   * Perform Login Operation
   * @param {string} role Role Name to be used, e.g. ConfigurationExpert
   * @returns {undefined}
   */
  loginWithRole(role) {
    loginHelper.loginWithCredentials(browser.testrunner.config.params.appUsers.get(role.toUpperCase()),
      browser.testrunner.config.params.appPasswords.get(role.toUpperCase()));
  }

  /**
   * Perform Logout Operation
   * @returns {undefined}
   */
  logout() {
    loginHelper.logout();
  }

  /**
   * Navigate to a given path
   *
   * @param {string} path e.g. /cp.portal/site#Skill-Display
   * @returns {*} the reutrn value of browser.get
   */
  navigateToPath(path) {
    return browser.get(urlUtils.getBaseOfUrl(browser.testrunner.config.params.appURL) + path);
  }
}

module.exports = new TestHelper();
