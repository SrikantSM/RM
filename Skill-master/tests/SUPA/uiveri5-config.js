const environment = require('./src/utils').testEnvironment.getEnvironment();

exports.config = {
  profile: 'integration',
  specs: './src/tests/*.spec.js',
  SELENIUM_PROMISE_MANAGER: false,
  browsers: [
    {
      browserName: 'chrome',
      platformName: 'linux',
      capabilities: {
        chromeOptions: {
          // args: ['start-maximized'], // for local testing
          args: ['--remote-debugging-port=9222', '--window-size=2500,1400', '--user-data-dir=/tmp', '--disable-translate', '--whitelisted-ips', '--no-sandbox', '--disable-extensions'],
        },
      },
    },
  ],
  params: {
    appURL: environment.approuterUrl,
    user: environment.appUser,
    pass: environment.appPassword,
    cfgpath: '/home/supa/testautomation',
    cfgfile: 'F4704_Skill.properties',
    warmupcycles: environment.warmupCycles,
    measurementcycles: environment.measurementCycles,
    stopSleepTime: environment.stopSleepTime,
    monitoredHanaUser: environment.monitoredHanaUser,
    hanaServer: environment.hanaServer,
    hanaUser: environment.hanaUser,
    hanaPassword: environment.hanaPassword,
    dynatraceApiToken: environment.dynatraceApiToken,
    ipaproject: environment.ipaProject,
    ipascenario: 'F4704_Skill',
    ipavariant: environment.ipaVariant,
    ipacomment: 'Automates',
    iparelease: environment.ipaRelease,
    ipauser: {
      user: environment.ipaUser,
      pwd: environment.ipaPassword,
    },
    idpHost: environment.idpHost,
  },
  takeScreenshot: {
    onExpectFailure: true,
    onExpectSuccess: false,
    onAction: false,
  },
  timeouts: {
    getPageTimeout: '120000',
    allScriptsTimeout: '70000',
    defaultTimeoutInterval: '120000',
  },
  reporters: [
    {
      name: './reporter/screenshotReporter',
      reportName: 'index.html',
    },
  ],
};
