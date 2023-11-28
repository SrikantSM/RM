const assignments = require("./assignments");
const moment = require("moment");

const assignmentBucket = [
	{
		ID: "6c09c27c-85d4-490c-a5f4-6cf0605e3a9d",
		assignment_ID: assignments.assignment1.ID,
		startTime: moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00.000000000",
		bookedCapacityInMinutes: 1800
	}
];

module.exports = {
	assignmentBucket
};
