const elements = {
    consultantProfileTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'My Project Experience' },
    })),
    ProjectRoleTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Manage Project Roles' },

    })),
    AvailabilityDataTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Maintain Availability Data' },

    })),
    ServiceOrganizationTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Maintain Service Organizations' },

    })),
    ManageReplicationSchedulesTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Manage Replication Schedules' },
    })),
    MyAssignmentsTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'My Assignments' },
    })),
    MyResourcesTile: element(by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'My Resources' },
    })),
    title: element(by.control({
        controlType: 'sap.ushell.ui.shell.ShellAppTitle',
        properties: { text: 'Home' },
    })),
};
const actions = {
    async openMyProjectExperienceListApp() {
        elements.consultantProfileTile.click();
    },
    async openProjectRolesApp() {
        elements.ProjectRoleTile.click();
    },
    async openAvailabilityDataApp() {
        elements.AvailabilityDataTile.click();
    },
    async openServiceOrganizationApp() {
        elements.ServiceOrganizationTile.click();
    },
    async openMyAssignmentsApp() {
        elements.MyAssignmentsTile.click();
    },
    async openMyResourcesApp() {
        elements.MyResourcesTile.click();
    },
};

const waitForInitialAppLoad = (elementId) => browser.driver.wait(
    () => browser.driver.findElements(by.id(elementId)).then((elements1) => !!elements1.length),
    browser.getPageTimeout, 'Waiting for app load to finish',
);

module.exports = {
    elements,
    actions,
    waitForInitialAppLoad,
};
