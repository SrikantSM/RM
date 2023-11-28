function getCSVData(resourceId, costCenter, workforcePerson, workAssignment) {
    const data = [
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        }, {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-11',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-12',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
    ];
    return data;
}

function getInvalidColContentData(resourceId, costCenter, workforcePerson, workAssignment) {
    const data = [
        {
            resourceId: 'f6ca78ec-1d00-47d0-86a3-0d9e5b89d6f4',
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: 'workforcePersonExternal_$',
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-11',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'first!@',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-12',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'last$%',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-13',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: '=cmd|’ /C calc’!A1',
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-14',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: 'workAssignment*(',
            startDate: '2018-03-15',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018/03/10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-16',
            plannedWorkingHours: '@',
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-17',
            plannedWorkingHours: 8,
            nonWorkingHours: '!',
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-18',
            plannedWorkingHours: 25,
            nonWorkingHours: 0,
        },
    ];
    return data;
}

function getMissingColContentData(resourceId, costCenter, workforcePerson, workAssignment) {
    const data = [
        {
            resourceId: null,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: null,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-11',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: null,
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-12',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: null,
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-13',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: null,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-14',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: null,
            startDate: '2018-03-15',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: null,
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-16',
            plannedWorkingHours: null,
            nonWorkingHours: 0,
        },
        {
            resourceId,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-17',
            plannedWorkingHours: 8,
            nonWorkingHours: null,
        },
    ];
    return data;
}

function getCSVDataMultipleResourceId(resourceId1, resourceId2, costCenter, workforcePerson, workAssignment1, workAssignment2) {
    const data = [
        {
            resourceId: resourceId1,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment1,
            startDate: '2019-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        }, {
            resourceId: resourceId1,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment1,
            startDate: '2019-03-11',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId: resourceId2,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment2,
            startDate: '2019-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
        {
            resourceId: resourceId2,
            workForcePersonExternalId: workforcePerson,
            firstName: 'firstName4',
            lastName: 'lastName4',
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment2,
            startDate: '2019-03-11',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
    ];
    return data;
}

function getNonMandatoryData(resourceId, costCenter, workforcePerson, workAssignment) {
    const data = [
        {
            resourceId,
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
    ];
    return data;
}

function getMissingColResourceID(resourceId, costCenter, workforcePerson, workAssignment) {
    const data = [
        {
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2018-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
    ];
    return data;
}

function getIsBPCompletedTrue(resourceId, costCenter, workforcePerson, workAssignment) {
    const data = [
        {
            resourceId,
            s4costCenterId: costCenter,
            workAssignmentExternalId: workAssignment,
            startDate: '2019-03-10',
            plannedWorkingHours: 8,
            nonWorkingHours: 0,
        },
    ];
    return data;
}

module.exports.getCSVData = getCSVData;
module.exports.getCSVDataMultipleResourceId = getCSVDataMultipleResourceId;
module.exports.getInvalidColContentData = getInvalidColContentData;
module.exports.getMissingColContentData = getMissingColContentData;
module.exports.getNonMandatoryData = getNonMandatoryData;
module.exports.getMissingColResourceID = getMissingColResourceID;
module.exports.getIsBPCompletedTrue = getIsBPCompletedTrue;
