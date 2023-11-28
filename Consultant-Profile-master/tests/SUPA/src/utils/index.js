const { TestEnvironment } = require('test-commons');
const Cleaner = require('./Cleaner');
const AvailabilityCsvWriter = require('./AvailabilityCsvWriter');
const ServiceOrgCsvWriter = require('./ServiceOrgCsvWriter');
const AssignmentDetailsExtractor = require('./AssignmentDetailsExtractor');

const Environment = require('./Environment');

module.exports.testEnvironment = new TestEnvironment(Environment.createInstance('default-env.json'));
module.exports.cleaner = new Cleaner(this.testEnvironment);
module.exports.assignmentDetailsExtractor = new AssignmentDetailsExtractor(this.testEnvironment);
module.exports.availabilityCsvWriter = new AvailabilityCsvWriter(this.testEnvironment);
module.exports.serviceOrgCsvWriter = new ServiceOrgCsvWriter(this.testEnvironment);
module.exports.env = Environment.createInstance();
