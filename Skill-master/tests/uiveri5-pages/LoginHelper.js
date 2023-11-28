const urlUtils = require('./UrlUtils');

/**
   * Perform Login Operation
   * @param {string} username the username for login
   * @param {string} password the corresponding password
   * @returns {undefined}
   */
function loginWithCredentials(username, password) {
  const customIdpAuthConfig = {
    user: username,
    pass: password,
    idpSelector: `a[href*="${browser.testrunner.config.params.idpHost}"]`,
    redirectUrl: /cp.portal\/site/,
  };

  it(`should login with user ${username}`, () => {
    browser.testrunner.navigation.to(
      browser.testrunner.config.params.appURL, {
        auth: { 'sapcloud-form': customIdpAuthConfig },
      },
    );
  });
}

/**
   * Perform Logout Operation
   * @returns {undefined}
   */
function logout() {
  it('should logout', async () => {
    if (this.failedLast) {
      // Explicitly refresh the whole page and even go through the redirect to close all open dialogs that may cause issues
      // browser.refresh does not work, browser.get has problems with redirect, so we need to do this bare metal
      // see https://github.com/sap/ui5-uiveri5/blob/master/docs/usage/browser.md#application-initiated-page-reload
      await browser.driver.get(`${urlUtils.getBaseOfUrl(browser.testrunner.config.params.appURL)}/cp.portal/`);
      await browser.testrunner.navigation.waitForRedirect(`${urlUtils.getBaseOfUrl(browser.testrunner.config.params.appURL)}/cp.portal/site#Shell-home`);
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
    // low level browser api, as uiveri5 is not loaded in the target page
    await browser.driver.wait(
      () => browser.driver.findElements(by.css('.sapMMessagePage span[data-sap-ui-icon-content=\uE022]')).then((el) => !!el.length), // E022 is the unicode codepoint of the logout icon
      browser.getPageTimeout, 'Waiting for logout to finish',
    );
  });
}

module.exports.logout = logout;
module.exports.loginWithCredentials = loginWithCredentials;
