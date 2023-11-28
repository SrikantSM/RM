const uuid = require("uuid").v4;
const referenceObject1 = {
	ID: uuid(),
	displayId: "Ref Object 1",
	name: "Ref Object 1-E2E"
};
const referenceObject2 = {
	ID: uuid(),
	displayId: "Ref Object 2",
	name: "Ref Object 2-E2E"
};
const referenceObject3 = {
	ID: uuid(),
	displayId: "Ref Object 3",
	name: "Ref Object 3-E2E"
};
const referenceObject = [referenceObject1, referenceObject2, referenceObject3];
module.exports = {
	referenceObject,
	referenceObject1,
	referenceObject2,
	referenceObject3
};