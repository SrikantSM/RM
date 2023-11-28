export interface AssignmentRequestDetails {
    assignment_ID: string;
    resourceRequest_ID: string;
    employee_ID: string;
    assignmentStatusCode: number,
    assignmentStatus: string,
    requestDisplayId: string;
    requestName: string;
    projectName: string;
    customerName: string;
    workPackageStartDate: string;
    workPackageEndDate: string;
    workItemName: string;
    startDate: string;
    endDate: string;
    requestedStartDate: string,
    requestedEndDate: string,
    assignedCapacityinHour: number
}
