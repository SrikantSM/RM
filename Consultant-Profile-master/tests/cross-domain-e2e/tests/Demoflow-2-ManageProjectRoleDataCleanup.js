const LaunchpadPage = require("../pages/LaunchpadPage.js");
const ProjectRoleListPage = require("../pages/ProjectRoleListPage.js");

function executeTest(testHelper) {

    testHelper.loginWithRole('ConfigurationExpert');

    it('Should navigate to Project Role tile', async function () {
        LaunchpadPage.actions.openProjectRolesApp();
        browser.wait(function () { return ProjectRoleListPage.elements.listReportTable.isPresent(); }, 105000);
    });

    it('Should delete the created project roles', async function () {
        const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();
        const projectRoles = await browser.executeAsyncScript(function extractProjectRoleIds(done) {
            var createdRoleCodes = ["T002"];
            var projectRoleTable = sap.ui.getCore().byId('projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem-innerTable');
            var allProjectRoles = projectRoleTable.getItems().map(function (c) { return c.getBindingContext().getObject(); });
            var createdRoles = allProjectRoles.filter(function (role) { return (createdRoleCodes.indexOf(role.code) >= 0) });
            done(createdRoles);
        });
        await projectRoleRepository.deleteMany(projectRoles);
    });

    testHelper.logout();
}

module.exports.executeTest = executeTest;
