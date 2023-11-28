const remote = require('selenium-webdriver/remote');
const uuid = require('uuid').v4;
const utils = require('.');
const loginHelper = require('../tests/pages/LoginHelper.js');

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

    // Output all test data that had been created and torn down until now
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
     * @returns {*} nothing
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
     * @param {string} headerId ID of employee header to be passed for ResourceUI to navigation without tile
     * @returns {*} nothing
     */
    loginWithRole(role, headerId) {
        const username = browser.testrunner.config.params.appUsers.get(role.toUpperCase());
        const password = browser.testrunner.config.params.appPasswords.get(role.toUpperCase());
        it(`Should login with user ${username} and role ${role}`, () => {
            loginHelper.loginWithCredentials(username, password);
        });
    }

    // Perform Logout Operation
    logout() {
        it('Should logout', () => {
            loginHelper.logout(this.failedLast);
        });
    }
}

module.exports.TestHelper = TestHelper;
