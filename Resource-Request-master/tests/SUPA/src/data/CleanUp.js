const { testHelper } = require('../utils');
const { Constants } = require('./Constants');

async function cleanUp(appToMeasure, resourceRequestIds) {
    console.log("Executing Update Command");
    try {
        // Get common repository
        const resourceRequestRepository = await testHelper.getResourceRequestRepository();

        if (appToMeasure === Constants.StaffApp){
            // Unresolve resolved reqource request
            console.log("Unresolve RR");
            await resourceRequestRepository.updateMany('requestStatus_code', 0, [{'project_ID':Constants.resolvedProject}]);
        }
        if (appToMeasure === Constants.ManageApp){
            // Get Repository for capacity and skill requirement
            const capacityRequirementRepository = await testHelper.getCapacityRequirementRepository();
            const skillRequirementRepository = await testHelper.getSkillRequirementRepository();
            // Delete RR data generated in Setup
            console.log("Delete Capacity Data for RR");
            await capacityRequirementRepository.deleteManyByData(resourceRequestIds);
            console.log("Delete Skill Requirement Data for RR");
            await skillRequirementRepository.deleteManyByData(resourceRequestIds);
            // renaming the key to ID to delete RR Data
            resourceRequestIds.forEach(function(obj) {
                obj.ID = obj.resourceRequest_ID;
                delete obj.resourceRequest_ID;
            });
            console.log("Delete Data for RR");
            await resourceRequestRepository.deleteManyByData(resourceRequestIds);
        }
    } catch (err) {
        console.log("Faced below error while executing cleanUp:");
        console.log(err);
        process.exit(1);
    }
    console.log("Completed CleanUp");
}
module.exports.cleanUp = cleanUp;
