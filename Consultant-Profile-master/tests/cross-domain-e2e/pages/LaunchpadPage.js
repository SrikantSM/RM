
var elements = {
    consultantProfileTile: element(by.control({
    	  controlType: "sap.m.GenericTile",
    	  properties: {header: "My Project Experience"}
    })),
    ProjectRoleTile: element(by.control({
        controlType: "sap.m.GenericTile",
        properties: {header: "Manage Project Roles" }  

    })),
    MyAssignmentsTile: element(by.control({
        controlType: "sap.m.GenericTile",
        properties: {header: "My Assignments" }  

    })),
    title: element(by.control({
  	  controlType: "sap.ushell.ui.shell.ShellAppTitle",
	  properties: {text: "Home"}
    }))
};
var actions = {
    openMyProjectExperienceListApp: async function () {
         elements.consultantProfileTile.click();
    },
    openProjectRolesApp: async function () {
        elements.ProjectRoleTile.click();
    },
    openMyAssignmentsApp: async function () {
        elements.MyAssignmentsTile.click();
    },
};

module.exports = {
    elements: elements,
    actions: actions
};