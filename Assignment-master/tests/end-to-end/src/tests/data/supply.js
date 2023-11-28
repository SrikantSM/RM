const assignments = require("./assignments");

const supply1 = {
	assignment_ID: assignments.assignment1.ID,
	resourceSupply_ID: "1010"
};

const supply2 = {
	assignment_ID: assignments.assignment2.ID,
	resourceSupply_ID: "1010"
};

const supply3 = {
	assignment_ID: assignments.assignment3.ID,
	resourceSupply_ID: "1010"
};

const supply4 = {
	assignment_ID: assignments.assignment4.ID,
	resourceSupply_ID: "1010"
};

const supply5 = {
	assignment_ID: assignments.assignment8.ID,
	resourceSupply_ID: "1010"
};

const supply = [supply1, supply2, supply3, supply4, supply5];

module.exports = {
	supply,
	supply1,
	supply2,
	supply3,
	supply4,
	supply5
};
