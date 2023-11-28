const path = require('path');
const { EntityDraftMode } = require('test-commons');
const FLP = require('../../../../uiveri5-pages/FLP');
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillObjectPage = require('../../../../uiveri5-pages/SkillObjectPage');
const SkillUploadApp = require('../../../../uiveri5-pages/SkillUploadApp');
const AsyncUploadHelper = require('../../../../uiveri5-pages/AsyncUploadHelper');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');

const testHelper = require('../../utils/TestHelper');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const testEnvironment = require('../../utils');

const MarkdownTables = require('../../utils/MarkdownTables');
const {
  getCSVData, getEvilSkillCSVData, getCSVDataDE, getDuplicateCSVData, getTooLongNameCSVData, getTooLongDescriptionCSVData, getWrongUsageData, getWrongConceptTypeCSVData, getMissingSkillTypeCSVData, getForbiddenFirstCharacterSkillCSVData,
} = require('../../data/SkillUploadCsv');
const allCatalogs = require('../../data/Catalogs');

const SKILL_CSV_PATH = path.resolve(__dirname, '../../data/generated-skills_en.csv');
const SKILL_CSV_PATH_DE = path.resolve(__dirname, '../../data/generated-skills_de.csv');
const SKILL_CSV_PATH_TLH = path.resolve(__dirname, '../../data/generated-skills_tlh.csv');
const SKILL_CSV_NAME = `manage musical staff ${testHelper.testRunID}`;
const SKILL_DUPLICATE = `abap ${testHelper.testRunID}`;
const SKILL_TOO_LONG_NAME = `too long name orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lore${testHelper.testRunID}`;
const SKILL_TOO_LONG_DESCRIPTION = `too long description ${testHelper.testRunID}`;
// Needed for a commented out test that should be revised later on
// const SKILL_RESTRICTED = `restricted ${testHelper.testRunID}`;
const SKILL_NAME_DRAFT = '_testNameDraft';
const SKILL_DRAFT = SKILL_NAME_DRAFT + SKILL_CSV_NAME;
const SKILL_NAME_ACTIVE = 'testNameActive_';
const SKILL_ACTIVE = SKILL_NAME_ACTIVE + SKILL_DRAFT;
const SKILL_LANGUAGE_EN = 'en';
const SKILL_LANGUAGE_DE = 'de';
const SKILL_CSV_NAME_DE = `de manage musical staff ${testHelper.testRunID}`;

const skillNameTable = element(by.id('skill::SkillsObjectPage--fe::table::texts::LineItem'));
const rowsOfSkillNameTable = skillNameTable.all(by.control({
  controlType: 'sap.m.ColumnListItem',
}));

const nameInput = rowsOfSkillNameTable.get(0).element(by.control({
  controlType: 'sap.m.Input',
  bindingPath: {
    propertyPath: 'name',
  },
}));

// upload data that actually will be uploaded and needs to be cleaned up
const skills = getCSVData(testHelper.testRunID);
const skillsDe = getCSVDataDE(testHelper.testRunID);
const duplicateSkills = getDuplicateCSVData(testHelper.testRunID);
const wrongUsageData = getWrongUsageData(testHelper.testRunID);
const wrongConceptTypeSkill = getWrongConceptTypeCSVData(testHelper.testRunID);
const missingSkillTypeSkill = getMissingSkillTypeCSVData(testHelper.testRunID);

// upload data that is not expected to even be a draft, so no cleanup
const tooLongNameSkill = getTooLongNameCSVData(testHelper.testRunID);
const tooLongDescriptionSkill = getTooLongDescriptionCSVData(testHelper.testRunID);
const evilSkill = getEvilSkillCSVData(testHelper.testRunID);
const forbiddenFirstCharacterSkill = getForbiddenFirstCharacterSkillCSVData(testHelper.testRunID);

const SKILL_CSV_NAMES = skills.map((skill) => skill.preferredLabel);
const catalogsWithTestRunIDs = addTestRunIDToCatalogs([allCatalogs.programmingCatalog, allCatalogs.musicCatalog, allCatalogs.otherCatalog]);

let skillRepository = null;
let catalogRepository = null;
let csvWriter = null;

