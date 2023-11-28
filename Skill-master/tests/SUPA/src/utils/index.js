const { TestEnvironment } = require('test-commons');
const Environment = require('./Environment');
const SupaHelper = require('./SupaHelper');
const ResultAnalyzer = require('./ResultAnalyzer');
const DatabaseCleanup = require('./DatabaseCleanup');
const SkillCsvGenerator = require('./SkillCsvGenerator');

const testEnvironment = new TestEnvironment(Environment.createInstance('default-env.json'));

module.exports.testEnvironment = testEnvironment;
module.exports.SupaHelper = SupaHelper;
module.exports.ResultAnalyzer = ResultAnalyzer;
module.exports.databaseCleanup = new DatabaseCleanup(testEnvironment);
module.exports.skillCsvGenerator = new SkillCsvGenerator(testEnvironment);
