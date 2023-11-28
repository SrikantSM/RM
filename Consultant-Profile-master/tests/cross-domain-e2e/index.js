const { setupTestData, teardownTestData } = require('./data');

const aSteps = [
    'Demoflow-2-ManageProjectRoleDataCleanup',
    'Demoflow-2-ManageProjectRoles',
    'Demoflow-2-MyProjectExperience',
    'Demoflow-2-MyProjectExperienceDataCleanup'
    // 'Demoflow-2-MyAssignments'
];

/**
 * Execute a test with a given step id
 * @param {string} sStep the ID of the step in the scenario to be executed
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
