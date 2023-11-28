const uuid = require('uuid').v4;
const SkillListReport = require('../../../../uiveri5-pages/SkillListReport');
const SkillDownloadApp = require('../../../../uiveri5-pages/SkillDownloadApp');
const testEnvironment = require('../../utils');
const testHelper = require('../../utils/TestHelper');
const { describeTestCase, step } = require('../../utils/TestExecutor');
const FLP = require('../../../../uiveri5-pages/FLP');
const TestHelper = require('../../utils/TestHelper');
const allSkills = require('../../data/Skills');
const allSkillsTexts = require('../../data/SkillsTexts');
const allProficiencySets = require('../../data/ProficiencySets');
const allProficiencyLevels = require('../../data/ProficiencyLevels');
const allProficiencyLevelTexts = require('../../data/ProficiencyLevelTexts');

const MarkdownTables = require('../../utils/MarkdownTables');

const SKILL_LANGUAGE = 'en';

let skillRepository;
let skillTextRepository;
let languageRepository;
let proficiencySetRepository;

let langCode = null;
let notExistingLangCode = null;
const usedSkills = [];
const usedSkillsTexts = [];
const usedProfLevels = [];
const usedProfLevelTexts = [];

const usedLanguageCodes = ['en', 'de', 'es', 'fr', 'ru', 'pt', 'ja', 'zh'];

// Use random language to avoid conflicts with other tests
do {
  langCode = Math.random().toString(36).substring(2, 4);
} while (usedLanguageCodes.includes(langCode));

do {
  notExistingLangCode = Math.random().toString(36).substring(2, 4);
} while (usedLanguageCodes.includes(notExistingLangCode));

const existingRandomLanguage = {
  code: langCode,
};

const correctProficiencySet = {
  ...allProficiencySets.correctProficiencySet,
  name: allProficiencySets.correctProficiencySet.name + testHelper.testRunID,
  description: allProficiencySets.correctProficiencySet.description + testHelper.testRunID,
};

const correctProficiencyLevel1 = {
  ...allProficiencyLevels.correctProficiencyLevelOne,
  name: allProficiencyLevels.correctProficiencyLevelOne.name + testHelper.testRunID,
  description: allProficiencyLevels.correctProficiencyLevelOne.description + testHelper.testRunID,
};

const correctProficiencyLevel2 = {
  ...allProficiencyLevels.correctProficiencyLevelTwo,
  name: allProficiencyLevels.correctProficiencyLevelTwo.name + testHelper.testRunID,
  description: allProficiencyLevels.correctProficiencyLevelTwo.description + testHelper.testRunID,
};

const correctProficiencyLevel1Text = {
  ...allProficiencyLevelTexts.correctProficiencyLevelOneText,
  name: allProficiencyLevels.correctProficiencyLevelOne.name + testHelper.testRunID,
  description: allProficiencyLevels.correctProficiencyLevelOne.description + testHelper.testRunID,
};

const correctProficiencyLevel2Text = {
  ...allProficiencyLevelTexts.correctProficiencyLevelTwoText,
  name: allProficiencyLevels.correctProficiencyLevelTwo.name + testHelper.testRunID,
  description: allProficiencyLevels.correctProficiencyLevelTwo.description + testHelper.testRunID,
};

const correctSkill = {
  ...allSkills.correctSkill,
  ID: uuid(),
  externalID: uuid(),
  name: allSkills.correctSkill.name + testHelper.testRunID,
  description: allSkills.correctSkill.description + testHelper.testRunID,
  proficiencySet_ID: correctProficiencySet.ID,
};

const correctSkillText = {
  ...allSkillsTexts.correctSkillText,
  ID_texts: uuid(),
  ID: correctSkill.ID,
  name: correctSkill.name,
  description: correctSkill.description,
  locale: langCode,
};

const multiLanguageSkill = {
  ...allSkills.multiLanguageSkill,
  name: allSkills.multiLanguageSkill.name + TestHelper.testRunID,
  description: allSkills.multiLanguageSkill.description + TestHelper.testRunID,
  proficiencySet_ID: correctProficiencySet.ID,
};

const multiLanguageSkillText0 = {
  ...allSkillsTexts.multiLanguageSkillText0,
  name: allSkillsTexts.multiLanguageSkillText0.name + TestHelper.testRunID,
  description: allSkillsTexts.multiLanguageSkillText0.description + TestHelper.testRunID,
  locale: langCode,
};

const multiLanguageSkillText1 = {
  ...allSkillsTexts.multiLanguageSkillText1,
  name: allSkillsTexts.multiLanguageSkillText1.name + TestHelper.testRunID,
  description: allSkillsTexts.multiLanguageSkillText1.description + TestHelper.testRunID,
  locale: SKILL_LANGUAGE,
};

