const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const ProficiencySetListReport = require('../../../../uiveri5-pages/ProficiencySetListReport');
const ProficiencySetObjectPage = require('../../../../uiveri5-pages/ProficiencySetObjectPage');
const FLP = require('../../../../uiveri5-pages/FLP');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const MarkdownTables = require('../../utils/MarkdownTables');

const PROFICIENCY_SET_DESCRIPTION = `testDescription${testHelper.testRunID}`;
const PROFICIENCY_SET_NAME = `testName${testHelper.testRunID}`;
const CREATED_PROFICIENCY_LEVEL_NAME = `CreatedProficiencyLevelName${testHelper.testRunID}`;
const CREATED_PROFICIENCY_LEVEL_NAME_EN1 = `CreatedProficiencyLevelName${testHelper.testRunID} en1`;
const CREATED_PROFICIENCY_LEVEL_NAME_EN2 = `CreatedProficiencyLevelName${testHelper.testRunID} en2`;
const CREATED_PROFICIENCY_LEVEL_DESCRIPTION = `CreatedProficiencyLevelDescription${testHelper.testRunID}`;
const CREATED_PROFICIENCY_LEVEL_DESCRIPTION_EN1 = `CreatedProficiencyLevelDescription${testHelper.testRunID} en1`;
const CREATED_PROFICIENCY_LEVEL_DESCRIPTION_EN2 = `CreatedProficiencyLevelDescription${testHelper.testRunID} en2`;
let proficiencySetRepository = null;

describeTestCase(MarkdownTables.PROFICIENCY_SET_ERROR, 'ProficiencySetErrorCases', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async function deleteData() {
    await proficiencySetRepository.deleteManyByData([{ name: PROFICIENCY_SET_NAME }]);
  }

  beforeAll(async () => {
    await createRepository();
  });

  /**
   * Tear-down test data
   */
  afterAll(async () => {
    await deleteData();
  });

  step(
    'Log on',
    'Log on to Resource Management as a Business Configuration Expert.',
    'The tile for the Manage Proficiency Sets app is displayed.',
    () => {
      testHelper.loginWithRole('ConfigurationExpert');
    },
  );

  step(
    'Open the app',
    'Click on the "Manage Proficiency Sets" tile.',
    'A list report containing all proficiency sets already created is displayed.',
    () => {
      it('should navigate to the Proficiency App', () => {
        FLP.tiles.proficiency.click();
        FLP.waitForInitialAppLoad('skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem-innerTable');
        expect(ProficiencySetListReport.proficiencySetList.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Try to edit default proficiency set',
    'Search for the proficiency set with the name "Not specified" and click on it to open its object page. Try to choose "Edit".',
    'The Edit button is inactive.',
    () => {
      it('should navigate to default proficiency sets object page, edit should be disabled', async () => {
        const currentUrl = new URL(await browser.getCurrentUrl());
        currentUrl.hash = currentUrl.hash.replace(/(\?sap-iapp-state=.*?)(?:$|&|\/)/, 'ProficiencySets(8a2cc2c3-4a46-47f0-ae67-2ac67c673aae)');
        // Navigate via url using the static ID, as the name is no stable
        browser.testrunner.navigation.to(currentUrl.href);
        expect(ProficiencySetObjectPage.header.editButton.isPresent()).toBeTruthy();
        expect(ProficiencySetObjectPage.header.editButton.asControl().getProperty('enabled')).toBeFalsy();
      });
    },
  );

  step(
    'Proficiency set without level',
    'Create another proficiency set by choosing "Create" in the list report. Save it without maintaining a proficiency level.',
    'An error message is displayed, indicating that no proficiency level is maintained.',
    () => {
      it('should not be possible to create proficiency set without a proficiency level', () => {
        FLP.header.backButton.click();
        ProficiencySetListReport.buttons.create.click();
        ProficiencySetObjectPage.createDialog.descriptionInput.sendKeys(PROFICIENCY_SET_DESCRIPTION);
        ProficiencySetObjectPage.createDialog.nameInput.sendKeys(PROFICIENCY_SET_NAME);
        ProficiencySetObjectPage.createDialog.createButton.click();
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.footer.messageButton.isPresent());
      });
    },
  );

  step(
    'Missing proficiency level text in default language',
    'Use the previously created proficiency set to add a new proficiency level text in a language that is different from the default language. Choose "Save".',
    'An error message is displayed, indicating that for the proficiency level, there is no text maintained in the default language.',
    () => {
      it('should not be able to create a level without text in default language', () => {
        ProficiencySetObjectPage.proficiencyLevels.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.nameField.sendKeys(CREATED_PROFICIENCY_LEVEL_NAME);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.descriptionField.sendKeys(CREATED_PROFICIENCY_LEVEL_DESCRIPTION);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelListRow(CREATED_PROFICIENCY_LEVEL_NAME).click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelLanguageInput('en').clear();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelLanguageInput('').sendKeys('de');
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.applyButton.click();
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.footer.messageButton.isPresent());
      });
    },
  );

  step(
    'Duplicate language for proficiency level',
    'Use the previously created proficiency level to add a text in the default language (en). Then add another text, also in the default language (en). Choose "Save".',
    'An error message is displayed, indicating that a language is used multiple times for the proficiency level.',
    () => {
      it('should not be able to have duplicate languages for level texts', () => {
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevel('1').click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelNameInput('').sendKeys(CREATED_PROFICIENCY_LEVEL_NAME_EN1);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelDescriptionInput('').sendKeys(CREATED_PROFICIENCY_LEVEL_DESCRIPTION_EN1);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelLanguageInput('').sendKeys('en');
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelNameInput('').sendKeys(CREATED_PROFICIENCY_LEVEL_NAME_EN2);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelDescriptionInput('').sendKeys(CREATED_PROFICIENCY_LEVEL_DESCRIPTION_EN2);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelLanguageInput('').sendKeys('en');
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.applyButton.click();
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.footer.messageButton.isPresent());
      });
    },
  );

  step(
    'Duplicate name for proficiency level',
    'Use the previously created proficiency set to add two proficiency levels. Maintain both levels in the default language (en) and use exactly the same name for both of them.',
    'An error message is displayed, indicating that multiple proficiency levels have the same name.',
    () => {
      it('should not be able to have the same name for two levels', () => {
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevel('1').click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelCheckbox(CREATED_PROFICIENCY_LEVEL_DESCRIPTION_EN2, 'sap.m.TextArea').click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.deleteButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.deleteDialog.deleteButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.applyButton.click();

        ProficiencySetObjectPage.proficiencyLevels.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.nameField.sendKeys(CREATED_PROFICIENCY_LEVEL_NAME_EN1);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.descriptionField.sendKeys(CREATED_PROFICIENCY_LEVEL_NAME_EN1);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.createButton.click();

        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.footer.messageButton.isPresent());
      });
      testHelper.logout();
    },
  );
});
