const resource1AB = require("./assignmentBuckets/resource1assignmentBucket");
const resource2AB = require("./assignmentBuckets/resource2assignmentBucket");
const resource3AB = require("./assignmentBuckets/resource3assignmentBucket");
const resource4AB = require("./assignmentBuckets/resource4assignmentBucket");
const resource5AB = require("./assignmentBuckets/resource5assignmentBucket");
const assignmentBucket = [];

assignmentBucket.push(...resource1AB.assignmentBucket);
assignmentBucket.push(...resource2AB.assignmentBucket);
assignmentBucket.push(...resource3AB.assignmentBucket);
assignmentBucket.push(...resource4AB.assignmentBucket);
assignmentBucket.push(...resource5AB.assignmentBucket);

module.exports = {
	assignmentBucket
};
