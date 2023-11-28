const uuid = require("uuid").v4;
const resourceHeader = require("./resourceHeader");
const { resourceRequests } = require("./resourceRequests");

var iUniqueId = [];
for (let i = 0; i < 23; i++) {
	iUniqueId.push(uuid());
}

iUniqueId.sort();
//Resource 1
const assignment1 = {
	ID: iUniqueId[0],
	bookedCapacityInMinutes: 21600,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[0].ID,
	resource_ID: resourceHeader.resourceHeader1.ID
};

const assignment2 = {
	ID: iUniqueId[1],
	bookedCapacityInMinutes: 32400,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[1].ID,
	resource_ID: resourceHeader.resourceHeader1.ID
};

const assignment3 = {
	ID: iUniqueId[2],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[2].ID,
	resource_ID: resourceHeader.resourceHeader1.ID
};

const assignment4 = {
	ID: iUniqueId[3],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[3].ID,
	resource_ID: resourceHeader.resourceHeader1.ID
};

//Resource 2

const assignment5 = {
	ID: iUniqueId[4],
	bookedCapacityInMinutes: 21600,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[0].ID,
	resource_ID: resourceHeader.resourceHeader2.ID
};

const assignment6 = {
	ID: iUniqueId[5],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[1].ID,
	resource_ID: resourceHeader.resourceHeader2.ID
};

const assignment7 = {
	ID: iUniqueId[6],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[2].ID,
	resource_ID: resourceHeader.resourceHeader2.ID
};

const assignment8 = {
	ID: iUniqueId[7],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[3].ID,
	resource_ID: resourceHeader.resourceHeader2.ID
};

// Resource 3

const assignment9 = {
	ID: iUniqueId[8],
	bookedCapacityInMinutes: 21600,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[0].ID,
	resource_ID: resourceHeader.resourceHeader3.ID
};

const assignment10 = {
	ID: iUniqueId[9],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[1].ID,
	resource_ID: resourceHeader.resourceHeader3.ID
};

const assignment11 = {
	ID: iUniqueId[10],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[2].ID,
	resource_ID: resourceHeader.resourceHeader3.ID
};

const assignment12 = {
	ID: iUniqueId[11],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[3].ID,
	resource_ID: resourceHeader.resourceHeader3.ID
};

// Resource 4

const assignment13 = {
	ID: iUniqueId[12],
	bookedCapacityInMinutes: 21600,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[0].ID,
	resource_ID: resourceHeader.resourceHeader4.ID
};

const assignment14 = {
	ID: iUniqueId[13],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[1].ID,
	resource_ID: resourceHeader.resourceHeader4.ID
};

const assignment15 = {
	ID: iUniqueId[14],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[2].ID,
	resource_ID: resourceHeader.resourceHeader4.ID
};

const assignment16 = {
	ID: iUniqueId[15],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[3].ID,
	resource_ID: resourceHeader.resourceHeader4.ID
};

// Resource 5
const assignment17 = {
	ID: iUniqueId[16],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[0].ID,
	resource_ID: resourceHeader.resourceHeader5.ID
};
const assignment18 = {
	ID: iUniqueId[17],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 1,
	resourceRequest_ID: resourceRequests[1].ID,
	resource_ID: resourceHeader.resourceHeader5.ID
};
const assignment19 = {
	ID: iUniqueId[18],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[2].ID,
	resource_ID: resourceHeader.resourceHeader5.ID
};
const assignment20 = {
	ID: iUniqueId[19],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[3].ID,
	resource_ID: resourceHeader.resourceHeader5.ID
};

//Resource 2
const assignment21 = {
	ID: iUniqueId[20],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[4].ID,
	resource_ID: resourceHeader.resourceHeader2.ID
};

//Resource 3
const assignment22 = {
	ID: iUniqueId[21],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[5].ID,
	resource_ID: resourceHeader.resourceHeader3.ID
};

// Resource 5
const assignment23 = {
	ID: iUniqueId[22],
	bookedCapacityInMinutes: 10800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequests[7].ID,
	resource_ID: resourceHeader.resourceHeader5.ID
};


const assignments = [
	assignment1,
	assignment2,
	assignment3,
	assignment4,
	assignment5,
	assignment6,
	assignment7,
	assignment8,
	assignment21,
	assignment9,
	assignment10,
	assignment11,
	assignment12,
	assignment13,
	assignment14,
	assignment15,
	assignment16,
	assignment17,
	assignment18,
	assignment19,
	assignment20,
	assignment21,
	assignment22,
	assignment23
];

module.exports = {
	assignments,
	assignment1,
	assignment2,
	assignment3,
	assignment4,
	assignment5,
	assignment6,
	assignment7,
	assignment8,
	assignment9,
	assignment10,
	assignment11,
	assignment12,
	assignment13,
	assignment14,
	assignment15,
	assignment16,
	assignment17,
	assignment18,
	assignment19,
	assignment20,
	assignment21,
	assignment22,
	assignment23
};