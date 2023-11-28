interface EntityFieldMap {
    entityName: string;
    entityFieldsToUniquify: string[];
}

export const EntityFieldMapping: EntityFieldMap[] = [
    {
        entityName: 'Assignments',
        entityFieldsToUniquify: ['ID', 'resourceRequest_ID', 'resource_ID']
    },
    {
        entityName: 'AssignmentBucket',
        entityFieldsToUniquify: ['ID', 'assignment_ID']
    },
    {
        entityName: 'CapacityGridHeader',
        entityFieldsToUniquify: ['ID', 'workforcePersonID']
    },
    {
        entityName: 'CapacityGridHeaderKPITemporal',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CapacityGridHeaderTemporal',
        entityFieldsToUniquify: ['ID', 'workforcePersonID']
    },
    {
        entityName: 'CapacityGridMonthlyUtilization',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CapacityGridMonthlyUtilizationTemporal',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CapacityGridDailyUtilization',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CapacityGridDailyUtilizationTemporal',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CapacityGridWeeklyUtilizationTemporal',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'RequestDetailsForEachAssignment',
        entityFieldsToUniquify: ['resourceRequest_ID', 'projectRoleId']
    },
    {
        entityName: 'EmployeeHeader',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'ResourceHeader',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'ProjectRole',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'ProjectRoleText',
        entityFieldsToUniquify: ['ID_Texts', 'ID']
    },
    {
        entityName: 'ResourceRequest',
        entityFieldsToUniquify: ['ID', 'projectRole_ID', 'demand_ID']
    },
    {
        entityName: 'ResourceCapacity',
        entityFieldsToUniquify: ['resource_id']
    },
    {
        entityName: 'WorkAssignment',
        entityFieldsToUniquify: ['ID', 'workAssignmentID', 'parent']
    },
    {
        entityName: 'WorkforcePerson',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CostCenter',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'CostCenterAttribute',
        entityFieldsToUniquify: ['ID', 'parent']
    },
    {
        entityName: 'ProfileDetail',
        entityFieldsToUniquify: ['ID', 'parent']
    },
    {
        entityName: 'Email',
        entityFieldsToUniquify: ['ID', 'parent']
    },
    {
        entityName: 'Phone',
        entityFieldsToUniquify: ['ID', 'parent']
    },
    {
        entityName: 'WorkPlaceAddress',
        entityFieldsToUniquify: ['ID', 'parent']
    },
    {
        entityName: 'JobDetail',
        entityFieldsToUniquify: ['ID', 'parent', 'costCenterexternalID']
    },
    {
        entityName: 'CapacityRequirement',
        entityFieldsToUniquify: ['ID', 'resourceRequest_ID']
    },
    {
        entityName: 'CapacityGridView',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'Demand',
        entityFieldsToUniquify: ['ID']
    },
    {
        entityName: 'ResourceSupply',
        entityFieldsToUniquify: ['assignment_ID']
    },
    {
        entityName: 'ProfilePhoto',
        entityFieldsToUniquify: ['ID', 'employee_ID']
    }
]