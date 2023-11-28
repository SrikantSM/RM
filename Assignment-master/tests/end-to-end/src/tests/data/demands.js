const uuid = require("uuid").v4;

const demand1 = {
	ID: uuid(),
	externalID: "1010"
};

const demand2 = {
	ID: uuid(),
	externalID: "1010"
};

const demand3 = {
	ID: uuid(),
	externalID: "1010"
};

const demand4 = {
	ID: uuid(),
	externalID: "1010"
};

const demand5 = {
	ID: uuid(),
	externalID: "1010"
};

const demands = [demand1, demand2, demand3, demand4, demand5];

module.exports = {
	demands,
	demand1,
	demand2,
	demand3,
	demand4,
	demand5
};
