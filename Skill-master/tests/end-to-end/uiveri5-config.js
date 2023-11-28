const environment = require('./src/utils').getEnvironment();

const isLocal = process.argv.includes('--params.local');
// Use this to check whether the current execution is in the domain pipeline: const inDomainPipeline = environment.approuterUrl.includes('skill-approuter');

exports.config = {
  profile: 'integration',
  seleniumAddress: environment.seleniumAddress,
  browsers: [
    {
      browserName: environment.browserName, // 'chrome',
      platformName: environment.platformName, // 'linux',
      // capabilities: {
      //   chromeOptions: {
      //     args : [ 'start-maximized' ] //for local testing
      //     args: ['--headless', '--disable-gpu', '--window-size=1600,900', '--no-sandbox', '--lang=en-US'] //for use with headless chrome (pipeline)
      //   }
      // }
    },
  ],

  browserCapabilities: {

    /* maximize browser on all desktops to ensure consistent browser size */
    'firefox,ie,edge,safari,chrome,chromium': {
      'windows,mac,linux': {
        '*': {
          node_screen_recording: true,
          name: environment.seleniumTestName,
          remoteWebDriverOptions: {
            maximized: true,
          },
        },
      },
      linux: {
        '*': {
          applicationName: 'desktop', // otherwise, platformName linux might be routed to android devices
        },
      },
    },
    chrome: {
      linux: {
        '*': {
          chromeOptions: {
            args: ['--disable-gpu', '--no-sandbox', '--lang=en-US', '--disable-dev-shm-usage'],
          },
        },
      },
    },
  },

  // execution order will be exactly as specified here
  // neither alphabetic ordering nor an order in suiteFilter will change the order
  specs: {
    common: [
      'src/tests/AuthorizationJourney.spec.js',
      'src/tests/CsrfAndXrayJourney.spec.js',
    ],
    catalog: [
      'src/tests/CatalogCreateMaintainDelete.spec.js',
    ],
    proficiency: [
      'src/tests/proficiency/*.spec.js',
    ],
    skill: [
      'src/tests/skill/SkillActions.spec.js',
      'src/tests/skill/SkillCreateMaintainDelete.spec.js',
    ],
    uploadDownload: [
      'src/tests/skill/SkillUploadJourney.spec.js',
      'src/tests/skill/DeltaUploadJourney.spec.js',
      // last to prevent side effects on other journeys
      'src/tests/skill/SkillDownloadJourney.spec.js',
    ],
  },

  // configure launchpad URL, and a user which has access here
  params: {
    appUsers: environment.appUsers,
    appPasswords: environment.appPasswords,
    appURL: environment.approuterUrl,
    idpHost: environment.idpHost,
    longSpecTimeoutMs: 120 * 1000,
  },
  timeouts: {
    getPageTimeout: '20000',
    allScriptsTimeout: '22000',
    defaultTimeoutInterval: '60000',
  },

  takeScreenshot: {
    onExpectFailure: true,
    onExpectSuccess: false,
    onAction: false,
  },

  reporters: [
    {
      name: './reporter/junitReporter',
      // eslint-disable-next-line no-template-curly-in-string
      reportName: 'target/report/SkillE2EJUnit-${suiteFilter}.xml', // UIVeri5 templating
    },
    {
      name: './reporter/screenshotReporter',
      reportName: 'index.html',
    },
  ],
};

if (isLocal) {
  console.log('Running in local machine');
  exports.config.browsers = [
    {
      browserName: environment.browserName,
      platformName: environment.platformName,
      capabilities: {
        chromeOptions: {
          args: ['--headless', '--disable-gpu', '--window-size=1600,900', '--no-sandbox', '--lang=en-US', '--disable-dev-shm-usage'],
        },
      },
    },
  ];
} else {
  console.log('Running in pipeline');

  exports.config.browsers = [
    {
      browserName: environment.browserName,
      platformName: environment.platformName,
      capabilities: {
        chromeOptions: {
          args: ['--headless', '--disable-gpu', '--window-size=1600,900', '--no-sandbox', '--lang=en-US', '--disable-dev-shm-usage'],
        },
      },
    },
  ];
}
