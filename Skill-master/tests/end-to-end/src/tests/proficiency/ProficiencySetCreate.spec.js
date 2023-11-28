const { EntityDraftMode } = require('test-commons');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const ProficiencySetListReport = require('../../../../uiveri5-pages/ProficiencySetListReport');
const ProficiencySetObjectPage = require('../../../../uiveri5-pages/ProficiencySetObjectPage');
const SkillObjectPage = require('../../../../uiveri5-pages/SkillObjectPage');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');
const FLP = require('../../../../uiveri5-pages/FLP');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const MarkdownTables = require('../../utils/MarkdownTables');

const PROFICIENCY_SET_DESCRIPTION = `testDescription${testHelper.testRunID}`;
const PROFICIENCY_SET_NAME = `testName${testHelper.testRunID}`;
const CREATED_PROFICIENCY_LEVEL_NAME = `CreatedProficiencyLevelName${testHelper.testRunID}`;
const CREATED_PROFICIENCY_LEVEL_DESCRIPTION = `CreatedProficiencyLevelDescription${testHelper.testRunID}`;

const allSkills = require('../../data/Skills');
const allSkillsTexts = require('../../data/SkillsTexts');
const allProficiencySets = require('../../data/ProficiencySets');
const allProficiencyLevels = require('../../data/ProficiencyLevels');
const allProficiencyLevelTexts = require('../../data/ProficiencyLevelTexts');

let proficiencySetRepository = null;
let proficiencyLevelRepository = null;
let proficiencyLevelTextRepository = null;
let skillRepository = null;
let skillTextRepository = null;

const correctSkill = {
  ...allSkills.correctSkill,
  name: allSkills.correctSkill.name + testHelper.testRunID,
  description: allSkills.correctSkill.description + testHelper.testRunID,
  proficiencySet_ID: allProficiencySets.correctProficiencySet.ID,
};

const correctSkillText = {
  ...allSkillsTexts.correctSkillText,
  ID: correctSkill.ID,
  name: allSkillsTexts.correctSkillText.name + testHelper.testRunID,
  description: allSkillsTexts.correctSkillText.description + testHelper.testRunID,
};

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

const correctProficiencyLevelOneText = {
  ...allProficiencyLevelTexts.correctProficiencyLevelOneText,
  name: allProficiencyLevelTexts.correctProficiencyLevelOneText.name + testHelper.testRunID,
  description: allProficiencyLevelTexts.correctProficiencyLevelOneText.description + testHelper.testRunID,
};

