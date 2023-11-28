const deliverOrganization = require("./organizationHeaders");
const project1 = {
	ID: "P_ID1_UIVERI5_EX",
	name: "UIVeri5 Test Project 1",
	startDate: "2018-11-01",
	endDate: "2029-02-28",
	customer_ID: "17100001",
	serviceOrganization_code: deliverOrganization.organizationHeader1.code
};

const project2 = {
	ID: "P_ID2_UIVERI5_EX",
	name: "UIVeri5 Test Project 2",
	startDate: "2018-11-01",
	endDate: "2029-02-28",
	customer_ID: "17100002",
	serviceOrganization_code: deliverOrganization.organizationHeader2.code
};

const project3 = {
	ID: "P_ID3_UIVERI5_EX",
	name: "UIVeri5 Test Project 3",
	startDate: "2018-11-01",
	endDate: "2029-02-28",
	customer_ID: "17100003",
	serviceOrganization_code: deliverOrganization.organizationHeader3.code
};

const project4 = {
	ID: "P_ID4_UIVERI5_EX",
	name: "UIVeri5 Test Project 4",
	startDate: "2018-11-01",
	endDate: "2029-02-28",
	customer_ID: "17100004",
	serviceOrganization_code: deliverOrganization.organizationHeader4.code
};

const project5 = {
	ID: "P_ID5_UIVERI5_EX",
	name: "UIVeri5 Test Project 5",
	startDate: "2018-11-01",
	endDate: "2029-02-28",
	customer_ID: "17100005",
	serviceOrganization_code: deliverOrganization.organizationHeader4.code
};

const projects = [project1, project2, project3, project4, project5];

module.exports = {
	projects,
	project1,
	project2,
	project3,
	project4,
	project5
};
