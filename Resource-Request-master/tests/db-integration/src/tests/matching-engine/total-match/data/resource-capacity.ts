import { ResourceCapacity } from 'test-commons';
import { resourceHeader } from './resource-header';

let resourceCapacityData: ResourceCapacity[] = [];

// create 90 days capacity data for reach resource

resourceHeader.forEach((element) => {
  const resourceCapacity: ResourceCapacity[] = [
    {
      resource_id: element.ID,
      startTime: '2019-01-01 00:00:00.000',
      workingTimeInMinutes: 5082,
      overTimeInMinutes: 30,
      plannedNonWorkingTimeInMinutes: 45,
      bookedTimeInMinutes: 67,
      endTime: '2019-01-02 00:00:00.000',
    },
    {
      resource_id: element.ID,
      startTime: '2019-02-01 00:00:00.000',
      workingTimeInMinutes: 5082,
      overTimeInMinutes: 30,
      plannedNonWorkingTimeInMinutes: 45,
      bookedTimeInMinutes: 67,
      endTime: '2019-02-02 00:00:00.000',
    },
    {
      resource_id: element.ID,
      startTime: '2019-03-01 00:00:00.000',
      workingTimeInMinutes: 5082,
      overTimeInMinutes: 30,
      plannedNonWorkingTimeInMinutes: 45,
      bookedTimeInMinutes: 67,
      endTime: '2019-03-02 00:00:00.000',
    },
  ];

  resourceCapacityData = [...resourceCapacityData, ...resourceCapacity];
});

const resourceCapacityForRRWithDayWiseSplit: ResourceCapacity[] = [
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-04 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-05 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-05 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-06 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-06 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-07 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-07 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-08 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-08 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-09 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-09 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-10 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-10 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-11 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-11 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-12 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-12 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-13 00:00:00.000',
  },
  {
    resource_id: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    startTime: '2020-01-13 00:00:00.000',
    workingTimeInMinutes: 3082,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 1567,
    endTime: '2020-01-14 00:00:00.000',
  },

];


const resourceCapacityForRRWithWeekWiseSplit: ResourceCapacity[] = [  
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-01 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 20,
    plannedNonWorkingTimeInMinutes: 20,
    bookedTimeInMinutes: 120,
    endTime: '2020-01-02 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-02 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-03 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-03 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 320,
    endTime: '2020-01-04 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-04 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-05 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-05 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-06 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-06 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 105,
    endTime: '2020-01-07 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-07 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 225,
    endTime: '2020-01-08 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-08 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 225,
    endTime: '2020-01-09 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-09 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 105,
    endTime: '2020-01-10 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-10 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 480,
    endTime: '2020-01-11 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-11 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-12 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-12 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-13 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-13 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 465,
    endTime: '2020-01-14 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-14 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 105,
    endTime: '2020-01-15 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-15 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 220,
    endTime: '2020-01-16 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-16 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 265,
    endTime: '2020-01-17 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-17 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-18 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-18 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-19 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-19 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-20 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-20 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-01-21 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-21 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 240,
    endTime: '2020-01-22 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-22 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-01-23 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-23 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 40,
    endTime: '2020-01-24 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-24 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 480,
    endTime: '2020-01-25 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-25 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-26 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-26 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-01-27 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-27 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-01-28 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-28 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 360,
    endTime: '2020-01-29 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-29 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 405,
    endTime: '2020-01-30 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-30 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 265,
    endTime: '2020-01-31 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-01-31 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 45,
    bookedTimeInMinutes: 105,
    endTime: '2020-02-01 00:00:00.000',
  },
  
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-01 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 480,
    endTime: '2020-02-02 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-02 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 480,
    endTime: '2020-02-03 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-03 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-04 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-04 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-05 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-05 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-06 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-06 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-07 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-07 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 480,
    endTime: '2020-02-08 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-08 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-09 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-09 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-10 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-10 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-11 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-11 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-12 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-12 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-13 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-13 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 240,
    endTime: '2020-02-14 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-14 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-15 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-15 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-16 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-16 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-17 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-17 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-18 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-18 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-19 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-19 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-20 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-20 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-21 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-21 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-22 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-22 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-23 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-23 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-24 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-24 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 0,
    endTime: '2020-02-25 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-25 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 120,
    endTime: '2020-02-26 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-26 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 240,
    endTime: '2020-02-27 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-27 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 240,
    endTime: '2020-02-28 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-28 00:00:00.000',
    workingTimeInMinutes: 480,
    overTimeInMinutes: 30,
    plannedNonWorkingTimeInMinutes: 30,
    bookedTimeInMinutes: 240,
    endTime: '2020-02-29 00:00:00.000',
  },
  {
    resource_id: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    startTime: '2020-02-29 00:00:00.000',
    workingTimeInMinutes: 0,
    overTimeInMinutes: 0,
    plannedNonWorkingTimeInMinutes: 0,
    bookedTimeInMinutes: 0,
    endTime: '2020-03-01 00:00:00.000',
  },
  
];


resourceCapacityData = [...resourceCapacityData, ...resourceCapacityForRRWithDayWiseSplit, ...resourceCapacityForRRWithWeekWiseSplit];

export { resourceCapacityData };
