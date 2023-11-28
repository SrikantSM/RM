const resource1Capacity = require("./resourceCapacities/resourceCapacity1");
const resource2Capacity = require("./resourceCapacities/resourceCapacity2");
const resource3Capacity = require("./resourceCapacities/resourceCapacity3");
const resource4Capacity = require("./resourceCapacities/resourceCapacity4");
const resource5Capacity = require("./resourceCapacities/resourceCapacity5");

const resourceCapacity = [];

resourceCapacity.push(...resource1Capacity.resourceCapacity);
resourceCapacity.push(...resource2Capacity.resourceCapacity);
resourceCapacity.push(...resource3Capacity.resourceCapacity);
resourceCapacity.push(...resource4Capacity.resourceCapacity);
resourceCapacity.push(...resource5Capacity.resourceCapacity);
module.exports = {
	resourceCapacity
};
