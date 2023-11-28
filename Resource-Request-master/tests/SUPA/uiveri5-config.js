const environment = require('./src/utils').testHelper.getEnvironment();

exports.config = {
    profile: 'integration',
    specs: './src/tests/*.spec.js',
    browsers: [
        {
            browserName: 'chrome',
            platformName: 'linux',
            capabilities: {
                chromeOptions: {
                    //args: ['start-maximized'] //for local testing
                    args: [
                        '--window-size=1600,900',
                        '--remote-debugging-port=9222',
                        '--user-data-dir=/tmp',
                        '--disable-translate',
                        '--whitelisted-ips',
                        '--no-sandbox',
                        '--disable-extensions']
                }
            }
        }
    ],
    params: {
        appURL: environment.appURL,
        PMUser: environment.projectManagerUser,
        PMPass: environment.projectManagerPassword,
        RMUser: environment.resourceManagerUser,
        RMPass: environment.resourceManagerPassword,
        cfgpath : "/home/supa/testautomation", // Do not change.
        appToMeasure: environment.appToMeasure, // empty string means measure both Apps
        dynatraceTag: environment.dynatraceTag,
        dynatraceToken: environment.dynatraceToken,
        hanaRTUser: environment.hanaRTUser,
        hanaUser : environment.hanaUser,
        hanaPassword : environment.hanaPassword,
        hanaServer : environment.hanaServer,
        stopSleepTime: environment.sleepTime,
        warmupcycles: environment.warmupCycles,
        measurementcycles: environment.measurementCycles,
        ipaproject: environment.ipaProject,
        ipavariant: environment.ipaVariant,
        ipacomment: environment.ipaComment,
        iparelease: environment.ipaRelease,
        ipauser: {
            user: environment.ipaUser,
            pwd: environment.ipaPassword
        },
        idpHost: environment.idpHost
    },
    takeScreenshot: {
        onExpectFailure: true,
        onExpectSuccess: false,
        onAction: false
    },
    timeouts: {
        getPageTimeout: '60000',
        allScriptsTimeout: '70000',
        defaultTimeoutInterval: '120000'
    }
};
