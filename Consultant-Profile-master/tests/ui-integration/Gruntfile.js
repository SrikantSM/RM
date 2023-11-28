const fs = require('fs-extra');
const childProcess = require('child_process');
const http = require('http');

module.exports = function (grunt) {
    // Authentication properties, should be inline with mock-user from srv/src/main/resources/application.yaml
    const user = 'authenticated-user@sap.com';
    const password = 'pass';

    // Grunt parameters
    const testCompiled = grunt.option('testCompiled') || process.env.testCompiled || false;
    const debugMode = grunt.option('debugMode') || process.env.debugMode || false;
    const appName = grunt.option('appName') || process.env.appName;
    const runInUmbrella = grunt.option('runInUmbrella') || process.env.runInUmbrella || false;

    // Fetch UI5 version from Domain/Umbrella CDM.json file.
    let cdmJsonFilePath; let cdmJsonFile;
    console.log(`runInUmbrella : ${runInUmbrella}`);
    if (runInUmbrella) {
    // fetch currentUI5Version from Resource-Management/flp-content/portal-site/CommonDataModel.json
        cdmJsonFilePath = '../../../flp-content/portal-site/CommonDataModel.json';
        // eslint-disable-next-line global-require
        cdmJsonFile = require(cdmJsonFilePath);
        console.log(`process.cwd() : ${process.cwd()}`);
        console.log(`cdmJsonFilePath : ${cdmJsonFilePath}`);
    } else {
    // fetch currentUI5Version from Resource-Request/flp-content/portal-site/CommonDataModel.json
        cdmJsonFilePath = '../../flp-content/portal-site/CommonDataModel.json';
        // eslint-disable-next-line global-require
        cdmJsonFile = require(cdmJsonFilePath);
        console.log(`process.cwd() : ${process.cwd()}`);
        console.log(`cdmJsonFilePath : ${cdmJsonFilePath}`);
    }

    const { ui5LibraryUrl, ui5VersionNumber } = cdmJsonFile.payload.sites[0].payload['sap.cloud.portal'].config;
    const ui5Url = ui5LibraryUrl || `https://sapui5.hana.ondemand.com/${ui5VersionNumber}`;

    console.log(`ui5Url : ${ui5Url}`);

    const basePath = `../../app/${appName}/`;
    const htmlName = `${appName}.app`;
    let serviceName = '';
    if (appName === 'myProjectExperienceUi')serviceName = 'MyProjectExperienceService';
    else if (appName === 'projectRoleUi')serviceName = 'ProjectRoleService';
    else if (appName === 'businessServiceOrgUi')serviceName = 'BusinessServiceOrgService';
    else if (appName === 'businessServiceOrgUpload')serviceName = 'BusinessServiceOrgService';
    else if (appName === 'availabilityUpload')serviceName = 'AvailabilityFileUploadService';
    else if (appName === 'availabilityUploadUi')serviceName = 'AvailabilityUploadService';
    else if (appName === 'availabilityDownload')serviceName = 'AvailabilityFileDownloadService';
    else if (appName === 'replicationScheduleUi')serviceName = 'ReplicationScheduleService';
    else if (appName === 'myResourcesUi')serviceName = 'MyResourcesService';
    else if (appName === 'myAssignmentsUi')serviceName = 'MyAssignmentsService';
    else {
        return;
    }

    let serverTarget;
    if (serviceName === 'ReplicationScheduleService') serverTarget = `http://localhost:8081/odata/v4/${serviceName}/`;
    else {
        serverTarget = `http://localhost:8080/odata/v4/${serviceName}/`;
    }
    const initialDirectory = process.cwd();

    // Project configuration.
    grunt.config.merge({
        karma: {
            options: {
                basePath,
                frameworks: ['qunit', 'ui5'],
                // test results reporter to use. possible values: 'dots', 'progress'
                // available reporters: npmjs.org/browse/keyword/karma-reporter
                reporters: ['junit', 'coverage', 'html'],
                port: 9876,
                // level of logging
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                logLevel: 'DEBUG',
                captureTimeout: 300000, // it was already there
                browserDisconnectTimeout: 30000,
                browserDisconnectTolerance: 2,
                browserNoActivityTimeout: 200000, // by default 10000
                resourceTimeout: 200,
                // enable / disable watching file and executing tests whenever any file changes
                autoWatch: true,
                singleRun: !debugMode,
                ui5: {
                    url: ui5Url,
                    type: 'application',
                    paths: {
                        webapp: (testCompiled ? 'dist' : 'webapp'),
                    },
                    mode: 'script',
                    config: {
                        theme: 'sap_fiori_3',
                        libs: 'sap.m, sap.ui.comp, sap.ui.layout, sap.f, sap.uxap',
                        compatVersion: 'edge',
                        frameOptions: 'allow',
                        resourceroots: {
                            [appName]: `/base/${testCompiled ? 'dist' : 'webapp'}`,
                            [htmlName]: `/base/${testCompiled ? 'dist' : 'webapp'}/test/flpSandbox`,
                        },
                        preload: 'async',
                        animation: false,
                        debug: false,
                        'xx-debugModuleLoading': true,
                        'xx-showLoadErrors': true,
                        language: 'en',
                    },
                    tests: [
                        `${appName}/test/integration/AllJourneys`,
                    ],
                },
                preprocessors: {
                    'dist/{!(test)/**/,}*.js': ['coverage'],
                },
                junitReporter: {
                    outputDir: `${initialDirectory}/target/report`, // results will be saved as $outputDir/$browserName.xml
                    useBrowserName: false, // add browser name to report and classes names
                    classNameFormatter: (browser, result) => `${appName}.${result.suite.join(' ')}`,
                    suite: appName,
                },
                customLaunchers: {
                    ChromeHeadlessDocker: {
                        base: 'ChromeHeadless',
                        // We must disable the Chrome sandbox when running Chrome inside Docker (Chrome's sandbox needs
                        // more permissions than Docker allows by default)
                        flags: ['--no-sandbox'],
                    },
                    ChromeDebug: {
                        base: 'Chrome',
                        flags: ['--auto-open-devtools-for-tabs', '--start-maximized'],
                    },
                },
                proxies: {
                    [`${testCompiled ? '/base/dist' : ''}/odata/v4/${serviceName}/`]: {
                        target: serverTarget,
                        changeOrigin: true,
                    },
                    [`${testCompiled ? '/base/dist' : ''}/AvailabilityFileUploadService`]: {
                        target: `${basePath}AvailabilityFileUploadService`,
                        changeOrigin: true,
                    },
                    [`${testCompiled ? '/base/dist' : ''}/AvailabilityFileDownloadService`]: {
                        target: `${basePath}AvailabilityFileDownloadService`,
                        changeOrigin: true,
                    },
                },
                proxyReq(proxyReq, req, res, options) {
                    proxyReq.setHeader('Authorization', `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`);
                },
            },
            opa_ci: {
                browsers: debugMode ? ['ChromeDebug'] : ['ChromeHeadlessDocker'],
                junitReporter: {
                    outputFile: `opa-${appName}.xml`,
                },
                client: {
                    qunit: {
                        showUI: true,
                        testTimeout: 30000,
                        reorder: false,
                    },
                    captureConsole: true,
                    clearContext: true,
                },
                coverageReporter: {
                    dir: `${initialDirectory}/target/report`,
                    includeAllSources: true,
                    reporters: [
                        { type: 'html', subdir: `coverage-${appName}` },
                        { type: 'lcovonly', subdir: '.', file: `lcov-opa-${appName}.info` },
                    ],
                },
                htmlReporter: {
                    outputDir: `${initialDirectory}/target/report`,
                    reportName: appName,
                    namedFiles: true,
                },
            },
        },
    });

    grunt.registerTask('changeDirectory', 'Task to change the current directory to the app path.', () => {
        process.chdir(basePath);
    });

    grunt.registerTask('copyTestResources', 'Task to copy the test resources to the dist folder.', () => {
        if (fs.existsSync(`${basePath}dist/test`)) {
            fs.removeSync(`${basePath}dist/test`);
        }
        fs.copySync(`${basePath}webapp/test`, `${basePath}dist/test`);
    });

    grunt.registerTask('buildApp', 'Task to build the UI5 app under test.', () => {
        if (!fs.existsSync('dist')) {
            childProcess.execSync('grunt');
        }
    });

    grunt.registerTask('removeTestResources', 'Task to remove the test resources from the dist folder.', () => {
        if (fs.existsSync('dist/test')) {
            fs.removeSync('dist/test');
        }
    });

    grunt.registerTask('resetDirectory', 'Task to reset the current directory back to the base path.', () => {
        process.chdir(initialDirectory);
    });

    grunt.registerTask('waitForServer', 'Task that blocks further tasks until a server is ready by polling on a the serverTarget', function () {
        const done = this.async();

        function queryServer() {
            grunt.log.writeln('Querying server availability...');
            http.get(serverTarget, { auth: `${user}:${password}` }, (response) => {
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

    grunt.loadNpmTasks('grunt-karma');

    if (testCompiled) {
        grunt.registerTask('opa_tests', ['changeDirectory', 'buildApp', 'copyTestResources', 'waitForServer', 'karma:opa_ci', 'removeTestResources', 'resetDirectory']);
    } else {
        grunt.registerTask('opa_tests', ['waitForServer', 'karma:opa_ci']);
    }
};
