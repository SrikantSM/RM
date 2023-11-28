const testEnvironment = require('../utils');
const testHelper = require('../utils/TestHelper');
const { describeTestCase, step } = require('../utils/TestExecutor');
const CatalogListReport = require('../../../uiveri5-pages/CatalogListReport');
const CatalogObjectPage = require('../../../uiveri5-pages/CatalogObjectPage');
const SkillObjectPage = require('../../../uiveri5-pages/SkillObjectPage');
const FilterBarHelper = require('../../../uiveri5-pages/FilterBarHelper');
const FLP = require('../../../uiveri5-pages/FLP');
const allCatalogs = require('../data/Catalogs');
const allSkills = require('../data/Skills');
const allSkillsTexts = require('../data/SkillsTexts');
const MarkdownTables = require('../utils/MarkdownTables');

const CATALOG_DESCRIPTION = `testDescription${testHelper.testRunID}`;
const CATALOG_DESCRIPTION_EVIL = `<script src="https://evilpage.de/assets/js/evilScript.js"></script> ${testHelper.testRunID}`;
const CATALOG_NAME = `testName${testHelper.testRunID}`;

const CATALOG_LANGUAGE_EN_PATH = '/cp.portal/site?sap-language=en#SkillCatalog-Display';

let catalogRepository = null;
let skillRepository = null;
let skillTextRepository = null;

const correctCatalog = {
  ...allCatalogs.correctCatalog,
  name: allCatalogs.correctCatalog.name + testHelper.testRunID,
  description: allCatalogs.correctCatalog.description + testHelper.testRunID,
};
const correctDraftCatalog = {
  ...allCatalogs.correctDraftCatalog,
  ID: correctCatalog.ID,
  name: allCatalogs.correctDraftCatalog.name + testHelper.testRunID,
  description: allCatalogs.correctDraftCatalog.description + testHelper.testRunID,
};
const correctSkill = {
  ...allSkills.correctSkill,
  name: allSkills.correctSkill.name + testHelper.testRunID,
  description: allSkills.correctSkill.description + testHelper.testRunID,
};
const correctSkillText = {
  ...allSkillsTexts.correctSkillText,
  name: allSkillsTexts.correctSkillText.name + testHelper.testRunID,
  description: allSkillsTexts.correctSkillText.description + testHelper.testRunID,
};

