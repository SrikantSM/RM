module.exports = function (grunt) {



    // Authentication properties, should be inline with mock-user from srv/src/main/resources/application.yaml
    const user = 'opaUser';
    const password = 'pass';


    // Grunt parameters
    const testCompiled = grunt.option('testCompiled') || process.env.testCompiled || false;
    const debugMode = grunt.option('debugMode') || process.env.debugMode || false;
    const appName = grunt.option('appName') || process.env.appName;
    const customJourney = grunt.option('customJourney') || process.env.appName || false;
    const runInUmbrella = grunt.option('runInUmbrella') || process.env.runInUmbrella || false;
    const testFlag = grunt.option('testFlag') || process.env.testFlag || 'both';
    const effortDistribution = grunt.option('effortDistribution') || process.env.effortDistribution || false;

    var testArray = [];
    if ((testFlag === "unit" || testFlag === "both") && appName === "resourceRequestLibrary") {testArray.push(appName + '/resourceRequestLibrary/test/unit/AllTests');}
    if (appName === "manageResourceRequest" && (testFlag === "integration" || testFlag === "both")) {
        if (effortDistribution === false) {
            if (customJourney){
                testArray.push(appName + '/test/integration/CustomJourney');
            } else {
                testArray.push(appName + '/test/integration/MainJourney');
            }
        } else if (effortDistribution === 'daily') {
            testArray.push(appName + '/test/integration/DailyEDJourney');
        } else if (effortDistribution === "weekly") {
            testArray.push(appName + '/test/integration/WeeklyEDJourney');
        }
    }
    if (appName === "staffResourceRequest") {
        if (effortDistribution === false){
            testArray.push(appName + '/test/integration/MainJourney');
        } else {
            testArray.push(appName + '/test/integration/CustomJourney');
        }
    }

    // Fetch UI5 version from Domain/Umbrella CDM.json file.
    let cdmJsonFilePath, cdmJsonFile;
    console.log("runInUmbrella : " + runInUmbrella);
    if (runInUmbrella) {
    //fetch currentUI5Version from Resource-Management/flp-content/portal-site/CommonDataModel.json
        cdmJsonFilePath = '../../../flp-content/portal-site/CommonDataModel.json';
        cdmJsonFile = require(cdmJsonFilePath);
        console.log("process.cwd() : " + process.cwd());
        console.log("cdmJsonFilePath : " + cdmJsonFilePath);
    } else {
    //fetch currentUI5Version from Resource-Request/flp-content/portal-site/CommonDataModel.json
        cdmJsonFilePath = '../../flp-content/portal-site/CommonDataModel.json';
        cdmJsonFile = require(cdmJsonFilePath);
        console.log("process.cwd() : " + process.cwd());
        console.log("cdmJsonFilePath : " + cdmJsonFilePath);
    }
    const { ui5LibraryUrl, ui5VersionNumber } = cdmJsonFile.payload.sites[0].payload['sap.cloud.portal'].config;
    //ui5VersionNumber= '1.76.0';    // uncomment this if needed while testing locally
    console.log("currentUI5Version : " + ui5VersionNumber);

    const ui5Url = ui5LibraryUrl || `https://sapui5.hana.ondemand.com/${ui5VersionNumber}`;
    const testFELibrary = ui5Url + '/test-resources/sap/suite/ui/generic/template/integration/testLibrary';
    const basePath = '../../app/' + appName + '/';
    const htmlName = appName + '.app';
    var serviceName = "";
    if (appName == 'manageResourceRequest'){
        serviceName = 'ManageResourceRequestService';
    } else if (appName == 'staffResourceRequest') {
        serviceName = 'ProcessResourceRequestService';
    } else if (appName == 'resourceRequestLibrary') {
        serviceName = '';
    } else {
        return;
    }

    const serverTarget = 'http://localhost:8080/odata/v4/' + serviceName + '/';
    const initialDirectory = process.cwd();

    // eslint-disable-next-line no-warning-comments
    //todo: delete console logs after testing in pipeline
    console.log("appName");
    console.log(appName);
    console.log("serverTarget");
    console.log(serverTarget);
    console.log("serviceName");
    console.log(serviceName);

    // Project configuration.
    grunt.config.merge({
        karma: {
            options: {
                basePath: basePath,
                frameworks: ['qunit', 'ui5'],
                // test results reporter to use. possible values: 'dots', 'progress'
                // available reporters: npmjs.org/browse/keyword/karma-reporter
                reporters: ['junit', 'coverage', 'html'],
                port: 9876,
                // level of logging
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                logLevel: 'DEBUG',
                captureTimeout: 100000, // it was already there
                browserDisconnectTimeout: 10000,
                browserDisconnectTolerance: 1,
                browserNoActivityTimeout: 120000, //by default 10000
                resourceTimeout: 200,
                // enable / disable watching file and executing tests whenever any file changes
                autoWatch: true,
                singleRun: debugMode ? false : true,
                ui5: {
                    url: ui5Url,
                    type: "application",
                    paths: {
                        webapp: (testCompiled ? 'dist' : 'webapp')
                    },
                    mode: 'script',
                    config: {
                        theme: 'sap_horizon',
                        libs: 'sap.m, sap.ui.comp, sap.ui.layout, sap.f, sap.uxap',
                        compatVersion: 'edge',
                        frameOptions: 'allow',
                        resourceroots: {
                            [appName]: '/base/' + (testCompiled ? 'dist' : 'webapp'),
                            [htmlName]: '/base/' + (testCompiled ? 'dist' : 'webapp') + '/test/flpSandbox',
                            'sap.suite.ui.generic.template.integration.testLibrary': testFELibrary
                        },
                        preload: 'async',
                        animation: false,
                        debug: false,
                        'xx-debugModuleLoading': true,
                        'xx-showLoadErrors': true,
                        language: 'en'
                    },
                    tests: testArray
                },
                preprocessors: {
                    [(testCompiled ? 'dist' : 'webapp') + '{dist,webapp}/{!(test)/**/,}*.js']: ['coverage']
                },
                browserConsoleLogOptions: {
                    level: 'log',
                    format: '%b %T: %m',
                    terminal: true
                },
                junitReporter: {
                    outputDir: initialDirectory + '/target/report', // results will be saved as $outputDir/$browserName.xml
                    useBrowserName: false // add browser name to report and classes names
                },
                customLaunchers: {
                    'ChromeHeadlessDocker': {
                        base: 'ChromeHeadless',
                        // We must disable the Chrome sandbox when running Chrome inside Docker (Chrome's sandbox needs
                        // more permissions than Docker allows by default)
                        flags: ['--no-sandbox']
                    },
                    'ChromeDebug': {
                        base: 'Chrome',
                        flags: ['--auto-open-devtools-for-tabs', '--start-maximized', // development efficiency
                            '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-background-media-suspend' // otherwise, tests in the background will be slower and fail
                        ]
                    }
                },
                proxies: {
                    [(testCompiled ? '/base/dist' : '') + '/odata/v4/' + serviceName + '/']: {
                        target: serverTarget,
                        changeOrigin: true
                    }
                },
                proxyReq: function (proxyReq, req, res, options) {
                    proxyReq.setHeader('Authorization', `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`);
                }
            },
            opaCi: {
                browsers: debugMode ? ['ChromeDebug'] : ['ChromeHeadlessDocker'],
                junitReporter: {
                    outputFile: 'opa-' + appName + (effortDistribution ? effortDistribution : customJourney) + '.xml'
                },
                client: {
                    qunit: {
                        showUI: true,
                        // eslint-disable-next-line no-warning-comments
                        testTimeout: 30000, //todo reduce to 15000 if not needed
                        reorder: false
                    },
                    captureConsole: true,
                    clearContext: true
                },
                coverageReporter: {
                    type: 'lcovonly',
                    dir: initialDirectory + '/target',
                    subdir: 'report',
                    file: 'lcov-opa-' + appName + (effortDistribution ? effortDistribution : customJourney) + '.info',
                    includeAllSources: true
                },
                htmlReporter: {
                    outputDir: initialDirectory + '/target/report',
                    reportName: appName + (effortDistribution ? effortDistribution : customJourney),
                    namedFiles: true
                }
            }
        }
    });

    grunt.registerTask('changeDirectory', 'Task to change the current directory to the app path.', function () {
        process.chdir(basePath);
    });

    grunt.registerTask('copyTestResources', 'Task to copy the test resources to the dist folder.', function () {
        const fs = require('fs-extra');
        if (fs.existsSync(basePath + 'dist/test')) {
            fs.removeSync(basePath + 'dist/test');
        }
        fs.copySync(basePath + 'webapp/test', basePath + 'dist/test');
    });

    grunt.registerTask('buildApp', 'Task to build the UI5 app under test.', function () {
        const fs = require('fs-extra');
        const childProcess = require('child_process');

        if (!fs.existsSync('dist')) {
            childProcess.execSync('grunt');
        }
    });

    grunt.registerTask('removeTestResources', 'Task to remove the test resources from the dist folder.', function () {
        const fs = require('fs-extra');
        if (fs.existsSync('dist/test')) {
            fs.removeSync('dist/test');
        }
    });

    grunt.registerTask('waitForServer', 'Task that blocks further tasks until a server is ready by polling on a the serverTarget', function () {
        var done = this.async();
        const http = require('http');

        function queryServer() {
            grunt.log.writeln('Querying server availability...');
            http.get(serverTarget, { auth: `${user}:${password}` }, response => {
                if (response.statusCode !== 200) {
                    setTimeout(queryServer, 2000);
                } else {
                    grunt.log.writeln('Server is ready! Continuing...');
                    done();
                }
            }).on('error', () => setTimeout(queryServer, 2000));
        }

        queryServer();
    });

    grunt.registerTask('resetDirectory', 'Task to reset the current directory back to the base path.', function () {
        process.chdir(initialDirectory);
    });

    grunt.registerTask('getLibrary', 'Task to get Library data', function () {
        const currentDirectory = process.cwd();
        if (testCompiled){
            process.chdir('../resourceRequestLibrary');
        } else {
            process.chdir('../../app/resourceRequestLibrary');
        }
        const fs = require('fs-extra');
        const childProcess = require('child_process');

        if (!fs.existsSync('dist')) {
            childProcess.execSync('grunt');
        }

        if (testCompiled){
            fs.copySync('dist', basePath + 'dist/test/ui/resourceRequestLibrary');
        } else {
            fs.copySync('dist', '../' + appName + '/webapp/test/ui/resourceRequestLibrary');
        }

        // fs.copySync('dist', basePath + testCompiled ? 'dist' : 'webapp' + '/test/ui/resourceRequestLibrary');
        process.chdir(currentDirectory);
    });

    grunt.registerTask('deleteLibrary', 'Task to delete library data', function () {
        const fs = require('fs-extra');
        fs.removeSync('../../app/' + appName + '/webapp/test/ui');
    });

    grunt.registerTask('deleteUtils', 'Task to delete utils from library', function () {
        const fs = require('fs-extra');
        fs.removeSync('../../app/' + appName + '/webapp/utils');
    });

    grunt.registerTask('copyUtils', 'Copy utils from library to webapp', function () {
        const currentDirectory = process.cwd();
        process.chdir('../../app/resourceRequestLibrary');
        const fs = require('fs-extra');
        fs.copySync('webapp/resourceRequestLibrary/utils', 'webapp/utils');
        process.chdir(currentDirectory);
    });

    grunt.loadNpmTasks('grunt-karma');

    if (testCompiled) {
        grunt.registerTask('opa_tests', ['changeDirectory', 'buildApp', 'copyTestResources', 'getLibrary', 'waitForServer', 'karma:opaCi', 'removeTestResources', 'resetDirectory']);
    } else {
        grunt.registerTask('opa_tests', ['getLibrary', 'waitForServer', 'karma:opaCi', 'deleteLibrary']);
        grunt.registerTask('unit_tests', ['copyUtils', 'karma:opaCi', 'deleteUtils']);

    }
};
