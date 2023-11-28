import { ResourceCapacity, ResourceHeader } from 'test-commons';
import { getDate, getNoOfDaysInMonth } from '../../../utils/util';
import { getResourceHeadersBatchDynamicData } from './resourceHeaders';
import { RESOURCE_CAPACITY_NUMBER_OF_MONTHS, RESOURCE_CAPACITY_NUMBER_OF_WORKING_DAYS, RESOURCE_CAPACITY_WORKING_TIME_IN_MINUTES, RESOURCE_CAPACITY_OVER_TIME_IN_MINUTES, RESOURCE_CAPACITY_PLANNED_NON_WORKING_TIME_IN_MINUTES, RESOURCE_CAPACITY_BOOKED_TIME_IN_MINUTES } from './config';
let resourceCapacities: ResourceCapacity[] = [];
let lastBatchNum: number | null = null;
const uuid = require('uuid').v4;

export function getResourceCapacitiesBatchDynamicData(batchNum: number) {
	if (batchNum !== lastBatchNum) {
		const resourceHeaders: ResourceHeader[] = getResourceHeadersBatchDynamicData(batchNum);
		resourceCapacities = [];
		for (let i = 0; i < resourceHeaders.length; i += 1) {
			const resourceHeader = resourceHeaders[i];
			for (let count = 0; count < RESOURCE_CAPACITY_NUMBER_OF_MONTHS; count += 1) {
				var month = count - 12;
				var totalDays = getNoOfDaysInMonth(month);
				for (let x = 0; x < totalDays; x += 1) {
					var startWorkingDayDate = getDate(month, x + 1);
					var endWorkingDayDate = getDate(month, x + 2);
					if (x < RESOURCE_CAPACITY_NUMBER_OF_WORKING_DAYS) {
						const resourceCapacity: ResourceCapacity = {
							resource_id: resourceHeader.ID,
							startTime: startWorkingDayDate,
							workingTimeInMinutes: RESOURCE_CAPACITY_WORKING_TIME_IN_MINUTES,
							overTimeInMinutes: RESOURCE_CAPACITY_OVER_TIME_IN_MINUTES,
							plannedNonWorkingTimeInMinutes: RESOURCE_CAPACITY_PLANNED_NON_WORKING_TIME_IN_MINUTES,
							bookedTimeInMinutes: RESOURCE_CAPACITY_BOOKED_TIME_IN_MINUTES,
							endTime: endWorkingDayDate
						};
						resourceCapacities.push(resourceCapacity);
					}
					else {
						const resourceCapacity: ResourceCapacity = {
							resource_id: resourceHeader.ID,
							startTime: startWorkingDayDate,
							workingTimeInMinutes: 0,
							overTimeInMinutes: 0,
							plannedNonWorkingTimeInMinutes: 0,
							bookedTimeInMinutes: 0,
							endTime: endWorkingDayDate
						};
						resourceCapacities.push(resourceCapacity);
					}
				}
			}
		}
		lastBatchNum = batchNum;
	}
	return resourceCapacities;
}
