const uuid = require("uuid").v4;
const { resourceRequests } = require("./resourceRequests");
const dynamicDateGenerator = require("./dynamicDateGenerator/dynamicDateGenerator");
const capacityRequirement1 = {
	ID: uuid(),
	startDate: dynamicDateGenerator.getISOcurrentDate(1),
	endDate: dynamicDateGenerator.getISOcurrentDate(240),
	startTime: dynamicDateGenerator.getCurrentDay(1),
	endTime: dynamicDateGenerator.getCurrentDay(240),
	requestedCapacity: 400,
	requestedUnit: "H",
	requestedCapacityInMinutes: 24000,
	resourceRequest_ID: resourceRequests[6].ID
};
const capacityRequirement = [capacityRequirement1];
module.exports = { capacityRequirement, capacityRequirement1 };
