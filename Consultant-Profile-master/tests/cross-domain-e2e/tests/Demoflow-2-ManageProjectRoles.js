const LaunchpadPage = require("../pages/LaunchpadPage.js");
const ProjectRoleListPage = require("../pages/ProjectRoleListPage.js");
const RoleCreatePage = require("../pages/ProjectRoleCreatePage.js");
const CommonPageElements = require("../pages/CommonPageElements.js");

function executeTest(testHelper) {

    testHelper.loginWithRole('ConfigurationExpert');

    it('Should navigate to Project Role tile', async function () {
        LaunchpadPage.actions.openProjectRolesApp();
        browser.wait(function () { return ProjectRoleListPage.elements.listReportTable.isPresent(); }, 105000);
    });

    it('Create a project role--Architect', async function () {
        var numberOfRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        await ProjectRoleListPage.actions.clickOnCreateButton();
        await RoleCreatePage.createDialog.codeInput.sendKeys("T002");
        await RoleCreatePage.createDialog.nameInput.sendKeys("Architect");
        await RoleCreatePage.createDialog.descriptionInput.sendKeys("Architect");
        await RoleCreatePage.createDialog.createButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.messageDialog.keepDraftLabel.click();
        await CommonPageElements.objectPage.elements.messageDialog.okButton.click();

        var currentNumberOfRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        var expectedNumberOfRecords = +numberOfRecords + 1;
        expect(currentNumberOfRecords).toEqual(expectedNumberOfRecords);
        // expect(ProjectRoleListPage.actions.isDraftRecord("Architect")).toBe(true);
    });

    it('Should activate the created role', async function () {
        await ProjectRoleListPage.actions.navigateToRoleWithDescription("Architect");
        browser.wait(function () { return CommonPageElements.objectPage.elements.footer.saveButton.isPresent(); }, 105000);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        CommonPageElements.objectPage.elements.backButton.click();
        expect(ProjectRoleListPage.actions.isDraftRecord("Architect")).toBe(false);
    });

    it('Should add the created project roles to teshelper testdata', async function () {
        const projectRoles = await browser.executeAsyncScript(function extractProjectRoleIds(done) {
            var createdRoleCodes = ["T002"];
            var projectRoleTable = sap.ui.getCore().byId('projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem-innerTable');
            var allProjectRoles = projectRoleTable.getItems().map(function (c) { return c.getBindingContext().getObject(); });
            var createdRoles = allProjectRoles.filter(function (role) { return (createdRoleCodes.indexOf(role.code) >= 0) });
            done(createdRoles);
        });
        newProjectRoles = [];
        projectRoles.forEach(p => {
            pr = {};
            pr.ID = p.ID;
            pr.code = p.code;
            pr.name = p.name;
            pr.description = p.description;
            newProjectRoles.push(pr);
        });
        testHelper.testData.consultantProfile.projectRoles = [...testHelper.testData.consultantProfile.projectRoles, ...newProjectRoles];
    });
    testHelper.logout();
}

module.exports.executeTest = executeTest;