describeTestCase(MarkdownTables.CREATE_MAINTAIN_DELETE_CATALOGS, 'CatalogCreateMaintainDelete', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    catalogRepository = await testEnvironment.getCatalogRepository();
    skillRepository = await testEnvironment.getSkillRepository();
    skillTextRepository = await testEnvironment.getSkillTextRepository();
  }

  async function insertData() {
    // correct draft catalog
    await catalogRepository.insertOne(correctDraftCatalog, 0, 'test.user@sap.com');

    // correct catalog
    await catalogRepository.insertOne(correctCatalog, 1);

    // Skill
    await skillRepository.insertOne(correctSkill, 1);
    await skillTextRepository.insertOne(correctSkillText, 1);
  }

  async function deleteData() {
    const createdEntities = [{ name: CATALOG_NAME }, { name: correctCatalog.name }, { name: correctDraftCatalog.name }];
    await catalogRepository.deleteManyByData(createdEntities);

    // skill
    await skillRepository.deleteOne(correctSkill); // cascadingly deletes texts as well
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
    'The tile for the Manage Skill Catalogs app is displayed.',
    () => {
      testHelper.loginWithRole('ConfigurationExpert');
    },
  );

  step(
    'Open the catalog app',
    'Click on the "Manage Skill Catalogs" tile.',
    'A list report containing all catalogs already created is displayed.',
    () => {
      it('should navigate to the Catalog App', () => {
        FLP.tiles.catalog.click();
        FLP.waitForInitialAppLoad('skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem-toolbar');
        expect(CatalogListReport.catalogList.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Create a new catalog draft from the list report',
    'In the list report, choose "Create". Enter a name and a description.',
    'The catalog object page with the entered data is displayed.',
    () => {
      it('should create a catalog through the dialog', () => {
        CatalogListReport.buttons.create.click();
        expect(CatalogObjectPage.createDialog.dialogControl.isPresent()).toBeTruthy();
        CatalogObjectPage.createDialog.descriptionInput.sendKeys(CATALOG_DESCRIPTION);
        CatalogObjectPage.createDialog.nameInput.sendKeys(CATALOG_NAME);
        CatalogObjectPage.createDialog.createButton.click();

        expect(CatalogObjectPage.footer.saveButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Add skill to catalog',
    'On the object page, choose "Edit". In the "Skills" section, choose "Create". Select an existing skill to assign it to the catalog and choose "Save".',
    'The assigned skill is displayed as a link.',
    () => {
      it('should add skill to catalog', async () => {
        CatalogObjectPage.skills.createButton.click();
        CatalogObjectPage.skills.newSkillInput.sendKeys(correctSkill.name);

        expect(CatalogObjectPage.footer.saveButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check that the created catalog draft is visible in the list report',
    'Navigate back to the list report and search for the catalog you have created.',
    'The catalog you have created is displayed as a draft.',
    () => {
      it('should see the created catalog on the List Report', async () => {
        FLP.header.backButton.click();
        CatalogObjectPage.keepDraftChangesDialog.keepDraftButton.click();
        CatalogObjectPage.keepDraftChangesDialog.okButton.click();
        await FilterBarHelper.searchFor(CatalogListReport.filterBar, testHelper.testRunID);

        expect(CatalogListReport.catalogListEntry(CATALOG_NAME).isPresent()).toBeTruthy();
        expect(CatalogListReport.catalogListDraftMarker(CATALOG_NAME).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check that all data of the created catalog is correct',
    'From the list report, open the catalog you have created.',
    'The catalog is displayed with the name and description you provided.',
    () => {
      it('should see all data is correct', () => {
        CatalogListReport.catalogListEntry(CATALOG_NAME).click();
        expect(CatalogObjectPage.catalog.nameInput(CATALOG_NAME).isPresent()).toBeTruthy();
        expect(CatalogObjectPage.catalog.descriptionInput(CATALOG_DESCRIPTION).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Activate the catalog draft',
    'On the object page, choose "Create".',
    'The catalog is activated.',
    () => {
      it('should activate the catalog', () => {
        CatalogObjectPage.footer.saveButton.click();
        expect(CatalogObjectPage.header.editButton.isPresent()).toBeTruthy();
        expect(CatalogObjectPage.skills.skillSemanticLink(correctSkill.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check that activated catalog is visible in list report',
    'Navigate back to the list report.',
    'The activated catalog is displayed in the list report.',
    () => {
      it('should see the activated catalog on the List Report', () => {
        FLP.header.backButton.click();
        expect(CatalogListReport.catalogListEntry(CATALOG_NAME).isPresent()).toBeTruthy();
        expect(CatalogListReport.catalogListDraftMarker(CATALOG_NAME).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check that you can see draft catalogs by other users',
    'Refresh the list report and search for a catalog by another user.',
    'The draft catalog by another user is displayed in the list report.',
    () => {
      it('should be possible to see draft catalog from another user', async () => {
        await testHelper.navigateToPath(CATALOG_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(CatalogListReport.filterBar, testHelper.testRunID);
        expect(CatalogListReport.catalogListEntry(correctCatalog.name).isPresent()).toBeTruthy();
        expect(CatalogListReport.catalogListEntry(correctDraftCatalog.name).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Try to edit draft catalog by another user',
    'Open the draft catalog by another user and choose "Edit".',
    'An error message is displayed.',
    () => {
      it('should not be possible to edit draft catalog from another user', () => {
        CatalogListReport.catalogListEntry(correctCatalog.name).click();
        CatalogObjectPage.header.editButton.click();
        expect(CatalogObjectPage.messageDialog.dialog.isPresent()).toBeTruthy();
      });

      it('should see the draft catalog from another user on the List Report', () => {
        CatalogObjectPage.errorDialog.closeButton.click();
        FLP.header.backButton.click();
        expect(CatalogListReport.catalogListEntry(correctCatalog.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Search for a specific catalog',
    'Enter a catalog name in the search field of the list report and choose "Go".',
    'The catalog is displayed in the list report.',
    () => {
      it('should search for a catalog', async () => {
        await FilterBarHelper.searchFor(CatalogListReport.filterBar, CATALOG_DESCRIPTION);
        expect(CatalogListReport.catalogListEntry(CATALOG_NAME).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Reset the search',
    'Clear the search field and choose "Go".',
    'A list report containing all catalogs already created is displayed.',
    () => {
      it('should reset the search', async () => {
        await FilterBarHelper.searchFor(CatalogListReport.filterBar, testHelper.testRunID);
        expect(CatalogListReport.catalogListEntry(CATALOG_NAME).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Select catalog and enter edit mode',
    'Open an activated catalog from the list report and choose "Edit".',
    'The "Save" button is displayed on the object page.',
    () => {
      it('should enter edit mode', () => {
        CatalogListReport.catalogListEntry(CATALOG_NAME).click();
        CatalogObjectPage.header.editButton.click();
        expect(CatalogObjectPage.footer.saveButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Evil script tag in catalog description',
    'Enter a new description that contains an HTML tag (```<html>```) and choose "Save".',
    'An error message is displayed, and the description field is highlighted.',
    () => {
      it('should not be possible to insert an evil script tag in catalog description', () => {
        CatalogObjectPage.catalog.descriptionInput(CATALOG_DESCRIPTION).sendKeys(CATALOG_DESCRIPTION_EVIL);
        CatalogObjectPage.footer.saveButton.click();
        expect(CatalogObjectPage.footer.messageButton.isPresent()).toBeTruthy();
        expect(CatalogObjectPage.catalog.descriptionInputErrorHighlighted(CATALOG_DESCRIPTION + CATALOG_DESCRIPTION_EVIL).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Discard catalog draft',
    'On the object page, choose "Cancel", then choose "Discard".',
    'The "Edit" button is displayed on the object page.',
    () => {
      it('should discard catalog draft', () => {
        CatalogObjectPage.footer.cancelButton.click();
        CatalogObjectPage.footer.discardPopoverButton.click();
        expect(CatalogObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check that assigned catalog is visible on skill object page',
    'Click on the link of the skill you have just assigned to the catalog.',
    'On the skill object page, the name of your catalog is displayed in the "Catalogs" section.',
    () => {
      it('should see catalog in skill object page', async () => {
        await CatalogObjectPage.skills.skillSemanticLink(correctSkill.name).click();
        expect(SkillObjectPage.catalogs.catalogSemanticLink(CATALOG_NAME).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Try to delete catalog with assigned skills',
    'Open the Manage Skill Catalogs app. Select the catalog to which you have assigned the skill and choose "Delete". In the delete dialog, choose "Delete" again.',
    'An error message is displayed.',
    () => {
      it('should see delete confirmation dialog', async () => {
        await testHelper.navigateToPath(CATALOG_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(CatalogListReport.filterBar, testHelper.testRunID);
        const catalogListRow = CatalogListReport.catalogListRow(CATALOG_NAME);
        CatalogListReport.catalogCheckbox(catalogListRow, CATALOG_NAME).click();
        CatalogListReport.buttons.delete.click();
        expect(CatalogListReport.deleteDialog.dialogControl.isPresent()).toBeTruthy();

        CatalogListReport.deleteDialog.deleteButton.click();
        expect(CatalogListReport.errorDialog.dialogControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Close error dialog',
    'In the error dialog, choose "Close". Afterwards, uncheck the checkbox for the selected table row',
    'The error dialog is no longer displayed and the row is unchecked.',
    () => {
      it('should see deletion not possible error dialog', () => {
        CatalogListReport.errorDialog.closeButton.click();
        expect(CatalogListReport.errorDialog.dialogControl.isPresent()).toBeFalsy();
        // Uncheck the row for further tests
        CatalogListReport.catalogCheckbox(CatalogListReport.catalogListRow(CATALOG_NAME), CATALOG_NAME).click();
      });
    },
  );

  step(
    'Delete skill from catalog',
    'Open the catalog to which you have assigned the skill and choose "Edit". Select the assigned skill and choose "Delete". In the delete dialog, choose "Delete" again. Choose "Save".',
    'The skill is no longer displayed.',
    () => {
      it('should remove skill from catalog', () => {
        CatalogListReport.catalogListEntry(CATALOG_NAME).click();
        CatalogObjectPage.header.editButton.click();
        CatalogObjectPage.skills.skillCheckbox(correctSkill.name).click();
        CatalogObjectPage.skills.deleteButton.click();
        CatalogObjectPage.deleteDialog.deleteButton.click();
        CatalogObjectPage.footer.saveButton.click();
        expect(CatalogObjectPage.skills.skillSemanticLink(correctSkill.name).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Delete a catalog that has no skills assigned',
    'Navigate back to the catalog list report. Select the same catalog as before and choose "Delete". In the delete dialog, choose "Delete" again.',
    'The catalog is no longer displayed.',
    () => {
      it('should delete catalog', async () => {
        await testHelper.navigateToPath(CATALOG_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(CatalogListReport.filterBar, testHelper.testRunID);
        const catalogListRow = CatalogListReport.catalogListRow(CATALOG_NAME);
        CatalogListReport.catalogCheckbox(catalogListRow, CATALOG_NAME).click();
        CatalogListReport.buttons.delete.click();
        expect(CatalogListReport.deleteDialog.dialogControl.isPresent()).toBeTruthy();
        CatalogListReport.deleteDialog.deleteButton.click();
        expect(CatalogListReport.catalogListEntry(CATALOG_NAME).isPresent()).toBeFalsy();
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
