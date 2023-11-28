
const environment = require('./src/utils').getEnvironment();

exports.config = {
  profile: 'integration',
  browsers: [
    {
      browserName: 'chrome',
      platformName: 'linux',
      capabilities: {
        chromeOptions: {
          // args: ['start-maximized'] //for local testing
          args: [
            '--headless',
            '--disable-gpu',
            '--window-size=1600,900',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--lang=en-US',
          ], // for use with headless chrome (pipeline)
        },
      },
    },
  ],

  specs: './src/tests/*.spec.js',

  // configure launchpad URL, and a user which as access here
  params: {
    appUsers: environment.appUsers,
    appPasswords: environment.appPasswords,
    appURL: environment.approuterUrl,
    idpHost: environment.idpHost,
  },

  takeScreenshot: {
    onExpectFailure: true,
    onExpectSuccess: false,
    onAction: false,
  },

  timeouts: {
    getPageTimeout: '60000',
    allScriptsTimeout: '70000',
    defaultTimeoutInterval: '120000',
  },

  reporters: [
    {
      name: './reporter/junitReporter',
      reportName: 'target/report/RMCDE2EJUnit.xml',
    },
    {
      name: './reporter/screenshotReporter',
      reportName: 'index.html',
    },
  ],
};
