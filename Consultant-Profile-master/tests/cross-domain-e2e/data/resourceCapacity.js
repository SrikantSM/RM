const uuid = require('uuid').v4;
const workAssignments = require('./workAssignments');


var now = new Date(Date.now());

var currentMonthStart = new Date(Date.UTC(now.getFullYear(),  now.getMonth(), 1));
var currentMonthEnd = new Date(Date.UTC(now.getFullYear(),  now.getMonth(), 2));

var nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(),  now.getMonth()+1, 1));
var nowPlusOneMonthEnd = new Date(Date.UTC(now.getFullYear(),  now.getMonth()+1, 2));

var nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(),  now.getMonth()+2, 1));
var nowPlusTwoMonthsEnd = new Date(Date.UTC(now.getFullYear(),  now.getMonth()+2, 2));

const resourceCapacity = [
	{
		resource_id: workAssignments.workAssignment1.ID,
		startTime: currentMonthStart.toJSON(),
		workingTimeInMinutes:'2400',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: currentMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment1.ID,
		startTime: nowPlusOneMonthStart.toJSON(),
		workingTimeInMinutes:'2400',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusOneMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment1.ID,
		startTime: nowPlusTwoMonthsStart.toJSON(),
		workingTimeInMinutes:'2400',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusTwoMonthsEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment2.ID,
		startTime: currentMonthStart.toJSON(),
		workingTimeInMinutes:'2400',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: currentMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment2.ID,
		startTime: nowPlusOneMonthStart.toJSON(),
		workingTimeInMinutes:'2400',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusOneMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment2.ID,
		startTime: nowPlusTwoMonthsStart.toJSON(),
		workingTimeInMinutes:'2400',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusTwoMonthsEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment3.ID,
		startTime: currentMonthStart.toJSON(),
		workingTimeInMinutes:'1500',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: currentMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment3.ID,
		startTime: nowPlusOneMonthStart.toJSON(),
		workingTimeInMinutes:'1500',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusOneMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment3.ID,
		startTime: nowPlusTwoMonthsStart.toJSON(),
		workingTimeInMinutes:'1500',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusTwoMonthsEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment4.ID,
		startTime: currentMonthStart.toJSON(),
		workingTimeInMinutes:'1200',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: currentMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment4.ID,
		startTime: nowPlusOneMonthStart.toJSON(),
		workingTimeInMinutes:'1200',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusOneMonthEnd.toJSON()
	},

	{
		resource_id: workAssignments.workAssignment4.ID,
		startTime: nowPlusTwoMonthsStart.toJSON(),
		workingTimeInMinutes:'1200',
		overTimeInMinutes:'0',
		plannedNonWorkingTimeInMinutes:'0',
		bookedTimeInMinutes:'0',
		endTime: nowPlusTwoMonthsEnd.toJSON()
	},

	]

module.exports = {
		resourceCapacity
}