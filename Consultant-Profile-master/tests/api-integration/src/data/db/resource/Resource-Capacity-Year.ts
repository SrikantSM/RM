import { ResourceCapacity } from 'test-commons';
import { resourceHeader2, resourceHeader3, resourceHeader6 } from './Resource-Header';

const now = new Date(Date.now());
const currentYearStart = new Date(Date.UTC(now.getFullYear(), 0, 1));
const currentYearEnd = new Date(Date.UTC(now.getFullYear(), 0, 2));
const nextYearStart = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));
const nextYearEnd = new Date(Date.UTC(now.getFullYear() + 1, 0, 2));

const resource2Capacity1: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: currentYearStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentYearEnd.toJSON(),
};

const resource2Capacity2: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: nextYearStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nextYearEnd.toJSON(),
};

const resource3Capacity1: ResourceCapacity = {
    resource_id: resourceHeader3.ID,
    startTime: currentYearStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentYearEnd.toJSON(),
};

const resource6Capacity1: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: currentYearStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentYearEnd.toJSON(),
};

const resource6Capacity2: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: nextYearStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nextYearEnd.toJSON(),
};

const allResourceCapacityYearly = [
    resource2Capacity1,
    resource2Capacity2,
    resource3Capacity1,
    resource6Capacity1,
    resource6Capacity2,
];

export { allResourceCapacityYearly };
