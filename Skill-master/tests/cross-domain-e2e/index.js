const { setupTestData, teardownTestData } = require('./data');

const aSteps = [
  'Demoflow-B',
];

/**
 * Execute a test with a given step id
 * @param {string} sStep the ID of the step in the scenario to be executed
 * @param {*} testHelper to be used in this test
 * @returns {undefined}
 */
function executeTest(sStep, testHelper) {
  if (!aSteps.includes(sStep)) {
    throw new Error('E2E Step not defined');
  }
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const test = require(`./tests/${sStep}.js`);
  test.executeTest(testHelper);
}

module.exports.executeTest = executeTest;
module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
