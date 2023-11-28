const UploadSkillsScenario = require('./scenarios/UploadSkills');
const SkillSearchScenario = require('./scenarios/SkillSearch');
const MaintainSkillScenario = require('./scenarios/MaintainSkill');
const { SupaHelper, ResultAnalyzer, databaseCleanup } = require('../utils');
const loginHelper = require('../../../uiveri5-pages/LoginHelper');

const supaHelper = new SupaHelper();
const NUMBER_OF_WARMUPS = Number(browser.testrunner.config.params.warmupcycles);
const NUMBER_OF_MEASUREMENTS = Number(browser.testrunner.config.params.measurementcycles);

// Make unhandled promise rejections fail the process to exit with an error when the database cleanup fails
process.on('unhandledRejection', (up) => { throw up; });

describe('SUPAFlow', () => {
  setupAndLogin();

  executeTestScenarios([UploadSkillsScenario, SkillSearchScenario, MaintainSkillScenario]);

  logoutAndCleanup();

  it('should analyze result', async () => {
    const resultAnalyzer = new ResultAnalyzer('F4704_Skill');
    const regressionIdentified = await resultAnalyzer.identifyRegression();
    expect(regressionIdentified).toBe(false);
  });
});

function executeTestScenarios(testScenarios) {
  for (const Scenario of testScenarios) {
    // Run Warmup
    for (let i = 0; i < NUMBER_OF_WARMUPS; i += 1) new Scenario(new SupaHelper(), i).executeTest();
    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i += 1) new Scenario(new SupaHelper(true), NUMBER_OF_WARMUPS + i).executeTest();
  }
}

function setupAndLogin() {
  loginHelper.loginWithCredentials(browser.testrunner.config.params.user, browser.testrunner.config.params.pass);

  it('should be on the homepage and configure supa', async () => {
    expect(await browser.getTitle()).toBe('Home');
    if (NUMBER_OF_MEASUREMENTS > 0) {
      const cfgFile = `${browser.testrunner.config.params.cfgpath}/${browser.testrunner.config.params.cfgfile}`;
      const {
        hanaServer, hanaUser, hanaPassword, monitoredHanaUser, dynatraceApiToken,
      } = browser.testrunner.config.params;
      supaHelper.addCredentials(cfgFile, 'branch.1.newdb.db.server', hanaServer);
      supaHelper.addCredentials(cfgFile, 'branch.1.newdb.user.name', hanaUser);
      supaHelper.addCredentials(cfgFile, 'branch.1.newdb.user.password', hanaPassword);
      supaHelper.addCredentials(cfgFile, 'branch.1.newdb.monitored.dbusers', monitoredHanaUser);
      supaHelper.addCredentials(cfgFile, 'branch.2.dynatrace.timeseries.apitoken', dynatraceApiToken);
      supaHelper.addCredentials(cfgFile, 'ipa.user.name', browser.testrunner.config.params.ipauser.user);
      supaHelper.addCredentials(cfgFile, 'ipa.user.password', browser.testrunner.config.params.ipauser.pwd);
      supaHelper.addCredentials(cfgFile, 'ipa.project.name', browser.testrunner.config.params.ipaproject);
      supaHelper.addCredentials(cfgFile, 'ipa.release.name', browser.testrunner.config.params.iparelease);
      supaHelper.addCredentials(cfgFile, 'ipa.variant.name', browser.testrunner.config.params.ipavariant);
      supaHelper.configureSupa(cfgFile);
    }
  });
}

function logoutAndCleanup() {
  loginHelper.logout();

  it('should clean up the database', async () => {
    await databaseCleanup.execute();
  });

  it('should upload the results to IPA', () => {
    if (NUMBER_OF_MEASUREMENTS > 0) {
      supaHelper.finishMeasurement();
      supaHelper.uploadToIPA(
        browser.testrunner.config.params.ipaproject,
        browser.testrunner.config.params.ipascenario,
        browser.testrunner.config.params.ipavariant,
        browser.testrunner.config.params.iparelease,
        browser.testrunner.config.params.ipacomment,
        browser.testrunner.config.params.ipauser.user,
        browser.testrunner.config.params.ipauser.pwd,
      );
      supaHelper.generateSupaExcel();
      supaHelper.exitSupa();
    }
  });
}
