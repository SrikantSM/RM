const environment = require('./src/utils').getEnvironment();

// Use this to check whether the current execution is in the domain pipeline
const isLocal = process.argv.includes('--params.local');

exports.config = {
    profile: 'integration',

    specs: {
        myAssignments: [
            'src/tests/myAssignments/*.spec.js',
        ],
        myProjectExperience: [
            'src/tests/myProjectExperience/*.spec.js',
        ],
        manageProjectRoles: [
            'src/tests/projectRoles/*.spec.js',
        ],
        maintainServiceOrg: [
            'src/tests/serviceOrganization/*.spec.js',
        ],
        maintainAvailability: [
            'src/tests/availabilityUpload/*.spec.js',
        ],
        myResource: [
            'src/tests/myResource/*.spec.js',
        ],
    },

    // configure launchpad URL, and a user which as access here
    params: {
        appUsers: environment.appUsers,
        appPasswords: environment.appPasswords,
        appURL: environment.approuterUrl,
        idpHost: environment.idpHost,
    },

    timeouts: {
        getPageTimeout: '600000',
        allScriptsTimeout: '700000',
        defaultTimeoutInterval: '1200000',
    },

    takeScreenshot: {
        onExpectFailure: true,
        onExpectSuccess: false,
        onAction: false,
    },

    reporters: [
        {
            name: './reporter/junitReporter',
            // Disabled the lint check because of UIVeri5 templating
            // eslint-disable-next-line no-template-curly-in-string
            reportName: 'target/report/CPE2EJUnit-${suiteFilter}.xml', // UIVeri5 templating
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
                    args: ['--disable-gpu', '--window-size=1600,900', '--no-sandbox', '--lang=en-US', '--disable-dev-shm-usage'],
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