describeTestCase(MarkdownTables.DOWNLOAD_SKILLS, 'SkillDownloadJourney', () => {
  /**
   * Setup test data
   */

  async function createRepository() {
    skillRepository = await testEnvironment.getSkillRepository();
    skillTextRepository = await testEnvironment.getSkillTextRepository();
    languageRepository = await testEnvironment.getLanguageRepository();
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async function insertData() {
    // Insert Skill with random language code
    usedSkills.push(correctSkill);
    usedSkillsTexts.push(correctSkillText);

    // Insert Skill with random language code and SKILL_LANGUAGE
    usedSkills.push(multiLanguageSkill);
    usedSkillsTexts.push(multiLanguageSkillText0);
    usedSkillsTexts.push(multiLanguageSkillText1);

    usedProfLevels.push(correctProficiencyLevel1);
    usedProfLevels.push(correctProficiencyLevel2);

    usedProfLevelTexts.push(correctProficiencyLevel1Text);
    usedProfLevelTexts.push(correctProficiencyLevel2Text);

    await proficiencySetRepository.insertOne(correctProficiencySet);
    await skillRepository.insertMany(usedSkills, 1);
    await skillTextRepository.insertMany(usedSkillsTexts, 1);
    await languageRepository.insertOne(existingRandomLanguage);
  }

  async function deleteData() {
    await skillRepository.deleteManyByData(usedSkills);
    await skillTextRepository.deleteManyByData(usedSkillsTexts);
    await languageRepository.deleteManyByData([existingRandomLanguage]);
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
  // Simple download
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
    'Open download page',
    'Choose "Download".',
    'The download page with the "Language" input field and the "Download Skills" button is displayed.',
    () => {
      it('should open the download dialog', () => {
        SkillListReport.buttons.download.click();
        FLP.waitForInitialAppLoad('application-Skill-Download-component---app--downloadButton');
        expect(SkillDownloadApp.fileDownloadForm.formControl.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Download without language details',
    'Choose "Download Skills" without specifying a language.',
    'The download fails and an error message is displayed.',
    () => {
      it('should download skills without setting a language', () => {
        SkillDownloadApp.fileDownloadForm.downloadButton.click();
        expect(SkillDownloadApp.messageStrip.getCurrent().isPresent()).toBeTruthy();
        expect(SkillDownloadApp.messageStrip.getCurrent().asControl().getProperty('type')).toBe('Error');
        expect(SkillDownloadApp.messageStrip.getCurrent().asControl().getProperty('text')).toBe('Please enter a language.');
      });
    },
  );

  step(
    'Download skills in default language',
    'Enter the default language in the "Language" field and choose "Download Skills".',
    'A CSV file is downloaded with all skills contained in the list report and a success message is displayed.',
    () => {
      it('should download at least one skill and skip at least one skill with random language code', () => {
        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(SKILL_LANGUAGE);
        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(protractor.Key.TAB); // send tab to dismiss value help to actually click the button
        SkillDownloadApp.fileDownloadForm.downloadButton.click();

        expect(SkillDownloadApp.messageStrip.getCurrent().isPresent()).toBeTruthy();
        expect(SkillDownloadApp.messageStrip.getCurrent().asControl().getProperty('type')).toBe('Warning');
        SkillDownloadApp.messageStrip
          .getCurrent()
          .asControl()
          .getProperty('text')
          .then((s) => {
            // Expect at least one skill downloaded and at least one skill skipped.
            const regex = /^[1-9][0-9]* of [1-9][0-9]* skills downloaded. [1-9][0-9]* skills? doe?s?n't exist in the selected language.$/;
            expect(s).toMatch(regex);
          });

        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(' '); // Required to clear the input after a successful download
        SkillDownloadApp.fileDownloadForm.languageInput.clear();
      });
    },
  );

  step(
    'Download skills in valid language other than default',
    'Enter a valid language other than the default language in the "Language" field and choose "Download Skills".',
    'A CSV file is downloaded with all skills that have an entry for the entered language in the "Skill" section of their object page. If there are skills that don\t exist in the selected language, a warning message is displayed.',
    () => {
      it('should download two skills with an existing random language code', () => {
        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(langCode);
        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(protractor.Key.TAB); // send tab to dismiss value help to actually click the button
        SkillDownloadApp.fileDownloadForm.downloadButton.click();

        expect(SkillDownloadApp.messageStrip.getCurrent().isPresent()).toBeTruthy();
        SkillDownloadApp.messageStrip
          .getCurrent()
          .asControl()
          .getProperty('text')
          .then((s) => {
            // Expect exact 2 skills downloaded
            const regex = /^2 of [1-9][0-9]* skills downloaded/;
            expect(s).toMatch(regex);
          });

        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(' '); // Required to clear the input after a successful download
        SkillDownloadApp.fileDownloadForm.languageInput.clear();
      });
    },
  );

  step(
    'Download skills in nonexistent language',
    'Enter a nonexistent language in the "Language" field and choose "Download Skills".',
    'The download fails and an error message is displayed.',
    () => {
      it('should download two skills with a non-existing random language code', () => {
        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(notExistingLangCode);
        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(protractor.Key.TAB); // send tab to dismiss value help to actually click the button
        SkillDownloadApp.fileDownloadForm.downloadButton.click();

        expect(SkillDownloadApp.messageStrip.getCurrent().isPresent()).toBeTruthy();
        SkillDownloadApp.messageStrip
          .getCurrent()
          .asControl()
          .getProperty('text')
          .then((s) => {
            const message = 'Enter a valid language code.';
            expect(s).toMatch(message);
          });

        SkillDownloadApp.fileDownloadForm.languageInput.sendKeys(' '); // Required to clear the input after a successful download
        SkillDownloadApp.fileDownloadForm.languageInput.clear();
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
