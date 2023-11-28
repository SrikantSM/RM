let now = new Date(Date.now());

let currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
let currentMonthEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 2));

let nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
let nowPlusOneMonthEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 2));

let nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
let nowPlusTwoMonthsEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 2));

const resourceCapacity = [
	{
		resource_id: "7df355fe-64a0-11ed-9022-0242ac120002",
		startTime: currentMonthStart.toJSON(),
		workingTimeInMinutes: "2400",
		overTimeInMinutes: "0",
		plannedNonWorkingTimeInMinutes: "0",
		bookedTimeInMinutes: "0",
		endTime: currentMonthEnd.toJSON()
	},

	{
		resource_id: "",
		startTime: nowPlusOneMonthStart.toJSON(),
		workingTimeInMinutes: "2400",
		overTimeInMinutes: "0",
		plannedNonWorkingTimeInMinutes: "0",
		bookedTimeInMinutes: "0",
		endTime: nowPlusOneMonthEnd.toJSON()
	},

	{
		resource_id: "",
		startTime: nowPlusTwoMonthsStart.toJSON(),
		workingTimeInMinutes: "2400",
		overTimeInMinutes: "0",
		plannedNonWorkingTimeInMinutes: "0",
		bookedTimeInMinutes: "0",
		endTime: nowPlusTwoMonthsEnd.toJSON()
	}
];

module.exports = {
	resourceCapacity
};
