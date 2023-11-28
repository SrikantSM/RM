const LaunchpadPage = require("../pages/LaunchpadPage.js");
const BasicDataPage = require("../pages/BasicDataPage.js");
const Qualifications = require("../pages/Qualifications.js");
const PriorExperience = require("../pages/PriorExperience.js");
const CommonPageElements = require("../pages/CommonPageElements.js");
const CudOperations = require("../pages/CudOperations.js");
const profileDetails = require("../data/profileDetails");
const workforcePersons = require("../data/workforcePersons.js");

function executeTest(testHelper) {

    testHelper.loginWithRole('Consultant');
    const testRunId = testHelper.testRunID;
    let name = profileDetails.profileDetail4.firstName + ' ' + profileDetails.profileDetail4.lastName + ' (' + workforcePersons.workforcePerson4.externalID + ')' ;

    it('Should navigate to My Project Experience tile', async function () {
        LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);
        expect(BasicDataPage.actions.getHeaderTitle(name).isPresent()).toBeTruthy();
    });

    it('Should unassign skills', async function () {
        const skillJavaName = testHelper.testData.skill.skills.find(skill => skill.name === 'Java ' + testRunId).name;
        console.log('skillJavaName: ', skillJavaName);
        const skillJavaScriptName = testHelper.testData.skill.skills.find(skill => skill.name === 'JavaScript ' + testRunId).name;
        console.log('skillJavaScriptName: ', skillJavaScriptName);

        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);
        browser.wait(function () { return Qualifications.parentElements.contentSection.isPresent(); }, 105000);

        await CommonPageElements.objectPage.elements.editButton.click();
        Qualifications.actions.navigateToQualifications();
        expect(Qualifications.actions.getColumnHeader().get(0).getText()).toBe("Skill");

        await CudOperations.actions.delete("skills", skillJavaName);
        var objPageSaveButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save"));
        await objPageSaveButton.click();


        await CommonPageElements.objectPage.elements.editButton.click();
        Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.delete("skills", skillJavaScriptName);
        var objPageSaveButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save"));
        await objPageSaveButton.click();

        expect(Qualifications.qualifications.elements.tableTitle.getText()).toBe("Skills");
        // CommonPageElements.objectPage.elements.backButton.click();
    });

    it('Should unassign role', async function () {
        // LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);
        browser.wait(function () { return PriorExperience.parentElements.contentSection.isPresent(); }, 105000);

        await CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        await CudOperations.actions.delete("roles", "Developer")
        var objPageSaveButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save"));
        await objPageSaveButton.click();

        expect(PriorExperience.priorExperience.elements.tableTitle.getText()).toBe("Project Roles");
        CommonPageElements.objectPage.elements.backButton.click();
    });

    testHelper.logout();
}

module.exports.executeTest = executeTest;
