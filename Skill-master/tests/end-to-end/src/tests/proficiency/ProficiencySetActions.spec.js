const { EntityDraftMode } = require('test-commons');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const ProficiencySetListReport = require('../../../../uiveri5-pages/ProficiencySetListReport');
const ProficiencySetObjectPage = require('../../../../uiveri5-pages/ProficiencySetObjectPage');
const FLP = require('../../../../uiveri5-pages/FLP');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');

const allProficiencySets = require('../../data/ProficiencySets');
const allProficiencyLevels = require('../../data/ProficiencyLevels');
const allProficiencyLevelTexts = require('../../data/ProficiencyLevelTexts');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const MarkdownTables = require('../../utils/MarkdownTables');

let proficiencySetRepository = null;
let proficiencyLevelRepository = null;
let proficiencyLevelTextRepository = null;

const correctProficiencySet = {
  ...allProficiencySets.correctProficiencySet,
  name: allProficiencySets.correctProficiencySet.name + testHelper.testRunID,
  description: allProficiencySets.correctProficiencySet.description + testHelper.testRunID,
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

describeTestCase(MarkdownTables.PROFICIENCY_SET_ACTIONS, 'ProficiencySetActions', () => {
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

    // setup correct proficiency level
    await proficiencyLevelRepository.insertOne(correctProficiencyLevelOne, EntityDraftMode.ACTIVE_ONLY);
    await proficiencyLevelRepository.insertOne(correctProficiencyLevelTwo, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency level Text
    await proficiencyLevelTextRepository.insertOne(correctProficiencyLevelOneText, EntityDraftMode.ACTIVE_ONLY);
    await proficiencyLevelTextRepository.insertOne(correctProficiencyLevelTwoText, EntityDraftMode.ACTIVE_ONLY);
  }

  async function deleteData() {
    await proficiencySetRepository.deleteOne(correctProficiencySet);
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

  //--------------------------------------------
  // Skill creation including draft handling
  //--------------------------------------------

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
    'Open proficiency set',
    'Open a proficiency set containing at least three proficiency levels.',
    'The proficiency set object page containing at least three proficiency levels is displayed.',
    () => {
      it('should see proficiency level in proficiency set object page', async () => {
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, testHelper.testRunID);
        ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).click();
        expect(ProficiencySetObjectPage.proficiencyLevels.proficiencyLevel(correctProficiencyLevelOneText.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Edit the draft',
    'Choose "Edit".',
    'The correct details are visible and editable.',
    () => {
      it('should go into edit mode', async () => {
        ProficiencySetObjectPage.header.editButton.click();
        expect(ProficiencySetObjectPage.header.editButton.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Move proficiency level down',
    'Select the first proficiency level and choose "Move Down".',
    'The order of the proficiency levels in the table and the level numbers have changed accordingly.',
    () => {
      it('should see proficiency level moving up down position after move down action', async () => {
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelRadioButton(correctProficiencyLevelTwoText.name).click();
        ProficiencySetObjectPage.proficiencyLevels.moveDownButton.click();

        const proficiencyLevelListRow = ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelListRow(correctProficiencyLevelTwoText.name);
        expect(ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelRank(proficiencyLevelListRow, '1').isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Move proficiency level up',
    'Select the second proficiency level and choose "Move Up".',
    'The order of the proficiency levels in the table and the level numbers have changed accordingly.',
    () => {
      it('should see proficiency level moving up one position after move up action', async () => {
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelRadioButton(correctProficiencyLevelTwoText.name).click();
        ProficiencySetObjectPage.proficiencyLevels.moveUpButton.click();

        const proficiencyLevelListRow = ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelListRow(correctProficiencyLevelTwoText.name);
        expect(ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelRank(proficiencyLevelListRow, '2').isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Save the draft',
    'Choose "Save".',
    'The proficiency set is saved with the new proficiency level order. Fields such as "Changed By" and "Changed On" are automatically filled in the proficiency set header section.',
    () => {
      it('should activate / save the proficiency set', () => {
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
      testHelper.logout();
    },
  );
});
