/**
 * Determine the URL of the UI5 version to use from the FLP CDM
 * @param {boolean} runInUmbrella whether or not to use the CDM of the domain or the umbrella FLP
 * @returns {string} UI5 URL
 */
function getUI5Url(runInUmbrella) {
  console.log(`runInUmbrella: ${runInUmbrella}`);
  const cdmJsonFile = require(`${runInUmbrella ? '../../../' : '../../'}flp-content/portal-site/CommonDataModel.json`);
  const { ui5LibraryUrl, ui5VersionNumber } = cdmJsonFile.payload.sites[0].payload['sap.cloud.portal'].config;
  const ui5Url = ui5LibraryUrl || `https://sapui5.hana.ondemand.com/${ui5VersionNumber}`;
  console.log(`ui5Version URL: ${ui5Url}`);
  return ui5Url;
}

/**
 * Configure Code Coverage in iFrame via karma ui5 helper
 * https://github.com/SAP/karma-ui5/issues/138#issuecomment-704109288
 * @param {*} grunt grunt object
 * @returns {undefined} nothing
 */
function configureIframeCoverage(grunt) {
  const config = grunt.config.get('karma.options');
  require('karma-ui5/helper').configureIframeCoverage(config);
  grunt.config.set('karma.options', config);
}

module.exports = function (grunt) {
  // Authentication properties, should be in sync with mock-user from srv/src/main/resources/application.yaml
  const user = 'ConfigurationExpert';
  const password = 'pass';

  // Grunt parameters
  const appName = grunt.option('appName') || process.env.appName;
  const appFolder = grunt.option('appFolder') || process.env.appFolder || appName;
  const runInUmbrella = grunt.option('runInUmbrella') || process.env.runInUmbrella || false;
  const ui5Url = getUI5Url(runInUmbrella);

  const basePath = `../../app/${appFolder}/`;
  const htmlName = `${appName}.app`;

  const baseUrl = 'http://localhost:8080/';
  const odataPathUrl = `${baseUrl}odata/v4/`;

  const initialDirectory = process.cwd();

  grunt.config.merge({
    karma: {
      // base configuration
      options: {
        basePath,
        frameworks: ['qunit', 'ui5'],
        port: 9876,
        // logging
        logLevel: 'INFO', // http://karma-runner.github.io/6.3/config/configuration-file.html#loglevel
        loggers: [{ type: 'console', layout: { type: 'messagePassThrough' } }], // https://log4js-node.github.io/log4js-node/layouts.html
        browserConsoleLogOptions: { level: 'INFO', terminal: true }, // http://karma-runner.github.io/6.3/config/configuration-file.html#browserconsolelogoptions, format doesn't affect terminal
        // qunit config
        client: {
          qunit: {
            showUI: true,
            reorder: false,
          },
          captureConsole: true,
          clearContext: true,
        },
        // karma-ui5 config
        ui5: {
          url: ui5Url,
          type: 'application',
          paths: {
            webapp: 'webapp',
          },
          mode: 'script',
          config: {
            theme: 'sap_fiori_3',
            libs: 'sap.m, sap.ui.comp, sap.ui.layout, sap.f, sap.uxap',
            compatVersion: 'edge',
            frameOptions: 'allow',
            resourceroots: {
              [appName]: '/base/webapp',
              [htmlName]: '/base/webapp/test/flpSandbox',
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
            `${appName}/test/unit/AllTests`,
          ],
        },
        // browser and proxy
        customLaunchers: {
          ChromeHeadlessDocker: {
            base: 'ChromeHeadless',
            // We must disable the Chrome sandbox when running Chrome inside Docker (Chrome's sandbox needs
            // more permissions than Docker allows by default)
            flags: ['--no-sandbox'],
          },
          ChromeDebug: {
            base: 'Chrome',
            flags: [
              '--auto-open-devtools-for-tabs', '--start-maximized', // development efficiency
              '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-background-media-suspend', // otherwise, tests in the background will be slower and fail
            ],
          },
        },
        proxies: {
          '/odata/v4/': {
            target: odataPathUrl,
            changeOrigin: true,
          },
          '/api/internal/': {
            target: `${baseUrl}/api/internal/`,
            changeOrigin: true,
          },
        },
        proxyReq(proxyReq, req, res, options) {
          proxyReq.setHeader('Authorization', `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`);
        },
        // test reporters
        reporters: ['mocha', 'junit', 'coverage', 'html'],
        preprocessors: {
          'webapp/{!(test)/**/,}*.js': ['coverage'],
        },
        junitReporter: {
          outputDir: `${initialDirectory}/target/report`, // results will be saved as $outputDir/$browserName.xml
          useBrowserName: false, // add browser name to report and classes names
          classNameFormatter: (browser, result) => `${appName}.${result.suite.join(' ')}`,
          suite: appName,
          outputFile: `opa-${appName}.xml`,
        },
        coverageReporter: {
          dir: `${initialDirectory}/target/report`,
          includeAllSources: true,
          reporters: [
            { type: 'html', subdir: `coverage-${appName}` },
            { type: 'cobertura', subdir: '.', file: `cobertura-${appName}.txt` },
            { type: 'text' },
          ],
          check: { // https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md#check
            each: {
              statements: 50,
              branches: 50,
              functions: 50,
              lines: 50,
            },
          },
        },
        htmlReporter: {
          outputDir: `${initialDirectory}/target/report`,
          reportName: appName,
          namedFiles: true,
        },
      },
      // settings for pipeline
      ci: {
        browserDisconnectTolerance: 1,
        // timeouts (in ms)
        captureTimeout: 100000,
        browserDisconnectTimeout: 10000,
        browserNoActivityTimeout: 60000, // by default 10000
        resourceTimeout: 200,
        client: {
          qunit: { testTimeout: 30000 },
          opaTimeout: 15000,
        },
        // watch
        autoWatch: false,
        singleRun: true,
        browsers: ['ChromeHeadlessDocker'],
      },
      // settings for debug
      debug: {
        browserDisconnectTolerance: 100,
        // timeouts (in ms)
        captureTimeout: 100000,
        browserDisconnectTimeout: 300000, // 5 minutes
        browserNoActivityTimeout: 300000, // by default 10000
        client: {
          qunit: { testTimeout: 600000 }, // 10 minutes
          opaTimeout: 300000,
        },
        // watch
        autoWatch: true,
        singleRun: false,
        browsers: ['ChromeDebug'],
      },
    },
  });

  configureIframeCoverage(grunt);

  grunt.registerTask('waitForServer', 'Task that blocks further tasks until a server is ready by polling on a the serverTarget', function () {
    const done = this.async();
    const http = require('http');

    function queryServer() {
      grunt.log.writeln('Querying server availability...');
      http.get(baseUrl, { auth: `${user}:${password}` }, (response) => {
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
  grunt.registerTask('debug', ['waitForServer', 'karma:debug']);
  grunt.registerTask('ci', ['waitForServer', 'karma:ci']);
};
