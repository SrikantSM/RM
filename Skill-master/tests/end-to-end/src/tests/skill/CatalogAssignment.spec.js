const { EntityDraftMode } = require('test-commons');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillObjectPage = require('../../../../uiveri5-pages/SkillObjectPage');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');
const FLP = require('../../../../uiveri5-pages/FLP');

const allSkills = require('../../data/Skills');
const allCatalogs = require('../../data/Catalogs');
const allSkillsTexts = require('../../data/SkillsTexts');

const MarkdownTables = require('../../utils/MarkdownTables');

let skillTextRepository = null;
let skillRepository = null;
let catalogRepository = null;
let catalogs2skillRepository = null;

const correctSkill = {
  ...allSkills.correctSkill,
  name: allSkills.correctSkill.name + testHelper.testRunID,
  description: allSkills.correctSkill.description + testHelper.testRunID,
};

const correctSkillText = {
  ...allSkillsTexts.correctSkillText,
  ID: correctSkill.ID,
  name: allSkillsTexts.correctSkillText.name + testHelper.testRunID,
  description: allSkillsTexts.correctSkillText.description + testHelper.testRunID,
};

const correctCatalog = {
  ...allCatalogs.correctCatalog,
  name: allCatalogs.correctCatalog.name + testHelper.testRunID,
  description: allCatalogs.correctCatalog.description + testHelper.testRunID,
};

describeTestCase(MarkdownTables.CATALOG_ASSIGNMENT, 'CatalogAssignment', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    skillRepository = await testEnvironment.getSkillRepository();
    skillTextRepository = await testEnvironment.getSkillTextRepository();
    catalogRepository = await testEnvironment.getCatalogRepository();
    catalogs2skillRepository = await testEnvironment.getCatalogs2SkillsRepository();
  }

  async function insertData() {
    // setup correct skill
    await skillRepository.insertOne(correctSkill, EntityDraftMode.ACTIVE_ONLY);
    await skillTextRepository.insertOne(correctSkillText, EntityDraftMode.ACTIVE_ONLY);

    // setup correct catalog
    await catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY);

    // setup catalogs2skills
    await catalogs2skillRepository.insertOne({ ID: testHelper.testRunID, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID }, EntityDraftMode.ACTIVE_ONLY);
  }

  async function deleteData() {
    const createdEntities = [{ name: correctSkill.name }];
    await skillRepository.deleteManyByData(createdEntities);
    const catalogEntities = [{ name: correctCatalog.name }];
    await catalogRepository.deleteManyByData(catalogEntities);
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
    'The tile for the Manage Skills app is displayed.',
    () => {
      testHelper.loginWithRole('ConfigurationExpert');
    },
  );

  step(
    'Open skill app',
    'Click on the "Manage Skills" tile.',
    'A list report containing all skills already created is displayed.',
    () => {
      it('should navigate to the Skill App', () => {
        FLP.tiles.skill.click();
        FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
        expect(SkillListReport.skillList.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check that catalog is assigned',
    'Search for an already existing skill with one catalog, open the skill and check that a catalog is assigned.',
    'The assigned catalog is displayed as a link.',
    () => {
      it('search for the test skill with one assigend catalog', async () => {
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);

        expect(SkillListReport.skillListRows.count()).toBe(1);
      });

      it('should see the assigned catalog', () => {
        SkillListReport.skillListEntry(correctSkill.name).click();

        expect(SkillObjectPage.catalogs.catalogSemanticLink(correctCatalog.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Remove assigned catalog',
    'In the "Catalogs" section of the skill object page, choose "Remove". Select the catalog you want to remove and choose "OK".',
    'The selected catalog is no longer assigned.',
    () => {
      it('should open the remove dialog', () => {
        SkillObjectPage.catalogs.removeButton.click();
        SkillObjectPage.catalogDialog.catalogCheckbox(correctCatalog.name).click();
        SkillObjectPage.catalogDialog.confirmButton.click();

        expect(SkillObjectPage.catalogs.catalogListRows.count()).toBe(0);
      });
    },
  );

  step(
    'Check that remove dialog is empty',
    'In the "Catalogs" section of the skill object page, choose "Remove".',
    'The remove dialog is empty.',
    () => {
      it('should see an empty remove dialog', () => {
        SkillObjectPage.catalogs.removeButton.click();

        expect(SkillObjectPage.catalogDialog.catalogAssignmentListRows.count()).toBe(0);
      });
    },
  );

  step(
    'Search and add catalog',
    'Close the remove dialog. Choose "Add" and select a catalog you want to add. Choose "OK".',
    'The selected catalog has been assigned and is displayed in the "Catalogs" table.',
    () => {
      it('should search for a correct catalog', async () => {
        SkillObjectPage.catalogDialog.cancelButton.click();
        SkillObjectPage.catalogs.addButton.click();
        await SkillObjectPage.catalogDialog.searchField.sendKeys(correctCatalog.name);

        expect(SkillObjectPage.catalogDialog.catalogAssignmentListRows.count()).toBe(1);
      });

      it('should add the searched catalog to the skill', () => {
        SkillObjectPage.catalogDialog.catalogCheckbox(correctCatalog.name).click();
        SkillObjectPage.catalogDialog.confirmButton.click();

        expect(SkillObjectPage.catalogs.catalogListRows.count()).toBe(1);
      });
    },
  );

  step(
    'Check for "Add" and "Remove" buttons in edit mode',
    'On the skill object page, choose "Edit".',
    'The "Remove" and "Add" buttons are no longer displayed.',
    () => {
      it('should not see add and remove button in edit mode', () => {
        SkillObjectPage.header.editButton.click();

        expect(SkillObjectPage.catalogs.addButton.isPresent()).toBeFalsy();
        expect(SkillObjectPage.catalogs.removeButton.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Sign out',
    'Sign out of the Fiori Launchpad.',
    'The sign out screen is displayed.',
    () => {
      testHelper.logout();
    },
  );
});
