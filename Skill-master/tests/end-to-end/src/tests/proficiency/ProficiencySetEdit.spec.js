const { EntityDraftMode } = require('test-commons');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const ProficiencySetListReport = require('../../../../uiveri5-pages/ProficiencySetListReport');
const ProficiencySetObjectPage = require('../../../../uiveri5-pages/ProficiencySetObjectPage');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');
const FLP = require('../../../../uiveri5-pages/FLP');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const MarkdownTables = require('../../utils/MarkdownTables');

const allProficiencySets = require('../../data/ProficiencySets');
const allProficiencyLevels = require('../../data/ProficiencyLevels');
const allProficiencyLevelTexts = require('../../data/ProficiencyLevelTexts');

const PROFICIENCY_SET_DESCRIPTION_EVIL = `<script src="https://evilpage.de/assets/js/evilScript.js"></script> ${testHelper.testRunID}`;

const EDITED_PROFICIENCY_LEVEL_NAME = `EditedProficiencyLevelName${testHelper.testRunID}`;
const EDITED_PROFICIENCY_LEVEL_DESCRIPTION = `EditedProficiencyLevelDescription${testHelper.testRunID}`;

const PROFICIENCY_SET_LANGUAGE_EN_PATH = '/cp.portal/site?sap-language=en#Proficiency-Display';

let proficiencySetRepository = null;
let proficiencyLevelRepository = null;
let proficiencyLevelTextRepository = null;

const correctProficiencySet = {
  ...allProficiencySets.correctProficiencySet,
  name: allProficiencySets.correctProficiencySet.name + testHelper.testRunID,
  description: allProficiencySets.correctProficiencySet.description + testHelper.testRunID,
};
const correctDraftProficiencySet = {
  ...allProficiencySets.correctDraftProficiencySet,
  name: allProficiencySets.correctDraftProficiencySet.name + testHelper.testRunID,
  description: allProficiencySets.correctDraftProficiencySet.description + testHelper.testRunID,
};

const correctProficiencyLevelOne = {
  ...allProficiencyLevels.correctProficiencyLevelOne,
  name: allProficiencyLevels.correctProficiencyLevelOne.name + testHelper.testRunID,
  description: allProficiencyLevels.correctProficiencyLevelOne.description + testHelper.testRunID,
};

const correctProficiencyLevelTwo = {
  ...allProficiencyLevels.correctProficiencyLevelTwo,
  name: allProficiencyLevels.correctProficiencyLevelTwo.name + testHelper.testRunID,
  description: allProficiencyLevels.correctProficiencyLevelTwo.description + testHelper.testRunID,
};

const correctProficiencyLevelOneText = {
  ...allProficiencyLevelTexts.correctProficiencyLevelOneText,
  name: allProficiencyLevelTexts.correctProficiencyLevelOneText.name + testHelper.testRunID,
  description: allProficiencyLevelTexts.correctProficiencyLevelOneText.description + testHelper.testRunID,
};

const correctProficiencyLevelTwoText = {
  ...allProficiencyLevelTexts.correctProficiencyLevelTwoText,
  name: allProficiencyLevelTexts.correctProficiencyLevelTwoText.name + testHelper.testRunID,
  description: allProficiencyLevelTexts.correctProficiencyLevelTwoText.description + testHelper.testRunID,
};

