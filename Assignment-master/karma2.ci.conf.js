module.exports = function (config) {
	config.set({
		frameworks: ["ui5"],
		ui5: {
			url: "https://sapui5.hana.ondemand.com",
			type: "application",
			paths: {
				webapp: "app/capacityGridUi/webapp"
			},
			mode: "html",
			testpage: "app/capacityGridUi/webapp/test/testsuite.qunit2.html"
		},
		preprocessors: {
			"./app/capacityGridUi/webapp/!(resources|test-resources|test|localService|localService2)/**/*.js": ["coverage"]
		},
		junitReporter: {
			outputDir: "app/capacityGridUi/report/karma2",
			outputFile: "jUnit.xml",
			useBrowserName: false
		},
		coverageReporter: {
			dir: "./app/capacityGridUi/report/karmaCoverage2",
			includeAllSources: true,
			reporters: [
				{
					type: "html",
					subdir: function (browser) {
						return browser.toLowerCase().split(/[ /-]/)[0];
					}
				},
				{
					type: "cobertura",
					subdir: "cobertura"
				}
			]
		},
		browsers: ["CustomHeadlessChrome"],
		customLaunchers: {
			CustomHeadlessChrome: {
				base: "ChromeHeadless",
				flags: ["--no-sandbox", "--window-size=1920,1080"]
			}
		},
		proxyValidateSSL: false,
		singleRun: true,
		captureTimeout: 200000,
		browserDisconnectTimeout: 200000,
		pingTimeout: 150000,
		browserNoActivityTimeout: 200000,
		browserConsoleLogOptions: {
			level: "info"
		},
		logLevel: config.LOG_ERROR,
		reporters: ["progress" ,"coverage", "junit"]
	});
};
