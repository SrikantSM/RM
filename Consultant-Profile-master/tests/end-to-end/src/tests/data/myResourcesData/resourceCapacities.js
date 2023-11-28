const { workAssignments } = require('./workAssignments');

const workAssignment = workAssignments[1];

const now = new Date(Date.now());

const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
const currentMonthEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 2));

const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
const nowPlusOneMonthEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 2));

const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
const nowPlusTwoMonthsEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 2));

const nowPlusThreeMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 3, 1));
const nowPlusThreeMonthsEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 3, 2));

const nowPlusFourMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 4, 1));
const nowPlusFourMonthsEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 4, 2));

const nowPlusFiveMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 5, 1));
const nowPlusFiveMonthsEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 5, 2));

const resourceCapacities = [
    {
        resource_id: workAssignment.ID,
        startTime: currentMonthStart.toJSON(),
        workingTimeInMinutes: '2400',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: currentMonthEnd.toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: nowPlusOneMonthStart.toJSON(),
        workingTimeInMinutes: '2400',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: nowPlusOneMonthEnd.toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: nowPlusTwoMonthsStart.toJSON(),
        workingTimeInMinutes: '2400',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: nowPlusTwoMonthsEnd.toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: nowPlusThreeMonthsStart.toJSON(),
        workingTimeInMinutes: '2400',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: nowPlusThreeMonthsEnd.toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: nowPlusFourMonthsStart.toJSON(),
        workingTimeInMinutes: '2400',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: nowPlusFourMonthsEnd.toJSON(),
    },
    {
        resource_id: workAssignment.ID,
        startTime: nowPlusFiveMonthsStart.toJSON(),
        workingTimeInMinutes: '2400',
        overTimeInMinutes: '0',
        plannedNonWorkingTimeInMinutes: '0',
        bookedTimeInMinutes: '0',
        endTime: nowPlusFiveMonthsEnd.toJSON(),
    },
];

module.exports = { resourceCapacities };
