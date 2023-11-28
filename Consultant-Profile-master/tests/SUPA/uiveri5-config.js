const environment = require('./src/utils').testEnvironment.getEnvironment();

exports.config = {
    profile: 'integration',
    specs: `./src/tests/${environment.spec}.spec.js`,
    browsers: [
        {
            browserName: 'chrome',
            platformName: 'linux',
            capabilities: {
                chromeOptions: {
                    // args: ['start-maximized'] //for local testing
                    args: [
                        '--remote-debugging-port=9222',
                        '--user-data-dir=/tmp',
                        '--disable-translate',
                        '--whitelisted-ips',
                        '--no-sandbox',
                        '--disable-extensions'],
                },
            },
        },
    ],
    params: {
        appURL: environment.approuterUrl,
        CEUser: environment.configExpertUser,
        CEPass: environment.configExpertPass,
        PTMUser: environment.projectTeamMemberUser,
        PTMPass: environment.projectTeamMemberPass,
        RMUser: environment.resourceManagerUser,
        RMPass: environment.resourceManagerPass,
        cfgpath: '/home/supa/testautomation',
        warmupcycles: environment.warmUpCycles,
        measurementcycles: environment.measurementCycles,
        stopSleepTime: 10000,
        hanaHost: environment.hanaHost,
        hanaPort: 443,
        monitoredHanaUser: environment.hanaMonitoredUser,
        dynatraceApiToken: environment.dynatraceApiToken,
        dynatraceTag: environment.dynatraceTag,
        hanaUser: environment.hanaTraceUser,
        hanaPassword: environment.hanaTracePass,
        ipaProject: environment.ipaProject,
        ipaVariant: environment.ipaVariant,
        ipaComment: 'Automates',
        ipaRelease: environment.ipaRelease,
        ipauser: {
            user: environment.ipaUser,
            pass: environment.ipaPass,
        },
        idpHost: environment.idpHost,
    },
    takeScreenshot: {
        onExpectFailure: true,
        onExpectSuccess: false,
        onAction: false,
    },
    timeouts: {
        getPageTimeout: '600000',
        allScriptsTimeout: '700000',
        defaultTimeoutInterval: '1200000',
    },
    reporters: [
        {
            name: './reporter/screenshotReporter',
            reportName: 'index.html',
        },
    ],
};
