import { ResourceCapacity } from 'test-commons';
import {
    resourceHeader2,
    resourceHeader3,
    resourceHeader5,
    resourceHeader6,
} from './Resource-Header';

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

const resourceCapacity21: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: currentMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentMonthEnd.toJSON(),
};

const resourceCapacity22: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusOneMonthEnd.toJSON(),
};

const resourceCapacity23: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: nowPlusTwoMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusTwoMonthsEnd.toJSON(),
};

const resourceCapacity24: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: nowPlusThreeMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusThreeMonthsEnd.toJSON(),
};

const resourceCapacity25: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: nowPlusFourMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusFourMonthsEnd.toJSON(),
};

const resourceCapacity26: ResourceCapacity = {
    resource_id: resourceHeader2.ID,
    startTime: nowPlusFiveMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusFiveMonthsEnd.toJSON(),
};

const resourceCapacity51: ResourceCapacity = {
    resource_id: resourceHeader5.ID,
    startTime: currentMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentMonthEnd.toJSON(),
};

const resourceCapacity52: ResourceCapacity = {
    resource_id: resourceHeader5.ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusOneMonthEnd.toJSON(),
};

const resourceCapacity53: ResourceCapacity = {
    resource_id: resourceHeader5.ID,
    startTime: nowPlusTwoMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusTwoMonthsEnd.toJSON(),
};

const resourceCapacity54: ResourceCapacity = {
    resource_id: resourceHeader5.ID,
    startTime: nowPlusThreeMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusThreeMonthsEnd.toJSON(),
};

const resourceCapacity55: ResourceCapacity = {
    resource_id: resourceHeader5.ID,
    startTime: nowPlusFourMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusFourMonthsEnd.toJSON(),
};

const resourceCapacity56: ResourceCapacity = {
    resource_id: resourceHeader5.ID,
    startTime: nowPlusFiveMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusFiveMonthsEnd.toJSON(),
};

const resourceCapacity31: ResourceCapacity = {
    resource_id: resourceHeader3.ID,
    startTime: currentMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentMonthEnd.toJSON(),
};

const resourceCapacity61: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: currentMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: currentMonthEnd.toJSON(),
};

const resourceCapacity62: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusOneMonthEnd.toJSON(),
};

const resourceCapacity63: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: nowPlusTwoMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusTwoMonthsEnd.toJSON(),
};

const resourceCapacity64: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: nowPlusThreeMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusThreeMonthsEnd.toJSON(),
};

const resourceCapacity65: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: nowPlusFourMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusFourMonthsEnd.toJSON(),
};

const resourceCapacity66: ResourceCapacity = {
    resource_id: resourceHeader6.ID,
    startTime: nowPlusFiveMonthsStart.toJSON(),
    workingTimeInMinutes: 360,
    overTimeInMinutes: 240,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 90,
    endTime: nowPlusFiveMonthsEnd.toJSON(),
};

const allResourceCapacity = [
    resourceCapacity21,
    resourceCapacity22,
    resourceCapacity23,
    resourceCapacity24,
    resourceCapacity25,
    resourceCapacity26,
    resourceCapacity51,
    resourceCapacity52,
    resourceCapacity53,
    resourceCapacity54,
    resourceCapacity55,
    resourceCapacity56,
    resourceCapacity31,
    resourceCapacity61,
    resourceCapacity62,
    resourceCapacity63,
    resourceCapacity64,
    resourceCapacity65,
    resourceCapacity66,
];

export {
    allResourceCapacity,
    resourceCapacity21,
    resourceCapacity22,
    resourceCapacity23,
    resourceCapacity24,
    resourceCapacity25,
    resourceCapacity26,
    resourceCapacity51,
    resourceCapacity52,
    resourceCapacity53,
    resourceCapacity54,
    resourceCapacity55,
    resourceCapacity56,
    resourceCapacity31,
    resourceCapacity61,
    resourceCapacity62,
    resourceCapacity63,
    resourceCapacity64,
    resourceCapacity65,
    resourceCapacity66,
};
