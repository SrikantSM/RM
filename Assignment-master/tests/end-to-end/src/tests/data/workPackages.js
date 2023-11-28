const projects = require("./projects");

const workPackage1 = {
	ID: "RSH_WP1_UIVERI5",
	name: "UIVERI5_WP_Name1",
	startDate: "2020-01-01",
	endDate: "9999-02-01",
	project_ID: projects.project1.ID
};

const workPackage2 = {
	ID: "RSH_WP2_UIVERI5",
	name: "UIVERI5_WP_Name2",
	startDate: "2020-01-01",
	endDate: "9999-02-01",
	project_ID: projects.project2.ID
};

const workPackage3 = {
	ID: "RSH_WP3_UIVERI5",
	name: "UIVERI5_WP_Name3",
	startDate: "2020-01-01",
	endDate: "9999-02-01",
	project_ID: projects.project3.ID
};

const workPackage4 = {
	ID: "RSH_WP4_UIVERI5",
	name: "UIVERI5_WP_Name4",
	startDate: "2020-01-01",
	endDate: "9999-02-01",
	project_ID: projects.project4.ID
};

const workPackage5 = {
	ID: "RSH_WP5_UIVERI5",
	name: "UIVERI5_WP_Name5",
	startDate: "2020-01-01",
	endDate: "9999-02-01",
	project_ID: projects.project5.ID
};

const workPackages = [workPackage1, workPackage2, workPackage3, workPackage4, workPackage5];

module.exports = {
	workPackages,
	workPackage1,
	workPackage2,
	workPackage3,
	workPackage4,
	workPackage5
};
