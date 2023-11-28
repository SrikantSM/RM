/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const { testHelper } = require('../utils');
const { Constants } = require('./Constants');

async function setUp(appToMeasure, numberOfRecords) {
    console.log("Starting SetUp");
    try {
        if (appToMeasure === Constants.StaffApp){
            // Get Repositories
            const organizationDetailRepository = await testHelper.getOrganizationDetailRepository();
            // While Forwarding the RR in Staff App we need Delivery Org code, the below statement fetch this data
            const deliverOrgStatement = `SELECT DISTINCT CODE FROM ${organizationDetailRepository.tableName}`;
            console.log("Fetching Delivery Org Data");
            const deliveryOrg = await organizationDetailRepository.statementExecutor.execute(deliverOrgStatement);

            console.log(deliveryOrg);
            // The fetched delivery orgs are set in Constants data which is referred during Staff App flow
            Constants.deliveyOrgCode1 = deliveryOrg[0].CODE;
            Constants.deliveyOrgCode2 = deliveryOrg[1].CODE;


            // Get Resource Organization Repository
            const resourceOrganizationRepository = await testHelper.getResourceOrganizationsRepository();
            // While Forwarding the RR in Staff App we need Resource Org code, the below statement fetch this data
            const resourceOrgStatement = `SELECT DISPLAYID FROM ${resourceOrganizationRepository.tableName}`;
            console.log("Fetching Resource Org Data");
            const resourceOrg = await resourceOrganizationRepository.statementExecutor.execute(resourceOrgStatement);

            console.log(resourceOrg);
            // The fetched delivery orgs are set in Constants data which is referred during Staff App flow
            Constants.resourceOrgCode1 = resourceOrg[0].DISPLAYID;
            Constants.resourceOrgCode2 = resourceOrg[1].DISPLAYID;
            console.log("Completed SetUp for Staff App Scenario");
        }

        if (appToMeasure === Constants.ManageApp){
            // Get Repositories
            const demandRepository = await testHelper.getDemandRepository();
            const resourceRequestRepository = await testHelper.getResourceRequestRepository();
            const capacityRequirementRepository = await testHelper.getCapacityRequirementRepository();
            const skillRequirementRepository = await testHelper.getSkillRequirementRepository();
            /* Delete All resource request that belong to the project which will be used for measurement
                This is done so that when we filter the RR on List page we only get one RR for particular project*/
            let projectListOfRRToBeDeleted = [];
            for (var projectNumber = 1; projectNumber <= numberOfRecords; projectNumber++) {
                projectListOfRRToBeDeleted.push({ project_ID: `S4PROJ_RM${projectNumber}_145`});
            }

            console.log("Fetching ID of RR that need to be delted");
            const deleteResourceRequestIDs = await resourceRequestRepository.selectByData(['ID'], (projectListOfRRToBeDeleted));
            console.log("ID of exisiting Resource Requests that will be delted:", deleteResourceRequestIDs);

            if (deleteResourceRequestIDs.length !== 0) {
                console.log("Deleting Resource Request Data");
                await resourceRequestRepository.deleteManyByData(deleteResourceRequestIDs);

                // The RR ID is referred as resourceRequest_ID in skill and capacity data so changing key of objects in array
                deleteResourceRequestIDs.forEach(function(obj) {
                    obj.resourceRequest_ID = obj.ID;
                    delete obj.ID;
                });
                console.log("Delete Capacity Data for above RR");
                await capacityRequirementRepository.deleteManyByData(deleteResourceRequestIDs);
                console.log("Delete Skill Requirement Data for above RR");
                await skillRequirementRepository.deleteManyByData(deleteResourceRequestIDs);
            } else {
                console.log("No Resource Request data to Delete");
            }
            /* Creating the IN clause for WP which belong to Projects S4PROJ_RM1_145 - S4PROJ_RM${i}_145
                This is done so that the Project id can be used to filter in List Page*/
            let listOfWP = [];
            for (var workPackageProject = 1; workPackageProject <= numberOfRecords; workPackageProject++) {
                listOfWP.push({ WORKPACKAGE_ID: `S4PROJ_RM${workPackageProject}_145.1`});
            }
            // We Fetch one demand per project so that when relevant RR is created only 1 RR per project is visible on List Page
            const demandStatement = `SELECT TOP ${numberOfRecords}
        * FROM (
        SELECT
        *, ROW_NUMBER() OVER (PARTITION BY WORKPACKAGE_ID ) as ROW_NUMBER
        FROM ${demandRepository.tableName}
        ${demandRepository.sqlGenerator.generateWhereConditionForData(demandRepository.attributeNames, listOfWP)}
        ) WHERE ROW_NUMBER = 1`;

            // Executing the above select statement
            console.log("Fetching demands data");
            const demands = await demandRepository.statementExecutor.execute(demandStatement);

            console.log(demands);

            // Validate that we got exact number of records as expected
            if (demands.length !== numberOfRecords) {
                console.log(`Terminating flow: Could not fetch ${numberOfRecords} records instead fetched ${demands.length}`);
                process.exit(1);
            }

            // Creating data for RR insertion into DB
            var resourceRequestsToUpload = [];
            var resourceRequestIds = [];

            // Get Resource Organization Repository
            const resourceOrganizationRepository = await testHelper.getResourceOrganizationsRepository();
            const resourceOrgStatement = `SELECT DISPLAYID, SERVICEORGANIZATION_CODE FROM ${resourceOrganizationRepository.tableName}`;
            console.log("Fetching Resource Org Data");
            const resourceOrg = await resourceOrganizationRepository.statementExecutor.execute(resourceOrgStatement);
            console.log(resourceOrg);

            for (let demandNumber = 0; demandNumber < numberOfRecords; demandNumber++) {
                let requestRRUoM;
                if (demands[demandNumber].requestedUoM == "H"){
                    requestRRUoM = "duration-hour";
                } else {
                    requestRRUoM = demands[demandNumber].REQUESTEDUOM;
                }
                const displayId = await resourceRequestRepository.getdisplayId();
                let filteredResOrg = resourceOrg.filter(resOrg => (resOrg.SERVICEORGANIZATION_CODE == demands[demandNumber].DELIVERYORGANIZATION_CODE));
                let rrStructure = {
                    ID: demands[demandNumber].ID,
                    displayId: displayId,
                    name: `Name_${displayId}`,
                    isS4Cloud: true,
                    requestedResourceOrg_ID: filteredResOrg[0].DISPLAYID,
                    processingResourceOrg_ID: filteredResOrg[0].DISPLAYID,
                    requestedCapacity: Number(demands[demandNumber].REQUESTEDQUANTITY),
                    requestedUnit: requestRRUoM,
                    requestedCapacityInMinutes: Number(demands[demandNumber].REQUESTEDQUANTITY) * 60,
                    demand_ID: demands[demandNumber].ID,
                    workpackage_ID: demands[demandNumber].WORKPACKAGE_ID,
                    project_ID: demands[demandNumber].WORKPACKAGE_ID.replace('.1', ''),
                    projectRole_ID: "",
                    priority_code: 1,
                    requestStatus_code: 0,
                    releaseStatus_code: 0,
                    startDate: demands[demandNumber].STARTDATE,
                    endDate: demands[demandNumber].ENDDATE,
                    startTime: demands[demandNumber].STARTDATE + " 00:00:00.000000000",
                    endTime: demands[demandNumber].ENDDATE + " 00:00:00.000000000"
                };
                resourceRequestsToUpload.push(rrStructure);
                resourceRequestIds.push({ resourceRequest_ID:rrStructure.ID });
            }

            console.log(resourceRequestsToUpload);

            // Inserting RR into DB
            console.log("Inserting RR data");
            await resourceRequestRepository.insertMany(resourceRequestsToUpload);
            console.log("Completed SetUp for Manage App Scenario");
            // The Id's are sent to the cleanup script so that the created data can be cleaned up
            return resourceRequestIds;
        }
    } catch (err) {
        console.log('Terminating flow due to below failure');
        console.log(err);
        process.exit(1);
    }
}

module.exports.setUp = setUp;
