

Replace the content of this file with the code below to improve console output

<code>~\Resource-Management\<domain>\tests\end-to-end\node_modules\@ui5\uiveri5\src\reporter\consoleReporter.js</code>

```JavaScript
function ConsoleReporter(config,instanceConfig,logger,collector) {
	this.config = config;
	this.instanceConfig = instanceConfig;
	this.logger = logger;
	this.collector = collector;
}

function JasmineConsoleReporter(logger,collector) {
	this.logger = logger;
	this.collector = collector;
}

JasmineConsoleReporter.prototype.jasmineStarted = function() {
};

JasmineConsoleReporter.prototype.suiteStarted = function() {
	this.logger.info('Suite started: ' + this.collector.getCurrentSuite().name);
};

const FOREGROUND_RESET = '\x1b[0m';
const FOREGROUND_BRIGHT = '\x1b[1m';
const FOREGROUND_BLUE = FOREGROUND_BRIGHT + '\x1b[34m';
const FOREGROUND_RED = FOREGROUND_BRIGHT + '\x1b[41m';
const FOREGROUND_GREEN = FOREGROUND_BRIGHT + '\x1b[32m';
const FOREGROUND_YELLOW = FOREGROUND_BRIGHT + '\x1b[33m';

JasmineConsoleReporter.prototype._logTitle = function(sText) {
	console.info('');
	console.info(`${FOREGROUND_BLUE}` + sText + `${FOREGROUND_RESET}`);
}

JasmineConsoleReporter.prototype._logError = function(sText) {
	console.info(`${FOREGROUND_RED}` + sText + `${FOREGROUND_RESET}`);
}

JasmineConsoleReporter.prototype._logWarning = function(sText) {
	console.info(`${FOREGROUND_YELLOW}` + sText + `${FOREGROUND_RESET}`);
}

JasmineConsoleReporter.prototype._logSuccess = function(sText) {
	console.info(`${FOREGROUND_GREEN}` + sText + `${FOREGROUND_RESET}`);
}

JasmineConsoleReporter.prototype.specStarted = function() {
	//this.logger.info('Spec started: ' + this.collector.getCurrentSpec().name);
	this._logTitle("~~~ " + this.collector.getCurrentSpec().name + " ~~~");
};

JasmineConsoleReporter.prototype.specDone = function() {
	var spec = this.collector.getCurrentSpec();
	spec.expectations.forEach(function (expectation) {
		if (expectation.status === 'failed') {
			this.logger.info('Expectation FAILED: ' + expectation.message);
			if(expectation.details){
				this.logger.info('Expectation FAILED details: ${JSON.stringify(details)}',{details: expectation.details});
			}
			this.logger.debug('Expectation FAILED stack: ${stack}',{stack: expectation.stack});
		}
	},this);
	var sStatus = spec.status.toUpperCase();
	//this.logger.info('Spec finished: ' + this.collector.getCurrentSpec().name + ' with status: ' + sStatus + '');
	if (sStatus === "FAILED") {
		this._logError("~~~ " + this.collector.getCurrentSpec().name + " ~~~");
	} else {
		this._logSuccess("~~~ " + this.collector.getCurrentSpec().name + " ~~~");
	}
	/*
    this.logger.info('Spec expectations summary' +
    ', total: ' + spec.statistic.expectations.total +
    ', passed: ' + spec.statistic.expectations.passed +
    ', failed total: ' + spec.statistic.expectations.failed.total +
    ', failed with error: ' + spec.statistic.expectations.failed.error +
    ', failed with image comparison: ' + spec.statistic.expectations.failed.image);
    */
};

JasmineConsoleReporter.prototype.suiteDone = function() {
	var suite = this.collector.getCurrentSuite();
	this.logger.info('Suite finished: ' + suite.name +
		' with status: ' + suite.status.toUpperCase() +
		' for: ' + suite.statistic.duration/1000 + 's');
	this.logger.info('Suite specs summary' +
		', total: ' + suite.statistic.specs.total +
		', passed: ' + suite.statistic.specs.passed +
		', failed: ' + suite.statistic.specs.failed +
		', pending: ' + suite.statistic.specs.pending +
		', disabled: ' + suite.statistic.specs.disabled);
	this.logger.info('Suite expectations summary' +
		', total: ' + suite.statistic.expectations.total +
		', passed: ' + suite.statistic.expectations.passed +
		', failed total: ' + suite.statistic.expectations.failed.total +
		', failed with error: ' + suite.statistic.expectations.failed.error +
		', failed with image comparison: ' + suite.statistic.expectations.failed.image);
};

JasmineConsoleReporter.prototype.jasmineDone = function() {
	var overview = this.collector.getOverview();
	this.logger.info('Overall status: ' + overview.status.toUpperCase() +
		' for: ' + overview.statistic.duration/1000 + 's');
	this.logger.info('Overall suites summary' +
		', total: ' + overview.statistic.suites.total +
		', passed: ' + overview.statistic.suites.passed +
		', failed: ' + overview.statistic.suites.failed);
	this.logger.info('Overall specs summary' +
		', total: ' + overview.statistic.specs.total +
		', passed: ' + overview.statistic.specs.passed +
		', failed: ' + overview.statistic.specs.failed +
		', pending: ' + overview.statistic.specs.pending +
		', disabled: ' + overview.statistic.specs.disabled);
	this.logger.info('Overall expectations summary' +
		', total: ' + overview.statistic.expectations.total +
		', passed: ' + overview.statistic.expectations.passed +
		', failed total: ' + overview.statistic.expectations.failed.total +
		', failed with error: ' + overview.statistic.expectations.failed.error +
		', failed with image comparison: ' + overview.statistic.expectations.failed.image);
};

ConsoleReporter.prototype.register = function(jasmineEnv) {
	// create and attach our console reporter
	jasmineEnv.addReporter(new JasmineConsoleReporter(this.logger,this.collector));
};

module.exports = function(config,instanceConfig,logger,collector){
	return new ConsoleReporter(config,instanceConfig,logger,collector);
};
```
