const FLP = require('../../../../uiveri5-pages/FLP');
const { filterBar, skillListRows, skillListRow } = require('../../../../uiveri5-pages/SkillListReport');

const searchTerm = 'Skill Name 29';
const skillName = 'Skill Name 29 en';

module.exports = class SkillSearch {
  constructor(supaHelper, testRunId) {
    this.supaHelper = supaHelper;
    this.testRunId = testRunId;
  }

  executeTest() {
    it('Skill tile should be present', async () => {
      expect(await FLP.tiles.skill.isPresent()).toBe(true);
    });

    // --- Scenario 2: Skill Search ---

    // 1. Log in as Configuration Expert => The SAP Fiori launchpad appears on the screen with a list of Fiori tiles for the configuration expert.
    // 2. Open the Manage Skills app => App should get opened. The system displays a list of skills.
    it('should open the Manage Skills app', async () => {
      await FLP.tiles.skill.click();
      await FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
    });

    // 3. Enter the search term "Skill Name 29" in the search field
    it('Enter the search term "Skill Name 29" in the search field', async () => {
      // Filter bar helper not used as the go button click action needs to be measured individually
      if (await filterBar.expandButton.isPresent()) {
        await filterBar.expandButton.click();
      }
      await filterBar.searchField.sendKeys(searchTerm);
      expect(await filterBar.searchField.asControl().getProperty('value')).toEqual(searchTerm);
    });

    // 4. MEASURE: Press enter to start the search => Only one Skill should be visible
    it('Press enter to start the search', async () => {
      await this.supaHelper.measureIfRequired('0210_SkillSearch_Press enter to start the search', async () => {
        await filterBar.goButton.click();
      });
      await expect(skillListRows.count()).toBe(1);
      expect(await skillListRow(skillName).isPresent()).toBeTruthy(`Skill with name ${skillName} should be present`);
    });

    it('should go to shell home', async () => {
      await FLP.header.homeButton.click();
    });
  }
};
