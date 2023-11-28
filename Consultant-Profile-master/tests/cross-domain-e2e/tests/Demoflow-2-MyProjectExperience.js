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

    it('Validate the draft skills are unavailable for SkillAssignment in ConsultantProfile', async function () {
        let draftSkills = [];
        testHelper.testData.skill.skills.forEach(skill => {
            if (skill.draft === true) {
                draftSkills.push(skill.name);
            }
        });
        expect(draftSkills.length).toBeGreaterThan(0);

        const firstDraftSkillName = draftSkills[0];

        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);
        browser.wait(function () { return Qualifications.parentElements.contentSection.isPresent(); }, 105000);
        Qualifications.actions.navigateToQualifications();

        expect(Qualifications.actions.getColumnHeader().get(0).getText()).toBe("Skill");
        expect(Qualifications.qualifications.elements.tableTitle.getText()).toBe("Skills");

        CommonPageElements.objectPage.elements.editButton.click();

        await CudOperations.actions.create("skills");
        Qualifications.actions.navigateToQualifications();

        var objectTableID = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem";
        var subObjectTableID = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::Table-innerTable";
        var objectTable = element(by.id(objectTableID));
        var objectTableRows = objectTable.all(by.control({
            controlType: "sap.m.ColumnListItem"
        }));
        var noOfRowsObjectTable = await objectTableRows.count();
        for (var i = 0; i < noOfRowsObjectTable; i++) {
            var row = objectTableRows.get(i).element(by.control({
                controlType: "sap.ui.mdc.Field"
            }));
            var elementToBeClicked;
            var value = await row.getAttribute("value");
            if (firstDraftSkillName == await value) {
                elementToBeClicked = i;
                break;
            }
        }

        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: "sap.ui.core.Icon",
            properties: {
                src: "sap-icon://value-help"
            }
        })).click();
        await PriorExperience.priorExperience.elements.valueHelpSearchInput.sendKeys(firstDraftSkillName);
        await PriorExperience.priorExperience.elements.valueHelpSearchPress.click();
        
        var subObjectTable = element(by.id(subObjectTableID));
        var subObjectTableRows = subObjectTable.all(by.control({
            controlType: "sap.m.Text",
            properties: {
                text: firstDraftSkillName,
            },
        }));
        var noOfRowsSubObjectTable = await subObjectTableRows.count();
        expect(noOfRowsSubObjectTable).toBe(0);

        await element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Cancel',
                },
            }),
        ).click();

        var objPageCancelButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Cancel"));
        await objPageCancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();

        expect(Qualifications.actions.getColumnHeader().get(0).getText()).toBe("Skill");
        expect(Qualifications.qualifications.elements.tableTitle.getText()).toBe("Skills");
    });

    it('Should assign skills', async function () {
        const skillJava = testHelper.testData.skill.skills.find(skill => skill.name === 'Java ' + testRunId);
        const skillJavaName = testHelper.testData.skill.skillTexts.find(text => text.ID === skillJava.ID).name;
        const proficiencySetJava = testHelper.testData.skill.proficiencySets.find(set => set.ID === skillJava.proficiencySet_ID);
        const proficiencyLevelJava = testHelper.testData.skill.proficiencyLevels.find(level => proficiencySetJava.ID === level.proficiencySet_ID);
        const proficiencyLevelJavaName = testHelper.testData.skill.proficiencyLevelTexts.find(text => text.ID === proficiencyLevelJava.ID).name;
        console.log('skillJava: ', skillJavaName, 'proficiencyLevel: ', proficiencyLevelJavaName);

        const skillJavaScript = testHelper.testData.skill.skills.find(skill => skill.name === 'JavaScript ' + testRunId);
        const skillJavaScriptName = testHelper.testData.skill.skillTexts.find(text => text.ID === skillJavaScript.ID).name;
        const proficiencySetJavaScript = testHelper.testData.skill.proficiencySets.find(set => set.ID === skillJavaScript.proficiencySet_ID);
        const proficiencyLevelJavaScript = testHelper.testData.skill.proficiencyLevels.find(level => proficiencySetJavaScript.ID === level.proficiencySet_ID);
        const proficiencyLevelJavaScriptName = testHelper.testData.skill.proficiencyLevelTexts.find(text => text.ID === proficiencyLevelJavaScript.ID).name;
        console.log('skillJavaScript: ', skillJavaScriptName, 'proficiencyLevel: ', proficiencyLevelJavaScriptName);

        await CommonPageElements.objectPage.elements.backButton.click();
        LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);
        browser.wait(function () { return Qualifications.parentElements.contentSection.isPresent(); }, 105000);
        Qualifications.actions.navigateToQualifications();

        expect(Qualifications.actions.getColumnHeader().get(0).getText()).toBe("Skill");
        expect(Qualifications.qualifications.elements.tableTitle.getText()).toBe("Skills");

        CommonPageElements.objectPage.elements.editButton.click();

        await CudOperations.actions.create("skills");
        await CudOperations.actions.changeValueOfTheRow("skills", "", skillJavaName);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillJavaName, 'proficiencyLevel_ID');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelJavaName);
        var objPageSaveButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save"));
        await objPageSaveButton.click();

        await CommonPageElements.objectPage.elements.backButton.click();
        LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(function () { return BasicDataPage.parentElements.consultantHeaders.content.isPresent(); }, 105000);

        CommonPageElements.objectPage.elements.editButton.click();

        await CudOperations.actions.create("skills");
        await CudOperations.actions.changeValueOfTheRow("skills", "", skillJavaScriptName);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillJavaScriptName, 'proficiencyLevel_ID');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelJavaScriptName);
        await objPageSaveButton.click();

        expect(Qualifications.qualifications.elements.tableTitle.getText()).toBe("Skills (2)");
        expect(Qualifications.actions.getSkillName(skillJavaName).isPresent()).toBeTruthy();
        expect(Qualifications.actions.getSkillName(skillJavaScriptName).isPresent()).toBeTruthy();
        expect(Qualifications.actions.getProficiencyLevelName(proficiencyLevelJavaName).isPresent()).toBeTruthy();
        expect(Qualifications.actions.getProficiencyLevelName(proficiencyLevelJavaScriptName).isPresent()).toBeTruthy();
    });

    it('Should assign role', async function () {
        browser.wait(function () { return PriorExperience.parentElements.contentSection.isPresent(); }, 105000);
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        await CudOperations.actions.create("roles");
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.changeValueOfTheRow("roles", "", "Developer");
        var objPageSaveButton = element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save"));
        await objPageSaveButton.click();

        expect(PriorExperience.priorExperience.elements.tableTitle.getText()).toBe("Project Roles (1)");
        expect(PriorExperience.actions.getRoleName("Developer").isPresent()).toBeTruthy();

        CommonPageElements.objectPage.elements.backButton.click();
    });

    testHelper.logout();
}

module.exports.executeTest = executeTest;
