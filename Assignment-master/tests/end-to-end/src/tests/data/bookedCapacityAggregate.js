const resource1AB = require("./bookedCapacityAggregates/resource1bookedCapacityAggregates");
const resource2AB = require("./bookedCapacityAggregates/resource2bookedCapacityAggregates");
const resource3AB = require("./bookedCapacityAggregates/resource3bookedCapacityAggregates");
const resource4AB = require("./bookedCapacityAggregates/resource4bookedCapacityAggregates");
const resource5AB = require("./bookedCapacityAggregates/resource5bookedCapacityAggregates");

const bookedCapacityAggregate = [];
bookedCapacityAggregate.push(...resource1AB.bookedCapacityAggregate);
bookedCapacityAggregate.push(...resource2AB.bookedCapacityAggregate);
bookedCapacityAggregate.push(...resource3AB.bookedCapacityAggregate);
bookedCapacityAggregate.push(...resource4AB.bookedCapacityAggregate);
bookedCapacityAggregate.push(...resource5AB.bookedCapacityAggregate);

module.exports = {
	bookedCapacityAggregate
};