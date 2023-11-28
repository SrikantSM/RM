const FLP = require('../../../../uiveri5-pages/FLP');
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillObjectPage = require('../../../../uiveri5-pages/SkillObjectPage');
const FilterBarHelper = require('../../../../uiveri5-pages/FilterBarHelper');

const skillAlternativeNameTable = element(by.id('skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem-innerTable'));
const rowsOfAlternativeNameTable = skillAlternativeNameTable.all(by.control({
  controlType: 'sap.m.ColumnListItem',
}));

const SKILL_LANGUAGE = 'en';

module.exports = class MaintainSkill {
  constructor(supaHelper, testRunId) {
    this.supaHelper = supaHelper;
    this.testRunId = testRunId;
    this.skillName = `Skill Name ${testRunId} en`;
    this.newAlternativeName = `SUPA new alternative name ${testRunId}`;
  }

  executeTest() {
    it('Skill tile should be present', async () => {
      expect(await FLP.tiles.skill.isPresent()).toBe(true);
    });

    // --- Scenario 3: Maintain Skill ---

    // 1. Log in as Configuration Expert => The SAP Fiori launchpad appears on the screen with a list of Fiori tiles for the configuration expert.
    // 2. Open the Manage Skills app and navigate into the detail screen of a skill => Details of the skill should be visible
    it('should open the Manage Skills app and navigate into the detail screen of a skill', async () => {
      await FLP.tiles.skill.click();
      await FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
      await FilterBarHelper.searchFor(SkillListReport.filterBar, this.skillName);
      await SkillListReport.skillListEntry(this.skillName).click();
      expect(await SkillObjectPage.header.editButton.isPresent()).toBeTruthy('Edit Button should be visibile on Skill Object Page');
    });

    // 3. MEASURE: Press edit => Object Page should be switched into edit mode
    it('should switch the object page into edit mode', async () => {
      await this.supaHelper.measureIfRequired('0310_MaintainSkill_Press edit', async () => {
        await SkillObjectPage.header.editButton.click();
      });
      expect(await SkillObjectPage.footer.saveButton.isPresent()).toBeTruthy('Save Button should be present during edit mode');
    });

    // 4. Change existing content and add new alternative name
    it('should change existing content and add new alternative name', async () => {
      await SkillObjectPage.anchors.alternativeNamesAnchor.click();
      await SkillObjectPage.alternativeNames.createButton.click();

      await SkillObjectPage.alternativeNames.newAlternativeNameInput.sendKeys(this.newAlternativeName);

      // The language input appears on top but is fifth in the dom, therefore get(4)
      const nameLanguageInput = rowsOfAlternativeNameTable.get(4).element(by.control({
        controlType: 'sap.ui.mdc.Field',
        bindingPath: {
          propertyPath: 'language_code',
        },
      }));
      await nameLanguageInput.sendKeys(SKILL_LANGUAGE);
      expect(await SkillObjectPage.alternativeNames.alternativeNameInput(this.newAlternativeName).isPresent()).toBeTruthy();
    });

    // 5. MEASURE: Press Save => Object Page should be switched into read mode
    it('should press Save', async () => {
      await SkillObjectPage.anchors.skillAnchor.click();
      await SkillObjectPage.footer.waitForDraftSavedIndicator();
      await this.supaHelper.measureIfRequired('0320_MaintainSkill_Press Save', async () => {
        await SkillObjectPage.footer.saveButton.click();
      });
      expect(await SkillObjectPage.header.editButton.isPresent()).toBeTruthy('Object Page should be switched into read-only mode');
    });

    it('should go to shell home', async () => {
      await FLP.header.homeButton.click();
    });
  }
};
