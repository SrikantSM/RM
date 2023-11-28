const uuid = require("uuid").v4;
const dynamicDateGenerator = require("../dynamicDateGenerator/dynamicDateGenerator");
const assignments = require("../assignments");

const assignmentBucket = [];

// Maintaing 6 months Data -> 1 past months and next 5 months Data

for (let i = 1; i < 181; i++) {
	// For 1st Assignment
	assignmentBucket.push({
		ID: uuid(),
		assignment_ID: assignments.assignment5.ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		bookedCapacityInMinutes: 120
	});
	// For 2nd Assignment
	assignmentBucket.push({
		ID: uuid(),
		assignment_ID: assignments.assignment6.ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		bookedCapacityInMinutes: 60
	});
	// For 3rd Assignment
	assignmentBucket.push({
		ID: uuid(),
		assignment_ID: assignments.assignment7.ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		bookedCapacityInMinutes: 60
	});
	// For 4th Assignment
	assignmentBucket.push({
		ID: uuid(),
		assignment_ID: assignments.assignment8.ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		bookedCapacityInMinutes: 60
	});
	// For 5th Assignment
	assignmentBucket.push({
		ID: uuid(),
		assignment_ID: assignments.assignment21.ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		bookedCapacityInMinutes: 60
	});
}


module.exports = {
	assignmentBucket
}