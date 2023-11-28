const path = require('path');

module.exports = class ServiceOrgCsvWriter {
    constructor(testEnvironment) {
        this.testEnvironment = testEnvironment;
    }

    async generateServiceOrgData() {
        const bsoDetailsRepository = await this.testEnvironment.getBsoDetailsRepository();
        const csvWriter = await this.testEnvironment.getCsvWriter();
        const DATACSVPATH = path.resolve(__dirname, '../data/serviceOrgData/generated-serviceOrgData.csv');
        const allBsoDetails = await bsoDetailsRepository.selectAll();
        console.log(`all service org ${allBsoDetails.length}`);
        const uploadData = [];
        for (const serviceOrg of allBsoDetails) {
            const tuple = {
                code: serviceOrg.code,
                description: serviceOrg.description,
                isDelivery: serviceOrg.isDelivery,
                companyCode: serviceOrg.companyCode,
                costCenterID: serviceOrg.costCenter
            };
            uploadData.push(tuple);
        }
        console.log(`Length of upload data: ${uploadData.length}`);
        await csvWriter.createCsvFile(DATACSVPATH, uploadData);
    }
};
