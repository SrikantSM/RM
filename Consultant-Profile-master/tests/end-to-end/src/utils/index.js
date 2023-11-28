const { TestEnvironment } = require('test-commons');
const Environment = require('./Environment');

module.exports = new TestEnvironment(Environment.createInstance('default-env.json'));
