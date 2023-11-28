const demands = require("./demands");
const projects = require("./projects");
const workPackages = require("./workPackages");
const { projectRoles } = require("./projectRoles");
const deliverOrganization = require("./organizationHeaders");
const resourceOrganization = require("./resourceOrganizations");
const referenceObject = require("./referenceObject");
const uuid = require("uuid").v4;
const dynamicDateGenerator = require("./dynamicDateGenerator/dynamicDateGenerator");

const description1 = "Resource Request for Excelsior-JAVA in Resource Management";
const description2 = "Resource Request for Excelsior-Javascript in Resource Management";
const description3 = "Resource Request for Excelsior-Nodejs in Resource Management";
const description4 = "Resource Request for Excelsior-UI5 in Resource Management";

const resourceRequestDesc1 = {
	description: description1
};

const resourceRequestDesc2 = {
	description: description2
};
const resourceRequestDesc3 = {
	description: description3
};

const resourceRequestDesc4 = {
	description: description4
};
const displayId1 = {
	displayId: "DISP_EX_1"
};

const displayId2 = {
	displayId: "DISP_EX_2"
};
const displayId3 = {
	displayId: "DISP_EX_3"
};

const displayId4 = {
	displayId: "DISP_EX_4"
};

const displayId5 = {
	displayId: "DISP_EX_5"
};

const displayId6 = {
	displayId: "DISP_EX_6"
};

const displayId7 = {
	displayId: "DISP_EX_7"
};

const displayId8 = {
	displayId: "DISP_EX_8"
};

const allDisplayId = [displayId1, displayId2, displayId3, displayId4, displayId5, displayId6, displayId7, displayId8];
const allResourceRequestDesc = [resourceRequestDesc1, resourceRequestDesc2, resourceRequestDesc3, resourceRequestDesc4];
const resourceRequest1 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name1",
	displayId: displayId1.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage1.ID,
	requestedResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	processingResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	demand_ID: demands.demand1.ID,
	project_ID: projects.project1.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 0,
	releaseStatus_code: 1,
	projectRole_ID: projectRoles[0].ID,
	requestedCapacityInMinutes: 36000,
	description: description1,
	referenceObject_ID: referenceObject.referenceObject[0].ID,
	referenceObjectType_code: 1
};

const resourceRequest2 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name2",
	displayId: displayId2.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage2.ID,
	requestedResourceOrg_ID: resourceOrganization.resOrg2.displayId,
	processingResourceOrg_ID: resourceOrganization.resOrg2.displayId,
	demand_ID: demands.demand2.ID,
	project_ID: projects.project2.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 1,
	releaseStatus_code: 1,
	projectRole_ID: projectRoles[1].ID,
	requestedCapacityInMinutes: 42000,
	description: description2,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequest3 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name3",
	displayId: displayId3.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage3.ID,
	requestedResourceOrg_ID: resourceOrganization.resOrg3.displayId,
	processingResourceOrg_ID: resourceOrganization.resOrg3.displayId,
	demand_ID: demands.demand3.ID,
	project_ID: projects.project3.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 0,
	releaseStatus_code: 1,
	projectRole_ID: projectRoles[2].ID,
	requestedCapacityInMinutes: 78000,
	description: description3,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequest4 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name4",
	displayId: displayId4.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage4.ID,
	requestedResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	processingResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	demand_ID: demands.demand4.ID,
	project_ID: projects.project4.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 0,
	releaseStatus_code: 1,
	projectRole_ID: projectRoles[3].ID,
	requestedCapacityInMinutes: 36000,
	description: description4,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequest5 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name5",
	displayId: displayId5.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage5.ID,
	requestedResourceOrg_ID: resourceOrganization.resOrg3.displayId,
	processingResourceOrg_ID: resourceOrganization.resOrg3.displayId,
	demand_ID: demands.demand5.ID,
	project_ID: projects.project5.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 0,
	releaseStatus_code: 1,
	projectRole_ID: projectRoles[4].ID,
	requestedCapacityInMinutes: 36000,
	description: description4,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequest6 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name6",
	displayId: displayId6.displayId,
	isS4Cloud: true,
	requestedResourceOrg_ID: resourceOrganization.resOrg3.displayId,
	processingResourceOrg_ID: resourceOrganization.resOrg3.displayId,
	demand_ID: demands.demand5.ID,
	project_ID: projects.project5.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 0,
	releaseStatus_code: 1,
	projectRole_ID: projectRoles[5].ID,
	requestedCapacityInMinutes: 36000,
	description: description4,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequest7 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name7",
	displayId: displayId7.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage5.ID,
	processingResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	requestedResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	demand_ID: demands.demand5.ID,
	project_ID: projects.project5.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 0,
	releaseStatus_code: 1,
	priority_code: 0,
	projectRole_ID: projectRoles[5].ID,
	requestedCapacityInMinutes: 24000,
	requestedCapacity: 400,
	requestedUnit: "H",
	description: description4,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequest8 = {
	ID: uuid(),
	name: "UIVERI5_WP_Name8",
	displayId: displayId8.displayId,
	isS4Cloud: true,
	workpackage_ID: workPackages.workPackage5.ID,
	processingResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	requestedResourceOrg_ID: resourceOrganization.resOrg1.displayId,
	demand_ID: demands.demand5.ID,
	project_ID: projects.project5.ID,
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestStatus_code: 1,
	releaseStatus_code: 1,
	priority_code: 0,
	projectRole_ID: projectRoles[5].ID,
	requestedCapacityInMinutes: 24000,
	requestedCapacity: 400,
	requestedUnit: "H",
	description: description4,
	referenceObject_ID: referenceObject.referenceObject[1].ID,
	referenceObjectType_code: 0
};

const resourceRequests = [
	resourceRequest1,
	resourceRequest2,
	resourceRequest3,
	resourceRequest4,
	resourceRequest5,
	resourceRequest6,
	resourceRequest7,
	resourceRequest8
];

module.exports = {
	resourceRequests,
	allDisplayId
};
