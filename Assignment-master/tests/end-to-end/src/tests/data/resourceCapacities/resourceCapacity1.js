const uuid = require("uuid").v4;
const workAssignments = require("../workAssignments");
const dynamicDateGenerator = require("../dynamicDateGenerator/dynamicDateGenerator");
const totalDays = require("../Constants/constant");
const resourceCapacity = [];

for (let i = 1; i < totalDays.TOTAL_DAYS; i++) {
	resourceCapacity.push({
		resource_id: workAssignments.workAssignment1.ID,
		startTime: dynamicDateGenerator.getCurrentDay(i),
		workingTimeInMinutes: "600",
		overTimeInMinutes: "0",
		plannedNonWorkingTimeInMinutes: "0",
		bookedTimeInMinutes: "0",
		endTime: dynamicDateGenerator.getCurrentDay(i + 1)
	});
}

module.exports = {
	resourceCapacity
};