describeTestCase(MarkdownTables.UPLOAD_SKILLS, 'SkillUploadJourney', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    skillRepository = await testEnvironment.getSkillRepository();
    catalogRepository = await testEnvironment.getCatalogRepository();
    csvWriter = testEnvironment.getCsvWriter();
  }

  async function insertData() {
    // setup catalog test data
    await catalogRepository.insertMany(catalogsWithTestRunIDs, EntityDraftMode.ACTIVE_ONLY);
  }

  async function deleteData() {
    const uploadedEntities = [...skills, ...skillsDe, ...duplicateSkills, ...wrongUsageData, ...wrongConceptTypeSkill, ...missingSkillTypeSkill, ...forbiddenFirstCharacterSkill, ...evilSkill];
    const createdEntities = [
      ...uploadedEntities.map((csvSkill) => ({ name: csvSkill.preferredLabel })),
      { name: SKILL_ACTIVE },
    ];
    await skillRepository.deleteManyByData(createdEntities);
    await catalogRepository.deleteManyByData(catalogsWithTestRunIDs);
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
  // Simple upload
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
    'Click on the "Manage Skill" tile',
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
    'Open upload page',
    'Choose "Upload".',
    'The upload page with the "File" and "Language" input fields and the "Upload Skill CSV File" button is displayed.',
    () => {
      it('should open the upload dialog', () => {
        SkillListReport.buttons.upload.click();
        FLP.waitForInitialAppLoad('application-Skill-Upload-component---app--uploadButton');
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Language derivation from file name',
    'Enter a file with a name that ends with an underscore followed by a language code (example: skills_valid_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip)).',
    'The correct language code is displayed in the "Language" field.',
    () => {
      it('should derive locale from skill csv', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, skills);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        expect(SkillUploadApp.fileUploadForm.languageInput.asControl().getProperty('value')).toBe(SKILL_LANGUAGE_EN);
      });
    },
  );

  step(
    'Upload valid CSV file',
    'Enter a valid CSV file (example: skills_valid_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip)).',
    'The skills are uploaded successfully and a success message is displayed.',
    () => {
      it('should upload the csv', async () => {
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Success');
      });
    },
  );

  step(
    'Validate uploaded skills',
    'Go back to the list report and search for the uploaded skills. Check the number of uploaded skills, their names, and the catalogs assigned to them.',
    'All skills have been created as expected.',
    () => {
      it('should search for the uploaded skills', async () => {
        FLP.header.backButton.click();
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);

        const tableID = 'skill::SkillsListReport--fe::table::Skills::LineItem-innerTable';

        const table = element(by.id(tableID));
        const tableRows = table.all(by.control({
          controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRows = tableRows.count();

        expect(noOfRows).toBe(3);
      });

      it('should see the uploaded Skills in the list', () => {
        assertExistenceOfSkills(skills);
      }, browser.testrunner.config.params.longSpecTimeoutMs);

      it('should see assigned catalogs in catalog facet', () => {
        SkillListReport.skillListEntry(SKILL_CSV_NAME).click();
        expect(SkillObjectPage.catalogs.catalogSemanticLink(catalogsWithTestRunIDs[1].name).isPresent()).toBeTruthy('Catalog assignment is present');
      });
    },
  );

  step(
    'Edit skill',
    'Open the object page of an uploaded skill and choose "Edit". Change the skill name.',
    'The "Save" button is displayed.',
    () => {
      it('should maintain / change an existing skill without saving it', async () => {
        SkillObjectPage.header.editButton.click();
        nameInput.sendKeys(protractor.Key.HOME + SKILL_NAME_DRAFT);
        expect(SkillObjectPage.footer.saveButton.isPresent()).toBeTruthy();
        await SkillObjectPage.footer.waitForDraftSavedIndicator();
      });
    },
  );

  step(
    'Validate skill draft on the List Report',
    'Click on the back button to navigate back to the List Report. When asked, keep the draft.',
    'The skill is displayed in draft status with the changed name.',
    () => {
      it('should check if the maintained skill is up to date in the draft state', () => {
        FLP.header.backButton.click();
        SkillObjectPage.keepDraftChangesDialog.keepDraftButton.click();
        SkillObjectPage.keepDraftChangesDialog.okButton.click();
        expect(SkillListReport.skillListEntry(SKILL_DRAFT).isPresent()).toBeTruthy();
        expect(SkillListReport.skillListDraftMarker(SKILL_DRAFT).isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Edit maintained skill again',
    'Click on the skill draft, change the name and choose "Save".',
    'The "Save" button is no longer displayed.',
    () => {
      it('should edit the just maintained again and save it', () => {
        SkillListReport.skillListEntry(SKILL_DRAFT).click();
        nameInput.sendKeys(protractor.Key.HOME + SKILL_NAME_ACTIVE);
        expect(SkillObjectPage.footer.saveButton.isPresent()).toBeTruthy('Save Button present');
      });

      it('should save the maintained skill', () => {
        SkillObjectPage.footer.saveButton.click();
        expect(SkillObjectPage.footer.saveButton.isPresent()).toBeFalsy();
        expect(SkillObjectPage.header.editButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Validate maintained skill',
    'Go back to the list report.',
    'The maintained skill is active.',
    () => {
      it('should see the activated skill on the List Report', () => {
        FLP.header.backButton.click();
        expect(SkillListReport.skillListEntry(SKILL_ACTIVE).isPresent()).toBeTruthy();
        expect(SkillListReport.skillListDraftMarker(SKILL_ACTIVE).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Open upload page',
    'Choose "Upload".',
    'The upload page with the "File" and "Language" input fields and the "Upload Skill CSV File" button is displayed.',
    () => {
      it('should open the upload dialog', () => {
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Language derivation from file name',
    'Enter a file with a language code other than the previous one at the end of its name (example: skills_valid_de.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip)).',
    'The correct locale is displayed in the "Language" field.',
    () => {
      it('should open the upload dialog and derive locale from skill csv', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH_DE, skillsDe);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH_DE);
        expect(SkillUploadApp.fileUploadForm.languageInput.asControl().getProperty('value')).toBe(SKILL_LANGUAGE_DE);
      });
    },
  );

  step(
    'Upload valid CSV file',
    'Enter a valid CSV file in another language (example: skills_valid_de.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip)).',
    'The skills are uploaded successfully and a success message is displayed.',
    () => {
      it('should upload the csv', async () => {
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Success');
      });
    },
  );

  step(
    'Validate uploaded skills for several languages',
    'Go back to the list report. Click on an active skill that was successfully uploaded in the previous step and check whether the "Skill" section contains entries in two different languages.',
    'On the object page, the table in the "Skill" section contains entries in the two uploaded languages.',
    () => {
      it('should check language english and german', async () => {
        FLP.header.backButton.click();
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        SkillListReport.skillListEntry(SKILL_ACTIVE).click();
        const skillListRowEN = SkillObjectPage.skill.skillListRow(SKILL_ACTIVE);
        const skillListRowDE = SkillObjectPage.skill.skillListRow(SKILL_CSV_NAME_DE);
        expect(SkillObjectPage.skill.localeText(skillListRowEN, SKILL_LANGUAGE_EN).isPresent()).toBeTruthy();
        expect(SkillObjectPage.skill.localeText(skillListRowDE, SKILL_LANGUAGE_DE).isPresent()).toBeTruthy();
        FLP.header.backButton.click();
      });
    },
  );

  //--------------------------------------------
  // Simple upload - negative test
  //--------------------------------------------
  step(
    'CSV file in nonexistent language',
    'Navigate to the upload page and enter a valid CSV file in a language that doesn\'t exist. You can use skills_non_existent_language_tlh.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example. Choose "Upload".',
    'The upload fails and an error message is displayed.',
    () => {
      it('should open the upload dialog', () => {
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });

      it('should upload the csv with non existing language', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH_TLH, skills);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH_TLH);
        await AsyncUploadHelper.performUploadSafe();
        expect(SkillUploadApp.messageStrip.getCurrentWithoutUploadJob().asControl().getProperty('type')).toBe('Error');
      });
    },
  );

  step(
    'Skills with same concept URI',
    'Create a CSV file containing two skills with the same concept URI (column: "conceptUri"). You can use skills_same_concept_uri_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example. Navigate to the upload page and enter the CSV file you have created. Choose "Upload". Navigate back to the list report.',
    'The upload is successful and the uploaded skills are displayed in the list report.',
    () => {
      it('should upload the csv which contains a corrupt skill', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, duplicateSkills);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Success');
      });

      it('should see the uploaded skill in the list', async () => {
        FLP.header.backButton.click();
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        expect(SkillListReport.skillListEntry(SKILL_DUPLICATE).isPresent()).toBeTruthy(SKILL_DUPLICATE);
        expect(SkillListReport.skillListDraftMarker(SKILL_DUPLICATE).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Skill name too long',
    'Navigate to the upload page. Upload a CSV file containing a skill name that is too long (more than 256 characters). You can use skills_name_to_long_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example. Go back to the list report.',
    'A message strip containing a warning is displayed on the upload page. The skill with the name exceeding the character limit is not displayed in the list report.',
    () => {
      it('should open the upload dialog', () => {
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });

      it('should upload the csv', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, tooLongNameSkill);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
      });

      it('should see the uploaded skills with too long name in the list', () => {
        FLP.header.backButton.click();
        expect(SkillListReport.skillListEntry(SKILL_TOO_LONG_NAME).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Skill description too long',
    'Navigate to the upload page. Upload a CSV file containing a skill description that is too long (more than 4000 characters). You can use skills_description_to_long_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example. Go back to the list report.',
    'A message strip containing a warning is displayed on the upload page. The skill with the description exceeding the character limit is not displayed in the list report.',
    () => {
      it('should open the upload dialog', () => {
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });

      it('should upload the csv', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, tooLongDescriptionSkill);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
      });

      it('should see the uploaded skills with too long description in the list', () => {
        FLP.header.backButton.click();
        expect(SkillListReport.skillListEntry(SKILL_TOO_LONG_DESCRIPTION).isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Skill with invalid usage value',
    'Navigate to the upload page. Upload a CSV file with an invalid value in the column "usage" (e.g."xyz"). You can use skills_invalid_usage_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example.',
    'A message strip containing a warning is displayed on the upload page.',
    () => {
      it('should open the upload dialog', () => {
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });

      it('should not be possible to upload the csv with an invalid usage value successfully', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, wrongUsageData);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
      });
    },
  );

  step(
    'HTML tag in concept URI',
    'Navigate to the upload page. Upload a CSV file with a skill concept URI containing an HTML tag (for example, ```<html>```). You can use skills_conceptUri_html_tag_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example.',
    'A message strip containing a warning is displayed on the upload page.',
    () => {
      it('should not be possible to upload the csv with an evil script tag in the concept uri successfully', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, evilSkill);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
      });
    },
  );

  step(
    'Forbidden first characters in skill description',
    'Navigate to the upload page. Upload a CSV file with a skill description containing a forbidden first character (@, +, -, =). You can use skills_description_forbidden_first_character_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example.',
    'A message strip containing a warning is displayed on the upload page.',
    () => {
      it('should not be possible to upload the csv with a forbidden first character in the skill description, successfully', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, forbiddenFirstCharacterSkill);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
      });
    },
  );

  step(
    'Concept type other than "KnowledgeSkillCompetence"',
    'Navigate to the upload page. Upload a CSV file with a concept type other than "KnowledgeSkillCompetence". You can use skills_conceptType_invalid_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example.',
    'A message strip containing a warning is displayed on the upload page.',
    () => {
      it('should open the upload dialog', () => {
        FLP.header.backButton.click();
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });

      it('should not be possible to upload the csv with a wrong concept type successfully', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, wrongConceptTypeSkill);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
      });
    },
  );

  step(
    'Empty skill type',
    'Navigate to the upload page. Upload a CSV file with an empty skill type. You can use skills_empty_skilltype_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example.',
    'A message strip containing a warning is displayed on the upload page.',
    () => {
      it('should open the upload dialog', () => {
        FLP.header.backButton.click();
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });

      it('should not be possible to upload the csv with an empty skill type successfully', async () => {
        await csvWriter.createCsvFile(SKILL_CSV_PATH, missingSkillTypeSkill);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Warning');
        FLP.header.backButton.click();
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

function addTestRunIDToCatalogs(aCatalogs) {
  return aCatalogs.map((oCatalog) => ({
    ...oCatalog,
    name: oCatalog.name + testHelper.testRunID,
    description: oCatalog.description + testHelper.testRunID,
  }));
}

function assertExistenceOfSkills(skillsToCheck) {
  SkillListReport.buttons.showDetails(undefined).click();
  for (const skillName of SKILL_CSV_NAMES) {
    const skillListRow = SkillListReport.skillListRow(skillName);
    const lifecycleStatusField = SkillListReport.lifecycleStatusField(skillListRow, 'Unrestricted');
    expect(SkillListReport.skillListEntry(skillName).isPresent()).toBeTruthy(skillName);
    expect(lifecycleStatusField.isPresent()).toBeTruthy();
  }
  SkillListReport.buttons.hideDetails(undefined).click();

  for (const skill of skillsToCheck) {
    SkillListReport.skillListEntry(skill.preferredLabel).click();

    expect(SkillObjectPage.skill.nameText(skill.preferredLabel).isPresent()).toBeTruthy();
    expect(SkillObjectPage.skill.descriptionText(skill.description).isPresent()).toBeTruthy();

    for (const alternativeName of skill.altLabels.split('\n')) {
      expect(SkillObjectPage.alternativeNames.alternativeNameText(alternativeName).isPresent()).toBeTruthy();
    }
    FLP.header.backButton.click();
  }
}
