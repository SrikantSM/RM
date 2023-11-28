const path = require('path');
const SkillListReport = require('../../uiveri5-pages/SkillListReport');
const SkillObjectPage = require('../../uiveri5-pages/SkillObjectPage');
const SkillUploadApp = require('../../uiveri5-pages/SkillUploadApp');
const FLP = require('../../uiveri5-pages/FLP');
const AsyncUploadHelper = require('../../uiveri5-pages/AsyncUploadHelper');
const FilterBarHelper = require('../../uiveri5-pages/FilterBarHelper');

const getSkillUploadCsvData = require('../data/SkillUploadCsv');
const getProficiencySetData = require('../data/ProficiencySets');

function executeTest(testHelper) {
  const skills = getSkillUploadCsvData(testHelper.testRunID);
  const SKILL_LANGUAGE = 'en';
  const SKILL_CSV_NAMES = skills.map((skill) => skill.preferredLabel);
  const SKILL_DESCRIPTION = `testDescription ${testHelper.testRunID}`;
  const SKILL_LABEL = `testLabel ${testHelper.testRunID}`;
  const DRAFT_SKILL_DESCRIPTION = `testDraftDescription ${testHelper.testRunID}`;
  const DRAFT_SKILL_LABEL = `testDraftLabel ${testHelper.testRunID}`;

  const SKILL_CSV_PATH = path.resolve(__dirname, '../data/small_skills_en.csv');

  const CREATED_SKILLS = [...SKILL_CSV_NAMES, SKILL_LABEL, DRAFT_SKILL_LABEL];

  const proficiencySetData = getProficiencySetData(testHelper.testRunID);

  testHelper.loginWithRole('ConfigurationExpert');

  it('should navigate to the Skill App', () => {
    FLP.tiles.skill.click();
    FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
    expect(SkillListReport.skillList.isPresent()).toBeTruthy();
  });

  it('should filter the list via the testRunId', async () => {
    await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);
  });

  it('should contain created skills', () => {
    for (const skill of testHelper.testData.skill.skills) {
      expect(SkillListReport.skillListEntry(skill.name).isPresent()).toBeTruthy(skill.name);
    }
  });

  it('should open skill create dialog', () => {
    SkillListReport.buttons.create.click();
    expect(SkillObjectPage.createDialog.dialogControl.isPresent()).toBeTruthy();
  });

  it('should create a skill through the dialog', () => {
    SkillObjectPage.createDialog.descriptionInput.sendKeys(SKILL_DESCRIPTION);
    SkillObjectPage.createDialog.labelInput.sendKeys(SKILL_LABEL);
    SkillObjectPage.createDialog.createButton.click();

    SkillObjectPage.skill.proficiencySetInput().sendKeys(proficiencySetData.correctProficiencySet.name);
    expect(SkillObjectPage.footer.saveButton.isPresent()).toBeTruthy();
  });

  it('should see the created skill on the List Report', () => {
    FLP.header.backButton.click();
    SkillObjectPage.keepDraftChangesDialog.keepDraftButton.click();
    SkillObjectPage.keepDraftChangesDialog.okButton.click();
    expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
    expect(SkillListReport.skillListDraftMarker(SKILL_LABEL).isPresent()).toBeTruthy();
  });

  it('should activate the skill', () => {
    SkillListReport.skillListEntry(SKILL_LABEL).click();
    SkillObjectPage.footer.saveButton.click();
    expect(SkillObjectPage.header.editButton.isPresent()).toBeTruthy();
  });

  it('should see the activated skill on the List Report', () => {
    FLP.header.backButton.click();
    expect(SkillListReport.skillListEntry(SKILL_LABEL).isPresent()).toBeTruthy();
    expect(SkillListReport.skillListDraftMarker(SKILL_LABEL).isPresent()).toBeFalsy();
  });

  it('should go to skill upload app', () => {
    SkillListReport.buttons.upload.click();
    FLP.waitForInitialAppLoad('application-Skill-Upload-component---app--uploadButton');
    expect(SkillUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
  });

  it('should derive locale from skill csv', () => {
    SkillUploadApp.fileUploadForm.fileInput.sendKeys(SKILL_CSV_PATH);
    expect(SkillUploadApp.fileUploadForm.languageInput.asControl().getProperty('value')).toBe(SKILL_LANGUAGE);
  });

  it('should upload the csv', async () => {
    await AsyncUploadHelper.performUploadSafe();
    await AsyncUploadHelper.assertMessageStripTypeSafe('Success');
  });

  it('should see the uploaded Skills in the list', async () => {
    FLP.header.homeButton.click();
    FLP.tiles.skill.click();

    await FilterBarHelper.searchFor(SkillListReport.filterBar, testHelper.testRunID);

    for (const skillName of SKILL_CSV_NAMES) {
      expect(SkillListReport.skillListEntry(skillName).isPresent()).toBeTruthy(skillName);
    }
  });

  it('should create a draft skill for negative tests', () => {
    SkillListReport.buttons.create.click();
    SkillObjectPage.createDialog.descriptionInput.sendKeys(DRAFT_SKILL_DESCRIPTION);
    SkillObjectPage.createDialog.labelInput.sendKeys(DRAFT_SKILL_LABEL);
    SkillObjectPage.createDialog.createButton.click();

    SkillObjectPage.skill.proficiencySetInput().sendKeys(proficiencySetData.correctProficiencySet.name);
    FLP.header.backButton.click();
    SkillObjectPage.keepDraftChangesDialog.keepDraftButton.click();
    SkillObjectPage.keepDraftChangesDialog.okButton.click();

    expect(SkillListReport.skillListEntry(DRAFT_SKILL_LABEL).isPresent()).toBeTruthy();
    expect(SkillListReport.skillListDraftMarker(DRAFT_SKILL_LABEL).isPresent()).toBeTruthy();
  });

  it('should get IDs of created skills (and labels) to allow their deletion', async () => {
    const skillRepository = await testHelper.utils.getSkillRepository();
    const createdEntities = CREATED_SKILLS.map((name) => ({ name }));
    const activeSkills = await skillRepository.selectAllByData(createdEntities, 1);
    const draftSkills = (await skillRepository.selectAllByData(createdEntities, 0)).map((s) => ({ ...s, draft: true }));
    // format and attach to skill testData
    testHelper.testData.skill.skills = [...testHelper.testData.skill.skills, ...activeSkills, ...draftSkills];
  });

  testHelper.logout();
}

module.exports.executeTest = executeTest;
