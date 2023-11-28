const uuid = require("uuid").v4;
const assignments = require("../assignments");
const dynamicDateGenerator = require("../dynamicDateGenerator/dynamicDateGenerator");
const bookedCapacityAggregate = [];

for (let i = 1; i < 181; i++) {
	// For 1st Assignment
	bookedCapacityAggregate.push({
		resourceID: assignments.assignment1.resource_ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		bookedCapacityInMinutes: 420
	});
}
module.exports = {
	bookedCapacityAggregate
};