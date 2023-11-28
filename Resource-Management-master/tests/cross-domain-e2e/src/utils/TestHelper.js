const uuid = require('uuid').v4;
const remote = require('selenium-webdriver/remote');
const utils = require('.');

/**
 * @param {string} sUrl e.g. "https://testHost/test/path"
 * @returns {string} e.g. "https://testHost"
 */
function getBaseOfUrl(sUrl) {
  try {
    return sUrl.match(/^(https?:\/\/[^/]+).*$/)[1];
  } catch (err) {
    throw new Error(`Invalid URL "${sUrl}"`);
  }
}

/**
 * A class to support writing UIVeri5 tests
 * @property {TestEnvironment} utils An object giving access to all singleton instances such as database Repositories
 * @property {object} testData An object each domain can write containing the data that was created during their tests, so other domains can use that information
 * @property {string} testRunId A uuid that should be used to make elements on the UI distinct from one another for parallel test runs, i.e. Skill names, Project Role names, ...
 * @property {boolean} failedOne A boolean containing information wether any previous test has failed
 * @property {boolean} failedLast A boolean containing information wether the last test has failed
 */
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
     * Output all test data that had been created and torn down until now
     * @returns {undefined}
     */
  outputTestData() {
    // Output all test data that had been created and torn down during the tests
    Object.entries(this.testData).forEach(([domain, data]) => {
      console.log(domain);
      console.log('='.repeat(domain.length));
      Object.entries(data).forEach(([dataType, entries]) => {
        console.log(dataType);
        console.table(entries);
      });
    });
  }

  /**
     * Drop-in replacement for the normal `it()` function used to specify tests in.
     * When any previous test has failed, `failEarlyIt()` tests are not executed and instead just report an error
     * @param {string} sName Name of test case
     * @param {function} fnTest Test function to be executed
     * @returns {*} result of fnTest
     */
  failEarlyIt(sName, fnTest) {
    it(sName, () => {
      if (this.failedOne) {
        throw new Error('Failing due to previous error');
      }
      return fnTest();
    });
  }

  /**
     * Perform Login Operation
     * @param {string} role Role Name to be used, e.g. ConfigurationExpert
     * @returns {undefined}
     */
  loginWithRole(role) {
    const customIdpAuthConfig = {
      user: browser.testrunner.config.params.appUsers.get(role.toUpperCase()),
      pass: browser.testrunner.config.params.appPasswords.get(role.toUpperCase()),
      idpSelector: `a[href*="${browser.testrunner.config.params.idpHost}"], a[href*=ias]`,
      redirectUrl: /cp.portal\/site/,
    };

    const defaultIdpAuthConfig = {
      user: browser.testrunner.config.params.appUsers.get(role.toUpperCase()),
      pass: browser.testrunner.config.params.appPasswords.get(role.toUpperCase()),
      userFieldSelector: 'input[name="username"]',
      passFieldSelector: 'input[name="password"]',
      logonButtonSelector: '.island-button',
      redirectUrl: /cp.portal\/site/,
    };

    it(`should login as ${role}`, () => {
      browser.testrunner.navigation.to(
        browser.testrunner.config.params.appURL, {
          auth: { 'sapcloud-form': browser.testrunner.config.params.idpHost ? customIdpAuthConfig : defaultIdpAuthConfig },
        },
      );
    });
  }

  /**
     * Perform Logout Operation
     * @returns {Promise} with no value
     */
  logout() {
    it('should logout', async () => {
      if (this.failedLast) {
        // Explicitly refresh the whole page and even go through the redirect to close all open dialogs that may cause issues
        // browser.refresh does not work, browser.get has problems with redirect, so we need to do this bare metal
        // see https://github.com/sap/ui5-uiveri5/blob/master/docs/usage/browser.md#application-initiated-page-reload
        await browser.driver.get(`${getBaseOfUrl(browser.testrunner.config.params.appURL)}/cp.portal/`);
        await browser.testrunner.navigation.waitForRedirect(`${getBaseOfUrl(browser.testrunner.config.params.appURL)}/cp.portal/site#Shell-home`);
        await browser.loadUI5Dependencies();
      }
      // Logout via FLP
      await element(by.control({
        id: 'userActionsMenuHeaderButton',
      })).click();
      await element(by.control({
        controlType: 'sap.m.StandardListItem',
        id: /-logoutBtn/,
      })).click();
      await element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'OK' },
        ancestor: { controlType: 'sap.m.Dialog' },
      })).click();
      // low level browser api, as target page does not contain UI5
      await browser.driver.wait(
        () => browser.driver.findElements(by.css('.sapMMessagePage span[data-sap-ui-icon-content=\uE022]')).then((el) => !!el.length),
        browser.getPageTimeout, 'Waiting for logout to finish',
      );

      if (browser.testrunner.config.params.idpHost) {
        await browser.driver.get(`https://${browser.testrunner.config.params.idpHost}/oauth2/logout`);
        await browser.driver.wait(
          () => browser.driver.findElements(by.css('img[src*=ias]')).then((el) => !!el.length),
          browser.getPageTimeout, 'Waiting for logout from idp to finish',
        );
      }
    });
  }

  dataAssignmentName() {
    return this.testData.consultantProfile.profileDetails[0].firstName.concat(' ').concat(this.testData.consultantProfile.profileDetails[0].lastName);
  }

  dataResourceName() {
    return `${this.testData.consultantProfile.profileDetails[3].firstName} ${this.testData.consultantProfile.profileDetails[3].lastName}`;
  }
  dataResourceNameExternalId()
  {
    let resourceName=this.dataResourceName();
    let resourceExternalID = " (".concat(this.testData.consultantProfile.workforcePersons[3].externalID).concat(")");
    return resourceName.concat(resourceExternalID);
  }
}

module.exports.TestHelper = TestHelper;