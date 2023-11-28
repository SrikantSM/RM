const { EntityDraftMode } = require('test-commons');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillObjectPage = require('../../../../uiveri5-pages/SkillObjectPage');
const CatalogObjectPage = require('../../../../uiveri5-pages/CatalogObjectPage');
const ProficiencySetObjectPage = require('../../../../uiveri5-pages/ProficiencySetObjectPage');
const FLP = require('../../../../uiveri5-pages/FLP');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');

const allSkills = require('../../data/Skills');
const allCatalogs = require('../../data/Catalogs');
const allSkillsTexts = require('../../data/SkillsTexts');

const SKILL_DESCRIPTION = `testDescription ${testHelper.testRunID}`;
const SKILL_DESCRIPTION_EVIL = `<script src="https://evilpage.de/assets/js/evilScript.js"></script> ${testHelper.testRunID}`;
const SKILL_DESCRIPTION_2 = `testDescription_2 ${testHelper.testRunID}`;
const SKILL_LABEL = `testLabel ${testHelper.testRunID}`;
const SKILL_LABEL_EVIL = `<script src="https://evilpage.de/assets/js/evilScript.js"></script> ${testHelper.testRunID}`;
const SKILL_LABEL_2 = `testLabel2 ${testHelper.testRunID}`;
const SKILL_LABEL_3 = `testLabel3 ${testHelper.testRunID}`;
const SKILL_LABEL_4 = `testLabel4 ${testHelper.testRunID}`;
const SKILL_ALTERNATIVE_LABEL_1 = `testAlternativeLabel1 ${testHelper.testRunID}`;
const SKILL_ALTERNATIVE_LABEL_2 = `testAlternativeLabel2 ${testHelper.testRunID}`;
const SKILL_ALTERNATIVE_LABEL_3 = `testAlternativeLabel3 ${testHelper.testRunID}`;
const SKILL_ALTERNATIVE_LABEL_4 = `testAlternativeLabel4 ${testHelper.testRunID}`;
const SKILL_ALTERNATIVE_EVIL = `<script src="https://evilpage.de/assets/js/evilScript.js"></script> ${testHelper.testRunID}`;
const SKILL_LANGUAGE_EN = 'en';
const SKILL_LANGUAGE_DE = 'de';
const SKILL_LANGUAGE_DE_PATH = '/cp.portal/site?sap-language=de#Skill-Display';
const SKILL_LANGUAGE_EN_PATH = '/cp.portal/site?sap-language=en#Skill-Display';
const SKILL_PROFICIENCY_SET_NOT_EXIST = '12345Test';

const skillAlternativeNameTable = element(by.id('skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem-innerTable'));
const rowsOfAlternativeNameTable = skillAlternativeNameTable.all(by.control({
  controlType: 'sap.m.ColumnListItem',
}));

const skillSkillNameTable = element(by.id('skill::SkillsObjectPage--fe::table::texts::LineItem'));
const rowsOfSkillNameTable = skillSkillNameTable.all(by.control({
  controlType: 'sap.m.ColumnListItem',
}));

const allProficiencySets = require('../../data/ProficiencySets');
const allProficiencyLevels = require('../../data/ProficiencyLevels');
const allProficiencyLevelTexts = require('../../data/ProficiencyLevelTexts');
const MarkdownTables = require('../../utils/MarkdownTables');

let skillTextRepository = null;
let skillRepository = null;
let catalogRepository = null;
let catalogs2skillRepository = null;
let proficiencySetRepository = null;
let proficiencyLevelRepository = null;
let proficiencyLevelTextRepository = null;

const correctSkill = {
  ...allSkills.correctSkill,
  name: allSkills.correctSkill.name + testHelper.testRunID,
  description: allSkills.correctSkill.description + testHelper.testRunID,
};

const correctDraftSkill = {
  ...allSkills.correctDraftSkill,
  ID: correctSkill.ID,
  externalID: correctSkill.externalID,
  name: allSkills.correctDraftSkill.name + testHelper.testRunID,
  description: allSkills.correctDraftSkill.description + testHelper.testRunID,
};

