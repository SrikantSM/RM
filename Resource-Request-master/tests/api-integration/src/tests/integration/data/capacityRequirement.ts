import { CapacityRequirement } from "test-commons";

const moment = require('moment');

export const capacityRequirements: CapacityRequirement[] = [
    {
        ID: 'bad998bd-dbad-4bad-9636-54b2ae57abad',
        startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-30T00:00:00Z',
        requestedCapacity: 15,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 900,
        resourceRequest_ID: 'bad998bd-d835-441e-9636-54b2ae57abad'
    },
    {
        ID: 'badbadbd-dbad-4bad-9636-54b2aebadbad',
        startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-30T00:00:00Z',
        requestedCapacity: 30,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 1800,
        resourceRequest_ID: 'badbadbd-d835-441e-9636-54b2aebadbad'
    },
    {
        ID: 'badbadba-d835-441e-badd-54b2aebadbad',
        startDate: moment(new Date('2020-09-03')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-28')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-29T00:00:00Z',
        requestedCapacity: 30,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 1800,
        resourceRequest_ID: 'badbadbd-d835-441e-badd-54b2aebadbad'
    },
    {
        ID: 'badbadbd-8d35-441e-0010-54b2aebadbad',
        startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-29')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-30T00:00:00Z',
        requestedCapacity: 15,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 900,
        resourceRequest_ID: 'badbadbd-d835-441e-0010-54b2aebadbad'
    },
    {
        ID: 'badbadbd-dbad-4bad-0011-54b2aebadbad',
        startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-29')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-30T00:00:00Z',
        requestedCapacity: 30,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 1800,
        resourceRequest_ID: 'badbadbd-d835-441e-0011-54b2aebadbad'
    },
    {
        ID: 'badbadba-d835-441e-0012-54b2aebadbad',
        startDate: moment(new Date('2020-09-03')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-28')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-29T00:00:00Z',
        requestedCapacity: 30,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 1800,
        resourceRequest_ID: 'badbadbd-d835-441e-0012-54b2aebadbad'
    },
    {
        ID: 'badbadbd-8d35-441e-0020-54b2aebadbad',
        startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-29')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-30T00:00:00Z',
        requestedCapacity: 15,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 900,
        resourceRequest_ID: 'badbadbd-d835-441e-0020-54b2aebadbad'
    },
    {
        ID: 'badbadbd-dbad-4bad-0021-54b2aebadbad',
        startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-29')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-30T00:00:00Z',
        requestedCapacity: 30,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 1800,
        resourceRequest_ID: 'badbadbd-d835-441e-0021-54b2aebadbad'
    },
    {
        ID: 'badbadba-d835-441e-0022-54b2aebadbad',
        startDate: moment(new Date('2020-09-03')).format('YYYY-MM-DD'),
        endDate: moment(new Date('2020-11-28')).format('YYYY-MM-DD'),
        startTime: '2020-09-01T00:00:00Z',
        endTime: '2020-11-29T00:00:00Z',
        requestedCapacity: 30,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 1800,
        resourceRequest_ID: 'badbadbd-d835-441e-0022-54b2aebadbad'
    },
];
