import { v4 as uuid } from 'uuid';
import { AssignmentRequestDetails } from '../../../serviceEntities/myAssignmentsService/AssignmentRequestDetails';

export const createAssignmentRequestDetails: AssignmentRequestDetails = {
    assignment_ID: uuid(),
    resourceRequest_ID: uuid(),
    employee_ID: uuid(),
    assignmentStatusCode: 1,
    assignmentStatus: 'Soft-Booked',
    requestDisplayId: 'Display Id',
    requestName: 'Request Name',
    projectName: 'SAP S/4HANA 1011',
    customerName: 'Test',
    workPackageStartDate: '2021-01-01',
    workPackageEndDate: '2022-01-01',
    workItemName: 'Work Item Name 1',
    startDate: '2022-01-01',
    endDate: '2022-06-01',
    requestedStartDate: '2021-01-01',
    requestedEndDate: '2022-01-01',
    assignedCapacityinHour: 500,
};