const correctSkillText = {
  ...allSkillsTexts.correctSkillText,
  ID: correctSkill.ID,
  name: allSkillsTexts.correctSkillText.name + testHelper.testRunID,
  description: allSkillsTexts.correctSkillText.description + testHelper.testRunID,
};

const correctDraftSkillText = {
  ...allSkills.correctSkill,
  ID_texts: correctSkillText.ID_texts,
  ID: correctSkill.ID,
  name: correctDraftSkill.name,
  description: correctDraftSkill.description,
};

const correctCatalog = {
  ...allCatalogs.correctCatalog,
  name: allCatalogs.correctCatalog.name + testHelper.testRunID,
  description: allCatalogs.correctCatalog.description + testHelper.testRunID,
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

describeTestCase(MarkdownTables.CREATE_MAINTAIN_DELETE_SKILLS, 'SkillCreateMaintainDelete', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    skillRepository = await testEnvironment.getSkillRepository();
    skillTextRepository = await testEnvironment.getSkillTextRepository();
    catalogRepository = await testEnvironment.getCatalogRepository();
    catalogs2skillRepository = await testEnvironment.getCatalogs2SkillsRepository();
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
  }

  async function insertData() {
    // setup correct skill
    await skillRepository.insertOne(correctSkill, 1);
    await skillTextRepository.insertOne(correctSkillText, 1);

    // setup correct draft skill
    await skillRepository.insertOne(correctDraftSkill, 0, 'test.user@sap.com');
    await skillTextRepository.insertOne(correctDraftSkillText, 0, 'test.user@sap.com');

    // setup correct catalog
    await catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY);

    // setup catalogs2skills
    await catalogs2skillRepository.insertOne({ ID: testHelper.testRunID, skill_ID: correctSkill.ID, catalog_ID: correctCatalog.ID }, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency set
    await proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency level
    await proficiencyLevelRepository.insertOne(correctProficiencyLevelOne, EntityDraftMode.ACTIVE_ONLY);

    // setup correct proficiency level Text
    await proficiencyLevelTextRepository.insertOne(correctProficiencyLevelOneText, EntityDraftMode.ACTIVE_ONLY);
  }

  async function deleteData() {
    const createdEntities = [{ name: SKILL_LABEL }, { name: SKILL_LABEL_2 }, { name: SKILL_LABEL_3 }, { name: SKILL_LABEL_4 }, { name: SKILL_LABEL_EVIL }, { name: correctSkill.name }];
    await skillRepository.deleteManyByData(createdEntities);
    const insertEntities = [{ name: correctSkillText.name }];
    await skillRepository.deleteManyByData(insertEntities);
    const catalogEntities = [{ name: correctCatalog.name }];
    await catalogRepository.deleteManyByData(catalogEntities);
    const catalog2skillEntities = [{ ID: testHelper.testRunID }];
    await catalogs2skillRepository.deleteManyByData(catalog2skillEntities);
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
    'Open create dialog',
    'Choose "Create".',
    'A create dialog with the fields "Name" and "Description" is displayed.',
    () => {
      it('should open skill create dialog', () => {
        SkillListReport.buttons.create.click();
        expect(SkillObjectPage.createDialog.dialogControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Enter details',
    'Enter a skill name and a description and choose "Create".',
    'In the "Skill Names" section, an  entry is created in the default language.',
    () => {
      it('should enter details in skill create dialog and create draft', () => {
        SkillObjectPage.createDialog.descriptionInput.sendKeys(SKILL_DESCRIPTION);
        SkillObjectPage.createDialog.labelInput.sendKeys(SKILL_LABEL);
        SkillObjectPage.createDialog.createButton.click();
        expect(SkillObjectPage.skill.localeInput('en').isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Add proficiency set',
    'In the header of the skill object page, open the value help for the "Proficiency Set" field, select a proficiency set from the list and choose "OK".',
    'The proficiency set is displayed in the "Proficiency Set" field and the corresponding proficiency levels are displayed in the "Proficiency Levels" section.',
    () => {
      it('should add a proficiency set', () => {
        SkillObjectPage.skill.proficiencySetInput().sendKeys(correctProficiencySet.name);
        SkillObjectPage.anchors.proficiencyLevelsAnchor.click();

        expect(SkillObjectPage.proficiencyLevels.proficiencyLevelNameText(correctProficiencyLevelOne.name).isPresent()).toBeTruthy();
        expect(SkillObjectPage.proficiencyLevels.proficiencyLevelDescriptionText(correctProficiencyLevelOne.description).isPresent()).toBeTruthy();
        expect(SkillObjectPage.skill.proficiencySetInput(correctProficiencySet.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Add alternative names',
    'In the "Alternative Names" section, choose "Create". Enter a name and a language. Repeat this step to add another alternative name in the same language.',
    'Two new entries for alternative names are displayed in the "Alternative Names" table.',
    () => {
      it('should create a skill through the dialog', () => {
        SkillObjectPage.anchors.alternativeNamesAnchor.click();
        SkillObjectPage.alternativeNames.createButton.click();
        SkillObjectPage.alternativeNames.newAlternativeNameInput.sendKeys(SKILL_ALTERNATIVE_LABEL_1);
        let nameLanguageInput = rowsOfAlternativeNameTable.get(0).element(by.control({
          controlType: 'sap.ui.mdc.Field',
          bindingPath: {
            propertyPath: 'language_code',
          },
        }));
        nameLanguageInput.sendKeys(SKILL_LANGUAGE_EN);
        SkillObjectPage.alternativeNames.createButton.click();
        SkillObjectPage.alternativeNames.newAlternativeNameInput.sendKeys(SKILL_ALTERNATIVE_LABEL_2);
        nameLanguageInput = rowsOfAlternativeNameTable.get(1).element(by.control({
          controlType: 'sap.ui.mdc.Field',
          bindingPath: {
            propertyPath: 'language_code',
          },
        }));
        nameLanguageInput.sendKeys(SKILL_LANGUAGE_EN);

        expect(SkillObjectPage.footer.saveButton.isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_LABEL_1).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_LABEL_2).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Validate draft',
    'Go back to the skill list report by pressing the back button. When asked, keep the draft.',
    'A draft entry for the previously added skill is displayed in the list report.',
    () => {
      it('should see the created skill on the List Report', async () => {
        FLP.header.backButton.click();
        SkillObjectPage.keepDraftChangesDialog.keepDraftButton.click();
        SkillObjectPage.keepDraftChangesDialog.okButton.click();
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);

        expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
        expect(SkillListReport.skillListDraftMarker(SKILL_LABEL).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Save draft',
    'Click on the draft entry in the list report. On the skill object page, choose "Save".',
    'The skill is saved with the details you added in the previous steps. In the header section, the "Usage" field has the value "Unrestricted", and fields such as "Created On", "Changed By" and "Changed On" are filled automatically.',
    () => {
      it('should see all data is correct', () => {
        SkillListReport.skillListEntry(SKILL_LABEL).click();
        expect(SkillObjectPage.skill.nameInput(SKILL_LABEL).isPresent()).toBeTruthy();
        expect(SkillObjectPage.skill.descriptionInput(SKILL_DESCRIPTION).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_LABEL_1).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_LABEL_2).isPresent()).toBeTruthy();

        SkillObjectPage.anchors.proficiencyLevelsAnchor.click();
        expect(SkillObjectPage.proficiencyLevels.proficiencyLevelNameText(correctProficiencyLevelOne.name).isPresent()).toBeTruthy();
        expect(SkillObjectPage.proficiencyLevels.proficiencyLevelDescriptionText(correctProficiencyLevelOne.description).isPresent()).toBeTruthy();
        expect(SkillObjectPage.proficiencyLevels.levelsListRows.count()).toBe(1);
      });

      it('should activate the skill', () => {
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Validate in list report',
    'Go back to the list report.',
    'The skill is displayed in the list report and has the value "Unrestricted" in the "Usage" column.',
    () => {
      it('should see the activated skill on the List Report', () => {
        FLP.header.backButton.click();
        expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
        expect(SkillListReport.skillListDraftMarker(SKILL_LABEL).isPresent()).toBeFalsy();
      });

      it('should see lifecycle status column is set to "Unrestricted"', async () => {
        FLP.header.backButton.click();
        FLP.tiles.skill.click();
        FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);

        const skillListRow = SkillListReport.skillListRow(SKILL_LABEL);
        SkillListReport.buttons.showDetails(undefined).click();
        expect(SkillListReport.lifecycleStatusField(skillListRow, 'Unrestricted').isPresent()).toBeTruthy('Skill should be unrestricted');
        SkillListReport.buttons.hideDetails(undefined).click();
      });
    },
  );

  step(
    'Assign catalog',
    'Assign at least one catalog as described in the "Catalog Assignment" chapter.',
    'See "Catalog Assignment".',
    () => {
      it('should assign a catalog to a skill', async () => {
        await SkillListReport.skillListEntry(SKILL_LABEL).click();
        await SkillObjectPage.anchors.catalogsAnchor.click();
        await SkillObjectPage.catalogs.addButton.click();
        // await SkillObjectPage.catalogDialog.searchField.sendKeys(correctCatalog.name);

        SkillObjectPage.catalogDialog.catalogCheckbox(correctCatalog.name).click();
        SkillObjectPage.catalogDialog.confirmButton.click();

        expect(SkillObjectPage.catalogs.catalogListRows.count()).toBe(1);
      });
    },
  );

  step(
    'Navigate to catalog object page',
    'Open the object page of the skill the catalog is assigned to. In the "Catalogs" section, click on the link of the assigned catalog.',
    'The object page of the assigned catalog is displayed.',
    () => {
      it('should see catalog in skill object page', async () => {
        expect(SkillObjectPage.catalogs.catalogSemanticLink(correctCatalog.name).isPresent()).toBeTruthy();
        await SkillObjectPage.catalogs.catalogSemanticLink(correctCatalog.name).click();
      });
    },
  );

  step(
    'Validate skill assignment for catalog',
    'Navigate to the "Skill Names" section on the object page of the assigned catalog.',
    'The assigned skill is displayed in the "Skill Names" section of the catalog object page.',
    () => {
      it('should see skill in catalog object page', async () => {
        expect(CatalogObjectPage.skills.skillSemanticLink(correctSkill.name).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Validate skill assignment for proficiency set',
    'Go back to the list report. Click on the previously created skill. In the object page header, click on the link in the "Proficiency Set" field. Navigate to the "Skill Names" section on the proficiency set object page.',
    'The assigned skill is displayed in the "Skill Names" section of the proficiency set object page.',
    () => {
      it('should see skill in proficiency set object page pre req', async () => {
        await testHelper.navigateToPath(SKILL_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        await SkillListReport.skillListEntry(SKILL_LABEL).click();
        await SkillObjectPage.skill.proficiencySetSemanticLink(correctProficiencySet.name).click();
      }, browser.testrunner.config.params.longSpecTimeoutMs);
    },
  );
  step(
    'Validate skill assignment for proficiency set',
    'Go back to the list report. Click on the previously created skill. In the object page header, click on the link in the "Proficiency Set" field. Navigate to the "Skill Names" section on the proficiency set object page.',
    'The assigned skill is displayed in the "Skill Names" section of the proficiency set object page.',
    () => {
      it('should see skill in proficiency set object page', async () => {
        expect(ProficiencySetObjectPage.skills.skillSemanticLink(SKILL_LABEL).isPresent()).toBeTruthy();
      }, browser.testrunner.config.params.longSpecTimeoutMs);
    },
  );

  step(
    'Validate draft mode',
    'In the list report, find a skill with unsaved changes by another user and open the object page of the skill.',
    'The skill with unsaved changes by another user is displayed in the list report, but it is not possible to edit this skill.',
    () => {
      it('should see inserted active entity', async () => {
        await testHelper.navigateToPath(SKILL_LANGUAGE_EN_PATH);
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        expect(SkillListReport.skillListEntry(correctSkill.name).isPresent()).toBeTruthy();
      });

      it('should be possible to see draft skill from another user', async () => {
        await testHelper.navigateToPath(SKILL_LANGUAGE_EN_PATH);
        expect(SkillListReport.skillListEntry(correctSkill.name).isPresent()).toBeTruthy();
        expect(SkillListReport.skillListEntry(correctDraftSkill.name).isPresent()).toBeFalsy();
      });

      it('should not be possible to edit draft skill from another user', () => {
        SkillListReport.skillListEntry(correctSkill.name).click();
        SkillObjectPage.header.editButton.click();
        expect(SkillObjectPage.messageDialog.dialog.isPresent()).toBeTruthy();
      });

      it('should see the draft skill from another user on the List Report', () => {
        SkillObjectPage.errorDialog.closeButton.click();
        FLP.header.backButton.click();
        expect(SkillListReport.skillListEntry(correctSkill.name).isPresent()).toBeTruthy();
      });
    },
  );

  //--------------------------------------------
  // Skill modification
  //--------------------------------------------

  step(
    'Search for skills',
    'Go back to the skill list report and search for the skill you have created.',
    'The skill you have created is displayed in the list report.',
    () => {
      it('should search for a skill', async () => {
        await FilterBarHelper.searchFor(SkillListReport.filterBar, SKILL_DESCRIPTION);
        expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
      });
    },
    () => {
      it('should reset the search', async () => {
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Reset search for skills',
    'Reset the search from the previous step.',
    'All existing skills are displayed in the list report.',
    () => {
      it('should reset the search', async () => {
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Enter edit mode',
    'Navigate to the object page of the skill you have created and choose "Edit".',
    'The skill object page is now in edit mode.',
    () => {
      it('should enter edit mode', () => {
        SkillListReport.skillListEntry(SKILL_LABEL).click();
        SkillObjectPage.header.editButton.click();
        expect(SkillObjectPage.footer.saveButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Add an alternative name in another language',
    'In the "Alternative Names" section, choose "Create". Enter a name in another supported language (for example, `de`).',
    'An entry for the new alternative name is displayed.',
    () => {
      it('should add an additional alternative name in an different language', () => {
        SkillObjectPage.anchors.alternativeNamesAnchor.click();
        SkillObjectPage.alternativeNames.createButton.click();

        SkillObjectPage.alternativeNames.newAlternativeNameInput.sendKeys(SKILL_ALTERNATIVE_LABEL_3);
        const nameLanguageInput = rowsOfAlternativeNameTable.get(2).element(by.control({
          controlType: 'sap.ui.mdc.Field',
          bindingPath: {
            propertyPath: 'language_code',
          },
        }));
        nameLanguageInput.sendKeys(SKILL_LANGUAGE_DE);
        expect(SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_LABEL_3).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Activate skill',
    'Choose "Save".',
    'It is not possible to save the skill as there is no skill name in the language chosen for the new alternative name.',
    () => {
      it('should not be possible to save a skill if for the same language no name exist', () => {
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();

        SkillObjectPage.errorPopover.footerButton.click();
      });
    },
  );

  step(
    'Delete alternative name',
    'Select the entry for the alternative name you have just added, choose "Delete" and confirm the deletion in the confirmation dialog.',
    'The draft entry for the alternative name is deleted.',
    () => {
      it('should remove the new alternative name', () => {
        SkillObjectPage.anchors.alternativeNamesAnchor.click();
        SkillObjectPage.alternativeNames.alternativeNameCheckbox(SKILL_ALTERNATIVE_LABEL_3).click();
        SkillObjectPage.alternativeNames.deleteButton.click();
        SkillObjectPage.alternativeNames.deleteDialog.deleteButton.click();
        expect(SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_LABEL_3).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Injection validation for skill',
    'In the "Skill Names" section, choose "Create", enter a skill name, enter a description containing an HTML tag (for example, `<html>`), and set the language to another supported language (for example, `de`). Choose "Save".',
    'An error message is displayed and the skill is not activated.',
    () => {
      it('should not be possible to add an additional skill description with an evil script tag', () => {
        SkillObjectPage.anchors.skillAnchor.click();
        SkillObjectPage.skill.create.click();

        const nameInput = rowsOfSkillNameTable.get(1).element(by.control({
          controlType: 'sap.m.Input',
          bindingPath: {
            propertyPath: 'name',
          },
        }));
        nameInput.sendKeys(SKILL_LABEL_2);

        const nameLanguageInput = rowsOfSkillNameTable.get(1).element(by.control({
          controlType: 'sap.ui.mdc.Field',
          bindingPath: {
            propertyPath: 'locale',
          },
        }));
        nameLanguageInput.sendKeys(SKILL_LANGUAGE_DE);

        const nameDescription = rowsOfSkillNameTable.get(1).element(by.control({
          controlType: 'sap.m.TextArea',
          bindingPath: {
            propertyPath: 'description',
          },
        }));
        nameDescription.sendKeys(SKILL_DESCRIPTION_EVIL);
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();

        SkillObjectPage.errorPopover.footerButton.click();
      });
    },
  );

  step(
    'Injection validation for alternative name',
    'In the "Alternative Names" section, choose "Create", enter a name containing an HTML tag (for example, `<html>`) and a language, and choose "Save".',
    'An error message is displayed and the skill is not activated.',
    () => {
      it('should not be possible to add an additional alternative name with an evil script tag', () => {
        SkillObjectPage.anchors.alternativeNamesAnchor.click();
        SkillObjectPage.alternativeNames.createButton.click();
        const nameLanguageInput = rowsOfAlternativeNameTable.get(2).element(by.control({
          controlType: 'sap.ui.mdc.Field',
          bindingPath: {
            propertyPath: 'language_code',
          },
        }));
        nameLanguageInput.sendKeys(SKILL_LANGUAGE_EN);
        SkillObjectPage.alternativeNames.newAlternativeNameInput.sendKeys(SKILL_ALTERNATIVE_EVIL);
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();
        SkillObjectPage.errorPopover.footerButton.click();
      });
    },
  );

  step(
    'Several alternative names in same language',
    'Change the invalid alternative name containing the HTML tag to a valid name in the default language and go back to the list report. When asked, keep the draft.',
    'In the list report, the new alternative name is displayed for the respective skill.',
    () => {
      it('should change the invalid alternative name to a correct one in the default language', () => {
        SkillObjectPage.alternativeNames.alternativeNameInput(SKILL_ALTERNATIVE_EVIL).clear();
        SkillObjectPage.alternativeNames.alternativeNameInput('').sendKeys(SKILL_ALTERNATIVE_LABEL_4);

        FLP.header.backButton.click();
        SkillObjectPage.keepDraftChangesDialog.keepDraftButton.click();
        SkillObjectPage.keepDraftChangesDialog.okButton.click();
      });
    },
  );

  step(
    'Skill name in another language',
    'Go back to your skill draft. In the "Skill Names" section, change the invalid skill description containing the HTML tag to a valid description. Choose "Save".',
    'An entry for the other language should be displayed and the skill should be activated without errors.',
    () => {
      it('should change the invalid skill name to a correct one in another language', () => {
        SkillListReport.skillListEntry(SKILL_LABEL).click();

        SkillObjectPage.skill.descriptionInput(SKILL_DESCRIPTION_EVIL).clear();
        SkillObjectPage.skill.descriptionInput('').sendKeys(SKILL_DESCRIPTION_2);
      });

      it('should activate the skill', () => {
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Missing skill name',
    'On the object page of your skill, choose "Edit". In the "Skill Names" table, clear the "Name" field of the entry in the default language. Choose "Save".',
    'An error message is displayed and the skill is not activated.',
    () => {
      it('should not be possible to save a skill if the name is not existing', () => {
        SkillObjectPage.header.editButton.click();
        SkillObjectPage.skill.nameInput(SKILL_LABEL).clear();
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Close error dialog',
    'Close the error dialog. Choose "Cancel" in the footer of the object page, then choose "Discard".',
    'The skill object page is no longer in draft mode and the skill name is displayed again.',
    () => {
      it('should cancel to remove the skill name', () => {
        SkillObjectPage.footer.cancelButton.click();
        SkillObjectPage.footer.discardPopoverButton.click();

        expect(SkillObjectPage.skill.nameText(SKILL_LABEL).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Skill restriction',
    'On the skill object page, choose "Restrict". In the confirmation dialog, choose "OK".',
    'The "Restrict" button is no longer displayed on the object page.',
    () => {
      it('should be possible to restrict a skill', () => {
        SkillObjectPage.header.restrictButton.click();
        SkillObjectPage.restrictDialog.okButton.click();

        expect(SkillObjectPage.header.restrictButton.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Data validation',
    'Navigate to the list report and check the data you have created.',
    'All created data are displayed as expected.',
    () => {
      it('should see all data is correct', () => {
        FLP.header.backButton.click();
        // List Report
        const skillListRow = SkillListReport.skillListRow(SKILL_LABEL);
        SkillListReport.buttons.showDetails(undefined).click();
        expect(SkillListReport.lifecycleStatusField(skillListRow, 'Restricted').isPresent()).toBeTruthy('Skill is in status restricted');
        expect(SkillListReport.skillListEntryDescription(skillListRow, SKILL_DESCRIPTION).isPresent()).toBeTruthy();
        SkillListReport.buttons.hideDetails(undefined).click();
        expect(SkillListReport.skillListEntryCommaSeparatedLabels(skillListRow, `${SKILL_ALTERNATIVE_LABEL_1}, ${SKILL_ALTERNATIVE_LABEL_2}, ${SKILL_ALTERNATIVE_LABEL_4}`).isPresent()).toBeTruthy();

        // Object Page
        SkillListReport.skillListEntry(SKILL_LABEL).click();

        expect(SkillObjectPage.skill.nameText(SKILL_LABEL).isPresent()).toBeTruthy();
        expect(SkillObjectPage.skill.descriptionText(SKILL_DESCRIPTION).isPresent()).toBeTruthy();
        expect(SkillObjectPage.skill.nameText(SKILL_LABEL_2).isPresent()).toBeTruthy();
        expect(SkillObjectPage.skill.descriptionText(SKILL_DESCRIPTION_2).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameText(SKILL_ALTERNATIVE_LABEL_1).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameText(SKILL_ALTERNATIVE_LABEL_2).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameText(SKILL_ALTERNATIVE_LABEL_4).isPresent()).toBeTruthy();
        expect(SkillObjectPage.alternativeNames.alternativeNameText(SKILL_ALTERNATIVE_LABEL_3).isPresent()).toBeFalsy();
        expect(SkillObjectPage.header.unrestrictButton.isDisplayed()).toBeTruthy('Unrestrict Button should be displayed');
        expect(SkillObjectPage.header.restrictButton.isPresent()).toBeFalsy('Restrict Button should not be present at all');
      });
    },
  );

  step(
    'Remove skill restriction',
    'Open the object page of your skill and choose "Remove Restriction". In the confirmation dialog, choose "OK". Go back to the list report.',
    'The value in the "Usage" column is updated accordingly.',
    () => {
      it('should remove the restriction of the new skill', async () => {
        SkillObjectPage.header.unrestrictButton.click();
        SkillObjectPage.restrictDialog.okButton.click();
        FLP.header.backButton.click();

        const skillListRow = SkillListReport.skillListRow(SKILL_LABEL);
        SkillListReport.buttons.showDetails(undefined).click();
        expect(SkillListReport.lifecycleStatusField(skillListRow, 'Unrestricted').isPresent()).toBeTruthy('Skill is in status unrestricted');
        SkillListReport.buttons.hideDetails(undefined).click();
      });
    },
  );

  step(
    'Empty alternative name',
    'From the list report, create a new skill containing an empty alternative name.',
    'An error message is displayed and the skill is not activated.',
    () => {
      it('should open skill create dialog', () => {
        SkillListReport.buttons.create.click();

        expect(SkillObjectPage.createDialog.dialogControl.isPresent()).toBeTruthy();
      });

      it('should not be possible to create a skill with empty alternative label', () => {
        SkillObjectPage.createDialog.descriptionInput.sendKeys(SKILL_DESCRIPTION);
        SkillObjectPage.createDialog.labelInput.sendKeys(SKILL_LABEL_3);
        SkillObjectPage.createDialog.createButton.click();

        SkillObjectPage.skill.proficiencySetInput().sendKeys(correctProficiencySet.name);
        SkillObjectPage.alternativeNames.createButton.click();
        SkillObjectPage.footer.saveButton.click();

        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();
      });

      it('should not be possible to create a skill through the dialog with alternative label with empty language', () => {
        SkillObjectPage.alternativeNames.newAlternativeNameInput.sendKeys(SKILL_ALTERNATIVE_LABEL_1);
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Empty proficiency set',
    'From the list report, create a new skill containing an empty proficiency set.',
    'An error message is displayed and the skill is not activated.',
    () => {
      it('should open skill create dialog', () => {
        FLP.header.backButton.click();
        SkillObjectPage.keepDraftChangesDialog.keepDraftButton.click();
        SkillObjectPage.keepDraftChangesDialog.okButton.click();
        SkillListReport.buttons.create.click();

        expect(SkillObjectPage.createDialog.dialogControl.isPresent()).toBeTruthy();
      });

      it('should not be possible to create a skill through the dialog with empty proficiency set', () => {
        SkillObjectPage.createDialog.descriptionInput.sendKeys(SKILL_DESCRIPTION);
        SkillObjectPage.createDialog.labelInput.sendKeys(SKILL_LABEL_4);
        SkillObjectPage.createDialog.createButton.click();
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();
        SkillObjectPage.errorPopover.footerButton.click();
      });
    },
  );

  step(
    'Nonexistent proficiency set',
    'From the list report, create a new skill containing a proficiency set that doesn\'t exist.',
    'An error message is displayed and the skill is not activated.',
    () => {
      it('should not be possible to create a skill with not exisiting proficiency set', () => {
        SkillObjectPage.skill.proficiencySetInput().sendKeys(SKILL_PROFICIENCY_SET_NOT_EXIST);
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.errorPopover.footerButton.isPresent()).toBeTruthy();
        SkillObjectPage.errorPopover.footerButton.click();
      });
    },
  );

  step(
    'Validate localization',
    'Change your logon language to the other supported language used during these tests (for example, `de`). This can be done, for example, by opening your user settings and changing the language.',
    'In the list report, the data of the activated skill is displayed in the language you have selected.',
    () => {
      it('should see the activated skill on the List Report in the login language', async () => {
        await testHelper.navigateToPath(SKILL_LANGUAGE_DE_PATH);
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);

        const skillListRow = SkillListReport.skillListRow(SKILL_LABEL_2);

        expect(SkillListReport.skillListEntry(SKILL_LABEL_2).isPresent()).toBeTruthy();
        SkillListReport.buttons.showDetails('Details einblenden').click();
        expect(SkillListReport.skillListEntryDescription(skillListRow, SKILL_DESCRIPTION_2).isPresent()).toBeTruthy();
        SkillListReport.buttons.hideDetails('Details ausblenden').click();
        expect(SkillListReport.skillListEntryCommaSeparatedLabels(skillListRow, '').isPresent()).toBeTruthy();
      });
    },
  );

  //--------------------------------------------
  // Skill deletion (currently disabled)
  //--------------------------------------------

  step(
    'Sign out',
    'Sign out of the Fiori Launchpad.',
    'The sign out screen is displayed.',
    () => testHelper.logout(),
  );
});
