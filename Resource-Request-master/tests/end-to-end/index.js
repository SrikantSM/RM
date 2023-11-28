const { setupTestData, teardownTestData } = require('./data');

const aSteps = [
    'CreateAndPublishResourceRequest',
    'DispatchResourceRequest',
    'SearchCandidates',
    'CheckAssignedCandidates',
    'WithdrawAndDeleteResourceRequests'
];

/**
 * Execute a test with a given step id
 * @param {string} sStep the ID of the step in the scenario to be executed
 * @param {Object} testHelper Object of testHelper passed from RM level
 */
function executeTest(sStep, testHelper) {
    if (!aSteps.includes(sStep)) {
        throw new Error('E2E Step not defined');
    }
    const test = require('./tests/' + sStep + '.js');
    test.executeTest(testHelper);
}

module.exports.executeTest = executeTest;
module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
