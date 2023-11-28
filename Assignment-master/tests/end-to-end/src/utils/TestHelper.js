"use strict";

const remote = require("selenium-webdriver/remote");
const utils = require(".");
const uuid = require("uuid").v4;

/**
 * @param {string} sUrl e.g. https://testHost/test/path
 * @returns {string} e.g. https://testHost
 */
function getBaseOfUrl(sUrl) {
	try {
		return sUrl.match(/^(https?:\/\/[^\/]+).*$/)[1];
	} catch (err) {
		throw new Error(`Invalid URL "${sUrl}"`);
	}
}

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
			}
		};
		jasmine.getEnv().addReporter(customReporter);

		// Register selenium file detector to allow a remote test execution with file uploads
		browser.setFileDetector(new remote.FileDetector());
	}
	/**
	 * Replaced the normal `it()` function that is used to specify tests with custom 'it()'
	 * Before proceeding for the current test, custom `it()` checks if any previous test has failed then the current test is not executed and an error is thrown
	 * @param {string} sName Name of test case
	 * @param {function} fnTest Test function to be executed
	 * @returns {*} nothing
	 */
	it(sName, fnTest) {
		it(sName, () => {
			if (this.failedOne) {
				throw new Error("Failing As Preceding Test Failed");
			}
			return fnTest();
		});
	}
	/**
	 * Perform Login Operation
	 * @param {string} role Role Name to be used, e.g. ConfigurationExpert
	 */
	loginWithRole(role) {
		const customIdpAuthConfig = {
			user: browser.testrunner.config.params.appUsers.get(role.toUpperCase()),
			pass: browser.testrunner.config.params.appPasswords.get(role.toUpperCase()),
			idpSelector: `a[href*="${browser.testrunner.config.params.idpHost}"]`,
			redirectUrl: /cp.portal\/site/
		};

		// const defaultIdpAuthConfig = {
		//   user: browser.testrunner.config.params.appUsers.get(role.toUpperCase()),
		//   pass: browser.testrunner.config.params.appPasswords.get(role.toUpperCase()),
		//   userFieldSelector: 'input[name="username"]',
		//   passFieldSelector: 'input[name="password"]',
		//   logonButtonSelector: '.island-button',
		//   redirectUrl: /cp.portal\/site/,
		// };

		it("should login as " + role, () => {
			browser.testrunner.navigation.to(browser.testrunner.config.params.appURL, {
				auth: { "sapcloud-form": customIdpAuthConfig }
			});
		});
	}

	/**
	 * Perform Logout Operation
	 */
	logout() {
		it("should logout", async () => {
			if (this.failedLast) {
				// Explicitly refresh the whole page and even go through the redirect to close all open dialogs that may cause issues
				// browser.refresh does not work, browser.get has problems with redirect, so we need to do this bare metal
				// see https://github.com/sap/ui5-uiveri5/blob/master/docs/usage/browser.md#application-initiated-page-reload
				await browser.driver.get(getBaseOfUrl(browser.testrunner.config.params.appURL) + "/cp.portal/");
				await browser.testrunner.navigation.waitForRedirect(getBaseOfUrl(browser.testrunner.config.params.appURL) + "/cp.portal/site#Shell-home");
				await browser.loadUI5Dependencies();
			}
			// Logout via FLP
			await element(
				by.control({
					id: "userActionsMenuHeaderButton"
				})
			).click();
			await element(
				by.control({
					controlType: "sap.m.StandardListItem",
					id: /-logoutBtn/
				})
			).click();
			await element(
				by.control({
					controlType: "sap.m.Button",
					properties: { text: "OK" },
					ancestor: { controlType: "sap.m.Dialog" }
				})
			).click();
			// low level browser api, as uiveri5 is not loaded in the target page
			await browser.driver.wait(
				() =>
					Promise.all([
						browser.driver.findElements(by.css("img.clouds")),
						browser.driver.findElements(by.css(".sapMMessagePage span[data-sap-ui-icon-content=\uE022]"))
					]).then(([el1, el2]) => !!el1.length || !!el2.length), // allow both old and new logout screen
				browser.getPageTimeout,
				"Waiting for logout to finish"
			);

			// if (browser.testrunner.config.params.idpHost) {
			//   await browser.driver.get(`https://${browser.testrunner.config.params.idpHost}/oauth2/logout`);
			//   await browser.driver.wait(
			//     () => browser.driver.findElements(by.css('img[src*=ias]')).then((el) => !!el.length),
			//     browser.getPageTimeout, 'Waiting for logout from idp to finish',
			//   );
			// }
		});
	}
}

module.exports = new TestHelper();
