import { InternalWorkExperience } from '../../../serviceEntities/myProjectExperienceService/InternalWorkExperience';
import { employeeHeaderWithDescription1 } from '../../db';

export const createInternalWorkExperience: InternalWorkExperience = {
    assignment_ID: '8bff352e-18e2-4187-8342-545cf6d81896',
    resourceRequest_ID: '638ee701-db64-48bd-a073-2feee3ca8650',
    assignmentStatus: 'Soft-Booked',
    startDate: '2018-01-01',
    endDate: '2018-01-01',
    assignedCapacity: 360,
    rolePlayed: 'random Role',
    customerName: 'random Customer',
    requestName: 'request Name',
    requestDisplayId: 'displayId',
    convertedAssignedCapacity: '60 hr',
    employee_ID: employeeHeaderWithDescription1.ID,
    companyName: 'ramdom Company',
    workItemName: 'Work Item Name 1',
};
