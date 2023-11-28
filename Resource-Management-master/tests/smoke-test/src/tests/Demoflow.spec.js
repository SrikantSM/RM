require('jasmine');

// const SkillDomain = require('skill');

const ConsultantProfileDomain = require('consultantProfile');

const ResourceRequestDomain = require('resourceRequest');

const AssignmentDomain = require('assignment');

// const CentralServicesDomain = require('centralServices');

const { TestHelper } = require('../utils/TestHelper');

describe('Demoflow', () => {
  const testHelper = new TestHelper();

  async function setupTestData() {
    try {
      // await SkillDomain.setupTestData(testHelper);
      // console.log('SkillDomain test data is loaded.');
      await ConsultantProfileDomain.setupTestData(testHelper);
      console.log('ConsultantProfileDomain test data is loaded.');
      await ResourceRequestDomain.setupTestData(testHelper);
      console.log('ResourceRequestDomain test data is loaded');
      await AssignmentDomain.setupTestData(testHelper);
      console.log('AssignmentDomain test data is loaded');
      // await CentralServicesDomain.setupTestData(testHelper);
      // console.log('CentralServicesDomain test data is loaded');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  async function teardownTestData() {
    try {
      // await SkillDomain.teardownTestData(testHelper);
      // console.log('SkillDomain test data is deleted.');
      await ConsultantProfileDomain.teardownTestData(testHelper);
      console.log('ConsultantProfileDomain test data is deleted.');
      await ResourceRequestDomain.teardownTestData(testHelper);
      console.log('ResourceRequestDomain test data is deleted.');
      await AssignmentDomain.teardownTestData(testHelper);
      console.log('AssignmentDomain test data is deleted.');
      // await CentralServicesDomain.teardownTestData(testHelper);
      // console.log('CentralServices test data is deleted.');

      testHelper.outputTestData();
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  /**
   * Setup test data
   */
  beforeAll(async () => {
    await teardownTestData();
    await setupTestData();
  });

  /**
   * Tear-down test data
   */
  afterAll(async () => {
    await teardownTestData();
  });
  // generic user login
  testHelper.loginWithRole('ProjectManager');
  // Demoflow - RR
  ResourceRequestDomain.executeTest('ReadManageResourceRequest', testHelper);
  // Demoflow - CP
  ConsultantProfileDomain.executeTest('MyProjectExperience', testHelper);
  // Demoflow-Assignment
  AssignmentDomain.executeTest('ReadManageResourceUtilization', testHelper);
  // generic user logout
  testHelper.logout();
});