describeTestCase(MarkdownTables.PROFICIENCY_SET_CREATE, 'ProficiencySetCreate', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
    skillRepository = await testEnvironment.getSkillRepository();
    skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async function insertData() {
    // setup correct proficiency set
    await proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency level
    await proficiencyLevelRepository.insertOne(correctProficiencyLevelOne, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency level Text
    await proficiencyLevelTextRepository.insertOne(correctProficiencyLevelOneText, EntityDraftMode.ACTIVE_ONLY);

    // setup correct skill
    await skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY);
    await skillTextRepository.insertOne(correctSkillText, EntityDraftMode.ACTIVE_ONLY);
  }

  async function deleteData() {
    await skillRepository.deleteOne(correctSkill);
    const proficiencySetEntities = [{ name: PROFICIENCY_SET_NAME }, { name: correctProficiencySet.name }];
    await proficiencySetRepository.deleteManyByData(proficiencySetEntities);
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
    'The tile for the Manage Proficiency Sets app is displayed',
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
    'Open create dialog',
    'Choose "Create".',
    'A create dialog with the fields "Name" and "Description" is displayed.',
    () => {
      it('should open proficiency set create dialog', () => {
        ProficiencySetListReport.buttons.create.click();
        expect(ProficiencySetObjectPage.createDialog.dialogControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Enter details',
    'Fill in the "Name" and "Description" fields in the default language of the tenant (English for SAP-internal test tenants or spaces) and choose "Create".',
    'The object page is filled with the information you have entered.',
    () => {
      it('should create a proficiency set through the dialog', () => {
        ProficiencySetObjectPage.createDialog.descriptionInput.sendKeys(PROFICIENCY_SET_DESCRIPTION);
        ProficiencySetObjectPage.createDialog.nameInput.sendKeys(PROFICIENCY_SET_NAME);
        ProficiencySetObjectPage.createDialog.createButton.click();

        expect(ProficiencySetObjectPage.footer.saveButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Add a proficiency level',
    'Navigate back to the object page. In the "Proficiency Levels" section, choose "Create", and enter the proficiency level details. Choose "Apply".',
    'The newly added proficiency level is displayed on the object page.',
    () => {
      it('should add proficiency level to proficiency set', async () => {
        ProficiencySetObjectPage.proficiencyLevels.createButton.click();
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.nameField.sendKeys(CREATED_PROFICIENCY_LEVEL_NAME);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.descriptionField.sendKeys(CREATED_PROFICIENCY_LEVEL_DESCRIPTION);
        ProficiencySetObjectPage.proficiencyLevels.proficiencyLevelCreateDialog.createButton.click();
        expect(ProficiencySetObjectPage.proficiencyLevels.proficiencyLevel(CREATED_PROFICIENCY_LEVEL_NAME).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'View draft',
    'Navigate back to the list report.',
    'The proficiency set just created is displayed in draft status with the correct data.',
    () => {
      it('should see the created proficiency set on the List Report', async () => {
        FLP.header.backButton.click();
        ProficiencySetObjectPage.keepDraftChangesDialog.keepDraftButton.click();
        ProficiencySetObjectPage.keepDraftChangesDialog.okButton.click();
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, testHelper.testRunID);

        expect(ProficiencySetListReport.proficiencySetListEntry(PROFICIENCY_SET_NAME).isPresent()).toBeTruthy();
        expect(ProficiencySetListReport.proficiencySetListDraftMarker(PROFICIENCY_SET_NAME).isPresent()).toBeTruthy();
      });

      it('should see all data is correct', () => {
        ProficiencySetListReport.proficiencySetListEntry(PROFICIENCY_SET_NAME).click();
        expect(ProficiencySetObjectPage.proficiencySet.nameInput(PROFICIENCY_SET_NAME).isPresent()).toBeTruthy();
        expect(ProficiencySetObjectPage.proficiencySet.descriptionInput(PROFICIENCY_SET_DESCRIPTION).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Save the draft',
    'Choose "Save".',
    'The proficiency set is saved with the details added in the previous steps. Fields such as "Created On", "Changed By", and "Changed On" are automatically filled in the proficiency set header section.',
    () => {
      it('should activate the proficiency set', () => {
        ProficiencySetObjectPage.footer.saveButton.click();
        expect(ProficiencySetObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check saved proficiency set in list report',
    'Navigate back to the list report.',
    'The proficiency set just created is displayed with the correct data.',
    () => {
      it('should see the activated proficiency set on the List Report', () => {
        FLP.header.backButton.click();
        expect(ProficiencySetListReport.proficiencySetListEntry(PROFICIENCY_SET_NAME).isPresent()).toBeTruthy();
        expect(ProficiencySetListReport.proficiencySetListDraftMarker(PROFICIENCY_SET_NAME).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check skill object page',
    'Search for a proficiency set that is already assigned to at least one skill (if none exists, create a proficiency set, and assign it to a skill). Open the object page and click on the skill name in the "Skills" section.',
    'The object page of the skill is displayed.',
    () => {
      it('should see proficiency set in skill object page', async () => {
        await FilterBarHelper.searchFor(ProficiencySetListReport.filterBar, testHelper.testRunID);
        await ProficiencySetListReport.proficiencySetListEntry(correctProficiencySet.name).click();
        await ProficiencySetObjectPage.skills.skillSemanticLink(correctSkill.name).click();
        expect(SkillObjectPage.skill.proficiencySetSemanticLink(correctProficiencySet.name).isPresent()).toBeTruthy();
      });

      testHelper.logout();
    },
  );
});
