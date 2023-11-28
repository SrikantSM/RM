const path = require('path');
const AsyncUploadHelper = require('../../../../uiveri5-pages/AsyncUploadHelper');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');
const FLP = require('../../../../uiveri5-pages/FLP');
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillUploadApp = require('../../../../uiveri5-pages/SkillUploadApp');
const { skillCsvGenerator } = require('../../utils');

const SKILL_LANGUAGE_EN = 'en';
const SKILL_UPLOAD_COUNT = 100;

module.exports = class SkillSearch {
  constructor(supaHelper, testRunId) {
    this.supaHelper = supaHelper;
    this.testRunId = testRunId;
  }

  executeTest() {
    it('Skill tile should be present', async () => {
      expect(await FLP.tiles.skill.isPresent()).toBe(true);
    });

    // --- Scenario 1: Upload Skills ---

    // 1. Log in as Configuration Expert => The SAP Fiori launchpad appears on the screen with a list of Fiori tiles for the configuration expert.
    // 2. MEASURE: Open the Manage Skills app => App should get opened. The system displays a list of skills.
    it('should open the Manage Skills app', async () => {
      await this.supaHelper.measureIfRequired('0110_UploadSkills_Open the Manage Skills app', async () => {
        await FLP.tiles.skill.click();
        await FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
      }, 3000);
    });

    // 3. MEASURE: Press the upload button => Should navigate to File Upload Screen
    it('should press the upload button', async () => {
      await this.supaHelper.measureIfRequired('0120_UploadSkills_Press the upload button', async () => {
        await SkillListReport.buttons.upload.click();
        await FLP.waitForInitialAppLoad('application-Skill-Upload-component---app--uploadButton');
      }, 3000);
      expect(await SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
    });

    // 4. Select the csv file for skill upload and enter language 'en' => The selected CSV should be visible in the file upload control
    it('should select the csv file for skill upload and enter language "en"', async () => {
      const csvPath = path.resolve(`${__dirname}/../../../generated-skills-${this.testRunId}_${SKILL_LANGUAGE_EN}.csv`);
      await skillCsvGenerator.generateCsvFile(this.testRunId, SKILL_UPLOAD_COUNT, csvPath);
      await SkillUploadApp.fileUploadForm.fileInput.sendKeys(csvPath);
    });

    // 5. MEASURE: Press upload selected file => Response message should be shown, saying that 3000 skills are in process.
    it('should press upload selected file', async () => {
      await this.supaHelper.measureIfRequired('0130_UploadSkills_Press upload selected file', async () => {
        await SkillUploadApp.fileUploadForm.uploadButton.click();
        this.uploadJobId = await SkillUploadApp.uploadJobId();
        await AsyncUploadHelper.assertMessageStripTypeSafe('Information', this.uploadJobId);
      }, 0);
    });

    // 6. MEASURE: Wait for the asynchronous file upload to finish => Response message should be shown, saying that 3000 skills are complete.
    it('should wait for the asynchronous file upload to finish', async () => {
      await this.supaHelper.measureIfRequired('0140_UploadSkills_Wait for the asynchronous file upload to finish', async () => {
        await AsyncUploadHelper.waitForUploadToFinish(1000, 100, jasmine.DEFAULT_TIMEOUT_INTERVAL);
        await AsyncUploadHelper.assertMessageStripTypeSafe('Success', this.uploadJobId);
      }, 0);
    });

    // 7. Check if the upload was successful at the Skill List Report => After success message, uploaded Skills should be visible (Hint: Search for testRunId of the generated skill CSV)
    it('should search for the uploaded skills', async () => {
      await FLP.header.backButton.click();
      await FilterBarHelper.filterFor(SkillListReport.filterBar, SkillListReport.filterBar.nameFilterField,
        `SUPA Preferred Label Upload Performance Test ${this.testRunId}/*`);

      expect(await element(by.control({
        controlType: 'sap.m.Title',
        properties: { text: `Skills (${SKILL_UPLOAD_COUNT})` },
      })).isPresent()).toBeTruthy('The correct number of skills was created');
    });

    it('should go to shell home', async () => {
      await FLP.header.homeButton.click();
    });
  }
};
