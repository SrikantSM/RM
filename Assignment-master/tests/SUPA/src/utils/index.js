const { TestEnvironment } = require("test-commons");
const Environment = require("./Environment");

const testHelper = new TestEnvironment(Environment.createInstance("default-env.json"));
module.exports.testHelper = testHelper;