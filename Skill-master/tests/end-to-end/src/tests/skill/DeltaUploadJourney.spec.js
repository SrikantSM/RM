const path = require('path');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const { getDeltaUploadInitialCsvData, getDeltaUploadUpdatedCsvData } = require('../../data/SkillUploadCsv');
const FLP = require('../../../../uiveri5-pages/FLP');
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillObjectPage = require('../../../../uiveri5-pages/SkillObjectPage');
const SkillUploadApp = require('../../../../uiveri5-pages/SkillUploadApp');
const AsyncUploadHelper = require('../../../../uiveri5-pages/AsyncUploadHelper');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');
const MarkdownTables = require('../../utils/MarkdownTables');

const initialSkills = getDeltaUploadInitialCsvData(testHelper.testRunID);
const updatedSkills = getDeltaUploadUpdatedCsvData(testHelper.testRunID);

const skillCsvPath = path.resolve(__dirname, '../../data/generated-skills_en.csv');

let csvWriter = null;
let skillRepository = null;

describeTestCase(MarkdownTables.DELTA_UPLOAD, 'DeltaUploadJourney', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    csvWriter = testEnvironment.getCsvWriter();
    skillRepository = await testEnvironment.getSkillRepository();
  }

  async function deleteData() {
    const createdEntities = [...initialSkills, ...updatedSkills].map((csvSkill) => ({ name: csvSkill.preferredLabel }));
    await skillRepository.deleteManyByData(createdEntities);
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
    'Open upload page',
    'Choose "Upload".',
    'The upload page with the "File" and "Language" input fields and the "Upload Skill CSV File" button is displayed.',
    () => {
      it('should go to skill upload app', () => {
        SkillListReport.buttons.upload.click();
        FLP.waitForInitialAppLoad('application-Skill-Upload-component---app--uploadButton');
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Upload skills',
    'Choose "Browse", select a CSV file with skills in the default language (example: skills_valid_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip)). Enter the default language in the "Language" field and choose "Upload Skill CSV File".',
    'A message strip with the status of the upload is displayed.',
    () => {
      it('should upload the csv with the initial skills', async () => {
        await csvWriter.createCsvFile(skillCsvPath, initialSkills);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(skillCsvPath);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Success');
        FLP.header.backButton.click();
      });
    },
  );

  step(
    'Search for uploaded skills',
    'Go back to the list report. In the search field, enter a skill name from the file you have just uploaded and choose "Go".',
    'The skill is displayed in the list report.',
    () => {
      it('should see the initially uploaded Skills in the list', async () => {
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        assertExistenceOfSkills(initialSkills);
      }, browser.testrunner.config.params.longSpecTimeoutMs);
    },
  );

  step(
    'Open upload page again',
    'Choose "Upload".',
    'The upload page with the "File" and "Language" input fields and the "Upload Skill CSV File" button is displayed.',
    () => {
      it('should go to skill upload app', () => {
        SkillListReport.buttons.upload.click();
        expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Delta upload',
    'Select a CSV file containing an entry to enhance a successfully uploaded skill as well as an additional valid entry for a new skill. (You can enhance a skill by modifying a description, name, or alternative name in the file you just uploaded.) You can use skills_delta_upload_en.csv in [skills_upload_csvs.zip](Data/skills_upload_csvs.zip) as an example. Enter the default language and choose "Upload Skill CSV File".',
    'A success message is displayed.',
    () => {
      it('should upload the csv with the updated skills', async () => {
        await csvWriter.createCsvFile(skillCsvPath, updatedSkills);
        SkillUploadApp.fileUploadForm.fileInput.sendKeys(skillCsvPath);
        await AsyncUploadHelper.performUploadSafe();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Success');
        FLP.header.backButton.click();
      });
    },
  );

  step(
    'Validate in list report',
    'Go back to the list report.',
    'The changes you have uploaded are reflected in the list report.',
    () => {
      it('should see the updated Skills in the list', async () => {
        await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
        assertExistenceOfSkills(updatedSkills);
      }, browser.testrunner.config.params.longSpecTimeoutMs);
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

function assertExistenceOfSkills(skills) {
  for (const skill of skills) {
    SkillListReport.skillListEntry(skill.preferredLabel).click();

    expect(SkillObjectPage.skill.nameText(skill.preferredLabel).isPresent()).toBeTruthy();
    expect(SkillObjectPage.skill.descriptionText(skill.description).isPresent()).toBeTruthy();

    for (const alternativeName of skill.altLabels.split('\n')) {
      expect(SkillObjectPage.alternativeNames.alternativeNameText(alternativeName).isPresent()).toBeTruthy();
    }

    FLP.header.backButton.click();
  }
}
