import { ResourceCapacity } from 'test-commons';
import { resourceHeaderData } from './resource-header';

let resourceCapacityDataTemp: ResourceCapacity[] = [];

// create 90 days capacity data for reach resource

resourceHeaderData.forEach((element) => {
  const resourceCapacity: ResourceCapacity[] = [
    {
      resource_id: element.ID,
      startTime: '2020-01-01 00:00:00.000',
      workingTimeInMinutes: 5082,
      overTimeInMinutes: 30,
      plannedNonWorkingTimeInMinutes: 45,
      bookedTimeInMinutes: 67,
      endTime: '2020-01-02 00:00:00.000',
    },
    {
      resource_id: element.ID,
      startTime: '2020-02-01 00:00:00.000',
      workingTimeInMinutes: 5082,
      overTimeInMinutes: 30,
      plannedNonWorkingTimeInMinutes: 45,
      bookedTimeInMinutes: 67,
      endTime: '2020-02-02 00:00:00.000',
    },
    {
      resource_id: element.ID,
      startTime: '2020-03-01 00:00:00.000',
      workingTimeInMinutes: 5082,
      overTimeInMinutes: 30,
      plannedNonWorkingTimeInMinutes: 45,
      bookedTimeInMinutes: 67,
      endTime: '2020-03-02 00:00:00.000',
    },
  ];

  resourceCapacityDataTemp = [...resourceCapacityDataTemp, ...resourceCapacity];
});

const resourceCapacityData = resourceCapacityDataTemp;
export { resourceCapacityData };
