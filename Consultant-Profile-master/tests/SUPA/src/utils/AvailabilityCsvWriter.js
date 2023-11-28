const path = require('path');

module.exports = class AvailabilityCsvWriter {
    constructor(testEnvironment) {
        this.testEnvironment = testEnvironment;
    }

    async generateAvailabilityData() {
        const availabilityReplicationViewRepository = await this.testEnvironment.getAvailabilityReplicationViewRepository();
        const csvWriter = await this.testEnvironment.getCsvWriter();
        const s4CostCenterIDList = [{ s4costCenterId: 'D0_2' }];
        const DATACSVPATH = path.resolve(__dirname, '../data/availabilityData/generated-availabilityData.csv');
        const allAvailabilityReplicationViews = await availabilityReplicationViewRepository.selectAllByData(s4CostCenterIDList);
        const availabilityReplicationViewsList = allAvailabilityReplicationViews.slice(0, 44);
        console.log(`${availabilityReplicationViewsList.length} no of resources found for cost center D0_2`);
        const uploadData = [];
        for (const assignment of availabilityReplicationViewsList) {
            const waStartDate = new Date(assignment.workAssignmentStartDate);
            const waEndDate = new Date(assignment.workAssignmentEndDate);
            const yearStart = new Date(new Date().getFullYear(), 0, 1);
            const yearEnd = new Date(new Date().getFullYear(), 11, 31);
            if ((waEndDate >= yearEnd) && (waStartDate <= yearStart)
                && (!assignment.isBusinessPurposeCompleted)) {
                for (let i = yearStart; i <= yearEnd; i.setDate(i.getDate() + 1)) {
                    const offset = i.getTimezoneOffset();
                    const startDate = new Date(i.getTime() - (offset * 60 * 1000));
                    const tuple = {
                        resourceId: assignment.resourceId,
                        workForcePersonExternalId: assignment.workForcePersonExternalId,
                        firstName: assignment.firstName,
                        lastName: assignment.lastName,
                        s4costCenterId: assignment.s4costCenterId,
                        workAssignmentExternalId: assignment.workAssignmentExternalId,
                        startDate: startDate.toISOString().split('T')[0],
                        plannedWorkingHours: 8,
                        nonWorkingHours: 0,
                    };
                    uploadData.push(tuple);
                }
            }
        }
        console.log(`Length of upload data: ${uploadData.length}`);
        await csvWriter.createCsvFile(DATACSVPATH, uploadData);
    }
};
