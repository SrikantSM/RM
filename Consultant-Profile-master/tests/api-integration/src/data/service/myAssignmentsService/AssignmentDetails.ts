import { v4 as uuid } from 'uuid';
import { AssignmentDetails } from '../../../serviceEntities/myAssignmentsService/AssignmentDetails';
import { employeeHeaderWithDescription1 } from '../../db';

export const createAssignmentDetails: AssignmentDetails = {
    ID: uuid(),
    assignment_ID: uuid(),
    resource_ID: uuid(),
    resourceRequest_ID: uuid(),
    startTime: '2021-06-30T00:00:00Z',
    AssignedHours: 4,
    employee_ID: employeeHeaderWithDescription1.ID,
    assignmentStartDate: '2021-01-01',
};