describeTestCase(MarkdownTables.PROFICIENCY_SET_EDIT, 'ProficiencySetEdit', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async function insertData() {
    // setup correct proficiency set
    await proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);
    await proficiencySetRepository.insertOne(correctDraftProficiencySet, EntityDraftMode.BOTH, 'test.user@sap.com');

    // setup correct proficiency level
    await proficiencyLevelRepository.insertOne(correctProficiencyLevelOne, EntityDraftMode.ACTIVE_ONLY);
    await proficiencyLevelRepository.insertOne(correctProficiencyLevelTwo, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency level Text
    await proficiencyLevelTextRepository.insertOne(correctProficiencyLevelOneText, EntityDraftMode.ACTIVE_ONLY);
    await proficiencyLevelTextRepository.insertOne(correctProficiencyLevelTwoText, EntityDraftMode.ACTIVE_ONLY);
  }

  async function deleteData() {
    await proficiencySetRepository.deleteMany([correctProficiencySet, correctDraftProficiencySet]);
  }

  beforeAll(async () => {
    await createRepository();
    await deleteData();
    await insertData();
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
    'Edit draft by another user',
    'Click on a draft proficiency set by another user and choose "Edit".',
    'An error dialog is displayed.',
    () => {
      it('should see inserted active entity', async () => {
        await testHelper.navigateToPath(PROFICIENCY_SET_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, testHelper.testRunID);
        expect(ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).isPresent()).toBeTruthy();
      });
      it('should be possible to see draft proficiency set from another user', async () => {
        await testHelper.navigateToPath(PROFICIENCY_SET_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, testHelper.testRunID);
        expect(ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).isPresent()).toBeTruthy();
        expect(ProficiencySetListReport.proficiencySetListEntry(correctDraftProficiencySet.name).isPresent()).toBeTruthy();
      });
      it('should not be possible to edit draft proficiency set from another user', () => {
        ProficiencySetListReport.proficiencySetListEntry(correctDraftProficiencySet.name).click();
        expect(ProficiencySetObjectPage.header.disabledEditButton.isPresent()).toBeTruthy();
      });
      it('should see the draft proficiency set from another user on the List Report', () => {
        FLP.header.backButton.click();
        expect(ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Search',
    'Search for your previously created proficiency set in the list report.',
    'Your previously created proficiency set is displayed in the list.',
    () => {
      it('should search for a proficiency set', async () => {
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, correctProficiencySet.description);
        expect(ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).isPresent()).toBeTruthy();
      });
      it('should reset the search', async () => {
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, testHelper.testRunID);
        expect(ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Open previously created proficiency set',
    'Click on the previously created proficiency set and choose "Edit".',
    'The details you entered during creation are displayed.',
    () => {
      it('should enter edit mode', () => {
        ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).click();
        ProficiencySetObjectPage.header.editButton.click();
        expect(ProficiencySetObjectPage.footer.saveButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Evil script tag',
    'Try to use script or HTML tags (```<script>```, or ```<html>```) in the "Name" and "Description" fields.',
    'An error message is displayed, and the input fields containing errors are highlighted.',
    () => {
      it('should not be possible to insert an evil script tag in proficiency set description', () => {
        ProficiencySetObjectPage.proficiencySet.descriptionInput(correctProficiencySet.description).sendKeys(PROFICIENCY_SET_DESCRIPTION_EVIL);
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.footer.messageButton.isPresent()).toBeTruthy();
        expect(ProficiencySetObjectPage.proficiencySet.descriptionInputErrorHighlighted(correctProficiencySet.description + PROFICIENCY_SET_DESCRIPTION_EVIL).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Cancel the entry',
    'Choose "Cancel", then choose "Discard".',
    'The changes have been reset.',
    () => {
      it('should discard proficiency set draft', () => {
        ProficiencySetObjectPage.footer.cancelButton.click();
        ProficiencySetObjectPage.footer.discardPopoverButton.click();
        expect(ProficiencySetObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Edit proficiency level',
    'Click on an existing proficiency level in the "Proficiency Levels" section, change the name, and apply your changes. Save the draft.',
    'In the "Proficiency Levels" section, the proficiency level is displayed with the new name.',
    () => {
      it('should edit proficiency level from proficiency set', async () => {
        ProficiencySetObjectPage.header.editButton.click();
        ProficiencySetObjectPage.anchors.proficiencyLevelAnchor.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevel(correctProficiencyLevelOneText.name).click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelCheckbox(correctProficiencyLevelOneText.name).click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.deleteButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.deleteDialog.deleteButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelNameInput('').sendKeys(EDITED_PROFICIENCY_LEVEL_NAME);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelDescriptionInput('').sendKeys(EDITED_PROFICIENCY_LEVEL_DESCRIPTION);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.proficiencyLevelLanguageInput('').sendKeys('en');
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelSubObjectPage.applyButton.click();
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.proficiencyLevels.proficiencyLevel(EDITED_PROFICIENCY_LEVEL_NAME).isPresent()).toBeTruthy();
      });
      testHelper.logout();
    },
  );
});
