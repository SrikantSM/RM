const { workAssignments } = require('./workAssignments');

const workAssignment = workAssignments[1];

function getWeek(fromDate) {
    const sunday = new Date(fromDate.setDate(fromDate.getDate() - fromDate.getDay()));
    const result = [new Date(sunday)];
    let tempDateForValidation = new Date(sunday);
    tempDateForValidation.setUTCHours(0, 0, 0, 0);
    while (sunday.setDate(sunday.getDate() + 1) && result.length < 21) {
        const dateResult = new Date(sunday);
        dateResult.setUTCHours(0, 0, 0, 0);
        if (tempDateForValidation.getTime() !== dateResult.getTime()) {
            result.push(dateResult);
        }
        tempDateForValidation = dateResult;
    }
    return result;
}

const now = new Date(Date.now());
// current week sunday
const weekStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), (now.getDate() - now.getDay())));
const capacityDates = getWeek(weekStart);

const resourceCapacities = [
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[0].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[1].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[1].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[2].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[2].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[3].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[3].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[4].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[4].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[5].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[5].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[6].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[6].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[7].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[7].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[8].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[8].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[9].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[9].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[10].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[10].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[11].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[11].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[12].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[12].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[13].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[13].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[14].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[14].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[15].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[15].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[16].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[16].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[17].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[17].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[18].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[18].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[19].toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: capacityDates[19].toJSON(),
        workingTimeInMinutes: '480',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: capacityDates[20].toJSON(),
    },

];

module.exports = { resourceCapacities };
