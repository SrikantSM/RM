import { v4 as uuid } from 'uuid';
import { ResourceDetails } from '../../../serviceEntities/myAssignmentsService/ResourceDetails';
import { employeeHeaderWithDescription1 } from '../../db';

export const createResourceDetails: ResourceDetails = {
    resource_id: uuid(),
    startTime: '2021-06-30T00:00:00Z',
    employee_ID: employeeHeaderWithDescription1.ID,
    dayCapacity: 8,
    capacityDate: '2018-01-01',
};
