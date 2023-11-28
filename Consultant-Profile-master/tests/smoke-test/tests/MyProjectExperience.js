const BasicDataPage = require("../pages/BasicDataPage.js");
const CommonPageElements = require("../pages/CommonPageElements.js");
const CudOperations = require("../pages/CudOperations.js"); 
const PriorExperience = require("../pages/PriorExperience");

function executeTest(testHelper) {

    it('Should navigate to My Project Experience tile', async function () {
        CommonPageElements.actions.openMyProjectExperienceListApp();
        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);

        expect(BasicDataPage.actions.getHeaderTitle('Test Usere2e4 (test.usere2e4)').isPresent()).toBeTruthy();
        expect(BasicDataPage.actions.getWorkerCostCenterValue("CCIN (CCIN)").isPresent()).toBeTruthy();
    });

    it('Should assign role', async function () {
        CommonPageElements.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        await CudOperations.actions.create("roles");
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.changeValueOfTheRow("roles", "", "Developer");
        var objPageSaveButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save"));
        await objPageSaveButton.click();

        expect(PriorExperience.priorExperience.elements.tableTitle.getText()).toBe("Project Roles (1)");
        expect(PriorExperience.actions.getRoleName("Developer").isPresent()).toBeTruthy();

    });

    it("Return to homepage",async function(){
        await element(
            by.control({
                id: 'shell-header'
            })).element(by.id('shell-header-logo')).click();
    });

}

module.exports.executeTest = executeTest;
