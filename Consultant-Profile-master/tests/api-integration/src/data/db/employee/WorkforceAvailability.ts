import {
    WorkforceAvailability, WorkforceAvailabilityInterval, WorkforceAvailabilitySupplement, ResourceCapacity,
} from 'test-commons';

import { v4 as uuid } from 'uuid';
import {
    allWorkAssignment,
    workAssignment1,
    workAssignment3,
} from './WorkAssignment';
import {
    allWorkforcePerson,
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
} from './WorkforcePerson';

const availabilityInterval1: WorkforceAvailabilityInterval = {
    intervalStart: '09:00',
    intervalEnd: '13:00',
    contribution: '04:00',
};

const availabilityInterval2: WorkforceAvailabilityInterval = {
    intervalStart: '14:00',
    intervalEnd: '17:00',
    contribution: '03:00',
};

const availabilitySupplement1: WorkforceAvailabilitySupplement = {
    intervalStart: '13:00',
    intervalEnd: '14:00',
    contribution: '01:00',
};

const workforceAvailability1: WorkforceAvailability = {
    id: uuid(),
    workAssignmentID: workAssignment1.externalID,
    workforcePerson_ID: workforcePersonWithDescription1.ID,
    availabilityDate: '2016-01-01',
    normalWorkingTime: '08:00',
    availabilityIntervals: [availabilityInterval1, availabilityInterval2],
    availabilitySupplements: [availabilitySupplement1],
};

const workforceAvailability2: WorkforceAvailability = {
    id: uuid(),
    workAssignmentID: workAssignment3.externalID,
    workforcePerson_ID: workforcePersonWithDescription2.ID,
    availabilityDate: '2023-04-04',
    normalWorkingTime: '08:00',
    availabilityIntervals: [availabilityInterval1, availabilityInterval2],
    availabilitySupplements: [availabilitySupplement1],
};

const workforceAvailability3: WorkforceAvailability = {
    id: 'b3a980c8-257e-429a-a8d3-f1c2c1695ed2',
    workAssignmentID: allWorkAssignment[5].externalID,
    workforcePerson_ID: allWorkforcePerson[2].ID,
    availabilityDate: '2023-04-11',
    normalWorkingTime: '08:00',
    availabilityIntervals: [availabilityInterval1, availabilityInterval2],
    availabilitySupplements: [availabilitySupplement1],
};

const date1 = new Date('2016-01-01');
const datePlusOne1 = new Date('2016-01-02');
const date2 = new Date('2023-04-04');
const datePlusOne2 = new Date('2023-04-05');
const date3 = new Date('2023-04-11');
const datePlusOne3 = new Date('2023-04-12');

const capacity1: ResourceCapacity = {
    resource_id: workAssignment1.ID,
    startTime: date1.toJSON(),
    workingTimeInMinutes: 420,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 60,
    bookedTimeInMinutes: 0,
    endTime: datePlusOne1.toJSON(),
};

const capacity2: ResourceCapacity = {
    resource_id: workAssignment3.ID,
    startTime: date2.toJSON(),
    workingTimeInMinutes: 420,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 60,
    bookedTimeInMinutes: 0,
    endTime: datePlusOne2.toJSON(),
};

const capacity3: ResourceCapacity = {
    resource_id: allWorkAssignment[5].ID,
    startTime: date3.toJSON(),
    workingTimeInMinutes: 420,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 60,
    bookedTimeInMinutes: 0,
    endTime: datePlusOne3.toJSON(),
};

const allWorkforceAvailability = [
    workforceAvailability1,
    workforceAvailability2,
    workforceAvailability3,
];

const allCapacity = [
    capacity1,
    capacity2,
    capacity3,
];

export {
    allWorkforceAvailability,
    allCapacity,
    workforceAvailability1,
    workforceAvailability2,
    workforceAvailability3,
};
